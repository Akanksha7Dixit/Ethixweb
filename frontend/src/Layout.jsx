import {useEffect,useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {m,AnimatePresence} from 'framer-motion';
import {Menu,X} from 'lucide-react';
import {Btn,ease} from './ui.jsx';
const links=[['/','Home'],['/services','Services'],['/about','About'],['/contact','Contact']];
export function Nav(){const [open,setOpen]=useState(false),loc=useLocation(),[sc,setSc]=useState(false);
 useEffect(()=>{setOpen(false)},[loc.pathname]);
 useEffect(()=>{const f=()=>setSc(window.scrollY>40);f();window.addEventListener('scroll',f,{passive:true});return()=>window.removeEventListener('scroll',f)},[]);
 useEffect(()=>{document.body.style.overflow=open?'hidden':''},[open]);
 return <>
 <header className={'nav'+(sc?' scrolled':'')}><div className="wrap nav-in">
  <Link to="/" aria-label="Ethixweb home"><img src="/logo.svg" width="180" height="44" alt="Ethixweb"/></Link>
  <nav className="nav-links" aria-label="Primary">{links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'}>{({isActive})=><span>{l}{isActive&&<m.i layoutId="navpill" className="navpill" transition={{type:'spring',stiffness:420,damping:34}}/>}</span>}</NavLink>)}</nav>
  <div className="nav-r"><span className="hide-m"><Btn to="/contact">Start a project</Btn></span>
  <button className="burger" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button></div></div></header>
 <AnimatePresence>{open&&<m.div className="sheet" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}>
  {links.map(([to,l],i)=><m.div key={to} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.08*i+.1,duration:.6,ease}}><Link to={to}>{l}</Link></m.div>)}
  <m.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}><Btn to="/contact">Start a project</Btn></m.div></m.div>}</AnimatePresence></>}
export function Footer(){return <footer className="foot"><div className="wrap">
 <img className="foot-big" src="/logo.svg" alt="Ethixweb" aria-label="Ethixweb"/>
 <div className="foot-grid"><div><img src="/logo.svg" width="170" height="40" alt="Ethixweb" loading="lazy"/><p className="mu">The technology team behind Indian businesses that want to grow online.</p></div>
 <div><h3>Explore</h3><Link to="/services">Services</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div>
 <div><h3>Reach us</h3><a href="mailto:info@ethixweb.com">info@ethixweb.com</a><span className="mu">Mon–Sat · 10:00–19:00 IST</span></div></div>
 <div className="foot-bar"><span>© {new Date().getFullYear()} Ethixweb. Part of the Ethixweb global team.</span><span>Data handled per India's DPDP Act, 2023.</span></div></div></footer>}
