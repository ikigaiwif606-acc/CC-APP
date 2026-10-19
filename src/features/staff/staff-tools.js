/* Account creation and member-assisted booking UI. Storage and role checks live in portal.js. */
window.SyncStaffTools=(()=>{
  I18n.extend({
    'Accounts & access':'帳戶與權限','Create account':'建立帳戶','Add member':'新增會員','New account':'新增帳戶',
    'Create sign-in accounts and choose the right workspace for each person.':'建立登入帳戶，並為每位使用者設定合適的工作台。',
    'Account role':'帳戶角色','Admin':'管理員','All roles':'全部角色','Search accounts':'搜尋帳戶','Sample account':'示範帳戶','Created account':'新增帳戶',
    'No accounts found.':'找不到符合的帳戶。','Account creation':'建立帳戶','Staff booking':'人員代訂課程',
    'Manage club operations, accounts, points and passes.':'管理會館營運、帳戶、點數與堂票。',
    'Manage bookings, member check-in and guest vouchers.':'管理預約、會員報到與好友體驗券。',
    'View assigned sessions and manage participants and preparation.':'查看指派課程，並管理參與名單與課前準備。',
    'Book sessions and manage personal passes, rewards and profile.':'預約課程，並管理個人堂票、獎勵與資料。',
    'Choose at least one Instructor specialization.':'請至少選擇一項指導老師授課項目。',
    'Choose a valid account role.':'請選擇有效的帳戶角色。','Account created.':'帳戶已建立。',
    'Set a password':'設定密碼','Use 8 to 100 characters. Share the sign-in details directly; no email is sent.':'請使用 8 至 100 個字元。請直接提供登入資料給對方，系統不會寄送電子郵件。',
    'New members start with Plus membership, zero points and no passes.':'新會員從 Plus 等級開始，初始點數與堂票皆為零。',
    'Instructor access begins after a session is assigned.':'指派課程後，指導老師即可查看該課程。',
    'Account ready':'帳戶已就緒','They can sign in with this email and the password you set.':'對方可使用此電子郵件與你設定的密碼登入。',
    'View member profile':'查看會員資料','Create another account':'建立另一個帳戶','Done':'完成',
    'Book for member':'為會員預約','Choose a member and session, then confirm which pass to use.':'選擇會員與課程，再確認使用的堂票。',
    'Find a member':'搜尋會員','Choose a member':'選擇會員','Choose a member.':'請選擇會員。',
    'Choose a session':'選擇課程','Pass to use':'使用堂票','Choose a member and session first.':'請先選擇會員與課程。',
    'No eligible passes':'沒有適用堂票','This session is fully booked.':'此課程名額已滿。',
    'Choose a pass valid on the session date.':'請選擇在課程當天有效的堂票。',
    'Member needs a valid pass for this service on the session date.':'會員需要持有在課程當天有效的此服務堂票。',
    'Booking uses 1 pass. Points stay unchanged; visits count at check-in.':'預約將使用 1 張堂票。點數維持不變，到訪次數於報到後才會累計。',
    'Booking review':'預約確認','Pass balance after booking':'預約後剩餘堂數','Confirm booking':'確認預約',
    'Booking created for member.':'已為會員完成預約。','Booked by staff':'由工作人員代訂',
    'Cancel at least 24 hours before the session to have the pass returned.':'請於課程開始前至少 24 小時取消，才能退回堂票。',
    'Unable to save changes. Please try again.':'無法儲存變更，請再試一次。','Staff access required.':'需要工作人員權限。'
  });
  const t=I18n.translate,e=escapeHTML;
  const roles={admin:'Admin',frontdesk:'Front desk',instructor:'Instructor',member:'Member'};
  const descriptions={admin:'Manage club operations, accounts, points and passes.',frontdesk:'Manage bookings, member check-in and guest vouchers.',instructor:'View assigned sessions and manage participants and preparation.',member:'Book sessions and manage personal passes, rewards and profile.'};
  const serviceName=s=>t(s==='yoga'?'Yoga':'Contrast Therapy');
  const field=(label,body)=>`<label class="portal-field"><span>${t(label)}</span>${body}</label>`;
  function create(api){
    let accountQuery='',accountRole='all';
    function accountRows(){const list=api.accounts().filter(a=>(accountRole==='all'||a.role===accountRole)&&(a.name+' '+a.email).toLowerCase().includes(accountQuery.toLowerCase()));return list.length?list.map(a=>`<article class="staff-access-row"><span class="staff-access-avatar" aria-hidden="true">${e(a.name.trim().split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase())}</span><div class="staff-access-person"><strong>${e(a.name)}</strong><span>${e(a.email)}</span>${a.role==='instructor'?`<small>${a.services.map(serviceName).join(' · ')}</small>`:''}</div><div class="staff-access-meta"><span class="staff-access-role ${a.role}">${t(roles[a.role])}</span><small>${t(a.sample?'Sample account':'Created account')}</small></div></article>`).join(''):`<p class="empty">${t('No accounts found.')}</p>`}
    function accountsPanel(){if(!api.isAdmin())return '';return `<section class="staff-panel staff-access-panel" aria-labelledby="staff-accounts-title"><div class="staff-panel-heading"><div><h2 id="staff-accounts-title">${t('Accounts & access')}</h2><p>${t('Create sign-in accounts and choose the right workspace for each person.')}</p></div><button class="button" data-staff-tool="create-account">${t('Create account')} +</button></div><div class="staff-access-filters">${field('Search accounts',`<input type="search" id="staff-account-search" value="${e(accountQuery)}" placeholder="${t('Search by name or email')}">`)}${field('Account role',`<select id="staff-account-role"><option value="all" ${accountRole==='all'?'selected':''}>${t('All roles')}</option>${Object.entries(roles).map(([id,label])=>`<option value="${id}" ${accountRole===id?'selected':''}>${t(label)}</option>`).join('')}</select>`)}</div><div id="staff-account-results" class="staff-access-list">${accountRows()}</div></section>`}
    function updateRole(form){const role=form.elements.role.value,isInstructor=role==='instructor';form.querySelector('#staff-role-description').textContent=t(descriptions[role]);const options=form.querySelector('#staff-instructor-services');options.hidden=!isInstructor;options.disabled=!isInstructor;form.querySelector('#staff-member-start').hidden=role!=='member';form.querySelector('#staff-instructor-start').hidden=!isInstructor}
    function showAccount(role='member'){
      if(!api.isAdmin())return;
      api.modal('New account',`<form id="staff-account-form" class="staff-tool-form">${field('Account role',`<select name="role" required>${Object.entries(roles).map(([id,label])=>`<option value="${id}" ${role===id?'selected':''}>${t(label)}</option>`).join('')}</select>`)}<p class="staff-tool-hint" id="staff-role-description"></p><fieldset id="staff-instructor-services" class="staff-service-choices"><legend>${t('Specializations')}</legend>${['yoga','contrast'].map(s=>`<label><input type="checkbox" name="services" value="${s}"><span>${serviceName(s)}</span></label>`).join('')}</fieldset>${field('Full name','<input name="name" required maxlength="60" autocomplete="name">')}${field('Email address','<input name="email" type="email" required maxlength="100" autocomplete="off" autocapitalize="none" spellcheck="false">')}${field('Phone number (optional)','<input name="phone" type="tel" maxlength="30" autocomplete="tel">')}${field('Set a password',`<span class="staff-tool-password"><input name="password" type="password" required minlength="8" maxlength="100" autocomplete="new-password"><button type="button" data-staff-tool="password" aria-label="${t('Show password')}">${t('Show')}</button></span>`)}<p class="staff-tool-hint">${t('Use 8 to 100 characters. Share the sign-in details directly; no email is sent.')}</p><p class="staff-tool-note" id="staff-member-start">${t('New members start with Plus membership, zero points and no passes.')}</p><p class="staff-tool-note" id="staff-instructor-start">${t('Instructor access begins after a session is assigned.')}</p><p class="form-error" role="alert"></p><button class="button auth-submit" type="submit">${t('Create account')}</button></form>`);document.querySelector('#staff-account-form').elements.role.value=role;updateRole(document.querySelector('#staff-account-form'));
    }
    function memberOptions(id,query=''){return `<option value="">${t('Choose a member')}</option>`+api.members().filter(m=>m.id===id||(m.name+' '+m.email).toLowerCase().includes(query.toLowerCase())).map(m=>`<option value="${e(m.id)}" ${m.id===id?'selected':''}>${e(m.name)} · ${e(m.email)}</option>`).join('')}
    function refreshBooking(form,keepSession=true){
      const v=form.elements,previous=keepSession?v.sessionId.value:'',pass=v.passId.value;
      const sessions=api.sessions(v.date.value,v.service.value).filter(s=>!s.cancelled&&SyncInstructor.status(s)==='scheduled'&&sessionStart(s.date,s.time)>Date.now());
      v.sessionId.innerHTML=`<option value="">${t('Choose a session')}</option>`+sessions.map(s=>`<option value="${e(s.id)}" ${s.spaces<1?'disabled':''}>${e(s.time)} · ${e(t(s.title))} · ${s.spaces} / ${s.capacity} ${t('places')}</option>`).join('');
      v.sessionId.value=sessions.some(s=>s.id===previous&&s.spaces>0)?previous:'';
      const selected=sessions.find(s=>s.id===v.sessionId.value),passes=selected&&v.memberId.value?api.passes(v.memberId.value,selected.id):[];
      v.passId.innerHTML=passes.length?passes.map(p=>`<option value="${e(p.id)}">${serviceName(p.service)} · ${p.remaining} ${t('Passes')} · ${t('Expiry date')}: ${e(t(fmt(p.expiry)))}</option>`).join(''):`<option value="">${t(selected&&v.memberId.value?'No eligible passes':'Choose a member and session first.')}</option>`;
      if(passes.some(p=>p.id===pass))v.passId.value=pass;
      v.passId.disabled=!passes.length;
      const chosen=passes.find(p=>p.id===v.passId.value),member=api.members().find(m=>m.id===v.memberId.value),review=form.querySelector('#staff-booking-review');
      review.hidden=!selected||!member;review.innerHTML=selected&&member?`<span class="staff-tool-kicker">${t('Booking review')}</span><strong>${e(member.name)}</strong><p>${e(t(selected.title))} · ${e(t(fmt(selected.date)))} · ${e(selected.time)}</p>${chosen?`<div><span>${t('Pass balance after booking')}</span><b>${chosen.remaining-1} / ${chosen.total}</b></div><small>${t('Booking uses 1 pass. Points stay unchanged; visits count at check-in.')}</small>`:`<p class="staff-booking-missing">${t('Member needs a valid pass for this service on the session date.')}</p>`}`:'';
      form.querySelector('[type=submit]').disabled=!selected||!member||!chosen;
    }
    function showBooking(button){
      if(!api.isStaff())return;
      const preset=api.bookingContext(button.dataset.session),date=preset?.date||api.scheduleDate(),service=preset?.service||'yoga';
      api.modal('Book for member',`<form id="staff-booking-form" class="staff-tool-form"><p class="staff-tool-intro">${t('Choose a member and session, then confirm which pass to use.')}</p>${field('Find a member',`<input type="search" id="staff-booking-member-search" placeholder="${t('Search by name or email')}" autocomplete="off">`)}${field('Member',`<select name="memberId" required>${memberOptions(button.dataset.member||'')}</select>`)}<div class="staff-tool-columns">${field('Date',`<input name="date" type="date" required min="${addDays(0)}" max="${addDays(30)}" value="${e(date)}">`)}${field('Service',`<select name="service">${['yoga','contrast'].map(s=>`<option value="${s}" ${service===s?'selected':''}>${serviceName(s)}</option>`).join('')}</select>`)}</div>${field('Session','<select name="sessionId" required></select>')}${field('Pass to use','<select name="passId" required></select>')}<section class="staff-booking-review" id="staff-booking-review" aria-live="polite" hidden></section><p class="staff-tool-hint">${t('Cancel at least 24 hours before the session to have the pass returned.')}</p><p class="form-error" role="alert"></p><button class="button auth-submit" type="submit">${t('Confirm booking')}</button></form>`);
      const form=document.querySelector('#staff-booking-form');form.elements.memberId.value=button.dataset.member||'';form.elements.service.value=service;refreshBooking(form);if(preset){form.elements.sessionId.value=preset.id;refreshBooking(form)}
    }
    document.addEventListener('input',event=>{
      if(event.target.id==='staff-account-search'&&api.isAdmin()){accountQuery=event.target.value;document.querySelector('#staff-account-results').innerHTML=accountRows()}
      if(event.target.id==='staff-booking-member-search'&&api.isStaff()){const form=event.target.form;form.elements.memberId.innerHTML=memberOptions('',event.target.value);refreshBooking(form)}
    });
    document.addEventListener('change',event=>{
      if(event.target.id==='staff-account-role'&&api.isAdmin()){accountRole=event.target.value;document.querySelector('#staff-account-results').innerHTML=accountRows()}
      if(event.target.matches('#staff-account-form [name=role]')&&api.isAdmin())updateRole(event.target.form);
      if(event.target.matches('#staff-booking-form select,#staff-booking-form [name=date]')&&api.isStaff())refreshBooking(event.target.form,!['date','service'].includes(event.target.name));
    });
    document.addEventListener('click',event=>{
      const b=event.target.closest('[data-staff-tool]');if(!b)return;
      if(b.dataset.staffTool==='create-account')showAccount(b.dataset.role||'member');
      if(b.dataset.staffTool==='book-member')showBooking(b);
      if(b.dataset.staffTool==='password'&&api.isAdmin()){const input=b.closest('form')?.elements.password;if(!input)return;input.type=input.type==='password'?'text':'password';b.textContent=t(input.type==='password'?'Show':'Hide');b.setAttribute('aria-label',t(input.type==='password'?'Show password':'Hide password'))}
    });
    document.addEventListener('submit',async event=>{
      const form=event.target;if(!['staff-account-form','staff-booking-form'].includes(form.id))return;event.preventDefault();
      if(form.dataset.busy||!api.isStaff())return;if(!form.checkValidity()){form.reportValidity();return}
      const isAccount=form.id==='staff-account-form';if(isAccount&&!api.isAdmin())return;
      const data=new FormData(form),values=Object.fromEntries(data),error=form.querySelector('.form-error'),submit=form.querySelector('[type=submit]');values.services=data.getAll('services');
      error.textContent='';form.dataset.busy='true';form.setAttribute('aria-busy','true');submit.disabled=true;
      try{
        const result=await (isAccount?api.createAccount(values,()=>form.isConnected&&document.querySelector('#modal').open):api.book(values));
        if(!form.isConnected)return;
        if(result.error){error.textContent=t(result.error);if(!isAccount){refreshBooking(form);error.focus()}return}
        if(isAccount){form.elements.password.value='';api.close();api.render();api.modal('Account ready',`<div class="staff-account-success"><span aria-hidden="true">✓</span><h3>${e(values.name.trim())}</h3><p>${e(values.email.trim().toLowerCase())}</p><b class="staff-access-role ${result.role}">${t(roles[result.role])}</b></div><p class="staff-tool-intro">${t('They can sign in with this email and the password you set.')}</p><div class="staff-tool-success-actions">${result.role==='member'?`<a class="button" href="#admin-members/${encodeURIComponent(result.id)}/overview" data-staff-tool="success-close">${t('View member profile')}</a>`:''}<button class="button light" data-staff-tool="create-account">${t('Create another account')}</button><button class="staff-tool-text" data-action="close">${t('Done')}</button></div>`);api.toast('Account created.')}
        else{api.close();api.render();api.toast('Booking created for member.')}
      }catch{if(form.isConnected)error.textContent=t('Unable to save changes. Please try again.')}
      finally{delete form.dataset.busy;form.removeAttribute('aria-busy');if(form.isConnected){submit.disabled=false;if(!isAccount)refreshBooking(form)}}
    });
    document.addEventListener('click',event=>{if(event.target.closest('[data-staff-tool=success-close]'))api.close()});
    return {accountsPanel};
  }
  return {create};
})();
