import {lazy,Suspense,useEffect} from 'react';
import {Routes,Route,useLocation,Link} from 'react-router-dom';
import {LazyMotion,MotionConfig} from 'framer-motion';
import {Nav,Footer} from './Layout.jsx';import Home from './pages/Home.jsx';import {useTitle} from './ui.jsx';
const Services=lazy(()=>import('./pages/Services.jsx')),About=lazy(()=>import('./pages/About.jsx')),Contact=lazy(()=>import('./pages/Contact.jsx')),Admin=lazy(()=>import('./pages/Admin.jsx'));
const load=()=>import('./features.js').then(r=>r.default);
function NotFound(){useTitle('Page not found – Ethixweb');return <section className="hero sm"><div className="wrap"><h1>Page not <em>found.</em></h1><p className="lead">The page you were looking for does not exist.</p><Link className="btn" to="/">Back home</Link></div></section>}
export default function App(){const loc=useLocation();
 useEffect(()=>{window.scrollTo(0,0)},[loc.pathname]);const admin=loc.pathname.startsWith('/admin');
 return <MotionConfig reducedMotion="user"><LazyMotion features={load}>
 {!admin&&<Nav/>}
 <main id="main" key={loc.pathname}>
 <Suspense fallback={null}><Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></main>
 {!admin&&<Footer/>}</LazyMotion></MotionConfig>}
