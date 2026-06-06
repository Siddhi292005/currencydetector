import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode]       = useState('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [err, setErr]         = useState('')
  const [loading, setLoading] = useState(false)

  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email || !pass || (mode === 'signup' && !name)) {
      setErr('Please fill all fields.')
      return
    }
    if (pass.length < 6) {
      setErr('Password must be at least 6 characters.')
      return
    }
    setErr('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, pass)
      } else {
        await signup(name, email, pass)
      }
      navigate('/')
    } catch (e) {
      setErr(e.message.replace('Firebase: ', ''))
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setErr('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (e) {
      setErr(e.message.replace('Firebase: ', ''))
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: '#0b0b0c',
      alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div className="card-gold" style={{
        width: '100%', maxWidth: 420, padding: '40px 36px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, border: '1px solid #c9a84c',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#c9a84c', fontSize: 20,
            margin: '0 auto 14px'
          }}>◈</div>
          <h1 className="serif" style={{
            fontSize: 26, color: '#c9a84c', letterSpacing: 4
          }}>CURREX</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Currency Intelligence Platform
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', border: '1px solid #1a1810',
          borderRadius: 2, marginBottom: 24, overflow: 'hidden'
        }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr('') }}
              style={{
                flex: 1, padding: '11px', border: 'none', cursor: 'pointer',
                fontFamily: "'Jost', sans-serif", fontSize: 12,
                letterSpacing: 2, textTransform: 'uppercase',
                background: mode === m ? '#c9a84c' : 'transparent',
                color: mode === m ? '#0b0b0c' : '#4a4235',
                fontWeight: mode === m ? 600 : 400,
                transition: 'all 0.25s'
              }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input className="input" placeholder="Full Name"
              value={name} onChange={e => setName(e.target.value)} />
          )}
          <input className="input" placeholder="Email Address"
            type="email" value={email}
            onChange={e => setEmail(e.target.value)} />
          <input className="input" placeholder="Password"
            type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

          {err && (
            <p style={{ color: '#c9784c', fontSize: 12, textAlign: 'center' }}>
              {err}
            </p>
          )}

          <button className="btn-primary" onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: 8, width: '100%', letterSpacing: 3 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0'
          }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span className="muted" style={{ fontSize: 11 }}>OR</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            style={{
              width: '100%', padding: '12px', border: '1px solid #2a2518',
              borderRadius: 2, background: 'transparent', cursor: 'pointer',
              color: '#d4c9b0', fontFamily: "'Jost', sans-serif",
              fontSize: 13, letterSpacing: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2518'}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Forgot password */}
          {mode === 'login' && (
            <button onClick={async () => {
              if (!email) { setErr('Enter your email first.'); return }
              try {
                const { resetPassword } = useAuth()
                await resetPassword(email)
                setErr('Password reset email sent!')
              } catch (e) {
                setErr(e.message)
              }
            }}
              style={{
                background: 'none', border: 'none', color: '#4a4235',
                fontSize: 12, cursor: 'pointer', textAlign: 'center',
                letterSpacing: 0.5, fontFamily: "'Jost', sans-serif"
              }}>
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  )
}