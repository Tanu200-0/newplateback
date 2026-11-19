import {useState,useEffect,useRef} from 'react'
import {useApp} from './store'
import {TYPES} from './data'
function useCount(t){const [v,setV]=useState(t),r=useRef(t)
 useEffect(()=>{const a=r.current,s=performance.now();let f;const step=n=>{const p=Math.min(1,(n-s)/800),x=Math.round(a+(t-a)*p);setV(x);r.current=x;if(p<1)f=requestAnimationFrame(step)};f=requestAnimationFrame(step);return()=>cancelAnimationFrame(f)},[t]);return v}
const Stat=({n,l})=><div className="stat"><strong>{useCount(n).toLocaleString('en-IN')}</strong><span>{l}</span></div>
export default function Impact(){
 const {stats,listings}=useApp(),done=listings.filter(l=>l.status==='picked_up')
 const week=[['Mon',120],['Tue',180],['Wed',150],['Thu',210],['Fri',170],['Sat',240],['Today',done.reduce((s,l)=>s+l.quantity,0)+40]],max=Math.max(...week.map(w=>w[1]))
 return<section className="panel"><h2>Impact so far</h2>
  <div className="stats"><Stat n={stats.meals} l="meals saved"/><Stat n={stats.kg} l="kg of food rescued"/><Stat n={stats.co2} l="kg CO2 avoided (est.)"/></div>
  <h3>Meals rescued this week</h3><div className="bars">{week.map(([d,v])=><div key={d}><i style={{height:v/max*100+'%'}}/><span>{d}</span></div>)}</div>
  <h3>Recent rescues</h3>{done.length?done.map(l=><p key={l.id} className="sub">{l.quantity} meals, {TYPES[l.type].label.toLowerCase()} from {l.address}</p>):<p className="sub">Nothing picked up yet.</p>}</section>}
