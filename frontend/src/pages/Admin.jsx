import API_URL from '../api';
import {useCallback,useEffect,useState} from 'react';
import {m,AnimatePresence} from 'framer-motion';
const api=(u,o={})=>fetch(u,{credentials:'same-origin',headers:{'Content-Type':'application/json'},...o});
const ST=['new','contacted','qualified','won','lost'];
function Login({onOk}){const [pw,setPw]=useState(''),[e,setE]=useState('');
 return <div className="adm-login"><img src="/logo.svg" width="200" height="46" alt="Ethixweb"/><form className="card form" onSubmit={async ev=>{ev.preventDefault();const r=await api(`${API_URL}/api/admin/login`,{method:'POST',body:JSON.stringify({password:pw})});r.ok?onOk():setE((await r.json()).error||'Failed')}}>
 <h1>Admin sign in</h1><label>Password<input type="password" value={pw} onChange={x=>setPw(x.target.value)} autoComplete="current-password" required/></label><button className="btn full">Sign in</button><p className="bad" role="status">{e}</p></form></div>}
function Row({l,reload}){const [n,setN]=useState(l.notes||'');const save=async b=>{await api(`${API_URL}/api/admin/leads/`+l.id,{method:'PATCH',body:JSON.stringify(b)});reload()};
 return <m.article layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="card lead-card">
 <div className="top"><strong>{l.name}{l.company?' · '+l.company:''}</strong><small>{new Date(l.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} IST</small></div>
 <small>{[l.service,l.budget,l.city].filter(Boolean).join(' · ')}</small>
 <div><a href={'mailto:'+l.email}>{l.email}</a> · <a href={'tel:'+l.phone}>{l.phone}</a></div><p className="msg">{l.message}</p>
 <div className="ctl"><select value={l.status} onChange={e=>save({status:e.target.value})} aria-label="Status">{ST.map(s=><option key={s}>{s}</option>)}</select>
 <input value={n} onChange={e=>setN(e.target.value)} onBlur={()=>n!==(l.notes||'')&&save({notes:n})} placeholder="Notes" aria-label="Notes"/>
 <button className="btn ghost sm" onClick={async()=>{if(confirm('Delete this lead?')){await api(`${API_URL}/api/admin/leads/`+l.id,{method:'DELETE'});reload()}}}>Delete</button></div></m.article>}
export default function Admin(){const [ok,setOk]=useState(null),[d,setD]=useState({leads:[],counts:[]}),[q,setQ]=useState(''),[f,setF]=useState('');
 useEffect(()=>{document.title='Leads – Ethixweb admin';let m=document.querySelector('meta[name=robots]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m)}m.content='noindex,nofollow'},[]);
 const load=useCallback(async()=>{const r=await api(`${API_URL}/api/admin/leads?`+new URLSearchParams({q,status:f}));if(r.status===401){setOk(false);return}setD(await r.json());setOk(true)},[q,f]);
 useEffect(()=>{const t=setTimeout(load,200);return()=>clearTimeout(t)},[load]);
 if(ok===null)return null;if(!ok)return <Login onOk={()=>load()}/>;
 return <div className="wrap adm"><div className="adm-h"><img src="/logo.svg" width="180" height="42" alt="Ethixweb"/><div><a className="btn ghost sm" href={`${API_URL}/api/admin/export.csv`}>Export CSV</a> <button className="btn sm" onClick={async()=>{await api(`${API_URL}/api/admin/logout`,{method:'POST'});setOk(false)}}>Sign out</button></div></div>
 <h1>Leads</h1><div className="chips"><span>Total {d.leads.length}</span>{d.counts.map(c=><span key={c.status}>{c.status}: {c.n}</span>)}</div>
 <div className="bar"><input type="search" placeholder="Search name, email, phone…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search"/><select value={f} onChange={e=>setF(e.target.value)} aria-label="Filter status"><option value="">All statuses</option>{ST.map(s=><option key={s}>{s}</option>)}</select></div>
 <div className="list"><AnimatePresence>{d.leads.map(l=><Row key={l.id} l={l} reload={load}/>)}</AnimatePresence>{!d.leads.length&&<p className="mu">No leads yet.</p>}</div></div>}
