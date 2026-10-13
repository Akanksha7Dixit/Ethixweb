import {useEffect,useRef,useState} from 'react';
import {m,useScroll,useTransform,useSpring} from 'framer-motion';
import {Reveal,Spot,Counter,Marquee,Btn,Eyebrow,Jaali,IndexList,IndiaMap,ScrollText,useMedia,ease,useTitle} from '../ui.jsx';
import {services,work,tools} from '../data.js';import {Icon} from '../icons.jsx';
const Words=({text,delay=0})=><span aria-label={text}>{text.split(' ').map((w,i)=><span className="wm" aria-hidden="true" key={i}><m.span initial={{y:'108%'}} animate={{y:0}} transition={{duration:.9,ease,delay:delay+i*.07}}>{w}</m.span>{' '}</span>)}</span>;
const chat=[['in','Hi, is a slot free tomorrow evening?'],['out','Namaste! Yes, 5:30 PM is open. Shall I book it?'],['in','Please do 🙏'],['out','Booked ✅ You will get a reminder on WhatsApp.']];
function ChatCard(){const [n,setN]=useState(1),rx=useSpring(0,{stiffness:140,damping:16}),ry=useSpring(0,{stiffness:140,damping:16});
 useEffect(()=>{const t=setInterval(()=>setN(x=>x>=chat.length+2?1:x+1),1700);return()=>clearInterval(t)},[]);
 const mv=e=>{const b=e.currentTarget.getBoundingClientRect();rx.set(-((e.clientY-b.top)/b.height-.5)*10);ry.set(((e.clientX-b.left)/b.width-.5)*12)};
 return <div className="chat-w"><m.div className="chat" style={{rotateX:rx,rotateY:ry,transformPerspective:900}} onMouseMove={mv} onMouseLeave={()=>{rx.set(0);ry.set(0)}} initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:1.1,ease,delay:.6}} aria-label="Illustrative WhatsApp booking demo">
  <div className="chat-h"><i/><div><b>Clinic assistant</b><small>Illustrative demo · AI agent</small></div></div>
  <div className="chat-b">{chat.slice(0,n).map(([d,t],i)=><m.p key={i} className={d} initial={{opacity:0,scale:.9,y:10}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.4,ease}}>{t}</m.p>)}</div></m.div>
  <m.span className="float f1" animate={{y:[0,-9,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}>✓ Lead qualified</m.span>
  <m.span className="float f2" animate={{y:[0,9,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>₹ UPI payment link sent</m.span></div>}
function Reel(){const r=useRef(null),t=useRef(null),desk=useMedia('(min-width:980px)'),[mx,setMx]=useState(0),{scrollYProgress:p}=useScroll({target:r,offset:['start start','end end']});
 useEffect(()=>{const f=()=>t.current&&setMx(Math.max(0,t.current.scrollWidth-window.innerWidth+40));f();window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f)},[desk]);
 const x=useTransform(p,[0,1],[0,-mx]);
 return <section className="reel" ref={r} style={desk?{height:`calc(100vh + ${mx}px)`}:undefined}><div className="reel-st"><div className="wrap reel-h"><Reveal><Eyebrow>What we do</Eyebrow><h2>Senior operators for the systems that <em>grow</em> your business.</h2></Reveal><div className="reel-bar"><m.i style={{scaleX:p}}/></div></div>
  <m.div className="reel-t" ref={t} style={desk?{x}:undefined}>{services.map((s,i)=><Spot className="rc" key={s.id}><span className="rc-n">{String(i+1).padStart(2,'0')}</span><Icon n={s.icon}/><h3>{s.title}</h3><p>{s.desc}</p><small>{s.cat}</small></Spot>)}<div className="rc-end"><Btn to="/services">All services</Btn></div></m.div></div></section>}
const steps=[['Discover','A free 30-minute call to understand your customers, your city and your goals.'],['Design','A clear scope and a fixed ₹ quote with GST, agreed before we start.'],['Build','Regular demos over WhatsApp or video, so you see progress early.'],['Launch & grow','Go-live, training, then ongoing support and optimisation.']];
function SC({i,p,s}){const sc=useTransform(p,[i/steps.length,1],[1,1-(steps.length-1-i)*.04]);return <div className="pc-w" style={{'--i':i}}><m.div className="pc" style={{scale:sc}}><b>0{i+1}</b><div><h3>{s[0]}</h3><p>{s[1]}</p></div></m.div></div>}
function Stack(){const r=useRef(null),{scrollYProgress:p}=useScroll({target:r,offset:['start start','end end']});return <div className="stack" ref={r}>{steps.map((s,i)=><SC key={i} i={i} p={p} s={s}/>)}</div>}
export default function Home(){useTitle('Ethixweb India – We run the tech. You run the business.');
 const {scrollY}=useScroll(),y1=useTransform(scrollY,[0,700],[0,140]),y2=useTransform(scrollY,[0,700],[0,-90]);
 return <>
 <section className="hero"><Jaali/><m.div className="aurora a1" style={{y:y1}}/><m.div className="aurora a2" style={{y:y2}}/>
 <div className="wrap hero-g"><div>
  <m.p className="eyebrow" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}><span/>Digital operations · Built for India</m.p>
  <h1><Words text="We run the tech."/><br/><em><Words text="You run the business." delay={.3}/></em></h1>
  <m.p className="lead" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.9,ease,delay:.8}}>From WhatsApp AI agents and CRM integrations to fast websites, SEO and ads: one senior team that understands how Indian customers actually buy, call and pay.</m.p>
  <m.div className="row" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.9,ease,delay:.95}}><Btn to="/contact">Get a free consultation</Btn><Btn to="/services" ghost>Explore services</Btn></m.div></div>
  <ChatCard/></div>
  <Marquee items={tools}/></section>

 <section className="sec light"><div className="wrap narrow"><Eyebrow>Our belief</Eyebrow>
  <ScrollText text="We are not another agency. We are the senior technology team behind Indian businesses: the people who answer the call, fix the site, wire the CRM and make every advertising rupee work harder."/>
  <Reveal><Btn to="/about" ghost>Our India story</Btn></Reveal></div></section>

 <Reel/>

 <section className="sec light"><div className="wrap two"><Reveal className="sticky-h"><Eyebrow>How we work</Eyebrow><h2>A simple process, <em>no surprises.</em></h2><p className="lead">Fixed quotes, regular demos and one accountable team from first call to long-term support.</p></Reveal><Stack/></div></section>

 <section className="sec"><div className="wrap"><Reveal><Eyebrow>Featured work</Eyebrow><h2>Blueprints for <em>Indian</em> businesses.</h2></Reveal>
  <Reveal><IndexList items={work.map(w=>({title:w.title,tag:w.tab,desc:w.desc,pts:w.pts,stack:w.stack}))}/></Reveal>
  <p className="note">Illustrative blueprints of what we build. Detailed case studies are shared on request.</p></div></section>

 <section className="sec deep"><div className="wrap two"><Reveal><Eyebrow>Across India</Eyebrow><h2>From metros to <em>growing</em> cities.</h2><p className="lead">One responsive digital operations layer for teams in Delhi NCR, Mumbai, Bengaluru, Hyderabad and beyond. Hover a city to trace the connection.</p></Reveal><Reveal delay={.1}><IndiaMap/></Reveal></div></section>

 <section className="sec light"><div className="wrap"><Reveal><Eyebrow>Why Ethixweb</Eyebrow><h2>A global team that works like your <em>in-house</em> India team.</h2></Reveal>
  <div className="ledger"><Reveal><b><Counter to={50} suffix="+"/></b><span>projects delivered</span></Reveal><Reveal delay={.08}><b>&lt;1h</b><span>average response</span></Reveal><Reveal delay={.16}><b>IST</b><span>support hours, 24/7 monitoring</span></Reveal><Reveal delay={.24}><b>₹ + GST</b><span>transparent pricing &amp; invoices</span></Reveal></div>
  <div className="pillars">{[['Mobile-first, low-bandwidth ready','Most Indian traffic is mobile. We design for it first and keep pages light.'],['Local payments & tools','UPI, Razorpay, Tally, Zoho and WhatsApp Business API: the stack your customers expect.'],['Privacy by default','Consent-led forms and data handling aligned with the DPDP Act.']].map(([t,d],i)=><Reveal key={t} delay={i*.08}><h3><em>0{i+1}</em> {t}</h3><p>{d}</p></Reveal>)}</div></div></section>

 <section className="sec cta-s"><div className="wrap"><Reveal className="cta"><h2>Ready to grow? <em>Let's talk.</em></h2><p>Tell us about your business. A senior member of our team replies within the hour on working days.</p><Btn to="/contact">Start a project</Btn></Reveal></div></section></>}
