import {useState,useEffect} from 'react'
export function Countdown({until}){
 const [now,setNow]=useState(Date.now())
 useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[])
 const ms=until-now;if(ms<=0)return<b className="cd red">Expired, do not collect</b>
 const s=Math.floor(ms/1000),lvl=ms<18e5?'red':ms<36e5?'amber':'green',p=n=>String(n).padStart(2,'0')
 return<b className={'cd '+lvl}>Safe for {Math.floor(s/3600)}h {p(Math.floor(s%3600/60))}m {p(s%60)}s</b>}
