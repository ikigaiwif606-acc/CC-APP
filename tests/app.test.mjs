import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {test} from 'node:test';
import {Window} from 'happy-dom';
const require=createRequire(import.meta.url),H=require('../src/core/business.js');
const root=fileURLToPath(new URL('../',import.meta.url)),html=readFileSync(root+'index.html','utf8');
const markup=html.replace(/<script[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link[^>]*>/g,'');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>readFileSync(root+m[1].split('?')[0],'utf8')).join('\n');
const NOW=Date.parse('2026-10-20T10:15:30+08:00');
const at=(date,hour)=>H.at(date,hour),q=(w,s)=>{const el=w.document.querySelector(s);assert.ok(el,'Missing '+s);return el};
const db=w=>JSON.parse(w.localStorage.getItem('handc-thermal-v2'));
const wait=()=>new Promise(r=>setTimeout(r,15));
async function settle(){await wait();await wait()}
async function go(w,route){w.location.hash=route;await settle()}
async function submit(w,selector){q(w,selector).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await settle()}
function boot(t,{language='en',userId,route='home',theme,motion,reducedMotion=false,audioMock,musicPreference,clock,database}={}){
 const w=new Window({url:'https://handc.test/#'+route,settings:{enableJavaScriptEvaluation:true,suppressInsecureJavaScriptEnvironmentWarning:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
 t.after(()=>w.happyDOM.abort());w.document.write(markup);w.localStorage.setItem('handc-locale',language);
 // Fix the browser clock to a Malaysian opening hour, independent of CI timezone.
 w.Date.now=()=>clock?.now??NOW;w.structuredClone=structuredClone;
 if(clock){const interval=w.setInterval.bind(w);w.setInterval=(fn,delay)=>{if(delay===1000){clock.tick=fn;return 0}return interval(fn,delay)}}
 if(database)w.localStorage.setItem('handc-thermal-v2',JSON.stringify(database));
 if(musicPreference)w.localStorage.setItem('handc-music',musicPreference);if(theme)w.localStorage.setItem('handc-theme',theme);if(motion)w.localStorage.setItem('handc-motion',motion);
 w.matchMedia=()=>({matches:reducedMotion,addEventListener(){}});if(audioMock){w.AudioContext=audioMock.Context;w.fetch=audioMock.fetch}
 if(userId)w.sessionStorage.setItem('handc-thermal-session',JSON.stringify({userId}));
 w.eval(scripts);return w;
}
function throws(code,run){assert.throws(run,error=>error.code===code)}
function buy(productId,options={}){return H.purchase(H.seed(NOW),'avery',productId,{now:NOW,...options})}

test('six exact prices and access windows; every duration pass has unlimited admission',()=>{
 assert.deepEqual(H.CATALOG.map(p=>[p.id,p.price,p.start,p.end]),[['full-day',70,9,21],['sunrise',30,9,12],['sunset',30,18,21],['weekly',200,9,21],['monthly',500,9,21],['founding',3000,9,21]]);
 assert.equal(H.FOUNDING_LIMIT,200);assert.equal(H.ZONE,'Asia/Kuala_Lumpur');
});
test('single-entry sunrise consumes on staff confirmation, leaves by noon and cannot re-enter',()=>{
 let {db,pass}=buy('sunrise');assert.equal(H.passState(pass,NOW),'ready');
 const result=H.checkIn(db,'avery','reception',NOW);db=result.db;
 assert.equal(result.visit.leaveBy,at('2026-10-20',12));assert.equal(db.passes[0].usedAt,NOW);
 throws('already-inside',()=>H.checkIn(db,'avery','reception',NOW));
 db=H.checkOut(db,result.visit.id,'attendant',NOW+60000).db;
 assert.equal(H.entryPreview(db,'avery',NOW+120000).error,'no-valid-pass');
 throws('already-checked-out',()=>H.checkOut(db,result.visit.id,'reception',NOW+120000));
});
test('daily tickets honour exact Malaysian boundaries and chosen date',()=>{
 const sunrise=buy('sunrise').pass;assert.equal(H.passState(sunrise,at('2026-10-20',12)),'expired');
 const sunset=buy('sunset').pass;assert.equal(H.passState(sunset,at('2026-10-20',17)),'upcoming');assert.equal(H.passState(sunset,at('2026-10-20',18)),'ready');assert.equal(H.passState(sunset,at('2026-10-20',21)),'expired');
 const future=buy('full-day',{visitDate:'2026-10-21'}).pass;assert.equal(H.passState(future,NOW),'upcoming');assert.equal(H.passState(future,at('2026-10-21',9)),'ready');
 throws('invalid-visit-date',()=>buy('full-day',{visitDate:'2026-99-99'}));throws('invalid-visit-date',()=>buy('full-day',{visitDate:'2026-10-19'}));throws('invalid-visit-date',()=>buy('full-day',{visitDate:'2027-03-01'}));
 throws('window-ended',()=>buy('sunrise',{now:at('2026-10-20',12)}));
});
test('duration validity starts at purchase, runs continuously and ends at exact timestamp',()=>{
 for(const [id,days] of [['weekly',7],['monthly',30]]){
  const p=buy(id).pass;assert.equal(p.validFrom,NOW);assert.equal(p.validUntil,NOW+days*H.DAY);assert.equal(H.passState(p,p.validUntil),'expired');
  const night=buy(id,{now:at('2026-10-20',23)}).pass;assert.equal(night.validFrom,at('2026-10-20',23));assert.equal(H.passState(night,night.validFrom),'outside-hours');
 }
 assert.equal(buy('founding').pass.validUntil,Date.parse('2027-10-20T10:15:30+08:00'));
 const leap=Date.parse('2028-02-29T10:15:30+08:00');assert.equal(H.anniversary(leap),Date.parse('2029-02-28T10:15:30+08:00'));
});
test('unlimited membership supports repeat entries after departure, and expires mid-visit',()=>{
 for(const type of ['weekly','monthly','founding']){
  let {db,pass}=buy(type);
  for(let i=0;i<5;i++){
   const now=NOW+i*120000,result=H.checkIn(db,'avery','attendant',now);db=result.db;
   assert.equal(db.passes[0].usedAt,null);assert.equal(result.visit.leaveBy,at('2026-10-20',21));
   db=H.checkOut(db,result.visit.id,'reception',now+60000).db;
  }
  assert.equal(db.visits.length,5);assert.equal(H.eligiblePasses(db,'avery',NOW+600000).length,1);
  const final=H.checkIn(db,'avery','admin',pass.validUntil-60000);assert.equal(final.visit.leaveBy,pass.validUntil);
  assert.equal(H.entryPreview(final.db,'avery',pass.validUntil+1).error,'already-inside');
 }
});
test('eligible membership protects a finite day ticket; all entries end by closing',()=>{
 let {db,pass}=buy('full-day');db=H.purchase(db,'avery','weekly',{now:NOW}).db;
 const result=H.checkIn(db,'avery','admin',at('2026-10-20',20));assert.equal(result.visit.productId,'weekly');assert.equal(result.db.passes.find(p=>p.id===pass.id).usedAt,null);assert.equal(result.visit.leaveBy,at('2026-10-20',21));
 assert.equal(H.entryPreview(db,'avery',at('2026-10-20',21)).error,'studio-closed');assert.equal(H.entryPreview(db,'avery',at('2026-10-20',8)).error,'studio-closed');
});
test('founding allocation enforces 200 saved purchases and idempotent retries',()=>{
 let db=H.seed(NOW);
 for(let i=0;i<201;i++)db.users.push({id:'founder-'+i,name:'Sample '+i,email:'sample'+i+'@example.test',role:'member',active:true});
 for(let i=0;i<200;i++)db=H.purchase(db,'founder-'+i,'founding',{now:NOW,requestId:'founder-'+i}).db;
 assert.equal(H.foundingSold(db),200);assert.equal(H.foundingRemaining(db),0);
 const repeat=H.purchase(db,'founder-0','founding',{now:NOW,requestId:'founder-0'});assert.equal(repeat.duplicate,true);assert.equal(H.foundingSold(repeat.db),200);
 throws('founding-sold-out',()=>H.purchase(db,'founder-200','founding',{now:NOW}));
 throws('request-conflict',()=>H.purchase(db,'founder-1','founding',{now:NOW,requestId:'founder-0'}));
});
test('staff role boundaries, active members, occupancy and admissions pause are enforced at mutation',()=>{
 const {db}=buy('weekly');
 throws('sale-forbidden',()=>H.purchase(db,'avery','monthly',{now:NOW,actorId:'attendant'}));throws('sale-forbidden',()=>H.purchase(db,'avery','monthly',{now:NOW,actorId:'jamie'}));
 throws('entry-forbidden',()=>H.checkIn(db,'avery','jamie',NOW));throws('admin-required',()=>H.updateStudio(db,'reception',{capacity:12}));
 let limited=H.updateStudio(db,'admin',{capacity:1});limited=H.checkIn(limited,'jamie','attendant',NOW).db;
 assert.equal(H.entryPreview(limited,'avery',NOW).error,'capacity-reached');
 const paused=H.updateStudio(db,'attendant',{admissionsPaused:true});assert.equal(H.entryPreview(paused,'avery',NOW).error,'admissions-paused');
 const inactive=structuredClone(db);inactive.users.find(u=>u.id==='avery').active=false;assert.equal(H.entryPreview(inactive,'avery',NOW).error,'member-required');
 assert.equal(db.settings.capacity,null);assert.equal(db.visits.length,0);
});
test('group requests validate details and remain enquiries until reviewed',()=>{
 const db=H.createEnquiry(H.seed(NOW),{name:'Sample Guest',email:'guest@example.test',size:4,date:'2026-10-21',message:'Quiet afternoon'},NOW);
 assert.equal(db.enquiries[0].status,'new');assert.equal(db.visits.length,0);
 throws('sale-forbidden',()=>H.updateEnquiry(db,db.enquiries[0].id,'contacted','attendant'));
 assert.equal(H.updateEnquiry(db,db.enquiries[0].id,'contacted','reception').enquiries[0].status,'contacted');
 throws('invalid-enquiry',()=>H.createEnquiry(db,{name:'X',email:'bad',size:2,date:'2026-10-21'},NOW));
});
test('public catalogue, studio themes and fresh storage have no legacy services',async t=>{
 const w=boot(t);assert.match(q(w,'h1').textContent,/Cold. Heat/);assert.equal(w.document.querySelector('#auth-form'),null);assert.equal(db(w).version,2);
 await go(w,'passes');assert.equal(w.document.querySelectorAll('.pass-card').length,6);assert.match(q(w,'#product-founding').textContent,/3,000/);assert.match(q(w,'#product-weekly').textContent,/Unlimited entries/);
 assert.doesNotMatch(q(w,'#app').textContent,/yoga|instructor|NT\$|Taipei/i);
 assert.equal(w.document.documentElement.dataset.theme,'night');q(w,'[data-action=theme]').click();assert.equal(w.document.documentElement.dataset.theme,'day');
 await go(w,'studio');q(w,'[data-action=scene][data-scene=sauna]').click();assert.match(q(w,'.studio-gallery img').getAttribute('src'),/sauna-day.webp/);
});
for(const [userId,routes] of [['jamie',['home','passes','wallet','visits','studio','account']],['admin',['staff-home','staff-entry','staff-members','staff-sales','staff-enquiries','staff-studio','account']],['reception',['staff-home','staff-entry','staff-members','staff-sales','staff-enquiries','staff-studio']],['attendant',['staff-home','staff-entry','staff-studio']]])test(userId+' workspace routes and capabilities',async t=>{
 const w=boot(t,{userId,route:routes[0]});for(const route of routes){await go(w,route);assert.ok(q(w,'#app h1').textContent);assert.equal(w.document.querySelector('#auth-form'),null)}
 if(userId==='attendant'){assert.equal(w.document.querySelector('[href="#staff-sales"]'),null);await go(w,'staff-sales');assert.equal(w.location.hash,'#staff-home')}
 if(userId==='jamie'){await go(w,'staff-entry');assert.equal(w.location.hash,'#home')}
 if(userId==='reception')assert.equal(w.document.querySelector('[name=capacity]'),null);
});
test('purchase intent survives sign-in and only confirmation creates a pass',async t=>{
 const w=boot(t,{route:'passes'});q(w,'[data-action=buy][data-product=monthly]').click();assert.ok(q(w,'[data-form=guest-purchase]'));assert.equal(w.location.hash,'#passes');assert.equal(db(w).orders.length,2);
 await submit(w,'[data-form=guest-purchase]');assert.equal(w.location.hash,'#login');assert.match(q(w,'[data-purchase-context]').textContent,/Monthly Pass/);
 q(w,'[name=email]').value='jamie@handc.demo';q(w,'[name=password]').value='wrong';await submit(w,'#auth-form');assert.match(q(w,'.form-error').textContent,/incorrect/);
 q(w,'[name=password]').value='HandCDemo2026!';await submit(w,'#auth-form');assert.ok(q(w,'#modal').open);assert.ok(q(w,'[data-form=purchase]'));
 assert.equal(db(w).orders.length,2);assert.match(q(w,'#modal-content').textContent,/Unlimited entries/);await submit(w,'[data-form=purchase]');
 assert.equal(db(w).orders.length,3);assert.equal(db(w).passes[0].productId,'monthly');assert.equal(db(w).passes[0].validFrom,NOW);assert.match(q(w,'#modal-content').textContent,/Your pass is ready/);
});
test('entry code display never consumes a pass; staff scan/manual flow records repeat entries',async t=>{
 const w=boot(t,{userId:'jamie'}),before=JSON.stringify(db(w));q(w,'[data-action=qr]').click();assert.ok(q(w,'.qr-code svg'));assert.equal(JSON.stringify(db(w)),before);
 q(w,'[data-action=close]').click();q(w,'[data-action=logout]').click();await settle();await go(w,'login');q(w,'[data-action=demo-fill][data-member=attendant]').click();await submit(w,'#auth-form');await go(w,'staff-entry');
 q(w,'[data-action=scan]').click();q(w,'[data-form=scan-code] [name=code]').value='HANDC:ENTRY:jamie';await submit(w,'[data-form=scan-code]');assert.match(q(w,'#modal-content').textContent,/Confirm this entry/);
 q(w,'[data-action=confirm-entry]').click();await settle();assert.equal(db(w).visits.length,1);assert.equal(db(w).passes.find(p=>p.userId==='jamie').usedAt,null);
 q(w,'[data-action=checkout]').click();q(w,'[data-action=confirm-checkout]').click();await settle();assert.equal(db(w).visits[0].outAt,NOW);
 q(w,'[data-action=entry-review]').click();q(w,'[data-action=confirm-entry]').click();await settle();assert.equal(db(w).visits.length,2);
});
test('Traditional Chinese covers the catalogue, checkout and entry information',async t=>{
 const w=boot(t,{language:'zh-TW',userId:'jamie',route:'passes'});assert.equal(w.document.documentElement.lang,'zh-TW');assert.match(q(w,'h1').textContent,/重整/);assert.match(q(w,'#product-weekly').textContent,/不限次入場/);
 q(w,'[data-action=buy][data-product=sunrise]').click();assert.match(q(w,'#modal-content').textContent,/中午 12/);assert.match(q(w,'#modal-content').textContent,/不會收取真實款項/);
 q(w,'[data-action=close]').click();await go(w,'wallet');assert.match(q(w,'#app').textContent,/自購買時起連續/);
});
test('registration hashes credentials, escapes member content and supports the purchased wallet',async t=>{
 const w=boot(t,{route:'register'});w.sessionStorage.setItem('handc-pending-product','full-day');q(w,'[name=name]').value='<Sample Guest>';q(w,'[name=email]').value='guest@example.test';q(w,'[name=password]').value='SamplePassword123!';
 await submit(w,'#auth-form');for(let i=0;i<100&&w.location.hash==='#register';i++)await wait();await settle();
 assert.equal(w.location.hash,'#home',w.document.querySelector('.form-error')?.textContent);const u=db(w).users.find(u=>u.email==='guest@example.test');assert.ok(u.credential.hash);assert.notEqual(u.credential.hash,'SamplePassword123!');assert.ok(!JSON.stringify(db(w)).includes('SamplePassword123!'));assert.equal(w.document.querySelector('sample'),null);
 assert.ok(q(w,'[data-form=purchase]'));assert.equal(w.sessionStorage.getItem('handc-pending-product'),null);await submit(w,'[data-form=purchase]');assert.equal(db(w).passes[0].userId,u.id);await go(w,'wallet');assert.match(q(w,'#app').textContent,/Full Day Pass/);
});

test('failed persistence shows an error without reporting a successful purchase',async t=>{
 const w=boot(t,{userId:'jamie',route:'passes'}),before=JSON.stringify(db(w));q(w,'[data-action=buy][data-product=monthly]').click();
 const descriptor=Object.getOwnPropertyDescriptor(w,'localStorage'),storage=w.localStorage;try{Object.defineProperty(w,'localStorage',{configurable:true,value:{getItem:storage.getItem.bind(storage),setItem(){throw new Error('Quota exceeded')}}});await submit(w,'[data-form=purchase]')}finally{Object.defineProperty(w,'localStorage',descriptor)}
 assert.match(q(w,'.form-error').textContent,/could not be saved/);assert.equal(JSON.stringify(db(w)),before);assert.ok(q(w,'[data-form=purchase]'));assert.equal(q(w,'[data-form=purchase] button[type=submit]').disabled,false);
});
test('purchase confirmation rechecks inventory against a newer saved database',async t=>{
 const w=boot(t,{userId:'jamie',route:'passes'});q(w,'[data-action=buy][data-product=founding]').click();const latest=db(w);
 for(let i=0;i<200;i++)latest.orders.push({id:'allocated-'+i,requestId:'allocated-'+i,productId:'founding',userId:'avery',amount:3000,at:NOW});
 w.localStorage.setItem('handc-thermal-v2',JSON.stringify(latest));await submit(w,'[data-form=purchase]');
 assert.match(q(w,'.form-error').textContent,/All 200/);assert.equal(db(w).passes.filter(p=>p.productId==='founding').length,0);
});

function audioHarness({fail=false,hold=false,blocked=false}={}){
 const calls={contexts:0,resumes:0,suspends:0,fetches:0,sources:[],tones:[],nodes:[],analysers:[],spectrumReads:0};let release,allowed=!blocked;
 class Param{value=0;setValueAtTime(v){this.value=v}setTargetAtTime(v){this.value=v}linearRampToValueAtTime(v){this.value=v}exponentialRampToValueAtTime(v){this.value=v}cancelScheduledValues(){}}
 class Node{gain=new Param();frequency=new Param();threshold=new Param();knee=new Param();ratio=new Param();attack=new Param();release=new Param();connections=[];connect(node){this.connections.push(node)}disconnect(){this.disconnected=true}start(at=0){this.started=at}stop(at=0){this.stopped=at;this.onended?.()}}
 class Context{
  state='suspended';currentTime=1;destination={};constructor(){calls.contexts++}resume(){calls.resumes++;if(!allowed)return new Promise(()=>{});this.state='running';return Promise.resolve()}suspend(){calls.suspends++;this.state='suspended';return Promise.resolve()}addEventListener(){}
  createGain(){const n=new Node();calls.nodes.push(n);return n}createDynamicsCompressor(){return new Node()}createAnalyser(){const n=new Node();n.frequencyBinCount=512;n.getByteFrequencyData=data=>{calls.spectrumReads++;data.fill(180)};calls.analysers.push(n);return n}createBufferSource(){const n=new Node();calls.sources.push(n);return n}createOscillator(){const n=new Node();calls.tones.push(n);return n}decodeAudioData(){return Promise.resolve({duration:36.9231})}
 }
 const fetch=async()=>{calls.fetches++;if(hold)await new Promise(r=>release=r);if(fail)throw new Error('Offline');return {ok:true,arrayBuffer:async()=>new ArrayBuffer(8)}};
 return {Context,fetch,calls,release:()=>release?.(),allow:()=>{allowed=true}};
}

test('night is the fresh default; an explicit day preference is preserved',t=>{
 const w=boot(t);assert.equal(w.document.documentElement.dataset.theme,'night');assert.equal(q(w,'meta[name=theme-color]').content,'#111311');assert.match(q(w,'.scene-visual img').src,/pools-night/);
 const day=boot(t,{theme:'day'});assert.equal(day.document.documentElement.dataset.theme,'day');assert.match(q(day,'.scene-visual img').src,/pools-day/);
 assert.match(html,/<html lang="en" data-theme="night">/);assert.ok(html.indexOf("localStorage.getItem('handc-theme')")<html.indexOf('rel="stylesheet"'));
});
test('motion pause, manual scene selection and reduced motion leave content available',async t=>{
 const w=boot(t);assert.equal(w.document.documentElement.dataset.motion,'full');q(w,'[data-experience=motion]').click();assert.equal(w.document.documentElement.dataset.motion,'paused');assert.equal(w.localStorage.getItem('handc-motion'),'paused');
 q(w,'[data-experience=stage][data-step="2"]').click();assert.equal(q(w,'.thermal-stage').dataset.step,'2');assert.equal(q(w,'.scene-reception').getAttribute('aria-hidden'),'false');assert.equal(q(w,'.scene-pools').getAttribute('aria-hidden'),'true');
 await go(w,'passes');await go(w,'home');assert.equal(w.document.documentElement.dataset.motion,'paused');assert.match(q(w,'[data-experience=motion]').textContent,/Resume/);
 const reduced=boot(t,{reducedMotion:true});assert.equal(reduced.document.documentElement.dataset.motion,'reduced');assert.equal(q(reduced,'[data-experience=motion]').disabled,true);q(reduced,'[data-experience=stage][data-step="1"]').click();assert.equal(q(reduced,'.thermal-stage').dataset.step,'1');
});
test('default music starts without controls when autoplay is allowed and continues across routes',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio});await settle();assert.equal(audio.calls.contexts,1);assert.equal(audio.calls.fetches,1);assert.equal(w.HandCExperience.state.music,true);assert.equal(w.HandCExperience.state.effects,false);assert.equal(w.document.querySelector('#sound-panel').open,false);
 assert.equal(audio.calls.sources[0].loop,true);assert.ok(Math.abs(audio.calls.sources[0].loopEnd-60/104*64)<.001);
 await go(w,'passes');assert.equal(audio.calls.sources.length,1);assert.equal(w.HandCExperience.state.music,true);
 q(w,'#sound-button').click();assert.match(q(w,'#sound-message').textContent,/Playing/);q(w,'[data-experience=mute]').click();assert.equal(w.HandCExperience.state.music,false);assert.equal(w.localStorage.getItem('handc-music'),'off');assert.ok(audio.calls.sources[0].disconnected);
});
test('blocked autoplay waits without loading music, then starts on the first ordinary click',async t=>{
 const audio=audioHarness({blocked:true}),w=boot(t,{audioMock:audio});await settle();assert.equal(w.HandCExperience.state.waitingForGesture,true);assert.equal(w.HandCExperience.state.music,false);assert.equal(audio.calls.fetches,0);assert.match(q(w,'#sound-button').getAttribute('aria-label'),/ready/);
 audio.allow();q(w,'[data-action=theme]').click();await settle();assert.equal(w.HandCExperience.state.music,true);assert.equal(w.HandCExperience.state.waitingForGesture,false);assert.equal(audio.calls.fetches,1);assert.equal(audio.calls.sources.length,1);assert.equal(q(w,'#sound-panel').open,false);
});
test('keyboard activation also starts default music; mute cancels pending autoplay',async t=>{
 const audio=audioHarness({blocked:true}),w=boot(t,{audioMock:audio});audio.allow();q(w,'[data-action=theme]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await settle();assert.equal(w.HandCExperience.state.music,true);
 const blocked=audioHarness({blocked:true}),m=boot(t,{audioMock:blocked});q(m,'#sound-panel').showModal();q(m,'[data-experience=mute]').click();assert.equal(m.HandCExperience.state.waitingForGesture,false);assert.equal(m.localStorage.getItem('handc-music'),'off');blocked.allow();q(m,'[data-action=theme]').click();await settle();assert.equal(blocked.calls.fetches,0);assert.equal(m.HandCExperience.state.music,false);
});
test('a remembered mute prevents automatic audio setup and can be overridden explicitly',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio,musicPreference:'off'});await settle();assert.equal(audio.calls.contexts,0);q(w,'[data-action=theme]').click();await settle();assert.equal(audio.calls.contexts,0);
 q(w,'#sound-button').click();q(w,'[data-experience=music]').click();await settle();assert.equal(w.HandCExperience.state.music,true);assert.equal(w.localStorage.getItem('handc-music'),'on');
});
test('button and keyboard activation sound once; disabled controls and muting stay silent',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio,musicPreference:'off'});q(w,'#sound-button').click();q(w,'[data-experience=effects]').click();await settle();assert.equal(w.HandCExperience.state.effects,true);assert.equal(audio.calls.fetches,0);
 q(w,'[data-experience=sound-close]').click();await settle();audio.calls.tones.length=0;
 // click() represents the browser click generated by mouse, touch or keyboard activation.
 q(w,'[data-action=theme]').click();await settle();assert.equal(audio.calls.tones.length,2);assert.ok(audio.calls.tones.every(n=>n.disconnected));
 const disabled=w.document.createElement('button');disabled.disabled=true;w.document.body.append(disabled);const before=audio.calls.tones.length;disabled.click();await settle();assert.equal(audio.calls.tones.length,before);
 q(w,'#sound-button').click();q(w,'[data-experience=mute]').click();await settle();audio.calls.tones.length=0;q(w,'[data-experience=sound-close]').click();q(w,'[data-action=theme]').click();await settle();assert.equal(audio.calls.tones.length,0);
});
test('audio failure and cancellation never report playback or affect app actions',async t=>{
 const failed=audioHarness({fail:true}),w=boot(t,{audioMock:failed,musicPreference:'off'});q(w,'#sound-button').click();q(w,'[data-experience=music]').click();await settle();assert.equal(w.HandCExperience.state.music,false);assert.match(q(w,'#sound-message').textContent,/could not start/);assert.equal(failed.calls.sources.length,0);q(w,'[data-experience=sound-close]').click();await go(w,'passes');assert.equal(w.document.querySelectorAll('.pass-card').length,6);
 const slow=audioHarness({hold:true}),s=boot(t,{audioMock:slow,musicPreference:'off'});q(s,'#sound-button').click();q(s,'[data-experience=music]').click();await settle();assert.equal(s.HandCExperience.state.loading,true);q(s,'[data-experience=mute]').click();slow.release();await settle();assert.equal(s.HandCExperience.state.music,false);assert.equal(slow.calls.sources.length,0);
});
test('audio volume and mute are remembered, and Chinese labels are covered',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio,language:'zh-TW',musicPreference:'off'});q(w,'#sound-button').click();assert.match(q(w,'#sound-title').textContent,/氛圍/);assert.match(q(w,'[data-experience=motion]').textContent,/暫停/);
 const range=q(w,'[data-volume=music]');range.value=12;range.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(JSON.parse(w.localStorage.getItem('handc-volume')).music,12);assert.equal(w.HandCExperience.state.music,false);assert.equal(audio.calls.contexts,0);assert.equal(q(w,'#music-level').textContent,'12%');
});

