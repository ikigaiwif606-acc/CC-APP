/* Read-only attendance reports. The portal supplies only records allowed for the role. */
window.SyncAttendanceReports=(()=>{
  const DAY=86400000;
  const iso=d=>new Date(d).toISOString().slice(0,10);
  const shift=(date,days)=>iso(Date.parse(date+'T00:00:00Z')+days*DAY);
  function today(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const part=type=>parts.find(p=>p.type===type).value;return part('year')+'-'+part('month')+'-'+part('day')}
  const validDate=date=>typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))&&iso(Date.parse(date))===date;
  function period(mode,anchor){
    if(!validDate(anchor))anchor=today();const d=new Date(anchor+'T00:00:00Z');
    if(mode==='month'){const start=anchor.slice(0,7)+'-01',end=iso(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0));return {start,end,previous:iso(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()-1,1)),next:iso(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1))}}
    const start=shift(anchor,-((d.getUTCDay()+6)%7));return {start,end:shift(start,6),previous:shift(start,-7),next:shift(start,7)};
  }
  function compute(data,{mode='week',anchor=today(),service='all',instructor='all',now=Date.now()}={}){
    const range=period(mode,anchor),within=d=>validDate(d)&&d>=range.start&&d<=range.end;
    const sessions=(data?.sessions||[]).filter(s=>within(s.date)&&(service==='all'||s.service===service)&&(instructor==='all'||instructor==='unassigned'&&!s.instructorId||s.instructorId===instructor));
    const rows=sessions.map(s=>({...s,booked:0,checked:0,missed:0,pending:0,cancellations:0,participants:[],closed:!s.cancelled&&(s.completed||sessionStart(s.date,s.time)+3600000<=now)}));
    const index=new Map(rows.map(s=>[s.id,s])),bySlot=new Map(rows.map(s=>[[s.date,s.time,s.service].join('|'),s])),seen=new Set();
    for(const b of data?.bookings||[]){
      const key=b.memberId+'|'+b.id;if(seen.has(key))continue;seen.add(key);
      const s=b.sessionId?index.get(b.sessionId):bySlot.get([b.date,b.time,b.service].join('|'));if(!s)continue;
      const cancelled=b.cancelled||s.cancelled;if(cancelled){s.cancellations++;s.participants.push({...b,attendanceStatus:'Cancelled'});continue}
      s.booked++;if(b.checked)s.checked++;else if(s.closed)s.missed++;else s.pending++;
      s.participants.push({...b,attendanceStatus:b.checked?'Checked in':s.closed?'Not checked in':'Awaiting check-in'});
    }
    rows.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)||a.title.localeCompare(b.title));
    const active=rows.filter(s=>!s.cancelled),closed=active.filter(s=>s.closed),sum=(list,key)=>list.reduce((n,s)=>n+s[key],0),denominator=sum(closed,'booked');
    const totals={checked:sum(active,'checked'),booked:sum(active,'booked'),missed:sum(active,'missed'),pending:sum(active,'pending'),held:closed.length,cancelledClasses:rows.length-active.length,cancellations:sum(rows,'cancellations'),rate:denominator?Math.round(sum(closed,'checked')/denominator*100):null,settledBookings:denominator};
    const buckets=[];for(let start=range.start;start<=range.end;start=shift(start,mode==='month'?7:1)){const end=mode==='month'?[shift(start,6),range.end].sort()[0]:start,items=active.filter(s=>s.date>=start&&s.date<=end);buckets.push({start,end,checked:sum(items,'checked'),missed:sum(items,'missed')})}
    const services=['yoga','contrast'].map(service=>{const list=active.filter(s=>s.service===service),ended=list.filter(s=>s.closed),booked=sum(ended,'booked');return {service,checked:sum(list,'checked'),booked:sum(list,'booked'),missed:sum(list,'missed'),rate:booked?Math.round(sum(ended,'checked')/booked*100):null}});
    const unlinked=(data?.unlinked||[]).filter(a=>(instructor==='all'||instructor==='unassigned')&&within(a.date)&&(service==='all'||a.service===service));
    return {range,rows,totals,buckets,services,unlinked};
  }
  I18n.extend({
    'Reports':'出席報表','Attendance reports':'課程出席報表','Weekly':'每週','Monthly':'每月','Week containing':'選擇週內日期','Month':'月份',
    'This week':'本週','This month':'本月','Previous period':'上一期','Next period':'下一期','Attendance this week':'本週出席概況',
    'View reports':'查看報表','All instructors':'全部指導老師','All services':'全部服務','Check-ins':'報到人次','Attendance rate':'出席率',
    'Ended classes':'已結束課程','Not checked in':'未記錄報到','Ended classes only':'僅計算已結束課程','Recorded check-ins':'已記錄報到',
    'No ended bookings yet':'尚無已結束課程的預約','Awaiting check-in':'待報到','Cancelled classes':'已取消課程','Cancelled bookings':'已取消預約',
    'Attendance over time':'出席趨勢','Select a bar to filter the class list.':'選擇長條圖，可篩選對應日期的課程。',
    'Service breakdown':'各服務出席概況','Class attendance':'各課程出席紀錄','Show all dates':'顯示所有日期',
    'No classes in this period.':'此期間尚無課程。','Try another period or filter. Reports use recorded data only.':'請選擇其他期間或篩選條件。報表僅使用已記錄的資料。',
    'No recorded check-ins in this period.':'此期間尚無報到紀錄。','Class ended':'課程已結束','Upcoming / in progress':'尚未結束／進行中',
    'View attendance':'查看出席紀錄','Show more classes':'顯示更多課程','Export CSV':'匯出 CSV','Report downloaded.':'報表已下載。',
    'Club attendance across yoga and contrast therapy.':'查看瑜伽與冷熱交替療法的會館出席紀錄。',
    'Attendance for your assigned classes only.':'僅顯示你負責課程的出席紀錄。',
    'Rates exclude future classes and cancellations. A missing check-in does not confirm absence.':'出席率不計入尚未結束或已取消的課程。未記錄報到不代表確認缺席。',
    'Dates and class times use Taipei time.':'日期與課程時間皆以台北時間顯示。',
    'Historical check-ins without a linked class are excluded from class totals.':'未連結課程的舊報到紀錄，不計入課程統計。',
    'No participants recorded.':'尚無參與會員紀錄。','Check-in time':'報到時間','Bookings':'預約人次','in this period':'此期間',
    'Read attendance trends and class reports.':'查看出席趨勢與課程報表。'
  });
  const t=I18n.translate,e=escapeHTML,serviceName=s=>t(s==='yoga'?'Yoga':'Contrast Therapy');
  const date=d=>new Date(d+'T12:00:00+08:00').toLocaleDateString(I18n.language==='en'?'en-GB':'zh-TW',{day:'numeric',month:'short',timeZone:'Asia/Taipei'});
  const rate=n=>n===null?'—':n+'%';
  function create(api){
    let mode='week',anchor=today(),service='all',instructor='all',bucket=null,limit=20,scope=null;
    function ready(){const key=api.scope();if(!key)return false;if(key!==scope){scope=key;mode='week';anchor=today();service='all';instructor='all';bucket=null;limit=20}return true}
    const report=()=>compute(api.data(),{mode,anchor,service,instructor});
    const link=()=>api.isInstructor()?'#instructor-reports':'#admin-reports';
    const scopedRows=r=>bucket?r.rows.filter(s=>s.date>=bucket.start&&s.date<=bucket.end):r.rows;
    function compact(){if(!ready())return '';const r=compute(api.data(),{anchor:today()});return `<section class="attendance-quick" aria-label="${t('Attendance this week')}"><div><span>${t('Attendance this week')}</span><strong>${r.totals.checked} <small>${t('Check-ins')}</small></strong></div><div><span>${t('Attendance rate')}</span><strong>${rate(r.totals.rate)} <small>${t('Ended classes only')}</small></strong></div><a href="${link()}" ${api.isInstructor()?'data-instructor-nav':'data-staff-nav'}>${t('View reports')} →</a></section>`}
    function summary(r){return `<div class="report-metrics">${[['Check-ins',r.totals.checked,'Recorded check-ins'],['Attendance rate',rate(r.totals.rate),r.totals.rate===null?'No ended bookings yet':'Ended classes only'],['Ended classes',r.totals.held,'in this period'],['Not checked in',r.totals.missed,'Ended classes only']].map(([label,value,note],i)=>`<section class="report-metric ${i===0?'report-metric-primary':''}"><span>${t(label)}</span><strong>${value}</strong><small>${t(note)}</small></section>`).join('')}</div><div class="report-totals"><span>${t('Bookings')} <b>${r.totals.booked}</b></span><span>${t('Awaiting check-in')} <b>${r.totals.pending}</b></span><span>${t('Cancelled classes')} <b>${r.totals.cancelledClasses}</b></span><span>${t('Cancelled bookings')} <b>${r.totals.cancellations}</b></span></div>`}
    function chart(r){const max=Math.max(1,...r.buckets.map(b=>b.checked+b.missed));return `<section class="report-panel report-chart-panel"><h2>${t('Attendance over time')}</h2><p>${t('Select a bar to filter the class list.')}</p><div class="report-chart-legend"><span><i></i>${t('Checked in')}</span><span><i></i>${t('Not checked in')}</span></div><div class="report-chart" style="--columns:${r.buckets.length}">${r.buckets.map(b=>{const label=b.start===b.end?date(b.start):date(b.start)+'–'+date(b.end),selected=bucket?.start===b.start;return `<button class="report-chart-column" data-attendance="bucket" data-start="${b.start}" data-end="${b.end}" aria-pressed="${selected}" aria-label="${e(label)}: ${b.checked} ${t('Checked in')}, ${b.missed} ${t('Not checked in')}"><span class="report-chart-value">${b.checked+b.missed}</span><span class="report-chart-track"><span class="report-chart-stack" style="height:${(b.checked+b.missed)/max*100}%"><span class="report-chart-missed" style="flex:${b.missed}"></span><span class="report-chart-checked" style="flex:${b.checked}"></span></span></span><span class="report-chart-label">${e(label)}</span></button>`}).join('')}</div>${!r.totals.checked?`<p class="report-chart-empty">${t('No recorded check-ins in this period.')}</p>`:''}</section>`}
    function breakdown(r){return `<section class="report-panel report-services"><h2>${t('Service breakdown')}</h2>${r.services.filter(s=>(service==='all'||s.service===service)&&(!api.isInstructor()||api.services().includes(s.service))).map(s=>`<article class="${s.service}"><span class="report-service-icon">${icon(s.service==='yoga'?'yoga':'water')}</span><div><h3>${serviceName(s.service)}</h3><p>${s.checked} / ${s.booked} ${t('Checked in')}</p></div><strong>${rate(s.rate)}<small>${t('Attendance rate')}</small></strong></article>`).join('')}</section>`}
    function classList(r){const list=scopedRows(r);return `<section class="report-panel report-class-panel"><div class="report-section-heading"><div><h2 tabindex="-1">${t('Class attendance')} <small>${list.length}</small></h2>${bucket?`<p>${e(date(bucket.start))}–${e(date(bucket.end))}</p>`:''}</div>${bucket?`<button class="report-text" data-attendance="clear-bucket">${t('Show all dates')}</button>`:''}</div>${list.length?`<div class="report-class-list">${list.slice(0,limit).map(s=>`<article class="report-class-row ${s.cancelled?'report-class-cancelled':''}"><div class="report-class-title"><span>${e(date(s.date))} · ${e(s.time)}</span><h3>${e(t(s.title))}</h3><p>${serviceName(s.service)}${!api.isInstructor()?' · '+e(s.instructorName||t('Unassigned')):''}</p></div><div class="report-class-attendance"><strong>${s.checked}<small> / ${s.booked}</small></strong><span>${t('Checked in')}</span><small>${s.cancelled?t('Cancelled'):s.missed+' '+t('Not checked in')+' · '+s.pending+' '+t('Awaiting check-in')}</small></div><div class="report-class-rate"><strong>${rate(!s.cancelled&&s.closed&&s.booked?Math.round(s.checked/s.booked*100):null)}</strong><span>${t(s.cancelled?'Cancelled':s.closed?'Class ended':'Upcoming / in progress')}</span></div><button class="report-detail-button" data-attendance="details" data-id="${e(s.id)}">${t('View attendance')} ↗</button></article>`).join('')}</div>${list.length>limit?`<button class="button light report-show-more" data-attendance="more">${t('Show more classes')} (${list.length-limit})</button>`:''}`:`<div class="report-empty"><span>${api.icon()}</span><h3>${t('No classes in this period.')}</h3><p>${t('Try another period or filter. Reports use recorded data only.')}</p></div>`}</section>`}
    function page(){
      if(!ready())return '';const r=report(),staff=!api.isInstructor(),month=mode==='month';
      return `<div class="attendance-report"><section class="report-toolbar" aria-label="${t('Attendance reports')}"><div class="report-period-switch" role="group" aria-label="${t('Attendance reports')}">${[['week','Weekly'],['month','Monthly']].map(([id,label])=>`<button data-attendance="mode" data-mode="${id}" aria-pressed="${mode===id}">${t(label)}</button>`).join('')}</div><div class="report-period-controls"><button data-attendance="previous" aria-label="${t('Previous period')}">←</button><label><span>${t(month?'Month':'Week containing')}</span><input id="attendance-period" type="${month?'month':'date'}" value="${month?anchor.slice(0,7):anchor}"></label><button data-attendance="next" aria-label="${t('Next period')}">→</button><button class="report-text" data-attendance="current">${t(month?'This month':'This week')}</button></div><button class="button light report-export" data-attendance="export" ${scopedRows(r).length?'':'disabled'}>${t('Export CSV')} ↓</button></section><section class="report-period-banner"><div><span>${t(month?'Monthly':'Weekly')} · ${t('Attendance reports')}</span><h2>${e(date(r.range.start))}${r.range.start.slice(0,4)!==r.range.end.slice(0,4)?' '+r.range.start.slice(0,4):''} — ${e(date(r.range.end))} <small>${r.range.end.slice(0,4)}</small></h2><p>${t(staff?'Club attendance across yoga and contrast therapy.':'Attendance for your assigned classes only.')}</p></div><span class="report-banner-icon" aria-hidden="true">${api.icon()}</span></section><div class="report-filters"><label><span>${t('Service')}</span><select id="attendance-service"><option value="all" ${service==='all'?'selected':''}>${t('All services')}</option>${['yoga','contrast'].filter(s=>staff||api.services().includes(s)).map(s=>`<option value="${s}" ${service===s?'selected':''}>${serviceName(s)}</option>`).join('')}</select></label>${staff?`<label><span>${t('Instructor')}</span><select id="attendance-instructor"><option value="all" ${instructor==='all'?'selected':''}>${t('All instructors')}</option><option value="unassigned" ${instructor==='unassigned'?'selected':''}>${t('Unassigned')}</option>${api.instructors().map(p=>`<option value="${e(p.id)}" ${instructor===p.id?'selected':''}>${e(p.name)}</option>`).join('')}</select></label>`:''}</div>${summary(r)}<div class="report-visuals">${chart(r)}${breakdown(r)}</div><p class="report-method">${t('Rates exclude future classes and cancellations. A missing check-in does not confirm absence.')} ${t('Dates and class times use Taipei time.')}${r.unlinked.length?`<br>${r.unlinked.length} · ${t('Historical check-ins without a linked class are excluded from class totals.')}`:''}</p>${classList(r)}</div>`;
    }
    function redraw(focus){api.render();if(focus)document.querySelector(focus)?.focus({preventScroll:true})}
    function details(id){if(!ready())return;const s=report().rows.find(s=>s.id===id);if(!s)return;api.modal('Class attendance',`<div class="report-detail-heading"><h3>${e(t(s.title))}</h3><p>${e(date(s.date))} · ${e(s.time)} · ${serviceName(s.service)}</p><strong>${s.checked} / ${s.booked} ${t('Checked in')}</strong></div>${s.participants.length?`<ul class="report-participants">${s.participants.map(b=>`<li><div><strong>${e(b.memberName||t('Member'))}</strong><span>${e(b.memberNumber||'')}</span></div><div><span class="report-attendance-status ${b.attendanceStatus==='Checked in'?'checked':''}">${t(b.attendanceStatus)}</span>${b.checkedInAt&&Number.isFinite(Date.parse(b.checkedInAt))?`<small>${e(new Date(b.checkedInAt).toLocaleString(I18n.language==='en'?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}))}</small>`:''}</div></li>`).join('')}</ul>`:`<p class="report-method">${t('No participants recorded.')}</p>`}<p class="report-method">${t('Rates exclude future classes and cancellations. A missing check-in does not confirm absence.')}</p>`)}
    function exportReport(){if(!ready())return;const r=report(),rows=scopedRows(r);if(!rows.length)return;
      const cell=value=>{let v=String(value??'');if(/^[\s]*[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
      const head=['Period start','Period end','Date (Taipei)','Time (Taipei)','Class','Service','Instructor','Status','Bookings','Checked in','Not checked in','Awaiting check-in','Cancelled bookings','Attendance rate (ended classes only)'];
      const lines=rows.map(s=>[r.range.start,r.range.end,s.date,s.time,s.title,serviceName(s.service),s.instructorName||t('Unassigned'),t(s.cancelled?'Cancelled':s.closed?'Class ended':'Upcoming / in progress'),s.booked,s.checked,s.missed,s.pending,s.cancellations,s.closed&&!s.cancelled&&s.booked?Math.round(s.checked/s.booked*100)+'%':'']);
      const csv='\uFEFF'+[head,...lines].map(row=>row.map(cell).join(',')).join('\r\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='SYNC-attendance-'+mode+'-'+r.range.start+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);api.toast('Report downloaded.');
    }
    document.addEventListener('click',event=>{const b=event.target.closest('[data-attendance]');if(!b||!ready())return;const action=b.dataset.attendance;
      if(action==='details'){details(b.dataset.id);return}if(action==='export'){exportReport();return}
      if(action==='mode'){if(!['week','month'].includes(b.dataset.mode))return;mode=b.dataset.mode;bucket=null;limit=20;redraw(`[data-attendance=mode][data-mode=${mode}]`);return}
      if(action==='previous'||action==='next'){anchor=period(mode,anchor)[action];bucket=null;limit=20;redraw('[data-attendance='+action+']');return}
      if(action==='current'){anchor=today();bucket=null;limit=20;redraw('[data-attendance=current]');return}
      if(action==='bucket'){const found=report().buckets.find(item=>item.start===b.dataset.start&&item.end===b.dataset.end);if(!found)return;bucket=bucket?.start===found.start?null:found;limit=20;redraw(`[data-attendance=bucket][data-start="${found.start}"]`);return}
      if(action==='clear-bucket'){bucket=null;limit=20;redraw('.report-class-panel h2');return}if(action==='more'){limit+=20;redraw('.report-class-panel h2')}
    });
    document.addEventListener('change',event=>{if(!ready())return;const input=event.target;
      if(input.id==='attendance-period'){const value=mode==='month'?input.value+'-01':input.value;if(!validDate(value))return;anchor=value}
      else if(input.id==='attendance-service'){if(!['all',...(api.isInstructor()?api.services():['yoga','contrast'])].includes(input.value))return;service=input.value}
      else if(input.id==='attendance-instructor'&&!api.isInstructor()){if(!['all','unassigned',...api.instructors().map(p=>p.id)].includes(input.value))return;instructor=input.value}
      else return;bucket=null;limit=20;redraw('#'+input.id);
    });
    return {page,compact};
  }
  return {create,compute,period};
})();
