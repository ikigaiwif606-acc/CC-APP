const $=s=>document.querySelector(s);
const escapeHTML=value=>String(value).replace(/[&<>"\']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"\'":'&#39;'}[c]));
const icons={yoga:'<path d="M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM4 12l5-3h6l5 3M9 9l-1 7-5 3h18l-5-3-1-7M9 19l3-3 3 3"/>',water:'<path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8C4 8 6 1 9 3c2 1 3 5 3 5s1-4 3-5c3-2 5 5-3 5Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>'};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[n]||icons.sun}</svg>`;
const money=n=>new Intl.NumberFormat('en-US').format(n);
const fmt=d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const addDays=n=>{let d=new Date();d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const seed=()=>({name:'Jamie Lin',points:12500,spend:12500,packages:[{id:'y1',service:'yoga',remaining:4,total:5,expiry:addDays(70)},{id:'c1',service:'contrast',remaining:3,total:5,expiry:addDays(50)}],bookings:[],vouchers:[],activity:[{title:'Contrast Therapy · 5-session package',date:addDays(-12),points:5000},{title:'Yoga · 10-session package',date:addDays(-30),points:7500}]});
function validDemo(data){
  const nonnegative=n=>Number.isSafeInteger(n)&&n>=0;
  const date=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s));
  return data&&typeof data.name==='string'&&data.name.trim()&&nonnegative(data.points)&&nonnegative(data.spend)
    &&Array.isArray(data.packages)&&data.packages.every(p=>p&&typeof p.id==='string'&&['yoga','contrast'].includes(p.service)&&nonnegative(p.remaining)&&nonnegative(p.total)&&p.remaining<=p.total&&date(p.expiry))
    &&Array.isArray(data.bookings)&&data.bookings.every(b=>b&&typeof b.id==='string'&&typeof b.title==='string'&&typeof b.passId==='string'&&date(b.date)&&typeof b.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time))
    &&Array.isArray(data.vouchers)&&data.vouchers.every(v=>v&&typeof v.name==='string'&&typeof v.code==='string')
    &&Array.isArray(data.activity)&&data.activity.every(a=>a&&typeof a.title==='string'&&Number.isSafeInteger(a.points)&&date(a.date));
}
let state;try{const stored=JSON.parse(localStorage.getItem('sync-demo-v1'));state=validDemo(stored)?stored:seed()}catch{state=seed()}
let bookingService='yoga',bookingDate=addDays(1),toastTimer;const save=()=>{localStorage.setItem('sync-demo-v1',JSON.stringify(state));window.syncPortal?.walletSaved(state)};const tier=()=>SyncMembership.tier(state);
const eligible=s=>state.packages.filter(p=>p.service===s&&p.remaining>0&&p.expiry>=addDays(0)).sort((a,b)=>a.expiry.localeCompare(b.expiry));
const count=s=>eligible(s).reduce((n,p)=>n+p.remaining,0);
const memberNumber=()=>window.syncPortal?.memberNumber()||'0000 2088';
const initials=()=>escapeHTML(state.name.trim().split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase());
const navs=[['home','Overview'],['book','Book'],['rewards','Rewards'],['wallet','Wallet'],['account','Account']];
let currentModal=null,currentToast='',modalTrigger=null;
function toast(message){currentToast=message;$('#toast').textContent=I18n.translate(message);$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500)}
function modal(title,body,options={}){if(!$('#modal').open)modalTrigger=document.activeElement;currentModal={title,body,wallet:!!options.wallet};$('#modal').classList.toggle('wallet-detail-dialog',!!options.wallet);$('#modal-content').innerHTML=I18n.html(`<div class="modal-heading"><h2 id="modal-title">${title}</h2><button class="close" data-action="close" aria-label="Close dialog">×</button></div>${body}`);if(!$('#modal').open)$('#modal').showModal()}
$('#modal').addEventListener('close',()=>{if($('#modal').open)return;pendingReward=null;$('#modal').classList.remove('wallet-detail-dialog');const trigger=modalTrigger,wasWallet=currentModal?.wallet;currentModal=null;requestAnimationFrame(()=>{if($('#modal').open)return;if(trigger?.isConnected)trigger.focus();else if(wasWallet)($('.wallet-section-nav [aria-current]')||$('.account-tabs [aria-current]')||$('[data-account=checkin]'))?.focus();else if(document.body.classList.contains('admin-shell'))($('#member-profile-title')||$('#people-search'))?.focus()})});
// A modal dialog sits in the browser's top layer, above ordinary page toasts.
// Open the explanation as its own modal so it stays clear above the booking dialog.
const cancellationDialog=$('#cancellation-notice');
let cancellationNoticeBooking=null,cancellationNoticeTrigger=null;
function renderCancellationNotice(){
  const booking=cancellationNoticeBooking;if(!booking)return;const reason=sessionStart(booking.date,booking.time)<=Date.now()?'This session has already started, so it cannot be cancelled online.':'This session starts in less than 24 hours, so it cannot be cancelled online.';
  $('#cancellation-notice-content').innerHTML=I18n.html(`<div class="cancellation-notice-top"><span class="cancellation-notice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><button class="close" data-cancellation-notice="close" aria-label="Close dialog">×</button></div><h2 id="cancellation-notice-title">Unable to cancel online</h2><p id="cancellation-notice-reason">${reason}</p><div class="cancellation-notice-booking"><strong>${escapeHTML(booking.title)}</strong><span>${fmt(booking.date)} · ${escapeHTML(booking.time)}</span></div><p class="cancellation-notice-status">Your booking is still confirmed.</p><button class="button cancellation-notice-dismiss" data-cancellation-notice="close" autofocus>Got it</button>`);
}
function showCancellationNotice(booking){
  if(!cancellationDialog.open)cancellationNoticeTrigger=document.activeElement;
  cancellationNoticeBooking={title:booking.title,date:booking.date,time:booking.time};renderCancellationNotice();
  if(!cancellationDialog.open)cancellationDialog.showModal();
  cancellationDialog.querySelector('[autofocus]').focus();
}
function closeCancellationNotice(){if(cancellationDialog.open)cancellationDialog.close()}
cancellationDialog.addEventListener('click',event=>{if(event.target.closest('[data-cancellation-notice="close"]'))closeCancellationNotice()});
cancellationDialog.addEventListener('close',()=>{if(cancellationDialog.open)return;const trigger=cancellationNoticeTrigger;cancellationNoticeTrigger=null;cancellationNoticeBooking=null;requestAnimationFrame(()=>{if(cancellationDialog.open||!trigger?.isConnected)return;const parent=trigger.closest('dialog');if(!parent||parent.open)trigger.focus({preventScroll:true})})});
$('#modal').addEventListener('close',()=>{if(!$('#modal').open)closeCancellationNotice()});
window.addEventListener('hashchange',closeCancellationNotice);
function intro(kicker,title,sub){return `<div class="page-intro"><p class="eyebrow">${kicker}</p><h1 class="page-title">${title}</h1><p class="subtitle">${sub}</p></div>`}
const syncMarkPaths = '<path d="M627.1,314.9v373.4h-30v-187.3c-.7-16.8-19.4-45.1-30-61.6-5.9-9.2-19.3-30.1-30-46.7v295.6h-30v-373.4h17.8c1.2,2.5,21.5,44.3,42.2,74.9,15.5,23.1,29.5,43.6,30,49.5v-124.5h30Z"/><path d="M447.1,314.9v190.8c0,28-19.1,51.4-45,58.1v124.5h-30v-124.5c-25.9-6.7-45-30.2-45-58.1v-190.8h30v190.8c0,12.9,8.1,23.9,19.5,28.1,3.3,1.2,6.8,1.9,10.5,1.9s7.2-.7,10.5-1.9c11.4-4.2,19.5-15.2,19.5-28.1v-190.8h30Z"/><path d="M233.9,688.3h-38.9c45.3-46.9,56.2-119.9,21.9-179.2-12.8-22.2-20.4-46-23-69.9-4.9-43.9,6.6-88.3,32.1-124.3h38.9c-45.3,46.9-56.2,119.9-21.9,179.2,12.8,22.2,20.3,46,23,69.9,4.9,43.9-6.6,88.3-32.1,124.3h0Z"/><path d="M717.1,501.6c0,75.6,35.2,142.9,90,186.6h0c0,.1-44.4.1-44.4.1-46.8-48.3-75.6-114.1-75.6-186.7s28.8-138.4,75.6-186.7h44.4c-54.8,43.8-90,111.1-90,186.7h0Z"/>';
function membershipCard(){return `<div class="premium-stage"><div class="premium-halo" aria-hidden="true"></div><div class="premium-floor" aria-hidden="true"></div><div class="premium-orientation"><div class="premium-float"><div class="premium-card" role="group" aria-label="Membership card"><div class="premium-reflection" aria-hidden="true"></div><svg class="premium-contours" viewBox="0 0 300 300" aria-hidden="true"><path d="M90-20C-35 95 220 98 134 310M132-20C8 91 260 121 176 310M174-20C57 82 301 141 218 310"/></svg><svg class="premium-watermark" viewBox="165 285 670 440" aria-hidden="true">${syncMarkPaths}</svg><div class="premium-top"><div class="premium-brand"><svg viewBox="165 285 670 440" role="img" aria-label="SYNC">${syncMarkPaths}</svg><span>WELLNESS CLUB</span></div><svg class="premium-contactless" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9c2 2 2 4 0 6m4-9c4 4 4 8 0 12m4-15c6 6 6 12 0 18"/></svg></div><div class="premium-level"><span>SYNC MEMBERSHIP</span><strong>${tier()}</strong></div><div class="premium-footer"><div><div class="premium-name">${escapeHTML(state.name)}</div><div class="premium-number">MEMBER · ${memberNumber()}</div></div><svg class="premium-emblem" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2v28M2 16h28M6.1 6.1l19.8 19.8M6.1 25.9L25.9 6.1"/></svg></div></div></div></div><div class="premium-caption">YOUR SPACE. YOUR PACE.</div></div>`}
function isNewMember(){return state.spend===0&&state.points===0&&!state.activity.length&&!state.packages.length&&!state.bookings.length&&!state.vouchers.length}
const overviewScanIcon=()=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 7h3v3H7zm7 0h3v3h-3zm-7 7h3v3H7zm7 0h3v3h-3z"/></svg>';
function overviewDate(date){return date===addDays(0)?'Today':date===addDays(1)?'Tomorrow':fmt(date)}
function overviewBookings(){return window.syncPortal?.overviewBookings?.()||state.bookings.map(b=>({...b,checked:!!b.checkedInAt}))}
function overviewGlance(){
  const now=Date.now(),upcoming=overviewBookings().filter(b=>b.status!=='cancelled'&&!b.cancelled&&sessionStart(b.date,b.time)+3600000>now).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))[0];
  const today=upcoming?.date===addDays(0),started=upcoming&&sessionStart(upcoming.date,upcoming.time)<=now,checked=upcoming?.checked;
  const cutoff=upcoming?sessionStart(upcoming.date,upcoming.time)-86400000:0;
  const cutoffDay=cutoff?new Date(cutoff).toLocaleDateString('en-CA',{timeZone:'Asia/Taipei'}):'';
  const cutoffTime=cutoff?new Date(cutoff).toLocaleTimeString('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit'}):'';
  const hasPass=count('yoga')+count('contrast')>0;
  return `<section class="overview-next ${upcoming?'has-booking':'no-booking'} ${upcoming?.service==='contrast'?'next-contrast':''}" aria-labelledby="overview-next-title"><div class="overview-next-art" aria-hidden="true"><span></span><span></span>${icon(upcoming?.service==='contrast'?'water':'yoga')}</div><div class="overview-next-top"><span class="overview-kicker">Your next class</span>${upcoming?`<span class="overview-booking-status ${checked?'is-checked':''}"><span aria-hidden="true">${checked?'✓':'●'}</span><span>${checked?'Checked in':started?'In progress':'Confirmed'}</span></span>`:'<span class="overview-booking-status">A little time for you</span>'}</div><div class="overview-next-copy">${upcoming?`<p class="overview-session-when"><span>${overviewDate(upcoming.date)}</span><span aria-hidden="true">·</span><strong>${escapeHTML(upcoming.time)}</strong></p><h2 id="overview-next-title">${escapeHTML(upcoming.title)}</h2><p class="overview-next-meta"><span>${upcoming.service==='contrast'?'Contrast Therapy':'Yoga'}</span><span aria-hidden="true">·</span><span>60 minutes</span><span aria-hidden="true">·</span><span>SYNC Xinyi</span></p>${upcoming.instructor||upcoming.room?`<p class="overview-assignment">${upcoming.instructor?`<span>Instructor</span> · ${escapeHTML(upcoming.instructor)}`:''}${upcoming.instructor&&upcoming.room?' <span aria-hidden="true">/</span> ':''}${upcoming.room?`<span>Room</span> · ${escapeHTML(upcoming.room)}`:''}</p>`:''}`:`<h2 id="overview-next-title">${isNewMember()?'Your first class starts here.':'Make time for your next visit.'}</h2><p class="overview-empty-copy">${hasPass?'Your passes are ready. Choose a class that fits your day.':'Explore Yoga and Contrast Therapy, then choose a pass for your visit.'}</p>`}</div><div class="overview-next-footer"><div class="overview-next-actions">${upcoming?`${today&&!checked?`<button class="button overview-primary account-quick-checkin" data-account="checkin">${overviewScanIcon()}<span>Show check-in code</span></button>`:`<button class="button overview-primary" data-action="manage-booking" data-id="${escapeHTML(upcoming.id)}">${checked?'View booking':'Manage booking'} <span aria-hidden="true">↗</span></button>`}${today&&!checked?`<button class="overview-text-action" data-action="manage-booking" data-id="${escapeHTML(upcoming.id)}">Manage booking</button>`:''}`:`${hasPass?'<a class="button overview-primary" href="#book">Find a class <span aria-hidden="true">↗</span></a>':`<button class="button overview-primary" data-action="packages">${isNewMember()?'Get your first pass':'Get passes'} <span aria-hidden="true">↗</span></button>`}<a class="overview-text-action" href="#book">${hasPass?'View timetable':'Explore classes'}</a>`}</div><p class="overview-booking-note">${upcoming?(today&&!checked?'Show your code at reception. Staff will confirm your check-in.':checked?'Your check-in has been recorded.':cutoff>now?`<span>Cancel online by</span> <span>${fmt(cutoffDay)} · ${cutoffTime}</span>`:'Online cancellation is closed. Please contact reception.'):'One pass is used when you confirm a booking.'}</p></div></section>`;
}
function overviewPasses(){
  const yogaReward=rewards.find(r=>r.id==='yoga'),contrastReward=rewards.find(r=>r.id==='contrast');
  const rewardHint=state.points>=contrastReward.cost?'Enough points for a Yoga or Contrast Therapy reward.':state.points>=yogaReward.cost?'Enough points for a Yoga session reward.':'Earn points when you purchase passes.';
  return `<section class="overview-balances" aria-labelledby="overview-balances-title"><div class="overview-section-heading"><h2 id="overview-balances-title">Your passes and points</h2><div class="overview-balance-tools"><button class="overview-link" data-action="packages">Get passes <span aria-hidden="true">↗</span></button><a class="overview-link" href="#wallet/passes">View Wallet <span aria-hidden="true">↗</span></a></div></div><div class="overview-balance-grid">${['yoga','contrast'].map(service=>{const n=count(service),name=service==='yoga'?'Yoga':'Contrast Therapy';return `<article class="overview-balance balance-${service}"><div class="overview-balance-heading"><h3>${name}</h3><span class="overview-service-icon">${icon(service==='yoga'?'yoga':'water')}</span></div><p class="overview-balance-value"><strong>${money(n)}</strong><span>${n===1?'session available':'sessions available'}</span></p><p class="overview-balance-note">${eligible(service)[0]?`<span>Next expiry</span> · <span>${fmt(eligible(service)[0].expiry)}</span>`:'No active passes'}</p><button class="overview-balance-action" data-action="${n?'service':'packages'}" data-service="${service}"><span>${n?(service==='yoga'?'Book yoga':'Book contrast'):(service==='yoga'?'Get Yoga passes':'Get Contrast Therapy passes')}</span><span aria-hidden="true">↗</span></button></article>`}).join('')}<article class="overview-balance balance-points"><div class="overview-balance-heading"><h3>Available points</h3><span class="overview-service-icon">${icon('gift')}</span></div><p class="overview-balance-value"><strong>${money(state.points)}</strong><span>points</span></p><p class="overview-balance-note">${rewardHint}</p><a class="overview-balance-action" href="#rewards/redeem"><span>View rewards</span><span aria-hidden="true">↗</span></a></article></div></section>`;
}
function overviewReminders(){
  const groups=new Map();for(const p of state.packages.filter(p=>p.remaining>0&&p.expiry>=addDays(0)&&p.expiry<=addDays(14)).sort((a,b)=>a.expiry.localeCompare(b.expiry))){const key=p.service+'-'+p.expiry;const row=groups.get(key)||{service:p.service,expiry:p.expiry,count:0,id:p.id};row.count+=p.remaining;groups.set(key,row)}
  if(!groups.size)return '';
  return `<section class="overview-reminders" aria-labelledby="overview-reminders-title"><span class="overview-reminder-icon">${icon('sun')}</span><div><h2 id="overview-reminders-title">Passes expiring soon</h2><ul>${[...groups.values()].slice(0,3).map(p=>`<li><span><span>${p.service==='yoga'?'Yoga':'Contrast Therapy'}</span> · <strong>${money(p.count)}</strong> <span>${p.count===1?'session':'sessions'}</span> · <span>Use by</span> <span>${fmt(p.expiry)}</span></span><button class="overview-link" data-action="wallet-book-pass" data-id="${escapeHTML(p.id)}">Find a session <span aria-hidden="true">↗</span></button></li>`).join('')}</ul>${groups.size>3?'<a class="overview-link" href="#wallet/passes">View all expiring passes ↗</a>':''}</div></section>`;
}
function overviewMembership(){
  const p=SyncMembership.progress(state),target=p.next||p.current,max=target.visits||20,min=p.next?p.current.visits:0,percent=p.next?Math.min(100,(p.visits-min)/(max-min)*100):100;
  return `<section class="overview-membership" aria-labelledby="overview-membership-title"><div class="overview-section-heading"><h2 id="overview-membership-title">Membership progress</h2><a class="overview-link" href="#rewards/membership">View benefits <span aria-hidden="true">↗</span></a></div><div class="overview-membership-body"><div class="overview-visit-summary"><span class="overview-tier tier-${p.current.name.toLowerCase()}">${p.current.name}</span><p><strong>${money(p.visits)}</strong><span>completed visits</span></p><span class="overview-visit-target">${p.next?`<strong>${money(p.remaining)}</strong> <span>${p.remaining===1?'visit to':'visits to'}</span> <strong>${p.next.name}</strong>`:'Highest tier unlocked'}</span></div><div class="overview-visit-track" role="progressbar" aria-label="Membership progress" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${Math.min(p.visits,max)}"><span style="width:${percent}%"></span></div><div class="overview-progress-labels"><span>${p.next?p.current.name:'All tiers unlocked'}</span><span>${p.next?`${target.name} · ${target.visits} <span>visits</span>`:'Luxe'}</span></div><p class="overview-progress-note">Only completed, checked-in visits count.</p></div><div class="overview-next-unlock"><span class="overview-unlock-icon">${icon(target.icon)}</span><div><span>${p.next?'Your next unlock':'Your Luxe privileges'}</span><strong>${target.highlight}</strong><small>Membership benefit preview</small></div><button class="overview-link" data-action="tier-benefits" data-tier="${target.name}">See benefit <span aria-hidden="true">↗</span></button></div></section>`;
}
function overviewClasses(){
  const choices=[];for(const service of ['yoga','contrast']){let found=null;for(let offset=0;offset<=7&&!found;offset++){const date=addDays(offset);const available=availableSessions(service,date).find(s=>parseInt(s[3],10)>0&&sessionStart(date,s[0])>Date.now()&&!bookingOverlap(date,s[0])&&(!count(service)||eligible(service).some(p=>p.expiry>=date)));if(available)found={service,date,time:available[0],title:available[1],spaces:parseInt(available[3],10)}}if(found)choices.push(found)}
  return `<section class="overview-classes" aria-labelledby="overview-classes-title"><div class="overview-section-heading"><h2 id="overview-classes-title">Find your next class</h2><a class="overview-link" href="#book">View timetable <span aria-hidden="true">↗</span></a></div>${choices.length?`<div class="overview-class-list">${choices.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).map(s=>`<article class="overview-class"><span class="overview-class-icon class-${s.service}">${icon(s.service==='yoga'?'yoga':'water')}</span><div class="overview-class-copy"><p><span>${overviewDate(s.date)}</span> · ${s.time}</p><h3>${escapeHTML(s.title)}</h3><span>${s.service==='yoga'?'Yoga':'Contrast Therapy'}</span><small>${count(s.service)?'Use an eligible pass':'A pass is required to book'}</small></div><button class="overview-class-action" data-action="overview-session" data-service="${s.service}" data-date="${s.date}" aria-label="View ${s.service==='yoga'?'Yoga':'Contrast Therapy'} session">${s.spaces===1?'<small>1 space left</small>':''}<span>View session <span aria-hidden="true">↗</span></span></button></article>`).join('')}</div>`:'<div class="overview-class-empty"><p>No matching classes in the next 7 days.</p><a class="overview-link" href="#book">Explore the timetable ↗</a></div>'}</section>`;
}
function visitLabel(n){return `<span>${money(n)}</span> <span>visits</span>`}
function membershipJourney(overview=false){
  const p=SyncMembership.progress(state),target=p.next||p.current,highest=!p.next;
  return `<section class="panel membership-journey journey-glass visit-journey journey-${p.current.name.toLowerCase()} ${overview?'visit-journey-compact':''}" aria-labelledby="journey-title">
    <div class="journey-light" aria-hidden="true"></div>
    <div class="vj-heading"><div><p class="eyebrow">YOUR PROGRESS</p><h2 id="journey-title">Your membership journey</h2><p class="vj-subtitle">Every visit brings you closer.</p></div><span class="journey-member-badge">${p.current.name} MEMBER</span></div>
    <div class="vj-main"><div class="vj-progress-area"><div class="vj-count"><div><span>Recorded visits</span><strong>${money(p.visits)}<small>completed visits</small></strong></div><div class="vj-remaining">${highest?'<strong>Highest tier unlocked</strong><span>You have unlocked every tier.</span>':`<strong>${money(p.remaining)} <span>visits</span></strong><span>to unlock ${p.next.name} membership.</span>`}</div></div>
    <div class="vj-route"><div class="vj-track" role="progressbar" aria-label="Membership progress" aria-valuemin="0" aria-valuemax="${SyncMembership.levels[2].visits}" aria-valuenow="${Math.min(p.visits,SyncMembership.levels[2].visits)}"><span style="width:${p.percent}%"></span></div><div class="vj-milestones">${SyncMembership.levels.map((level,i)=>`<div class="vj-milestone ${i<=p.index?'reached':''} ${i===p.index?'current':''}"><span class="vj-dot" aria-hidden="true">${i<=p.index?'✓':String(i+1).padStart(2,'0')}</span><strong>${level.name}</strong><small>${level.visits?visitLabel(level.visits):'Free registration'}</small></div>`).join('')}</div></div><p class="vj-count-note">${icon('yoga')}<span>Only completed, checked-in visits count.</span></p></div>
    <aside class="vj-unlock vj-unlock-${target.name.toLowerCase()}"><div class="vj-unlock-top"><span>${highest?'Your Luxe privileges':'Your next unlock'}</span><span class="vj-tier-label">${target.name}</span></div><div class="vj-reward-art" aria-hidden="true"><span class="vj-ticket vj-ticket-back"></span><span class="vj-ticket vj-ticket-front">${icon(target.icon)}<span>SYNC</span></span></div><span class="vj-birthday">Birthday benefit</span><h3>${target.highlight}</h3><p>${target.name==='Core'?'A birthday reward to share your rhythm.':'A birthday reset, reserved for you.'}</p><button class="vj-benefit-button" data-action="tier-benefits" data-tier="${target.name}">View tier benefits <span aria-hidden="true">↗</span></button></aside></div>
    <div class="vj-benefits-heading"><h3>Tier benefit preview</h3><span>Visit targets are provisional.</span></div><div class="vj-benefits">${SyncMembership.levels.map((level,i)=>`<button class="vj-benefit ${i===p.index?'current':''} ${i===p.index+1?'next':''}" data-action="tier-benefits" data-tier="${level.name}"><div class="vj-benefit-top"><span class="vj-benefit-icon">${icon(level.icon)}</span><span class="vj-benefit-state">${i<p.index?'Unlocked':i===p.index?'Current tier':i===p.index+1?'Next unlock':'Keep visiting'}</span></div><div class="vj-benefit-tier"><strong>${level.name}</strong><span>${level.visits?visitLabel(level.visits):'Free registration'}</span></div><h4>${level.highlight}</h4><span class="vj-benefit-more">See benefits <span aria-hidden="true">↗</span></span></button>`).join('')}</div>
    <div class="vj-footer"><p>Purchases and point redemptions do not change your visit count.</p>${overview?'<a href="#rewards/membership">All tier benefits ↗</a>':''}</div>
  </section>`;
}
function tierBenefits(name){
  const level=SyncMembership.levels.find(level=>level.name===name);if(!level)return;
  const p=SyncMembership.progress(state),unlocked=p.visits>=level.visits;
  modal('Your rhythm, rewarded.',`<div class="tier-benefit-detail"><span class="staff-tier ${level.name.toLowerCase()}">${level.name}</span><h3>${level.highlight}</h3><p class="subtitle">${level.visits?visitLabel(level.visits):'Free registration'} · <span>${unlocked?'Unlocked':'Keep visiting'}</span></p><ul>${level.benefits.map(benefit=>`<li><span aria-hidden="true">✓</span><span>${benefit}</span></li>`).join('')}</ul><p class="modal-note">Tier benefits are previews; birthday rewards are not issued automatically in this demo.</p><button class="button" data-action="close">Close dialog</button></div>`)
}

