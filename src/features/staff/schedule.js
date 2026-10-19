/* Staff schedule presentation. Delivery and attendance records remain owned by the portal. */
window.SyncStaffSchedule=(()=>{
  I18n.extend({
    'Classes':'課程','Upcoming':'待開始','Ended':'已結束','View class':'查看課程',
    'Class details':'課程詳情','Session actions':'課程操作','Class bookings':'課程預約',
    'Instructor not assigned':'尚未指派老師','Room needed':'待設定教室',
    'Taipei time (UTC+8)':'台北時間（UTC+8）','No classes on this date.':'此日期尚無課程。',
    'Choose another date or add a session.':'請選擇其他日期，或新增課程。',
    'Morning':'上午','Afternoon':'下午','Evening':'晚間'
  });
  const t=I18n.translate,e=escapeHTML;
  const paths={
    morning:'<path d="M3 17h18M5 21h14M7 13a5 5 0 0 1 10 0M12 2v3M3.5 6.5l2 2m13-2-2 2"/>',
    afternoon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    evening:'<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>',
    person:'<circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
  };
  const icon=id=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id]||''}</svg>`;
  function create(api){
    let timer;
    const phase=(s,now=Date.now())=>s.cancelled?'cancelled':s.delivery?.status==='completed'||api.start(s.date,s.time)+3600000<=now?'ended':s.delivery?.status==='in_progress'||api.start(s.date,s.time)<=now?'in_progress':'upcoming';
    const label=value=>t({upcoming:'Upcoming',in_progress:'In progress',ended:'Ended',cancelled:'Cancelled'}[value]);
    const service=s=>t(s.service==='yoga'?'Yoga':'Contrast Therapy');
    const assigned=s=>api.instructors().find(p=>p.id===s.instructorId);
    const end=s=>new Date(api.start(s.date,s.time)+3600000).toLocaleTimeString('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit'});
    const part=s=>Number(s.time.slice(0,2))<5||Number(s.time.slice(0,2))>=18?'evening':Number(s.time.slice(0,2))<12?'morning':'afternoon';
    const dateLabel=date=>new Date(date+'T12:00:00+08:00').toLocaleDateString(I18n.language==='en'?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',weekday:'short',day:'numeric',month:'short',year:'numeric'});
    const onSchedule=()=>api.isStaff()&&location.hash==='#admin-schedule';
    const active=s=>phase(s)==='upcoming'&&s.date<=addDays(30);
    const editLabel=s=>api.isAdmin()&&!assigned(s)&&phase(s)==='upcoming'?'Assign instructor':'Edit session';
    function card(s){
      const status=phase(s),count=api.bookings(s).length,p=assigned(s),daypart=part(s),id=e(s.id);
      return `<article class="schedule-card ${s.service==='contrast'?'contrast':'yoga'}" data-session="${id}" data-state="${status}" aria-labelledby="schedule-title-${id}">
        <div class="schedule-card-top"><div class="schedule-time"><span class="schedule-daypart" title="${t(daypart[0].toUpperCase()+daypart.slice(1))}" aria-label="${t(daypart[0].toUpperCase()+daypart.slice(1))}">${icon(daypart)}</span><time datetime="${e(s.date)}T${e(s.time)}:00+08:00">${e(s.time)}</time><span class="schedule-end">– ${end(s)}</span></div><span class="schedule-status">${label(status)}</span></div>
        <h3 id="schedule-title-${id}">${e(t(s.title))}</h3>
        <p class="schedule-meta">${icon('person')}<span>${e(p?.name||t('Instructor not assigned'))}${s.room?`<span class="schedule-room"> · ${e(s.room)}</span>`:''}</span><span class="schedule-room-warning" ${!s.room&&status==='upcoming'?'':'hidden'}>${t('Room needed')}</span></p>
        <div class="schedule-capacity"><span class="schedule-service">${service(s)}</span><span><strong>${count}/${e(s.capacity)}</strong> ${t('booked')}</span></div>
        <div class="schedule-occupancy" role="meter" aria-label="${t('Class bookings')}" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${Math.max(count,Number(s.capacity)||1)}"><span style="width:${Math.min(100,count/Math.max(1,Number(s.capacity))*100)}%"></span></div>
        <div class="schedule-card-actions"><button type="button" class="schedule-view" data-schedule="view" data-id="${id}">${t('View class')} <span aria-hidden="true">→</span></button><details class="schedule-more"><summary aria-label="${t('Session actions')}: ${e(t(s.title))}, ${e(s.time)}">${icon('more')}</summary><div class="schedule-menu">
          <button type="button" data-staff-tool="book-member" data-session="${id}" data-schedule-book ${count>=s.capacity?'disabled':''} ${active(s)?'':'hidden'}>${t('Book for member')}</button>
          <button type="button" class="schedule-edit" data-portal="session-edit" data-id="${id}" ${s.cancelled?'hidden':''}>${t(editLabel(s))}</button>
          <button type="button" data-portal="session-notes" data-id="${id}">${t('Handovers')} <span>${SyncInstructor.handovers(s).length}</span></button>
          <button type="button" class="schedule-cancel" data-portal="session-cancel" data-id="${id}" ${status==='upcoming'?'':'hidden'}>${t('Cancel session')}</button>
        </div></details></div>
      </article>`;
    }
    function page(){
      const date=api.date(),list=api.sessions().filter(s=>s.date===date).sort((a,b)=>a.time.localeCompare(b.time));
      return `<section class="schedule-workspace" aria-labelledby="staff-schedule-title"><div class="schedule-heading"><div><h2 id="staff-schedule-title">${t('Classes')} <span>${list.length}</span></h2><p>${e(dateLabel(date))} · ${t('Taipei time (UTC+8)')}</p></div><div class="schedule-toolbar"><button class="button light" data-staff-tool="book-member">${t('Book for member')}</button><button class="button" data-portal="session-new">${t('Add session')} <span aria-hidden="true">+</span></button></div></div>
        <div class="schedule-filterbar"><div class="schedule-date-controls"><button type="button" data-schedule="day" data-offset="-1" aria-label="${t('Previous day')}">←</button><label><span class="sr-only">${t('Date')}</span><input type="date" id="staff-date" aria-label="${t('Date')}" value="${e(date)}" required></label><button type="button" data-schedule="day" data-offset="1" aria-label="${t('Next day')}">→</button><button type="button" class="schedule-today" data-schedule="today">${t('Today')}</button></div><div class="schedule-summary" aria-label="${t('Status')}">${['upcoming','in_progress','ended','cancelled'].map(value=>`<span data-schedule-count="${value}"><i aria-hidden="true"></i><strong>${list.filter(s=>phase(s)===value).length}</strong> ${label(value)}</span>`).join('')}</div></div>
        <div class="schedule-grid">${list.map(card).join('')||`<div class="schedule-empty"><h3>${t('No classes on this date.')}</h3><p>${t('Choose another date or add a session.')}</p></div>`}</div></section>`;
    }
    function detail(s){
      const roster=api.bookings(s),p=assigned(s);
      api.modal('Class details',`<section class="schedule-detail" data-session="${e(s.id)}"><div class="schedule-detail-heading"><span class="schedule-service">${service(s)}</span><span class="schedule-detail-status" data-state="${phase(s)}">${label(phase(s))}</span></div><h3>${e(t(s.title))}</h3><p>${e(dateLabel(s.date))} · ${e(s.time)}–${end(s)}<br>${t('Taipei time (UTC+8)')}</p><dl><div><dt>${t('Instructor')}</dt><dd>${e(p?.name||t('Instructor not assigned'))}</dd></div><div><dt>${t('Room')}</dt><dd>${e(s.room||t('Room not set'))}</dd></div><div><dt>${t('Class bookings')}</dt><dd>${roster.length}/${e(s.capacity)}</dd></div></dl>${!p&&s.instructor?`<p class="schedule-detail-note">${t('Previously listed')}: ${e(s.instructor)}</p>`:''}<h4>${t('Booking roster')} <span>${roster.length}</span></h4><div class="schedule-detail-roster">${roster.map(b=>{const m=api.members().find(m=>m.id===b.memberId);return `<div><span><strong>${e(m?.name||t('Member'))}</strong><small>${e(m?.email||'')}</small></span><span class="schedule-person-status">${t(api.checked(b)?'Checked in':'Not checked in')}</span></div>`}).join('')||`<p>${t('No participants booked yet.')}</p>`}</div></section>`);
    }
    function refreshTime(){
      clearTimeout(timer);if(!onSchedule())return;
      const list=api.sessions().filter(s=>s.date===api.date()),now=Date.now();
      for(const s of list){const node=[...document.querySelectorAll('.schedule-card')].find(n=>n.dataset.session===s.id);if(!node)continue;const status=phase(s,now);node.dataset.state=status;node.querySelector('.schedule-status').textContent=label(status);const book=node.querySelector('[data-schedule-book]'),cancel=node.querySelector('.schedule-cancel');if((!active(s)&&document.activeElement===book)||(status!=='upcoming'&&document.activeElement===cancel)){const menu=node.querySelector('details');menu.open=false;menu.querySelector('summary').focus({preventScroll:true})}book.hidden=!active(s);cancel.hidden=status!=='upcoming';node.querySelector('.schedule-edit').textContent=t(editLabel(s));node.querySelector('.schedule-room-warning').hidden=!!s.room||status!=='upcoming';}
      for(const node of document.querySelectorAll('[data-schedule-count]'))node.querySelector('strong').textContent=list.filter(s=>phase(s,now)===node.dataset.scheduleCount).length;
      const detailNode=document.querySelector('.schedule-detail'),selected=detailNode&&api.sessions().find(s=>s.id===detailNode.dataset.session);if(selected){const node=detailNode.querySelector('.schedule-detail-status');node.dataset.state=phase(selected,now);node.textContent=label(phase(selected,now));}
      const next=list.filter(s=>!s.cancelled&&s.delivery?.status!=='completed').flatMap(s=>[api.start(s.date,s.time),api.start(s.date,s.time)+3600000]).filter(stamp=>stamp>now);
      timer=setTimeout(refreshTime,Math.max(100,Math.min(60000,...next.map(stamp=>stamp-now+20))));
    }
    function closeMenus(except){document.querySelectorAll('.schedule-more[open]').forEach(node=>{if(node!==except)node.open=false})}
    // Dialogs return focus to the visible menu trigger, rather than a hidden menu item.
    document.addEventListener('click',event=>{const button=event.target.closest('.schedule-menu button');if(button){const menu=button.closest('details');menu.open=false;menu.querySelector('summary').focus({preventScroll:true})}},true);
    document.addEventListener('click',event=>{
      const menu=event.target.closest('.schedule-more');closeMenus(menu);if(menu&&event.target.closest('button'))menu.open=false;
      const button=event.target.closest('[data-schedule]');if(!button||!api.isStaff())return;api.refresh();if(!api.isStaff())return;
      const action=button.dataset.schedule;
      if(action==='view'){const s=api.sessions().find(s=>s.id===button.dataset.id);if(s)detail(s);return}
      if(!onSchedule())return;
      if(action==='day'){const offset=Number(button.dataset.offset);if(![-1,1].includes(offset))return;const date=new Date(api.date()+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+offset);api.setDate(date.toISOString().slice(0,10));}
      else if(action==='today')api.setDate(addDays(0));else return;
      api.render();document.querySelector(`[data-schedule="${action}"]${action==='day'?`[data-offset="${button.dataset.offset}"]`:''}`)?.focus({preventScroll:true});
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){const menu=event.target.closest('.schedule-more[open]');if(menu){event.preventDefault();menu.open=false;menu.querySelector('summary').focus()}}});
    window.addEventListener('focus',refreshTime);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshTime()});
    return {page,afterRender:refreshTime};
  }
  return {create};
})();
