/* Staff-only QR check-in. Camera frames and uploaded images stay in this browser. */
window.SyncCheckin = (() => {
  I18n.extend({
  "Scan check-in": "掃碼報到",
  "Scan QR code": "掃描報到碼",
  "Scan a member’s code, review their booking and confirm their arrival.": "掃描會員報到碼，核對預約後確認到館。",
  "MEMBER CHECK-IN": "會員報到",
  "Opening camera…": "正在開啟相機…",
  "Allow camera access when prompted, then hold the member’s QR code inside the frame.": "請在提示中允許相機存取，再將會員報到碼置於框內。",
  "Scanning paused": "掃描已暫停",
  "Resume scanning, upload a QR image or find the member manually.": "可繼續掃描、上傳報到碼圖片或手動查詢會員。",
  "Camera unavailable": "相機無法使用",
  "Retry the camera, upload a QR image or find the member manually.": "請重試相機、上傳報到碼圖片或手動查詢會員。",
  "Camera is off": "相機已關閉",
  "Camera is on": "相機已開啟",
  "Waiting for camera permission": "等待相機授權",
  "Live QR camera preview": "報到碼相機即時預覽",
  "QR codes are read on this device.": "報到碼僅於此裝置辨識。",
  "Retry camera": "重試相機",
  "Resume scanning": "繼續掃描",
  "Stop camera": "關閉相機",
  "Cancel camera request": "取消開啟相機",
  "Upload QR image": "上傳報到碼圖片",
  "Camera": "相機",
  "Ready for the next arrival": "準備迎接下一位會員",
  "Scan a code or look up a member to review today’s bookings.": "掃描報到碼或查詢會員，核對今天的預約。",
  "Find member": "查詢會員",
  "Review booking": "核對預約",
  "Confirm check-in": "確認報到",
  "Member found": "已找到會員",
  "Already checked in": "已完成報到",
  "No booking today": "今天尚無預約",
  "Ask the member to book a session, or check the schedule before checking in.": "請會員先預約課程，或查閱課表後再操作報到。",
  "Scan next member": "掃描下一位會員",
  "View member profile": "查看會員資料",
  "Find a member manually": "手動查詢會員",
  "Use a member number, email or pasted SYNC QR link.": "輸入會員編號、電子郵件，或貼上 SYNC 報到碼連結。",
  "Member number or email": "會員編號或電子郵件",
  "Check-in review": "報到核對",
  "Demo check-in uses bookings saved in this browser. Bookings do not sync between devices.": "示範報到使用此瀏覽器儲存的預約，資料不會在不同裝置間同步。",
  "Use a SYNC member QR code, member number or email address.": "請使用 SYNC 會員報到碼、會員編號或電子郵件。",
  "Member not found in this demo. Check the number or use the same browser as the booking.": "此示範資料中找不到會員，請核對編號，或使用儲存預約的同一個瀏覽器。",
  "Member found. Review today’s booking before confirming check-in.": "已找到會員，請核對今日預約後再確認報到。",
  "Camera access was not allowed. Allow it in your browser, or use an image or manual lookup.": "尚未允許相機存取，請於瀏覽器授權，或改用圖片及手動查詢。",
  "No camera found. Upload a QR image or find the member manually.": "找不到相機，請上傳報到碼圖片或手動查詢會員。",
  "The camera is unavailable or in use. Close other camera apps and try again.": "相機無法使用或正由其他程式使用，請關閉其他相機程式後重試。",
  "This camera could not be opened. Try another camera or manual lookup.": "無法開啟此相機，請嘗試其他相機或手動查詢。",
  "The camera could not start. Try again, upload an image or use manual lookup.": "無法啟動相機，請重試、上傳圖片或改用手動查詢。",
  "The camera image could not be read. Try an uploaded image or manual lookup.": "無法辨識相機畫面，請上傳圖片或改用手動查詢。",
  "Camera scanning needs a secure browser connection. Use image upload or manual lookup.": "相機掃描需要安全的瀏覽器連線，請改用圖片上傳或手動查詢。",
  "Allow camera access in your browser to begin scanning.": "請在瀏覽器允許相機存取，以開始掃描。",
  "Hold the member’s QR code steady inside the frame.": "請將會員報到碼穩定置於框內。",
  "Camera disconnected. Start again or use manual lookup.": "相機已中斷，請重新開啟或改用手動查詢。",
  "Choose a JPG, PNG or WebP QR image smaller than 10 MB.": "請選擇小於 10 MB 的 JPG、PNG 或 WebP 報到碼圖片。",
  "Reading QR image…": "正在辨識報到碼圖片…",
  "No QR code found. Choose a clearer image or use manual lookup.": "找不到報到碼，請選擇較清晰的圖片或手動查詢。",
  "This image could not be read. Choose another image or use manual lookup.": "無法讀取此圖片，請選擇其他圖片或手動查詢。",
  "Camera stopped. You can scan again or find a member manually.": "相機已關閉，可重新掃描或手動查詢會員。",
  "Check-in confirmed. Attendance and member visit progress are updated.": "報到已確認，出席紀錄與會員到訪進度已更新。",
  "Camera paused while this page is hidden. Start it again when you return.": "頁面隱藏時相機會暫停，返回後請重新開啟。",
  "Staff access required.": "需要工作人員權限。",
  "This booking is no longer available. Check today’s schedule.": "此預約已無法報到，請查閱今日課表。",
  "This booking is already checked in.": "此預約已完成報到。"
});
  const t=I18n.translate,e=escapeHTML;
  const scanIcon='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/></svg>';
  const cameraIcon='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 5 2-2h4l2 2h4v15H4V5h4Z"/><circle cx="12" cy="12" r="4"/></svg>';
  function parse(value){
    const raw=String(value||'').trim();if(!raw||raw.length>1024)return null;
    if(/^https?:\/\//i.test(raw)){
      try{const url=new URL(raw),allowed=new Set([location.origin,'https://sync-wellness.vercel.app']);if(!allowed.has(url.origin)||url.username||url.password||url.search||url.pathname!==location.pathname)return null;const match=url.hash.match(/^#admin-members\/([^/]+)\/visits$/);if(!match)return null;const id=decodeURIComponent(match[1]);return /^[A-Za-z0-9_-]{1,100}$/.test(id)?{type:'id',value:id}:null}catch{return null}
    }
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)&&raw.length<=100)return {type:'email',value:raw.toLowerCase()};
    const number=raw.replace(/^SYNC\s*/i,'').replace(/[\s-]/g,'');return /^\d{4,16}$/.test(number)?{type:'number',value:number}:null;
  }
  function create(api){
    let memberId=null,error='',notice='',manual='',stream=null,timer=null,version=0,mountVersion=0,phase='off',devices=[],selectedDevice='',uploadBusy=false,activePage=false,autoPending=false,retryAvailable=false,cameraFailed=false;
    const onPage=()=>api.isStaff()&&(api.onPage?api.onPage():location.hash==='#admin-checkin');
    const member=()=>memberId?api.member(memberId):null;
    const cameraStatus=()=>phase==='starting'?'Waiting for camera permission':phase==='live'?'Camera is on':autoPending?'Opening camera…':'Camera is off';
    function detach(){mountVersion++;clearTimeout(timer);timer=null;const video=$('#checkin-video');if(video){video.pause();video.srcObject=null}}
    function release(){version++;detach();if(stream){for(const track of stream.getTracks())track.stop();stream=null}phase='off';uploadBusy=false;}
    function status(message,isError=false){error=isError?message:'';notice=isError?'':message;const target=$('#checkin-feedback');if(target){target.textContent=t(message);target.classList.toggle('error',isError);target.setAttribute('role',isError?'alert':'status')}controls()}
    function controls(){
      if(!onPage())return;
      const waiting=phase==='starting'||autoPending,panel=$('.checkin-camera');
      if(panel){panel.classList.toggle('is-live',phase==='live');panel.classList.toggle('is-starting',waiting);panel.setAttribute('aria-busy',String(waiting||uploadBusy))}
      const video=$('#checkin-video');if(video)video.setAttribute('aria-hidden',String(phase!=='live'));
      const state=$('#checkin-camera-status');if(state)state.textContent=t(cameraStatus());
      const title=$('#checkin-idle-title'),description=$('#checkin-idle-message');
      if(title)title.textContent=t(waiting?'Opening camera…':cameraFailed?'Camera unavailable':'Scanning paused');
      if(description)description.textContent=t(waiting?'Allow camera access when prompted, then hold the member’s QR code inside the frame.':cameraFailed?'Retry the camera, upload a QR image or find the member manually.':'Resume scanning, upload a QR image or find the member manually.');
      const resume=$('[data-scan=resume]'),stop=$('[data-scan=stop]');
      if(resume){resume.hidden=phase!=='off'||!retryAvailable||autoPending||!!memberId;resume.disabled=uploadBusy;resume.querySelector('span').textContent=t(cameraFailed?'Retry camera':'Resume scanning')}
      if(stop){stop.hidden=phase==='off'&&!autoPending;stop.textContent=t(waiting?'Cancel camera request':'Stop camera')}
      const select=$('#checkin-camera-select');if(select){select.closest('label').hidden=devices.length<2;select.innerHTML=devices.map((d,i)=>`<option value="${e(d.deviceId)}" ${d.deviceId===selectedDevice?'selected':''}>${e(d.label||t('Camera')+' '+(i+1))}</option>`).join('');select.disabled=waiting||uploadBusy}
      const input=$('#checkin-image');if(input)input.disabled=uploadBusy;
    }
    function result(){
      const m=member();if(!m)return `<div class="checkin-awaiting"><span>${scanIcon}</span><h2>${t('Ready for the next arrival')}</h2><p>${t('Scan a code or look up a member to review today’s bookings.')}</p><div class="checkin-steps"><span><b>1</b>${t('Find member')}</span><span><b>2</b>${t('Review booking')}</span><span><b>3</b>${t('Confirm check-in')}</span></div></div>`;
      const bookings=api.bookings(m.id),initials=m.name.trim().split(/\s+/).map(s=>s[0]).slice(0,2).join('').toUpperCase();
      return `<div class="checkin-member-heading"><span class="checkin-match">✓ ${t('Member found')}</span><div class="checkin-person"><span class="checkin-avatar">${e(initials)}</span><div><h2>${e(m.name)}</h2><span>${e(m.number)}</span><small>${m.email?e(m.email):''}</small></div>${m.tier?`<span class="staff-tier ${e(m.tier.toLowerCase())}">${e(m.tier)}</span>`:''}</div></div><div class="checkin-booking-heading"><h3>${t('Today’s bookings')}</h3><span>${t(fmt(addDays(0)))}</span></div>${bookings.length?`<div class="checkin-bookings">${bookings.map(b=>`<article><div class="checkin-session-top"><span class="checkin-time">${e(b.time)}</span><span class="checkin-booking-status ${b.checked?'confirmed':''}">${t(b.checked?'Already checked in':'Awaiting check-in')}</span></div><h3>${e(t(b.title))}</h3><p>${t(b.service==='yoga'?'Yoga':'Contrast Therapy')}</p>${b.checked?`<div class="checkin-confirmed">✓ ${t('Attendance recorded.')}</div>`:`<button class="button checkin-confirm-button" data-scan="confirm" data-id="${e(b.id)}" data-member="${e(m.id)}">${t('Confirm check-in')} <span aria-hidden="true">✓</span></button>`}</article>`).join('')}</div>`:`<div class="checkin-no-booking"><span>${icon('sun')}</span><h3>${t('No booking today')}</h3><p>${t('Ask the member to book a session, or check the schedule before checking in.')}</p><a href="#admin-schedule">${t('View schedule')} ↗</a></div>`}<div class="checkin-result-actions"><button class="button light" data-scan="next">${scanIcon}${t('Scan next member')}</button>${api.profileLink?`<a href="${e(api.profileLink().href)}">${t(api.profileLink().label)} →</a>`:`<a href="#admin-members/${encodeURIComponent(m.id)}/visits">${t('View member profile')} ↗</a>`}</div>`;
    }
    function updateResult(){const target=$('#checkin-result');if(target)target.innerHTML=result();}
    function focusResult(){const target=$('#checkin-result');if(!target)return;target.focus({preventScroll:true});if(window.matchMedia('(max-width: 1100px)').matches)target.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
    function lookup(raw){
      if(!onPage())return;autoPending=false;retryAvailable=true;cameraFailed=false;release();memberId=null;const code=parse(raw);if(!code){updateResult();status('Use a SYNC member QR code, member number or email address.',true);return}
      const found=api.find(code);if(!found){updateResult();status(api.notFound||'Member not found in this demo. Check the number or use the same browser as the booking.',true);return}
      memberId=found.id;updateResult();status('Member found. Review today’s booking before confirming check-in.');
      focusResult();
    }
    function page(){
      if(!api.isStaff())return '';
      return `<div class="checkin-page"><p class="checkin-intro">${t(api.intro||'Scan a member’s code, review their booking and confirm their arrival.')}</p><div class="checkin-layout"><section class="checkin-input-panel"><div class="checkin-camera" aria-busy="false"><div class="checkin-camera-top"><span>${scanIcon}<span>${t('MEMBER CHECK-IN')}</span></span><span id="checkin-camera-status" role="status">${t('Camera is off')}</span></div><video id="checkin-video" autoplay muted playsinline aria-hidden="true" aria-label="${t('Live QR camera preview')}"></video><div class="checkin-idle"><span>${cameraIcon}</span><h2 id="checkin-idle-title">${t('Opening camera…')}</h2><p id="checkin-idle-message">${t('Allow camera access when prompted, then hold the member’s QR code inside the frame.')}</p></div><div class="checkin-viewfinder" aria-hidden="true"><i></i><i></i><i></i><i></i><span></span></div><div class="checkin-camera-footer"><span>${t('QR codes are read on this device.')}</span></div></div><div class="checkin-camera-controls"><button class="button" data-scan="resume" hidden>${cameraIcon}<span>${t('Resume scanning')}</span></button><button class="button light" data-scan="stop" hidden>${t('Stop camera')}</button><label class="checkin-upload">${scanIcon}<span>${t('Upload QR image')}</span><input id="checkin-image" type="file" accept="image/jpeg,image/png,image/webp" aria-label="${t('Upload QR image')}"></label></div><label class="checkin-camera-picker" hidden><span>${t('Camera')}</span><select id="checkin-camera-select" aria-label="${t('Camera')}"></select></label><p id="checkin-feedback" class="checkin-feedback ${error?'error':''}" role="${error?'alert':'status'}" aria-live="polite">${t(error||notice)}</p><canvas id="checkin-canvas" hidden></canvas><div class="checkin-manual"><div><h2>${t('Find a member manually')}</h2><p>${t('Use a member number, email or pasted SYNC QR link.')}</p></div><form id="checkin-lookup-form"><label><span>${t('Member number or email')}</span><input name="member" id="checkin-member-input" value="${e(manual)}" type="text" required maxlength="1024" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="SYNC 0000 2088"></label><button class="button light" type="submit">${t('Find member')} ↗</button></form></div><p class="checkin-demo-note">${t('Demo check-in uses bookings saved in this browser. Bookings do not sync between devices.')}</p></section><section id="checkin-result" class="checkin-result" tabindex="-1" aria-label="${t('Check-in review')}" aria-live="polite">${result()}</section></div></div>`;
    }
    function errorMessage(reason){return ({NotAllowedError:'Camera access was not allowed. Allow it in your browser, or use an image or manual lookup.',SecurityError:'Camera access was not allowed. Allow it in your browser, or use an image or manual lookup.',NotFoundError:'No camera found. Upload a QR image or find the member manually.',NotReadableError:'The camera is unavailable or in use. Close other camera apps and try again.',OverconstrainedError:'This camera could not be opened. Try another camera or manual lookup.'})[reason?.name]||'The camera could not start. Try again, upload an image or use manual lookup.'}
    function frame(run){
      if(run!==version||!onPage()||phase!=='live')return;
      const video=$('#checkin-video'),canvas=$('#checkin-canvas');
      if(video?.readyState>=2&&video.videoWidth&&video.videoHeight&&canvas){
        try{const scale=Math.min(1,960/Math.max(video.videoWidth,video.videoHeight));canvas.width=Math.max(1,Math.round(video.videoWidth*scale));canvas.height=Math.max(1,Math.round(video.videoHeight*scale));const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(video,0,0,canvas.width,canvas.height);const image=ctx.getImageData(0,0,canvas.width,canvas.height),code=jsQR(image.data,image.width,image.height,{inversionAttempts:'attemptBoth'});if(code?.data){lookup(code.data);return}}catch{cameraFailed=true;release();controls();status('The camera image could not be read. Try an uploaded image or manual lookup.',true);return}
      }
      timer=setTimeout(()=>frame(run),180);
    }
    // A language/storage refresh replaces the video element, not the camera session.
    async function attach(run){
      const video=$('#checkin-video');if(!video||!stream||!onPage())return;
      const mount=++mountVersion;clearTimeout(timer);timer=null;
      try{video.srcObject=stream;video.muted=true;await video.play();
        if(run!==version||mount!==mountVersion||!onPage())return;
        phase='live';controls();status('Hold the member’s QR code steady inside the frame.');frame(run);
      }catch(reason){if(run!==version||mount!==mountVersion)return;cameraFailed=true;release();status(errorMessage(reason),true)}
    }
    async function start(deviceId=''){
      if(!onPage()||document.hidden||phase==='starting')return;
      autoPending=false;retryAvailable=true;cameraFailed=false;release();memberId=null;error='';notice='';manual='';const input=$('#checkin-member-input');if(input)input.value='';updateResult();
      if(window.isSecureContext===false||!navigator.mediaDevices?.getUserMedia){cameraFailed=true;controls();status('Camera scanning needs a secure browser connection. Use image upload or manual lookup.',true);return}
      phase='starting';controls();status('Allow camera access in your browser to begin scanning.');const run=version;
      try{
        const received=await navigator.mediaDevices.getUserMedia({audio:false,video:deviceId?{deviceId:{exact:deviceId},width:{ideal:1280},height:{ideal:720}}:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});
        if(run!==version||!onPage()){received.getTracks().forEach(track=>track.stop());return}
        stream=received;selectedDevice=received.getVideoTracks()[0]?.getSettings?.().deviceId||deviceId;
        for(const track of received.getVideoTracks())track.addEventListener?.('ended',()=>{if(run===version&&phase==='live'){cameraFailed=true;release();controls();status('Camera disconnected. Start again or use manual lookup.',true)}},{once:true});
        if(navigator.mediaDevices.enumerateDevices)navigator.mediaDevices.enumerateDevices().then(list=>{if(run===version&&onPage()){devices=list.filter(d=>d.kind==='videoinput');controls()}}).catch(()=>{});
        await attach(run);
      }catch(reason){if(run!==version)return;cameraFailed=true;release();controls();status(errorMessage(reason),true)}
    }
    async function upload(file){
      if(!onPage()||!file)return;
      autoPending=false;retryAvailable=true;cameraFailed=false;release();memberId=null;updateResult();
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){controls();status('Choose a JPG, PNG or WebP QR image smaller than 10 MB.',true);return}
      uploadBusy=true;controls();status('Reading QR image…');const run=version,source=URL.createObjectURL(file);
      try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=source});if(run!==version||!onPage())return;const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight)),canvas=$('#checkin-canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,canvas.width,canvas.height);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),code=jsQR(pixels.data,pixels.width,pixels.height,{inversionAttempts:'attemptBoth'});if(!code?.data){status('No QR code found. Choose a clearer image or use manual lookup.',true);return}lookup(code.data)}catch{if(run===version&&onPage())status('This image could not be read. Choose another image or use manual lookup.',true)}finally{URL.revokeObjectURL(source);if(run===version){uploadBusy=false;controls()}}
    }
    function beforeRender(nextHash){
      if(!(api.onPage?api.onPage(nextHash):nextHash==='admin-checkin')||!api.isStaff()){
        release();activePage=false;autoPending=false;retryAvailable=false;cameraFailed=false;memberId=null;error='';notice='';manual='';devices=[];selectedDevice='';return;
      }
      if(!activePage){release();activePage=true;autoPending=true;retryAvailable=false}
      else detach();
    }
    function autoStart(){
      const run=version;
      queueMicrotask(()=>{if(run===version&&activePage&&autoPending&&onPage()&&!document.hidden)start()});
    }
    function afterRender(){
      if(!activePage||!onPage())return;
      controls();if(stream)attach(version);else if(autoPending)autoStart();
    }
    document.addEventListener('click',event=>{const button=event.target.closest('[data-scan]');if(!button||!onPage())return;const action=button.dataset.scan;if(action==='resume')start();if(action==='stop'){autoPending=false;retryAvailable=true;release();status('Camera stopped. You can scan again or find a member manually.')}if(action==='next'){manual='';memberId=null;error='';notice='';updateResult();start()}if(action==='confirm'){
      if(!memberId||button.dataset.member!==memberId)return;
      const outcome=api.confirm(button.dataset.id,memberId);if(!outcome.ok){updateResult();status(outcome.error,true);return}updateResult();status('Check-in confirmed. Attendance and member visit progress are updated.');focusResult();
    }});
    document.addEventListener('submit',event=>{if(event.target.id!=='checkin-lookup-form'||!onPage())return;event.preventDefault();if(!event.target.checkValidity()){event.target.reportValidity();return}manual=event.target.elements.member.value;lookup(manual)});
    document.addEventListener('input',event=>{if(event.target.id!=='checkin-member-input'||!onPage())return;manual=event.target.value;if(memberId){memberId=null;updateResult();status('')}});
    document.addEventListener('change',event=>{if(!onPage())return;if(event.target.id==='checkin-image'){const file=event.target.files?.[0];event.target.value='';upload(file)}if(event.target.id==='checkin-camera-select'){selectedDevice=event.target.value;start(selectedDevice)}});
    document.addEventListener('visibilitychange',()=>{if(!onPage())return;if(document.hidden&&(stream||phase==='starting')){autoPending=false;retryAvailable=true;release();status('Camera paused while this page is hidden. Start it again when you return.')}else if(!document.hidden){controls();if(autoPending)autoStart()}});
    window.addEventListener('pagehide',()=>{autoPending=false;retryAvailable=true;release();controls()});
    window.addEventListener('pageshow',()=>{if(onPage()){controls();if(autoPending)autoStart()}});
    return {page,beforeRender,afterRender};
  }
  return {create};
})();
