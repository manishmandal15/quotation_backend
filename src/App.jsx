import React, {useState} from 'react'
import MasterPage from './master/MasterPage'

const resources = [
  "customer",
  "products",
  "quotationdispatches",
  "quotationfeedback",
  "quotationfollowup",
  "quotationreminders",
  "quotationstatuslog",
  "user"
]

export default function App(){
  const [active,setActive] = useState(resources[0])
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'Arial, sans-serif'}}>
      <aside style={{width:220,background:'#0f172a',color:'#fff',padding:20}}>
        <h2 style={{fontSize:18}}>Masters</h2>
        <ul style={{listStyle:'none',padding:0}}>
          {resources.map(r => (
            <li key={r} style={{marginTop:10}}>
              <button onClick={() => setActive(r)} style={{background:'transparent',border:'none',color: active===r ? '#60a5fa' : '#fff',cursor:'pointer'}}>
                {r}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{flex:1,padding:20,overflow:'auto'}}>
        <h1 style={{marginTop:0}}>{active} Master</h1>
        <MasterPage resource={active} apiBase={API_BASE} />
      </main>
    </div>
  )
}
