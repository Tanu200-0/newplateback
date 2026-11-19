import {createContext,useContext,useState} from 'react'
import {NGOS,BASE} from './data'
import {makeListing} from './match'
const H=36e5,Ctx=createContext(),upd=(set,id,f)=>set(a=>a.map(l=>l.id===id?{...l,...f(l)}:l))
export const useApp=()=>useContext(Ctx)
const initial=()=>{const n=Date.now();return[
 makeListing({id:'L1',type:'cooked',quantity:40,cookedAt:n-H,place:'Banquet Hall, Karol Bagh',status:'on_the_way'}),
 makeListing({id:'L2',type:'bakery',quantity:25,cookedAt:n-2*H,place:'Restaurant, Lajpat Nagar',status:'accepted'}),
 makeListing({id:'L3',type:'packaged',quantity:60,cookedAt:n-5*H,place:'Wedding Lawn, Saket',isEvent:true,status:'picked_up'})]}
export function Provider({children}){
 const [listings,set]=useState(initial)
 const nextNgo=l=>l.rank[l.rank.indexOf(l.assignedNgo)+1]
 const done=listings.filter(l=>l.status==='picked_up'),kg=BASE.kg+done.reduce((s,l)=>s+l.kg,0)
 const api={listings,ngos:NGOS,stats:{meals:BASE.meals+done.reduce((s,l)=>s+l.quantity,0),kg,co2:Math.round(kg*2.5)},
  addListing:l=>set(a=>[l,...a]),
  accept:id=>upd(set,id,()=>({status:'accepted'})),
  advance:id=>upd(set,id,l=>({status:l.status==='accepted'?'on_the_way':'picked_up'})),
  escalate:id=>upd(set,id,l=>nextNgo(l)?{assignedNgo:nextNgo(l),escalations:l.escalations+1}:{}),
  reset:()=>set(initial())}
 return<Ctx.Provider value={api}>{children}</Ctx.Provider>}
