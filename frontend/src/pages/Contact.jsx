import {useEffect,useRef,useState} from 'react';
import {m,AnimatePresence} from 'framer-motion';
import {Check} from 'lucide-react';
import {Eyebrow,Jaali,ease,useTitle} from '../ui.jsx';
const SV=['AI Receptionist & WhatsApp Agents','AI Automation','Website Design & Development','Web Applications','CRM & Integrations','SEO & Local SEO','Ads & Performance Marketing','Maintenance & Support','Not sure yet'];
const BU=['Under ₹50,000','₹50,000 – ₹2 lakh','₹2 – ₹5 lakh','₹5 lakh+','Not decided'];
const Err=({e})=><AnimatePresence>{e&&<m.small className="err" initial={{opacity:0,y:-4,height:0}} animate={{opacity:1,y:0,height:'auto'}} exit={{opacity:0,height:0}}>{e}</m.small>}</AnimatePresence>;
const Choice=({name,opts,val,set})=><div className="choice" role="radiogroup" aria-label={name}>{opts.map(o=><button type="button" role="radio" aria-checked={val===o} key={o} className={val===o?'on':''} onClick={()=>set(val===o?'':o)}>{val===o&&<m.span layoutId={'ch-'+name} className="pill" transition={{type:'spring',stiffness:420,damping:34}}/>}<span>{o}</span></button>)}</div>;
export default function Contact(){useTitle('Contact – Ethixweb India','Tell us about your project. Replies within the hour on working days, IST.');
 const [tok,setTok]=useState(''),[cfg,setCfg]=useState({}),[errs,setErrs]=useState({}),[st,setSt]=useState({s:'idle',m:''}),[svc,setSvc]=useState(''),[bud,setBud]=useState(''),f=useRef(null);
 const gt=()=>fetch('/api/form-token').then(r=>r.json()).then(j=>setTok(j.token)).catch(()=>{});
 useEffect(()=>{gt();fetch('/api/config').then(r=>r.json()).then(c=>{setCfg(c);if(c.turnstileSiteKey){const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js';s.async=true;document.head.appendChild(s)}}).catch(()=>{})},[]);
 const submit=async e=>{e.preventDefault();setErrs({});setSt({s:'sending',m:''});const fm=f.current,d=Object.fromEntries(new FormData(fm));d.consent=fm.consent.checked;d.token=tok;d.service=svc;d.budget=bud;
  try{const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}),j=await r.json();
   if(r.ok){setSt({s:'done',m:''})}else{setErrs(j.errors||{});setSt({s:'idle',m:j.error||'Could not send.'});gt()}}
  catch{setSt({s:'idle',m:'Network error. Please try again.'})}};
 return <><section className="hero sm"><Jaali/><div className="wrap"><Eyebrow>Contact</Eyebrow><h1>Let's build something <em>remarkable.</em></h1></div></section>
 <section className="sec tight"><div className="wrap two form-g">
 <aside><p className="lead">Tell us a little about your business. A senior member of our team replies within the hour, Mon–Sat, 10:00–19:00 IST.</p>
  <ul className="assure">{['Free, no-obligation consultation','Fixed ₹ quote with GST invoice','Reply within the hour on working days'].map(t=><li key={t}><Check size={16}/>{t}</li>)}</ul>
  <p><a className="link" href="mailto:info@ethixweb.com">info@ethixweb.com</a></p></aside>
 <div className="formc"><AnimatePresence mode="wait">{st.s==='done'?
  <m.div key="ok" className="done" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{ease,duration:.5}}>
   <svg width="76" height="76" viewBox="0 0 72 72" aria-hidden="true"><m.circle cx="36" cy="36" r="32" fill="none" stroke="#e11d2e" strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.7}}/><m.path d="M22 37l10 10 18-21" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.5,delay:.5}}/></svg>
   <h2>Thank you.</h2><p className="mu">We have your enquiry and will reach out within the hour on working days (IST).</p></m.div>:
  <m.form key="f" ref={f} onSubmit={submit} noValidate className="form" exit={{opacity:0}}>
  <label className="fld"><input name="name" placeholder=" " required maxLength="100" autoComplete="name"/><span>Full name *</span><Err e={errs.name}/></label>
  <label className="fld"><input name="email" type="email" placeholder=" " required maxLength="150" autoComplete="email"/><span>Work email *</span><Err e={errs.email}/></label>
  <label className="fld"><input name="phone" type="tel" inputMode="numeric" placeholder=" " required autoComplete="tel"/><span>Mobile number (+91) *</span><Err e={errs.phone}/></label>
  <div className="row2"><label className="fld"><input name="company" placeholder=" " maxLength="120" autoComplete="organization"/><span>Company</span></label><label className="fld"><input name="city" placeholder=" " maxLength="80"/><span>City</span></label></div>
  <div><p className="gl">I'm interested in *</p><Choice name="service" opts={SV} val={svc} set={setSvc}/><Err e={errs.service}/></div>
  <div><p className="gl">Budget</p><Choice name="budget" opts={BU} val={bud} set={setBud}/></div>
  <label className="fld"><textarea name="message" rows="4" placeholder=" " required maxLength="2000"/><span>How can we help? *</span><Err e={errs.message}/></label>
  <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex="-1" autoComplete="off"/></label></div>
  {cfg.turnstileSiteKey&&<div className="cf-turnstile" data-sitekey={cfg.turnstileSiteKey}/>}
  <label className="chk"><input type="checkbox" name="consent"/><span>I agree to be contacted and to the processing of my data as per the privacy notice (DPDP Act, 2023).</span></label><Err e={errs.consent}/>
  <button className="btn full" type="submit" disabled={st.s==='sending'}>{st.s==='sending'?'Sending…':'Send enquiry'}</button>
  <p role="status" aria-live="polite" className="bad">{st.m}</p></m.form>}</AnimatePresence></div></div></section></>}
