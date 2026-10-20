import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {Window} from 'happy-dom';

const root=fileURLToPath(new URL('../',import.meta.url));
const html=readFileSync(root+'index.html','utf8');
const markup=html.replace(/<script[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link[^>]*>/g,'');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>readFileSync(root+m[1].split('?')[0],'utf8')).join('\n');
const q=(w,s)=>{const el=w.document.querySelector(s);assert.ok(el,'Missing '+s);return el};
const go=(w,hash)=>{w.location.hash=hash;w.eval('render()')};
const db=w=>JSON.parse(w.localStorage.getItem('handc-staff-demo-v1'));
const member=w=>db(w).members.find(m=>m.id==='jamie');
const day=n=>{const d=new Date();d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function boot(t,{language='en',access}={}){
  const w=new Window({url:'https://handc.test/#login',settings:{enableJavaScriptEvaluation:true,suppressInsecureJavaScriptEnvironmentWarning:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
  t.after(()=>w.happyDOM.abort());
  w.document.write(markup);w.localStorage.setItem('handc-language',language);
  if(access)w.sessionStorage.setItem('handc-demo-access',JSON.stringify(access));
  w.eval(scripts);return w;
}
async function signIn(w,email){
  q(w,'[name=email]').value=email;q(w,'[name=password]').value='HandCDemo2026!';
  const form=q(w,'#auth-form');form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  for(let i=0;i<100&&w.location.hash==='#login';i++)await new Promise(r=>setTimeout(r,10));
  assert.notEqual(w.location.hash,'#login',w.document.querySelector('#auth-error')?.textContent);
}

test('HandC identity, isolated demo storage, and sample account controls',t=>{
  const w=boot(t);
  assert.equal(w.document.title,'HandC — Move. Reset. Repeat.');
  assert.equal(q(w,'h1').textContent,'Welcome back.');
  assert.equal(w.document.querySelectorAll('[data-portal=demo-fill]').length,6);
  assert.ok(!w.localStorage.getItem('sync-staff-demo-v1'));
  q(w,'[data-portal=demo-fill][data-email="jamie@handc.demo"]').click();
  assert.equal(q(w,'[name=email]').value,'jamie@handc.demo');
  assert.equal(q(w,'[name=password]').value,'HandCDemo2026!');
  assert.equal(w.location.hash,'#login');
  assert.ok(!q(w,'#app').textContent.includes('SYNC'));
});

for(const [email,role,route] of [
  ['jamie@handc.demo','member','#home'],
  ['admin@handc.demo','admin','#admin-overview'],
  ['frontdesk@handc.demo','frontdesk','#admin-overview'],
  ['instructor@handc.demo','instructor','#instructor-today']
])test(`${role} signs in and opens the correct workspace`,async t=>{
  const w=boot(t);await signIn(w,email);assert.equal(w.location.hash,route);
  const session=JSON.parse(w.sessionStorage.getItem('handc-demo-access'));assert.equal(session.role,role);
  if(role==='member')for(const route of ['#home','#book','#wallet','#rewards','#account']){go(w,route);assert.ok(q(w,'#app').textContent.trim());assert.ok(!w.document.querySelector('#auth-form'));}
  if(role==='admin')for(const route of ['#admin-overview','#admin-people','#admin-schedule','#admin-reports','#admin-orders','#admin-points','#admin-settings']){go(w,route);assert.ok(q(w,'.staff-content h1').textContent.trim());}
  if(role==='frontdesk'){assert.ok(!w.document.querySelector('[href="#admin-settings"]'));go(w,'#admin-members/jamie/overview');assert.ok(!w.document.querySelector('[data-portal=adjust],[data-portal=issue]'));}
  if(role==='instructor'){go(w,'#instructor-schedule');assert.ok(!w.document.querySelector('.staff-sidebar [href="#admin-settings"]'));}
});

test('booking receipt previews the debit, confirmation deducts once, cancellation restores it',async t=>{
  const w=boot(t);await signIn(w,'jamie@handc.demo');go(w,'#book');
  const date=q(w,'#booking-date');date.value=day(3);date.dispatchEvent(new w.Event('change',{bubbles:true}));
  const before=member(w).wallet.packages.find(p=>p.id==='y1').remaining;
  q(w,'[data-action=book]:not(:disabled)').click();
  assert.match(q(w,'.hc-booking-receipt').textContent,/Balance after booking/);
  assert.match(q(w,'.hc-booking-receipt').textContent,/Pass expiry/);
  assert.match(q(w,'.hc-booking-receipt').textContent,/Cancel online by/);
  assert.equal(member(w).wallet.packages.find(p=>p.id==='y1').remaining,before);
  q(w,'[data-action=confirm-book]').click();
  assert.equal(member(w).wallet.packages.find(p=>p.id==='y1').remaining,before-1);
  const booking=member(w).wallet.bookings[0];assert.ok(booking);
  q(w,`[data-action=cancel][data-id="${booking.id}"]`).click();q(w,'[data-action=confirm-cancel]').click();
  assert.equal(member(w).wallet.packages.find(p=>p.id==='y1').remaining,before);
  assert.ok(!member(w).wallet.bookings.some(b=>b.id===booking.id));
});

test('Traditional Chinese covers the new sign-in, home, and booking receipt',async t=>{
  const w=boot(t,{language:'zh-TW'});assert.equal(w.document.documentElement.lang,'zh-TW');
  assert.match(q(w,'.hc-arrival h2').textContent,/平衡/);assert.match(q(w,'h1').textContent,/歡迎回來/);
  await signIn(w,'jamie@handc.demo');assert.match(q(w,'.overview-welcome').textContent,/日常節奏/);
  go(w,'#book');const date=q(w,'#booking-date');date.value=day(3);date.dispatchEvent(new w.Event('change',{bubbles:true}));q(w,'[data-action=book]:not(:disabled)').click();
  assert.match(q(w,'.hc-booking-receipt').textContent,/預約後剩餘堂數/);
  const ids=[...w.document.querySelectorAll('[id]')].map(el=>el.id);assert.equal(new Set(ids).size,ids.length);
});
