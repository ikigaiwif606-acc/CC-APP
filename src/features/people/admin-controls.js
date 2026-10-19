/* Admin-only profile forms, role/access controls and recorded change history. */
window.SyncAdminPeople = (() => {
  I18n.extend({
    'Admin controls':'管理員控制','Manage profiles, roles, account access and change history in People.':'前往人員列表，管理個人資料、角色、帳戶存取與變更紀錄。',
    'More actions':'更多操作','Change role':'變更角色','Save role':'儲存角色','Change history':'變更紀錄',
    'Account status':'帳戶狀態','Active':'啟用中','Inactive':'已停用','All statuses':'所有狀態',
    'Activate account':'啟用帳戶','Deactivate account':'停用帳戶','Reason for change':'變更原因',
    'Keep at least one active Admin account.':'請至少保留一個啟用中的管理員帳戶。',
    'Reassign upcoming classes or complete ongoing classes before changing this Instructor’s role, services or status.':'請先重新指派即將開始的課程，或完成進行中的課程，再變更此老師的角色、授課項目或帳戶狀態。',
    'This profile changed. Close this form and open it again.':'此資料已更新，請關閉表單後重新開啟。',
    'This account is no longer available.':'此帳戶已不存在。','Enter a reason between 3 and 160 characters.':'請輸入 3 至 160 個字元的變更原因。',
    'Choose a valid account status.':'請選擇有效的帳戶狀態。','No changes to save.':'尚無需要儲存的變更。',
    'Changing the email signs this person out. Their password stays the same.':'變更電子郵件後，此人員將被登出，密碼維持不變。',
    'Their workspace will change. Existing purchases, passes and attendance are preserved.':'此人員的工作台將隨角色變更，既有購買、堂票與出席紀錄皆會保留。',
    'New member access starts with an empty wallet if no member wallet exists.':'若尚無會員錢包，啟用會員身分時將建立空錢包。',
    'This person will be signed out and cannot sign in. Existing bookings, passes and history are kept.':'此人員將被登出且無法登入；既有預約、堂票與歷史紀錄皆會保留。',
    'They can sign in again using their existing email and password.':'此人員可使用原有電子郵件與密碼重新登入。',
    'Profile updated':'已更新個人資料','Account role changed':'已變更帳戶角色','Account activated':'已啟用帳戶','Account deactivated':'已停用帳戶',
    'Account administration':'帳戶管理','Your account was updated. Sign in again with your current details.':'你的帳戶已更新，請使用目前的帳戶資料重新登入。',
    'Your account access changed. Please sign in again.':'你的帳戶存取權限已變更，請重新登入。',
    'No administrative changes recorded yet.':'尚無管理員變更紀錄。','Before':'變更前','After':'變更後',
    'Photo':'照片','Photo set':'已有照片','No photo':'無照片','Not set':'尚未設定','Show more changes':'顯示更多變更',
    'View membership history':'查看會員歷史資料','Saved member records':'已保留會員紀錄',
    'Account access is inactive.':'此帳戶已停用。','No active Member account is available for preview.':'目前沒有啟用中的會員帳戶可供預覽。'
  });
  const t=I18n.translate,e=escapeHTML;
  const roles={member:'Member',instructor:'Instructor',frontdesk:'Front desk',admin:'Admin'};
  const serviceName=s=>t(s==='yoga'?'Yoga':'Contrast Therapy');
  const field=(label,html)=>`<label class="portal-field"><span>${t(label)}</span>${html}</label>`;
  const photo=p=>typeof p==='string'&&p.length<150000&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p)?p:null;
  function create(api){
    let draftPhoto=null,photoGeneration=0;
    const limits=new Map();
    document.querySelector('#modal').addEventListener('close',()=>{
      if(document.querySelector('#modal').open||!document.querySelector('#admin-person-form'))return;
      photoGeneration++;draftPhoto=null;document.querySelector('#modal-content').replaceChildren();
    });
    document.addEventListener('click',event=>{
      document.querySelectorAll('.admin-person-menu[open]').forEach(menu=>{if(!menu.contains(event.target))menu.open=false});
    });
    document.addEventListener('keydown',event=>{
      if(event.key!=='Escape')return;
      const menu=document.querySelector('.admin-person-menu[open]');if(menu){menu.open=false;menu.querySelector('summary').focus()}
    });
    const lastAdmin=p=>p.role==='admin'&&p.status==='active'&&api.activeAdmins()===1;
    function controls(id){
      if(!api.isAdmin())return '';
      const p=api.person(id);if(!p)return '';
      return `<div class="admin-person-controls"><button class="button admin-person-edit" data-admin-person="profile" data-id="${e(id)}">${t('Edit profile')}</button><details class="admin-person-menu"><summary>${t('More actions')} <span aria-hidden="true">⋯</span></summary><div><button data-admin-person="role" data-id="${e(id)}">${t('Change role')}</button><button data-admin-person="history" data-id="${e(id)}">${t('Change history')}</button><button class="${p.status==='active'?'admin-person-danger':''}" data-admin-person="status" data-id="${e(id)}" ${lastAdmin(p)?`disabled title="${t('Keep at least one active Admin account.')}"`:''}>${t(p.status==='active'?'Deactivate account':'Activate account')}</button>${lastAdmin(p)?`<p>${t('Keep at least one active Admin account.')}</p>`:''}</div></details></div>`;
    }
    function value(change,side){
      const v=change[side];
      if(Array.isArray(v))return v.length?v.map(serviceName).join(' · '):t('Not set');
      if(!v)return t('Not set');
      if(change.field==='role')return t(roles[v]||v);
      if(change.field==='status')return t(v==='active'?'Active':'Inactive');
      return e(['Photo set','No photo'].includes(v)?t(v):v);
    }
    function historyPanel(id){
      if(!api.isAdmin())return '';
      const entries=api.history(id),limit=limits.get(id)||8;
      const fields={name:'Full name',email:'Email address',phone:'Phone number',birthday:'Birthday (optional)',photo:'Photo',services:'Specializations',role:'Account role',status:'Account status'};
      return `<details class="admin-person-history" data-admin-history="${e(id)}"><summary><span>${t('Change history')}</span><span>${entries.length}</span></summary><div class="admin-history-content">${entries.length?entries.slice(0,limit).map(h=>`<article class="admin-history-entry"><header><strong>${t(h.action)}</strong><time datetime="${e(h.at)}">${e(new Intl.DateTimeFormat(I18n.language,{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Taipei'}).format(new Date(h.at)))}</time></header><p class="admin-history-actor">${e(h.actorName)} · ${e(h.actorEmail)}</p><p class="admin-history-reason">${e(h.reason)}</p><dl>${h.changes.map(c=>`<div><dt>${t(fields[c.field]||c.field)}</dt><dd><span><small>${t('Before')}</small>${value(c,'before')}</span><span><small>${t('After')}</small>${value(c,'after')}</span></dd></div>`).join('')}</dl></article>`).join(''):`<p class="admin-history-empty">${t('No administrative changes recorded yet.')}</p>`}${entries.length>limit?`<button class="button light" data-admin-person="more-history" data-id="${e(id)}">${t('Show more changes')}</button>`:''}</div></details>`;
    }
    function services(p){return `<fieldset class="staff-service-choices" id="admin-person-services"><legend>${t('Specializations')}</legend>${['yoga','contrast'].map(s=>`<label><input type="checkbox" name="services" value="${s}" ${(p.services||[]).includes(s)?'checked':''}><span>${serviceName(s)}</span></label>`).join('')}</fieldset>`}
    function updateRole(form){const active=form.elements.role.value==='instructor',choices=form.querySelector('#admin-person-services');choices.hidden=!active;choices.disabled=!active}
    function preview(){return draftPhoto?`<img src="${draftPhoto}" alt="" width="64" height="64">`:'<span aria-hidden="true">◎</span>'}
    function show(kind,id){
      if(!api.isAdmin())return;
      const p=api.person(id);if(!p)return;
      photoGeneration++;draftPhoto=photo(p.photo);
      const reason=field('Reason for change','<input name="reason" required minlength="3" maxlength="160" autocomplete="off">');
      let body='',title,submit;
      if(kind==='profile'){
        title='Edit profile';submit='Save changes';
        body=`<div class="admin-photo-editor"><div id="admin-photo-preview">${preview()}</div><div><label class="admin-photo-upload">${t('Change photo')}<input id="admin-photo-file" type="file" accept="image/jpeg,image/png,image/webp"></label><button type="button" data-admin-person="remove-photo">${t('Remove photo')}</button><small>${t('JPG, PNG or WebP, up to 5 MB.')}</small></div></div><p id="admin-photo-error" class="form-error" role="alert"></p>${field('Full name',`<input name="name" required maxlength="60" value="${e(p.name)}" autocomplete="off">`)}${field('Email address',`<input name="email" type="email" required maxlength="100" value="${e(p.email)}" autocomplete="off" autocapitalize="none" spellcheck="false">`)}<p class="admin-person-note">${t('Changing the email signs this person out. Their password stays the same.')}</p>${field('Phone number (optional)',`<input name="phone" type="tel" maxlength="30" value="${e(p.phone||'')}" autocomplete="off">`)}${p.role==='member'?field('Birthday (optional)',`<input name="birthday" type="date" min="1900-01-01" max="${addDays(0)}" value="${e(p.birthday||'')}">`):''}${p.role==='instructor'?services(p):''}${reason}`;
      }else if(kind==='role'){
        title='Change role';submit='Save role';
        body=`<p class="admin-person-note">${t('Their workspace will change. Existing purchases, passes and attendance are preserved.')}</p>${lastAdmin(p)?`<p class="admin-person-warning">${t('Keep at least one active Admin account.')}</p>`:''}${field('Account role',`<select name="role">${Object.entries(roles).map(([id,label])=>`<option value="${id}" ${p.role===id?'selected':''} ${lastAdmin(p)&&id!=='admin'?'disabled':''}>${t(label)}</option>`).join('')}</select>`)}${services(p)}<p class="admin-person-note">${t('New member access starts with an empty wallet if no member wallet exists.')}</p>${reason}`;
      }else if(kind==='status'){
        title=p.status==='active'?'Deactivate account':'Activate account';submit=title;
        body=`<p class="admin-person-warning">${t(p.status==='active'?'This person will be signed out and cannot sign in. Existing bookings, passes and history are kept.':'They can sign in again using their existing email and password.')}</p><input type="hidden" name="status" value="${p.status==='active'?'inactive':'active'}">${reason}`;
      }else return;
      api.modal(title,`<form id="admin-person-form" class="staff-tool-form admin-person-form" data-id="${e(id)}" data-revision="${p.revision}" data-kind="${kind}"><div class="admin-edit-identity"><strong>${e(p.name)}</strong><span>${t(roles[p.role])} · ${e(p.email)}</span></div>${body}<p class="form-error admin-person-error" role="alert"></p><div class="admin-form-actions"><button class="button light" type="button" data-action="close">${t('Cancel')}</button><button class="button ${kind==='status'&&p.status==='active'?'admin-person-danger-button':''}" type="submit">${t(submit)}</button></div></form>`);
      if(kind==='role')updateRole(document.querySelector('#admin-person-form'));
    }
    document.addEventListener('click',event=>{
      const b=event.target.closest('[data-admin-person]');if(!b||!api.isAdmin())return;
      b.closest('.admin-person-menu')?.removeAttribute('open');
      const action=b.dataset.adminPerson,id=b.dataset.id;
      if(['profile','role','status'].includes(action))show(action,id);
      if(action==='remove-photo'){
        photoGeneration++;draftPhoto=null;const form=b.closest('form');delete form.dataset.photoBusy;
        form.querySelector('[type=submit]').disabled=false;form.querySelector('#admin-photo-preview').innerHTML=preview();form.querySelector('#admin-photo-file').value='';form.querySelector('#admin-photo-error').textContent='';
      }
      if(action==='history'){const history=document.querySelector('.admin-person-history');if(history){history.open=true;history.scrollIntoView({block:'start',behavior:'auto'});history.querySelector('summary').focus()}}
      if(action==='more-history'){limits.set(id,(limits.get(id)||8)+8);const current=b.closest('.admin-person-history');current.outerHTML=historyPanel(id);const next=document.querySelector('.admin-person-history');if(next){next.open=true;next.querySelector('summary').focus()}}
    });
    document.addEventListener('change',async event=>{
      if(!api.isAdmin())return;
      if(event.target.matches('#admin-person-form [name=role]'))updateRole(event.target.form);
      if(event.target.id!=='admin-photo-file')return;
      const form=event.target.closest('form'),file=event.target.files?.[0],error=form.querySelector('#admin-photo-error'),generation=++photoGeneration;
      if(!file)return;error.textContent='';
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){error.textContent=t('Choose a JPG, PNG or WebP image under 5 MB.');return}
      const submit=form.querySelector('[type=submit]');submit.disabled=true;form.dataset.photoBusy='true';
      try{
        const image=new Image(),source=URL.createObjectURL(file);
        try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=source})}finally{URL.revokeObjectURL(source)}
        if(!form.isConnected||generation!==photoGeneration||!api.isAdmin())return;
        const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;const context=canvas.getContext('2d'),size=Math.min(image.naturalWidth,image.naturalHeight);
        context.drawImage(image,(image.naturalWidth-size)/2,(image.naturalHeight-size)/2,size,size,0,0,160,160);draftPhoto=canvas.toDataURL('image/jpeg',.85);form.querySelector('#admin-photo-preview').innerHTML=preview();
      }catch{if(error.isConnected&&generation===photoGeneration)error.textContent=t('This photo could not be opened. Choose another image.')}
      finally{if(submit.isConnected&&generation===photoGeneration){delete form.dataset.photoBusy;submit.disabled=false}}
    });
    document.addEventListener('submit',event=>{
      const form=event.target;if(form.id!=='admin-person-form')return;event.preventDefault();
      if(!api.isAdmin()||form.dataset.busy||form.dataset.photoBusy)return;
      if(!form.checkValidity()){form.reportValidity();return}
      const data=new FormData(form),values=Object.fromEntries(data);values.services=data.getAll('services');values.photo=draftPhoto;
      const error=form.querySelector('.admin-person-error'),submit=form.querySelector('[type=submit]');
      form.dataset.busy='true';form.setAttribute('aria-busy','true');submit.disabled=true;error.textContent='';
      try{
        const result=api.update(form.dataset.kind,form.dataset.id,form.dataset.revision,values);
        if(result.error){if(form.isConnected)error.textContent=t(result.error);return}
        if(result.signOut){api.signOut();return}
        api.close();api.go(result.id,result.role);api.toast(form.dataset.kind==='profile'?'Profile updated':form.dataset.kind==='role'?'Account role changed':result.status==='active'?'Account activated':'Account deactivated');
      }catch{if(form.isConnected)error.textContent=t('Unable to save changes. Please try again.')}
      finally{if(form.isConnected){delete form.dataset.busy;form.removeAttribute('aria-busy');submit.disabled=false}}
    });
    return {controls,historyPanel};
  }
  return {create};
})();
