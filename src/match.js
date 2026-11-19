import {NGOS,PLACES,TYPES} from './data'
export const km=(a,b)=>{const r=x=>x*Math.PI/180,p=r(b.lat-a.lat),q=r(b.lng-a.lng)
 const h=Math.sin(p/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(q/2)**2;return 12742*Math.asin(Math.sqrt(h))}
// score = 50% distance, 25% capacity fit, 25% food-type match
export const rankNgos=(l,ngos=NGOS)=>ngos.map(n=>({...n,d:km(l,n),
 s:.5*Math.max(0,1-km(l,n)/15)+.25*Math.min(1,n.capacity/l.quantity)+.25*(n.accepts.includes(l.type)?1:0)})).sort((a,b)=>b.s-a.s)
export function makeListing({id,type,quantity,cookedAt,place,isEvent=false,pickupAt='',photo=null,status='posted'}){
 const [lat,lng]=PLACES[place],rank=rankNgos({lat,lng,type,quantity}).map(n=>n.id)
 return{id,type,quantity,kg:Math.round(quantity*.3),cookedAt,safeUntil:cookedAt+TYPES[type].hrs*36e5,
  address:place,lat,lng,isEvent,pickupAt,photo,status,rank,assignedNgo:rank[0],escalations:0}}