test('the halo receives actual music energy, with no response to muted audio or button effects',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio,musicPreference:'off'});let signal;
 const mount=w.HandCHalo.mount;w.HandCHalo.mount=options=>{signal=options.readAudio;mount(options)};w.HandCExperience.mount();
 assert.equal(q(w,'.thermal-halo').getAttribute('aria-hidden'),'true');assert.equal(w.document.querySelector('.hero-opening [data-experience=motion]'),null);
 assert.equal(signal(),0);assert.equal(audio.calls.spectrumReads,0);
 q(w,'#sound-button').click();q(w,'[data-experience=effects]').click();await settle();assert.equal(signal(),0);
 q(w,'[data-experience=music]').click();await settle();assert.ok(signal()>0);assert.equal(audio.calls.spectrumReads,1);
 assert.ok(audio.calls.nodes[0].connections.includes(audio.calls.analysers[0]));assert.ok(!audio.calls.nodes[1].connections.includes(audio.calls.analysers[0]));
 const volume=q(w,'[data-volume=music]');volume.value=0;volume.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(signal(),0);assert.equal(audio.calls.spectrumReads,1);
 volume.value=25;volume.dispatchEvent(new w.Event('input',{bubbles:true}));assert.ok(signal()>0);
 q(w,'[data-experience=mute]').click();const reads=audio.calls.spectrumReads;assert.equal(signal(),0);assert.equal(audio.calls.spectrumReads,reads);
 q(w,'[data-experience=sound-close]').click();await go(w,'passes');assert.equal(w.document.querySelector('.thermal-halo'),null);await go(w,'home');assert.ok(w.document.querySelector('.thermal-halo'));
});

