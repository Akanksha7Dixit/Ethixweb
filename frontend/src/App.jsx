import {lazy,Suspense,useEffect,useRef} from 'react';
import {Routes,Route,useLocation,Link} from 'react-router-dom';
import {LazyMotion,MotionConfig,m} from 'framer-motion';
import {Nav,Footer} from './Layout.jsx';import Home from './pages/Home.jsx';import {useTitle,ease} from './ui.jsx';
const Services=lazy(()=>import('./pages/Services.jsx')),About=lazy(()=>import('./pages/About.jsx')),Contact=lazy(()=>import('./pages/Contact.jsx')),Admin=lazy(()=>import('./pages/Admin.jsx'));
const load=()=>import('./features.js').then(r=>r.default);
function NotFound(){useTitle('Page not found – Ethixweb');return <section className="hero sm"><div className="wrap"><h1>Page not <em>found.</em></h1><p className="lead">The page you were looking for does not exist.</p><Link className="btn" to="/">Back home</Link></div></section>}
export default function App(){const loc=useLocation(),first=useRef(true);
 useEffect(()=>{window.scrollTo(0,0);first.current=false},[loc.pathname]);const admin=loc.pathname.startsWith('/admin');
 return <MotionConfig reducedMotion="user"><LazyMotion features={load}>
 {!admin&&<Nav/>}
 {!first.current&&!admin&&<m.div key={'c'+loc.pathname} className="curtain" initial={{scaleY:1}} animate={{scaleY:0}} transition={{duration:.9,ease}}/>}
 <m.main id="main" key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5}}>
 <Suspense fallback={null}><Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></m.main>
 {!admin&&<Footer/>}</LazyMotion></MotionConfig>}