function home(){const newMember=isNewMember();return `<div class="overview-page"><div class="welcome overview-welcome"><div class="welcome-content"><p class="eyebrow">YOUR DAILY OVERVIEW</p><h1>${newMember?'Welcome,':'Welcome back,'} ${escapeHTML(state.name.trim().split(/\s+/)[0])}.</h1><p class="subtitle">${newMember?'Your first wellness moment starts here.':'A little time for yourself, all in one place.'}</p></div><div class="overview-welcome-meta"><span class="overview-tier tier-${tier().toLowerCase()}">${tier()} MEMBER</span><div class="date">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div></div></div>${overviewGlance()}${overviewPasses()}${overviewReminders()}<div class="overview-bottom-grid">${overviewMembership()}${overviewClasses()}</div></div>`}
function experience(service,kicker,title,desc,price){return `<article class="experience"><div class="experience-art ${service==='contrast'?'therapy':''}"><div class="orb"></div><div class="arch"></div><span class="art-label">${service==='yoga'?'BREATHE. MOVE. BE.':'WARMTH. STILLNESS. RENEW.'}</span></div><div class="experience-copy"><p class="eyebrow">${kicker}</p><h3>${title}</h3><p>${desc}</p><div class="experience-bottom"><div class="experience-pricing"><span>${price}</span><small>${service==='yoga'?'NT$750 per session with a 10-pass package':'NT$900 per session with a 10-pass package'}</small></div><button class="text-button" data-action="package-details" data-service="${service}" aria-label="View ${service==='yoga'?'Yoga':'Contrast Therapy'} packages">View packages ↗</button></div></div></article>`}
const rewards=[{id:'yoga',name:'A moment of flow',desc:'1 credit for a 60-minute Yoga class.',cost:9000,icon:'yoga',style:''},{id:'contrast',name:'The complete reset',desc:'1 credit for a 60-minute Contrast Therapy session, including Infrared Steam Bath.',cost:12000,icon:'water',style:'blue'},{id:'guest',name:'Better, together',desc:'A 60-minute yoga guest pass. Share your wellness ritual with a friend.',cost:9000,icon:'gift',style:'plum'}];
const rewardTitles={yoga:'Yoga class credit',contrast:'Contrast Therapy credit',guest:'Yoga Guest Pass'};
let pendingReward=null;
function createRewardCredit(wallet,r,redemptionId){
  const next=JSON.parse(JSON.stringify(wallet)),createdAt=new Date().toISOString(),expiry=addDays(30),code='SYNC-'+crypto.randomUUID().slice(0,8).toUpperCase(),passId=r.id==='guest'?null:crypto.randomUUID();
  next.points-=r.cost;
  const voucher={name:r.name,code,guest:r.id==='guest',expiry,redeemedAt:createdAt,pointsCost:r.cost,passId,rewardId:r.id,redemptionId};
  next.vouchers.unshift(voucher);
  if(passId)next.packages.push({id:passId,service:r.id,remaining:1,total:1,expiry,source:'reward',voucherCode:code,redemptionId,createdAt});
  next.activity.unshift({id:crypto.randomUUID(),kind:'redemption',title:`Reward · ${r.name}`,date:addDays(0),createdAt,points:-r.cost,balanceAfter:next.points,voucherCode:code,redemptionId,actor:'Member action'});
  return {wallet:next,voucher};
}
function reviewReward(id){
  const r=rewards.find(r=>r.id===id);if(!r)return;
  if(state.points<r.cost){toast('You need more points for this reward.');return}
  pendingReward={id:crypto.randomUUID(),rewardId:r.id};
  modal('Confirm your reward',`<div class="redemption-intro"><span class="redemption-symbol">${icon(r.icon)}</span><div><h3>${rewardTitles[r.id]}</h3><p>${r.id==='guest'?'1 guest voucher for a friend':'1 class credit added to your Pass wallet'}</p></div></div><dl class="redemption-facts">${walletField('Points to redeem',money(r.cost))}${walletField('Points after redemption',money(state.points-r.cost))}${walletField('Attend by',fmt(addDays(30)))}${walletField('Added to',r.id==='guest'?'Wallet · Guest vouchers':'Wallet · Pass wallet')}</dl><p class="redemption-note">${r.id==='guest'?'Show your guest voucher at reception before it expires.':'Choose your class later. Your class must take place by the expiry date.'}</p><p class="redemption-note">Valid for 30 days from redemption. Your tier progress stays the same.</p><p id="redemption-error" class="form-error" role="alert"></p><div class="modal-actions redemption-actions"><button class="button light" data-action="close">Go back</button><button class="button" data-action="redeem" data-id="${r.id}" data-request="${pendingReward.id}"><span>Redeem for</span> ${money(r.cost)} <span>points</span></button></div>`);
}
function redeemReward(button){
  const request=pendingReward;if(!request||request.id!==button.dataset.request||request.rewardId!==button.dataset.id)return;
  const r=rewards.find(r=>r.id===request.rewardId);if(!r)return;
  button.disabled=true;
  const result=window.syncPortal?.redeemReward(r.id,request.id);
  if(!result?.ok){button.disabled=false;$('#redemption-error').textContent=I18n.translate(result?.error||'Unable to redeem your reward. Please try again.');return}
  pendingReward=null;state=result.wallet;
  const v=result.voucher,p=walletRewardPass(v),before=count(r.id)-(p?1:0);
  walletNewReward=v.code;if(p)walletChange={service:p.service,passId:p.id,from:before,to:count(p.service),remainingBefore:0,remainingAfter:1,total:1};
  render();
  modal(r.id==='guest'?'Guest voucher added':'Credit added to Wallet',`<div class="redemption-success"><span class="redemption-success-mark" aria-hidden="true">✓</span><h3>${r.id==='guest'?'Your guest voucher is ready':`1 ${rewardTitles[r.id]}`}</h3><p>${r.id==='guest'?'Share a Yoga class with a friend. Show the voucher at reception.':'Your credit is ready. Choose a class now or come back later.'}</p><dl class="redemption-facts">${walletField('Attend by',fmt(v.expiry))}${walletField('Points remaining',money(state.points))}</dl><div class="modal-actions redemption-actions"><button class="button" data-action="wallet" data-section="${r.id==='guest'?'guests':'passes'}">View Wallet <span aria-hidden="true">↗</span></button>${p?`<button class="button light" data-action="wallet-book-pass" data-id="${p.id}">Browse classes <span aria-hidden="true">↗</span></button>`:'<button class="button light" data-action="close">Done</button>'}</div></div>`);
}
function rewardArtwork(id){
  if(id==='yoga')return `<svg class="flow-ribbon" viewBox="0 0 260 190" aria-hidden="true"><defs><linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffde7"/><stop offset=".4" stop-color="#e4f0ba"/><stop offset=".7" stop-color="#91b89a"/><stop offset="1" stop-color="#effbdc"/></linearGradient></defs><path d="M38 138C13 102 61 57 99 64C145 73 93 152 139 153C180 156 228 98 211 59C191 13 125 23 123 65C120 104 182 106 205 129"/></svg>`;
  if(id==='contrast')return `<div class="thermal-orb warm"></div><div class="thermal-orb cool"></div><div class="thermal-orbit"></div>`;
  return `<div class="guest-ticket ticket-back"><img src="assets/logos/sync-logo.svg" alt=""></div><div class="guest-ticket ticket-front"><img src="assets/logos/sync-logo.svg" alt=""><span aria-hidden="true">✳</span></div>`;
}
function rewardCatalog(){return `<div class="rewards-catalog"><div class="panel-title reward-summary"><span class="badge">${money(state.points)} POINTS AVAILABLE</span><a class="text-button" href="#wallet/rewards"><span>Reward history</span> (${state.vouchers.length}) ↗</a></div><div class="page-grid reward-grid">${rewards.map((r,i)=>{const available=state.points>=r.cost;return `<article class="panel reward reward-${r.id}">
  <div class="reward-artwork"><div class="reward-art-top"><span class="reward-edition">0${i+1}</span><span class="duration-chip">60 min</span></div><div class="reward-sculpture" aria-hidden="true">${rewardArtwork(r.id)}</div><span class="art-word">${r.id==='yoga'?'FLOW':r.id==='contrast'?'RESET':'TOGETHER'}</span></div>
  <div class="reward-copy"><p class="eyebrow">${r.name}</p><h3>${rewardTitles[r.id]}</h3><p class="reward-description">${r.desc}</p><p class="reward-delivery">${r.id==='guest'?'Added to Guest vouchers. For a friend.':'Added to your Pass wallet. Choose your class later.'}</p><div class="reward-details"><span>${icon('sun')}Valid 30 days</span><span>${icon(r.id==='guest'?'gift':r.icon)}${r.id==='guest'?'For a friend':'For you'}</span></div></div>
  <div class="reward-redemption"><div class="reward-cost-row"><div class="reward-price">${money(r.cost)} <small>points</small></div><span class="reward-availability ${available?'ready':''}">${available?'Enough points':`${money(r.cost-state.points)} more points to go`}</span></div><button class="button" data-action="reward" data-id="${r.id}" ${available?'':'disabled'}>${available?'Redeem reward ↗':'Keep collecting points'}</button><p class="reward-balance">${available?`Balance after redemption: ${money(state.points-r.cost)} points`:'Your next reward is getting closer.'}</p></div>
  </article>`}).join('')}</div><p class="inline-note">Reward prices are illustrative for this prototype. Redeeming points does not reduce your tier progress.</p></div>`}