function haloHarness(t){
 const w=new Window({url:'https://handc.test/',settings:{enableJavaScriptEvaluation:true,suppressInsecureJavaScriptEnvironmentWarning:true}});
 t.after(()=>{w.HandCHalo?.destroy();w.happyDOM.abort()});
 w.document.body.innerHTML='<div class="thermal-halo"><canvas></canvas></div>';
 const calls={paints:0,signals:0,observers:[]},frames=new Map();let id=0;
 const ctx={setTransform(){},clearRect(){calls.paints++},createRadialGradient(){return {addColorStop(){}}},fillRect(){},beginPath(){},arc(){},fill(){},save(){},translate(){},rotate(){},ellipse(){},stroke(){},restore(){}};
 w.HTMLCanvasElement.prototype.getContext=()=>ctx;
 q(w,'.thermal-halo').getBoundingClientRect=()=>({width:800,height:380});
 w.requestAnimationFrame=fn=>{frames.set(++id,fn);return id};w.cancelAnimationFrame=id=>frames.delete(id);
 w.IntersectionObserver=class{constructor(callback){this.callback=callback;calls.observers.push(this)}observe(){}disconnect(){this.disconnected=true}};
 w.ResizeObserver=class{observe(){}disconnect(){this.disconnected=true}};
 w.eval(readFileSync(root+'src/thermal/halo.js','utf8'));
 const readAudio=()=>{calls.signals++;return .7};
 return {w,calls,frames,readAudio,step(now){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now))}};
}

