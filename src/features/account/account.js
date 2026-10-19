/* Member account views use owned records supplied by the portal. */
window.SyncAccount = (() => {
  I18n.extend({
  "Your profile, purchases and activity.": "個人資料、購買紀錄與帳戶動態。",
  "Member profile": "會員資料",
  "Personal details": "個人資料",
  "Keep your details up to date.": "隨時更新你的聯絡資料。",
  "Edit profile": "編輯資料",
  "Profile": "個人資料",
  "Purchases": "購買紀錄",
  "Visits": "到訪紀錄",
  "Account sections": "帳戶分頁",
  "Phone number": "手機號碼",
  "Birthday": "生日",
  "Member since": "加入日期",
  "Not added": "尚未填寫",
  "Active passes": "有效堂票",
  "View points activity": "查看點數紀錄",
  "Next expiry": "最近到期日",
  "visits to": "次到訪可升至",
  "Highest tier reached": "已達最高會員等級",
  "Your next visit, ready.": "為下一次到訪做好準備。",
  "Find your active passes, expiry dates and redeemed rewards in Wallet.": "前往錢包，查看有效堂票、到期日與已兌換獎勵。",
  "View Wallet": "查看錢包",
  "Explore your member benefits": "探索會員專屬禮遇",
  "Check-in code": "報到碼",
  "Show check-in code": "出示報到碼",
  "Your check-in code": "你的報到碼",
  "Member check-in code": "會員報到碼",
  "SYNC · MEMBER CHECK-IN": "SYNC · 會員報到",
  "Show this code or your member number at reception.": "請於櫃台出示此報到碼或會員編號。",
  "Today’s sessions": "今日課程",
  "No sessions booked for today.": "今天尚無課程預約。",
  "Show your code when you arrive.": "到館時，請出示報到碼。",
  "Reception confirms attendance. Showing this code does not record a visit.": "出席由櫃台確認，僅出示報到碼不會增加到訪次數。",
  "Demo check-in codes do not sync bookings between devices.": "示範報到碼無法在不同裝置間同步預約資料。",
  "Purchase history": "購買紀錄",
  "Order details and the passes they belong to.": "查看訂單詳情與對應堂票。",
  "orders": "筆訂單",
  "Search purchases": "搜尋訂單或套票",
  "Purchase date range": "購買日期範圍",
  "All time": "全部日期",
  "Last 30 days": "最近 30 天",
  "Last 90 days": "最近 90 天",
  "View order": "查看訂單",
  "No purchases found.": "找不到購買紀錄。",
  "Try another search or date range.": "請嘗試其他關鍵字或日期範圍。",
  "Your package purchases will appear here.": "購買套票後，紀錄會顯示於此。",
  "Load more": "載入更多",
  "See what you earned, redeemed and adjusted.": "查看點數累積、兌換及調整紀錄。",
  "Points filters": "點數篩選",
  "Visit filters": "到訪紀錄篩選",
  "All": "全部",
  "Earned": "已獲得",
  "Adjustments": "調整",
  "Balance after": "變動後餘額",
  "No points activity found.": "尚無符合的點數紀錄。",
  "Activity matching this filter will appear here.": "符合篩選條件的紀錄會顯示於此。",
  "Older records may not include a balance or related order.": "較早的紀錄可能未記錄變動後餘額或對應訂單。",
  "Visits & attendance": "預約與出席",
  "Confirmed check-ins count toward your membership.": "已確認的報到會計入會員升等進度。",
  "Completed": "已完成",
  "Upcoming": "即將到來",
  "Past booking": "過往預約",
  "No visits found.": "尚無符合的到訪紀錄。",
  "Your bookings and confirmed attendance will appear here.": "你的預約與已確認出席紀錄會顯示於此。",
  "Preferences": "偏好設定",
  "Preferences are saved for this demo. Email and SMS delivery are not connected.": "偏好會儲存於此示範版本，目前尚未連接電子郵件或簡訊服務。",
  "Booking reminders": "課程提醒",
  "A reminder before your upcoming session.": "課程開始前提醒你。",
  "Pass expiry reminders": "堂票到期提醒",
  "A heads-up before an active pass expires.": "有效堂票即將到期時提醒你。",
  "News & offers": "最新消息與優惠",
  "Optional updates about SYNC and member offers.": "自由選擇接收 SYNC 最新消息與會員優惠。",
  "Language": "語言",
  "Save preferences": "儲存偏好",
  "Preferences saved.": "偏好已儲存。",
  "Sign-in & security": "登入與安全",
  "Change email": "變更電子郵件",
  "Email change pending": "電子郵件變更待確認",
  "Review demo verification": "查看模擬驗證",
  "Update the password for this account.": "更新此帳戶的登入密碼。",
  "Change password": "變更密碼",
  "Demo account changes are saved on this device only.": "示範帳戶的變更僅儲存於此裝置。",
  "Help & support": "協助與支援",
  "For questions about your account, show your member number and the related record to reception.": "如有帳戶問題，請向櫃台出示會員編號與相關紀錄。",
  "Get help with a record": "查詢紀錄問題",
  "Demo tools": "示範工具",
  "Restore sample balances, passes and bookings. Your profile and preferences stay saved.": "還原示範餘額、堂票與預約，個人資料與偏好將保留。",
  "Change photo": "變更照片",
  "Remove photo": "移除照片",
  "JPG, PNG or WebP, up to 5 MB.": "支援 JPG、PNG 或 WebP，大小上限 5 MB。",
  "Birthday (optional)": "生日（選填）",
  "Used for birthday benefits. Optional.": "用於生日禮遇，可自由選擇填寫。",
  "Change your email in Sign-in & security.": "如需變更電子郵件，請前往「登入與安全」。",
  "Save changes": "儲存變更",
  "Profile updated.": "個人資料已更新。",
  "Order details": "訂單詳情",
  "Purchased": "購買時間",
  "Receipt": "收據",
  "This is a demo order record, not a payment receipt.": "此為示範訂單紀錄，並非付款收據。",
  "View purchased pass": "查看已購堂票",
  "A linked pass was not recorded for this order.": "此訂單未記錄對應的堂票。",
  "Download order summary": "下載訂單摘要",
  "Get help with this order": "查詢此訂單問題",
  "Order summary downloaded.": "訂單摘要已下載。",
  "View related order": "查看對應訂單",
  "View related reward": "查看對應獎勵",
  "No related record was saved for this activity.": "此動態未儲存對應紀錄。",
  "Use a demo password. Changes are saved on this device only.": "請使用示範密碼，變更僅儲存於此裝置。",
  "Current password": "目前密碼",
  "New password": "新密碼",
  "Confirm new password": "再次輸入新密碼",
  "Update password": "更新密碼",
  "The new passwords do not match.": "兩次輸入的新密碼不一致。",
  "Password updated for this demo.": "示範帳戶密碼已更新。",
  "Your current email stays active until verification is complete.": "驗證完成前，仍可使用目前的電子郵件登入。",
  "Demo verification only. No email will be sent.": "僅供模擬驗證，不會寄送電子郵件。",
  "New email address": "新電子郵件地址",
  "Continue": "繼續",
  "Verify email change": "驗證電子郵件變更",
  "No email was sent. The button below simulates verification for this local demo.": "尚未寄送電子郵件，下方按鈕僅模擬此裝置上的驗證流程。",
  "Cancel email change": "取消電子郵件變更",
  "Email address updated for this demo.": "示範帳戶電子郵件已更新。",
  "Email change cancelled.": "已取消電子郵件變更。",
  "Help with your account": "帳戶協助",
  "Show these details to reception so the team can find the right record.": "向櫃台出示以下資料，以便查詢相關紀錄。",
  "What do you need help with?": "你需要哪方面的協助？",
  "Purchase or pass": "購買或堂票",
  "Points balance": "點數餘額",
  "Visit or check-in": "到訪或報到",
  "Profile or sign-in": "個人資料或登入",
  "Details (optional)": "問題說明（選填）",
  "Copy details for reception": "複製資料給櫃台",
  "Nothing is sent. Share the copied details with reception.": "系統不會傳送資料，請自行將複製的內容提供給櫃台。",
  "Details copied. Share them with reception.": "資料已複製，請提供給櫃台。",
  "Copy was blocked. Show this screen to reception instead.": "無法複製，請直接向櫃台出示此畫面。",
  "Choose a JPG, PNG or WebP image smaller than 5 MB.": "請選擇小於 5 MB 的 JPG、PNG 或 WebP 圖片。",
  "This photo could not be opened. Choose another image.": "無法開啟此照片，請選擇其他圖片。",
  "Changes could not be saved. Please try again.": "無法儲存變更，請再試一次。",
  "Member access required.": "需要會員權限。",
  "Enter a name between 1 and 60 characters.": "請輸入 1 至 60 個字元的姓名。",
  "Enter a valid phone number.": "請輸入有效的手機號碼。",
  "Choose a valid birthday in the past.": "請選擇有效且不晚於今天的生日。",
  "This photo could not be saved.": "無法儲存此照片。",
  "Use a password with 8 to 100 characters.": "請使用 8 至 100 個字元的密碼。",
  "The current password is incorrect.": "目前密碼不正確。",
  "Choose a different new password.": "請選擇與目前不同的新密碼。",
  "Your account changed. Please try again.": "帳戶狀態已變更，請再試一次。",
  "Enter a valid email address.": "請輸入有效的電子郵件地址。",
  "This email is already in use.": "此電子郵件已被使用。",
  "This verification preview expired. Start the email change again.": "此模擬驗證已逾時，請重新開始變更電子郵件。"
});
  const e=escapeHTML,t=I18n.translate;
  const paths={edit:'<path d="m16 3 5 5-12 12-6 1 1-6L16 3ZM13 6l5 5"/>',scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',bag:'<path d="M5 7h14l2 14H3L5 7ZM8 8V6a4 4 0 0 1 8 0v2"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',check:'<path d="m5 12 4 4L19 6"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 8a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 4h.01"/>'};
  const glyph=n=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n]||paths.arrow}</svg>`;
  const date=d=>d&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))?fmt(d):'Unavailable';
  const when=at=>at&&Number.isFinite(Date.parse(at))?new Date(at).toLocaleString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Taipei'}):'Unavailable';
  const serviceName=s=>['yoga','contrast'].includes(s)?walletService(s):'Unavailable';
  const field=(label,value)=>`<div><dt>${label}</dt><dd>${value}</dd></div>`;
  const safePhoto=p=>typeof p==='string'&&p.length<150000&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p)?p:null;
  function create(api){
    let pointFilter='all',orderSearch='',orderPeriod='all',visitFilter='all',limit=10,draftPhoto=null,photoGeneration=0;
    const m=()=>api.member();
    const wallet=()=>m().wallet;
    const button=(action,label,id='',className='account-link')=>`<button class="${className}" data-account="${action}" ${id!==''?`data-id="${e(id)}"`:''}>${label} ${glyph('arrow')}</button>`;
    const avatar=(member,photo=member.photo)=>safePhoto(photo)?`<img src="${safePhoto(photo)}" alt="" width="72" height="72">`:`<span>${e(member.name.trim().split(/\s+/).map(v=>v[0]).slice(0,2).join('').toUpperCase())}</span>`;
    const status=s=>`<span class="account-status ${s==='Checked in'||s==='Paid'?'confirmed':s==='Cancelled'?'cancelled':s==='Upcoming'?'upcoming':''}">${s}</span>`;
    const empty=(title,copy,link='')=>`<div class="account-empty">${glyph('bag')}<h3>${title}</h3><p>${copy}</p>${link}</div>`;
    function visits(){
      const member=m(),records=new Map();
      for(const b of [...api.bookings(),...(member.wallet.visitHistory||[])])if(!records.has(b.id))records.set(b.id,{...b,checkedInAt:b.checkedInAt||null,confirmed:!!b.checkedInAt||api.checked(b.id)});
      for(const a of member.wallet.attendance||[]){const id=a.bookingId||a.id;if(!id)continue;const b=records.get(id);records.set(id,b?{...b,confirmed:true,checkedInAt:b.checkedInAt||a.checkedInAt}:{...a,id,confirmed:true})}
      return [...records.values()].map(b=>({...b,displayStatus:b.status==='cancelled'?'Cancelled':b.confirmed?'Checked in':b.date>=addDays(0)&&(!b.time||sessionStart(b.date,b.time)>Date.now())?'Upcoming':'Past booking'})).sort((a,b)=>((b.date||'')+(b.time||'')).localeCompare((a.date||'')+(a.time||'')));
    }
    function checkinList(){const list=visits().filter(b=>b.date===addDays(0)&&b.status!=='cancelled');return list.length?`<div class="account-today-list">${list.map(b=>`<div><span><strong>${e(b.title)}</strong><small>${b.time||'Unavailable'} · <span>${serviceName(b.service)}</span></small></span>${status(b.confirmed?'Checked in':'Awaiting check-in')}</div>`).join('')}</div>`:'<p class="account-note">No sessions booked for today.</p>'}
    function membershipCard(member){
      const progress=SyncMembership.progress(member.wallet),level=progress.current,name=level.name,key=name.toLowerCase(),target=progress.next?.visits||level.visits||1,percent=Math.min(100,progress.visits/target*100);
      const marks={plus:'<circle cx="24" cy="24" r="9"/><path d="M24 3v6m0 30v6M3 24h6m30 0h6M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4"/>',core:'<path d="m24 3 21 21-21 21L3 24Z"/><path d="m24 13 11 11-11 11-11-11Z"/>',luxe:'<path d="m24 3 6 15 15 6-15 6-6 15-6-15-15-6 15-6Z"/><path d="m36 4 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/>'};
      return `<section class="account-identity account-membership-card membership-${key}" aria-labelledby="account-membership-title"><div class="account-membership-aura" aria-hidden="true"></div><div class="account-person"><div class="account-avatar">${avatar(member)}</div><div class="account-person-copy"><h2>${e(member.name)}</h2><span class="account-member-label">SYNC membership</span></div></div><div class="account-membership-body"><div class="account-membership-copy"><p class="account-membership-kicker">Your membership</p><h3 id="account-membership-title">${name}</h3><p class="account-membership-caption">${level.caption}</p><a class="account-membership-benefits" href="#rewards/membership"><span>View member benefits</span>${glyph('arrow')}</a></div><div class="account-membership-crest" aria-hidden="true"><span class="account-membership-orbit"></span><span class="account-membership-orbit orbit-inner"></span><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${marks[key]}</svg></div></div><div class="account-membership-progress"><div><span>${progress.next?`<b>${progress.remaining}</b> <span>visits to</span> ${progress.next.name}`:'Highest tier reached'}</span><span><b>${money(progress.visits)}</b> <span>completed visits</span></span></div><div class="account-membership-track" role="progressbar" aria-label="Membership progress" aria-valuemin="0" aria-valuemax="${target}" aria-valuenow="${Math.min(progress.visits,target)}"><span style="width:${percent}%"></span></div></div><div class="account-identity-actions">${button('edit-profile','Edit profile','','button light')}${button('checkin',`${glyph('scan')}<span>Check-in code</span>`,'','button account-checkin-button')}</div></section>`;
    }
    function summary(){const w=wallet(),progress=SyncMembership.progress(w),next=eligible('yoga').concat(eligible('contrast')).sort((a,b)=>a.expiry.localeCompare(b.expiry))[0];return `<div class="account-summary"><a href="#account/points"><span>${icon('gift')}Available points</span><strong class="${String(money(w.points)).length>7?'account-large-balance':''}">${money(w.points)}</strong><small>View points activity ${glyph('arrow')}</small></a><a href="#wallet/passes"><span>${glyph('bag')}Active passes</span><strong>${money(count('yoga')+count('contrast'))}</strong><small class="account-pass-breakdown"><span>Yoga</span> ${count('yoga')} · <span>Contrast Therapy</span> ${count('contrast')}</small>${next?`<small class="account-summary-expiry"><span>Next expiry</span> ${date(next.expiry)}</small>`:''}<small class="account-mobile-wallet-link">View Wallet</small></a><a href="#account/visits"><span>${glyph('check')}Completed visits</span><strong>${money(progress.visits)}</strong><small>${progress.next?`<span>${progress.remaining}</span> <span>visits to</span> ${progress.next.name}`:'Highest tier reached'} ${glyph('arrow')}</small></a></div>`}
    function profile(){const member=m();return `<div class="account-profile-grid"><section class="account-panel"><div class="account-panel-heading"><div><h2>Personal details</h2><p>Keep your details up to date.</p></div>${button('edit-profile','Edit profile')}</div><dl class="account-fields">${field('Full name',e(member.name))}${field('Email address',e(member.email))}${field('Phone number',member.phone?e(member.phone):'Not added')}${field('Birthday',member.birthday?date(member.birthday):'Not added')}${field('Member since',member.createdAt?date(member.createdAt.slice(0,10)):'Unavailable')}${field('Home club','Taipei · Xinyi')}</dl></section><aside class="account-side"><section class="account-wallet-preview"><span class="account-section-icon">${glyph('bag')}</span><h2>Your next visit, ready.</h2><p>Find your active passes, expiry dates and redeemed rewards in Wallet.</p><a class="button" href="#wallet/passes">View Wallet ${glyph('arrow')}</a></section><a class="account-benefits-link" href="#rewards/membership"><span>${icon('sun')}<span>Explore your member benefits</span></span>${glyph('arrow')}</a></aside></div>`}
    function orderList(){const threshold=orderPeriod==='all'?null:addDays(-Number(orderPeriod));const orders=api.orders().sort((a,b)=>String(b.createdAt||b.date||'').localeCompare(String(a.createdAt||a.date||''))).filter(o=>(!threshold||o.date>=threshold)&&(!orderSearch||(o.id+' '+o.title).toLowerCase().includes(orderSearch.toLowerCase())));return orders.length?`<div class="account-records">${orders.slice(0,limit).map(o=>`<article class="account-order"><span class="account-record-icon">${glyph('bag')}</span><div class="account-record-main"><h3>${e(o.title)}</h3><p>${date(o.date)} · <span>${e(o.id)}</span></p>${status(o.status||'Paid')}</div><div class="account-record-end"><strong>NT$${money(o.amount)}</strong>${button('order','View order',o.id)}</div></article>`).join('')}</div>${orders.length>limit?button('more','Load more','','account-load-more'):''}`:empty('No purchases found.',orderSearch||threshold?'Try another search or date range.':'Your package purchases will appear here.',`<a class="account-link" href="#wallet/passes">View Wallet ↗</a>`)}
    function purchases(){return `<section class="account-panel"><div class="account-panel-heading"><div><h2>Purchase history</h2><p>Order details and the passes they belong to.</p></div><span class="account-small-count"><span>${api.orders().length}</span> <span>orders</span></span></div><div class="account-record-tools"><label class="account-search"><span class="sr-only">Search purchases</span><input id="account-order-search" type="search" placeholder="${e(t('Search purchases'))}" aria-label="Search purchases" value="${e(orderSearch)}"></label><label class="account-period"><span class="sr-only">Purchase date range</span><select id="account-order-period" aria-label="Purchase date range">${[['all','All time'],['30','Last 30 days'],['90','Last 90 days']].map(([value,label])=>`<option value="${value}" ${orderPeriod===value?'selected':''}>${label}</option>`).join('')}</select></label></div><div id="account-order-results" aria-live="polite">${orderList()}</div></section>`}
    const pointKind=a=>a.kind==='adjustment'||a.title==='Manual points adjustment'?'adjustments':a.points<0?'redeemed':'earned';
    function pointRows(){const rows=wallet().activity.map((a,index)=>({...a,index})).filter(a=>pointFilter==='all'||pointKind(a)===pointFilter).sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date));return rows.length?`<div class="account-point-list">${rows.slice(0,limit).map(a=>`<button class="account-point-row" data-account="point" data-id="${a.index}"><span class="account-record-icon ${a.points>=0?'credit':'debit'}">${a.points>=0?'+':'−'}</span><span class="account-record-main"><strong>${e(a.title)}</strong><small>${date(a.date)}</small></span><span class="account-point-amount ${a.points>=0?'credit':'debit'}"><strong>${a.points>=0?'+':'−'}${money(Math.abs(a.points))}</strong><small><span>Balance after</span> ${Number.isSafeInteger(a.balanceAfter)?money(a.balanceAfter):'<span>Unavailable</span>'}</small></span>${glyph('arrow')}</button>`).join('')}</div>${rows.length>limit?button('more','Load more','','account-load-more'):''}`:empty('No points activity found.','Activity matching this filter will appear here.')}
    function points(){return `<section class="account-panel"><div class="account-panel-heading"><div><h2>Points activity</h2><p>See what you earned, redeemed and adjusted.</p></div><a class="account-link" href="#rewards/redeem">Redeem points ${glyph('arrow')}</a></div><div class="account-filter" aria-label="Points filters">${[['all','All'],['earned','Earned'],['redeemed','Redeemed'],['adjustments','Adjustments']].map(([key,label])=>`<button data-account="point-filter" data-id="${key}" aria-pressed="${pointFilter===key}">${label}</button>`).join('')}</div><div id="account-point-results" aria-live="polite">${pointRows()}</div><p class="account-note account-record-note">Older records may not include a balance or related order.</p></section>`}
    function visitRows(){const records=visits().filter(b=>visitFilter==='all'||b.displayStatus===({completed:'Checked in',upcoming:'Upcoming',cancelled:'Cancelled'})[visitFilter]);return records.length?`<div class="account-records">${records.slice(0,limit).map(b=>`<article class="account-visit"><div class="account-visit-date"><strong>${b.date?new Date(b.date+'T12:00:00').getDate():'—'}</strong><span>${b.date?new Date(b.date+'T12:00:00').toLocaleString('en-GB',{month:'short',year:'numeric'}):'Unavailable'}</span></div><div class="account-record-main"><h3>${e(b.title||serviceName(b.service))}</h3><p><span>${serviceName(b.service)}</span>${b.time?' · '+e(b.time):''}</p>${b.checkedInAt?`<small><span>Checked in</span> · ${when(b.checkedInAt)}</small>`:''}${b.cancelReason?`<small>${e(b.cancelReason)}</small>`:''}</div><div class="account-record-end">${status(b.displayStatus)}${b.displayStatus==='Upcoming'?`<button class="account-link" data-action="manage-booking" data-id="${e(b.id)}">Manage booking ${glyph('arrow')}</button>`:b.passId&&wallet().packages.some(p=>p.id===b.passId)?`<button class="account-link" data-action="wallet-pass-details" data-id="${e(b.passId)}">Pass details ${glyph('arrow')}</button>`:''}</div></article>`).join('')}</div>${records.length>limit?button('more','Load more','','account-load-more'):''}`:empty('No visits found.','Your bookings and confirmed attendance will appear here.',`<a class="account-link" href="#book">Book a session ↗</a>`)}
    function visitPage(){return `<section class="account-panel"><div class="account-panel-heading"><div><h2>Visits & attendance</h2><p>Confirmed check-ins count toward your membership.</p></div>${button('checkin','Show check-in code')}</div><div class="account-filter" aria-label="Visit filters">${[['all','All'],['completed','Completed'],['upcoming','Upcoming'],['cancelled','Cancelled']].map(([key,label])=>`<button data-account="visit-filter" data-id="${key}" aria-pressed="${visitFilter===key}">${label}</button>`).join('')}</div><div id="account-visit-results" aria-live="polite">${visitRows()}</div></section>`}
    function preferences(){const p=m().preferences||{};return `<form id="account-preferences-form"><p class="account-note">Preferences are saved for this demo. Email and SMS delivery are not connected.</p>${[['bookingReminders','Booking reminders','A reminder before your upcoming session.'],['passExpiryReminders','Pass expiry reminders','A heads-up before an active pass expires.'],['marketing','News & offers','Optional updates about SYNC and member offers.']].map(([name,label,copy])=>`<label class="account-preference-row"><span><strong>${label}</strong><small>${copy}</small></span><input name="${name}" type="checkbox" role="switch" ${p[name]?'checked':''}></label>`).join('')}<label class="account-language"><span>Language</span><select name="language"><option value="en" ${I18n.language==='en'?'selected':''}>English</option><option value="zh-TW" ${I18n.language==='zh-TW'?'selected':''}>繁體中文</option></select></label><div class="account-settings-save"><p id="account-preferences-status" role="status"></p><button class="button" type="submit">Save preferences</button></div></form>`}
    function settings(){return `<div class="account-settings"><details class="account-settings-group"><summary><span>${glyph('settings')}<span>Preferences</span></span><span class="account-chevron" aria-hidden="true">⌄</span></summary><div class="account-settings-body">${preferences()}</div></details><details class="account-settings-group"><summary><span>${glyph('user')}<span>Sign-in & security</span></span><span class="account-chevron" aria-hidden="true">⌄</span></summary><div class="account-settings-body"><div class="account-setting-row"><span><strong>Email address</strong><small>${e(m().email)}</small></span>${button('email','Change email')}</div>${m().pendingEmailChange?`<div class="account-email-pending"><p><span>Email change pending</span> · ${e(m().pendingEmailChange.email)}</p>${button('verify-email','Review demo verification')}</div>`:''}<div class="account-setting-row"><span><strong>Password</strong><small>Update the password for this account.</small></span>${button('password','Change password')}</div><p class="account-note">Demo account changes are saved on this device only.</p></div></details><details class="account-settings-group"><summary><span>${glyph('help')}<span>Visit & contact SYNC</span></span><span class="account-chevron" aria-hidden="true">⌄</span></summary><div class="account-settings-body sync-contact-body">${SyncClub.contact()}<div class="account-help-links">${button('help','Get help with a record')}<a class="account-link" href="#rewards/membership">Membership benefits ${glyph('arrow')}</a></div></div></details><div class="account-session-actions"><button data-portal="account-switch">Use a different account ${glyph('arrow')}</button><button data-portal="logout">Sign out ${glyph('arrow')}</button></div><details class="account-demo-tools"><summary>Demo tools</summary><p class="account-note">Restore sample points, passes and purchase history. Clear demo bookings, rewards and visits for this account.</p><button class="account-link" data-action="reset">Reset demo data ↺</button>${window.syncPortal?.canUndoReset?.()?'<button class="account-link" data-action="undo-reset">Undo demo reset <span aria-hidden="true">↶</span></button>':''}</details></div>`}
    function page(section='profile'){
      const tab=['profile','purchases','points','visits'].includes(section)?section:'profile',member=m();if(!member)return '';
      const today=visits().filter(b=>b.date===addDays(0)&&b.status!=='cancelled');
      return `<div class="account-view">${intro('Your personal space','Account','Your profile, purchases and activity.')}${membershipCard(member)}${today.length?`<section class="account-today"><div><span class="account-today-icon">${glyph('scan')}</span><div><h2>Today at SYNC</h2><p>Show your code when you arrive.</p></div></div>${checkinList()}</section>`:''}${summary()}<nav class="member-section-nav account-tabs" aria-label="Account sections">${[['profile','Profile'],['purchases','Purchases'],['points','Points activity'],['visits','Visits']].map(([key,label])=>`<a href="#account/${key}" ${tab===key?'aria-current="page"':''}>${label}</a>`).join('')}</nav><div id="account-tab-content">${({profile,purchases,points,visits:visitPage})[tab]()}</div>${settings()}</div>`;
    }
    function editProfile(){photoGeneration++;draftPhoto=m().photo||null;modal('Edit profile',`<form id="account-profile-form"><div class="account-photo-editor"><div class="account-avatar" id="account-photo-preview">${avatar(m(),draftPhoto)}</div><div><label class="account-link account-photo-label">Change photo<input id="account-photo-file" type="file" accept="image/jpeg,image/png,image/webp"></label><button class="account-link" type="button" data-account="remove-photo">Remove photo</button><small>JPG, PNG or WebP, up to 5 MB.</small></div></div><p id="account-photo-error" class="form-error" role="alert"></p><label class="account-field"><span>Full name</span><input name="name" autocomplete="name" required maxlength="60" value="${e(m().name)}"></label><label class="account-field"><span>Phone number (optional)</span><input name="phone" type="tel" autocomplete="tel" maxlength="30" value="${e(m().phone||'')}"></label><label class="account-field"><span>Birthday (optional)</span><input name="birthday" type="date" min="1900-01-01" max="${addDays(0)}" value="${e(m().birthday||'')}"><small>Used for birthday benefits. Optional.</small></label><p class="account-note">Change your email in Sign-in & security.</p><p id="account-profile-error" class="form-error" role="alert"></p><div class="account-form-actions"><button type="button" class="button light" data-action="close">Cancel</button><button class="button" type="submit">Save changes</button></div></form>`,{wallet:true})}
    function orderDetails(id){const o=api.orders().find(o=>o.id===id);if(!o)return;const pass=wallet().packages.find(p=>p.id===o.packageId)||wallet().packages.find(p=>p.orderId===o.id);modal('Order details',`<div class="account-detail-title"><span class="account-section-icon">${glyph('bag')}</span><h3>${e(o.title)}</h3>${status(o.status||'Paid')}</div><dl class="account-fields">${field('Order',e(o.id))}${field('Purchased',o.createdAt?when(o.createdAt):date(o.date))}${field('Amount','NT$'+money(o.amount))}${field('Points earned',Number.isSafeInteger(o.pointsEarned)?'+'+money(o.pointsEarned):'Unavailable')}${field('Receipt',o.receiptNumber?e(o.receiptNumber):'Unavailable')}</dl><p class="account-note">This is a demo order record, not a payment receipt.</p><div class="account-detail-actions">${pass?`<button class="button" data-action="wallet-pass-details" data-id="${e(pass.id)}">View purchased pass ${glyph('arrow')}</button>`:'<p class="account-note">A linked pass was not recorded for this order.</p>'}${button('download-order','Download order summary',id)}${button('help-order','Get help with this order',id)}</div>`,{wallet:true})}
    function pointDetails(id){const a=wallet().activity[Number(id)];if(!a)return;const order=a.orderId&&api.orders().find(o=>o.id===a.orderId),v=a.voucherCode&&wallet().vouchers.find(v=>v.code===a.voucherCode)||a.redemptionId&&wallet().vouchers.find(v=>v.redemptionId===a.redemptionId);modal('Points activity',`<div class="account-detail-title"><span class="account-section-icon">${icon('gift')}</span><h3>${e(a.title)}</h3><strong class="account-detail-points">${a.points>=0?'+':'−'}${money(Math.abs(a.points))}</strong></div><dl class="account-fields">${field('Date',a.createdAt?when(a.createdAt):date(a.date))}${field('Balance after',Number.isSafeInteger(a.balanceAfter)?money(a.balanceAfter):'Unavailable')}${a.reason?field('Reason',e(a.reason)):''}</dl>${order?button('order','View related order',order.id,'button'):v?`<button class="button" data-action="wallet-reward-details" data-code="${e(v.code)}">View related reward ${glyph('arrow')}</button>`:'<p class="account-note">No related record was saved for this activity.</p>'}`,{wallet:true})}
    function showCheckin(){const member=m();if(!member)return;const url=location.origin+location.pathname+'#admin-members/'+encodeURIComponent(member.id)+'/visits',qr=qrcode(0,'M');qr.addData(url);qr.make();modal('Your check-in code',`<div class="account-checkin-sheet"><span class="account-code-kicker">SYNC · MEMBER CHECK-IN</span><h3>${e(member.name)}</h3><div class="account-qr" role="img" aria-label="Member check-in code">${qr.createSvgTag({cellSize:4,margin:16,scalable:true}).replace('<svg ','<svg aria-hidden="true" ')}</div><strong class="account-code-number">SYNC ${memberNumber()}</strong><p>Show this code or your member number at reception.</p></div><h3 class="account-detail-section-title">Today’s sessions</h3>${checkinList()}<p class="account-note account-code-note">Reception confirms attendance. Showing this code does not record a visit.</p><p class="account-demo-note">Demo check-in codes do not sync bookings between devices.</p>`,{wallet:true})}
    function passwordForm(){modal('Change password',`<form id="account-password-form"><p class="account-note">Use a demo password. Changes are saved on this device only.</p>${[['currentPassword','Current password','current-password'],['newPassword','New password','new-password'],['confirmPassword','Confirm new password','new-password']].map(([name,label,autocomplete])=>`<label class="account-field"><span>${label}</span><span class="account-password-input"><input name="${name}" type="password" required minlength="8" maxlength="100" autocomplete="${autocomplete}"><button type="button" data-account="show-password" data-id="${name}" aria-label="Show password">Show</button></span></label>`).join('')}<p id="account-password-error" class="form-error" role="alert"></p><div class="account-form-actions"><button class="button light" type="button" data-action="close">Cancel</button><button class="button" type="submit">Update password</button></div></form>`,{wallet:true})}
    function emailForm(){modal('Change email',`<form id="account-email-form"><p class="account-note">Your current email stays active until verification is complete.</p><p class="account-demo-note">Demo verification only. No email will be sent.</p><label class="account-field"><span>New email address</span><input name="email" type="email" autocomplete="email" required maxlength="100" autocapitalize="none" spellcheck="false"></label><label class="account-field"><span>Current password</span><input name="password" type="password" autocomplete="current-password" required minlength="8" maxlength="100"></label><p id="account-email-error" class="form-error" role="alert"></p><div class="account-form-actions"><button class="button light" type="button" data-action="close">Cancel</button><button class="button" type="submit">Continue</button></div></form>`,{wallet:true})}
    function verifyEmail(){const pending=m().pendingEmailChange;if(!pending){emailForm();return}modal('Verify email change',`<div class="account-detail-title"><span class="account-section-icon">${glyph('user')}</span><h3>${e(pending.email)}</h3></div><p class="account-note">Your current email stays active until verification is complete.</p><p class="account-demo-note">No email was sent. The button below simulates verification for this local demo.</p><p id="account-verify-error" class="form-error" role="alert"></p><div class="account-detail-actions">${button('complete-email','Complete demo verification','','button')}${button('cancel-email','Cancel email change')}</div>`,{wallet:true})}
    function help(orderId=''){const o=api.orders().find(o=>o.id===orderId);modal('Help with your account',`<p class="account-note">Show these details to reception so the team can find the right record.</p><dl class="account-fields">${field('Member',e(m().name))}${field('Member number','SYNC '+memberNumber())}${o?field('Order',e(o.id)):''}</dl><label class="account-field"><span>What do you need help with?</span><select id="account-help-topic"><option>Purchase or pass</option><option>Points balance</option><option>Visit or check-in</option><option>Profile or sign-in</option></select></label><label class="account-field"><span>Details (optional)</span><textarea id="account-help-message" rows="3" maxlength="500"></textarea></label><button class="button" data-account="copy-help" data-id="${e(orderId)}">Copy details for reception</button><p id="account-help-status" role="status" class="account-note"></p><p class="account-demo-note">Nothing is sent. Share the copied details with reception.</p>`,{wallet:true})}
    function downloadOrder(id){const o=api.orders().find(o=>o.id===id);if(!o)return;const text=`SYNC — Demo order summary\nOrder: ${o.id}\nPackage: ${o.title}\nPurchased: ${o.date}\nAmount: NT$${money(o.amount)}\nStatus: ${o.status||'Paid'}\nPoints earned: ${Number.isSafeInteger(o.pointsEarned)?o.pointsEarned:'Unavailable'}\n\nThis is a demo order record, not a payment receipt.\n`,url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='SYNC-order-'+o.id.replace(/[^A-Za-z0-9_-]/g,'')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Order summary downloaded.')}
    function refreshResults(){const section=location.hash.split('/')[1]||'profile',target=$('#account-'+({purchases:'order',points:'point',visits:'visit'})[section]+'-results');if(target)target.innerHTML=I18n.html(({purchases:orderList,points:pointRows,visits:visitRows})[section]());}
    function afterRender(){const headerAvatar=$('.avatar');if(headerAvatar&&safePhoto(m()?.photo))headerAvatar.innerHTML=avatar(m());if(location.hash==='#home'&&$('.welcome')&&!$('.account-quick-checkin'))($('.overview-welcome-meta')||$('.welcome')).insertAdjacentHTML('beforeend',I18n.html(`<button class="button light account-quick-checkin overview-quick-code" data-account="checkin">${glyph('scan')}<span>Show check-in code</span></button>`));}
    document.addEventListener('click',async event=>{const b=event.target.closest('[data-account]');if(!b||!api.isMember())return;const a=b.dataset.account,id=b.dataset.id;
      if(a==='edit-profile')editProfile();if(a==='order')orderDetails(id);if(a==='point')pointDetails(id);if(a==='checkin')showCheckin();if(a==='password')passwordForm();if(a==='email')emailForm();if(a==='verify-email')verifyEmail();if(a==='help')help();if(a==='help-order')help(id);if(a==='download-order')downloadOrder(id);
      if(a==='remove-photo'){photoGeneration++;draftPhoto=null;$('#account-profile-form [type=submit]').disabled=false;$('#account-photo-error').textContent='';$('#account-photo-preview').innerHTML=avatar(m(),null);$('#account-photo-file').value=''}
      if(a==='show-password'){const input=b.closest('form').elements[id];input.type=input.type==='password'?'text':'password';b.textContent=t(input.type==='password'?'Show':'Hide');b.setAttribute('aria-label',t(input.type==='password'?'Show password':'Hide password'))}
      if(a==='point-filter'||a==='visit-filter'){if(a==='point-filter')pointFilter=id;else visitFilter=id;limit=10;const group=b.closest('.account-filter');group.querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));refreshResults()}
      if(a==='more'){limit+=10;refreshResults()}
      if(a==='complete-email'){const error=api.completeEmail();if(error){$('#account-verify-error').textContent=t(error);return}$('#modal').close();render();toast('Email address updated for this demo.')}
      if(a==='cancel-email'){api.cancelEmail();$('#modal').close();render();toast('Email change cancelled.')}
      if(a==='copy-help'){const number='SYNC '+memberNumber(),topic=$('#account-help-topic').value,notes=$('#account-help-message').value,content=`SYNC account support\nMember: ${m().name}\nMember number: ${number}\n${id?'Order: '+id+'\n':''}Topic: ${topic}\nDetails: ${notes}`;try{await navigator.clipboard.writeText(content);if($('#account-help-status'))$('#account-help-status').textContent=t('Details copied. Share them with reception.')}catch{if($('#account-help-status'))$('#account-help-status').textContent=t('Copy was blocked. Show this screen to reception instead.')}}
    });
    document.addEventListener('input',event=>{if(!api.isMember())return;if(event.target.id==='account-order-search'){orderSearch=event.target.value;limit=10;refreshResults()}});
    document.addEventListener('change',async event=>{if(!api.isMember())return;if(event.target.id==='account-order-period'){orderPeriod=event.target.value;limit=10;refreshResults()}if(event.target.id==='account-photo-file'){
      const form=event.target.closest('form'),file=event.target.files?.[0],error=$('#account-photo-error'),generation=++photoGeneration;if(!file)return;
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){error.textContent=t('Choose a JPG, PNG or WebP image smaller than 5 MB.');event.target.value='';form.querySelector('[type=submit]').disabled=false;return}
      const submit=form.querySelector('[type=submit]');submit.disabled=true;error.textContent='';try{const image=new Image(),source=URL.createObjectURL(file);try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=source})}finally{URL.revokeObjectURL(source)}if(!form.isConnected||generation!==photoGeneration)return;const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;const ctx=canvas.getContext('2d'),side=Math.min(image.naturalWidth,image.naturalHeight);ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,160,160);draftPhoto=canvas.toDataURL('image/jpeg',.85);$('#account-photo-preview').innerHTML=avatar(m(),draftPhoto)}catch{if(error.isConnected&&generation===photoGeneration)error.textContent=t('This photo could not be opened. Choose another image.')}finally{if(submit.isConnected&&generation===photoGeneration)submit.disabled=false}
    }});
    document.addEventListener('submit',async event=>{const form=event.target;if(!form.id?.startsWith('account-')||!api.isMember())return;event.preventDefault();if(!form.checkValidity()){form.reportValidity();return}if(form.dataset.busy)return;const values=Object.fromEntries(new FormData(form)),submit=form.querySelector('[type=submit]');let error=null;form.dataset.busy='true';form.setAttribute('aria-busy','true');if(submit)submit.disabled=true;
      try{
        if(form.id==='account-profile-form'){error=api.updateProfile({...values,photo:draftPhoto});if(error){$('#account-profile-error').textContent=t(error);return}$('#modal').close();render();toast('Profile updated.')}
        if(form.id==='account-preferences-form'){api.preferences({bookingReminders:!!values.bookingReminders,passExpiryReminders:!!values.passExpiryReminders,marketing:!!values.marketing,language:values.language});const oldLanguage=I18n.language;I18n.setLanguage(values.language);if(oldLanguage!==I18n.language){render();const details=$('.account-settings-group');details.open=true;$('#account-preferences-status').textContent=t('Preferences saved.')}else $('#account-preferences-status').textContent=t('Preferences saved.')}
        if(form.id==='account-password-form'){if(values.newPassword!==values.confirmPassword){$('#account-password-error').textContent=t('The new passwords do not match.');return}error=await api.password(values.currentPassword,values.newPassword);if(!form.isConnected)return;if(error){$('#account-password-error').textContent=t(error);return}$('#modal').close();toast('Password updated for this demo.')}
        if(form.id==='account-email-form'){error=await api.email(values.email,values.password);if(!form.isConnected)return;if(error){$('#account-email-error').textContent=t(error);return}verifyEmail()}
      }catch{const target=form.querySelector('.form-error,[role=status]');if(target)target.textContent=t('Changes could not be saved. Please try again.')}finally{delete form.dataset.busy;form.removeAttribute('aria-busy');if(submit?.isConnected)submit.disabled=false}
    });
    return {page,afterRender,refreshCheckin:showCheckin};
  }
  return {create};
})();
