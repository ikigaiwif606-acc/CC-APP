/* Instructor presentation. The portal supplies scoped reads and guarded writes. */
window.SyncInstructor=(()=>{
  const accounts=[
    {id:'instructor-alex',name:'Alex Chen',email:'instructor@handc.demo',services:['yoga','contrast']},
    {id:'instructor-maya',name:'Maya Wu',email:'yoga@handc.demo',services:['yoga']},
    {id:'instructor-kai',name:'Kai Lin',email:'contrast@handc.demo',services:['contrast']}
  ];
  const preparation=service=>service==='yoga'?[['setup','Mats and props ready'],['participants','Participant list reviewed']]:[['room','Room readiness confirmed'],['briefing','Participant briefing complete']];
  const status=s=>s.cancelled?'cancelled':['in_progress','completed'].includes(s.delivery?.status)?s.delivery.status:'scheduled';
  const labels={scheduled:'Scheduled',in_progress:'In progress',completed:'Completed',cancelled:'Cancelled'};
  I18n.extend({
    'Role':'角色','Instructor workspace':'指導老師工作台','Yoga Instructor':'瑜伽指導老師','Contrast Therapy Instructor':'冷熱交替療法指導老師',
    'Today’s sessions':'今日課程','My schedule':'我的課表','Instructor account':'指導老師帳戶','My account':'我的帳戶',
    'Your day, in rhythm.':'掌握今天的教學節奏。','Your assigned sessions and participants.':'查看你的課程與參與會員。',
    'Next assigned session':'下一堂指派課程','Session in progress':'課程進行中','Scheduled':'待開始','In progress':'進行中','Completed':'已完成',
    'Open session':'開啟課程','Session details':'課程詳情','Back to my schedule':'返回我的課表','Back to session':'返回課程',
    'Participants':'參與會員','arrived':'已報到','booked':'已預約','places':'名額','60 min':'60 分鐘',
    'All sessions':'全部課程','No sessions assigned yet.':'尚未指派課程。','Your sessions will appear here after admin assigns you.':'管理員指派課程後，即會顯示於此。',
    'No assigned sessions on this date.':'此日期尚無指派課程。','View my schedule':'查看我的課表','Previous day':'前一天','Next day':'後一天',
    'No upcoming sessions assigned.':'尚無即將到來的指派課程。','Your next assigned session will appear here.':'下一堂指派課程將顯示於此。',
    'This session is unavailable.':'無法查看此課程。','It may have been reassigned or removed.':'此課程可能已重新指派或移除。',
    'Room not set':'尚未設定教室','Class preparation':'課前準備','Room readiness':'空間準備',
    'Mats and props ready':'瑜伽墊與輔具已備妥','Participant list reviewed':'已核對參與名單','Room readiness confirmed':'已確認空間準備完成','Participant briefing complete':'已完成參與者說明',
    'Ready to begin.':'準備就緒，可開始課程。','Complete preparation before beginning.':'開始前，請先完成準備項目。','Begin session':'開始課程','Complete session':'結束課程',
    'Begin on the session date.':'請於課程當天開始。','Session completed. Attendance remains as recorded.':'課程已結束，報到紀錄維持原狀。',
    'Complete this session?':'要結束此課程嗎？','Completing the session does not mark absent participants as attended.':'結束課程不會將尚未報到的會員標記為已出席。',
    'Keep in progress':'繼續進行','Not checked in':'尚未報到','No participants booked yet.':'尚無會員預約。',
    'Check-in opens on the session date.':'課程當天開放報到。','Attendance changes for a completed session are handled by reception.':'已結束課程的出席紀錄，請由櫃台協助更正。',
    'No previous recorded visits':'尚無先前到訪紀錄','Session handover':'課程交接','Handovers':'交接紀錄','Add a handover':'新增交接紀錄',
    'Room setup, equipment or follow-up for reception.':'記錄教室配置、設備狀況，或需要櫃台跟進的事項。',
    'Shared with the assigned instructor, reception and admin.':'由負責老師、櫃台及管理員共同查看。','Save handover':'儲存交接紀錄','No handovers yet.':'尚無交接紀錄。',
    'Write a handover using 3 to 1,000 characters.':'請輸入 3 至 1,000 個字元的交接內容。','Handover saved.':'交接紀錄已儲存。','Preparation saved.':'準備項目已儲存。',
    'Instructor access required.':'需要指導老師權限。','This session is not assigned to you.':'此課程未指派給你。',
    'This session can no longer be changed.':'此課程已無法變更。','Complete all preparation items first.':'請先完成所有準備項目。','This session is not in progress.':'此課程尚未開始。','Complete your current session before beginning another.':'請先結束進行中的課程，再開始下一堂課。',
    'Session started.':'課程已開始。','Session completed.':'課程已結束。','Session preparation':'課程準備','Session started':'開始課程','Session completed':'結束課程','Session handover':'課程交接',
    'Only participants booked into this session can be checked in here.':'此處僅能為已預約本課程的會員報到。',
    'Scan a participant’s code for this session, then confirm attendance.':'掃描本課程參與會員的報到碼，再確認出席。',
    'Member not found for this session. Use the participant list or ask reception.':'本課程名單中找不到此會員，請核對參與名單或洽詢櫃台。',
    'Assignments are managed by admin.':'課程指派由管理員管理。','Specializations':'授課項目','Assigned instructor':'負責指導老師',
    'Unassigned':'尚未指派','Assign instructor':'指派老師','Instructor assignment':'指導老師指派','Room':'教室',
    'Only admin can assign or change an instructor.':'僅管理員可指派或更換老師。','Choose an instructor qualified for this service.':'請選擇可負責此服務的指導老師。',
    'This instructor already has an overlapping session.':'此指導老師於相同時段已有其他課程。',
    'A started session cannot be moved, reassigned or cancelled.':'已開始的課程無法移動、重新指派或取消。',
    'Link an Instructor account to allow access to this session.':'連結指導老師帳戶後，老師才能存取此課程。','Previously listed':'原顯示名稱',
    'No session handovers recorded.':'尚無課程交接紀錄。','Assigned sessions only.':'僅可查看指派課程。',
    'Instructor · Both services':'指導老師・兩項服務','Instructor · Yoga':'指導老師・瑜伽','Instructor · Contrast Therapy':'指導老師・冷熱交替療法'
  });
  const t=I18n.translate,e=escapeHTML;
  const serviceName=s=>t(s==='yoga'?'Yoga':'Contrast Therapy');
  const stamp=value=>{const d=new Date(value);return Number.isFinite(d.getTime())?d.toLocaleString(I18n.language==='en'?'en-GB':'zh-TW',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):t('Unavailable')};
  const handovers=s=>Array.isArray(s?.delivery?.handovers)?s.delivery.handovers:[];
  function notes(s){return handovers(s).length?handovers(s).slice().reverse().map(n=>`<article class="instructor-note"><p>${e(n.text)}</p><small>${e(n.authorName||t('Instructor'))} · ${e(stamp(n.at))}</small></article>`).join(''):`<p class="instructor-muted">${t('No handovers yet.')}</p>`}
  function create(api){
    let filter='all',scheduleDate=addDays(0);const noteDrafts=new Map();const draftKey=id=>(own()?.id||'')+':'+id;
    const own=()=>api.profile();
    const route=()=>{const match=location.hash.match(/^#instructor-session\/([^/]+)(?:\/(scan))?$/);if(!match)return null;try{return {id:decodeURIComponent(match[1]),scan:!!match[2]}}catch{return null}};
    const selected=()=>{const r=route();return r?api.session(r.id):null};
    const visible=s=>filter==='all'||s.service===filter;
    const initials=name=>e(String(name).trim().split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase());
    function navigation(section){
      const items=[['today','Today','overview'],['schedule','My schedule','schedule'],['reports','Reports','reports'],['account','Account','members']];
      const links=items.map(([id,label,ic])=>`<a class="staff-bottom-link ${section===id?'selected':''}" href="#instructor-${id}" data-instructor-nav ${section===id?'aria-current="page"':''}><span class="staff-nav-icon">${api.icon(ic)}</span><span>${t(label)}</span></a>`).join('');
      return {side:`<aside class="staff-sidebar instructor-sidebar"><div class="staff-sidebar-heading"><span>${t('Workspace')}</span><strong>${t('Instructor workspace')}</strong></div><nav aria-label="${t('Instructor workspace')}">${links}</nav><div class="instructor-sidebar-identity"><strong>${e(own().name)}</strong><span>${own().services.map(serviceName).join(' · ')}</span></div><span class="staff-sidebar-location">HandC · TAIPEI XINYI</span></aside>`,bottom:`<nav class="staff-bottom-nav instructor-bottom-nav" aria-label="${t('Instructor workspace')}"><div>${links}</div></nav>`};
    }
    function filters(){return own().services.length>1?`<div class="instructor-filters" role="group" aria-label="${t('Service')}">${[['all','All sessions'],['yoga','Yoga'],['contrast','Contrast Therapy']].map(([id,label])=>`<button type="button" data-instructor="filter" data-value="${id}" aria-pressed="${filter===id}">${t(label)}</button>`).join('')}</div>`:''}
    const counts=s=>{const roster=api.roster(s.id);return {booked:roster.length,arrived:roster.filter(b=>b.checked).length}};
    function card(s,hero=false){
      const count=counts(s),phase=status(s),href='#instructor-session/'+encodeURIComponent(s.id);
      return `<article class="instructor-session ${hero?'instructor-next':'instructor-session-row'} ${s.service}" data-session="${e(s.id)}"><div class="instructor-session-top"><span>${serviceName(s.service)}</span><span class="instructor-status ${phase}">${t(labels[phase])}</span></div>${hero?`<p class="instructor-kicker">${t(phase==='in_progress'?'Session in progress':'Next assigned session')}</p>`:''}<div class="instructor-session-main"><div class="instructor-session-time"><strong>${e(s.time)}</strong><span>${e(t(fmt(s.date)))}</span></div><div><h2>${e(t(s.title))}</h2><p>${e(s.room||t('Room not set'))} · ${t('60 min')}</p></div></div><div class="instructor-session-foot"><span><b>${count.arrived} / ${count.booked}</b> ${t('arrived')}<small>${count.booked} / ${s.capacity} ${t('places')}</small></span><a class="button ${hero?'light':''}" href="${href}" data-instructor-nav>${t('Open session')} <span aria-hidden="true">→</span></a></div></article>`;
    }
    function today(){
      const sessions=api.sessions().filter(visible),todays=sessions.filter(s=>s.date===addDays(0)),next=sessions.find(s=>status(s)==='in_progress')||sessions.find(s=>!s.cancelled&&status(s)!=='completed'&&sessionStart(s.date,s.time)+3600000>Date.now());
      return `${api.attendanceSummary()}${filters()}${next?card(next,true):`<section class="instructor-empty"><span>${api.icon('schedule')}</span><h2>${t(sessions.length?'No upcoming sessions assigned.':'No sessions assigned yet.')}</h2><p>${t(sessions.length?'Your next assigned session will appear here.':'Your sessions will appear here after admin assigns you.')}</p></section>`}<div class="instructor-section-heading"><h2>${t('Today’s sessions')}</h2><a href="#instructor-schedule" data-instructor-nav>${t('View my schedule')} →</a></div><div class="instructor-session-list">${todays.length?todays.map(s=>card(s)).join(''):`<p class="instructor-empty-line">${t('No assigned sessions on this date.')}</p>`}</div>`;
    }
    function schedule(){const list=api.sessions().filter(s=>s.date===scheduleDate&&visible(s));return `<div class="instructor-schedule-toolbar"><div class="instructor-date-controls"><button class="button light" data-instructor="day" data-offset="-1" aria-label="${t('Previous day')}">←</button><label><span class="sr-only">${t('Date')}</span><input id="instructor-date" type="date" value="${e(scheduleDate)}"></label><button class="button light" data-instructor="day" data-offset="1" aria-label="${t('Next day')}">→</button><button class="instructor-today-link" data-instructor="today-date">${t('Today')}</button></div>${filters()}</div><div class="instructor-session-list">${list.length?list.map(s=>card(s)).join(''):`<section class="instructor-empty"><h2>${t('No assigned sessions on this date.')}</h2><p>${t('Your sessions will appear here after admin assigns you.')}</p></section>`}</div>`}
    function controls(s){const phase=status(s),isToday=s.date===addDays(0),ready=preparation(s.service).every(([key])=>s.delivery?.preparation?.[key]);return `<span class="instructor-status ${phase}">${t(labels[phase])}</span>${phase==='scheduled'?`<p>${t(!isToday?'Begin on the session date.':!ready?'Complete preparation before beginning.':'Ready to begin.')}</p><button class="button" data-instructor="start" data-session="${e(s.id)}" ${!isToday||!ready?'disabled':''}>${t('Begin session')} →</button>`:phase==='in_progress'?`<button class="button" data-instructor="complete-review" data-session="${e(s.id)}">${t('Complete session')} ✓</button>`:phase==='completed'?`<p>${t('Session completed. Attendance remains as recorded.')}</p>`:''}`}
    function detail(s){
      const phase=status(s),roster=api.roster(s.id),today=s.date===addDays(0),mutable=!['completed','cancelled'].includes(phase),count=counts(s);
      return `<a class="instructor-back" href="#instructor-schedule" data-instructor-nav>← ${t('Back to my schedule')}</a><section class="instructor-detail-hero ${s.service}"><div><span class="instructor-kicker">${serviceName(s.service)}</span><h2>${e(t(s.title))}</h2><p>${e(t(fmt(s.date)))} · ${e(s.time)} · ${t('60 min')}</p><small>${e(s.room||t('Room not set'))}</small></div><div class="instructor-detail-count"><strong>${count.arrived}<span> / ${count.booked}</span></strong><span>${t('arrived')}</span></div></section><div class="instructor-detail-grid"><section class="instructor-panel"><div class="instructor-section-heading"><h2>${t('Participants')} <small>${count.booked} / ${s.capacity}</small></h2>${today&&mutable?`<a class="button light instructor-scan" href="#instructor-session/${encodeURIComponent(s.id)}/scan" data-instructor-nav>${api.icon('checkin')}${t('Scan check-in')}</a>`:''}</div><div class="instructor-roster">${roster.length?roster.map(b=>`<article class="instructor-person"><span class="instructor-person-avatar">${b.photo?`<img src="${e(b.photo)}" alt="">`:initials(b.name)}</span><div><h3>${e(b.name)}</h3><span>${e(b.number)}</span>${b.first?`<small>${t('No previous recorded visits')}</small>`:''}</div>${b.checked?`<span class="instructor-arrived">✓ ${t('Checked in')}</span>`:today&&mutable?`<button class="button light" data-instructor="checkin" data-session="${e(s.id)}" data-booking="${e(b.id)}">${t('Check in')}</button>`:`<span class="instructor-awaiting">${t('Not checked in')}</span>`}</article>`).join(''):`<p class="instructor-empty-line">${t('No participants booked yet.')}</p>`}</div>${!today&&mutable?`<p class="instructor-muted">${t('Check-in opens on the session date.')}</p>`:phase==='completed'?`<p class="instructor-muted">${t('Attendance changes for a completed session are handled by reception.')}</p>`:''}</section><div class="instructor-detail-side"><section class="instructor-panel"><h2>${t(s.service==='yoga'?'Class preparation':'Room readiness')}</h2><div class="instructor-preparation">${preparation(s.service).map(([key,label])=>`<label><input type="checkbox" data-instructor-preparation="${key}" data-session="${e(s.id)}" ${s.delivery?.preparation?.[key]?'checked':''} ${phase!=='scheduled'?'disabled':''}><span>${t(label)}</span></label>`).join('')}</div><div id="instructor-session-controls" class="instructor-delivery-controls">${controls(s)}</div><p id="instructor-prep-feedback" class="instructor-feedback" role="status" aria-live="polite"></p></section><section class="instructor-panel"><h2>${t('Session handover')}</h2><p class="instructor-muted">${t('Shared with the assigned instructor, reception and admin.')}</p><details class="instructor-add-note"><summary>${t('Add a handover')}</summary><form id="instructor-handover-form" data-session="${e(s.id)}"><label><span class="sr-only">${t('Session handover')}</span><textarea name="note" required minlength="3" maxlength="1000" rows="3" placeholder="${t('Room setup, equipment or follow-up for reception.')}">${e(noteDrafts.get(draftKey(s.id))||'')}</textarea></label><button type="submit" class="button light">${t('Save handover')}</button><p class="form-error" role="alert"></p></form></details><div id="instructor-notes">${notes(s)}</div><p id="instructor-note-feedback" class="instructor-feedback" role="status" aria-live="polite"></p></section></div></div>`;
    }
    function account(){const p=own();return `<section class="instructor-panel instructor-account"><span class="instructor-account-avatar">${initials(p.name)}</span><h2>${e(p.name)}</h2><p>${e(p.email)}</p><dl><div><dt>${t('Role')}</dt><dd>${t('Instructor')}</dd></div><div><dt>${t('Specializations')}</dt><dd>${p.services.map(serviceName).join(' · ')}</dd></div><div><dt>${t('Home club')}</dt><dd>${t('Taipei · Xinyi')}</dd></div></dl><p class="instructor-muted">${t('Assignments are managed by admin.')}</p><button class="button light" data-portal="logout">${t('Sign out')} →</button></section>`}
    function unavailable(){return `<section class="instructor-empty"><h2>${t('This session is unavailable.')}</h2><p>${t('It may have been reassigned or removed.')}</p><a class="button light" href="#instructor-today" data-instructor-nav>${t('Today')}</a></section>`}
    function page(hash){
      if(!api.isInstructor()||!own())return '';
      if(filter!=='all'&&!own().services.includes(filter))filter='all';
      const r=route(),s=r?api.session(r.id):null,section=hash==='instructor-account'?'account':hash==='instructor-reports'?'reports':hash==='instructor-schedule'||r?'schedule':'today',nav=navigation(section);
      const title=r?(r.scan?'Scan check-in':'Session details'):section==='today'?'Your day, in rhythm.':section==='schedule'?'My schedule':section==='reports'?'Attendance reports':'Instructor account';
      const content=r?(s?(r.scan?api.scannerPage(s):detail(s)):unavailable()):section==='today'?today():section==='schedule'?schedule():section==='reports'?api.reports():account();
      return `<div class="staff-layout instructor-layout">${nav.side}<div class="staff-content"><div class="staff-heading instructor-heading"><div><p class="eyebrow">HandC · XINYI</p><h1>${t(title)}</h1><p>${r&&s?e(t(s.title))+' · '+e(t(fmt(s.date)))+' · '+e(s.time):t(section==='today'?'Your assigned sessions and participants.':'Assigned sessions only.')}</p></div><span class="portal-demo-label">${t('Demo mode')}</span></div>${content}</div></div>${nav.bottom}`;
    }
    document.addEventListener('click',event=>{
      if(!api.isInstructor())return;const button=event.target.closest('[data-instructor]');if(!button)return;
      const action=button.dataset.instructor,id=button.dataset.session;
      if(action==='filter'){if(!['all',...own().services].includes(button.dataset.value))return;filter=button.dataset.value;api.render();return}
      if(action==='day'){const offset=Number(button.dataset.offset);if(![-1,1].includes(offset))return;const d=new Date(scheduleDate+'T12:00:00');d.setDate(d.getDate()+offset);scheduleDate=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');api.render();return}
      if(action==='today-date'){scheduleDate=addDays(0);api.render();return}
      if(action==='complete-review'){const s=api.session(id);if(!s||status(s)!=='in_progress')return;api.modal('Complete this session?',`<p class="modal-body">${e(t(s.title))}<br>${t('Completing the session does not mark absent participants as attended.')}</p><div class="modal-actions"><button class="button light" data-action="close">${t('Keep in progress')}</button><button class="button" data-instructor="complete" data-session="${e(id)}">${t('Complete session')}</button></div>`);return}
      if(!['start','complete','checkin'].includes(action))return;
      const outcome=action==='checkin'?api.checkin(id,button.dataset.booking):api.transition(id,action);
      if(!outcome.ok){api.toast(outcome.error);api.render();return}
      if(action==='complete')api.closeModal();api.render();api.toast(action==='checkin'?'Attendance recorded.':action==='start'?'Session started.':'Session completed.');
    });
    document.addEventListener('input',event=>{if(api.isInstructor()&&event.target.matches('#instructor-handover-form textarea'))noteDrafts.set(draftKey(event.target.form.dataset.session),event.target.value)});
    document.addEventListener('change',event=>{
      if(!api.isInstructor())return;
      if(event.target.id==='instructor-date'){if(/^\d{4}-\d{2}-\d{2}$/.test(event.target.value)){scheduleDate=event.target.value;api.render()}return}
      const input=event.target;if(!input.matches('[data-instructor-preparation]'))return;
      const outcome=api.prepare(input.dataset.session,input.dataset.instructorPreparation,input.checked);
      if(!outcome.ok){api.toast(outcome.error);api.render();return}
      const s=api.session(input.dataset.session),target=document.querySelector('#instructor-session-controls');if(s&&target)target.innerHTML=controls(s);const message=document.querySelector('#instructor-prep-feedback');if(message)message.textContent=t('Preparation saved.');
    });
    document.addEventListener('submit',event=>{
      const form=event.target;if(form.id!=='instructor-handover-form'||!api.isInstructor())return;event.preventDefault();if(!form.checkValidity()){form.reportValidity();return}
      const outcome=api.handover(form.dataset.session,form.elements.note.value);
      if(!outcome.ok){form.querySelector('.form-error').textContent=t(outcome.error);return}
      noteDrafts.delete(draftKey(form.dataset.session));form.reset();form.elements.note.value='';form.querySelector('.form-error').textContent='';const s=api.session(form.dataset.session);if(s)document.querySelector('#instructor-notes').innerHTML=notes(s);document.querySelector('#instructor-note-feedback').textContent=t('Handover saved.');
    });
    return {page,route,selected,unavailable,reset(){filter='all';scheduleDate=addDays(0);noteDrafts.clear()}};
  }
  return {accounts,preparation,status,labels,handovers,notes,create};
})();
