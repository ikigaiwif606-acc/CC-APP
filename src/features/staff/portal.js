// Browser-local demo access and staff workflows. Production authentication requires a backend.
(() => {
  const copy = {
    'Awaiting check-in':'待報到','Ready for your next visit.':'為下一次到訪，做好準備。','Show':'顯示','Hide':'隱藏','Show password':'顯示密碼','Hide password':'隱藏密碼','Enter your name.':'請輸入姓名。','Used.':'已使用。','No sessions available for this date.':'此日期尚無課程。','Cannot move a session with existing bookings.':'已有預約的課程無法更改日期、時間或服務。','Settings are read-only in this mockup; can issue passes and adjust points.':'此原型的設定僅供查看；可發放堂票及調整點數。','Welcome to your rhythm.':'歡迎回到你的節奏。','A little space. A better day.':'一點自己的空間，更好的每一天。','Your next moment starts here.':'下一段美好時光，從這裡開始。',
    'Sign in':'登入','Join SYNC':'加入 SYNC','Email address':'電子郵件','Password':'密碼','Full name':'姓名','Phone number (optional)':'手機號碼（選填）','Forgot password?':'忘記密碼？',
    'New to SYNC?':'還不是 SYNC 會員？','Create your account':'建立帳戶','Already a member?':'已經是會員？','Free to join. Yours to enjoy.':'免費加入，享受專屬禮遇。','Start with Plus membership, then grow at your own pace.':'從 Plus 會員開始，依自己的步調累積更多禮遇。',
    'I agree to the membership terms.':'我同意會員條款。','Read demo terms':'查看示範條款','Create account':'註冊帳戶','Reset your password.':'重設你的密碼。','Enter your email to preview the recovery flow.':'輸入電子郵件，體驗密碼重設流程。','Send reset link':'寄送重設連結','Back to sign in':'返回登入',
    'Check your inbox.':'請查看你的收件匣。','This is a preview only. No email was sent.':'此為流程預覽，尚未實際寄送電子郵件。','Continue to member demo':'進入會員示範','Check your email to verify your account.':'請確認電子郵件以驗證帳戶。','Complete demo verification':'完成模擬驗證',
    'Demo mode':'示範模式','Simulated access. Do not enter a real password.':'模擬登入，請勿輸入真實密碼。',
    'Owner / Admin':'負責人／管理員','Front desk':'櫃台人員','Signed out.':'已登出。','Sign out':'登出','Member preview':'會員預覽',
    'Operations, in rhythm.':'讓營運，井然有序。','A clearer view of your club.':'掌握會館的每一個環節。','Admin workspace':'管理工作台','Front desk workspace':'櫃台工作台','Local demo data · no real transactions':'本機示範資料 · 無真實交易',
    'Today at SYNC':'SYNC 今日動態','Members':'會員管理','Schedule & bookings':'課表與預約','Orders & passes':'訂單與堂票','Points & rewards':'點數與獎勵','Settings':'設定','Today’s bookings':'今日預約','Checked in':'已報到','Active members':'會員總數','Recent package sales':'近期套票銷售',
    'Today’s arrivals':'今日到館','View schedule':'查看課表','Recent activity':'近期紀錄','No activity yet.':'尚無紀錄。','Member':'會員','Session':'課程','Time':'時間','Status':'狀態','Action':'操作','Booked':'已預約','Check in':'報到','No bookings for this date.':'此日期尚無預約。','Search by name or email':'搜尋姓名或電子郵件','Tier':'等級','Points':'點數','Passes':'堂票','View member':'查看會員','Member details':'會員資料','No members found.':'找不到符合的會員。',
    'Qualifying spend':'有效消費','Add session':'新增課程','Date':'日期','Service':'服務','Title':'課程名稱','Instructor':'指導老師','Capacity':'名額','Save session':'儲存課程','Edit session':'編輯課程','Cancel session':'取消課程','Cancel this session?':'要取消此課程嗎？','Booked passes will be restored with their original expiry.':'已扣除的堂票將退回並保留原使用期限。','Keep session':'保留課程','Confirm cancellation':'確認取消','Session saved.':'課程已儲存。','Session cancelled and passes restored.':'課程已取消，堂票已退回。','A session already exists at this time.':'此時段已有相同服務的課程。','Capacity cannot be lower than current bookings.':'名額不得少於目前預約人數。','Cancelled':'已取消','Yoga session':'瑜伽課程',
    'Upcoming sessions':'即將到來的課程','Booking roster':'預約名單','Attendance recorded.':'報到紀錄已儲存。','Use check-in on the session date.':'請於課程當天操作報到。','Sample orders':'示範訂單','Order':'訂單','Amount':'金額','Paid':'已付款','Pass wallet':'堂票錢包','Issue passes':'發放堂票','Quantity':'堂數','Expiry date':'到期日','Reason':'原因','Confirm issue':'確認發放','Passes issued.':'堂票已發放。',
    'Adjust points':'調整點數','Point adjustment':'點數調整','Add or subtract points; completed visits stay unchanged.':'新增或扣除點數，不影響已完成到訪次數。','Points change':'調整點數','Adjustment reason':'調整原因','Save adjustment':'儲存調整','Point adjustment recorded.':'點數調整已記錄。','Adjustment would make the balance negative.':'調整後點數不可為負數。','Audit trail':'操作紀錄','Who':'操作人員','What changed':'操作內容','When':'時間','Why':'原因','No adjustments yet.':'尚無調整紀錄。',
    'Validate voucher':'驗證兌換券','Voucher code':'兌換券代碼','Look up voucher':'查詢兌換券','Voucher not found.':'找不到兌換券。','Voucher expired.':'兌換券已到期。','Voucher already used.':'兌換券已使用。','Guest voucher ready to use.':'好友體驗券可使用。','Confirm voucher use':'確認使用兌換券','Voucher marked as used.':'兌換券已標記為使用。','Service rewards are booked from the member pass wallet.':'服務獎勵請使用會員堂票錢包預約。',
    'Program settings':'會員計畫設定','Current demo policies':'目前示範規則','Pass validity':'堂票效期','Single / 5 / 10 sessions':'單堂／5 堂／10 堂','Cancellation window':'取消期限','24 hours before the session':'課程開始前 24 小時','Tier thresholds':'會員升等門檻','Policies are read-only in this mockup.':'此原型的規則僅供查看。','Staff permissions':'人員權限','Can create accounts, assign Instructors, issue passes and adjust points.':'可建立帳戶、指派老師、發放堂票及調整點數。','Can view members, manage bookings, check in, and validate guest vouchers.':'可查看會員、管理預約、報到及驗證好友體驗券。','Owner access required.':'此操作需要管理員權限。','Demo membership terms':'示範會員條款','Registration is free. This prototype does not create a real membership or accept payments.':'註冊免費。此原型不會建立真實會員帳戶或收取費用。','Email already exists in this demo.':'此電子郵件已存在於示範資料中。','Local demo only. Nothing is sent to a server.':'僅限本機示範，不會傳送至伺服器。','Read-only':'僅供查看','Used':'已使用','Demo verification complete.':'模擬驗證已完成。',
    'Welcome to the team.':'歡迎進入團隊工作台。','Use demo credentials to explore the staff workspace.':'使用示範資料，探索團隊工作流程。','Single Yoga pass':'瑜伽單堂票','Yoga · 5 passes':'瑜伽 5 堂套票','Yoga · 10 passes':'瑜伽 10 堂套票','Contrast Therapy · 5 passes':'冷熱交替療法 5 次套票','Contrast Therapy · 10 passes':'冷熱交替療法 10 次套票',
    'Yoga guest reward':'瑜伽好友獎勵','Manual points adjustment':'手動點數調整','Pass issue':'堂票發放','Check-in':'報到','Session creation':'新增課程','Session update':'更新課程','Session cancellation':'取消課程','Guest voucher use':'好友券使用','Demo registration':'模擬註冊','Member check-in':'會員報到','Refunds are not implemented in this version.':'此版本尚未提供退款功能。','No orders yet.':'尚無訂單。','No active passes.':'尚無有效堂票。','Staff only':'工作人員專用','Manage your next moment.':'管理下一段療癒時光。'
  };
  Object.assign(copy, {
    'SIGN IN':'登入','Welcome back':'歡迎回來','Sign in to your SYNC account.':'登入你的 SYNC 帳戶。',
    'Enter your password':'輸入密碼','Create a demo password (8+ characters)':'設定示範密碼（至少 8 個字元）',
    'Keep me signed in':'保持登入','Create an account':'建立帳戶','Try a demo account':'試用示範帳戶','Demo':'示範',
    'Sample accounts':'示範帳戶','Shared demo password':'共用示範密碼','Use a sample account to fill the form, then sign in.':'選取示範帳戶以填入資料，再按登入。',
    'Email or password is incorrect.':'電子郵件或密碼不正確。','Unable to sign in. Please try again.':'無法登入，請再試一次。',
    'Use a different account':'切換帳戶','Demo account selected.':'已選取示範帳戶。',
    'Today':'今天','Scan':'掃碼','Schedule':'課表','More':'更多','Workspace':'工作台',
    'Staff navigation':'工作台導覽','Staff account':'工作人員帳戶','Open staff account':'開啟工作人員帳戶',
    'More navigation':'更多工作台功能','Close menu':'關閉選單','Club management':'會館管理',
    'Review purchases and pass balances.':'查看購買紀錄與堂票餘額。',
    'View activity and validate vouchers.':'查看操作紀錄與驗證兌換券。',
    'Manage accounts and view club policies.':'管理帳戶及查看會館規則。',
    'Open the member experience.':'開啟會員介面。'
  });
  Object.assign(copy, {
    'Today at SYNC':'今日概覽',
    'Ready for arrivals':'準備迎接下一位會員',
    'Welcome your next arrival':'為下一位會員辦理報到',
    'All check-ins complete':'今日預約皆已報到',
    'No bookings today. View the schedule to plan ahead.':'今日尚無預約，可查看課表安排接待。',
    'Scan a member’s code to review and confirm check-in.':'掃描會員報到碼，核對預約後確認報到。',
    'Scan a code if you need to review a member’s booking.':'仍可掃碼查詢會員及預約資料。',
    'View today’s schedule':'查看今日課表'
  });
  I18n.extend(copy);
  const t = I18n.translate, esc = escapeHTML;
  const clone = value => JSON.parse(JSON.stringify(value));
  const emptyWallet = name => ({name,points:0,spend:0,packages:[],bookings:[],vouchers:[],activity:[],visitHistory:[]});
  const dbKey='sync-staff-demo-v1';
  function newDb(){
    const members=[{id:'jamie',name:state.name,email:'jamie@sync.demo',phone:'',wallet:clone(state)}];
    for(const [id,name,email,spend,points] of [['avery','Avery Chen','avery@sync.demo',22000,8000],['morgan','Morgan Wu','morgan@sync.demo',36000,18000],['riley','Riley Huang','riley@sync.demo',4000,4000]]){
      const wallet=emptyWallet(name);Object.assign(wallet,{spend,points,packages:[{id:crypto.randomUUID(),service:'yoga',remaining:5,total:5,expiry:addDays(80)}]});members.push({id,name,email,phone:'',wallet});
    }
    const sessionList=[];
    for(let day=0;day<=30;day++)for(const service of ['yoga','contrast'])for(const item of sessions[service])sessionList.push({id:crypto.randomUUID(),service,date:addDays(day),time:item[0],title:item[1],instructor:service==='yoga'&&item[0]==='18:30'?'Maya Wu':service==='contrast'&&item[0]!=='14:00'?'Kai Lin':'Alex Chen',instructorId:service==='yoga'&&item[0]==='18:30'?'instructor-maya':service==='contrast'&&item[0]!=='14:00'?'instructor-kai':'instructor-alex',room:service==='yoga'?'Studio 1':'Recovery room',capacity:service==='yoga'?8:4,cancelled:false});
    const todayYoga=sessionList.find(s=>s.date===addDays(0)&&s.service==='yoga');
    return {members,sessions:sessionList,audit:[],checkins:[],usedVouchers:[],sampleBookings:[{id:'sample-avery',memberId:'avery',date:todayYoga.date,time:todayYoga.time,title:todayYoga.title,service:'yoga',sample:true},{id:'sample-morgan',memberId:'morgan',date:addDays(0),time:'14:00',title:'Contrast Therapy',service:'contrast',sample:true}],orders:[{id:'DEMO-2088',memberId:'jamie',title:'Yoga · 10 passes',amount:7500,date:addDays(-30)},{id:'DEMO-2089',memberId:'jamie',title:'Contrast Therapy · 5 passes',amount:5000,date:addDays(-12)},{id:'DEMO-2090',memberId:'avery',title:'Yoga · 10 passes',amount:7500,date:addDays(-5)}]};
  }
  let db;try{const saved=JSON.parse(localStorage.getItem(dbKey));db=saved&&Array.isArray(saved.members)&&saved.members.every(m=>validDemo(m.wallet))&&['sessions','audit','checkins','usedVouchers','sampleBookings','orders'].every(k=>Array.isArray(saved[k]))?saved:newDb()}catch{db=newDb()}
  if(!Array.isArray(db.accounts))db.accounts=[];
  // Additive migration: retain every existing wallet, order and activity record.
  for(const m of db.members){
    if(!Array.isArray(m.wallet.visitHistory))m.wallet.visitHistory=[];
    if(!Array.isArray(m.wallet.attendance))m.wallet.attendance=[];
    for(const b of [...m.wallet.bookings,...m.wallet.visitHistory,...db.sampleBookings.filter(b=>b.memberId===m.id)])if(b.checkedInAt||db.checkins.includes(b.id))SyncMembership.record(m.wallet,b,b.checkedInAt);
  }
  const demoPassword='SyncDemo2026!';
  const sampleStaffAccounts=[{id:'sample-admin',name:'SYNC Admin',email:'admin@sync.demo',role:'admin',memberId:'jamie'},{id:'sample-frontdesk',name:'SYNC Front desk',email:'frontdesk@sync.demo',role:'frontdesk',memberId:'jamie'},...SyncInstructor.accounts.map(p=>({...p,role:'instructor',memberId:'jamie',instructorId:p.id}))];
  const staffAccounts=()=>[...sampleStaffAccounts,...(db.accounts||[]).map(a=>({...a,memberId:'jamie',credential:a.demoCredential,local:true,...(a.role==='instructor'?{instructorId:a.id}:{})}))];
  const instructorProfiles=()=>[...SyncInstructor.accounts,...(db.accounts||[]).filter(a=>a.role==='instructor').map(a=>({id:a.id,name:a.name,email:a.email,services:a.services||[]}))];
  function accountFor(email){
    const normalized=String(email||'').trim().toLowerCase();
    const staffAccount=staffAccounts().find(a=>a.email===normalized);
    if(staffAccount)return staffAccount;
    const member=db.members.find(m=>m.email.toLowerCase()===normalized);
    return member?{email:normalized,role:'member',memberId:member.id,credential:member.demoCredential}:null;
  }
  // Only a salted password verifier is retained for new local demo registrations.
  async function passwordCredential(password,salt=crypto.getRandomValues(new Uint8Array(16)),iterations=100000){
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations,hash:'SHA-256'},key,256);
    return {salt:Array.from(salt),hash:Array.from(new Uint8Array(bits)),iterations};
  }
  async function passwordMatches(account,password){
    if(!account)return false;
    if(!account.credential)return !account.local&&password===demoPassword;
    const stored=account.credential;
    const candidate=await passwordCredential(password,new Uint8Array(stored.salt),stored.iterations);
    return candidate.hash.length===stored.hash.length&&candidate.hash.every((byte,i)=>byte===stored.hash[i]);
  }
  let access;try{access=JSON.parse(sessionStorage.getItem('sync-demo-access')||localStorage.getItem('sync-demo-access'))}catch{}
  if(!access||!['member','admin','frontdesk','instructor'].includes(access.role)||!db.members.some(m=>m.id===access.memberId))access=null;
  if(access){
    const email=access.email||(access.role==='member'?db.members.find(m=>m.id===access.memberId).email:staffAccounts().find(a=>a.role===access.role)?.email);
    const account=accountFor(email);
    if(!account||account.role!==access.role||account.memberId!==access.memberId||(access.role==='instructor'&&account.instructorId!==access.instructorId))access=null;
    else access.email=account.email;
  }
  let activeMemberId=access?.memberId||'jamie',staffDate=addDays(0),memberFocus='jamie';
  const persist=()=>localStorage.setItem(dbKey,JSON.stringify(db));
  const currentMember=()=>db.members.find(m=>m.id===activeMemberId);
  const memberTier=m=>SyncMembership.tier(m.wallet);
  const manager=()=>access?.role==='admin';
  const instructorProfile=()=>access?.role==='instructor'?instructorProfiles().find(p=>p.id===access.instructorId&&p.email===access.email):null;
  const isInstructor=()=>!!instructorProfile();
  const staff=()=>access&&['admin','frontdesk'].includes(access.role);
  const audit=(action,memberId,reason)=>{const actor=accountFor(access?.email);db.audit.unshift({id:crypto.randomUUID(),action,memberId,reason,who:isInstructor()?'Instructor':manager()?'Owner / Admin':'Front desk',...(actor?{actorId:actor.id||actor.email,actorName:actor.name||actor.email}:{}),at:new Date().toISOString()});persist()};
  function allBookings(){return [...db.sampleBookings,...db.members.flatMap(m=>m.wallet.bookings.map(b=>({...b,memberId:m.id})))].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}
  function bookingsFor(s){return allBookings().filter(b=>b.service===s.service&&b.date===s.date&&b.time===s.time)}
  window.syncPortal={allowMemberAction:action=>!isInstructor()||['language','close','rules'].includes(action),memberNumber(){const index=db.members.findIndex(m=>m.id===activeMemberId);return '0000 '+String(2088+index)},walletSaved(wallet){if(isInstructor())return;const m=currentMember();if(m){m.wallet=clone(wallet);m.name=wallet.name;persist()}},purchaseRecorded(service,qty,amount,metadata={}){if(isInstructor())return;db.orders.unshift({id:'DEMO-'+crypto.randomUUID().slice(0,8).toUpperCase(),memberId:activeMemberId,title:(service==='yoga'?'Yoga':'Contrast Therapy')+' · '+qty+' passes',amount,date:addDays(0),...metadata});persist()},sessionsFor(service,date){const records=db.sessions.filter(s=>s.service===service&&s.date===date);if(!records.length)return [];return records.filter(s=>!s.cancelled).sort((a,b)=>a.time.localeCompare(b.time)).map(s=>[s.time,s.title,service==='yoga'?'Gentle vinyasa · All levels':'Infrared Steam Bath included',`${Math.max(0,s.capacity-bookingsFor(s).length)} spaces`])}};
  if(access?.role==='member')state=clone(currentMember().wallet);
  // Account owns only the signed-in member's profile, settings and records.
  const isMember=()=>access?.role==='member';
  const demoResetBackupKey='sync-demo-reset-backups-v1';
  function resetBackups(){try{const value=JSON.parse(localStorage.getItem(demoResetBackupKey));return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return {}}}
  function resetRecords(member){
    const bookings=[...member.wallet.bookings,...(member.wallet.visitHistory||[]),...(member.wallet.attendance||[]),...db.sampleBookings.filter(b=>b.memberId===member.id)];
    const ids=new Set(bookings.flatMap(b=>[b.id,b.bookingId]).filter(Boolean)),codes=new Set(member.wallet.vouchers.map(v=>v.code));
    return {wallet:clone(member.wallet),orders:clone(db.orders.filter(o=>o.memberId===member.id)),audit:clone(db.audit.filter(a=>a.memberId===member.id)),sampleBookings:clone(db.sampleBookings.filter(b=>b.memberId===member.id)),checkins:db.checkins.filter(id=>ids.has(id)),usedVouchers:db.usedVouchers.filter(code=>codes.has(code))};
  }
  function resetUndoAvailable(){if(!isMember())return false;const backup=resetBackups()[activeMemberId];return !!backup&&backup.after===JSON.stringify(resetRecords(currentMember()))}
  function restoreResetRecords(member,records){
    const current=resetRecords(member),ids=new Set(current.checkins),codes=new Set(current.usedVouchers);
    member.wallet=clone(records.wallet);
    for(const key of ['orders','audit','sampleBookings'])db[key]=db[key].filter(item=>item.memberId!==member.id).concat(clone(records[key]));
    db.checkins=db.checkins.filter(id=>!ids.has(id)).concat(records.checkins);
    db.usedVouchers=db.usedVouchers.filter(code=>!codes.has(code)).concat(records.usedVouchers);
  }
  function resetMemberDemo(undo=false){
    if(!isMember())return {ok:false,error:'Member access required.'};
    loadLatest();const member=currentMember(),before=clone(db),previousWallet=localStorage.getItem('sync-demo-v1'),backups=resetBackups(),previousBackups=localStorage.getItem(demoResetBackupKey);
    try{
      if(undo){
        const backup=backups[member.id];
        if(!backup||backup.after!==JSON.stringify(resetRecords(member))||!validDemo(backup.records.wallet))return {ok:false,error:'New activity was recorded. The reset can no longer be undone.'};
        restoreResetRecords(member,backup.records);delete backups[member.id];
      }else{
        if(resetUndoAvailable())return {ok:true,wallet:clone(member.wallet)};
        const original=resetRecords(member),defaults=newDb(),sample=defaults.members.find(m=>m.id===member.id);
        const wallet=member.id==='jamie'?seed():sample?clone(sample.wallet):emptyWallet(member.name);
        wallet.name=member.name;wallet.visitHistory=[];wallet.attendance=[];
        restoreResetRecords(member,{wallet,orders:defaults.orders.filter(o=>o.memberId===member.id),audit:[],sampleBookings:defaults.sampleBookings.filter(b=>b.memberId===member.id),checkins:[],usedVouchers:[]});
        backups[member.id]={at:new Date().toISOString(),records:original,after:JSON.stringify(resetRecords(member))};
      }
      localStorage.setItem(demoResetBackupKey,JSON.stringify(backups));
      localStorage.setItem('sync-demo-v1',JSON.stringify(member.wallet));persist();state=clone(member.wallet);
      return {ok:true,wallet:clone(member.wallet)};
    }catch{
      db=before;state=clone(currentMember().wallet);
      try{persist();if(previousWallet===null)localStorage.removeItem('sync-demo-v1');else localStorage.setItem('sync-demo-v1',previousWallet);if(previousBackups===null)localStorage.removeItem(demoResetBackupKey);else localStorage.setItem(demoResetBackupKey,previousBackups)}catch{}
      return {ok:false,error:'Unable to save changes. Please try again.'};
    }
  }
  Object.assign(window.syncPortal,{resetDemo:()=>resetMemberDemo(),undoResetDemo:()=>resetMemberDemo(true),canUndoReset:resetUndoAvailable});
  Object.assign(window.syncPortal,{overviewBookings(){
    if(!isMember())return [];
    return currentMember().wallet.bookings.map(b=>{
      const matches=db.sessions.filter(s=>b.sessionId?s.id===b.sessionId:s.date===b.date&&s.time===b.time&&s.service===b.service);
      const session=matches.length===1?matches[0]:null,profile=session&&instructorProfiles().find(p=>p.id===session.instructorId);
      return {...clone(b),cancelled:bookingCancelled(b),checked:bookingChecked({...b,memberId:activeMemberId}),instructor:profile?.name||'',room:session?.room||''};
    });
  }});

  function commitAccount(change){
    if(!isMember())throw new Error('Member access required');
    const member=currentMember(),before=clone(member),previousState=clone(state);
    try{change(member);state=clone(member.wallet);save();persist()}
    catch(error){Object.keys(member).forEach(key=>delete member[key]);Object.assign(member,before);state=previousState;try{persist();localStorage.setItem('sync-demo-v1',JSON.stringify(state))}catch{}throw error}
  }
  const memberAccount=SyncAccount.create({
    isMember,member:()=>clone(currentMember()),orders:()=>clone(db.orders.filter(o=>o.memberId===activeMemberId)),bookings:()=>clone(allBookings().filter(b=>b.memberId===activeMemberId)),checked:id=>db.checkins.includes(id),
    updateProfile(values){
      if(!isMember())return 'Member access required.';
      const name=String(values.name||'').trim(),phone=String(values.phone||'').trim(),birthday=String(values.birthday||'');
      if(!name||name.length>60)return 'Enter a name between 1 and 60 characters.';
      if(phone&&(!/^[+()0-9\s.-]{6,30}$/.test(phone)||phone.replace(/\D/g,'').length<6))return 'Enter a valid phone number.';
      if(birthday&&(!/^\d{4}-\d{2}-\d{2}$/.test(birthday)||birthday<'1900-01-01'||birthday>addDays(0)||!Number.isFinite(Date.parse(birthday))||new Date(birthday+'T12:00:00Z').toISOString().slice(0,10)!==birthday))return 'Choose a valid birthday in the past.';
      if(values.photo&&(typeof values.photo!=='string'||values.photo.length>=150000||!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(values.photo)))return 'This photo could not be saved.';
      commitAccount(member=>{Object.assign(member,{name,phone,birthday,photo:values.photo||null});member.wallet.name=name});return null;
    },
    preferences(values){commitAccount(member=>{member.preferences={bookingReminders:values.bookingReminders===true,passExpiryReminders:values.passExpiryReminders===true,marketing:values.marketing===true,language:values.language==='zh-TW'?'zh-TW':'en'}})},
    async password(currentPassword,newPassword){
      if(!isMember())return 'Member access required.';
      const id=activeMemberId,email=currentMember().email;
      if(typeof newPassword!=='string'||newPassword.length<8||newPassword.length>100)return 'Use a password with 8 to 100 characters.';
      if(!await passwordMatches(accountFor(email),currentPassword))return 'The current password is incorrect.';
      if(currentPassword===newPassword)return 'Choose a different new password.';
      const credential=await passwordCredential(newPassword);
      if(!isMember()||activeMemberId!==id||currentMember().email!==email)return 'Your account changed. Please try again.';
      commitAccount(member=>{member.demoCredential=credential});return null;
    },
    async email(value,password){
      if(!isMember())return 'Member access required.';
      const email=String(value||'').trim().toLowerCase(),id=activeMemberId,oldEmail=currentMember().email;
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>100)return 'Enter a valid email address.';
      if(accountFor(email))return 'This email is already in use.';
      if(!await passwordMatches(accountFor(oldEmail),password))return 'The current password is incorrect.';
      if(!isMember()||activeMemberId!==id||currentMember().email!==oldEmail)return 'Your account changed. Please try again.';
      if(accountFor(email))return 'This email is already in use.';
      commitAccount(member=>{member.pendingEmailChange={email,requestedAt:new Date().toISOString()}});return null;
    },
    completeEmail(){
      if(!isMember())return 'Member access required.';
      const pending=currentMember().pendingEmailChange;
      if(!pending||!Number.isFinite(Date.parse(pending.requestedAt))||Date.now()-Date.parse(pending.requestedAt)>900000)return 'This verification preview expired. Start the email change again.';
      if(accountFor(pending.email))return 'This email is already in use.';
      commitAccount(member=>{member.email=pending.email;delete member.pendingEmailChange});
      access.email=currentMember().email;sessionStorage.setItem('sync-demo-access',JSON.stringify(access));if(access.remember)localStorage.setItem('sync-demo-access',JSON.stringify(access));return null;
    },
    cancelEmail(){if(isMember())commitAccount(member=>{delete member.pendingEmailChange})}
  });
  accountPage=memberAccount.page;
  function bookingChecked(booking){const member=db.members.find(m=>m.id===booking.memberId);return db.checkins.includes(booking.id)||!!booking.checkedInAt||!!member?.wallet.attendance?.some(v=>(v.bookingId||v.id)===booking.id)}
  function bookingCancelled(booking){return booking.status==='cancelled'||db.sessions.some(s=>s.cancelled&&s.date===booking.date&&s.time===booking.time&&s.service===booking.service)}
  function confirmCheckin(id,expectedMemberId,expectedSessionId){
    loadLatest();
    if(!staff()&&!isInstructor())return {ok:false,error:'Staff access required.'};
    const booking=allBookings().find(b=>b.id===id&&(!expectedMemberId||b.memberId===expectedMemberId));
    if(!booking||bookingCancelled(booking))return {ok:false,error:'This booking is no longer available. Check today’s schedule.'};
    if(isInstructor()){const assigned=assignedSession(expectedSessionId);if(!assigned||assigned.cancelled||SyncInstructor.status(assigned)==='completed'||!sameSession(booking,assigned))return {ok:false,error:'This session is not assigned to you.'}}
    if(booking.date!==addDays(0))return {ok:false,error:'Use check-in on the session date.'};
    if(bookingChecked(booking))return {ok:false,error:'This booking is already checked in.'};
    const member=db.members.find(m=>m.id===booking.memberId),record=member?.wallet.bookings.find(b=>b.id===id)||db.sampleBookings.find(b=>b.id===id&&b.memberId===booking.memberId);
    if(!member||!record)return {ok:false,error:'This booking is no longer available. Check today’s schedule.'};
    db.checkins.push(id);record.checkedInAt=new Date().toISOString();SyncMembership.record(member.wallet,record,record.checkedInAt);
    const reward=member.wallet.vouchers.find(v=>v.passId&&v.passId===booking.passId);if(reward){reward.used=true;reward.usedAt=record.checkedInAt}
    if(member.id===activeMemberId){state=clone(member.wallet);save()}audit('Check-in',member.id,'Member check-in');
    return {ok:true};
  }
  const checkinScanner=SyncCheckin.create({
    isStaff:()=>!!staff(),
    find(code){if(!staff())return null;const member=db.members.find((m,index)=>code.type==='id'?m.id===code.value:code.type==='email'?m.email.toLowerCase()===code.value:code.type==='number'?[String(2088+index),'0000'+String(2088+index)].includes(code.value):false);return member?{id:member.id}:null},
    member(id){if(!staff())return null;const index=db.members.findIndex(m=>m.id===id),member=db.members[index];return member?{id:member.id,name:member.name,email:member.email,number:'SYNC 0000 '+String(2088+index),tier:memberTier(member)}:null},
    bookings(id){return staff()?allBookings().filter(b=>b.memberId===id&&b.date===addDays(0)&&!bookingCancelled(b)).map(b=>({...clone(b),checked:bookingChecked(b)})):[]},
    confirm:confirmCheckin
  });
  // Instructor ownership is based on account IDs; legacy display names grant no access.
  const sameSession=(booking,session)=>!!booking&&!!session&&booking.service===session.service&&booking.date===session.date&&booking.time===session.time;
  function loadLatest(){try{const next=JSON.parse(localStorage.getItem(dbKey));if(next&&Array.isArray(next.members)&&next.members.every(m=>validDemo(m.wallet))&&['sessions','audit','checkins','usedVouchers','sampleBookings','orders'].every(k=>Array.isArray(next[k]))){if(!Array.isArray(next.accounts))next.accounts=[];db=next}}catch{}}
  function assignedSession(id){const profile=instructorProfile();if(!profile||typeof id!=='string')return null;return db.sessions.find(s=>s.id===id&&s.instructorId===profile.id&&profile.services.includes(s.service))||null}
  function sessionView(s){return s?{id:s.id,title:s.title,service:s.service,date:s.date,time:s.time,capacity:s.capacity,room:s.room||'',cancelled:!!s.cancelled,delivery:clone(s.delivery||{})}:null}
  function instructorRoster(id){const s=assignedSession(id);if(!s)return [];return bookingsFor(s).filter(b=>!bookingCancelled(b)).map(b=>{const m=db.members.find(m=>m.id===b.memberId),index=db.members.indexOf(m);if(!m)return null;return {id:b.id,memberId:m.id,name:m.name,number:'SYNC 0000 '+String(2088+index),photo:typeof m.photo==='string'&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(m.photo)?m.photo:null,checked:bookingChecked(b),first:!(m.wallet.attendance||[]).some(v=>(v.bookingId||v.id)!==b.id&&v.service===s.service)}}).filter(Boolean)}
  function delivery(s){if(!s.delivery||typeof s.delivery!=='object'||Array.isArray(s.delivery))s.delivery={};if(!s.delivery.preparation||typeof s.delivery.preparation!=='object')s.delivery.preparation={};if(!Array.isArray(s.delivery.handovers))s.delivery.handovers=[];return s.delivery}
  function instructorWrite(id){loadLatest();if(!isInstructor())return {error:'Instructor access required.'};const session=assignedSession(id);return session?{session}:{error:'This session is not assigned to you.'}}
  const scanSessionId=()=>{const match=location.hash.match(/^#instructor-session\/([^/]+)\/scan$/);if(!match)return null;try{return decodeURIComponent(match[1])}catch{return null}};
  function canInstructorScan(){const s=assignedSession(scanSessionId());return !!s&&!s.cancelled&&s.date===addDays(0)&&SyncInstructor.status(s)!=='completed'}
  const instructorScanner=SyncCheckin.create({
    isStaff:canInstructorScan,onPage:()=>canInstructorScan(),intro:'Scan a participant’s code for this session, then confirm attendance.',notFound:'Member not found for this session. Use the participant list or ask reception.',
    find(code){const s=assignedSession(scanSessionId());if(!s)return null;const roster=instructorRoster(s.id),ids=new Set(roster.map(b=>b.memberId));const found=db.members.find((m,index)=>ids.has(m.id)&&(code.type==='id'?m.id===code.value:code.type==='email'?m.email.toLowerCase()===code.value:code.type==='number'?[String(2088+index),'0000'+String(2088+index)].includes(code.value):false));return found?{id:found.id}:null},
    member(id){const participant=instructorRoster(scanSessionId()).find(b=>b.memberId===id);return participant?{id:participant.memberId,name:participant.name,number:participant.number}:null},
    bookings(id){const s=assignedSession(scanSessionId());return s?bookingsFor(s).filter(b=>b.memberId===id&&!bookingCancelled(b)).map(b=>({...clone(b),checked:bookingChecked(b)})):[]},
    confirm(id,memberId){return confirmCheckin(id,memberId,scanSessionId())},
    profileLink(){return {href:'#instructor-session/'+encodeURIComponent(scanSessionId()),label:'Back to session'}}
  });
  function attendanceData(){
    if(!staff()&&!isInstructor())return {sessions:[],bookings:[],unlinked:[]};
    const own=instructorProfile(),allowed=s=>!own||s.instructorId===own.id&&own.services.includes(s.service);
    const source=db.sessions.filter(allowed),byId=new Map(source.map(s=>[s.id,s])),bySlot=new Map();
    for(const s of source){const key=[s.date,s.time,s.service].join('|');if(!bySlot.has(key))bySlot.set(key,[]);bySlot.get(key).push(s)}
    const row=s=>({id:s.id,date:s.date,time:s.time,title:s.title,service:s.service,instructorId:s.instructorId||null,instructorName:s.instructorId?(instructorProfiles().find(p=>p.id===s.instructorId)?.name||s.instructor||''):'',cancelled:!!s.cancelled,completed:SyncInstructor.status(s)==='completed'});
    const sessions=source.map(row),bookings=[],unlinked=[],seen=new Set();
    const records=[...allBookings(),...db.members.flatMap(m=>(m.wallet.visitHistory||[]).map(b=>({...b,memberId:m.id})))];
    for(const b of records){
      const key=b.memberId+'|'+b.id;if(seen.has(key))continue;seen.add(key);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time)||!['yoga','contrast'].includes(b.service))continue;
      const slot=[b.date,b.time,b.service].join('|'),matches=bySlot.get(slot)||[];
      if(own&&!b.sessionId&&db.sessions.filter(s=>[s.date,s.time,s.service].join('|')===slot).length>1)continue;
      let s=b.sessionId?byId.get(b.sessionId):(b.cancelReason==='Session cancellation'?matches.find(s=>s.cancelled):matches.find(s=>!s.cancelled))||matches[0];
      if(!s&&own)continue;
      if(!s){const id=b.sessionId||'history:'+b.service+'|'+b.date+'|'+b.time;s={id,date:b.date,time:b.time,service:b.service,title:b.title,instructorId:null,instructorName:'',cancelled:b.cancelReason==='Session cancellation',completed:false};byId.set(id,s);bySlot.set(slot,[...(bySlot.get(slot)||[]),s]);sessions.push(row(s))}
      const m=db.members.find(m=>m.id===b.memberId);if(!m)continue;
      const attendance=(m.wallet.attendance||[]).find(a=>(a.bookingId||a.id)===b.id);
      bookings.push({id:b.id,sessionId:s.id,memberId:m.id,memberName:m.name,memberNumber:'SYNC 0000 '+String(2088+db.members.indexOf(m)),date:b.date,time:b.time,service:b.service,cancelled:b.status==='cancelled',checked:bookingChecked(b),checkedInAt:b.checkedInAt||attendance?.checkedInAt||null});
    }
    if(!own)for(const m of db.members)for(const a of m.wallet.attendance||[]){const key=m.id+'|'+(a.bookingId||a.id);if(!seen.has(key)){seen.add(key);unlinked.push({date:a.date,service:a.service})}}
    return {sessions,bookings,unlinked};
  }
  const attendanceReports=SyncAttendanceReports.create({
    scope:()=>staff()||isInstructor()?access.role+':'+access.email:null,isInstructor,data:attendanceData,
    services:()=>instructorProfile()?.services||[],instructors:()=>staff()?instructorProfiles().map(p=>({id:p.id,name:p.name})):[],
    render:()=>render(),modal,toast,icon:()=>staffIcon('reports')
  });
  const instructorWorkspace=SyncInstructor.create({
    isInstructor,profile:()=>instructorProfile(),icon:id=>staffIcon(id),render:()=>render(),toast,modal,closeModal:()=>$('#modal').close(),reports:attendanceReports.page,attendanceSummary:attendanceReports.compact,
    sessions:()=>isInstructor()?db.sessions.filter(s=>s.instructorId===instructorProfile().id&&instructorProfile().services.includes(s.service)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).map(sessionView):[],
    session:id=>sessionView(assignedSession(id)),roster:instructorRoster,
    scannerPage(s){const back=`<a class="instructor-back" href="#instructor-session/${encodeURIComponent(s.id)}" data-instructor-nav>← ${t('Back to session')}</a>`;return back+(canInstructorScan()?instructorScanner.page():`<section class="instructor-empty"><h2>${t('This session is unavailable.')}</h2><p>${t(s.date!==addDays(0)?'Check-in opens on the session date.':'Attendance changes for a completed session are handled by reception.')}</p></section>`)},
    prepare(id,key,value){const write=instructorWrite(id);if(write.error)return {ok:false,error:write.error};const s=write.session;if(SyncInstructor.status(s)!=='scheduled')return {ok:false,error:'This session can no longer be changed.'};if(typeof value!=='boolean'||!SyncInstructor.preparation(s.service).some(([k])=>k===key))return {ok:false,error:'This session can no longer be changed.'};const d=delivery(s);if(d.preparation[key]!==value){d.preparation[key]=value;d.preparedBy=instructorProfile().id;d.updatedAt=new Date().toISOString();audit('Session preparation',null,s.title+' · '+key+' · '+value)}return {ok:true}},
    transition(id,action){const write=instructorWrite(id);if(write.error)return {ok:false,error:write.error};const s=write.session,phase=SyncInstructor.status(s);if(s.cancelled)return {ok:false,error:'This session can no longer be changed.'};if(action==='start'){if(s.date!==addDays(0))return {ok:false,error:'Begin on the session date.'};if(db.sessions.some(other=>other.id!==s.id&&other.instructorId===instructorProfile().id&&SyncInstructor.status(other)==='in_progress'))return {ok:false,error:'Complete your current session before beginning another.'};if(phase!=='scheduled')return {ok:false,error:'This session can no longer be changed.'};if(!SyncInstructor.preparation(s.service).every(([key])=>s.delivery?.preparation?.[key]))return {ok:false,error:'Complete all preparation items first.'};Object.assign(delivery(s),{status:'in_progress',startedAt:new Date().toISOString(),startedBy:instructorProfile().id});audit('Session started',null,s.title)}else if(action==='complete'){if(s.date>addDays(0))return {ok:false,error:'Begin on the session date.'};if(phase!=='in_progress')return {ok:false,error:'This session is not in progress.'};Object.assign(delivery(s),{status:'completed',completedAt:new Date().toISOString(),completedBy:instructorProfile().id});audit('Session completed',null,s.title)}else return {ok:false,error:'This session can no longer be changed.'};return {ok:true}},
    handover(id,value){const write=instructorWrite(id);if(write.error)return {ok:false,error:write.error};const text=String(value||'').trim();if(text.length<3||text.length>1000)return {ok:false,error:'Write a handover using 3 to 1,000 characters.'};const s=write.session;delivery(s).handovers.push({id:crypto.randomUUID(),text,at:new Date().toISOString(),authorId:instructorProfile().id,authorName:instructorProfile().name});audit('Session handover',null,s.title);return {ok:true}},
    checkin(sessionId,bookingId){return confirmCheckin(bookingId,undefined,sessionId)}
  });
  const staffTools=SyncStaffTools.create({
    isAdmin:manager,isStaff:()=>!!staff(),modal,toast,render:()=>render(),close:()=>$('#modal').close(),
    scheduleDate:()=>staffDate>=addDays(0)&&staffDate<=addDays(30)?staffDate:addDays(1),
    bookingContext:id=>staff()?sessionView(db.sessions.find(s=>s.id===id)):null,
    members:()=>staff()?db.members.map(m=>({id:m.id,name:m.name,email:m.email})):[],
    sessions:(date,service)=>staff()?db.sessions.filter(s=>s.date===date&&s.service===service).map(s=>({...sessionView(s),spaces:Math.max(0,s.capacity-bookingsFor(s).filter(b=>!bookingCancelled(b)).length)})):[],
    passes:(memberId,sessionId)=>{if(!staff())return [];const m=db.members.find(m=>m.id===memberId),s=db.sessions.find(s=>s.id===sessionId);return m&&s?clone(m.wallet.packages.filter(p=>p.service===s.service&&p.remaining>0&&p.expiry>=s.date).sort((a,b)=>a.expiry.localeCompare(b.expiry))):[]},
    async createAccount(values,stillOpen){
      loadLatest();if(!manager())return {error:'Owner access required.'};
      const actorEmail=access.email,name=String(values.name||'').trim(),email=String(values.email||'').trim().toLowerCase(),phone=String(values.phone||'').trim(),role=values.role,password=values.password;
      if(!['admin','frontdesk','instructor','member'].includes(role))return {error:'Choose a valid account role.'};
      if(!name||name.length>60)return {error:'Enter a name between 1 and 60 characters.'};
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>100)return {error:'Enter a valid email address.'};
      if(phone&&(!/^[+()0-9\s.-]{6,30}$/.test(phone)||phone.replace(/\D/g,'').length<6))return {error:'Enter a valid phone number.'};
      if(typeof password!=='string'||password.length<8||password.length>100)return {error:'Use a password with 8 to 100 characters.'};
      const services=[...new Set(values.services||[])];if(role==='instructor'&&(!services.length||services.some(s=>!['yoga','contrast'].includes(s))))return {error:'Choose at least one Instructor specialization.'};
      if(accountFor(email))return {error:'This email is already in use.'};
      const demoCredential=await passwordCredential(password);
      loadLatest();if(!manager()||access.email!==actorEmail||stillOpen&&!stillOpen())return {error:'Your account changed. Please try again.'};
      if(accountFor(email))return {error:'This email is already in use.'};
      const id=crypto.randomUUID(),record={id,name,email,phone,createdAt:new Date().toISOString(),createdBy:actorEmail,demoCredential};
      const before=clone(db);
      try{if(role==='member')db.members.push({...record,wallet:emptyWallet(name)});else db.accounts.push({...record,role,...(role==='instructor'?{services}:{})});audit('Account creation',role==='member'?id:null,name+' · '+role+' · '+email)}catch{db=before;return {error:'Unable to save changes. Please try again.'}}
      return {ok:true,id,role};
    },
    book(values){
      loadLatest();if(!staff())return {error:'Staff access required.'};
      const m=db.members.find(m=>m.id===values.memberId),s=db.sessions.find(s=>s.id===values.sessionId);
      if(!m)return {error:'Choose a member.'};
      if(!s||s.cancelled||SyncInstructor.status(s)!=='scheduled'||s.date<addDays(0)||s.date>addDays(30)||sessionStart(s.date,s.time)<=Date.now())return {error:'This booking is no longer available. Please choose another session.'};
      if(bookingsFor(s).filter(b=>!bookingCancelled(b)).length>=s.capacity)return {error:'This session is fully booked.'};
      if(allBookings().some(b=>b.memberId===m.id&&!bookingCancelled(b)&&Math.abs(sessionStart(b.date,b.time)-sessionStart(s.date,s.time))<3600000))return {error:'This session overlaps with another booking.'};
      const p=m.wallet.packages.find(p=>p.id===values.passId&&p.service===s.service&&p.remaining>0&&p.expiry>=s.date);
      if(!p)return {error:'Choose a pass valid on the session date.'};
      const before=clone(db),booking={id:crypto.randomUUID(),service:s.service,title:s.title,date:s.date,time:s.time,sessionId:s.id,passId:p.id,createdAt:new Date().toISOString(),bookedBy:access.role==='admin'?'Owner / Admin':'Front desk',bookedByEmail:access.email};
      try{p.remaining--;m.wallet.bookings.push(booking);m.wallet.bookings.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));audit('Staff booking',m.id,s.title+' · '+s.date+' '+s.time);if(m.id===activeMemberId){state=clone(m.wallet);localStorage.setItem('sync-demo-v1',JSON.stringify(state))}}catch{db=before;state=clone(currentMember().wallet);try{persist()}catch{}return {error:'Unable to save changes. Please try again.'}}
      return {ok:true,memberId:m.id};
    }
  });
  // Explicit projections keep password verifiers and staff-only contact fields out of directory views.
  function directoryAccounts(){
    if(!staff())return [];
    const staffList=staffAccounts().filter(a=>manager()||a.role==='instructor').map(a=>({
      id:a.id,name:a.name,email:a.email,role:a.role,services:(a.services||[]).filter(s=>['yoga','contrast'].includes(s)),
      createdAt:a.createdAt||null,sample:!a.local,...(manager()?{phone:a.phone||'',createdBy:a.createdBy||''}:{})
    }));
    const members=db.members.map(m=>({id:m.id,name:m.name,email:m.email,role:'member',createdAt:m.createdAt||null,photo:m.photo||null,
      sample:['jamie','avery','morgan','riley'].includes(m.id),tier:memberTier(m),points:m.wallet.points,
      passes:m.wallet.packages.filter(p=>p.expiry>=addDays(0)&&p.remaining>0).reduce((n,p)=>n+p.remaining,0)}));
    return [...members,...staffList];
  }
  const peopleDirectory=SyncPeople.create({
    scope:()=>staff()?access.role+':'+access.email:null,isAdmin:manager,accounts:directoryAccounts,
    sessions:id=>staff()&&directoryAccounts().some(p=>p.role==='instructor'&&p.id===id)?db.sessions.filter(s=>s.instructorId===id).map(s=>({id:s.id,date:s.date,time:s.time,title:s.title,service:s.service,room:s.room||'',cancelled:!!s.cancelled})):[],
    scheduleDate:date=>{if(staff()&&/^\d{4}-\d{2}-\d{2}$/.test(date))staffDate=date},render:()=>render(),icon:id=>staffIcon(id)
  });
  const originalRender=render;
  const staffNav=[['overview','Today at SYNC'],['checkin','Scan check-in'],['people','People'],['schedule','Schedule & bookings'],['reports','Reports'],['orders','Orders & passes'],['points','Points & rewards'],['settings','Settings']];
  const staffNavIcons={
    overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    members:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m3 10v-2a6 6 0 0 0-2.5-4.9"/>',
    checkin:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/>',
    schedule:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
    orders:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 7h6m-6 4h6m-6 4h3"/>',
    points:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
    settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
    reports:'<path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    preview:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 14h6m-6 3h4"/>',
    logout:'<path d="M10 4H4v16h6m5-12 4 4-4 4m-6-4h10"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>'
  };
  const staffIcon=id=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${staffNavIcons[id==='people'?'members':id]||staffNavIcons.more}</svg>`;
  const staffRole=()=>t(isInstructor()?'Instructor':manager()?'Owner / Admin':'Front desk');
  const staffInitials=()=>isInstructor()?instructorProfile().name.trim().split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase():manager()?'A':'FD';
  let staffSection='overview',staffMenuTrigger=null,staffMenuReturnFocus=true,staffRouteFocus=false;
  const staffMenu=document.createElement('dialog');staffMenu.id='staff-menu';staffMenu.className='staff-menu-dialog';staffMenu.setAttribute('aria-labelledby','staff-menu-title');staffMenu.setAttribute('aria-describedby','staff-menu-description');document.body.append(staffMenu);
  const staffHeader=document.createElement('div');staffHeader.id='staff-header-account';document.querySelector('.header-right').append(staffHeader);
  const compactStaff=window.matchMedia('(max-width: 1024px)');
  function syncStaffMenuButtons(){document.querySelectorAll('[data-staff-menu="account"],[data-staff-menu="more"]').forEach(button=>button.setAttribute('aria-expanded',String(staffMenu.open&&button.dataset.staffMenu===staffMenu.dataset.kind)))}
  function finishStaffMenuClose(){if(staffMenu.open)return;document.body.classList.remove('staff-menu-open');syncStaffMenuButtons();const trigger=staffMenuTrigger;staffMenuTrigger=null;if(staffMenuReturnFocus&&trigger?.isConnected)trigger.focus({preventScroll:true});staffMenuReturnFocus=true;}
  function closeStaffMenu(restoreFocus=true){if(!staffMenu.open)return;staffMenuReturnFocus=restoreFocus;staffMenu.close();finishStaffMenuClose();}
  staffMenu.addEventListener('close',finishStaffMenuClose);
  staffMenu.addEventListener('click',event=>{if(event.target===staffMenu)closeStaffMenu()});
  compactStaff.addEventListener('change',()=>closeStaffMenu(false));
  function staffLink(id,label,section,classes=''){return `<a class="${classes} ${section===id?'selected':''}" href="#admin-${id}" data-staff-nav ${section===id?'aria-current="page"':''}><span class="staff-nav-icon">${staffIcon(id)}</span><span>${t(label)}</span></a>`}
  function staffSidebar(section){return `<aside class="staff-sidebar"><div class="staff-sidebar-heading"><span>${t('Workspace')}</span><strong>${t(manager()?'Admin workspace':'Front desk workspace')}</strong></div><nav aria-label="${t('Staff navigation')}">${staffNav.filter(([id])=>manager()||id!=='settings').map(([id,label])=>staffLink(id,label,section)).join('')}</nav><span class="staff-sidebar-location">SYNC · TAIPEI XINYI</span></aside>`}
  function staffBottomNav(section){const secondary=['reports','orders','points','settings'].includes(section);return `<nav class="staff-bottom-nav" aria-label="${t('Staff navigation')}"><div>${[['overview','Today'],['people','People'],['checkin','Scan'],['schedule','Schedule']].map(([id,label])=>staffLink(id,label,section,'staff-bottom-link '+(id==='checkin'?'staff-scan-link':''))).join('')}<button class="staff-bottom-link ${secondary?'selected':''}" data-staff-menu="more" aria-haspopup="dialog" aria-controls="staff-menu" aria-expanded="false" aria-label="${t('More navigation')}"><span class="staff-nav-icon">${staffIcon('more')}</span><span>${t('More')}</span></button></div></nav>`}
  function renderStaffHeader(active){staffHeader.innerHTML=active?`<button class="staff-account-trigger" data-staff-menu="account" aria-label="${t('Open staff account')}" aria-haspopup="dialog" aria-expanded="false" aria-controls="staff-menu"><span aria-hidden="true">${staffInitials()}</span></button>`:'';}
  function openStaffMenu(kind,trigger){
    if((!staff()&&!isInstructor())||!['more','account'].includes(kind)||(isInstructor()&&kind!=='account'))return;
    if(staffMenu.open&&staffMenu.dataset.kind===kind){closeStaffMenu();return}
    closeStaffMenu(false);staffMenuTrigger=trigger;staffMenuReturnFocus=true;staffMenu.dataset.kind=kind;
    const rows=[['reports','Reports','Read attendance trends and class reports.'],['orders','Orders & passes','Review purchases and pass balances.'],['points','Points & rewards','View activity and validate vouchers.'],...(manager()?[['settings','Settings','Manage accounts and view club policies.']]:[])];
    staffMenu.innerHTML=`<div class="staff-menu-panel"><div class="staff-menu-heading"><div><p id="staff-menu-description">${t(kind==='more'?'Club management':'Workspace')}</p><h2 id="staff-menu-title">${t(kind==='more'?'More':'Staff account')}</h2></div><button class="staff-menu-close" data-staff-menu="close" aria-label="${t('Close menu')}">${staffIcon('close')}</button></div>${kind==='more'?`<nav class="staff-more-links" aria-label="${t('More navigation')}">${rows.map(([id,label,description])=>`<a href="#admin-${id}" data-staff-nav ${staffSection===id?'aria-current="page"':''}><span class="staff-menu-icon">${staffIcon(id)}</span><span><strong>${t(label)}</strong><small>${t(description)}</small></span><span class="staff-menu-arrow" aria-hidden="true">↗</span></a>`).join('')}</nav>`:`<div class="staff-account-identity"><span class="staff-account-initials" aria-hidden="true">${staffInitials()}</span><div><strong>${staffRole()}${isInstructor()?' · '+esc(instructorProfile().name):''}</strong><span>${esc(access.email)}</span></div></div><div class="staff-account-actions">${isInstructor()?`<a class="instructor-menu-account" href="#instructor-account" data-instructor-nav><span class="staff-menu-icon">${staffIcon('members')}</span><span><strong>${t('My account')}</strong></span></a>`:`<button data-portal="member-demo"><span class="staff-menu-icon">${staffIcon('preview')}</span><span><strong>${t('Member preview')}</strong><small>${t('Open the member experience.')}</small></span><span class="staff-menu-arrow" aria-hidden="true">↗</span></button>`}<button data-portal="logout" class="staff-sign-out"><span class="staff-menu-icon">${staffIcon('logout')}</span><span><strong>${t('Sign out')}</strong></span></button></div>`}</div>`;
    staffMenu.showModal();document.body.classList.add('staff-menu-open');syncStaffMenuButtons();staffMenu.querySelector('a, [data-portal]')?.focus({preventScroll:true});
  }
  function focusStaffPage(){const heading=$('.staff-heading h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}}
  function routeTo(hash){location.hash=hash;render()}
  function begin(role,memberId='jamie',remember=false,email=null){
    if(isInstructor()||role==='instructor')instructorWorkspace.reset();
    activeMemberId=memberId;
    const account=role==='member'?{email:currentMember().email}:staffAccounts().find(a=>a.role===role&&(!email||a.email===email));if(!account)return;
    access={role,memberId,email:account.email,remember,...(role==='instructor'?{instructorId:account.instructorId}:{})};
    sessionStorage.setItem('sync-demo-access',JSON.stringify(access));if(remember)localStorage.setItem('sync-demo-access',JSON.stringify(access));else localStorage.removeItem('sync-demo-access');
    if(role!=='instructor'){state=clone(currentMember().wallet);save()}
    const preference=currentMember().preferences?.language;if(role==='member'&&preference)I18n.setLanguage(preference);
    const returnTo=sessionStorage.getItem('sync-demo-return-to');sessionStorage.removeItem('sync-demo-return-to');
    routeTo(role==='instructor'?'instructor-today':role!=='member'&&/^admin-members\/[^/]+\/visits$/.test(returnTo||'')?returnTo:role==='member'?'home':'admin-overview');
  }
  function input(label,name,type='text',extra=''){return `<label class="portal-field"><span>${t(label)}</span><input name="${name}" type="${type}" ${extra}></label>`}
  function authIcon(name){const paths={email:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',password:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',name:'<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',phone:'<path d="M6 3h4l2 5-3 2a16 16 0 0 0 5 5l2-3 5 2v4a3 3 0 0 1-3 3A18 18 0 0 1 3 6a3 3 0 0 1 3-3Z"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',hidden:'<path d="m3 3 18 18M10.6 5.1A13 13 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.1 3.8M6.2 6.2A19 19 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.8-1.5M10 10a3 3 0 0 0 4 4"/>'};return `<svg class="auth-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.email}</svg>`}
  function authInput(label,name,type,extra){return `<label class="portal-field" for="auth-${name}"><span>${t(label)}</span><span class="auth-input-wrap">${authIcon(name)}<input id="auth-${name}" name="${name}" type="${type}" ${extra}></span></label>`}
  function authPasswordIcon(visible=false){return `${authIcon(visible?'hidden':'eye')}<span class="sr-only">${t(visible?'Hide':'Show')}</span>`}
  function authPage(mode){
    const register=mode==='register',recover=mode==='forgot',verify=mode==='verify',sent=mode==='reset-sent';
    const login=!register&&!recover&&!verify&&!sent;
    const title=register?'Free to join. Yours to enjoy.':recover?'Reset your password.':verify||sent?'Check your inbox.':'Welcome back';
    const description=register?'Start with Plus membership, then grow at your own pace.':recover?'Enter your email to preview the recovery flow.':verify?'Check your email to verify your account.':sent?'This is a preview only. No email was sent.':'Sign in to your SYNC account.';
    return `<section class="auth-layout auth-forest${login?' auth-login':''}">
      <div class="auth-forest-atmosphere" aria-hidden="true"><span></span><span></span></div>
      <div class="auth-arrival"><span class="auth-kicker">SYNC · TAIPEI XINYI</span><p>${t('A little space. A better day.')}</p></div>
      <div class="auth-form-panel"><div class="auth-form-content">${login?'':`<span class="portal-demo-label">${t('Demo mode')}</span>`}<h1>${t(title)}</h1><p class="auth-description">${t(description)}</p>
      ${verify||sent?`<div class="auth-success-icon" aria-hidden="true">✓</div><p class="portal-notice">${t('This is a preview only. No email was sent.')}</p>${verify?`<button class="button auth-submit" data-portal="verify">${t('Complete demo verification')} →</button>`:''}<a class="auth-back" href="#login">${t('Back to sign in')}</a>`:`
        <form id="auth-form" data-mode="${mode}">
          ${register?authInput('Full name','name','text','required maxlength="60" autocomplete="name"'):''}
          ${authInput('Email address','email','email','required maxlength="100" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="you@example.com"')}
          ${!recover?`<div class="password-field">${authInput('Password','password','password','required minlength="8" maxlength="100" autocomplete="'+(register?'new-password':'current-password')+'" placeholder="'+t(register?'Create a demo password (8+ characters)':'Enter your password')+'"')}<button type="button" class="auth-password-toggle" data-portal="password" aria-controls="auth-password" aria-label="${t('Show password')}">${authPasswordIcon()}</button>${login?`<a class="auth-forgot" href="#forgot">${t('Forgot password?')}</a>`:''}</div>`:''}
          ${register?authInput('Phone number (optional)','phone','tel','maxlength="30" autocomplete="tel"'):''}
          ${register?`<label class="portal-checkbox"><input type="checkbox" name="terms" required><span>${t('I agree to the membership terms.')}</span></label><button class="text-button" type="button" data-portal="terms">${t('Read demo terms')} ↗</button>`:!recover?`<div class="auth-options"><label class="portal-checkbox"><input type="checkbox" name="remember"><span>${t('Keep me signed in')}</span></label></div>`:''}
          <p id="auth-error" class="form-error" role="alert"></p><button class="button auth-submit" type="submit"><span data-auth-submit-label>${t(register?'Create account':recover?'Send reset link':'SIGN IN')}</span><span class="auth-submit-spinner" aria-hidden="true"></span>${login?'<svg class="auth-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>':'<span class="auth-submit-arrow" aria-hidden="true">→</span>'}</button>
        </form>
        ${recover?`<a class="auth-back" href="#login">${t('Back to sign in')}</a>`:`<div class="auth-bottom">${t(register?'Already a member?':'New to SYNC?')} <a href="#${register?'login':'register'}">${t(register?'Sign in':'Create an account')}</a></div>`}
        ${login?`<details class="demo-options"><summary><span>${t('Try a demo account')}</span><span class="auth-demo-tag">${t('Demo')}</span></summary><div class="demo-accounts"><p>${t('Simulated access. Do not enter a real password.')}</p><p>${t('Use a sample account to fill the form, then sign in.')}</p><div class="demo-account-list" aria-label="${t('Sample accounts')}">${[['Member','jamie@sync.demo'],['Owner / Admin','admin@sync.demo'],['Front desk','frontdesk@sync.demo'],...SyncInstructor.accounts.map(p=>[p.services.length===2?'Instructor · Both services':p.services[0]==='yoga'?'Instructor · Yoga':'Instructor · Contrast Therapy',p.email])].map(([role,email])=>`<button type="button" data-portal="demo-fill" data-email="${email}"><strong>${t(role)}</strong><span>${email}</span><span aria-hidden="true">↗</span></button>`).join('')}</div><p class="demo-password">${t('Shared demo password')}: <code>${demoPassword}</code></p></div></details>`:''}
      `}</div></div></section>`;
  }
  function statusBadge(status){return `<span class="staff-status ${status==='Checked in'?'checked':''}">${t(status)}</span>`}
  function table(heads,rows){return `<div class="staff-table-scroll"><table class="staff-table"><thead><tr>${heads.map(h=>`<th>${t(h)}</th>`).join('')}</tr></thead><tbody>${rows||`<tr><td colspan="${heads.length}" class="empty">${t('No bookings for this date.')}</td></tr>`}</tbody></table></div>`}
  function bookingRows(list){return list.map(b=>{const m=db.members.find(m=>m.id===b.memberId),checked=bookingChecked(b);return `<tr><td><strong>${esc(m?.name||'Member')}</strong><small>${esc(m?.email||'')}</small></td><td>${esc(t(b.title))}</td><td>${b.time}</td><td>${statusBadge(checked?'Checked in':'Booked')}</td><td>${checked?'—':`<button class="staff-small-button" data-portal="checkin" data-id="${b.id}" ${b.date!==addDays(0)?'disabled':''}>${t('Check in')}</button>`}</td></tr>`}).join('')}
  function arrivalCard(list){
    const pending=list.filter(b=>!bookingChecked(b)).length,status=pending?'pending':list.length?'complete':'empty';
    const title=status==='pending'?'Welcome your next arrival':status==='complete'?'All check-ins complete':'Ready for arrivals';
    const description=status==='pending'?'Scan a member’s code to review and confirm check-in.':status==='complete'?'Scan a code if you need to review a member’s booking.':'No bookings today. View the schedule to plan ahead.';
    return `<section class="arrival-card" data-state="${status}" aria-labelledby="arrival-card-title"><div class="arrival-summary"><div class="arrival-count"><strong>${money(pending)}</strong><span>${t('Awaiting check-in')}</span></div><div class="arrival-copy"><h2 id="arrival-card-title">${t(title)}</h2><p>${t(description)}</p></div></div><div class="checkin-entry-actions"><a class="button arrival-scan" href="#admin-checkin" data-staff-nav>${staffIcon('checkin')}<span>${t('Scan QR code')}</span></a><a class="button light arrival-schedule" href="#admin-schedule" data-staff-nav data-portal="today-schedule" aria-label="${t('View today’s schedule')}">${staffIcon('schedule')}<span>${t('Schedule')}</span></a></div></section>`;
  }
  function staffOverviewDate(){const day=new Date(addDays(0)+'T12:00:00'),locale=I18n.language==='en'?'en-GB':'zh-TW';return day.toLocaleDateString(locale,{month:'long',day:'numeric'})+' · '+day.toLocaleDateString(locale,{weekday:'long'})}
  function overview(){const list=allBookings().filter(b=>b.date===addDays(0)&&!bookingCancelled(b));return `${arrivalCard(list)}${attendanceReports.compact()}<div class="staff-stats">${[['Today’s bookings',list.length,'sun'],['Checked in',list.filter(b=>bookingChecked(b)).length,'yoga'],['Active members',db.members.length,'gift'],['Recent package sales','NT$'+money(db.orders.reduce((n,o)=>n+o.amount,0)),'water']].map(([label,num,ic])=>`<section><span>${t(label)} ${icon(ic)}</span><strong>${num}</strong><small>${t('Local demo data · no real transactions')}</small></section>`).join('')}</div><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Today’s arrivals')}</h2><a href="#admin-schedule">${t('View schedule')} ↗</a></div>${table(['Member','Session','Time','Status','Action'],bookingRows(list))}</section><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Recent activity')}</h2></div>${auditList(5)}</section>`}
  function peoplePage(){
    const parts=location.hash.slice(1).split('/');
    if(parts[0]!=='admin-members'||!parts[1])return peopleDirectory.page(parts[0]==='admin-members'?'admin-people':location.hash.slice(1));
    let id;try{id=decodeURIComponent(parts[1])}catch{}
    const m=db.members.find(m=>m.id===id);if(m)memberFocus=m.id;
    const arrivals=m&&parts[2]==='visits'?`<section class="staff-panel account-staff-checkin"><div class="staff-panel-heading"><h2>${t('Today’s sessions')}</h2></div>${table(['Member','Session','Time','Status','Action'],bookingRows(allBookings().filter(b=>b.memberId===m.id&&b.date===addDays(0))))}</section>`:'';
    return arrivals+SyncMemberProfile.render(db,m,parts[2]||'overview',manager(),true);
  }
  function schedulePage(){return `<section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Upcoming sessions')}</h2><div class="staff-toolbar"><input type="date" id="staff-date" aria-label="${t('Date')}" value="${staffDate}"><button class="button light" data-staff-tool="book-member">${t('Book for member')}</button><button class="button" data-portal="session-new">${t('Add session')} +</button></div></div><div class="staff-session-grid">${db.sessions.filter(s=>s.date===staffDate).sort((a,b)=>a.time.localeCompare(b.time)).map(s=>`<article class="staff-session ${s.service}"><span class="staff-session-time">${s.time}</span><h3>${esc(t(s.title))}</h3><p>${bookingsFor(s).length} / ${s.capacity} · ${esc(s.room||t('Room not set'))}</p><p class="session-assignment ${s.instructorId?'':'unassigned'}">${t('Instructor')}: ${esc(instructorProfiles().find(p=>p.id===s.instructorId)?.name||s.instructor||t('Unassigned'))}${!s.instructorId?' · '+t('Unassigned'):''}</p><span class="instructor-status ${SyncInstructor.status(s)}">${t(SyncInstructor.labels[SyncInstructor.status(s)])}</span>${s.cancelled?'':`<div>${SyncInstructor.status(s)==='scheduled'&&sessionStart(s.date,s.time)>Date.now()&&s.date<=addDays(30)?`<button class="staff-book-session" data-staff-tool="book-member" data-session="${s.id}">${t('Book for member')} +</button>`:''}<button data-portal="session-edit" data-id="${s.id}">${t(manager()&&!s.instructorId?'Assign instructor':'Edit session')}</button>${SyncInstructor.status(s)==='scheduled'?`<button data-portal="session-cancel" data-id="${s.id}">${t('Cancel session')}</button>`:''}</div>`}${SyncInstructor.handovers(s).length?`<div><button data-portal="session-notes" data-id="${s.id}">${t('Handovers')} · ${SyncInstructor.handovers(s).length}</button></div>`:''}</article>`).join('')||`<p class="empty">${t('No bookings for this date.')}</p>`}</div></section><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Booking roster')}</h2></div>${table(['Member','Session','Time','Status','Action'],bookingRows(allBookings().filter(b=>b.date===staffDate)))}</section>`}
  function memberSelect(){return `<label class="portal-field"><span>${t('Member')}</span><select name="memberId">${db.members.map(m=>`<option value="${m.id}" ${m.id===memberFocus?'selected':''}>${esc(m.name)}</option>`).join('')}</select></label>`}
  function ordersPage(){return `<section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Sample orders')}</h2>${manager()?`<button class="button" data-portal="issue">${t('Issue passes')} +</button>`:''}</div>${table(['Order','Member','Amount','Date','Status'],db.orders.map(o=>`<tr><td><strong>${esc(o.id)}</strong><small>${esc(t(o.title))}</small></td><td>${esc(db.members.find(m=>m.id===o.memberId)?.name||'Member')}</td><td>NT$${money(o.amount)}</td><td>${fmt(o.date)}</td><td>${statusBadge('Paid')}</td></tr>`).join(''))}<p class="portal-notice">${t('Refunds are not implemented in this version.')}</p></section><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Pass wallet')}</h2></div>${table(['Member','Service','Passes','Expiry date'],db.members.flatMap(m=>m.wallet.packages.map(p=>`<tr><td>${esc(m.name)}</td><td>${t(p.service==='yoga'?'Yoga':'Contrast Therapy')}</td><td>${p.remaining} / ${p.total}</td><td>${fmt(p.expiry)}</td></tr>`)).join(''))}</section>`}
  function auditList(limit=30){return db.audit.length?table(['What changed','Who','When','Why'],db.audit.slice(0,limit).map(a=>`<tr><td><strong>${t(a.action)}</strong><small>${esc(db.members.find(m=>m.id===a.memberId)?.name||'SYNC')}</small></td><td>${t(a.who)}${a.actorName?`<small>${esc(a.actorName)}</small>`:''}</td><td>${new Date(a.at).toLocaleDateString(I18n.language==='en'?'en-GB':'zh-TW')} ${new Date(a.at).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</td><td>${esc(a.reason)}</td></tr>`).join('')):`<div class="empty">${t('No activity yet.')}</div>`}
  function pointsPage(){return `<div class="staff-actions-row">${manager()?`<button class="button" data-portal="adjust">${t('Adjust points')} + / −</button>`:''}<button class="button light" data-portal="voucher">${t('Validate voucher')} ↗</button></div><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Audit trail')}</h2></div>${auditList()}</section>`}
  function settingsPage(){return `${staffTools.accountsPanel()}<div class="staff-settings-grid"><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Current demo policies')}</h2><span class="badge">${t('Read-only')}</span></div>${[['Tier thresholds',`Core · ${SyncMembership.levels[1].visits} ${t('visits')} / Luxe · ${SyncMembership.levels[2].visits} ${t('visits')}`],['Pass validity','30 / 90 / 180'],['Cancellation window',t('24 hours before the session')]].map(([k,v])=>`<div class="profile-detail"><span>${t(k)}</span><strong>${v}</strong></div>`).join('')}<p class="portal-notice">${t('Policies are read-only in this mockup.')}</p></section><section class="staff-panel"><div class="staff-panel-heading"><h2>${t('Staff permissions')}</h2></div><h3>${t('Owner / Admin')}</h3><p class="subtitle">${t('Can create accounts, assign Instructors, issue passes and adjust points.')}</p><h3>${t('Front desk')}</h3><p class="subtitle">${t('Can view members, manage bookings, check in, and validate guest vouchers.')}</p><h3>${t('Instructor')}</h3><p class="subtitle">${t('Assigned sessions only.')} ${t('Your assigned sessions and participants.')}</p></section></div>`}
  function adminPage(section){return `<div class="staff-layout">${staffSidebar(section)}<div class="staff-content"><div class="staff-heading ${section==='overview'?'staff-overview-heading':section==='people'?'people-heading':''}"><div><p class="eyebrow">SYNC · XINYI</p><h1>${t(section==='people'&&location.hash.includes('/')?(location.hash.startsWith('#admin-members/')?'Member profile':'Person profile'):(section==='reports'?'Attendance reports':staffNav.find(([id])=>id===section)?.[1]||'Today at SYNC'))}</h1><p>${section==='overview'?staffOverviewDate():t(section==='people'?(manager()?'Manage everyone at SYNC.':'Find members and instructors.'):'Local demo data · no real transactions')}</p></div><span class="portal-demo-label">${t('Demo mode')}</span></div>${({overview,checkin:checkinScanner.page,people:peoplePage,schedule:schedulePage,reports:attendanceReports.page,orders:ordersPage,points:pointsPage,settings:settingsPage})[section]()}</div></div>${staffBottomNav(section)}`}
  render=function(){
    let hash=location.hash.slice(1)||(access?(isInstructor()?'instructor-today':staff()?'admin-overview':'home'):'login');
    const auth=['login','register','forgot','verify','reset-sent'].includes(hash),admin=hash.startsWith('admin-'),instructor=hash.startsWith('instructor-');
    closeStaffMenu(false);checkinScanner.beforeRender(hash);instructorScanner.beforeRender(hash);
    if(!auth&&!access){if(/^admin-members\/[^/]+\/visits$/.test(hash))sessionStorage.setItem('sync-demo-return-to',hash);location.hash='login';render();return}
    if(!auth&&isInstructor()&&!instructor){location.hash='instructor-today';render();return}
    if((admin&&!staff())||(instructor&&!isInstructor())){if(/^admin-members\/[^/]+\/visits$/.test(hash))sessionStorage.setItem('sync-demo-return-to',hash);location.hash=instructor&&staff()?'admin-overview':'login';render();return}
    if(instructor&&!/^instructor-(today|schedule|reports|account)$/.test(hash)&&!/^instructor-session\/[^/]+(?:\/scan)?$/.test(hash)){location.hash='instructor-today';render();return}
    if(auth||admin||instructor)document.body.classList.remove('overview-shell');
    document.body.classList.toggle('auth-shell',auth);document.querySelector('meta[name=theme-color]')?.setAttribute('content',auth?'#101f1b':'#eaf0ed');document.body.classList.toggle('admin-shell',admin||instructor);document.body.classList.toggle('instructor-shell',instructor&&!auth);document.body.classList.toggle('member-shell',!auth&&!admin&&!instructor);if(auth||(!admin&&!instructor))staffMenu.innerHTML='';
    const brand=document.querySelector('.brand');brand.href=instructor?'#instructor-today':'#home';
    if(auth){$('#navigation').innerHTML='';$('#app').innerHTML=authPage(hash);I18n.chrome()}
    else if(instructor){$('#navigation').innerHTML='';$('#app').innerHTML=instructorWorkspace.page(hash);I18n.chrome()}
    else if(admin){let section=hash.slice(6).split('/')[0];if(section==='members')section='people';if(!staffNav.some(([id])=>id===section)||(!manager()&&section==='settings'))section='overview';staffSection=section;$('#navigation').innerHTML='';$('#app').innerHTML=adminPage(section);I18n.chrome()}
    else originalRender();
    renderStaffHeader((admin&&staff())||(instructor&&isInstructor()));if(staffRouteFocus){staffRouteFocus=false;if((admin&&staff())||instructor)focusStaffPage()}
    document.querySelector('.avatar').title=t('Your account');document.querySelector('.avatar').textContent=state.name.trim().split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase();
    if(isMember()&&!auth&&!admin&&!instructor)memberAccount.afterRender();if(admin&&!auth&&staff())checkinScanner.afterRender();if(instructor&&!auth&&isInstructor())instructorScanner.afterRender();
  };
  function ownerOnly(){if(manager())return true;toast('Owner access required.');return false}
  function detail(id){if(!db.members.some(m=>m.id===id))return;memberFocus=id;routeTo('admin-members/'+encodeURIComponent(id)+'/overview');requestAnimationFrame(()=>$('#member-profile-title')?.focus())}
  function instructorOptions(service,id){return `<option value="">${t('Unassigned')}</option>`+instructorProfiles().filter(p=>p.services.includes(service)).map(p=>`<option value="${p.id}" ${p.id===id?'selected':''}>${esc(p.name)} · ${esc(p.email)}</option>`).join('')}
  function instructorField(s){const assigned=instructorProfiles().find(p=>p.id===s?.instructorId),service=s?.service||'yoga';return manager()?`<label class="portal-field"><span>${t('Assigned instructor')}</span><select name="instructorId" id="session-instructor">${instructorOptions(service,s?.instructorId)}</select></label><p class="instructor-assignment-note">${t('Link an Instructor account to allow access to this session.')}${s?.instructor&&!assigned?`<br>${t('Previously listed')}: ${esc(s.instructor)}`:''}</p>`:`<div class="portal-field"><span>${t('Assigned instructor')}</span><span class="instructor-readonly-field">${esc(assigned?.name||s?.instructor||t('Unassigned'))}</span></div><p class="instructor-assignment-note">${t('Only admin can assign or change an instructor.')}</p>`}
  function staffForm(kind,id){if(['adjust','issue'].includes(kind)&&!ownerOnly())return;const s=db.sessions.find(s=>s.id===id);let body='';if(kind==='adjust')body=`<p class="modal-body">${t('Add or subtract points; completed visits stay unchanged.')}</p>${memberSelect()}${input('Points change','delta','number','required step="1" min="-1000000" max="1000000" placeholder="500"')}${input('Adjustment reason','reason','text','required minlength="3" maxlength="160"')}`;
    if(kind==='issue')body=`${memberSelect()}<label class="portal-field"><span>${t('Service')}</span><select name="service"><option value="yoga">${t('Yoga')}</option><option value="contrast">${t('Contrast Therapy')}</option></select></label>${input('Quantity','quantity','number','required min="1" max="100" step="1" value="1"')}${input('Expiry date','expiry','date',`required min="${addDays(0)}" value="${addDays(30)}"`)}${input('Reason','reason','text','required minlength="3" maxlength="160"')}`;
    if(kind==='session')body=`${input('Date','date','date',`required min="${addDays(0)}" value="${s?.date||staffDate}"`)}${input('Time','time','time',`required value="${s?.time||'10:00'}"`)}<label class="portal-field"><span>${t('Service')}</span><select name="service"><option value="yoga" ${s?.service==='yoga'?'selected':''}>${t('Yoga')}</option><option value="contrast" ${s?.service==='contrast'?'selected':''}>${t('Contrast Therapy')}</option></select></label>${input('Title','title','text',`required maxlength="60" value="${esc(s?.title||'Yoga session')}"`)}${instructorField(s)}${input('Room','room','text',`maxlength="60" value="${esc(s?.room||'')}"`)}${input('Capacity','capacity','number',`required min="1" max="50" step="1" value="${s?.capacity||8}"`)}`;
    modal(kind==='adjust'?'Point adjustment':kind==='issue'?'Issue passes':s?'Edit session':'Add session',`<form id="staff-form" data-kind="${kind}" data-id="${id||''}">${body}<p class="form-error" id="staff-error" role="alert"></p><button class="button auth-submit" type="submit">${t(kind==='adjust'?'Save adjustment':kind==='issue'?'Confirm issue':'Save session')}</button></form>`);if(['adjust','issue'].includes(kind))$('#staff-form [name="memberId"]').value=memberFocus}
  document.addEventListener('change',e=>{if(e.target.matches('#staff-form [name=service]')&&manager()){const select=$('#session-instructor');if(select){const chosen=select.value;select.innerHTML=instructorOptions(e.target.value,chosen)}}if(e.target.id==='staff-date'){staffDate=e.target.value;render()}if(e.target.id==='booking-date')render()});
  document.addEventListener('click',e=>{
    const menuButton=e.target.closest('[data-staff-menu]');if(menuButton){if(menuButton.dataset.staffMenu==='close')closeStaffMenu();else openStaffMenu(menuButton.dataset.staffMenu,menuButton);return}
    const instructorLink=e.target.closest('[data-instructor-nav]');if(instructorLink&&isInstructor()&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){closeStaffMenu(false);if(instructorLink.hash===location.hash){e.preventDefault();focusStaffPage()}else staffRouteFocus=true}
    const navLink=e.target.closest('[data-staff-nav]');if(navLink&&staff()&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){closeStaffMenu(false);if(navLink.hash===location.hash){e.preventDefault();focusStaffPage();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}else staffRouteFocus=true}
    if(e.target.closest('[data-action=language]')&&isMember())commitAccount(member=>{member.preferences={...(member.preferences||{}),language:I18n.language}});const b=e.target.closest('[data-portal]');if(!b)return;if(staffMenu.contains(b))closeStaffMenu(false);const action=b.dataset.portal,id=b.dataset.id;
    if(action==='account-switch'){access=null;sessionStorage.removeItem('sync-demo-access');localStorage.removeItem('sync-demo-access');routeTo('login')}
    if(action==='demo-fill'){const form=$('#auth-form');if(form?.dataset.mode!=='login')return;form.elements.email.value=b.dataset.email;form.elements.password.value=demoPassword;$('#auth-error').textContent='';form.querySelector('[type=submit]').focus();toast('Demo account selected.')}
    if(action==='password'){const field=$('#auth-form [name="password"]');if(!field)return;field.type=field.type==='password'?'text':'password';b.innerHTML=authPasswordIcon(field.type==='text');b.setAttribute('aria-label',t(field.type==='password'?'Show password':'Hide password'))}
    if(action==='member-demo'&&staff()){$('#modal').close();begin('member')}
    if(action==='verify'){sessionStorage.removeItem('sync-demo-pending');toast('Demo verification complete.');routeTo('home')}
    if(action==='logout'){if(isInstructor())instructorWorkspace.reset();access=null;sessionStorage.removeItem('sync-demo-access');localStorage.removeItem('sync-demo-access');$('#modal').close();routeTo('login');toast('Signed out.')}
    if(action==='terms')modal('Demo membership terms',`<p class="modal-body">${t('Registration is free. This prototype does not create a real membership or accept payments.')}</p>`);
    if(!staff())return;
    if(action==='today-schedule')staffDate=addDays(0);
    if(action==='member')detail(id);if(action==='adjust'||action==='issue')staffForm(action);
    if(action.startsWith('profile-')){const record=SyncMemberProfile.recordDialog(db,db.members.find(m=>m.id===memberFocus),action.slice(8),id);if(record)modal(record.title,record.body)}
    if(action==='session-notes'){loadLatest();const s=db.sessions.find(s=>s.id===id);if(s)modal('Session handover',`<p class="modal-body">${esc(t(s.title))} · ${fmt(s.date)} · ${s.time}</p>${SyncInstructor.notes(s)}`)}
    if(action==='session-new')staffForm('session');if(action==='session-edit')staffForm('session',id);
    if(action==='checkin'){const result=confirmCheckin(id);if(!result.ok){toast(result.error);return}render();toast('Attendance recorded.')}
    if(action==='session-cancel'){const s=db.sessions.find(s=>s.id===id);if(!s||s.cancelled)return;if(SyncInstructor.status(s)!=='scheduled'){toast('A started session cannot be moved, reassigned or cancelled.');return}modal('Cancel this session?',`<p class="modal-body">${esc(t(s.title))} · ${fmt(s.date)} · ${s.time}<br>${t('Booked passes will be restored with their original expiry.')}</p><div class="modal-actions"><button class="button light" data-action="close">${t('Keep session')}</button><button class="button" data-portal="session-cancel-confirm" data-id="${id}">${t('Confirm cancellation')}</button></div>`)}
    if(action==='session-cancel-confirm'){loadLatest();const s=db.sessions.find(s=>s.id===id);if(!s||s.cancelled)return;if(SyncInstructor.status(s)!=='scheduled'){toast('A started session cannot be moved, reassigned or cancelled.');return}for(const m of db.members){const affected=m.wallet.bookings.filter(b=>b.service===s.service&&b.date===s.date&&b.time===s.time);for(const b of affected){const p=m.wallet.packages.find(p=>p.id===b.passId);if(p)p.remaining++;m.wallet.visitHistory.unshift({...b,status:'cancelled',cancelledAt:new Date().toISOString(),cancelledBy:manager()?'Owner / Admin':'Front desk',cancelReason:'Session cancellation'})}m.wallet.bookings=m.wallet.bookings.filter(b=>!affected.some(a=>a.id===b.id))}for(const b of db.sampleBookings.filter(b=>b.service===s.service&&b.date===s.date&&b.time===s.time)){const m=db.members.find(m=>m.id===b.memberId);if(m)m.wallet.visitHistory.unshift({...b,status:'cancelled',cancelledAt:new Date().toISOString(),cancelledBy:manager()?'Owner / Admin':'Front desk',cancelReason:'Session cancellation'})}db.sampleBookings=db.sampleBookings.filter(b=>!(b.service===s.service&&b.date===s.date&&b.time===s.time));s.cancelled=true;state=clone(currentMember().wallet);save();audit('Session cancellation',null,s.title);$('#modal').close();render();toast('Session cancelled and passes restored.')}
    if(action==='voucher')modal('Validate voucher',`<form id="voucher-form">${input('Voucher code','code','text','required maxlength="30" placeholder="SYNC-ABC123"')}<p class="form-error" id="voucher-error" role="alert"></p><button class="button auth-submit">${t('Look up voucher')}</button></form>`);
    if(action==='voucher-use'){const v=db.members.flatMap(m=>m.wallet.vouchers.map(v=>({...v,memberId:m.id}))).find(v=>v.code===b.dataset.code);if(!v||!v.guest||db.usedVouchers.includes(v.code)||v.expiry<addDays(0))return;db.usedVouchers.push(v.code);Object.assign(db.members.find(m=>m.id===v.memberId).wallet.vouchers.find(item=>item.code===v.code),{used:true,usedAt:new Date().toISOString()});state=clone(currentMember().wallet);save();audit('Guest voucher use',v.memberId,v.code);$('#modal').close();render();toast('Voucher marked as used.')}
  });
  document.addEventListener('submit',async e=>{const form=e.target;if(!['auth-form','staff-form','voucher-form'].includes(form.id))return;e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}const values=Object.fromEntries(new FormData(form));
    if(form.id==='auth-form'){
      if(form.dataset.busy)return;
      const mode=form.dataset.mode;
      if(mode==='forgot'){routeTo('reset-sent');return}
      const error=form.querySelector('#auth-error'),submit=form.querySelector('[type="submit"]'),submitLabel=submit.querySelector('[data-auth-submit-label]');
      error.textContent='';form.dataset.busy='true';form.setAttribute('aria-busy','true');submit.disabled=true;if(submitLabel)submitLabel.textContent=t(mode==='register'?'Creating account…':'Signing in…');
      try{
        loadLatest();const email=values.email.trim().toLowerCase();
        if(mode==='register'){
          if(!values.name.trim()){error.textContent=t('Enter your name.');return}
          if(accountFor(email)){error.textContent=t('Email already exists in this demo.');return}
          const demoCredential=await passwordCredential(values.password);
          if(!form.isConnected)return;
          // Recheck after asynchronous hashing so two submissions cannot create the same email.
          loadLatest();if(accountFor(email)){error.textContent=t('Email already exists in this demo.');return}
          const id=crypto.randomUUID();
          db.members.push({id,name:values.name.trim(),email,phone:values.phone.trim(),createdAt:new Date().toISOString(),demoCredential,wallet:emptyWallet(values.name.trim())});
          persist();begin('member',id);sessionStorage.setItem('sync-demo-pending',id);routeTo('verify');return;
        }
        const account=accountFor(email),valid=await passwordMatches(account,values.password);
        if(!form.isConnected)return;
        if(!valid){error.textContent=t('Email or password is incorrect.');return}
        loadLatest();const latestAccount=accountFor(email);if(!latestAccount||latestAccount.role!==account.role){error.textContent=t('Email or password is incorrect.');return}begin(latestAccount.role,latestAccount.memberId,!!values.remember,latestAccount.email);
      }catch{
        if(form.isConnected)error.textContent=t('Unable to sign in. Please try again.');
      }finally{
        delete form.dataset.busy;form.removeAttribute('aria-busy');submit.disabled=false;if(submitLabel)submitLabel.textContent=t(mode==='register'?'Create account':'SIGN IN');
      }
      return;
    }
    if(!staff())return;
    if(form.id==='voucher-form'){const code=values.code.trim().toUpperCase();const v=db.members.flatMap(m=>m.wallet.vouchers.map(v=>({...v,memberId:m.id}))).find(v=>v.code===code);let error=!v?'Voucher not found.':db.usedVouchers.includes(code)?'Voucher already used.':v.expiry<addDays(0)?'Voucher expired.':!v.guest?'Service rewards are booked from the member pass wallet.':null;if(error){$('#voucher-error').textContent=t(error);return}modal('Validate voucher',`<p class="modal-body">${t('Guest voucher ready to use.')}<br><strong>${esc(code)}</strong> · ${fmt(v.expiry)}</p><button class="button auth-submit" data-portal="voucher-use" data-code="${esc(code)}">${t('Confirm voucher use')}</button>`);return}
    const kind=form.dataset.kind;
    if(kind==='adjust'||kind==='issue'){if(!ownerOnly())return;const m=db.members.find(m=>m.id===values.memberId);if(!m)return;if(kind==='adjust'){const delta=Number(values.delta);if(!Number.isSafeInteger(delta)||delta===0)return;if(m.wallet.points+delta<0){$('#staff-error').textContent=t('Adjustment would make the balance negative.');return}m.wallet.points+=delta;m.wallet.activity.unshift({id:crypto.randomUUID(),kind:'adjustment',title:'Manual points adjustment',date:addDays(0),createdAt:new Date().toISOString(),points:delta,balanceAfter:m.wallet.points,reason:values.reason.trim(),actor:'Owner / Admin'});audit('Manual points adjustment',m.id,`${delta>0?'+':''}${delta} · ${values.reason.trim()}`)}else{const qty=Number(values.quantity);if(!Number.isInteger(qty)||qty<1||qty>100||values.expiry<addDays(0))return;m.wallet.packages.push({id:crypto.randomUUID(),service:values.service,remaining:qty,total:qty,expiry:values.expiry,source:'staff',createdAt:new Date().toISOString(),issuedBy:'Owner / Admin',reason:values.reason.trim()});audit('Pass issue',m.id,`${qty} · ${values.reason.trim()}`)}if(m.id===activeMemberId){state=clone(m.wallet);save()}persist();$('#modal').close();render();toast(kind==='adjust'?'Point adjustment recorded.':'Passes issued.');return}
    if(kind==='session'){
      loadLatest();const s=db.sessions.find(s=>s.id===form.dataset.id),capacity=Number(values.capacity),fail=message=>{$('#staff-error').textContent=t(message)};
      if(!['yoga','contrast'].includes(values.service)||!Number.isInteger(capacity)||capacity<1||capacity>50||!String(values.title||'').trim())return;
      if(form.dataset.id&&!s)return;if(s?.cancelled){fail('This session can no longer be changed.');return}
      const instructorId=manager()?(values.instructorId||null):(s?.instructorId||null),profile=instructorProfiles().find(p=>p.id===instructorId);
      if(instructorId&&(!profile||!profile.services.includes(values.service))){fail('Choose an instructor qualified for this service.');return}
      if(s&&SyncInstructor.status(s)!=='scheduled'&&(values.date!==s.date||values.time!==s.time||values.service!==s.service||instructorId!==(s.instructorId||null))){fail('A started session cannot be moved, reassigned or cancelled.');return}
      if(db.sessions.some(other=>other.id!==s?.id&&!other.cancelled&&other.date===values.date&&other.time===values.time&&other.service===values.service)){fail('A session already exists at this time.');return}
      if(s&&bookingsFor(s).length){if(capacity<bookingsFor(s).length){fail('Capacity cannot be lower than current bookings.');return}if(values.date!==s.date||values.time!==s.time||values.service!==s.service){fail('Cannot move a session with existing bookings.');return}}
      const start=sessionStart(values.date,values.time);
      if(instructorId&&db.sessions.some(other=>other.id!==s?.id&&!other.cancelled&&other.instructorId===instructorId&&Math.abs(sessionStart(other.date,other.time)-start)<3600000)){fail('This instructor already has an overlapping session.');return}
      const changed=!!s&&instructorId!==(s.instructorId||null),record={id:s?.id||crypto.randomUUID(),date:values.date,time:values.time,service:values.service,title:values.title.trim(),instructor:profile?.name||(s?.instructorId?'Unassigned':s?.instructor||'Unassigned'),instructorId,room:String(values.room||'').trim().slice(0,60),capacity,cancelled:false};
      if(s){if(changed&&s.delivery){s.delivery.preparation={};delete s.delivery.preparedBy}Object.assign(s,record)}else db.sessions.push(record);
      audit(changed?'Instructor assignment':s?'Session update':'Session creation',null,record.title+(profile?' · '+profile.name:''));$('#modal').close();render();toast('Session saved.');
    }

  });
  let queuedAccountRefresh=false;
  $('#modal').addEventListener('close',()=>{if(!$('#modal').open&&queuedAccountRefresh){queuedAccountRefresh=false;render()}});
  window.addEventListener('storage',event=>{
    if(event.key!==dbKey||!event.newValue)return;
    try{const next=JSON.parse(event.newValue);if(!Array.isArray(next.members)||!next.members.every(m=>validDemo(m.wallet))||!['sessions','audit','checkins','usedVouchers','sampleBookings','orders'].every(k=>Array.isArray(next[k])))return;if(!Array.isArray(next.accounts))next.accounts=[];db=next;if(isInstructor()){if($('#modal').open)$('#modal').close();render();return}const member=currentMember();if(!member)return;if(isMember()&&access.email!==member.email){access=null;sessionStorage.removeItem('sync-demo-access');localStorage.removeItem('sync-demo-access');$('#modal').close();routeTo('login');return}state=clone(member.wallet);if(!$('#modal').open)render();else {queuedAccountRefresh=true;if(isMember()&&currentModal?.title==='Your check-in code')memberAccount.refreshCheckin()}}catch{}
  });
  persist();render();
})();
