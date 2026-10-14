import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useInView, animate, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, Check } from 'lucide-react';
export const ease = [.22, 1, .36, 1];
export function useMedia(q) {
  const [v, setV] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches);
  useEffect(() => { const mq = matchMedia(q), f = () => setV(mq.matches); f(); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f) }, [q]); return v
}
export function useTitle(t, d) { useEffect(() => { document.title = t; if (d) document.querySelector('meta[name=description]')?.setAttribute('content', d) }, [t, d]) }
export function Reveal({ children, className, as = 'div' }) {
  const C = as;
  return <C className={className}>{children}</C>
}
export function Magnetic({ children }) { return <span className="mag">{children}</span> }
export function Spot({ children, className = '', ...p }) { return <div className={'spot ' + className} {...p}>{children}</div> }
export function Btn({ to, href, ghost, children, ...p }) {
  const cls = 'btn' + (ghost ? ' ghost' : ''), in_ = <>{children}<ArrowUpRight size={17} /></>;
  return <Magnetic>{to ? <Link to={to} className={cls} {...p}>{in_}</Link> : <a href={href} className={cls} {...p}>{in_}</a>}</Magnetic>
}
export const Eyebrow = ({ children }) => <p className="eyebrow"><span />{children}</p>;
export function Counter({ to, suffix = '' }) {
  const r = useRef(null), v = useInView(r, { once: true }), [n, setN] = useState(0);
  useEffect(() => { if (!v) return; const c = animate(0, to, { duration: 1.8, ease, onUpdate: x => setN(Math.round(x)) }); return () => c.stop() }, [v, to]); return <span ref={r}>{n}{suffix}</span>
}
export function Marquee({ items }) { const l = [...items, ...items]; return <div className="marq" aria-hidden="true"><div className="marq-in">{l.map((t, i) => <span key={i}>{t}<i /></span>)}</div></div> }
export const Jaali = () => <div className="jaali" aria-hidden="true" />;
function W({ p, a, b, children }) { const o = useTransform(p, [a, b], [.14, 1]); return <m.span style={{ opacity: o }}>{children} </m.span> }
export function ScrollText({ text }) {
  const r = useRef(null), { scrollYProgress: p } = useScroll({ target: r, offset: ['start 85%', 'end 50%'] }), w = text.split(' ');
  return <p ref={r} className="stext" aria-label={text}>{w.map((x, i) => <W key={i} p={p} a={i / w.length} b={(i + 1) / w.length}>{x}</W>)}</p>
}
export function IndexList({ items }) {
  const [o, setO] = useState(0);
  return <ul className="idx">{items.map((it, i) => <li key={it.title} className={i === o ? 'open' : ''}>
    <button onClick={() => setO(o === i ? -1 : i)} aria-expanded={i === o}><span className="no">{String(i + 1).padStart(2, '0')}</span><span className="tt">{it.title}</span><span className="tg">{it.tag}</span>
      <m.span className="pl" animate={{ rotate: i === o ? 45 : 0 }}><Plus size={22} /></m.span></button>
    <AnimatePresence initial={false}>{i === o && <m.div className="idx-b" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .5, ease }}>
      <div className="idx-bi"><div><p>{it.desc}</p>{it.stack && <div className="chips">{it.stack.map(s => <span key={s}>{s}</span>)}</div>}</div>
        <ul>{it.pts.map(p => <li key={p}><Check size={16} />{p}</li>)}</ul></div></m.div>}</AnimatePresence></li>)}</ul>
}
// ---- simple India map ----
const OUT = [[74.3, 37], [77.8, 35.5], [79, 32.5], [80.2, 30.5], [81, 30.1], [80.1, 28.8], [84, 27.3], [88.1, 26.4], [88.9, 27.3], [92, 27.8], [95, 29.2], [97.3, 28.2], [96, 26.8], [95, 25.3], [94.6, 23.5], [93.4, 22], [92.3, 23.2], [92.2, 24.4], [91.5, 25.1], [90, 25.1], [89, 25.3], [88.4, 24.5], [88.2, 23], [88, 21.6], [86.8, 20], [85, 19.2], [83, 17.5], [81.3, 16.2], [80.3, 15.8], [80.1, 13.4], [79.9, 11.5], [79.8, 10.3], [79.2, 9.2], [78.1, 8.4], [77.5, 8], [76.4, 9.5], [75.2, 11.8], [74.6, 13.5], [73.8, 15.5], [73, 17.5], [72.8, 19], [72.8, 21], [72.2, 21.2], [70.5, 20.8], [69, 22.2], [68.2, 23.6], [69.5, 23.9], [71, 24.6], [70, 25.7], [70.2, 26.5], [71, 27.8], [72.5, 28.9], [73.5, 29.8], [74.5, 31], [74.8, 32.2], [74.2, 33.5], [73.5, 35]];
export const CITIES = [{ n: 'Delhi NCR', lo: 77.2, la: 28.6 }, { n: 'Mumbai', lo: 72.9, la: 19.1 }, { n: 'Pune', lo: 73.9, la: 18.5 }, { n: 'Ahmedabad', lo: 72.6, la: 23 }, { n: 'Jaipur', lo: 75.8, la: 26.9 }, { n: 'Lucknow', lo: 80.9, la: 26.8 }, { n: 'Kolkata', lo: 88.4, la: 22.6 }, { n: 'Hyderabad', lo: 78.5, la: 17.4 }, { n: 'Bengaluru', lo: 77.6, la: 13 }, { n: 'Chennai', lo: 80.3, la: 13.1 }];
const project = (lo, la) => [(lo - 67.2) * 10, (38.2 - la) * 10];
const outline = OUT.map(([lo, la], i) => `${i ? 'L' : 'M'}${project(lo, la).join(' ')}`).join(' ') + 'Z';
export function IndiaMap() {
  const [active, setActive] = useState(-1);
  return <div className="mapw">
    <div className="mapc">
      <svg className="india-map" viewBox="0 0 310 310" role="img" aria-label="Simple map of India with major cities marked">
        <path className="india-outline" d={outline} />
        {CITIES.map((city, i) => {
          const [x, y] = project(city.lo, city.la);
          return <circle key={city.n} className={active === i ? 'india-city active' : 'india-city'} cx={x} cy={y} r={active === i ? 4 : 2.5}>
            <title>{city.n}</title>
          </circle>
        })}
      </svg>
    </div>
    <div className="cities">{CITIES.map((city, i) => <button key={city.n} className={active === i ? 'on' : ''} aria-pressed={active === i} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} onFocus={() => setActive(i)} onBlur={() => setActive(-1)} onClick={() => setActive(active === i ? -1 : i)}>{city.n}</button>)}</div>
  </div>
}