test('halo animation stops offscreen, when hidden and on disposal; remounting keeps one loop',t=>{
 const {w,calls,frames,readAudio,step}=haloHarness(t),host=q(w,'.thermal-halo');w.HandCHalo.mount({readAudio});
 assert.equal(frames.size,1);step(0);step(40);const painted=calls.paints;assert.ok(painted>1);assert.ok(calls.signals>0);
 calls.observers.at(-1).callback([{isIntersecting:false}]);assert.equal(frames.size,0);assert.equal(host.dataset.haloState,'offscreen');step(100);assert.equal(calls.paints,painted);
 calls.observers.at(-1).callback([{isIntersecting:true}]);assert.equal(frames.size,1);
 Object.defineProperty(w.document,'hidden',{configurable:true,value:true});w.document.dispatchEvent(new w.Event('visibilitychange'));assert.equal(frames.size,0);assert.equal(host.dataset.haloState,'hidden');
 Object.defineProperty(w.document,'hidden',{configurable:true,value:false});w.document.dispatchEvent(new w.Event('visibilitychange'));assert.equal(frames.size,1);
 const oldObserver=calls.observers.at(-1);w.HandCHalo.mount({readAudio});assert.equal(oldObserver.disconnected,true);assert.equal(frames.size,1);
 w.HandCHalo.destroy();assert.equal(frames.size,0);assert.equal(calls.observers.at(-1).disconnected,true);
});

