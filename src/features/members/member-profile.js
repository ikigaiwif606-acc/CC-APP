/* Staff member profiles. Legacy records are displayed without inventing missing history. */
window.SyncMemberProfile = (() => {
  I18n.extend({
    'Activity':'活動內容','Member profile':'會員完整資料','Back to people':'返回人員列表','Purchases':'購買紀錄','Points & rewards':'點數與獎勵','Visits':'到訪紀錄',
    'Profile information':'個人資料','Contact details':'聯絡資料','Phone number':'手機號碼','Joined':'加入日期','Unavailable':'無資料',
    'Member not found':'找不到此會員','This member is no longer available.':'此會員資料已不存在。','Current redeemable points':'目前可兌換點數',
    'Available passes':'可用堂票','Tier progress':'會員升等進度','Highest tier reached':'已達最高會員等級','Remaining to next tier':'距離下一會員等級尚差',
    'Recent member activity':'會員近期紀錄','No member activity yet.':'此會員尚無活動紀錄。','Next visit':'下次到訪',
    'No upcoming bookings.':'尚無即將到來的預約。','Passes expiring soon':'即將到期的堂票','No passes expire in the next 14 days.':'未來 14 天內沒有堂票到期。',
    'View all visits':'查看所有到訪紀錄','View all passes':'查看所有堂票','Recorded purchase value':'已記錄購買金額','Recorded orders':'已記錄訂單',
    'Purchase history':'購買紀錄','View order':'查看訂單','Order details':'訂單詳情','Package':'套票','Purchased':'購買時間','Points earned':'獲得點數',
    'Balance after':'異動後餘額','Points ledger':'點數明細','Change':'異動點數','Related record':'相關紀錄','Reward redemptions':'獎勵兌換紀錄',
    'Reward':'獎勵','Redeemed':'兌換時間','Points spent':'使用點數','View reward':'查看獎勵','Reward details':'獎勵詳情',
    'Available':'可使用','Reserved':'已預約','Expired':'已到期','Used up':'已用完','In wallet':'已加入錢包','Past booking':'過往預約',
    'Upcoming':'即將到來','Cancelled by member':'會員取消','Cancelled by staff':'工作人員取消',
    'Source':'來源','Remaining / original':'剩餘／原有堂數','Staff-issued':'人員發放','Reward redemption':'獎勵兌換','Purchase':'購買',
    'No passes recorded.':'尚無堂票紀錄。','No reward redemptions recorded.':'尚無獎勵兌換紀錄。','No points activity recorded.':'尚無點數異動紀錄。',
    'No visits recorded.':'尚無到訪紀錄。','Booking and attendance history':'預約與出席紀錄','Booked on':'預約建立時間','Updated':'更新時間',
    'Reason / staff':'原因／操作人員','Recorded by':'操作人員','Member action':'會員操作','Current balance':'目前餘額',
    'Older records may not include timestamps, links or balances after a change.':'較早的紀錄可能沒有時間、相關連結或異動後餘額。',
    'Recorded purchase value is separate from visit-based tier progress.':'已記錄購買金額與到訪升等進度分別計算。',
    'Points available for rewards; redeeming does not reduce tier progress.':'點數可用於兌換獎勵，兌換不影響會員升等進度。',
    'Booking created':'建立預約','Booking cancelled':'取消預約','Pass issued':'發放堂票','Reward used':'使用獎勵',
    'Pass details':'堂票詳情','View pass':'查看堂票','Original quantity':'原有堂數','Remaining sessions':'剩餘堂數','Issued':'發放時間',
    'Yoga passes':'瑜伽堂票','Contrast Therapy passes':'冷熱交替療法堂票','Used on':'使用時間','Cancellation reason':'取消原因'
  });
  const t = value => I18n.translate(value), e = value => escapeHTML(value ?? '');
  const tabs = [['overview','Overview'],['purchases','Purchases'],['points','Points & rewards'],['passes','Passes'],['visits','Visits']];
  const url = (m, tab='overview') => '#admin-members/'+encodeURIComponent(m.id)+'/'+tab;
  const unknown = () => `<span class="mp-unavailable">${t('Unavailable')}</span>`;
  function when(at, date) {
    if (at && Number.isFinite(Date.parse(at))) return e(new Date(at).toLocaleString(I18n.language==='en'?'en-GB':'zh-TW', {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Taipei'}));
    return date ? e(t(fmt(date))) : unknown();
  }
  const service = value => t(value==='yoga'?'Yoga':'Contrast Therapy');
  const tier = m => SyncMembership.tier(m.wallet);
  const active = p => p.remaining>0 && p.expiry>=addDays(0);
  const badge = label => `<span class="mp-status ${['Used','Checked in','Available','Paid'].includes(label)?'mp-positive':''}">${e(t(label))}</span>`;
  const signed = n => (n>0?'+':'−')+money(Math.abs(n));
  function table(heads, rows, empty) {
    return rows.length ? `<div class="staff-table-scroll" tabindex="0" role="region" aria-label="${e(t(heads[0]))}"><table class="staff-table mp-table"><thead><tr>${heads.map(h=>`<th scope="col">${t(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>` : `<p class="mp-empty">${t(empty)}</p>`;
  }
  const panel = (title, body, action='') => `<section class="staff-panel mp-panel"><div class="staff-panel-heading"><h2>${t(title)}</h2>${action}</div>${body}</section>`;
  const field = (label,value) => `<div class="mp-field"><dt>${t(label)}</dt><dd>${value}</dd></div>`;
  const action = (kind,id,label) => `<button class="mp-record-link" data-portal="profile-${kind}" data-id="${e(id)}">${t(label)} <span aria-hidden="true">↗</span></button>`;
  function visits(db,m) {
    const records = [...(Array.isArray(m.wallet.visitHistory)?m.wallet.visitHistory:[]),...m.wallet.bookings,...db.sampleBookings.filter(b=>b.memberId===m.id)];
    return records.filter((v,i)=>records.findIndex(other=>other.id===v.id)===i).map(v=>({...v,
      visitStatus:v.status==='cancelled'?(v.cancelledBy==='Member'?'Cancelled by member':'Cancelled by staff'):
        db.checkins.includes(v.id)?'Checked in':new Date(v.date+'T'+v.time+':00+08:00')>new Date()?'Upcoming':'Past booking'
    })).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  }
  function rewardStatus(db,m,v) {
    if(v.used||db.usedVouchers.includes(v.code))return 'Used';
    const booked=v.passId&&visits(db,m).find(b=>b.passId===v.passId&&b.status!=='cancelled');
    if(booked?.visitStatus==='Checked in')return 'Used';
    return walletRewardStatus(v,m.wallet);
  }
  function related(db,m,a) {
    if(a.orderId&&db.orders.some(o=>o.id===a.orderId&&o.memberId===m.id))return action('order',a.orderId,'View order');
    if(a.voucherCode&&m.wallet.vouchers.some(v=>v.code===a.voucherCode))return action('reward',a.voucherCode,'View reward');
    return unknown();
  }
  function recent(db,m) {
    const list=[...m.wallet.activity.map(a=>({label:a.title,at:a.createdAt,date:a.date,detail:signed(a.points)})),
      ...db.audit.filter(a=>a.memberId===m.id&&a.action!=='Manual points adjustment').map(a=>({label:a.action,at:a.at,detail:a.reason})),
      ...visits(db,m).filter(v=>v.createdAt||v.cancelledAt).map(v=>({label:v.status==='cancelled'?'Booking cancelled':'Booking created',at:v.cancelledAt||v.createdAt,detail:v.title}))]
      .sort((a,b)=>(b.at||b.date||'').localeCompare(a.at||a.date||'')).slice(0,6);
    return list.length?`<ol class="mp-timeline">${list.map(a=>`<li><div><strong>${e(t(a.label))}</strong><span>${e(t(a.detail))}</span></div><time>${when(a.at,a.date)}</time></li>`).join('')}</ol>`:`<p class="mp-empty">${t('No member activity yet.')}</p>`;
  }
  function overview(db,m) {
    const next=visits(db,m).filter(v=>v.visitStatus==='Upcoming').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))[0];
    const expiring=m.wallet.packages.filter(p=>active(p)&&p.expiry<=addDays(14)).sort((a,b)=>a.expiry.localeCompare(b.expiry));
    return `<div class="mp-overview-grid">${panel('Profile information',`<dl class="mp-fields">${field('Member number',e(number(db,m)))}${field('Full name',e(m.name))}${field('Email address',e(m.email))}${field('Phone number',m.phone?e(m.phone):unknown())}${field('Joined',when(m.createdAt))}${field('Home club',t('Taipei · Xinyi'))}</dl>`)}<div>${panel('Next visit',next?`<div class="mp-next"><span>${service(next.service)}</span><strong>${e(t(next.title))}</strong><p>${when(null,next.date)} · ${e(next.time)}</p>${badge('Upcoming')}</div>`:`<p class="mp-empty">${t('No upcoming bookings.')}</p>`,`<a href="${url(m,'visits')}">${t('View all visits')} ↗</a>`)}${panel('Passes expiring soon',expiring.length?expiring.map(p=>`<div class="mp-expiry"><div><strong>${service(p.service)}</strong><span>${p.remaining} · ${when(null,p.expiry)}</span></div>${action('pass',p.id,'View pass')}</div>`).join(''):`<p class="mp-empty">${t('No passes expire in the next 14 days.')}</p>`,`<a href="${url(m,'passes')}">${t('View all passes')} ↗</a>`)}</div></div>${panel('Recent member activity',recent(db,m))}`;
  }
  function purchases(db,m) {
    const orders=db.orders.filter(o=>o.memberId===m.id).slice().sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date));
    return panel('Purchase history',`<div class="mp-purchase-summary"><div><span>${t('Recorded purchase value')}</span><strong>NT$${money(orders.reduce((n,o)=>n+o.amount,0))}</strong></div><div><span>${t('Recorded orders')}</span><strong>${orders.length}</strong></div></div><p class="mp-caption">${t('Recorded purchase value is separate from visit-based tier progress.')}</p>${table(['Order','Purchased','Amount','Points earned','Status','Action'],orders.map(o=>`<tr><td><strong>${e(o.id)}</strong><small>${e(t(o.title))}</small></td><td>${when(o.createdAt,o.date)}</td><td class="mp-numeric">NT$${money(o.amount)}</td><td class="mp-numeric">${Number.isSafeInteger(o.pointsEarned)?'+'+money(o.pointsEarned):unknown()}</td><td>${badge(o.status||'Paid')}</td><td>${action('order',o.id,'View order')}</td></tr>`),'No orders yet.')}`);
  }
  function points(db,m) {
    const activity=m.wallet.activity.slice().sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date));
    return panel('Points ledger',`<div class="mp-ledger-balance"><span>${t('Current balance')}</span><strong>${money(m.wallet.points)}</strong></div><p class="mp-caption">${t('Older records may not include timestamps, links or balances after a change.')}</p>${table(['Date','Activity','Change','Balance after','Related record'],activity.map(a=>`<tr><td>${when(a.createdAt,a.date)}</td><td><strong>${e(t(a.title))}</strong>${a.reason?`<small>${e(a.reason)}</small>`:''}${a.actor?`<small>${e(t(a.actor))}</small>`:''}</td><td class="mp-numeric ${a.points>0?'mp-credit':'mp-debit'}">${signed(a.points)}</td><td class="mp-numeric">${Number.isSafeInteger(a.balanceAfter)?money(a.balanceAfter):unknown()}</td><td>${related(db,m,a)}</td></tr>`),'No points activity recorded.')}`)+panel('Reward redemptions',table(['Reward','Redeemed','Points spent','Expiry date','Status','Action'],m.wallet.vouchers.map(v=>`<tr><td><strong>${e(t(v.name))}</strong><small>${e(v.code)}</small></td><td>${when(v.redeemedAt)}</td><td class="mp-numeric">${Number.isSafeInteger(v.pointsCost)?money(v.pointsCost):unknown()}</td><td>${when(null,v.expiry)}</td><td>${badge(rewardStatus(db,m,v))}</td><td>${action('reward',v.code,'View reward')}</td></tr>`),'No reward redemptions recorded.'));
  }
  function passSource(p) {return p.source==='purchase'?'Purchase':p.source==='reward'?'Reward redemption':p.source==='staff'?'Staff-issued':'Unavailable'}
  function passes(db,m) {
    return panel('Pass wallet',table(['Package','Remaining / original','Expiry date','Source','Status','Action'],m.wallet.packages.map(p=>`<tr><td><strong>${service(p.service)}</strong><small>${e(p.id)}</small></td><td class="mp-numeric">${p.remaining} / ${p.total}</td><td>${when(null,p.expiry)}</td><td>${t(passSource(p))}</td><td>${badge(walletPassStatus(p,m.wallet))}</td><td>${action('pass',p.id,'View pass')}</td></tr>`),'No passes recorded.'));
  }
  function visitPage(db,m) {
    return panel('Booking and attendance history',table(['Session','Date','Status','Booked on','Updated'],visits(db,m).map(v=>`<tr><td><strong>${e(t(v.title))}</strong><small>${service(v.service)}</small>${v.cancelReason?`<small>${e(t(v.cancelReason))}</small>`:''}</td><td>${when(null,v.date)}<small>${e(v.time)}</small></td><td>${badge(v.visitStatus)}</td><td>${when(v.createdAt)}${v.bookedBy?`<small>${t('Booked by staff')} · ${e(t(v.bookedBy))}</small>`:''}</td><td>${when(v.cancelledAt||v.checkedInAt)}${v.cancelledBy?`<small>${t(v.cancelledBy==='Member'?'Member action':v.cancelledBy)}</small>`:''}</td></tr>`),'No visits recorded.'));
  }
  function number(db,m){return 'SYNC 0000 '+String(2088+db.members.findIndex(item=>item.id===m.id))}
  function render(db,m,tab,manager,canBook=false,management={}) {
    if(!m)return `<a class="mp-back" href="#admin-people" data-staff-nav>← ${t('Back to people')}</a>${panel('Member not found',`<p class="mp-empty">${t('This member is no longer available.')}</p>`)}`;
    if(!tabs.some(([id])=>id===tab))tab='overview';
    const progress=SyncMembership.progress(m.wallet),level=progress.current.name,next=progress.next?.name,threshold=progress.next?.visits||progress.current.visits;
    const yoga=m.wallet.packages.filter(p=>active(p)&&p.service==='yoga').reduce((n,p)=>n+p.remaining,0);
    const contrast=m.wallet.packages.filter(p=>active(p)&&p.service==='contrast').reduce((n,p)=>n+p.remaining,0);
    const photo=typeof m.photo==='string'&&m.photo.length<150000&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(m.photo)?m.photo:null;
    const initials=m.name.trim().split(/\s+/).map(s=>s[0]).slice(0,2).join('').toUpperCase();
    return `<article class="member-profile"><a class="mp-back" href="#admin-people" data-staff-nav>← ${t('Back to people')}</a><section class="mp-identity"><div class="mp-person"><div class="mp-avatar" aria-hidden="true">${photo?`<img src="${photo}" alt="">`:e(initials)}</div><div><span class="mp-number">${e(number(db,m))}</span><div class="mp-name"><h2 id="member-profile-title" tabindex="-1">${e(m.name)}</h2><span class="staff-tier ${level.toLowerCase()}">${level}</span></div><p>${e(m.email)}</p>${management.status?`<span class="people-access-status ${management.status==='inactive'?'inactive':''}">${t(management.status==='inactive'?'Inactive':'Active')}</span>`:''}</div></div>${manager||canBook?`<div class="mp-actions">${manager?management.controls||'':''}${canBook?`<button class="button" data-staff-tool="book-member" data-member="${e(m.id)}">${t('Book for member')}</button>`:''}${manager?`<button class="button" data-portal="adjust">${t('Adjust points')}</button><button class="button light" data-portal="issue">${t('Issue passes')}</button>`:''}</div>`:''}</section><div class="mp-summary"><section class="mp-summary-points"><span>${t('Current redeemable points')}</span><strong>${money(m.wallet.points)}</strong><p>${t('Points available for rewards; redeeming does not reduce tier progress.')}</p></section><section><span>${t('Available passes')}</span><strong>${yoga+contrast}</strong><div class="mp-pass-split"><span>${t('Yoga')} <b>${yoga}</b></span><span>${t('Contrast Therapy')} <b>${contrast}</b></span></div></section><section><span>${t('Completed visits')}</span><strong>${money(progress.visits)}</strong><div class="mp-progress" role="progressbar" aria-label="${t('Tier progress')}" aria-valuemin="0" aria-valuemax="${threshold}" aria-valuenow="${Math.min(progress.visits,threshold)}"><span style="width:${Math.min(100,progress.visits/threshold*100)}%"></span></div><p>${level==='Luxe'?t('Highest tier reached'):`${t('Remaining to next tier')}: ${next} · ${money(progress.remaining)} ${t('visits')}`}</p></section></div><nav class="mp-tabs" aria-label="${t('Member profile')}">${tabs.map(([id,label])=>`<a href="${url(m,id)}" ${id===tab?'aria-current="page"':''}>${t(label)}</a>`).join('')}</nav><div id="member-profile-content">${({overview,purchases,points,passes,visits:visitPage})[tab](db,m)}</div>${manager?management.history||'':''}</article>`;
  }
  function recordDialog(db,m,kind,id) {
    if(!m)return null;
    if(kind==='order') {
      const o=db.orders.find(o=>o.memberId===m.id&&o.id===id);if(!o)return null;
      return {title:'Order details',body:`<dl class="mp-fields">${field('Order',e(o.id))}${field('Member',e(m.name))}${field('Package',e(t(o.title)))}${field('Purchased',when(o.createdAt,o.date))}${field('Amount','NT$'+money(o.amount))}${field('Points earned',Number.isSafeInteger(o.pointsEarned)?'+'+money(o.pointsEarned):unknown())}${field('Status',badge(o.status||'Paid'))}${field('Related record',o.packageId&&m.wallet.packages.some(p=>p.id===o.packageId)?action('pass',o.packageId,'View pass'):unknown())}</dl>`};
    }
    if(kind==='reward') {
      const v=m.wallet.vouchers.find(v=>v.code===id);if(!v)return null;
      return {title:'Reward details',body:`<dl class="mp-fields">${field('Reward',e(t(v.name)))}${field('Voucher code',e(v.code))}${field('Redeemed',when(v.redeemedAt))}${field('Points spent',Number.isSafeInteger(v.pointsCost)?money(v.pointsCost):unknown())}${field('Expiry date',when(null,v.expiry))}${field('Status',badge(rewardStatus(db,m,v)))}${field('Used on',when(v.usedAt))}${field('Related record',v.passId&&m.wallet.packages.some(p=>p.id===v.passId)?action('pass',v.passId,'View pass'):unknown())}</dl>`};
    }
    if(kind==='pass') {
      const p=m.wallet.packages.find(p=>p.id===id);if(!p)return null;
      return {title:'Pass details',body:`<dl class="mp-fields">${field('Service',service(p.service))}${field('Original quantity',p.total)}${field('Remaining sessions',p.remaining)}${field('Expiry date',when(null,p.expiry))}${field('Source',t(passSource(p)))}${field('Issued',when(p.createdAt))}${field('Recorded by',p.issuedBy?e(t(p.issuedBy)):unknown())}${field('Reason',p.reason?e(p.reason):unknown())}${field('Related record',p.orderId&&db.orders.some(o=>o.id===p.orderId&&o.memberId===m.id)?action('order',p.orderId,'View order'):p.voucherCode? action('reward',p.voucherCode,'View reward'):unknown())}</dl>`};
    }
    return null;
  }
  return {render,recordDialog};
})();
