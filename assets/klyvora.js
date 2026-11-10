(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=innerWidth<860||matchMedia('(hover:none)').matches;
gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({lerp:reduce?1:.09});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
/* nav + page transitions */
$('#mb').onclick=()=>{const o=$('#nv').classList.toggle('open');$('#mb').textContent=o?'CLOSE':'MENU'};
$$('a[href]').forEach(a=>{const h=a.getAttribute('href');if(h[0]=='#'||/^(https?:|mailto:)/.test(h))return;a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey)return;e.preventDefault();$('#tr').classList.add('in');setTimeout(()=>location.href=h,reduce?0:600)})});
addEventListener('pageshow',e=>{if(e.persisted)$('#tr').classList.remove('in')});
/* text reveals */
$$('h1[data-split]').forEach(h=>{h.innerHTML=h.innerHTML.split('<br>').map(l=>l.split(' ').map(w=>`<span class="w"><i>${w}</i></span>`).join(' ')).join('<br>');gsap.to(h.querySelectorAll('i'),{y:0,duration:reduce?.01:1.2,stagger:.07,ease:'expo.out',delay:.7})});
gsap.set('[data-r]',{opacity:0,y:44});$$('[data-r]').forEach((e,i)=>ScrollTrigger.create({trigger:e,start:'top 90%',onEnter:()=>gsap.to(e,{opacity:1,y:0,duration:1,delay:(i%3)*.08,ease:'power3.out'})}));
/* cursor + magnetic */
const cur=$('#cur');let cx=0,cy=0,tx=0,ty=0;addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});gsap.ticker.add(()=>{cx+=(tx-cx)*.22;cy+=(ty-cy)*.22;cur.style.transform=`translate(${cx}px,${cy}px)`});
document.addEventListener('pointerover',e=>cur.classList.toggle('big',!!e.target.closest('a,button,.card,input,select,textarea')));
if(!mobile)$$('.btn,.logo').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.25,duration:.4})});el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.8,ease:'elastic.out(1,.4)'}))});
/* form */
const F=$('#f');if(F){const chk={n:v=>v.trim().length>=2||'Please enter your name.',e:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||'Enter a valid email address.',t:v=>!!v||'Choose a project type.',m:v=>v.trim().length>=10||'Tell us a little more (10+ characters).'};
const val=k=>{const el=$('#'+k),r=chk[k](el.value);el.parentNode.querySelector('.er').textContent=r===true?'':r;return r===true};Object.keys(chk).forEach(k=>$('#'+k).addEventListener('blur',()=>val(k)));
F.addEventListener('submit',e=>{e.preventDefault();if(!Object.keys(chk).map(val).every(Boolean))return;const b=encodeURIComponent(`Name: ${$('#n').value}\nEmail: ${$('#e').value}\nType: ${$('#t').value}\n\n${$('#m').value}`);$('#ok').style.display='block';location.href=`mailto:akashnaidu060@gmail.com?subject=${encodeURIComponent('KLYVORA project: '+$('#t').value)}&body=${b}`;F.reset()})}
/* sound */
let ac,g,on=false;$('#snd').onclick=()=>{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();g=ac.createGain();g.gain.value=0;const f=ac.createBiquadFilter();f.frequency.value=500;[55,82.4,110.5].forEach((fr,i)=>{const o=ac.createOscillator();o.type=i?'sine':'triangle';o.frequency.value=fr;const og=ac.createGain();og.gain.value=.4/(i+1);o.connect(og).connect(f);o.start()});f.connect(g).connect(ac.destination)}on=!on;ac.resume();g.gain.linearRampToValueAtTime(on?.12:0,ac.currentTime+1);$('#snd').textContent=on?'SOUND ON':'SOUND OFF'};
/* 3D: one persistent-feeling object that morphs sphere > cube > diamond with scroll, and carries its state between pages */
let ok=false;try{const c=document.createElement('canvas');ok=!!(window.THREE&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){}
if(!ok){document.body.classList.add('nogl');$('#gl').remove();return}
const CF={home:[1.6,1,'#3d7bff','#8a4dff',0],services:[-1.6,.9,'#2fd0ff','#8a4dff',.8],work:[1.6,.9,'#8a4dff','#3d7bff',1.5],studio:[-1.5,.9,'#5b6bff','#c04dff',2.2],contact:[0,1.1,'#3d7bff','#b06bff',.3]};
const T=CF[document.body.dataset.scene]||CF.home;let saved=null;try{saved=JSON.parse(sessionStorage.kv)}catch(e){}
const st=saved||{x:T[0],s:T[1],m:T[4],a:T[2],b:T[3]};const cur_a=new THREE.Color(st.a),cur_b=new THREE.Color(st.b),ta=new THREE.Color(T[2]),tb=new THREE.Color(T[3]);
const R=new THREE.WebGLRenderer({canvas:$('#gl'),alpha:true,antialias:!mobile});R.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100);cam.position.z=6;
const U={uT:{value:0},uS:{value:0},uM:{value:new THREE.Vector2()},uMo:{value:st.m},uA:{value:cur_a},uB:{value:cur_b}};
const mat=new THREE.ShaderMaterial({uniforms:U,vertexShader:`uniform float uT,uS,uMo;uniform vec2 uM;varying vec3 vN,vP;
float h(vec3 p){return sin(p.x*2.1+uT)*sin(p.y*2.3-uT*.8)*sin(p.z*1.9+uT*.6);}
void main(){vec3 d0=normalize(position);vec3 sph=d0*1.6;vec3 cu=d0/max(max(abs(d0.x),abs(d0.y)),abs(d0.z))*1.35;vec3 di=d0/(abs(d0.x)+abs(d0.y)+abs(d0.z))*2.0;
vec3 p=mix(sph,cu,smoothstep(0.,1.,uMo));p=mix(p,di,smoothstep(1.,2.,uMo));p=mix(p,sph,smoothstep(2.,3.,uMo));
float a=.26+uS*.3;vec3 q=p*1.3+vec3(uM,0.);float d=h(q);vec2 e=vec2(.05,0.);vec3 g=vec3(h(q+e.xyy)-d,h(q+e.yxy)-d,h(q+e.yyx)-d)/.05;
vec3 n=normalize(d0-g*a*.35);p+=d0*d*a;vN=normalize(normalMatrix*n);vec4 mv=modelViewMatrix*vec4(p,1.);vP=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
fragmentShader:`uniform float uT;uniform vec3 uA,uB;varying vec3 vN,vP;
void main(){vec3 n=normalize(vN),v=normalize(vP);float f=pow(1.-max(dot(n,v),0.),2.6);vec3 r=reflect(-v,n);
float b=smoothstep(.15,.9,sin(r.y*6.+r.x*3.+uT*.7)*.5+.5);vec3 c=mix(vec3(.015,.008,.05),uA,b*.6);c+=uB*f*1.5;
c+=pow(max(dot(r,normalize(vec3(.4,.8,.5))),0.),30.)*vec3(.9,.95,1.);c+=pow(max(dot(r,normalize(vec3(-.7,-.2,.6))),0.),18.)*uA*.8;gl_FragColor=vec4(c,1.);}`});
const obj=new THREE.Mesh(new THREE.IcosahedronGeometry(1,mobile?24:48),mat);sc.add(obj);
const halo=new THREE.Mesh(new THREE.PlaneGeometry(9,9),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uC:{value:cur_b}},vertexShader:'varying vec2 u;void main(){u=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 uC;varying vec2 u;void main(){float d=length(u)*2.;gl_FragColor=vec4(uC,pow(max(1.-d,0.),2.6)*.45);}'}));halo.position.z=-2;sc.add(halo);
const ring=new THREE.Mesh(new THREE.TorusGeometry(2.5,.012,8,160),new THREE.MeshBasicMaterial({color:0x6a8cff,transparent:true,opacity:.55}));sc.add(ring);
const N=mobile?350:1000,pa=new Float32Array(N*3),pc=new Float32Array(N*3),c1=new THREE.Color('#3d7bff'),c2=new THREE.Color('#8a4dff');
for(let i=0;i<N;i++){const r=3+Math.random()*9,t=Math.random()*6.283,u=Math.acos(2*Math.random()-1);pa.set([r*Math.sin(u)*Math.cos(t),(Math.random()-.5)*14,r*Math.sin(u)*Math.sin(t)-3],i*3);const c=c1.clone().lerp(c2,Math.random());pc.set([c.r,c.g,c.b],i*3)}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pa,3));pg.setAttribute('color',new THREE.BufferAttribute(pc,3));
const P=new THREE.Points(pg,new THREE.PointsMaterial({size:mobile?.05:.035,vertexColors:true,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(P);
const rs=()=>{R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};rs();addEventListener('resize',rs);
const S={p:0,mx:0,my:0,sx:0,sy:0,pulse:0};addEventListener('pointermove',e=>{S.mx=e.clientX/innerWidth*2-1;S.my=-(e.clientY/innerHeight*2-1)});addEventListener('pointerdown',()=>S.pulse=1);
ScrollTrigger.create({trigger:document.body,start:0,end:'max',onUpdate:s=>gsap.to(S,{p:s.progress,duration:.8,overwrite:true})});
let vis=true;document.addEventListener('visibilitychange',()=>vis=!document.hidden);
const tx0=mobile?0:T[0],sv=()=>{try{sessionStorage.kv=JSON.stringify({x:st.x,s:st.s,m:st.m,a:'#'+cur_a.getHexString(),b:'#'+cur_b.getHexString()})}catch(e){}};addEventListener('pagehide',sv);
const t0=performance.now();gsap.ticker.add(()=>{if(!vis)return;const t=(performance.now()-t0)/1000;U.uT.value=t*(reduce?.1:.6);
S.sx+=(S.mx-S.sx)*.06;S.sy+=(S.my-S.sy)*.06;S.pulse*=.93;U.uS.value=S.p+S.pulse;U.uM.value.set(S.sx,S.sy);
st.x+=(tx0-st.x)*.04;st.s+=(T[1]*(mobile?.7:1)-st.s)*.04;st.m+=(T[4]-st.m)*.04;cur_a.lerp(ta,.04);cur_b.lerp(tb,.04);
const p=S.p;U.uMo.value=st.m+p*1.4;
obj.position.set(st.x+S.sx*.3,(mobile?.9:0)+Math.cos(p*Math.PI*3)*.5+S.sy*.3,-p*1.5);
obj.rotation.set(p*6+S.sy*.5,t*.12+p*5+S.sx*.6,0);const s=st.s*(1+.4*Math.sin(p*Math.PI*5)**2);obj.scale.setScalar(s);
halo.position.x=obj.position.x;halo.position.y=obj.position.y;ring.position.copy(obj.position);ring.rotation.set(1.2+p*5+S.sy,t*.2,S.sx);ring.scale.setScalar(s*(.9+.1*Math.sin(t)));
P.rotation.y=t*.02+p*3;P.position.y=p*5;cam.position.set(S.sx*.7,S.sy*.5,6-Math.sin(p*Math.PI)*1.2);cam.lookAt(obj.position.x*.3,obj.position.y*.3,0);R.render(sc,cam)});
})();
