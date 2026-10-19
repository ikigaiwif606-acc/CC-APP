/* Browser-local account administration. Wallet IDs and historical records never change. */
window.SyncAccountManagement = (() => {
  const roles=['member','instructor','frontdesk','admin'];
  const seedMembers=['jamie','avery','morgan','riley'];
  const clone=value=>JSON.parse(JSON.stringify(value));
  const version=value=>Number.isSafeInteger(value)&&value>=0?value:0;
  function records(db,samples){
    const byId=new Map();
    for(const sample of samples){
      const overrides=db.accountOverrides?.[sample.id]||{};
      byId.set(sample.id,{...sample,...overrides,id:sample.id,sample:true,local:false});
    }
    for(const a of db.accounts||[])byId.set(a.id,{...a,memberId:'jamie',sample:false,local:true});
    for(const m of db.members){
      const previous=byId.get(m.id);
      byId.set(m.id,{...previous,...m,role:m.role||previous?.role||'member',memberId:m.id,
        sample:previous?.sample??seedMembers.includes(m.id),local:previous?.local??(!seedMembers.includes(m.id)||!!m.demoCredential),
        demoCredential:m.demoCredential||previous?.demoCredential});
    }
    return [...byId.values()].filter(a=>roles.includes(a.role)).map(a=>({...a,
      email:String(a.email).trim().toLowerCase(),status:a.status==='inactive'?'inactive':'active',
      revision:version(a.revision),authVersion:version(a.authVersion),services:Array.isArray(a.services)?a.services.filter(s=>['yoga','contrast'].includes(s)):[],
      credential:a.demoCredential,memberId:a.memberId||'jamie',...(a.role==='instructor'?{instructorId:a.id}:{})
    }));
  }
  function create(api){
    const all=db=>records(db,api.samples);
    function editable(db,person){
      let target=db.members.find(m=>m.id===person.id)||db.accounts.find(a=>a.id===person.id);
      if(!target){db.accountOverrides||={};target=db.accountOverrides[person.id]||={}}
      return target;
    }
    const safePhoto=p=>!p||typeof p==='string'&&p.length<150000&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p);
    function update(kind,id,revision,values){
      api.load();
      if(!api.isAdmin())return {error:'Owner access required.'};
      const db=api.db(),actor=all(db).find(a=>a.id===api.actorId()),person=all(db).find(a=>a.id===id);
      if(!actor||actor.role!=='admin'||actor.status!=='active')return {error:'Owner access required.'};
      if(!person)return {error:'This account is no longer available.'};
      if(Number(revision)!==person.revision)return {error:'This profile changed. Close this form and open it again.'};
      const reason=String(values.reason||'').trim();
      if(reason.length<3||reason.length>160)return {error:'Enter a reason between 3 and 160 characters.'};
      const patch={};let action;
      if(kind==='profile'){
        const name=String(values.name||'').trim(),email=String(values.email||'').trim().toLowerCase(),phone=String(values.phone||'').trim();
        if(!name||name.length>60)return {error:'Enter a name between 1 and 60 characters.'};
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>100)return {error:'Enter a valid email address.'};
        if(all(db).some(a=>a.id!==id&&a.email===email))return {error:'This email is already in use.'};
        if(phone&&(!/^[+()0-9\s.-]{6,30}$/.test(phone)||phone.replace(/\D/g,'').length<6))return {error:'Enter a valid phone number.'};
        if(!safePhoto(values.photo))return {error:'This photo could not be saved.'};
        Object.assign(patch,{name,email,phone,photo:values.photo||null});
        if(person.role==='member'){
          const birthday=String(values.birthday||'');
          if(birthday&&(!/^\d{4}-\d{2}-\d{2}$/.test(birthday)||birthday<'1900-01-01'||birthday>api.today()||!Number.isFinite(Date.parse(birthday))||new Date(birthday+'T12:00:00Z').toISOString().slice(0,10)!==birthday))return {error:'Choose a valid birthday in the past.'};
          patch.birthday=birthday;
        }
        if(person.role==='instructor')patch.services=[...new Set(values.services||[])].sort();
        action='Profile updated';
      }else if(kind==='role'){
        if(!roles.includes(values.role))return {error:'Choose a valid account role.'};
        patch.role=values.role;
        if(patch.role==='instructor')patch.services=[...new Set(values.services||[])].sort();
        action='Account role changed';
      }else if(kind==='status'){
        if(!['active','inactive'].includes(values.status))return {error:'Choose a valid account status.'};
        patch.status=values.status;action=values.status==='active'?'Account activated':'Account deactivated';
      }else return {error:'Unable to save changes. Please try again.'};
      const nextPerson={...person,...patch};
      if(nextPerson.role==='instructor'&&(!nextPerson.services.length||nextPerson.services.some(s=>!['yoga','contrast'].includes(s))))return {error:'Choose at least one Instructor specialization.'};
      const fields=Object.keys(patch).filter(key=>JSON.stringify(key==='services'?[...(person[key]||[])].sort():(person[key]??(key==='photo'?null:'')))!==JSON.stringify(patch[key]));
      if(!fields.length)return {error:'No changes to save.'};
      if(person.role==='admin'&&person.status==='active'&&(nextPerson.role!=='admin'||nextPerson.status!=='active')&&all(db).filter(a=>a.role==='admin'&&a.status==='active').length<=1)return {error:'Keep at least one active Admin account.'};
      const future=db.sessions.filter(s=>s.instructorId===id&&!s.cancelled&&s.delivery?.status!=='completed'&&(api.sessionStart(s.date,s.time)+3600000>Date.now()||s.delivery?.status==='in_progress'));
      if(fields.some(f=>['role','status','services'].includes(f))&&future.some(s=>nextPerson.role!=='instructor'||nextPerson.status!=='active'||!nextPerson.services.includes(s.service)))return {error:'Reassign upcoming classes or complete ongoing classes before changing this Instructor’s role, services or status.'};
      const next=clone(db),at=new Date().toISOString();
      if(nextPerson.role==='member'&&!next.members.some(m=>m.id===id)){
        next.members.push({id,name:person.name,email:person.email,phone:person.phone||'',birthday:person.birthday||'',photo:person.photo||null,
          role:'member',status:person.status,services:person.services,revision:person.revision,authVersion:person.authVersion,
          ...(person.createdAt?{createdAt:person.createdAt}:{}),...(person.createdBy?{createdBy:person.createdBy}:{}),
          ...(person.credential?{demoCredential:clone(person.credential)}:{}),wallet:api.emptyWallet(person.name)});
      }
      const target=editable(next,person),authChanged=fields.some(f=>['email','role','status'].includes(f));
      Object.assign(target,patch,{revision:person.revision+1,authVersion:person.authVersion+(authChanged?1:0),updatedAt:at});
      const wallet=next.members.find(m=>m.id===id)?.wallet;if(wallet&&patch.name)wallet.name=patch.name;
      if(fields.includes('email')||fields.includes('role'))delete target.pendingEmailChange;
      if(patch.name)for(const session of next.sessions)if(session.instructorId===id)session.instructor=patch.name;
      next.accountHistory||=[];
      next.accountHistory.unshift({id:crypto.randomUUID(),personId:id,action,at,reason,actorId:actor.id,actorName:actor.name,actorEmail:actor.email,
        changes:fields.map(field=>({field,before:field==='photo'?(person.photo?'Photo set':'No photo'):clone(person[field]??''),after:field==='photo'?(patch.photo?'Photo set':'No photo'):clone(patch[field])}))});
      next.audit.unshift({id:crypto.randomUUID(),action,memberId:next.members.some(m=>m.id===id)?id:null,reason:'Account administration',who:'Owner / Admin',actorId:actor.id,actorName:actor.name,at});
      try{api.commit(next)}catch{return {error:'Unable to save changes. Please try again.'}}
      return {ok:true,id,role:nextPerson.role,status:nextPerson.status,signOut:authChanged&&id===actor.id};
    }
    function history(id){api.load();return api.isAdmin()?clone((api.db().accountHistory||[]).filter(h=>h.personId===id)):[]}
    function activeAdmins(){return api.isAdmin()?all(api.db()).filter(a=>a.role==='admin'&&a.status==='active').length:0}
    return {update,history,activeAdmins};
  }
  return {records,create};
})();