const sessions={yoga:[['07:30','Morning Flow','Gentle vinyasa · All levels','6 spaces'],['12:15','Midday Balance','Slow flow · All levels','4 spaces'],['18:30','Evening Unwind','Restorative yoga · All levels','3 spaces']],contrast:[['09:00','Contrast Therapy','Infrared Steam Bath included','2 spaces'],['14:00','Contrast Therapy','Infrared Steam Bath included','4 spaces'],['19:00','Contrast Therapy','Infrared Steam Bath included','2 spaces']]};
function availableSessions(service,date){return window.syncPortal?.sessionsFor(service,date)||sessions[service]}
const bookingTimeIcons={
  morning:'<path d="M3 18h18M5 21h14M7 15a5 5 0 0 1 10 0M12 3v4M4 7l3 3m13-3-3 3M2 13h2m16 0h2"/>',
  afternoon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  evening:'<path d="M3 18h18M5 21h14M7 15a5 5 0 0 1 10 0M12 3v6m-3-3 3 3 3-3M4 7l2 2m14-2-2 2M2 13h2m16 0h2"/>',
  night:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5ZM17 3v4m-2-2h4M21 8v2m-1-1h2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ended:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'
};
const bookingTimeIcon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${bookingTimeIcons[name]}</svg>`;
function bookingDaypart(time){const hour=Number(time.slice(0,2));return hour<6||hour>=21?'night':hour<12?'morning':hour<17?'afternoon':'evening'}
function bookingSessionPhase(date,time,now=Date.now()){const start=sessionStart(date,time);return now>=start+3600000?'ended':now>=start?'in-progress':'upcoming'}
function bookingEndTime(time){const minutes=(Number(time.slice(0,2))*60+Number(time.slice(3,5))+60)%1440;return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`}
function bookingAvailabilityNote(time,spaces,phase){return phase==='upcoming'?escapeHTML(spaces):`<span>${phase==='ended'?'Ended at':'Ends at'}</span> <span>${bookingEndTime(time)}</span>`}
function bookingButtonLabel(spaces,phase){return phase==='upcoming'?(parseInt(spaces,10)===0?'Fully booked':'Book session ↗'):`${bookingTimeIcon(phase==='ended'?'ended':'clock')}<span>${phase==='ended'?'Ended':'In progress'}</span>`}
function bookingSessionRow(s,index,now){
  const [time,title,description,spaces]=s,phase=bookingSessionPhase(bookingDate,time,now),part=bookingDaypart(time),partLabel=part[0].toUpperCase()+part.slice(1);
  return `<article class="booking-row" data-session-time="${escapeHTML(time)}" data-session-state="${phase}" data-session-spaces="${escapeHTML(spaces)}"><div class="booking-session-clock"><span class="booking-daypart daypart-${part}">${bookingTimeIcon(part)}<span>${partLabel}</span></span><div class="booking-time"><time datetime="${bookingDate}T${escapeHTML(time)}:00+08:00">${escapeHTML(time)}</time><span class="booking-end-time">– <time datetime="${new Date(sessionStart(bookingDate,time)+3600000).toISOString()}">${bookingEndTime(time)}</time></span></div></div><div class="booking-info"><h3>${escapeHTML(title)}</h3><p>60 minutes · ${escapeHTML(description)}</p></div><div class="booking-availability"><span class="spots">${bookingAvailabilityNote(time,spaces,phase)}</span><button class="button" data-action="book" data-index="${index}" ${phase!=='upcoming'||parseInt(spaces,10)===0?'disabled':''}>${bookingButtonLabel(spaces,phase)}</button></div></article>`;
}
function bookingPage(){const now=Date.now(),selectedPass=state.packages.find(p=>p.id===bookingPassId),lastDate=selectedPass&&selectedPass.expiry<addDays(30)?selectedPass.expiry:addDays(30);return intro('A ritual worth returning to','Make time for yourself.','Choose your next 60-minute reset at SYNC Xinyi.')+`<div class="tabs"><button data-action="filter" data-service="yoga" class="${bookingService==='yoga'?'selected':''}">Yoga</button><button data-action="filter" data-service="contrast" class="${bookingService==='contrast'?'selected':''}">Contrast Therapy</button></div>${walletBookingContext()}<div class="panel-title booking-tools"><label class="field" style="margin:0">Session date<input id="booking-date" type="date" value="${bookingDate}" min="${addDays(0)}" max="${lastDate}"></label><button class="text-button" data-action="packages">${count(bookingService)} passes available · Get passes ↗</button></div><p class="booking-timezone-note">Times shown in Taipei time (UTC+8).</p><div class="booking-list" data-session-date="${bookingDate}">${availableSessions(bookingService,bookingDate).map((s,i)=>bookingSessionRow(s,i,now)).join('')||'<p class="empty">No sessions available for this date.</p>'}</div><div class="section-title"><h2>Your bookings</h2></div><section class="panel">${bookingList()}</section><p class="inline-note">${bookingPassId?"Your selected pass will be used. Sessions must take place by its expiry date.":"Sample timetable. Bookings use the eligible pass that expires first. Sessions must take place by the pass expiry date."}</p>`}
let bookingSessionTimer;
function refreshBookingSessionStates(){
  clearTimeout(bookingSessionTimer);bookingSessionTimer=null;
  const list=$('.booking-list[data-session-date]');if(location.hash.slice(1).split('/')[0]!=='book'||!list||document.hidden)return;
  const date=list.dataset.sessionDate,now=Date.now();let next=Infinity;
  for(const row of list.querySelectorAll('[data-session-time]')){
    const time=row.dataset.sessionTime,phase=bookingSessionPhase(date,time,now),start=sessionStart(date,time);
    if(row.dataset.sessionState!==phase){
      row.dataset.sessionState=phase;
      row.querySelector('.spots').innerHTML=I18n.html(bookingAvailabilityNote(time,row.dataset.sessionSpaces,phase));
      const button=row.querySelector('[data-action=book]');button.disabled=phase!=='upcoming'||parseInt(row.dataset.sessionSpaces,10)===0;button.innerHTML=I18n.html(bookingButtonLabel(row.dataset.sessionSpaces,phase));
    }
    const boundary=start>now?start:start+3600000;if(boundary>now)next=Math.min(next,boundary);
  }
  if(Number.isFinite(next))bookingSessionTimer=setTimeout(refreshBookingSessionStates,Math.min(2147483647,Math.max(25,next-now+25)));
}
document.addEventListener('visibilitychange',refreshBookingSessionStates);
window.addEventListener('focus',refreshBookingSessionStates);
window.addEventListener('pageshow',refreshBookingSessionStates);
window.addEventListener('hashchange',refreshBookingSessionStates);
window.addEventListener('pagehide',()=>{clearTimeout(bookingSessionTimer);bookingSessionTimer=null});
function sessionStart(date,time){return new Date(`${date}T${time}:00+08:00`).getTime()}
function bookingOverlap(date,time){const start=sessionStart(date,time);return state.bookings.some(b=>Math.abs(sessionStart(b.date,b.time)-start)<60*60*1000)}
function bookingList(id){const bookings=id?state.bookings.filter(b=>b.id===id):state.bookings;return bookings.length?bookings.map(b=>`<div class="modal-row"><div><strong>${escapeHTML(b.title)}</strong><div class="subtitle">${fmt(b.date)} · ${b.time}</div></div><button class="text-button" data-action="cancel" data-id="${b.id}">Cancel</button></div>`).join(''):'<div class="empty">Your next moment is waiting. Book a session above.</div>'}
function membershipPage(){
  const levels=SyncMembership.levels;
  const current=levels.findIndex(t=>t.name===tier());
  return `<div class="membership-view">${membershipJourney()}<div class="section-title"><h2>All tier benefits</h2></div><div class="page-grid tier-grid">${levels.map((t,i)=>`<section class="panel tier-card tier-${t.name.toLowerCase()} ${tier()===t.name?'current-tier':''}" aria-labelledby="tier-title-${t.name.toLowerCase()}">
    <div class="tier-card-top"><p class="eyebrow">SYNC MEMBERSHIP</p><span class="tier-rank">0${i+1}</span></div>
    <div class="tier-identity"><div class="tier-heading"><h2 id="tier-title-${t.name.toLowerCase()}">${t.name}</h2><p class="tier-caption">${t.caption}</p></div><div class="tier-art" aria-hidden="true"><div class="tier-sculpture"><span class="sculpture-part"></span><span class="sculpture-part"></span><span class="sculpture-part"></span>${t.name==='Luxe'?'<svg class="luxe-star" viewBox="0 0 100 100"><path d="M50 3C53 35 65 47 97 50C65 53 53 65 50 97C47 65 35 53 3 50C35 47 47 35 50 3Z"/></svg>':''}</div></div></div>
    <div class="tier-qualification"><p class="threshold"><strong>${t.visits?visitLabel(t.visits):'Free registration'}</strong><span>${t.visits?'Completed visits':'Your membership starts here'}</span></p><span class="badge">${i===current?'YOUR CURRENT TIER':i<current?'BENEFITS INCLUDED':i===current+1?'NEXT TIER':'HIGHEST TIER'}</span></div>
    <div class="tier-benefits"><p class="eyebrow">${t.name==='Luxe'?'EXCLUSIVE PRIVILEGES':'MEMBER BENEFITS'}</p><ul>${t.benefits.map(b=>`<li><span class="benefit-check" aria-hidden="true">✓</span><span>${b}</span></li>`).join('')}</ul></div>
    <div class="tier-card-bottom"><span>${t.name==='Plus'?'Your space. Your pace.':t.name==='Core'?'More moments. More connection.':'A little extraordinary.'}</span><img src="assets/logos/sync-logo.svg" alt="SYNC"></div>
  </section>`).join('')}</div><p class="inline-note">Visit milestones and benefits are provisional. Only recorded staff check-ins count toward your tier.</p></div>`
}

