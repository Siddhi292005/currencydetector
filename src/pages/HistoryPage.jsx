import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function HistoryPage() {
  const [scans, setScans]     = useState([])
  const [loading, setLoading] = useState(true)
  const { user }              = useAuth()
  const navigate              = useNavigate()

  useEffect(() => {
    if (!user) return
    fetchHistory()
  }, [user])

  const fetchHistory = async () => {
    try {
      const q = query(
        collection(db, 'users', user.uid, 'scans'),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setScans(data)
    } catch (err) {
      console.error('Error fetching history:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    try {
      return ts.toDate().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    } catch { return '—' }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '52px 48px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ color: '#2a2010', fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>
          ✦ ──────── ✦
        </div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 40, fontWeight: 500, color: '#d4c9b0'
        }}>Scan History</h2>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          color: '#ffffff', fontSize: 15, marginTop: 6, fontStyle: 'italic'
        }}>
          {loading ? 'Loading...' : `${scans.length} scan${scans.length !== 1 ? 's' : ''} recorded`}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{
            width: 34, height: 34, border: '1px solid #c9a84c',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#4a4235', fontSize: 13 }}>Loading history...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && scans.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 48px' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 48, color: '#f5efd7', marginBottom: 20
          }}>◎</div>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 20, color: '#2a2010', marginBottom: 8
          }}>No scans yet</p>
          <p style={{ fontSize: 13, color: '#3a3020', marginBottom: 28 }}>
            Your scan history will appear here
          </p>
          <button onClick={() => navigate('/')} style={{
            background: 'linear-gradient(135deg, #c9a84c, #a8882e)',
            border: 'none', color: '#0b0b0c',
            fontFamily: "'Jost', sans-serif", fontWeight: 600,
            fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
            cursor: 'pointer', padding: '12px 28px', borderRadius: 2
          }}>
            Scan a Currency
          </button>
        </div>
      )}

      {/* Scan list */}
      {!loading && scans.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scans.map((scan, i) => (
            <div key={scan.id} style={{
              background: '#0f0e0b', border: '1px solid #1e1c17',
              borderRadius: 4, padding: '16px 22px',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', transition: 'border-color 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2010'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1c17'}
              onClick={() => navigate('/result', {
                state: {
                  result: {
                    currency:      scan.currency,
                    denomination:  scan.denomination,
                    face_value:    scan.faceValue,
                    inr_value:     scan.inrValue,
                    confidence:    scan.confidence,
                    country:       scan.country,
                    flag:          scan.flag,
                    class_label:   scan.classLabel,
                    exchange_rate: scan.exchangeRate,
                    symbol:        scan.symbol,
                  }
                }
              })}
            >
              {/* Rank */}
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 22, color: '#e2cfaf', width: 28, flexShrink: 0
              }}>{i + 1}</span>

              {/* Flag */}
              <span style={{ fontSize: 24, flexShrink: 0 }}>{scan.flag}</span>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 18, color: '#d4c9b0'
                  }}>{scan.faceValue}</span>
                  <span style={{
                    fontSize: 10, padding: '2px 7px',
                    border: '1px solid #a18f4a', color: '#e9bd77',
                    letterSpacing: 1, borderRadius: 1,
                    fontFamily: "'Jost', sans-serif"
                  }}>{scan.currency}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: '#c9a84c' }}>
                    ₹{scan.inrValue?.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, color: '#f0e0c6' }}>
                    {formatDate(scan.timestamp)}
                  </span>
                  <span style={{ fontSize: 11, color: '#fce7c5' }}>
                    · {scan.confidence?.toFixed(1)}% confidence
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 20, color: '#2a2010'
              }}>›</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}