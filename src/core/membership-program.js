/* One visit-based program shared by member and staff screens. */
window.SyncMembership = (() => {
  const levels = [
    {name:'Plus',visits:0,caption:'Your everyday beginning.',highlight:'Member pass wallet',icon:'sun',benefits:['Redeem wellness rewards','Member pass wallet']},
    {name:'Core',visits:10,caption:'A deeper connection.',highlight:'Birthday yoga guest pass',icon:'gift',benefits:['All Plus benefits','Early access to selected sessions','Birthday yoga guest pass']},
    {name:'Luxe',visits:20,caption:'The fullest expression.',highlight:'Birthday Contrast Therapy reward',icon:'water',benefits:['All Core benefits','Priority booking window','Birthday Contrast Therapy reward']}
  ];
  function completed(wallet) {
    const records=[...(Array.isArray(wallet.attendance)?wallet.attendance:[]),...(wallet.bookings||[]).filter(b=>b.checkedInAt),...(Array.isArray(wallet.visitHistory)?wallet.visitHistory:[]).filter(b=>b.checkedInAt)];
    return new Set(records.filter(Boolean).map(v=>v.bookingId||v.id).filter(id=>typeof id==='string'&&id)).size;
  }
  function record(wallet,booking,at) {
    if(!Array.isArray(wallet.attendance))wallet.attendance=[];
    if(wallet.attendance.some(v=>v?.bookingId===booking.id))return;
    wallet.attendance.push({bookingId:booking.id,date:booking.date,service:booking.service,title:booking.title,checkedInAt:at||booking.checkedInAt||null});
  }
  function progress(wallet) {
    const visits=completed(wallet),index=visits>=levels[2].visits?2:visits>=levels[1].visits?1:0;
    const current=levels[index],next=levels[index+1]||null;
    return {visits,index,current,next,remaining:next?Math.max(0,next.visits-visits):0,percent:Math.min(100,visits/levels[2].visits*100)};
  }
  I18n.extend({
    'Recorded visits':'已記錄到訪','Completed visits':'已完成到訪','completed visits':'次已完成到訪','checked-in visits':'次已報到到訪','visits':'次到訪',
    'Every visit brings you closer.':'每次到訪，都更接近下一份禮遇。','Your next unlock':'下一個解鎖禮遇','Your Luxe privileges':'你的 Luxe 專屬禮遇',
    'Birthday benefit':'生日禮遇','Included with your membership':'會員專屬權益','Only completed, checked-in visits count.':'僅計算已完成報到的到訪。',
    'Purchases and point redemptions do not change your visit count.':'購買與點數兌換不影響到訪次數。',
    'Visit targets are provisional.':'到訪門檻為暫定方案。','Tier benefit preview':'會員等級禮遇預覽','View tier benefits':'查看等級禮遇',
    'Unlocked':'已解鎖','Next unlock':'下一個解鎖','Keep visiting':'持續到訪','Current tier':'目前等級',
    'See benefits':'查看禮遇','All tier benefits':'所有等級禮遇','Your rhythm, rewarded.':'持續到訪，收穫更多禮遇。',
    'You have unlocked every tier.':'你已解鎖所有會員等級。','A birthday reward to share your rhythm.':'生日禮遇，與好友分享療癒時光。',
    'A birthday reset, reserved for you.':'為你準備的生日身心重整禮遇。','Your passes and points, in one place.':'堂票與點數，一站掌握。',
    'Tier benefits are previews; birthday rewards are not issued automatically in this demo.':'此為會員禮遇預覽，示範版本不會自動發放生日獎勵。',
    'Join freely. Build your rhythm with every visit.':'免費加入，每次到訪都更接近下一個會員等級。',
    'Visit milestones and benefits are provisional. Only recorded staff check-ins count toward your tier.':'到訪門檻與禮遇為暫定方案，會員等級僅計算工作人員記錄的報到。',
    'Recorded purchase value is separate from visit-based tier progress.':'已記錄購買金額與到訪升等進度分別計算。',
    'Add or subtract points; completed visits stay unchanged.':'新增或扣除點數，不影響已完成到訪次數。',
    'Pass validity, reward costs and the 24-hour cancellation window remain provisional.':'堂票效期、兌換點數及課程前 24 小時取消規則仍為暫定方案。'
  });
  return {levels,completed,record,progress,tier:wallet=>progress(wallet).current.name};
})();
