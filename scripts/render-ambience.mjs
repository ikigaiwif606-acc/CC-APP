// Original HandC composition. No recordings or third-party samples are used.
// Run: node scripts/render-ambience.mjs /tmp/handc-thermal.wav
// Encode: ffmpeg -i /tmp/handc-thermal.wav -c:a aac -b:a 112k assets/audio/thermal-104.m4a
import {writeFileSync} from 'node:fs';

const rate=44100,bpm=104,beat=60/bpm,bars=16,length=Math.round(beat*4*bars*rate);
const dry=[new Float32Array(length),new Float32Array(length)];
const stereo=[new Float32Array(length),new Float32Array(length)];
const tau=Math.PI*2;
let randomState=606104;
const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296*2-1};
const midi=n=>440*2**((n-69)/12);
function voice(start,duration,pan,fn){
  const offset=Math.round(start*rate),frames=Math.ceil(duration*rate);
  const l=Math.sqrt((1-pan)/2),r=Math.sqrt((1+pan)/2);
  for(let j=0;j<frames;j++){
    const i=((offset+j)%length+length)%length,sample=fn(j/rate,j);
    dry[0][i]+=sample*l;dry[1][i]+=sample*r;
  }
}
// Soft, rounded drum transients; occasional missing beats leave room for the pads.
for(let b=0;b<64;b++){
  const gain=b%8===7?.032:.055;
  voice(b*beat,.42,0,t=>gain*Math.sin(tau*(43*t+45*.025*(1-Math.exp(-t/.025))))*(1-Math.exp(-t/.002))*Math.exp(-t*15));
  if(b%2===0)voice((b+.5)*beat,.085,.28,t=>random()*.006*Math.exp(-t*65)*(1-Math.exp(-t/.003)));
  if(b%4===2)voice((b+.02)*beat,.15,-.2,t=>random()*.0045*Math.exp(-t*28)*(1-Math.exp(-t/.006)));
}
// D minor 9 / B-flat major 9 / F major 9 / C suspended 9. Slow harmonic movement.
const chords=[[50,57,60,64,65],[46,53,57,60,62],[53,57,60,64,67],[48,55,58,62,65]];
chords.forEach((notes,c)=>{
  const start=c*16*beat;
  notes.forEach((note,n)=>{
    const f=midi(note),duration=19*beat;
    voice(start,duration,(n-2)*.22,t=>{
      const env=Math.sin(Math.PI*Math.min(1,t/duration))**1.7;
      const drift=1+.0009*Math.sin(tau*t*.13+n);
      return .010*env*(Math.sin(tau*f*t*drift)+.28*Math.sin(tau*f*1.0017*t)+.08*Math.sin(tau*f*2*t));
    });
  });
  [1.5,4.75,8.5,12.75].forEach((position,k)=>{
    notes.slice(1,4).forEach((note,n)=>{
      const f=midi(note+12);
      voice(start+position*beat,2.9,Math.sin(c+k+n)*.5,t=>{
        const env=(1-Math.exp(-t/.035))*Math.exp(-t/0.66);
        return .014*env*(Math.sin(tau*f*t)+.12*Math.sin(tau*f*2*t)+.04*Math.sin(tau*f*3*t));
      });
    });
  });
  [0,3.5,7,10.5,14].forEach((position,k)=>{
    const f=midi(notes[0]-12+(k===3?7:0));
    voice(start+position*beat,.9,0,t=>.025*Math.sin(tau*f*t)*(1-Math.exp(-t/.025))*Math.exp(-t*4));
  });
});
// Quiet filtered noise suggests water and tape; a sine envelope closes its seam.
for(let c=0;c<2;c++){
  let low=0,air=0;
  for(let i=0;i<length;i++){
    const noise=random();low+=.012*(noise-low);air+=.18*(noise-air);
    const envelope=Math.sin(Math.PI*i/length)**2;
    stereo[c][i]+=(low*.047+air*.003)*envelope;
  }
}
// Circular stereo delay tails wrap naturally through the end of the phrase.
const taps=[[0,1],[.75,.29],[1.5,.18],[2.25,.11],[3.75,.065],[6,.035]];
for(let c=0;c<2;c++)for(const [delay,gain] of taps){
  const samples=Math.round((delay*beat+(delay?(c===0?.011:-.007):0))*rate);
  for(let i=0;i<length;i++)stereo[c][(i+samples+length)%length]+=dry[delay&&c===0?1:c][i]*gain;
}
let peak=0,sum=0;for(let i=0;i<length;i++)for(let c=0;c<2;c++){const s=stereo[c][i];peak=Math.max(peak,Math.abs(s));sum+=s*s}
const rms=Math.sqrt(sum/(length*2)),gain=Math.min(.58/peak,.075/rms);
const pcm=Buffer.alloc(length*4);
for(let i=0;i<length;i++)for(let c=0;c<2;c++)pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,stereo[c][i]*gain))*32767),(i*2+c)*2);
const header=Buffer.alloc(44);header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);
writeFileSync(process.argv[2]||'/tmp/handc-thermal.wav',Buffer.concat([header,pcm]));
console.log(JSON.stringify({bpm,bars,seconds:length/rate,peak:peak*gain,rms:rms*gain,seam:Math.max(...stereo.map(ch=>Math.abs(ch[0]-ch[length-1])*gain))}));