test('reduced and paused halos stay static without sampling audio or scheduling animation',t=>{
 const {w,calls,frames,readAudio,step}=haloHarness(t),host=q(w,'.thermal-halo');w.HandCHalo.mount({motion:'reduced',readAudio});
 assert.equal(host.dataset.haloState,'reduced');assert.equal(calls.paints,1);assert.equal(calls.signals,0);assert.equal(frames.size,0);
 w.HandCHalo.setMotion('full');assert.equal(frames.size,1);step(50);assert.ok(calls.signals>0);
 w.HandCHalo.setMotion('paused');const painted=calls.paints,signals=calls.signals;assert.equal(frames.size,0);assert.equal(host.dataset.haloState,'paused');step(100);assert.equal(calls.paints,painted);assert.equal(calls.signals,signals);
 w.HandCHalo.setMotion('full');assert.equal(frames.size,1);
});

test('admission status distinguishes closed, paused, full and open at exact Malaysian boundaries',()=>{
 let data=H.seed(NOW);assert.equal(H.admissionStatus(data,at('2026-10-20',9)-1),'closed');assert.equal(H.admissionStatus(data,at('2026-10-20',9)),'open');
 data.settings.capacity=1;data=H.checkIn(data,'jamie','reception',NOW).db;assert.equal(H.admissionStatus(data,NOW),'capacity');
 data.settings.admissionsPaused=true;assert.equal(H.admissionStatus(data,NOW),'paused');assert.equal(H.admissionStatus(data,at('2026-10-20',21)),'closed');
 assert.equal(H.entryPreview(data,'avery',at('2026-10-20',21)).error,'studio-closed');
});

