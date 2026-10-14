import {useRef,useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {m,useMotionValue,useSpring,useInView,animate,useScroll,useTransform,AnimatePresence} from 'framer-motion';
import {Plus,ArrowUpRight,Check} from 'lucide-react';
export const ease=[.22,1,.36,1];
export function useMedia(q){const [v,setV]=useState(()=>typeof window!=='undefined'&&matchMedia(q).matches);
 useEffect(()=>{const mq=matchMedia(q),f=()=>setV(mq.matches);f();mq.addEventListener('change',f);return()=>mq.removeEventListener('change',f)},[q]);return v}
export function useTitle(t,d){useEffect(()=>{document.title=t;if(d)document.querySelector('meta[name=description]')?.setAttribute('content',d)},[t,d])}
export function Reveal({children,delay=0,y=30,className,as='div'}){const C=m[as];
 return <C className={className} initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.9,ease,delay}}>{children}</C>}
export function Magnetic({children,strength=.3}){const r=useRef(null),x=useMotionValue(0),y=useMotionValue(0),sx=useSpring(x,{stiffness:220,damping:16}),sy=useSpring(y,{stiffness:220,damping:16});
 return <m.span ref={r} className="mag" style={{x:sx,y:sy}} onMouseMove={e=>{const b=r.current.getBoundingClientRect();x.set((e.clientX-b.left-b.width/2)*strength);y.set((e.clientY-b.top-b.height/2)*strength)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</m.span>}
export function Spot({children,className='',...p}){const mv=e=>{const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',e.clientX-b.left+'px');e.currentTarget.style.setProperty('--my',e.clientY-b.top+'px')};
 return <div className={'spot '+className} onMouseMove={mv} {...p}>{children}</div>}
export function Btn({to,href,ghost,children,...p}){const cls='btn'+(ghost?' ghost':''),in_=<>{children}<ArrowUpRight size={17}/></>;
 return <Magnetic>{to?<Link to={to} className={cls} {...p}>{in_}</Link>:<a href={href} className={cls} {...p}>{in_}</a>}</Magnetic>}
export const Eyebrow=({children})=><p className="eyebrow"><span/>{children}</p>;
export function Counter({to,suffix=''}){const r=useRef(null),v=useInView(r,{once:true}),[n,setN]=useState(0);
 useEffect(()=>{if(!v)return;const c=animate(0,to,{duration:1.8,ease,onUpdate:x=>setN(Math.round(x))});return()=>c.stop()},[v,to]);return <span ref={r}>{n}{suffix}</span>}
export function Marquee({items}){const l=[...items,...items];return <div className="marq" aria-hidden="true"><div className="marq-in">{l.map((t,i)=><span key={i}>{t}<i/></span>)}</div></div>}
export function IstClock(){const [t,setT]=useState('');
 useEffect(()=>{const f=()=>setT(new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true}));f();const i=setInterval(f,20000);return()=>clearInterval(i)},[]);
 return <span className="clock"><i className="dot"/>IST {t||'--:--'}</span>}
export const Jaali=()=><div className="jaali" aria-hidden="true"/>;
function W({p,a,b,children}){const o=useTransform(p,[a,b],[.14,1]);return <m.span style={{opacity:o}}>{children} </m.span>}
export function ScrollText({text}){const r=useRef(null),{scrollYProgress:p}=useScroll({target:r,offset:['start 85%','end 50%']}),w=text.split(' ');
 return <p ref={r} className="stext" aria-label={text}>{w.map((x,i)=><W key={i} p={p} a={i/w.length} b={(i+1)/w.length}>{x}</W>)}</p>}
export function IndexList({items}){const [o,setO]=useState(0);
 return <ul className="idx">{items.map((it,i)=><li key={it.title} className={i===o?'open':''}>
  <button onClick={()=>setO(o===i?-1:i)} aria-expanded={i===o}><span className="no">{String(i+1).padStart(2,'0')}</span><span className="tt">{it.title}</span><span className="tg">{it.tag}</span>
  <m.span className="pl" animate={{rotate:i===o?45:0}}><Plus size={22}/></m.span></button>
  <AnimatePresence initial={false}>{i===o&&<m.div className="idx-b" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.5,ease}}>
   <div className="idx-bi"><div><p>{it.desc}</p>{it.stack&&<div className="chips">{it.stack.map(s=><span key={s}>{s}</span>)}</div>}</div>
   <ul>{it.pts.map(p=><li key={p}><Check size={16}/>{p}</li>)}</ul></div></m.div>}</AnimatePresence></li>)}</ul>}
