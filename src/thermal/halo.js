/* The approved thermal halo. Decorative, local and independent of app actions. */
window.HandCHalo=(() => {
  'use strict';
  const tau=Math.PI*2,cycle=60/104*16;
  let active=null;

  function destroy(){
    if(!active)return;
    cancelAnimationFrame(active.frame);
    active.resize?.disconnect();active.intersection?.disconnect();
    active=null;
  }
  function drawable(state){return state.mode==='full'&&state.visible&&!document.hidden}
  function stop(state){cancelAnimationFrame(state.frame);state.frame=0;state.lastTime=null}
  function status(state){
    state.host.dataset.haloState=document.hidden?'hidden':!state.visible?'offscreen':state.mode==='full'?'running':state.mode;
  }
  function schedule(state){
    status(state);
    if(drawable(state)&&!state.frame)state.frame=requestAnimationFrame(now=>tick(state,now));
  }
  function tick(state,now){
    state.frame=0;
    if(active!==state||!drawable(state))return;
    // Cap drawing to 30fps and never advance the clock while hidden or offscreen.
    if(state.lastTime===null)state.lastTime=now;
    if(now-state.lastPaint>=32){
      state.time+=Math.min((now-state.lastTime)/1000,.1);
      state.lastTime=now;state.lastPaint=now;
      paint(state);
    }
    schedule(state);
  }
  function measure(state){
    const {width,height}=state.host.getBoundingClientRect();
    if(!width||!height)return false;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    if(width!==state.width||height!==state.height||ratio!==state.ratio){
      state.width=width;state.height=height;state.ratio=ratio;
      state.canvas.width=Math.round(width*ratio);state.canvas.height=Math.round(height*ratio);
      state.ctx.setTransform(ratio,0,0,ratio,0,0);
      const columns=width<600?64:92,rows=width<600?20:25;
      state.mesh=[];
      for(let ring=0;ring<columns;ring++)for(let tube=0;tube<rows;tube++){
        const v=tube/rows*tau;
        state.mesh.push({u:ring/columns*tau,cosV:Math.cos(v),sinV:Math.sin(v)});
      }
    }
    return true;
  }
  function paint(state){
    if(!measure(state))return;
    const {ctx,width:w,height:h}=state;
    const still=state.mode!=='full',t=state.mode==='reduced'?2.5:state.time;
    const mobile=w<660,cx=w*(mobile?.59:.71),cy=h*(mobile?.57:.43);
    const radius=Math.min(w*(mobile?.37:.24),h*.43);
    const day=document.documentElement.dataset.theme==='day';
    const cool=day?[74,94,78]:[198,207,195],warm=day?[150,98,48]:[235,171,122];
    const accent=day?'181,38,32':'239,83,75';
    const breath=.5-.5*Math.cos(tau*t/cycle);
    const energy=still?0:Math.max(0,Math.min(1,Number(state.readAudio?.())||0));
    state.energy=still?0:state.energy+(energy-state.energy)*(energy>state.energy?.6:.16);
    const pulse=state.energy,scale=.92+breath*.094+pulse*.025;
    ctx.clearRect(0,0,w,h);
    const glow=ctx.createRadialGradient(cx+radius*.3,cy,0,cx,cy,radius*1.75);
    glow.addColorStop(0,`rgba(${warm},${.05+breath*.04+pulse*.025})`);
    glow.addColorStop(.45,`rgba(${cool},${.045+breath*.035})`);
    glow.addColorStop(1,`rgba(${cool},0)`);
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    const spin=t*.11,tilt=.54+Math.sin(t*.16)*.18,roll=-.35+Math.sin(t*.12)*.156;
    const cosX=Math.cos(tilt),sinX=Math.sin(tilt),cosZ=Math.cos(roll),sinZ=Math.sin(roll);
    const points=[];
    for(const vertex of state.mesh){
      const u=vertex.u+spin,minor=radius*(.205+Math.sin(u*3+t*.45)*.013);
      const r=radius*.78+minor*vertex.cosV;
      const x=r*Math.cos(u),y=r*Math.sin(u),z=minor*vertex.sinV;
      const y2=y*cosX-z*sinX,z2=y*sinX+z*cosX;
      const x3=x*cosZ-y2*sinZ,y3=x*sinZ+y2*cosZ;
      const perspective=680/(680-z2),depth=(z2/radius+1)/2;
      points.push({x:cx+x3*perspective*scale,y:cy+y3*perspective*scale,z:z2,warm:Math.max(0,Math.cos(u-.3)),alpha:Math.min(.95,.2+.46*depth+(.5+.5*Math.sin(u-t*.3))*.2+pulse*.1),size:(.55+depth*.84)*perspective});
    }
    points.sort((a,b)=>a.z-b.z);
    for(const p of points){
      const color=cool.map((channel,i)=>Math.round(channel+(warm[i]-channel)*p.warm));
      ctx.fillStyle=`rgba(${color},${p.alpha})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,tau);ctx.fill();
    }
    ctx.save();ctx.translate(cx,cy);ctx.rotate(roll);
    for(let i=0;i<3;i++){
      const phase=(t/cycle+i/3)%1,r=radius*(1.05+phase*.43);
      ctx.strokeStyle=`rgba(${cool},${(1-phase)*.11+pulse*.018})`;ctx.lineWidth=.65;
      ctx.beginPath();ctx.ellipse(0,0,r,r*.74,0,0,tau);ctx.stroke();
    }
    ctx.restore();
    const theta=t*.22-.7,ledX=cx+Math.cos(theta)*radius*1.23,ledY=cy+Math.sin(theta)*radius*.91;
    const ledGlow=ctx.createRadialGradient(ledX,ledY,0,ledX,ledY,11);
    ledGlow.addColorStop(0,`rgba(${accent},.38)`);ledGlow.addColorStop(1,`rgba(${accent},0)`);
    ctx.fillStyle=ledGlow;ctx.fillRect(ledX-11,ledY-11,22,22);
    ctx.fillStyle=`rgb(${accent})`;ctx.beginPath();ctx.arc(ledX,ledY,2,0,tau);ctx.fill();
  }
  function mount({motion='full',readAudio}={}){
    destroy();
    const host=document.querySelector('.thermal-halo'),canvas=host?.querySelector('canvas');
    if(!canvas)return;
    let ctx;try{ctx=canvas.getContext('2d')}catch{}
    if(!ctx)return;
    const state=active={host,canvas,ctx,mode:motion,readAudio,frame:0,time:0,lastTime:null,lastPaint:-100,visible:true,width:0,height:0,ratio:0,energy:0,mesh:[]};
    paint(state);
    if(window.ResizeObserver){state.resize=new ResizeObserver(()=>{if(active===state)paint(state)});state.resize.observe(host)}
    if(window.IntersectionObserver){
      state.intersection=new IntersectionObserver(entries=>{
        if(active!==state)return;
        state.visible=entries.some(entry=>entry.isIntersecting);
        if(!drawable(state))stop(state);
        schedule(state);
      },{threshold:0});state.intersection.observe(host);
    }
    schedule(state);
  }
  function setMotion(mode){
    if(!active||active.mode===mode)return;
    active.mode=mode;stop(active);paint(active);schedule(active);
  }
  function visibility(){
    if(!active)return;
    if(!drawable(active))stop(active);
    schedule(active);
  }
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',()=>{if(active)stop(active)});
  window.addEventListener('pageshow',visibility);
  window.addEventListener('resize',()=>{if(active&&!active.resize)paint(active)},{passive:true});
  return {mount,setMotion,destroy};
})();