test('wallet and open pass details expire automatically at noon without closing the dialog',t=>{
 const clock={now:at('2026-10-20',12)-1000},database=H.purchase(H.seed(clock.now),'avery','sunrise',{now:clock.now}).db;
 const w=boot(t,{userId:'avery',route:'wallet',clock,database});assert.match(q(w,'.wallet-grid .pill').textContent,/Ready/);
 q(w,'[data-action=pass-details]').click();const dialog=q(w,'#modal'),close=q(w,'#modal [data-action=close]');close.focus();
 clock.now=at('2026-10-20',12);clock.tick();
 assert.ok(dialog.open);assert.equal(w.document.activeElement,close);assert.match(q(w,'.wallet-content').textContent,/No active passes/);assert.match(q(w,'.past-passes .pill').textContent,/Expired/);assert.match(q(w,'#modal [data-pass-state]').textContent,/Expired/);
});

test('entry desk refresh preserves lookup fields and withdraws an open confirmation at closing',t=>{
 const clock={now:at('2026-10-20',21)-1000},w=boot(t,{userId:'reception',route:'staff-entry',clock});
 const input=q(w,'[data-form=lookup] input'),select=q(w,'[data-form=entry-member] select');input.value='HC0002';select.value='avery';
 q(w,'[data-action=entry-review]').click();q(w,'[data-action=confirm-entry]').focus();clock.now=at('2026-10-20',21);clock.tick();
 assert.equal(q(w,'[data-form=lookup] input'),input);assert.equal(input.value,'HC0002');assert.equal(select.value,'avery');assert.equal(q(w,'#modal').open,true);
 assert.equal(w.document.querySelector('[data-action=confirm-entry]'),null);assert.match(q(w,'.entry-confirm').textContent,/9am to 9pm/);assert.match(q(w,'.entry-review').textContent,/Entry unavailable/);assert.equal(db(w).visits.length,0);
});

