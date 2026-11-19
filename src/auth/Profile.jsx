import {useState} from 'react'
import {useAuth} from './AuthContext'
const TYPES=[['cooked','Cooked meals'],['packaged','Packaged food'],['bakery','Bakery'],['fresh','Fruits and vegetables']]
export default function Profile(){
 const {profile,session,updateProfile}=useAuth()
 const [f,setF]=useState({name:profile.name||'',phone:profile.phone||'',address:profile.address||'',lat:profile.lat,lng:profile.lng,capacity:profile.capacity||0,accepts:profile.accepts||[]})
 const [msg,setMsg]=useState(''),[busy,setBusy]=useState(false),set=(k,v)=>setF(o=>({...o,[k]:v}))
 const ngo=profile.role==='ngo'
 const toggle=t=>set('accepts',f.accepts.includes(t)?f.accepts.filter(x=>x!==t):[...f.accepts,t])
 const locate=()=>navigator.geolocation?.getCurrentPosition(p=>{set('lat',p.coords.latitude);set('lng',p.coords.longitude);setMsg('Location updated. Press Save.')},()=>setMsg('Could not read your location.'))
 async function save(e){e.preventDefault();setBusy(true);setMsg('')
  const patch={name:f.name,phone:f.phone,address:f.address,lat:f.lat,lng:f.lng,...(ngo?{capacity:Number(f.capacity)||0,accepts:f.accepts}:{})}
  const r=await updateProfile(patch);setBusy(false);setMsg(r.error||'Saved.')}
 return<section className="panel"><h2>Your profile</h2><p className="sub">{session.user.email}, {ngo?'NGO':'Donor'}{profile.verified&&' (verified)'}</p>
  <form onSubmit={save}>
   <label>Name<input value={f.name} onChange={e=>set('name',e.target.value)}/></label>
   <label>Phone<input type="tel" value={f.phone} onChange={e=>set('phone',e.target.value)}/></label>
   <label>Address<input value={f.address} onChange={e=>set('address',e.target.value)}/></label>
   <p className="sub">Location: {f.lat!=null?Number(f.lat).toFixed(4)+', '+Number(f.lng).toFixed(4):'not set'}</p>
   <button type="button" className="btn ghost" onClick={locate}>Use my current location</button>
   {ngo&&<><label>Capacity (meals per day)<input type="number" min="1" value={f.capacity} onChange={e=>set('capacity',e.target.value)}/></label>
    <p className="sub">Food types you accept</p>{TYPES.map(([k,v])=><label key={k} className="row"><input type="checkbox" checked={f.accepts.includes(k)} onChange={()=>toggle(k)}/> {v}</label>)}</>}
   {msg&&<p role="status" className="sub">{msg}</p>}
   <button className="btn" disabled={busy}>{busy?'Saving...':'Save profile'}</button></form></section>}
