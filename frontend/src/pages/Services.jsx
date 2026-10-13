import {useState} from 'react';
import {m} from 'framer-motion';
import {Reveal,Btn,Eyebrow,Jaali,IndexList,useTitle} from '../ui.jsx';import {services} from '../data.js';
const cats=['All','AI','Web','Growth','Support'];
export default function Services(){useTitle('Services – Ethixweb India','AI agents, websites, web apps, CRM, SEO, ads and support for Indian businesses.');const [c,setC]=useState('All');
 const items=services.filter(s=>c==='All'||s.cat===c).map(s=>({title:s.title,tag:s.cat,desc:s.desc,pts:s.pts}));
 return <><section className="hero sm"><Jaali/><div className="wrap"><Eyebrow>Services</Eyebrow><h1>One accountable team for your <em>digital operation.</em></h1>
 <p className="lead">Pick one service or let us run the whole stack. Every engagement includes a fixed ₹ quote, a GST invoice and a named point of contact.</p></div></section>
 <section className="sec tight"><div className="wrap"><div className="tabs" role="tablist">{cats.map(k=><button role="tab" aria-selected={k===c} key={k} className={k===c?'on':''} onClick={()=>setC(k)}>{k===c&&<m.span layoutId="stab" className="pill" transition={{type:'spring',stiffness:420,damping:34}}/>}<span>{k}</span></button>)}</div>
 <IndexList key={c} items={items}/></div></section>
 <section className="sec cta-s"><div className="wrap"><Reveal className="cta"><h2>Not sure what you <em>need?</em></h2><p>Book a free consultation and we'll recommend the simplest path.</p><Btn to="/contact">Talk to us</Btn></Reveal></div></section></>}
