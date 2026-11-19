import {useState,useEffect} from 'react'
import {MapContainer,TileLayer,Marker,Popup,useMap} from 'react-leaflet'
import L from 'leaflet'
import {CENTER,TYPES,ESC} from './data'
import {km} from './match'
import {useApp} from './store'
import {Countdown} from './Countdown'
const icon=(c,h)=>L.divIcon({className:'pin '+c,html:h,iconSize:[34,34]})
const STEPS=[['posted','Posted'],['accepted','Accepted'],['on_the_way','On the way'],['picked_up','Picked up']]
function Fly({p}){const m=useMap();useEffect(()=>{m.flyTo(p,13)},[p[0],p[1]]);return null}
function Card({l,on,pick}){
 const {ngos,accept,advance,escalate}=useApp(),n=ngos.find(x=>x.id===l.assignedNgo),i=STEPS.findIndex(s=>s[0]===l.status)
 const hasNext=l.rank.indexOf(l.assignedNgo)<l.rank.length-1,[left,setLeft]=useState(ESC)
 useEffect(()=>{if(l.status!=='posted')return;setLeft(ESC);const t=setInterval(()=>setLeft(s=>Math.max(0,s-1)),1000);return()=>clearInterval(t)},[l.status,l.assignedNgo])
 useEffect(()=>{if(left<=0&&l.status==='posted')escalate(l.id)},[left])
 return<article className={'card'+(on?' on':'')} onClick={pick}>
  {l.photo&&<img src={l.photo} alt=""/>}
  <div className="body"><h3>{l.quantity} meals: {TYPES[l.type].label}{l.isEvent&&<span className="tag">Event {l.pickupAt&&'pickup '+l.pickupAt}</span>}</h3>
   <p className="sub">{l.address}</p><Countdown until={l.safeUntil}/>
   <p className="match">{l.rank[0]===n.id?'Best match: ':'Offered to: '}<b>{n.name}</b>, {km(l,n).toFixed(1)} km{l.escalations>0&&<span className="tag warn">Escalated x{l.escalations}</span>}</p>
   {l.status==='posted'&&hasNext&&<p className="sub">No reply? Escalates to the next NGO in {left}s</p>}
   <ol className="steps">{STEPS.map((s,k)=><li key={s[0]} className={k<=i?'on':''}>{s[1]}</li>)}</ol>
   <div className="acts">
    {l.status==='posted'&&<><button className="btn" onClick={e=>{e.stopPropagation();accept(l.id)}}>Accept</button><button className="btn ghost" onClick={e=>{e.stopPropagation();escalate(l.id)}}>Decline</button></>}
    {l.status==='accepted'&&<button className="btn" onClick={()=>advance(l.id)}>Mark on the way</button>}
    {l.status==='on_the_way'&&<button className="btn" onClick={()=>advance(l.id)}>Mark picked up</button>}
    {l.status==='picked_up'&&<span className="tag">Rescued</span>}</div></div></article>}
export default function Ngo(){
 const {listings,ngos}=useApp(),[sel,setSel]=useState(null),s=listings.find(l=>l.id===sel)
 return<div><MapContainer center={CENTER} zoom={11} style={{height:300}} scrollWheelZoom={false}>
  <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
  {s&&<Fly p={[s.lat,s.lng]}/>}
  {ngos.map(n=><Marker key={n.id} position={[n.lat,n.lng]} icon={icon('ngo','🏠')}><Popup>{n.name}</Popup></Marker>)}
  {listings.map(l=><Marker key={l.id} position={[l.lat,l.lng]} icon={icon(l.status,'🍱')} eventHandlers={{click:()=>setSel(l.id)}}><Popup>{l.quantity} meals, {TYPES[l.type].label}</Popup></Marker>)}
  </MapContainer>
  <div className="list">{listings.length?listings.map(l=><Card key={l.id} l={l} on={sel===l.id} pick={()=>setSel(l.id)}/>):<p>No food nearby right now. Check back soon.</p>}</div></div>}
