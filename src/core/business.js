/* HandC access rules. Pure state transitions shared by the app and its tests. */
var HandC = (() => {
  const ZONE = 'Asia/Kuala_Lumpur';
  const DAY = 86400000;
  const FOUNDING_LIMIT = 200;
  const CATALOG = Object.freeze([
    {id:'full-day',name:'Full Day Pass',price:70,kind:'entry',start:9,end:21,tag:'Your day. Your pace.'},
    {id:'sunrise',name:'Sunrise Pass',price:30,kind:'entry',start:9,end:12,tag:'A slower kind of morning.'},
    {id:'sunset',name:'Sunset Pass',price:30,kind:'entry',start:18,end:21,tag:'Leave the day behind.'},
    {id:'weekly',name:'Weekly Pass',price:200,kind:'period',days:7,start:9,end:21,tag:'Make a week of it.'},
    {id:'monthly',name:'Monthly Pass',price:500,kind:'period',days:30,start:9,end:21,tag:'A ritual worth keeping.'},
    {id:'founding',name:'Founding Member',price:3000,kind:'annual',start:9,end:21,tag:'Be here from the beginning.'}
  ].map(Object.freeze));
  const product = id => CATALOG.find(p=>p.id===id);
  const copy = value => JSON.parse(JSON.stringify(value));
  const id = prefix => prefix+'-'+crypto.randomUUID();
  function fail(code){const error=new Error(code);error.code=code;throw error}
  function dateKey(now=Date.now()){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const get=key=>parts.find(p=>p.type===key).value;return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function at(date,hour=0){return Date.parse(`${date}T${String(hour).padStart(2,'0')}:00:00+08:00`)}
  function validDate(date){return typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(at(date))&&dateKey(at(date))===date}
  function addDays(date,n){return dateKey(at(date,12)+n*DAY)}
  function anniversary(now){
    const year=Number(dateKey(now).slice(0,4))+1;
    const local=new Date(now+8*3600000),month=local.getUTCMonth(),day=local.getUTCDate();
    const max=new Date(Date.UTC(year,month+1,0)).getUTCDate();
    return Date.UTC(year,month,Math.min(day,max),local.getUTCHours(),local.getUTCMinutes(),local.getUTCSeconds(),local.getUTCMilliseconds())-8*3600000;
  }
  const staff = user => user&&user.active!==false&&['admin','reception','attendant'].includes(user.role);
  const seller = user => user&&user.active!==false&&['admin','reception'].includes(user.role);
  const actor = (db,userId) => db.users.find(u=>u.id===userId&&u.active!==false);
  const foundingSold = db => db.orders.filter(o=>o.productId==='founding').length;
  const foundingRemaining = db => Math.max(0,FOUNDING_LIMIT-foundingSold(db));
  function visitDateError(productId,visitDate,now=Date.now()){
    const p=product(productId);if(!p)return 'unknown-pass';if(p.kind!=='entry')return null;
    if(!validDate(visitDate)||visitDate<dateKey(now)||visitDate>addDays(dateKey(now),90))return 'invalid-visit-date';
    return now>=at(visitDate,p.end)?'window-ended':null;
  }
  function purchase(db,userId,productId,{now=Date.now(),visitDate=dateKey(now),actorId=userId,requestId=id('purchase')}={}){
    const customer=actor(db,userId),by=actor(db,actorId),p=product(productId);
    if(!customer||customer.role!=='member')fail('member-required');
    if(!by||!(seller(by)||by.id===userId&&by.role==='member'))fail('sale-forbidden');
    if(!p)fail('unknown-pass');
    const previous=db.orders.find(o=>o.requestId===requestId);
    if(previous){if(previous.userId!==userId||previous.productId!==productId)fail('request-conflict');return {db:copy(db),order:copy(previous),duplicate:true}}
    if(p.id==='founding'&&foundingRemaining(db)===0)fail('founding-sold-out');
    const dateError=visitDateError(productId,visitDate,now);if(dateError)fail(dateError);
    if(p.kind!=='entry'&&db.passes.some(pass=>pass.userId===userId&&pass.productId===p.id&&pass.validUntil>now))fail('same-membership-active');
    const validFrom=p.kind==='entry'?Math.max(now,at(visitDate,p.start)):now;
    const validUntil=p.kind==='entry'?at(visitDate,p.end):p.kind==='annual'?anniversary(now):now+p.days*DAY;
    const pass={id:id('pass'),userId,productId,purchasedAt:now,validFrom,validUntil,visitDate:p.kind==='entry'?visitDate:null,usedAt:null};
    const order={id:id('HC'),requestId,userId,productId,passId:pass.id,amount:p.price,at:now,actorId:by.id};
    const next=copy(db);next.passes.unshift(pass);next.orders.unshift(order);
    return {db:next,order,pass};
  }
  function passState(pass,now=Date.now()){
    const p=product(pass.productId);if(!p)return 'unavailable';
    if(p.kind==='entry'&&pass.usedAt)return 'used';
    if(now>=pass.validUntil)return 'expired';
    if(now<pass.validFrom)return 'upcoming';
    const date=dateKey(now);
    if(p.kind==='entry'&&date!==pass.visitDate)return 'upcoming';
    if(now<at(date,p.start)||now>=at(date,p.end))return 'outside-hours';
    return 'ready';
  }
  const currentPasses = (db,userId,now=Date.now()) => db.passes.filter(p=>p.userId===userId&&p.validUntil>now&&!p.usedAt);
  function eligiblePasses(db,userId,now=Date.now()){
    // Unlimited membership is used before a single-entry pass, protecting paid entries.
    return db.passes.filter(p=>p.userId===userId&&passState(p,now)==='ready').sort((a,b)=>{
      const priority=p=>product(p.productId).kind==='entry'?1:0;
      return priority(a)-priority(b)||a.validUntil-b.validUntil;
    });
  }
  const inside = db => db.visits.filter(v=>!v.outAt);
  function admissionStatus(db,now=Date.now()){
    const day=dateKey(now);if(now<at(day,9)||now>=at(day,21))return 'closed';
    if(db.settings.admissionsPaused)return 'paused';
    if(db.settings.capacity&&inside(db).length>=db.settings.capacity)return 'capacity';
    return 'open';
  }
  function entryPreview(db,userId,now=Date.now()){
    const user=actor(db,userId);if(!user||user.role!=='member')return {error:'member-required'};
    const existing=inside(db).find(v=>v.userId===userId);if(existing)return {error:'already-inside',visit:existing};
    const status=admissionStatus(db,now),errors={closed:'studio-closed',paused:'admissions-paused',capacity:'capacity-reached'};
    if(errors[status])return {error:errors[status]};
    const day=dateKey(now);
    const pass=eligiblePasses(db,userId,now)[0];if(!pass)return {error:'no-valid-pass'};
    const p=product(pass.productId);return {pass,product:p,leaveBy:Math.min(pass.validUntil,at(day,p.end))};
  }
  function checkIn(db,userId,actorId,now=Date.now()){
    if(!staff(actor(db,actorId)))fail('entry-forbidden');
    const preview=entryPreview(db,userId,now);if(preview.error)fail(preview.error);
    const next=copy(db),pass=next.passes.find(p=>p.id===preview.pass.id);
    if(product(pass.productId).kind==='entry')pass.usedAt=now;
    const visit={id:id('visit'),userId,passId:pass.id,productId:pass.productId,inAt:now,outAt:null,leaveBy:preview.leaveBy,actorId};
    next.visits.unshift(visit);return {db:next,visit};
  }
  function checkOut(db,visitId,actorId,now=Date.now()){
    if(!staff(actor(db,actorId)))fail('entry-forbidden');
    const next=copy(db),visit=next.visits.find(v=>v.id===visitId);
    if(!visit)fail('visit-not-found');if(visit.outAt)fail('already-checked-out');
    if(now<visit.inAt)fail('invalid-time');visit.outAt=now;visit.outBy=actorId;return {db:next,visit};
  }
  function updateStudio(db,actorId,values){
    if(!staff(actor(db,actorId)))fail('entry-forbidden');
    const next=copy(db);
    if('capacity' in values){if(actor(db,actorId).role!=='admin')fail('admin-required');const n=values.capacity;if(n!==null&&(!Number.isInteger(n)||n<1||n>200))fail('invalid-capacity');next.settings.capacity=n}
    if('admissionsPaused' in values)next.settings.admissionsPaused=!!values.admissionsPaused;
    if('note' in values)next.settings.note=String(values.note).trim().slice(0,180);
    if(values.facility){if(!['pools','sauna'].includes(values.facility)||!['available','unavailable'].includes(values.status))fail('invalid-facility');next.settings.facilities[values.facility]=values.status}
    return next;
  }
  function createEnquiry(db,values,now=Date.now()){
    const name=String(values.name||'').trim(),email=String(values.email||'').trim().toLowerCase(),size=Number(values.size),date=String(values.date||''),message=String(values.message||'').trim();
    if(name.length<2||name.length>60||!/^\S+@\S+\.\S+$/.test(email)||email.length>100||!Number.isInteger(size)||size<2||size>100||!validDate(date)||date<dateKey(now)||message.length>1000)fail('invalid-enquiry');
    const next=copy(db);next.enquiries.unshift({id:id('enquiry'),name,email,size,date,message,status:'new',at:now});return next;
  }
  function updateEnquiry(db,enquiryId,status,actorId){
    if(!seller(actor(db,actorId)))fail('sale-forbidden');if(!['new','contacted','closed'].includes(status))fail('invalid-enquiry');
    const next=copy(db),item=next.enquiries.find(e=>e.id===enquiryId);if(!item)fail('invalid-enquiry');item.status=status;return next;
  }
  function seed(now=Date.now()){
    let db={version:2,users:[
      {id:'jamie',number:'HC0001',name:'Jamie Lin',email:'jamie@handc.demo',role:'member',active:true},
      {id:'avery',number:'HC0002',name:'Avery Tan',email:'avery@handc.demo',role:'member',active:true},
      {id:'morgan',number:'HC0003',name:'Morgan Lee',email:'morgan@handc.demo',role:'member',active:true},
      {id:'admin',name:'HandC Admin',email:'admin@handc.demo',role:'admin',active:true},
      {id:'reception',name:'HandC Reception',email:'reception@handc.demo',role:'reception',active:true},
      {id:'attendant',name:'HandC Attendant',email:'attendant@handc.demo',role:'attendant',active:true}
    ],passes:[],orders:[],visits:[],enquiries:[],settings:{capacity:null,admissionsPaused:false,note:'',facilities:{pools:'available',sauna:'available'}}};
    db=purchase(db,'jamie','weekly',{now:now-2*DAY,requestId:'seed-weekly'}).db;
    db=purchase(db,'morgan','monthly',{now:now-7*DAY,requestId:'seed-monthly'}).db;
    return db;
  }
  function validDatabase(db){
    if(!db||db.version!==2||!Array.isArray(db.users)||!Array.isArray(db.passes)||!Array.isArray(db.orders)||!Array.isArray(db.visits)||!Array.isArray(db.enquiries)||!db.settings?.facilities)return false;
    if(new Set(db.users.map(u=>u.id)).size!==db.users.length)return false;
    return db.users.every(u=>u&&typeof u.id==='string'&&typeof u.name==='string'&&typeof u.email==='string'&&['member','admin','reception','attendant'].includes(u.role))&&db.passes.every(p=>p&&product(p.productId)&&db.users.some(u=>u.id===p.userId)&&Number.isFinite(p.validFrom)&&Number.isFinite(p.validUntil)&&p.validUntil>p.validFrom)&&db.orders.every(o=>o&&product(o.productId)&&Number.isFinite(o.amount))&&db.visits.every(v=>v&&db.users.some(u=>u.id===v.userId)&&Number.isFinite(v.inAt)&&Number.isFinite(v.leaveBy));
  }
  return {ZONE,DAY,FOUNDING_LIMIT,CATALOG,product,dateKey,at,addDays,anniversary,staff,seller,actor,foundingSold,foundingRemaining,visitDateError,purchase,passState,currentPasses,eligiblePasses,inside,admissionStatus,entryPreview,checkIn,checkOut,updateStudio,createEnquiry,updateEnquiry,seed,validDatabase};
})();
if(typeof module!=='undefined')module.exports=HandC;
