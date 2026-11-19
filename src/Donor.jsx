import {useState,useEffect} from 'react'
import {TYPES,PLACES} from './data'
import {makeListing} from './match'
import {useApp} from './store'
import {Countdown} from './Countdown'
export default function Donor({go}){
 const {addListing}=useApp()
 const [f,setF]=useState({type:'cooked',quantity:30,time:new Date().toTimeString().slice(0,5),place:Object.keys(PLACES)[0],isEvent:false,pickupAt:'22:30',photo:null})
 const [ai,setAi]=useState(null),[posted,setPosted]=useState(null),set=(k,v)=>setF(o=>({...o,[k]:v}))
 useEffect(()=>{if(ai!=='loading')return;const t=setTimeout(()=>setAi('done'),2000);return()=>clearTimeout(t)},[ai])
 const pick=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{set('photo',r.result);setAi('loading')};r.readAsDataURL(file)}
 const post=()=>{const[h,m]=f.time.split(':'),d=new Date();d.setHours(+h,+m,0,0)
  const l=makeListing({id:'L'+Date.now(),type:f.type,quantity:+f.quantity,cookedAt:Math.min(d.getTime(),Date.now()),place:f.place,isEvent:f.isEvent,pickupAt:f.isEvent?f.pickupAt:'',photo:f.photo})
  addListing(l);setPosted(l)}
 if(posted)return<section className="panel ok"><h2>Posted. Nearby NGOs are being notified.</h2><Countdown until={posted.safeUntil}/>
  <p>{posted.quantity} meals of {TYPES[posted.type].label.toLowerCase()} from {posted.address}.</p>
  <button className="btn" onClick={go}>View on NGO map</button> <button className="btn ghost" onClick={()=>{setPosted(null);setAi(null);set('photo',null)}}>Post more food</button></section>
 return<section className="panel"><h2>Post surplus food</h2>
  <label className="drop">{f.photo?<img src={f.photo} alt="Food preview"/>:<span>Tap to add a photo of the food</span>}<input type="file" accept="image/*" onChange={pick}/></label>
  {ai==='loading'&&<p className="ai">Checking freshness...</p>}
  {ai==='done'&&<p className="ai done"><b>AI food check (prototype):</b> {TYPES[f.type].ai}. Safe for {TYPES[f.type].hrs} hours.</p>}
  <div className="grid">
   <label>Food type<select value={f.type} onChange={e=>set('type',e.target.value)}>{Object.entries(TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label>
   <label>Meals<input type="number" min="1" value={f.quantity} onChange={e=>set('quantity',e.target.value)}/></label>
   <label>Cooked at<input type="time" value={f.time} onChange={e=>set('time',e.target.value)}/></label>
   <label>Pickup address<select value={f.place} onChange={e=>set('place',e.target.value)}>{Object.keys(PLACES).map(p=><option key={p}>{p}</option>)}</select></label></div>
  <label className="row"><input type="checkbox" checked={f.isEvent} onChange={e=>set('isEvent',e.target.checked)}/> Event mode: schedule an end-of-night pickup</label>
  {f.isEvent&&<label>Pickup time<input type="time" value={f.pickupAt} onChange={e=>set('pickupAt',e.target.value)}/></label>}
  <button className="btn" disabled={!f.quantity||f.quantity<1} onClick={post}>Post surplus food</button></section>}