test('staff dashboard changes from closed to open and from open to closed while left on screen',t=>{
 const clock={now:at('2026-10-20',9)-1},w=boot(t,{userId:'admin',route:'staff-home',clock});assert.equal(q(w,'[data-admission-status]').dataset.admissionStatus,'closed');
 clock.now=at('2026-10-20',9);clock.tick();assert.equal(q(w,'[data-admission-status]').dataset.admissionStatus,'open');
 clock.now=at('2026-10-20',21);clock.tick();assert.equal(q(w,'[data-admission-status]').dataset.admissionStatus,'closed');assert.doesNotMatch(q(w,'[data-admission-status]').textContent,/open/);
});

test('departure deadline updates the staff list and counts at its exact timestamp',t=>{
 const clock={now:at('2026-10-20',12)-1000};let database=H.purchase(H.seed(clock.now),'avery','sunrise',{now:clock.now}).db;database=H.checkIn(database,'avery','reception',clock.now).db;
 const w=boot(t,{userId:'reception',route:'staff-home',clock,database});assert.doesNotMatch(q(w,'.active-visits-table').textContent,/Departure due/);
 clock.now=at('2026-10-20',12);clock.tick();assert.match(q(w,'.active-visits-table').textContent,/Departure due/);assert.match(q(w,'.metric-grid').textContent,/Departures due1/);
});