function activityTable(){return `<table class="table"><thead><tr><th>ACTIVITY</th><th>DATE</th><th>POINTS</th></tr></thead><tbody>${state.activity.map(a=>`<tr><td>${a.title}</td><td>${fmt(a.date)}</td><td class="${a.points>=0?'positive':'negative'}">${a.points>=0?'+':'−'}${money(Math.abs(a.points))}</td></tr>`).join('')}</tbody></table>`}
function accountPage(){return intro('Your personal space','All your moments, together.','Your profile and points activity, in one place.')+`<div class="account-layout"><section class="panel"><div class="profile-avatar">${initials()}</div><h2 style="font-weight:450">${escapeHTML(state.name)}</h2><span class="badge">${tier().toUpperCase()} MEMBER</span><div class="profile-detail"><span>Member number</span><strong>SYNC ${memberNumber()}</strong></div><div class="profile-detail"><span>Home club</span><strong>Taipei · Xinyi</strong></div><div class="profile-detail"><span>Available points</span><strong>${money(state.points)}</strong></div><div class="account-destinations"><a class="button light" href="#wallet">Open Wallet ↗</a><a class="text-button" href="#rewards/membership">View benefits ↗</a></div><button class="text-button" data-action="reset" style="margin-top:20px">Reset demo data ↺</button></section><section class="panel"><div class="panel-title"><h2>Points activity</h2></div>${activityTable()}</section></div>`}
function sectionNavigation(route,items,selected,label){return `<nav class="member-section-nav" aria-label="${label}">${items.map(([id,name])=>`<a href="#${route}/${id}" ${id===selected?'aria-current="page"':''}>${name}</a>`).join('')}</nav>`}
function rewardPage(section='redeem'){
  const selected=section==='membership'?'membership':'redeem';
  return `<div class="rewards-view rewards-hub">${intro('Your points, your possibilities','Rewards','Redeem your points, follow your visits and explore your membership benefits.')}${sectionNavigation('rewards',[['redeem','Redeem points'],['membership','Membership benefits']],selected,'Rewards sections')}<div id="rewards-content">${selected==='membership'?membershipPage():rewardCatalog()}</div></div>`;
}
// Wallet presentation uses existing package and redemption records without rewriting them.
let walletChange=null,walletNewReward=null,walletNavFrom=null,bookingPassId=null;
const walletService=s=>s==='yoga'?'Yoga':'Contrast Therapy';
function walletRewardPass(v,wallet=state){return v.guest?null:wallet.packages.find(p=>p.id===v.passId)||wallet.packages.find(p=>p.voucherCode===v.code)||null}
function walletRewardBooking(v,wallet=state){const p=walletRewardPass(v,wallet);return p?[...wallet.bookings,...(wallet.visitHistory||[])].filter(b=>b.passId===p.id&&b.status!=='cancelled').sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time))[0]:null}
function walletPassBookings(p,wallet=state){return [...wallet.bookings,...(wallet.visitHistory||[])].filter((b,i,all)=>b.passId===p.id&&b.status!=='cancelled'&&all.findIndex(x=>x.id===b.id)===i)}
function walletBookingChecked(b,wallet=state){return !!b.checkedInAt||!!wallet.attendance?.some(a=>(a.bookingId||a.id)===b.id)}
function walletRewardStatus(v,wallet=state){
  const p=walletRewardPass(v,wallet);
  if(v.used)return 'Used';
  if(p)return walletPassStatus(p,wallet);
  if(v.expiry&&v.expiry<addDays(0))return 'Expired';
  if(!v.expiry||!/^\d{4}-\d{2}-\d{2}$/.test(v.expiry)||!Number.isFinite(Date.parse(v.expiry)))return 'Needs confirmation';
  if(v.guest)return 'Available';
  return 'Needs confirmation';
}
function walletStatus(label){return `<span class="wallet-status ${label==='Available'?'available':label==='Expired'?'expired':label==='Needs confirmation'?'attention':label==='Reserved'?'reserved':''}">${label}</span>`}
function walletPassStatus(p,wallet=state){
  const reward=wallet.vouchers.find(v=>!v.guest&&(v.passId===p.id||v.code===p.voucherCode)),records=walletPassBookings(p,wallet);
  if(reward?.used)return 'Used';
  if(p.remaining>0)return p.expiry<addDays(0)?'Expired':'Available';
  if(records.some(b=>!walletBookingChecked(b,wallet)&&sessionStart(b.date,b.time)+3600000>Date.now()))return 'Reserved';
  if(records.length&&records.every(b=>walletBookingChecked(b,wallet)))return reward?'Used':'Used up';
  if(p.expiry<addDays(0))return 'Expired';
  return reward||records.some(b=>!walletBookingChecked(b,wallet))?'Needs confirmation':'Used up';
}
function walletSource(p){return ({purchase:'Purchased pass',reward:'Reward pass',staff:'Staff-issued pass'})[p.source]||'Unavailable'}
function walletMeter(p){return `<div class="wallet-session-meter ${p.total>10?'continuous':''}" role="img" aria-label="${p.remaining} of ${p.total} sessions available">${p.total>10?`<span style="width:${p.total?p.remaining/p.total*100:0}%"></span>`:Array.from({length:p.total},(_,i)=>`<span class="${i>=p.remaining?'allocated':''}" aria-hidden="true"></span>`).join('')}</div>`}
function walletPassRow(p,first=false){
  const status=walletPassStatus(p),active=status==='Available',soon=active&&p.expiry<=addDays(14),fresh=active&&p.voucherCode===walletNewReward,bookings=walletPassBookings(p).filter(b=>!walletBookingChecked(b)&&sessionStart(b.date,b.time)+3600000>Date.now()),reserved=status==='Reserved',reward=p.source==='reward';
  return `<article class="wallet-pass-card ${!active&&!reserved?'wallet-pass-past':''} ${fresh?'wallet-new-credit':''}" data-pass-id="${escapeHTML(p.id)}" ${fresh?'tabindex="-1" aria-label="New reward credit"':''}><div class="wallet-package-top"><div><strong>${reward&&p.total===1?rewardTitles[p.service]:p.total===1?'Single session':`<span>${p.total}</span> <span>session package</span>`}</strong>${p.source?`<span class="wallet-package-source">${reward?'From rewards':walletSource(p)}</span>`:''}</div>${fresh?'<span class="wallet-use-first">Just added</span>':active?(first?'<span class="wallet-use-first">Use first</span>':''):walletStatus(status)}</div><div class="wallet-package-balance"><strong>${money(reserved?bookings.length:p.remaining)}</strong><span>${reserved?'reserved for your booking':reward&&active?'class credit available':`of ${p.total} sessions available`}</span></div>${walletMeter(p)}${reserved?bookings.map(b=>`<div class="wallet-reserved-booking"><div><strong>${escapeHTML(b.title)}</strong><span>${fmt(b.date)} · ${b.time}</span></div><button class="wallet-detail-link" data-action="manage-booking" data-id="${escapeHTML(b.id)}">Manage booking <span aria-hidden="true">↗</span></button></div>`).join(''):''}<div class="wallet-package-bottom"><div><span class="wallet-expiry ${soon?'soon':''}"><span>Expires</span> ${fmt(p.expiry)}</span>${soon?'<span class="wallet-expiring-note">Expiring soon</span>':''}</div><button class="wallet-detail-link" data-action="wallet-pass-details" data-id="${escapeHTML(p.id)}">Pass details <span aria-hidden="true">↗</span></button></div>${reward&&active?`<button class="button wallet-primary wallet-credit-book" data-action="wallet-book-pass" data-id="${escapeHTML(p.id)}">Book a class <span aria-hidden="true">↗</span></button>`:''}</article>`;
}
function walletPasses(){
  const reserved=state.packages.filter(p=>['Reserved','Needs confirmation'].includes(walletPassStatus(p))),past=state.packages.filter(p=>['Expired','Used','Used up'].includes(walletPassStatus(p))).sort((a,b)=>b.expiry.localeCompare(a.expiry));
  return `<section aria-labelledby="wallet-passes-title"><div class="wallet-section-heading"><div><h2 id="wallet-passes-title">Your passes</h2><p>Your earliest-expiring eligible pass is used first.</p></div><button class="button light" data-action="packages">Get passes <span aria-hidden="true">↗</span></button></div>${!state.packages.length?'<div class="wallet-first-visit"><span>No passes yet.</span><p>Your purchased and redeemed passes will appear here.</p></div>':''}<div class="wallet-service-grid">${['yoga','contrast'].map(s=>{
    const packages=eligible(s),n=count(s),more=packages.slice(1),moreCount=more.reduce((sum,p)=>sum+p.remaining,0);
    return `<article class="wallet-service-card wallet-service-${s}" aria-labelledby="wallet-${s}-title"><div class="wallet-service-face"><div class="wallet-service-art" aria-hidden="true"><span></span><span></span><span></span></div><div class="wallet-service-top"><span>SYNC / <span>${s==='yoga'?'MOVE & CONNECT':'REST & RESTORE'}</span></span>${icon(s==='yoga'?'yoga':'water')}</div><h3 id="wallet-${s}-title">${walletService(s)}</h3><div class="wallet-service-balance"><strong data-wallet-number="${s}" data-value="${n}">${money(n)}</strong><span>sessions available</span></div></div><div class="wallet-service-body">${packages.length?`${walletPassRow(packages[0],packages.length>1)}${more.length?`<details class="wallet-more-packages" ${more.some(p=>p.voucherCode===walletNewReward)?'open':''}><summary><span>More packages</span><span><strong>${money(moreCount)}</strong> <span>sessions</span><span class="wallet-chevron" aria-hidden="true">⌄</span></span></summary><div class="wallet-expanded">${more.map(p=>walletPassRow(p)).join('')}</div></details>`:''}<button class="button wallet-primary" data-action="service" data-service="${s}">Book ${walletService(s)} <span aria-hidden="true">↗</span></button>`:`<div class="wallet-service-empty"><p>No active passes</p><span>Make room for your next ritual.</span></div><button class="button wallet-primary" data-action="packages" data-service="${s}">Get ${walletService(s)} passes <span aria-hidden="true">↗</span></button>`}</div></article>`;
  }).join('')}</div>${reserved.length?`<section class="wallet-reserved" aria-labelledby="wallet-reserved-title"><div class="wallet-section-heading"><div><h2 id="wallet-reserved-title">Reservations & visits</h2><p>Your booked credits stay here until attendance is recorded.</p></div></div><div class="wallet-past-grid">${reserved.map(p=>`<div class="wallet-history-package"><h3>${walletService(p.service)}</h3>${walletPassRow(p)}</div>`).join('')}</div></section>`:''}${past.length?`<details class="wallet-past-passes"><summary><span>Past passes</span><span>${past.length}<span class="wallet-chevron" aria-hidden="true">⌄</span></span></summary><div class="wallet-past-grid wallet-expanded">${past.map(p=>`<div class="wallet-history-package"><h3>${walletService(p.service)}</h3>${walletPassRow(p)}</div>`).join('')}</div></details>`:''}</section>`;
}
function walletRewardActions(v,status){
  const code=escapeHTML(v.code),p=walletRewardPass(v),b=walletRewardBooking(v);
  if(status==='Available'&&v.guest)return `<button class="button wallet-primary" data-action="wallet-reward-details" data-code="${code}">Show voucher <span aria-hidden="true">↗</span></button><button class="wallet-detail-link" data-action="wallet-copy" data-code="${code}">Copy code</button>`;
  if(status==='Available'&&p)return `<button class="button wallet-primary" data-action="wallet-book-pass" data-id="${escapeHTML(p.id)}">Book a class <span aria-hidden="true">↗</span></button><button class="wallet-detail-link" data-action="wallet-reward-details" data-code="${code}">Reward details</button>`;
  if(status==='Reserved'&&b)return `<button class="button wallet-primary" data-action="manage-booking" data-id="${escapeHTML(b.id)}">Manage booking <span aria-hidden="true">↗</span></button><button class="wallet-detail-link" data-action="wallet-reward-details" data-code="${code}">Reward details</button>`;
  return `<button class="${status==='Needs confirmation'?'button wallet-primary':'wallet-detail-link'}" data-action="wallet-reward-details" data-code="${code}">${status==='Needs confirmation'?'View reward details':'Reward details'} <span aria-hidden="true">↗</span></button>`;
}
function voucherList(vouchers=state.vouchers){
  if(!vouchers.length)return '<div class="panel wallet-empty"><span class="wallet-empty-icon">'+icon('gift')+'</span><h3>No guest vouchers yet</h3><p>Redeem a guest reward to share a Yoga class with a friend.</p><a class="button" href="#rewards/redeem">Explore rewards ↗</a></div>';
  return `<div class="wallet-card-grid">${[...vouchers].sort((a,b)=>['Available','Reserved','Needs confirmation','Used','Expired'].indexOf(walletRewardStatus(a))-['Available','Reserved','Needs confirmation','Used','Expired'].indexOf(walletRewardStatus(b))).map(v=>{
    const status=walletRewardStatus(v),p=walletRewardPass(v);
    return `<article class="wallet-reward-card ${v.guest?'wallet-guest-reward':''} ${walletNewReward===v.code?'wallet-new-reward':''}" data-voucher-code="${escapeHTML(v.code)}"><div class="wallet-reward-top"><span class="wallet-reward-symbol">${icon(v.guest?'gift':'sun')}</span>${walletStatus(status)}</div><span class="wallet-reward-type">${v.guest?'Guest voucher':'Reward pass'}</span><h3>${escapeHTML(v.name)}</h3><p class="wallet-reward-description">${status==='Needs confirmation'?'Ask the front desk to confirm how to use this reward.':v.guest?'A wellness moment to share with a friend.':p?walletService(p.service):'Your reward pass is in your wallet.'}</p><code class="wallet-voucher-code">${escapeHTML(v.code)}</code><div class="wallet-card-meta"><span>Expiry date</span><strong>${walletExpiry(v.expiry)}</strong></div><div class="wallet-reward-actions">${walletRewardActions(v,status)}</div></article>`;
  }).join('')}</div>`;
}
function walletRewardHistory(){
  if(!state.vouchers.length)return '<div class="panel wallet-empty"><span class="wallet-empty-icon">'+icon('gift')+'</span><h3>No redeemed rewards yet.</h3><p>Your redeemed rewards will appear here.</p><a class="button" href="#rewards/redeem">Explore rewards ↗</a></div>';
  return `<div class="wallet-redemption-history">${[...state.vouchers].sort((a,b)=>(b.redeemedAt||'').localeCompare(a.redeemedAt||'')).map(v=>{const p=walletRewardPass(v),title=v.guest?rewardTitles.guest:p?rewardTitles[p.service]:v.name;return `<article class="wallet-history-row" data-voucher-code="${escapeHTML(v.code)}"><span class="wallet-reward-symbol">${icon(v.guest?'gift':p?.service==='yoga'?'yoga':'water')}</span><div class="wallet-history-copy"><h3>${escapeHTML(title)}</h3><p><span>Redeemed</span> · ${walletWhen(v.redeemedAt)}</p><p><span>Points spent</span> · ${Number.isSafeInteger(v.pointsCost)?money(v.pointsCost):'Unavailable'}</p></div><div class="wallet-history-actions">${walletStatus(walletRewardStatus(v))}<button class="wallet-detail-link" data-action="wallet-reward-details" data-code="${escapeHTML(v.code)}">${v.guest?'View voucher':'View credit'} <span aria-hidden="true">↗</span></button></div></article>`}).join('')}</div>`;
}
function walletPage(section='passes'){
  const selected=['rewards','guests'].includes(section)?section:'passes',guests=state.vouchers.filter(v=>v.guest),available=guests.filter(v=>walletRewardStatus(v)==='Available').length;
  return `<div class="wallet-view">${intro('Your next visit starts here','Wallet','Your passes, ready when you are.')}<div class="wallet-summary" aria-label="Your wallet balances"><section><strong data-wallet-summary="yoga">${money(count('yoga'))}</strong><span>${icon('yoga')}Yoga passes</span></section><section><strong data-wallet-summary="contrast">${money(count('contrast'))}</strong><span>${icon('water')}Contrast Therapy passes</span></section><section><strong data-wallet-summary="guests">${available}</strong><span>${icon('gift')}Guest vouchers</span></section></div><nav class="member-section-nav wallet-section-nav" aria-label="Wallet sections"><a href="#wallet/passes" ${selected==='passes'?'aria-current="page"':''}>Pass wallet</a><a href="#wallet/guests" ${selected==='guests'?'aria-current="page"':''}>Guest vouchers</a><a href="#wallet/rewards" ${selected==='rewards'?'aria-current="page"':''}>Reward history</a><span class="wallet-tab-indicator" aria-hidden="true"></span></nav><div id="wallet-content">${selected==='passes'?walletPasses():`<section aria-labelledby="wallet-rewards-title"><div class="wallet-section-heading"><div><h2 id="wallet-rewards-title">${selected==='guests'?'Guest vouchers':'Reward history'}</h2><p>${selected==='guests'?'For friends. Show the voucher at reception.':'Your redemption records. Class credits are included in your Pass wallet.'}</p></div><a class="text-button" href="#rewards/redeem">Explore rewards ↗</a></div>${selected==='guests'?voucherList(guests):walletRewardHistory()}</section>`}</div></div>`;
}
function walletExpiry(date){return date&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))?fmt(date):'Unavailable'}
function walletWhen(at){return at&&Number.isFinite(Date.parse(at))?new Date(at).toLocaleString('en-GB',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Taipei'}):'Unavailable'}
function walletField(label,value){return `<div><dt>${label}</dt><dd>${value}</dd></div>`}
function walletPassDetails(id){
  const p=state.packages.find(p=>p.id===id);if(!p)return;
  const records=[...state.bookings,...(state.visitHistory||[])].filter((b,i,all)=>b.passId===p.id&&all.findIndex(x=>x.id===b.id)===i).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)),status=walletPassStatus(p),active=status==='Available',reserved=status==='Reserved'?walletPassBookings(p).filter(b=>!walletBookingChecked(b)&&sessionStart(b.date,b.time)+3600000>Date.now()).length:0;
  modal('Pass details',`<div class="wallet-detail-intro"><span class="wallet-detail-icon">${icon(p.service==='yoga'?'yoga':'water')}</span><div><h3>${walletService(p.service)}</h3>${walletStatus(walletPassStatus(p))}</div></div><div class="wallet-detail-balance"><strong>${reserved||p.remaining}</strong><span>${reserved?'reserved for your booking':`of ${p.total} sessions available`}</span></div>${walletMeter(p)}<dl class="wallet-detail-fields">${walletField('Expiry date',fmt(p.expiry))}${walletField('Source',walletSource(p))}${walletField('Issued',walletWhen(p.createdAt))}${p.orderId?walletField('Order',escapeHTML(p.orderId)):''}${p.reason?walletField('Reason',escapeHTML(p.reason)):''}</dl><h3 class="wallet-detail-section-title">Reservations & visits</h3><p class="wallet-detail-note">Reservations deduct a session. Attendance is recorded at check-in.</p>${records.length?`<div class="wallet-record-list">${records.map(b=>{const status=b.status==='cancelled'?'Cancelled':walletBookingChecked(b)?'Checked in':sessionStart(b.date,b.time)+3600000>Date.now()?'Booked':'Past booking';return `<article><div><strong>${escapeHTML(b.title)}</strong><span>${fmt(b.date)} · ${b.time}</span></div><div>${walletStatus(status)}${status==='Booked'?`<button class="wallet-detail-link" data-action="manage-booking" data-id="${escapeHTML(b.id)}">Manage booking</button>`:''}</div></article>`}).join('')}</div>`:'<p class="wallet-detail-empty">No reservations recorded for this pass.</p>'}${active?`<button class="button wallet-primary wallet-detail-book" data-action="wallet-book-pass" data-id="${escapeHTML(p.id)}">Book with this pass <span aria-hidden="true">↗</span></button>`:''}`,{wallet:true});
}
function walletRewardDetails(code){
  const v=state.vouchers.find(v=>v.code===code);if(!v)return;
  const status=walletRewardStatus(v),p=walletRewardPass(v);
  modal(v.guest?'Your guest voucher':'Reward details',`<div class="wallet-detail-intro"><span class="wallet-detail-icon">${icon(v.guest?'gift':'sun')}</span><div><h3>${escapeHTML(v.guest?rewardTitles.guest:p?rewardTitles[p.service]:v.name)}</h3>${walletStatus(status)}</div></div><p class="wallet-detail-note">${status==='Needs confirmation'?'Please show this reward reference to the front desk. Its usable status needs confirmation.':v.guest&&status==='Available'?'Show this voucher at reception. It can be used once before expiry.':status==='Available'&&p?'Book the linked service with your reward pass.':status==='Reserved'?'Your reward pass is reserved for an upcoming session. Manage your booking below.':'This reward is no longer available to use.'}</p><span class="wallet-code-label">${v.guest?'Voucher code':'Reward reference'}</span><code class="wallet-voucher-code wallet-large-code">${escapeHTML(v.code)}</code><dl class="wallet-detail-fields">${walletField('Expiry date',walletExpiry(v.expiry))}${walletField('Redeemed',walletWhen(v.redeemedAt))}${walletField('Points spent',Number.isSafeInteger(v.pointsCost)?money(v.pointsCost):'Unavailable')}${v.usedAt?walletField('Used on',walletWhen(v.usedAt)):''}</dl><div class="wallet-reward-actions">${walletRewardActions(v,status).replace(/<button\b[^>]*data-action="wallet-reward-details"[^>]*>[^]*?<\/button>/g,'')}</div>${p?`<button class="wallet-detail-link" data-action="wallet-pass-details" data-id="${escapeHTML(p.id)}">Pass details <span aria-hidden="true">↗</span></button>`:''}`,{wallet:true});
}
async function walletCopyCode(code,button){
  const v=state.vouchers.find(v=>v.code===code);if(!v||!v.guest||walletRewardStatus(v)!=='Available')return;
  try{await navigator.clipboard.writeText(v.code);if(button.isConnected){button.textContent=I18n.translate('Copied');setTimeout(()=>{if(button.isConnected)button.textContent=I18n.translate('Copy code')},1800)}toast('Voucher code copied.')}catch{walletRewardDetails(v.code);toast('Select the voucher code to copy it.');}
}
function walletStartBooking(id){
  const p=state.packages.find(p=>p.id===id);if(!p||walletPassStatus(p)!=='Available'){toast('This pass is no longer available.');return}
  bookingService=p.service;bookingPassId=p.id;bookingDate=addDays(0);
  for(let day=0;day<=30;day++){const date=addDays(day);if(date>p.expiry)break;if(availableSessions(p.service,date).some(s=>parseInt(s[3],10)>0&&sessionStart(date,s[0])>Date.now()&&!bookingOverlap(date,s[0]))){bookingDate=date;break}}
  if($('#booking-date'))$('#booking-date').value=bookingDate;$('#modal').close();location.hash='book';render();
}
function walletBookingContext(){
  const p=state.packages.find(p=>p.id===bookingPassId);if(!p)return '';
  return `<div class="wallet-booking-context"><div><strong>${p.source==='reward'?'Using your reward credit':'Selected pass'}</strong><span>${walletService(p.service)} · <span>Attend by</span> ${fmt(p.expiry)}</span></div><button class="wallet-detail-link" data-action="wallet-clear-pass">Use another pass</button></div>`;
}
function animateWallet(){
  const nav=$('.wallet-section-nav'),active=nav?.querySelector('[aria-current]'),line=nav?.querySelector('.wallet-tab-indicator'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(active&&line){const left=active.offsetLeft,width=active.offsetWidth;line.style.left=left+'px';line.style.width=width+'px';if(!reduced&&walletNavFrom&&width)line.animate?.([{transform:`translateX(${walletNavFrom.left-left}px) scaleX(${walletNavFrom.width/width})`},{transform:'none'}],{duration:220,easing:'ease-out'});}
  walletNavFrom=null;
  if(walletChange&&$('.wallet-service-grid')){
    const change=walletChange;walletChange=null;
    if(change.to===count(change.service)&&change.to!==change.from&&!reduced){
      const el=$(`[data-wallet-number="${change.service}"]`);el?.animate?.([{opacity:.45,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:280,easing:'ease-out'});
      const meter=$('.wallet-pass-card[data-pass-id="'+CSS.escape(change.passId)+'"] .wallet-session-meter');
      if(meter?.classList.contains('continuous'))meter.firstElementChild?.animate?.([{width:(change.remainingBefore/change.total*100)+'%'},{width:(change.remainingAfter/change.total*100)+'%'}],{duration:300,easing:'ease-out'});
      else if(meter){const segment=meter.children[Math.min(change.remainingBefore,change.remainingAfter)];if(segment){const oldColor=change.remainingAfter<change.remainingBefore?(change.service==='yoga'?'#6d8c61':'#658899'):(change.service==='yoga'?'#dce4d7':'#d8e3e8');segment.animate?.([{backgroundColor:oldColor,transform:'scaleY(1.7)'},{backgroundColor:getComputedStyle(segment).backgroundColor,transform:'scaleY(1)'}],{duration:300,easing:'ease-out'});}}
    }
  }
  const fresh=$('.wallet-new-credit')||$('.wallet-new-reward');
  if(walletNewReward&&$('.wallet-view')&&!fresh)walletNewReward=null;
  if(fresh){if(!reduced)fresh.animate?.([{opacity:.5,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:350,easing:'ease-out'});requestAnimationFrame(()=>{if(fresh.isConnected&&!$('#modal').open){fresh.scrollIntoView({block:'nearest',behavior:'instant'});fresh.focus({preventScroll:true})}});walletNewReward=null;}
}

function render(){
  const oldTab=$('.wallet-section-nav [aria-current]');walletNavFrom=oldTab?{left:oldTab.offsetLeft,width:oldTab.offsetWidth}:null;
  const selectedDate=$('#booking-date')?.value;if(selectedDate)bookingDate=selectedDate;
  let [route,section]=location.hash.slice(1).split('/');route=route||'home';
  if(route==='membership'){route='rewards';section='membership';history.replaceState(null,'','#rewards/membership')}
  if(!navs.some(n=>n[0]===route))route='home';
  document.body.classList.toggle('overview-shell',route==='home');
  document.querySelector('meta[name=theme-color]')?.setAttribute('content','#101f1b');
  if(route!=='book')bookingPassId=null;
  $('#navigation').innerHTML=I18n.html(navs.map(([id,label])=>`<a href="#${id}" class="${route===id?'active':''}" ${route===id?'aria-current="page"':''}>${label}</a>`).join(''));
  $('#app').innerHTML=I18n.html(`<div class="view-enter">${({home,book:bookingPage,rewards:rewardPage,wallet:walletPage,account:accountPage})[route](section)}</div>`);
  I18n.chrome();animatePoints();animateWallet();refreshBookingSessionStates();
}
function animatePoints(){let el=$('[data-count]');if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;let end=Number(el.dataset.count),start=performance.now();function step(t){let p=Math.min(1,(t-start)/850);el.textContent=money(Math.round(end*(1-Math.pow(1-p,3))));if(p<1&&el.isConnected)requestAnimationFrame(step)}requestAnimationFrame(step)}
const prices={yoga:[900,4000,7500],contrast:[1200,5000,9000]},sizes=[1,5,10],validity=[30,90,180];
function packageModal(service='yoga'){modal('Make it a ritual.',`<div class="tabs"><button data-action="package-filter" data-service="yoga" class="${service==='yoga'?'selected':''}">Yoga</button><button data-action="package-filter" data-service="contrast" class="${service==='contrast'?'selected':''}">Contrast Therapy</button></div>${sizes.map((n,i)=>`<div class="modal-row"><div><strong>${n===1?'Single session':n+' sessions'}</strong><div class="subtitle">60 min · Valid ${validity[i]} days<br>Earn ${money(prices[service][i])} points</div></div><button class="button light" data-action="purchase-review" data-service="${service}" data-index="${i}">NT$${money(prices[service][i])}</button></div>`).join('')}<p class="modal-note">Demo purchases only. No payment is collected.</p>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,s=b.dataset.service,i=Number(b.dataset.index);
if(window.syncPortal?.allowMemberAction&&!window.syncPortal.allowMemberAction(a))return;
if(a==='language'){const date=$('#booking-date')?.value;I18n.toggle();render();if(date&&$('#booking-date'))$('#booking-date').value=date;if($('#modal').open&&currentModal)modal(currentModal.title,currentModal.body,{wallet:currentModal.wallet});if(cancellationDialog.open){renderCancellationNotice();cancellationDialog.querySelector('[autofocus]').focus()}if(currentToast)$('#toast').textContent=I18n.translate(currentToast);return}
if(a==='close')$('#modal').close();
if(a==='profile')location.hash='account';
if(a==='activity')modal('Your points history',activityTable());
if(a==='manage-booking')modal('Your upcoming moments',bookingList(b.dataset.id));
if(a==='package-details')packageModal(s);
if(a==='bookings')modal('Your upcoming moments',bookingList());
if(a==='vouchers'||a==='wallet'){$('#modal').close();location.hash='wallet/'+(['passes','guests','rewards'].includes(b.dataset.section)?b.dataset.section:'passes')}
if(a==='rules')modal('A first look at SYNC.',`<p class="modal-body">This interactive prototype uses sample member data and simulated transactions.<br><br><strong>Confirmed:</strong> free Plus membership, three tiers, NT$1 = 1 point, and the supplied service pricing.<br><br><strong>Proposed:</strong> Core · ${visitLabel(SyncMembership.levels[1].visits)} / Luxe · ${visitLabel(SyncMembership.levels[2].visits)}. <span>Pass validity, reward costs and the 24-hour cancellation window remain provisional.</span><br><br>Point expiry is not applied in this version. There are no real payments, reservations, check-in credentials, or notifications. Demo data is saved on this device.</p>`);
if(a==='wallet-pass-details')walletPassDetails(b.dataset.id);
if(a==='wallet-reward-details')walletRewardDetails(b.dataset.code);
if(a==='wallet-copy')walletCopyCode(b.dataset.code,b);
if(a==='wallet-book-pass')walletStartBooking(b.dataset.id);
if(a==='wallet-clear-pass'){bookingPassId=null;render()}
if(a==='overview-session'){const date=b.dataset.date;if(['yoga','contrast'].includes(s)&&date>=addDays(0)&&date<=addDays(30)){bookingPassId=null;bookingService=s;bookingDate=date;location.hash='book';render()}return}
if(a==='service'){bookingPassId=null;bookingService=s;location.hash='book';if(location.hash==='#book')render()}
if(a==='filter'){bookingPassId=null;bookingService=s;render()}
if(a==='packages'||a==='package-filter')packageModal(s||bookingService);
if(a==='purchase-review')modal('Your next ritual.',`<p class="modal-body"><strong>${sizes[i]} × 60-minute ${s==='yoga'?'Yoga':'Contrast Therapy'} ${sizes[i]===1?'session':'sessions'}</strong></p><div class="modal-row"><span>Total</span><strong>NT$${money(prices[s][i])}</strong></div><div class="modal-row"><span>Points earned</span><strong>+${money(prices[s][i])}</strong></div><div class="modal-row"><span>Use by</span><strong>${fmt(addDays(validity[i]))}</strong></div><p class="modal-note">This is a simulated purchase. No payment is collected.</p><div class="modal-actions"><button class="button light" data-action="packages" data-service="${s}">Back</button><button class="button" data-action="purchase" data-service="${s}" data-index="${i}">Confirm demo purchase</button></div>`);
if(a==='purchase'){
  const createdAt=new Date().toISOString(),orderId='DEMO-'+crypto.randomUUID().slice(0,8).toUpperCase(),packageId=crypto.randomUUID();
  state.points+=prices[s][i];state.spend+=prices[s][i];
  state.packages.push({id:packageId,service:s,remaining:sizes[i],total:sizes[i],expiry:addDays(validity[i]),source:'purchase',orderId,createdAt});
  state.activity.unshift({id:crypto.randomUUID(),kind:'purchase',title:`${s==='yoga'?'Yoga':'Contrast Therapy'} · ${sizes[i]}-session package`,date:addDays(0),createdAt,points:prices[s][i],balanceAfter:state.points,orderId,actor:'Member action'});
  save();window.syncPortal?.purchaseRecorded(s,sizes[i],prices[s][i],{id:orderId,packageId,createdAt,pointsEarned:prices[s][i],status:'Paid'});
  $('#modal').close();render();toast(`Your passes are ready. +${money(prices[s][i])} points earned.`)
}
if(a==='tier-benefits')tierBenefits(b.dataset.tier);
if(a==='tier-view'){$('#modal').close();location.hash='rewards/membership'}
if(a==='book'){let date=$('#booking-date').value;if(!date||date<addDays(0)||date>addDays(30)){toast('Choose a date within the next 30 days.');return}let session=availableSessions(bookingService,date)[i];if(!session||parseInt(session[3])===0){toast('This booking is no longer available. Please choose another session.');return}if(bookingSessionPhase(date,session[0])!=='upcoming'){refreshBookingSessionStates();toast('Choose an upcoming session time.');return}let p=bookingPassId?state.packages.find(p=>p.id===bookingPassId&&p.service===bookingService&&p.remaining>0&&p.expiry>=date):eligible(bookingService).find(p=>p.expiry>=date);if(!p&&bookingPassId){toast('This pass is not valid on that date. Choose another date or pass.');return}if(!p){packageModal(bookingService);toast('You’ll need a pass valid on your session date.');return}if(state.bookings.some(b=>b.date===date&&b.time===session[0])){toast('You already have a booking at this time.');return}if(bookingOverlap(date,session[0])){toast('This session overlaps with another booking.');return}modal('A moment, just for you.',`<p class="modal-body"><strong>${escapeHTML(session[1])}</strong><br>${fmt(date)} · ${session[0]} · 60 minutes<br>SYNC Wellness Club · Xinyi, Taipei</p><div class="modal-row"><span>${p.source==='reward'?'Using your reward credit':'Payment'}</span><strong>1 ${bookingService==='yoga'?'Yoga':'Contrast Therapy'} pass</strong></div>${p.source==='reward'?`<p class="modal-note"><span>From rewards</span> · <span>Attend by</span> ${fmt(p.expiry)}</p>`:''}<p class="modal-note">Cancel at least 24 hours before your session to restore your pass with its original expiry. This is a demo reservation.</p><div class="modal-actions"><button class="button light" data-action="close">Go back</button><button class="button" data-action="confirm-book" data-service="${bookingService}" data-index="${i}" data-date="${date}" data-time="${session[0]}" data-pass="${p.id}">Confirm booking ↗</button></div>`)}
if(a==='confirm-book'){const date=b.dataset.date,session=b.dataset.time?availableSessions(s,date).find(item=>item[0]===b.dataset.time):availableSessions(s,date)?.[i],p=state.packages.find(p=>p.id===b.dataset.pass);if(!session||parseInt(session[3])===0||!p||p.service!==s||p.remaining<1||p.expiry<date||date<addDays(0)||date>addDays(30)||sessionStart(date,session[0])<=Date.now()){toast('This booking is no longer available. Please choose another session.');return}if(bookingOverlap(date,session[0])){toast('This session overlaps with another booking.');return}walletChange={service:s,passId:p.id,from:count(s),to:count(s)-1,remainingBefore:p.remaining,remainingAfter:p.remaining-1,total:p.total};bookingPassId=null;p.remaining--;state.bookings.push({id:crypto.randomUUID(),service:s,title:session[1],time:session[0],date:b.dataset.date,passId:p.id,createdAt:new Date().toISOString()});state.bookings.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));save();$('#modal').close();render();toast('You’re booked. A little time for yourself, reserved.')}
if(a==='cancel'){let booking=state.bookings.find(x=>x.id===b.dataset.id);if(!booking)return;if(new Date(`${booking.date}T${booking.time}:00+08:00`)-Date.now()<86400000){showCancellationNotice(booking);return}modal('Cancel this moment?',`<p class="modal-body">${escapeHTML(booking.title)} · ${fmt(booking.date)} · ${booking.time}<br>Your pass will be returned with its original expiry.</p><div class="modal-actions"><button class="button light" data-action="close">Keep booking</button><button class="button" data-action="confirm-cancel" data-id="${booking.id}">Cancel session</button></div>`)}
if(a==='confirm-cancel'){let booking=state.bookings.find(x=>x.id===b.dataset.id);if(!booking)return;if(sessionStart(booking.date,booking.time)-Date.now()<86400000){showCancellationNotice(booking);return}const p=state.packages.find(p=>p.id===booking.passId);if(p){const before=count(p.service),remainingBefore=p.remaining;p.remaining++;walletChange={service:p.service,passId:p.id,from:before,to:count(p.service),remainingBefore,remainingAfter:p.remaining,total:p.total}}if(!Array.isArray(state.visitHistory))state.visitHistory=[];state.visitHistory.unshift({...booking,status:'cancelled',cancelledAt:new Date().toISOString(),cancelledBy:'Member'});state.bookings=state.bookings.filter(x=>x.id!==booking.id);save();$('#modal').close();render();toast('Booking cancelled. Your pass has been returned.')}
if(a==='reward')reviewReward(b.dataset.id);
if(a==='redeem')redeemReward(b);
if(a==='reset')modal('Start fresh?',`<p class="modal-body">Restore sample points, passes and purchase history. Clear demo bookings, rewards and visits for this account.</p><p class="modal-note">Your profile, sign-in and other accounts stay saved. You can undo this reset before recording new activity.</p><div class="modal-actions"><button class="button light" data-action="close">Keep exploring</button><button class="button" data-action="confirm-reset">Reset demo</button></div>`);
if(a==='confirm-reset'){
  const result=window.syncPortal?.resetDemo?.();
  if(result&&!result.ok){toast(result.error);return}
  if(result)state=result.wallet;else{const name=state.name;state=seed();state.name=name;save()}
  $('#modal').close();render();toast('Your demo account has been reset.');
}
if(a==='undo-reset'){
  const result=window.syncPortal?.undoResetDemo?.();if(!result?.ok){toast(result?.error||'Unable to save changes. Please try again.');render();return}
  state=result.wallet;render();toast('Your demo data has been restored.');
}
});
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close()}});
window.addEventListener('hashchange',()=>{render();window.scrollTo({top:0,behavior:'instant'})});render();

let activeHero=null,heroMotionFrame=0;
function resetHeroMotion(){
  if(heroMotionFrame)cancelAnimationFrame(heroMotionFrame);heroMotionFrame=0;
  if(activeHero){activeHero.classList.remove('is-tracking');for(const name of ['--hero-rx','--hero-ry','--hero-x','--hero-y','--glow-x','--glow-y','--card-light-x','--card-light-y'])activeHero.style.removeProperty(name)}activeHero=null;
}
document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches){resetHeroMotion();return}
  const hero=e.target.closest('.membership-hero');if(!hero){if(activeHero)resetHeroMotion();return}
  if(activeHero!==hero){resetHeroMotion();activeHero=hero;hero.classList.add('is-tracking')}
  const rect=hero.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const x=Math.max(-.5,Math.min(.5,(e.clientX-rect.left)/rect.width-.5)),y=Math.max(-.5,Math.min(.5,(e.clientY-rect.top)/rect.height-.5));
  if(heroMotionFrame)cancelAnimationFrame(heroMotionFrame);
  heroMotionFrame=requestAnimationFrame(()=>{heroMotionFrame=0;if(activeHero!==hero)return;hero.style.setProperty('--hero-rx',`${-y*14}deg`);hero.style.setProperty('--hero-ry',`${x*20}deg`);hero.style.setProperty('--hero-x',`${x*18}px`);hero.style.setProperty('--hero-y',`${y*12}px`);hero.style.setProperty('--glow-x',`${x*30}px`);hero.style.setProperty('--glow-y',`${y*18}px`);hero.style.setProperty('--card-light-x',`${(x+.5)*100}%`);hero.style.setProperty('--card-light-y',`${(y+.5)*100}%`)});
});
document.addEventListener('pointerout',e=>{if(activeHero&&!activeHero.contains(e.relatedTarget))resetHeroMotion()});
window.addEventListener('blur',resetHeroMotion);window.addEventListener('hashchange',resetHeroMotion);

// One delegated listener works across page renders and language switches.
let activeTierCard=null,tierMotionFrame=0;
function resetTierMotion(){
  if(tierMotionFrame)cancelAnimationFrame(tierMotionFrame);
  tierMotionFrame=0;
  if(activeTierCard){activeTierCard.classList.remove('is-hovered');for(const name of ['--tilt-x','--tilt-y','--light-x','--light-y','--art-x','--art-y'])activeTierCard.style.removeProperty(name)}
  activeTierCard=null;
}
document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches){resetTierMotion();return}
  const card=e.target.closest('.tier-card, .reward, .journey-glass');
  if(!card){if(activeTierCard)resetTierMotion();return}
  if(activeTierCard!==card){resetTierMotion();activeTierCard=card;card.classList.add('is-hovered')}
  const rect=card.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const x=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
  const y=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));
  if(tierMotionFrame)cancelAnimationFrame(tierMotionFrame);
  tierMotionFrame=requestAnimationFrame(()=>{
    tierMotionFrame=0;if(activeTierCard!==card)return;
    const tilt=card.classList.contains('journey-glass')?3:11;
    card.style.setProperty('--tilt-x',`${(0.5-y)*tilt}deg`);
    card.style.setProperty('--tilt-y',`${(x-0.5)*tilt}deg`);
    card.style.setProperty('--light-x',`${x*100}%`);
    card.style.setProperty('--light-y',`${y*100}%`);
    card.style.setProperty('--art-x',`${(x-0.5)*18}px`);
    card.style.setProperty('--art-y',`${(y-0.5)*12}px`);
  });
});
document.addEventListener('pointerout',e=>{if(activeTierCard&&!activeTierCard.contains(e.relatedTarget))resetTierMotion()});
window.addEventListener('blur',resetTierMotion);
window.addEventListener('hashchange',resetTierMotion);
