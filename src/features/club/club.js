/* HandC public information. Contact channels can be added when confirmed. */
window.SyncClub=(()=>{
  const address='Xinyi District, Taipei';
  I18n.extend({'Xinyi District, Taipei':'台北市信義區','HandC Xinyi':'HandC 信義','HandC WELLNESS CLUB · TAIPEI':'HandC WELLNESS CLUB · 台北'});
  const channels=Object.freeze({});
  function link(){return ''}
  function socials(){return ''}
  function location(){return `<div class="sync-booking-location"><div><div><strong>HandC Xinyi</strong><address>${address}</address></div></div></div>`}
  function contact(){return `<section class="sync-contact-card"><h3>Studio information</h3><address>${address}</address><p>Contact details will be announced here.</p></section>`}
  function renderFooter(){const footer=document.querySelector('#club-footer');if(!footer)return;footer.innerHTML=I18n.html(`<div class="hc-footer-wordmark"><img src="assets/logos/handc-logo.svg" alt="HandC"><span>Move. Reset. Repeat.</span></div><div class="hc-footer-meta"><span>HandC WELLNESS CLUB · TAIPEI</span><button data-action="rules">About this prototype ↗</button></div>`)}
  return Object.freeze({address,channels,link,socials,location,contact,renderFooter});
})();
