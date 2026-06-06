import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <nav style={{
        background:'#0f0e0b', borderBottom:'1px solid #1e1c17',
        padding:'0 48px', height:62, display:'flex',
        alignItems:'center', justifyContent:'space-between'
      }}>
        <span style={{color:'#c9a84c', fontFamily:'serif', fontSize:20, letterSpacing:4}}>
          CURREX
        </span>
        <div style={{display:'flex', gap:24}}>
          {[['/', 'Home'], ['/history', 'History'], ['/about', 'About']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to=='/'}
              style={({isActive}) => ({
                color: isActive ? '#c9a84c' : '#6b6355',
                textDecoration:'none', fontSize:13,
                letterSpacing:1, textTransform:'uppercase'
              })}>
              {label}
            </NavLink>
          ))}
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16}}>
          <span style={{color:'#4a4235', fontSize:13}}>
            {user?.displayName || user?.email?.split('@')[0]}
          </span>
          <button onClick={handleLogout} style={{
            background:'transparent', border:'1px solid #2a2518',
            color:'#6b6355', padding:'7px 14px', cursor:'pointer',
            fontSize:11, letterSpacing:1, textTransform:'uppercase'
          }}>
            Exit
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  )
}
