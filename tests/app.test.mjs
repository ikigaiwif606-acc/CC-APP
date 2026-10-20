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
function boot(t,{language='en',userId,route='home',theme,motion,reducedMotion=false,audioMock}={}){
 const w=new Window({url:'https://handc.test/#'+route,settings:{enableJavaScriptEvaluation:true,suppressInsecureJavaScriptEnvironmentWarning:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
 t.after(()=>w.happyDOM.abort());w.document.write(markup);w.localStorage.setItem('handc-locale',language);
 // Fix the browser clock to a Malaysian opening hour, independent of CI timezone.
 w.Date.now=()=>NOW;w.structuredClone=structuredClone;
 if(theme)w.localStorage.setItem('handc-theme',theme);if(motion)w.localStorage.setItem('handc-motion',motion);
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
 const w=boot(t,{route:'passes'});q(w,'[data-action=buy][data-product=monthly]').click();await settle();assert.equal(w.location.hash,'#login');
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

function audioHarness({fail=false,hold=false}={}){
 const calls={contexts:0,resumes:0,suspends:0,fetches:0,sources:[],tones:[],nodes:[]};let release;
 class Param{value=0;setValueAtTime(v){this.value=v}setTargetAtTime(v){this.value=v}linearRampToValueAtTime(v){this.value=v}exponentialRampToValueAtTime(v){this.value=v}cancelScheduledValues(){}}
 class Node{gain=new Param();frequency=new Param();threshold=new Param();knee=new Param();ratio=new Param();attack=new Param();release=new Param();connections=[];connect(node){this.connections.push(node)}disconnect(){this.disconnected=true}start(at=0){this.started=at}stop(at=0){this.stopped=at;this.onended?.()}}
 class Context{
  state='suspended';currentTime=1;destination={};constructor(){calls.contexts++}resume(){calls.resumes++;this.state='running';return Promise.resolve()}suspend(){calls.suspends++;this.state='suspended';return Promise.resolve()}addEventListener(){}
  createGain(){const n=new Node();calls.nodes.push(n);return n}createDynamicsCompressor(){return new Node()}createBufferSource(){const n=new Node();calls.sources.push(n);return n}createOscillator(){const n=new Node();calls.tones.push(n);return n}decodeAudioData(){return Promise.resolve({duration:36.9231})}
 }
 const fetch=async()=>{calls.fetches++;if(hold)await new Promise(r=>release=r);if(fail)throw new Error('Offline');return {ok:true,arrayBuffer:async()=>new ArrayBuffer(8)}};
 return {Context,fetch,calls,release:()=>release?.()};
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
test('audio stays off and unloaded until opted in; playback loops and survives navigation',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio});assert.equal(audio.calls.contexts,0);assert.equal(audio.calls.fetches,0);assert.equal(w.HandCExperience.state.music,false);
 q(w,'#sound-button').click();assert.equal(q(w,'#sound-panel').open,true);assert.equal(audio.calls.contexts,0);
 q(w,'[data-experience=music]').click();await settle();assert.equal(audio.calls.contexts,1);assert.equal(audio.calls.fetches,1);assert.equal(w.HandCExperience.state.music,true);assert.equal(w.HandCExperience.state.effects,false);assert.match(q(w,'#sound-message').textContent,/Playing/);
 assert.equal(audio.calls.sources[0].loop,true);assert.ok(Math.abs(audio.calls.sources[0].loopEnd-60/104*64)<.001);
 q(w,'[data-experience=sound-close]').click();await go(w,'passes');assert.equal(audio.calls.sources.length,1);assert.equal(w.HandCExperience.state.music,true);
 q(w,'#sound-button').click();q(w,'[data-experience=mute]').click();assert.equal(w.HandCExperience.state.music,false);assert.equal(w.HandCExperience.state.effects,false);assert.ok(audio.calls.sources[0].disconnected);
});
test('button and keyboard activation sound once; disabled controls and muting stay silent',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio});q(w,'#sound-button').click();q(w,'[data-experience=effects]').click();await settle();assert.equal(w.HandCExperience.state.effects,true);assert.equal(audio.calls.fetches,0);
 q(w,'[data-experience=sound-close]').click();await settle();audio.calls.tones.length=0;
 // click() represents the browser click generated by mouse, touch or keyboard activation.
 q(w,'[data-action=theme]').click();await settle();assert.equal(audio.calls.tones.length,2);assert.ok(audio.calls.tones.every(n=>n.disconnected));
 const disabled=w.document.createElement('button');disabled.disabled=true;w.document.body.append(disabled);const before=audio.calls.tones.length;disabled.click();await settle();assert.equal(audio.calls.tones.length,before);
 q(w,'#sound-button').click();q(w,'[data-experience=mute]').click();await settle();audio.calls.tones.length=0;q(w,'[data-experience=sound-close]').click();q(w,'[data-action=theme]').click();await settle();assert.equal(audio.calls.tones.length,0);
});
test('audio failure and cancellation never report playback or affect app actions',async t=>{
 const failed=audioHarness({fail:true}),w=boot(t,{audioMock:failed});q(w,'#sound-button').click();q(w,'[data-experience=music]').click();await settle();assert.equal(w.HandCExperience.state.music,false);assert.match(q(w,'#sound-message').textContent,/could not start/);assert.equal(failed.calls.sources.length,0);q(w,'[data-experience=sound-close]').click();await go(w,'passes');assert.equal(w.document.querySelectorAll('.pass-card').length,6);
 const slow=audioHarness({hold:true}),s=boot(t,{audioMock:slow});q(s,'#sound-button').click();q(s,'[data-experience=music]').click();await settle();assert.equal(s.HandCExperience.state.loading,true);q(s,'[data-experience=mute]').click();slow.release();await settle();assert.equal(s.HandCExperience.state.music,false);assert.equal(slow.calls.sources.length,0);
});
test('audio volume is remembered while playback stays opt-in, and Chinese labels are covered',async t=>{
 const audio=audioHarness(),w=boot(t,{audioMock:audio,language:'zh-TW'});q(w,'#sound-button').click();assert.match(q(w,'#sound-title').textContent,/氛圍/);assert.match(q(w,'[data-experience=motion]').textContent,/暫停/);
 const range=q(w,'[data-volume=music]');range.value=12;range.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(JSON.parse(w.localStorage.getItem('handc-volume')).music,12);assert.equal(w.HandCExperience.state.music,false);assert.equal(audio.calls.contexts,0);assert.equal(q(w,'#music-level').textContent,'12%');
});
