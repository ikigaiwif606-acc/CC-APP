/* Shared public club information. External links never include member data. */
window.SyncClub = (() => {
  const address='1F., No. 29, Alley 11, Lane 473, Guangfu South Road, Xinyi District, Taipei City 110, Taiwan';
  const channels=Object.freeze({
    instagram:'https://www.instagram.com/sync.wellnessclub/',
    threads:'https://www.threads.com/@sync.wellnessclub',
    youtube:'https://www.youtube.com/@syncwellnessclub',
    line:'https://line.me/R/ti/p/@615myvqv',
    maps:'https://maps.app.goo.gl/obeoizU8LeKT3ig97'
  });
  I18n.extend({
    'Follow SYNC':'追蹤 SYNC',
    'Visit & contact SYNC':'到訪與聯絡 SYNC',
    'Visit SYNC Xinyi':'到訪 SYNC 信義會館',
    'Get directions':'路線指引',
    'Chat on LINE':'LINE 聯絡我們',
    'Contact SYNC on LINE':'透過 LINE 聯絡 SYNC',
    'For booking or visit questions, chat with our team.':'如有預約或到訪問題，歡迎透過 LINE 聯絡我們。',
    'For help with this booking, contact our team.':'如需此預約的相關協助，請聯絡我們。',
    'Opens in a new tab':'另開分頁',
    [address]:'台北市信義區光復南路473巷11弄29號1樓'
  });
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths={
    instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/>',
    threads:'<path d="M19 7c-1-3-4-4-7-4-5 0-8 3-8 9s3 9 8 9c5 0 8-3 8-7 0-3-2-5-6-5-3 0-5 1-5 4 0 2 1 3 3 3 3 0 4-3 4-6 0-3-1-5-4-5-2 0-3 1-4 2"/>',
    youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',
    line:'<path d="M20.5 10.5c0 4-4 7-8.5 7h-1L6 21l1-5c-2-1-3.5-3-3.5-5.5C3.5 6.5 7 3 12 3s8.5 3.5 8.5 7.5Z"/><path d="M7 9v4h2m2-4v4m2 0V9l3 4V9m4 0h-2v4h2m-2-2h2"/>',
    maps:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    external:'<path d="M7 17 17 7M7 7h10v10"/>'
  };
  const symbol=name=>`<svg class="icon ${name==='external'?'sync-external-icon':''}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.maps}</svg>`;
  function link(channel,label,css='sync-club-link',withIcon=true){
    if(!channels[channel])return '';
    return `<a class="${esc(css)}" href="${channels[channel]}" target="_blank" rel="noopener noreferrer">${withIcon?symbol(channel):''}<span class="sync-link-label">${esc(label)}</span>${symbol('external')}<span class="sync-sr-only">Opens in a new tab</span></a>`;
  }
  function socials(includeLine=false){
    const labels={instagram:'Instagram',threads:'Threads',youtube:'YouTube',line:'LINE'};
    return `<div class="sync-social-links">${Object.keys(labels).filter(key=>includeLine||key!=='line').map(key=>link(key,labels[key],'sync-social-link')).join('')}</div>`;
  }
  function location(){return `<div class="sync-booking-location"><div>${symbol('maps')}<div><strong>SYNC Xinyi</strong><address>${address}</address></div></div>${link('maps','Get directions','sync-club-link',false)}</div>`}
  function contact(){
    return `<section class="sync-contact-card" aria-labelledby="sync-contact-title"><div class="sync-contact-heading"><span class="sync-club-symbol">${symbol('maps')}</span><h3 id="sync-contact-title">Visit SYNC Xinyi</h3></div><address>${address}</address><p>For booking or visit questions, chat with our team.</p><div class="sync-contact-actions">${link('line','Chat on LINE','button sync-line-button')}${link('maps','Get directions','button light sync-map-button')}</div><div class="sync-contact-social"><p>Follow SYNC</p>${socials()}</div></section>`;
  }
  function renderFooter(){
    const footer=document.querySelector('#club-footer');if(!footer)return;
    footer.innerHTML=I18n.html(`<div class="sync-footer-main"><div class="sync-footer-brand"><p>SYNC WELLNESS CLUB · TAIPEI</p><p>Find your rhythm. Feel like yourself.</p></div><nav class="sync-footer-follow" aria-label="Follow SYNC"><p>Follow SYNC</p>${socials(true)}</nav></div><div class="sync-footer-bottom">${link('maps','Get directions','sync-club-link',false)}<button data-action="rules">About this prototype ↗</button></div>`);
  }
  return Object.freeze({address,channels,link,socials,location,contact,renderFooter});
})();
