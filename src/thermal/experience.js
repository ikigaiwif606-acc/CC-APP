/* HandC sound and motion. Optional audio never gates navigation or transactions. */
window.HandCExperience=(() => {
  'use strict';
  const root=document.documentElement;
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  let t=value=>value,context=null,effectsBus=null,musicBus=null,buffer=null,source=null;
  let loading=false,music=false,effects=false,request=0,abort=null,audioError='',lastClick=-1;
  let observer=null,raf=0,stage=null,manualStep=null,lastStep=-1,motionPreference='full';
  let musicVolume=25,effectsVolume=35;
  const voices=new Set();
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const audioSupported=!!(window.AudioContext||window.webkitAudioContext);
  try{
    motionPreference=localStorage.getItem('handc-motion')==='paused'?'paused':'full';
    const saved=JSON.parse(localStorage.getItem('handc-volume'));
    if(saved){musicVolume=clamp(saved.music,25);effectsVolume=clamp(saved.effects,35)}
  }catch{}
  function clamp(value,fallback){return Number.isFinite(value)?Math.max(0,Math.min(100,value)):fallback}
  const motion=()=>reduced?.matches?'reduced':motionPreference;
  function saveVolume(){try{localStorage.setItem('handc-volume',JSON.stringify({music:musicVolume,effects:effectsVolume}))}catch{}}
  const waveform='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 10v4m4-7v10m5-14v18m5-14v10m4-7v4"/></svg>';
  function soundControls(){
    const panel=$('#sound-panel');if(!panel)return;
    panel.innerHTML=`<div class="modal-heading"><div><p class="micro">HANDC / SOUND SYSTEM</p><h2 id="sound-title">${t('Set the atmosphere.')}</h2></div><button class="icon-button close" data-experience="sound-close" aria-label="${t('Close sound settings')}">×</button></div>
      <div class="sound-track"><span class="sound-disc" aria-hidden="true">${waveform}</span><div><span class="micro">HANDC 001 / ORIGINAL COMPOSITION</span><h3>${t('Thermal / 104')}</h3><p>${t('Ambient dub techno. Made for this space.')}</p></div><span class="mono">104<br><small>BPM</small></span></div>
      <div class="sound-setting"><div><strong>${t('Music')}</strong><span>${t('Soft pulse. Warm chords. Water texture.')}</span></div><button class="sound-switch" role="switch" aria-checked="false" data-experience="music" aria-label="${t('Background music')}" ${audioSupported?'':'disabled'}><i></i><span>${t('Off')}</span></button></div>
      <label class="sound-volume">${t('Music volume')}<output id="music-level">${musicVolume}%</output><input type="range" data-volume="music" min="0" max="100" step="1" value="${musicVolume}" aria-label="${t('Music volume')}" ${audioSupported?'':'disabled'}></label>
      <div class="sound-setting"><div><strong>${t('Button effects')}</strong><span>${t('Tactile clicks and gentle confirmations.')}</span></div><button class="sound-switch" role="switch" aria-checked="false" data-experience="effects" aria-label="${t('Button sound effects')}" ${audioSupported?'':'disabled'}><i></i><span>${t('Off')}</span></button></div>
      <label class="sound-volume">${t('Effects volume')}<output id="effects-level">${effectsVolume}%</output><input type="range" data-volume="effects" min="0" max="100" step="1" value="${effectsVolume}" aria-label="${t('Effects volume')}" ${audioSupported?'':'disabled'}></label>
      <p id="sound-message" class="small muted" role="status" aria-live="polite"></p><button class="button secondary mute-button" data-experience="mute">${t('Mute all sound')} ${waveform}</button><p class="sound-footnote">${t('Sound starts off. Your volume settings are remembered.')}</p><div class="experience-preference"><span>${t('Visual motion')}</span><button class="motion-button" data-experience="motion" aria-pressed="false">${t('Pause motion')}</button></div>`;
    syncSound();applyMotion();
  }
  function syncSound(){
    const button=$('#sound-button');
    if(button){button.innerHTML=waveform+`<span>${t('Sound')}</span><i class="sound-indicator" aria-hidden="true"></i>`;button.dataset.on=String(music||effects);button.setAttribute('aria-label',t(music||effects?'Sound settings. Sound on.':'Sound settings. Sound off.'));button.setAttribute('aria-expanded',String(!!$('#sound-panel')?.open))}
    for(const [key,on] of [['music',music],['effects',effects]]){
      const control=$(`[data-experience="${key}"]`);if(!control)continue;
      control.setAttribute('aria-checked',String(on));control.querySelector('span').textContent=t(key==='music'&&loading?'Loading…':on?'On':'Off');
    }
    const message=$('#sound-message');
    if(message)message.textContent=t(!audioSupported?'Sound is unavailable in this browser.':loading?'Loading the original HandC loop…':music?'Playing / Thermal 104':effects?'Button effects enabled.':'Choose music, effects, or both.');
    // Keep a playback failure visible instead of masking it with the loading message.
    if(message&&audioError)message.textContent=t(audioError);
    const mute=$('[data-experience="mute"]');if(mute)mute.disabled=!music&&!effects&&!loading;
    root.dataset.music=music&&!loading?'on':'off';
  }
  async function audio(){
    if(!audioSupported)throw new Error('unsupported');
    if(!context){
      const Audio=window.AudioContext||window.webkitAudioContext;context=new Audio();
      const limiter=context.createDynamicsCompressor();limiter.threshold.value=-10;limiter.knee.value=12;limiter.ratio.value=4;limiter.attack.value=.005;limiter.release.value=.12;limiter.connect(context.destination);
      musicBus=context.createGain();effectsBus=context.createGain();musicBus.connect(limiter);effectsBus.connect(limiter);setVolumes();
      context.addEventListener?.('statechange',()=>{if(context.state==='closed'){music=false;effects=false;syncSound()}});
    }
    if(context.state!=='running')await context.resume();
    if(context.state!=='running')throw new Error('suspended');
    return context;
  }
  function setVolumes(){
    if(!context)return;
    for(const [node,value] of [[musicBus,musicVolume/100*.8],[effectsBus,effectsVolume/100*.4]]){
      node.gain.cancelScheduledValues(context.currentTime);node.gain.setTargetAtTime(value,context.currentTime,.025);
    }
  }
  function stopMusic(){
    request++;abort?.abort();abort=null;loading=false;music=false;
    if(source){
      const old=source;source=null;
      old.gain.gain.cancelScheduledValues(context.currentTime);old.gain.gain.setTargetAtTime(0,context.currentTime,.045);
      try{old.node.stop(context.currentTime+.25)}catch{}
    }
    syncSound();
  }
  async function toggleMusic(){
    if(music||loading){stopMusic();return}
    const token=++request;music=true;loading=true;audioError='';syncSound();
    try{
      const ctx=await audio();if(token!==request)return;
      if(!buffer){
        abort=new AbortController();const response=await fetch('assets/audio/thermal-104.m4a',{signal:abort.signal});
        if(!response.ok)throw new Error('asset');const bytes=await response.arrayBuffer();
        const decoded=await ctx.decodeAudioData(bytes);if(token!==request)return;buffer=decoded;abort=null;
      }
      if(token!==request||!music)return;
      const node=ctx.createBufferSource(),gain=ctx.createGain();node.buffer=buffer;node.loop=true;
      node.loopStart=0;node.loopEnd=Math.min(buffer.duration,Math.round(60/104*4*16*44100)/44100);
      gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(1,ctx.currentTime+.65);
      node.connect(gain);gain.connect(musicBus);source={node,gain};
      node.onended=()=>{node.disconnect();gain.disconnect()};node.start();loading=false;syncSound();
    }catch(error){
      if(token!==request)return;stopMusic();audioError=error.name==='AbortError'?'':'Music could not start. Tap Music to try again.';syncSound();
    }
  }
  // Short envelopes avoid speaker clicks. Nodes disconnect when each voice ends.
  function tone(frequency,start,duration,gain=.13,type='sine',endFrequency=frequency){
    if(!context||voices.size>=12)return;
    const osc=context.createOscillator(),envelope=context.createGain();osc.type=type;
    osc.frequency.setValueAtTime(frequency,start);osc.frequency.exponentialRampToValueAtTime(endFrequency,start+duration);
    envelope.gain.setValueAtTime(.00001,start);envelope.gain.linearRampToValueAtTime(gain,start+.003);envelope.gain.exponentialRampToValueAtTime(.00001,start+duration);
    osc.connect(envelope);envelope.connect(effectsBus);voices.add(osc);
    osc.onended=()=>{voices.delete(osc);osc.disconnect();envelope.disconnect()};osc.start(start);osc.stop(start+duration+.01);
  }
  async function feedback(kind='click'){
    if(!effects||document.hidden)return;
    try{
      await audio();if(!effects||document.hidden)return;
      const now=context.currentTime;
      if(kind==='click'&&now-lastClick<.045)return;
      if(kind==='click'){lastClick=now;tone(1060,now,.036,.13,'sine',630);tone(180,now,.023,.09,'triangle',125)}
      else if(kind==='toggle'){tone(540,now,.065,.1);tone(810,now+.035,.065,.07)}
      else if(kind==='success'){tone(660,now,.15,.12);tone(880,now+.09,.2,.1)}
      else if(kind==='error'){tone(220,now,.075,.11);tone(185,now+.095,.1,.09)}
    }catch{/* Audio permissions or hardware must never block an app action. */}
  }
  function muted(){effects=false;audioError='';for(const voice of voices){try{voice.stop()}catch{}}stopMusic();syncSound()}
  document.addEventListener('click',event=>{
    const target=event.target.closest?.('button,a[href],summary,input[type=checkbox],input[type=radio],select,[role=button]');
    if(!target||target.disabled||target.getAttribute('aria-disabled')==='true'||event.defaultPrevented)return;
    if(!target.dataset.experience)void feedback(target.matches('input,select')||['theme','scene','language','facility'].includes(target.dataset.action)?'toggle':'click');
  },true);
  document.addEventListener('click',async event=>{
    const target=event.target.closest?.('[data-experience]');if(!target||target.disabled)return;
    switch(target.dataset.experience){
      case 'sound':soundControls();$('#sound-panel').showModal();syncSound();void feedback('click');break;
      case 'sound-close':void feedback('click');$('#sound-panel').close();break;
      case 'music':void feedback('toggle');await toggleMusic();break;
      case 'effects':
        if(effects){void feedback('toggle');effects=false;syncSound();break}
        try{audioError='';await audio();effects=true;syncSound();void feedback('toggle')}
        catch{audioError='Sound could not start. Please try again.';syncSound()}break;
      case 'mute':muted();break;
      case 'motion':
        motionPreference=motionPreference==='paused'?'full':'paused';try{localStorage.setItem('handc-motion',motionPreference)}catch{}
        manualStep=null;applyMotion();void feedback('toggle');break;
      case 'stage':manualStep=Number(target.dataset.step);selectStage(manualStep);void feedback('toggle');break;
    }
  });
  document.addEventListener('input',event=>{
    const key=event.target.dataset.volume;if(!key)return;
    const value=clamp(Number(event.target.value),25);if(key==='music')musicVolume=value;else effectsVolume=value;
    const output=$(`#${key}-level`);if(output)output.textContent=value+'%';setVolumes();saveVolume();
  });
  document.addEventListener('change',event=>{if(event.target.dataset.volume)void feedback('toggle')});
  $('#sound-panel')?.addEventListener('close',()=>{syncSound();$('#sound-button')?.focus({preventScroll:true})});
  $('#sound-panel')?.addEventListener('click',event=>{if(event.target!==$('#sound-panel'))return;const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close()});
  function selectStage(step){
    if(!stage)return;step=Math.max(0,Math.min(2,step));if(lastStep===step)return;lastStep=step;
    stage.dataset.step=step;
    stage.querySelectorAll('[data-scene-panel]').forEach((panel,i)=>{panel.dataset.active=String(i===step);panel.setAttribute('aria-hidden',String(i!==step))});
    stage.querySelectorAll('[data-experience="stage"]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===step)));
  }
  function position(){
    raf=0;if(!stage)return;
    const track=stage.parentElement,rect=track.getBoundingClientRect(),height=stage.getBoundingClientRect().height;
    const visible=rect.bottom>0&&rect.top<window.innerHeight;stage.dataset.visible=String(visible);
    if(motion()!=='full'||!visible||window.innerHeight<=480)return;
    const header=$('.header')?.getBoundingClientRect().height||100;
    const travel=Math.max(1,rect.height-height),progress=Math.max(0,Math.min(1,(header+16-rect.top)/travel));
    stage.style.setProperty('--sequence-progress',progress);
    if(manualStep===null)selectStage(Math.min(2,Math.floor(progress*3)));
  }
  function schedulePosition(){if(!raf)raf=requestAnimationFrame(position)}
  function applyMotion(){
    root.dataset.motion=motion();
    $$('[data-experience="motion"]').forEach(button=>{
      button.disabled=motion()==='reduced';button.setAttribute('aria-pressed',String(motion()!=='full'));
      button.innerHTML=`<span aria-hidden="true">${motion()==='full'?'Ⅱ':'▷'}</span> ${t(motion()==='reduced'?'Reduced motion':motion()==='paused'?'Resume motion':'Pause motion')}`;
      button.title=t(motion()==='reduced'?'Follows your device motion preference.':'Control visual motion');
    });
    if(motion()!=='full')$$('[data-reveal]').forEach(el=>el.classList.add('is-revealed'));
    schedulePosition();
  }
  function mount(options={}){
    t=options.translate||t;
    const header=$('.header')?.getBoundingClientRect().height||100;root.style.setProperty('--header-height',header+'px');
    stage=$('.thermal-stage');manualStep=null;lastStep=-1;selectStage(0);
    observer?.disconnect();
    if(window.IntersectionObserver){
      observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -15px 0px'});
      $$('#app [data-reveal]').forEach(el=>observer.observe(el));root.classList.add('motion-ready');
    }
    if(!$('#sound-panel')?.open)soundControls();syncSound();applyMotion();
  }
  window.addEventListener('scroll',schedulePosition,{passive:true});
  window.addEventListener('resize',()=>{root.style.setProperty('--header-height',($('.header')?.getBoundingClientRect().height||100)+'px');schedulePosition()},{passive:true});
  document.addEventListener('focusin',event=>event.target.closest?.('[data-reveal]')?.classList.add('is-revealed'));
  reduced?.addEventListener?.('change',applyMotion);
  function visibility(){
    root.dataset.pageHidden=String(document.hidden);
    if(!context)return;
    if(document.hidden){context.suspend().catch(()=>{})}
    else if(music||effects)context.resume().catch(()=>{stopMusic();audioError='Tap Music to resume the soundtrack.';syncSound()});
  }
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);raf=0;context?.suspend().catch(()=>{})});
  window.addEventListener('pageshow',visibility);
  applyMotion();
  return {mount,feedback,get state(){return {music,effects,loading,musicVolume,effectsVolume,motion:motion(),contextState:context?.state||'not-created'}}};
})();