// ---- dot-matrix India map ----
const OUT=[[74.3,37],[77.8,35.5],[79,32.5],[80.2,30.5],[81,30.1],[80.1,28.8],[84,27.3],[88.1,26.4],[88.9,27.3],[92,27.8],[95,29.2],[97.3,28.2],[96,26.8],[95,25.3],[94.6,23.5],[93.4,22],[92.3,23.2],[92.2,24.4],[91.5,25.1],[90,25.1],[89,25.3],[88.4,24.5],[88.2,23],[88,21.6],[86.8,20],[85,19.2],[83,17.5],[81.3,16.2],[80.3,15.8],[80.1,13.4],[79.9,11.5],[79.8,10.3],[79.2,9.2],[78.1,8.4],[77.5,8],[76.4,9.5],[75.2,11.8],[74.6,13.5],[73.8,15.5],[73,17.5],[72.8,19],[72.8,21],[72.2,21.2],[70.5,20.8],[69,22.2],[68.2,23.6],[69.5,23.9],[71,24.6],[70,25.7],[70.2,26.5],[71,27.8],[72.5,28.9],[73.5,29.8],[74.5,31],[74.8,32.2],[74.2,33.5],[73.5,35]];
export const CITIES=[{n:'Delhi NCR',lo:77.2,la:28.6},{n:'Mumbai',lo:72.9,la:19.1},{n:'Pune',lo:73.9,la:18.5},{n:'Ahmedabad',lo:72.6,la:23},{n:'Jaipur',lo:75.8,la:26.9},{n:'Lucknow',lo:80.9,la:26.8},{n:'Kolkata',lo:88.4,la:22.6},{n:'Hyderabad',lo:78.5,la:17.4},{n:'Bengaluru',lo:77.6,la:13},{n:'Chennai',lo:80.3,la:13.1}];
export function IndiaMap(){const box=useRef(null),cv=useRef(null),act=useRef(-1),[a,setA]=useState(-1);
 useEffect(()=>{act.current=a},[a]);
 useEffect(()=>{const c=cv.current,b=box.current,ctx=c.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W=0,H=0,dots=[],raf=0,vis=false;
  const P=(lo,la)=>[(lo-67.2)/31*W,(38.2-la)/31*H];
  const inside=(x,y)=>{let r=false;for(let i=0,j=OUT.length-1;i<OUT.length;j=i++){const[p,q]=OUT[i],[s,t]=OUT[j];if((q>y)!==(t>y)&&x<(s-p)*(y-q)/(t-q)+p)r=!r}return r};
  const build=()=>{const r=b.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;ctx.setTransform(d,0,0,d,0,0);dots=[];
   for(let la=37.5;la>=7.5;la-=.55)for(let lo=67.5;lo<=98;lo+=.55)if(inside(lo,la))dots.push(P(lo,la));if(reduce)draw(0)};
  const draw=t=>{ctx.clearRect(0,0,W,H);const [hx,hy]=P(CITIES[0].lo,CITIES[0].la),R=((t/1000)*150)%560;
   for(const [x,y] of dots){const w=Math.max(0,1-Math.abs(Math.hypot(x-hx,y-hy)-R)/70);ctx.fillStyle=`rgba(255,255,255,${.17+w*.6})`;ctx.fillRect(x-1,y-1,2.2,2.2)}
   ctx.font='600 12px "Inter Variable",sans-serif';
   CITIES.forEach((ct,i)=>{const [x,y]=P(ct.lo,ct.la),on=act.current===i;
    if(i){const cx=(hx+x)/2,cy=(hy+y)/2-Math.hypot(x-hx,y-hy)*.28;ctx.beginPath();ctx.moveTo(hx,hy);ctx.quadraticCurveTo(cx,cy,x,y);ctx.strokeStyle=on?'rgba(255,77,90,.95)':'rgba(255,77,90,.22)';ctx.lineWidth=on?1.6:1;ctx.stroke();
     const k=((t/2400)+i*.137)%1,u=1-k,px=u*u*hx+2*u*k*cx+k*k*x,py=u*u*hy+2*u*k*cy+k*k*y;ctx.beginPath();ctx.arc(px,py,2.2,0,7);ctx.fillStyle='#ffd7da';ctx.fill()}
    ctx.beginPath();ctx.arc(x,y,on||!i?5:3.2,0,7);ctx.fillStyle='#e11d2e';ctx.fill();
    if(on||!i){ctx.beginPath();ctx.arc(x,y,9+((t/90)%10),0,7);ctx.strokeStyle='rgba(255,77,90,.35)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#fff';ctx.fillText(ct.n,x+12,y+4)}})};
  let lastFrame=0;
  const loop=t=>{if(!vis){raf=0;return}if(t-lastFrame>=1000/30){draw(t);lastFrame=t}raf=requestAnimationFrame(loop)};
  build();const ro=new ResizeObserver(build);ro.observe(b);
  const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis&&!raf&&!reduce)raf=requestAnimationFrame(loop)});io.observe(b);
  return()=>{ro.disconnect();io.disconnect();cancelAnimationFrame(raf)}},[]);
 return <div className="mapw"><div className="mapc" ref={box}><canvas ref={cv} role="img" aria-label="Dot-matrix map of India connecting major cities"/></div>
  <div className="cities">{CITIES.map((c,i)=><button key={c.n} className={a===i?'on':''} onMouseEnter={()=>setA(i)} onMouseLeave={()=>setA(-1)} onFocus={()=>setA(i)} onBlur={()=>setA(-1)} onClick={()=>setA(a===i?-1:i)}>{c.n}</button>)}</div></div>}