test('an expiry refresh preserves an unfinished studio settings form and an open QR dialog',async t=>{
 const clock={now:at('2026-10-20',21)-1},w=boot(t,{userId:'admin',route:'staff-studio',clock});const note=q(w,'[name=note]');note.value='Unfinished note';note.focus();
 clock.now=at('2026-10-20',21);clock.tick();assert.equal(q(w,'[name=note]'),note);assert.equal(note.value,'Unfinished note');assert.equal(w.document.activeElement,note);
 const mclock={now:at('2026-10-20',21)-1},member=boot(t,{userId:'jamie',route:'wallet',clock:mclock});q(member,'[data-action=qr]').click();const qr=q(member,'.qr-code');
 mclock.now=at('2026-10-20',21);member.document.dispatchEvent(new member.Event('visibilitychange'));assert.equal(q(member,'#modal').open,true);assert.equal(q(member,'.qr-code'),qr);assert.match(q(member,'.wallet-ticket .pill').textContent,/Outside access/);
});

test('a guest can review and keep a selected visit date through sign-in and confirmation',async t=>{
 const w=boot(t,{route:'home'});assert.equal(w.document.querySelector('.quick-passes'),null);assert.ok(q(w,'.hero-opening').nextElementSibling.matches('.sequence-track'));
 await go(w,'passes');assert.equal(w.document.querySelectorAll('.pass-card').length,6);q(w,'[data-product=sunrise][data-action=buy]').click();assert.equal(q(w,'#modal-title').textContent,'Review your pass');const date=q(w,'[name=visitDate]');date.value='2026-10-21';
 await submit(w,'[data-form=guest-purchase]');assert.equal(w.location.hash,'#login');assert.match(q(w,'[data-purchase-context]').textContent,/Sunrise Pass/);assert.match(q(w,'[data-purchase-context]').textContent,/21 Oct 2026/);assert.equal(db(w).orders.length,2);
 q(w,'[name=email]').value='jamie@handc.demo';q(w,'[name=password]').value='HandCDemo2026!';await submit(w,'#auth-form');assert.equal(q(w,'[name=visitDate]').value,'2026-10-21');assert.equal(db(w).orders.length,2);
 await submit(w,'[data-form=purchase]');assert.equal(db(w).passes[0].visitDate,'2026-10-21');assert.equal(db(w).passes[0].productId,'sunrise');
});

test('editing a pass selection keeps typed sign-in details, and registration keeps the selected date',async t=>{
 const w=boot(t,{route:'passes'});q(w,'[data-product=full-day][data-action=buy]').click();q(w,'[name=visitDate]').value='2026-10-21';await submit(w,'[data-form=guest-purchase]');
 const email=q(w,'[name=email]'),password=q(w,'[name=password]');email.value='guest@example.test';password.value='SamplePassword123!';
 q(w,'[data-action=edit-purchase]').click();q(w,'[name=visitDate]').value='2026-10-22';await submit(w,'[data-form=guest-purchase]');assert.equal(q(w,'[name=email]'),email);assert.equal(email.value,'guest@example.test');assert.equal(password.value,'SamplePassword123!');
 await go(w,'register');assert.match(q(w,'[data-purchase-context]').textContent,/22 Oct 2026/);q(w,'[name=name]').value='Guest Preview';q(w,'[name=email]').value='guest@example.test';q(w,'[name=password]').value='SamplePassword123!';await submit(w,'#auth-form');
 for(let i=0;i<100&&w.location.hash==='#register';i++)await wait();await settle();assert.equal(q(w,'[name=visitDate]').value,'2026-10-22');assert.equal(db(w).orders.length,2);assert.equal(w.sessionStorage.getItem('handc-pending-purchase'),null);
});

test('a guest review left open past its window shows expiry and cannot continue with the old date',async t=>{
 const clock={now:at('2026-10-20',12)-1000},w=boot(t,{route:'passes',clock});q(w,'[data-product=sunrise][data-action=buy]').click();const date=q(w,'[name=visitDate]');assert.equal(date.value,'2026-10-20');
 clock.now=at('2026-10-20',12);clock.tick();assert.match(q(w,'[data-date-message]').textContent,/window has ended/);assert.equal(q(w,'[name=visitDate]'),date);await submit(w,'[data-form=guest-purchase]');assert.equal(w.location.hash,'#passes');assert.equal(db(w).orders.length,2);assert.equal(w.sessionStorage.getItem('handc-pending-purchase'),null);
});

test('new pass review, selection context and admission states are translated into Chinese',async t=>{
 const w=boot(t,{language:'zh-TW'});assert.match(q(w,'.hero-invitation').textContent,/RM30/);await go(w,'passes');q(w,'[data-product=sunset][data-action=buy]').click();assert.match(q(w,'#modal-title').textContent,/確認通行證/);assert.match(q(w,'[data-form=guest-purchase]').textContent,/建立帳戶/);await submit(w,'[data-form=guest-purchase]');assert.match(q(w,'[data-purchase-context]').textContent,/晚間通行證/);
 const a=boot(t,{language:'zh-TW',userId:'admin',route:'staff-home',clock:{now:at('2026-10-20',21)}});assert.match(q(a,'[data-admission-status]').textContent,/已關閉/);
});
