import {useState} from 'react'
import {Provider,useApp} from './store'
import {AuthProvider,useAuth} from './auth/AuthContext'
import AuthScreen from './auth/AuthScreen'
import Profile from './auth/Profile'
import Donor from './Donor'
import Ngo from './Ngo'
import Impact from './Impact'

// Demo build: all views stay open so the mock demo keeps working.
// Once Person 2 and 3 connect real data, show only the tabs for profile.role.
const TABS=[['donor','Donor'],['ngo','NGO'],['impact','Impact'],['profile','Profile']]

function Shell(){
 const {profile,signOut}=useAuth(),{reset}=useApp()
 const [tab,setTab]=useState(profile.role==='ngo'?'ngo':'donor')
 return<div className="app"><header><div className="who"><span>Hi, <b>{profile.name||'friend'}</b> ({profile.role==='ngo'?'NGO':'Donor'})</span><button onClick={signOut}>Log out</button></div>
  <h1>PlateBack</h1><p>Surplus food to the people who need it, before it spoils.</p>
  <nav>{TABS.map(([k,v])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{v}</button>)}</nav></header>
  <main>{tab==='donor'&&<Donor go={()=>setTab('ngo')}/>}{tab==='ngo'&&<Ngo/>}{tab==='impact'&&<Impact/>}{tab==='profile'&&<Profile/>}</main>
  <button className="reset" onClick={reset} title="Restore the starting demo data">Reset demo</button></div>}

function Gate(){
 const {session,profile,loading}=useAuth()
 if(loading)return<p className="sub" style={{padding:24}}>Loading...</p>
 if(!session||!profile)return<div className="app"><AuthScreen/></div>
 return<Provider><Shell/></Provider>}

export default()=><AuthProvider><Gate/></AuthProvider>
