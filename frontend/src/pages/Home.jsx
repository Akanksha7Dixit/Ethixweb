import {Btn,Eyebrow,IndexList,IndiaMap,useTitle} from '../ui.jsx';
import {services,work} from '../data.js';
import {Icon} from '../icons.jsx';

const steps=[
 ['Discover','A free 30-minute call to understand your customers, your city and your goals.'],
 ['Design','A clear scope and a fixed ₹ quote with GST, agreed before we start.'],
 ['Build','Regular demos over WhatsApp or video, so you see progress early.'],
 ['Launch & grow','Go-live, training, then ongoing support and optimisation.']
];
const principles=[
 ['Mobile-first, low-bandwidth ready','Most Indian traffic is mobile. We design for it first and keep pages light.'],
 ['Local payments & tools','UPI, Razorpay, Tally, Zoho and WhatsApp Business API: the stack your customers expect.'],
 ['Privacy by default','Consent-led forms and data handling aligned with the DPDP Act.']
];

export default function Home(){
 useTitle('Ethixweb India – Digital operations for growing businesses.');
 return <>
  <section className="hero">
   <div className="wrap home-hero">
    <Eyebrow>Digital operations · Built for India</Eyebrow>
    <h1>Digital operations<br/><em>for growing businesses.</em></h1>
    <p className="lead">From WhatsApp AI agents and CRM integrations to fast websites, SEO and ads: one senior team that understands how Indian customers actually buy, call and pay.</p>
    <div className="row"><Btn to="/contact">Get a free consultation</Btn><Btn to="/services" ghost>Explore services</Btn></div>
   </div>
  </section>

  <section className="sec">
   <div className="wrap narrow">
    <Eyebrow>Our belief</Eyebrow>
    <h2>Your senior technology team, <em>without the agency runaround.</em></h2>
    <p className="lead">We answer the call, fix the site, connect your CRM and help every advertising rupee work harder.</p>
    <Btn to="/about" ghost>Our India story</Btn>
   </div>
  </section>

  <section className="sec">
   <div className="wrap">
    <Eyebrow>What we do</Eyebrow>
    <h2>One team for your <em>digital operation.</em></h2>
    <div className="simple-services">{services.map((service,i)=><article className="simple-service" key={service.id}>
     <span className="service-number">{String(i+1).padStart(2,'0')}</span>
     <Icon n={service.icon}/>
     <h3>{service.title}</h3>
     <p>{service.desc}</p>
     <small>{service.cat}</small>
    </article>)}</div>
    <div className="row"><Btn to="/services" ghost>View all services</Btn></div>
   </div>
  </section>

  <section className="sec">
   <div className="wrap two">
    <div><Eyebrow>How we work</Eyebrow><h2>A simple process, <em>no surprises.</em></h2><p className="lead">Fixed quotes, regular demos and one accountable team from first call to long-term support.</p></div>
    <ol className="simple-steps">{steps.map(([title,desc],i)=><li key={title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{desc}</p></div></li>)}</ol>
   </div>
  </section>

  <section className="sec">
   <div className="wrap">
    <Eyebrow>Featured work</Eyebrow>
    <h2>Blueprints for <em>Indian</em> businesses.</h2>
    <IndexList items={work.map(item=>({title:item.title,tag:item.tab,desc:item.desc,pts:item.pts,stack:item.stack}))}/>
    <p className="note">Illustrative blueprints of what we build. Detailed case studies are shared on request.</p>
   </div>
  </section>

  <section className="sec">
   <div className="wrap two">
    <div><Eyebrow>Across India</Eyebrow><h2>From metros to <em>growing</em> cities.</h2><p className="lead">One responsive digital operations layer for teams in Delhi NCR, Mumbai, Bengaluru, Hyderabad and beyond. Select a city to trace the connection.</p></div>
    <IndiaMap/>
   </div>
  </section>

  <section className="sec">
   <div className="wrap">
    <Eyebrow>Why Ethixweb</Eyebrow>
    <h2>A global team that works like your <em>in-house</em> India team.</h2>
    <div className="simple-metrics">
     <div><b>50+</b><span>projects delivered</span></div>
     <div><b>&lt;1h</b><span>average response</span></div>
     <div><b>IST</b><span>support hours, 24/7 monitoring</span></div>
     <div><b>₹ + GST</b><span>transparent pricing &amp; invoices</span></div>
    </div>
    <div className="simple-principles">{principles.map(([title,desc],i)=><article key={title}><h3><span>0{i+1}</span> {title}</h3><p>{desc}</p></article>)}</div>
   </div>
  </section>

  <section className="sec">
   <div className="wrap simple-cta">
    <h2>Ready to grow? <em>Let's talk.</em></h2>
    <p>A senior member of our team replies within the hour on working days.</p>
    <Btn to="/contact">Start a project</Btn>
   </div>
  </section>
 </>;
}
