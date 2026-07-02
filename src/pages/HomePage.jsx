import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../utils/constants'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function HomePage() {
  const [tab, setTab]         = useState('upload')
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadMsg, setLoadMsg] = useState('Initialising...')
  const [drag, setDrag]       = useState(false)
  const [camActive, setCamActive] = useState(false)
  const [error, setError]     = useState('')

  const fileRef   = useRef()
  const videoRef  = useRef()
  const canvasRef = useRef()
  const streamRef = useRef()
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const LOAD_MSGS = [
    'Initialising analysis...',
    'Detecting currency region...',
    'Reading denomination...',
    'Calculating INR value...',
    'Finalising report...'
  ]

  const handleFile = (f) => {
    if (!f) return
    setError('')
    setImage(f)
    setPreview(URL.createObjectURL(f))
  }

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = s
      if (videoRef.current) videoRef.current.srcObject = s
      setCamActive(true)
    } catch {
      setError('Camera unavailable. Please use file upload.')
    }
  }

  const stopCam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCamActive(false)
  }

  const capture = () => {
    const c = canvasRef.current
    const v = videoRef.current
    c.width = v.videoWidth
    c.height = v.videoHeight
    c.getContext('2d').drawImage(v, 0, 0)
    c.toBlob(b => {
      handleFile(new File([b], 'capture.jpg', { type: 'image/jpeg' }))
      stopCam()
    })
  }

  useEffect(() => () => stopCam(), [])

  const analyse = async () => {
    if (!image) return
    setLoading(true)
    setError('')

    let mi = 0
    const iv = setInterval(() => {
      mi = (mi + 1) % LOAD_MSGS.length
      setLoadMsg(LOAD_MSGS[mi])
    }, 1200)

    try {
      const formData = new FormData()
      formData.append('file', image)

      const res = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const result = res.data
      navigate('/result', { state: { result, imageUrl: preview } })
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'scans'), {
          currency:     result.currency,
          denomination: result.denomination,
          faceValue:    result.face_value,
          inrValue:     result.inr_value,
          confidence:   result.confidence,
          country:      result.country,
          flag:         result.flag,
          classLabel:   result.class_label,
          timestamp:    serverTimestamp(),
        }).catch(err => console.error('Failed to save scan history:', err))
      }

    

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Analysis failed. Make sure the FastAPI server is running.'
      )
    } finally {
      clearInterval(iv)
      setLoading(false)
    }

    
  }

  const clear = () => {
    setImage(null)
    setPreview(null)
    setError('')
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '52px 48px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ color: '#2a2010', fontSize: 11, letterSpacing: 3, marginBottom: 14 }}>
          ✦ ──────── ✦
        </div>
        <h2 className="display" style={{ fontSize: 44, fontWeight: 500, color: '#d4c9b0', lineHeight: 1.1 }}>
          Currency{' '}
          <span style={{
            background: 'linear-gradient(90deg, #c9a84c, #f5e6a3, #c9a84c)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Recognition</span>
        </h2>
        <p className="serif" style={{
          color: '#aa8e5f', fontSize: 16, marginTop: 12,
          fontStyle: 'italic', maxWidth: 480, lineHeight: 1.8
        }}>
          Upload or photograph any banknote. AI identifies the currency,
          denomination, and calculates the INR equivalent instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>

        {/* Main panel */}
        <div>
          {/* Tab selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1a1810', marginBottom: 28 }}>
            {[['upload', 'Upload Image'], ['camera', 'Camera Capture']].map(([t, label]) => (
              <button key={t}
                onClick={() => { setTab(t); if (t !== 'camera') stopCam(); }}
                style={{
                  background: 'transparent', border: 'none',
                  fontFamily: "'Jost', sans-serif", fontSize: 11,
                  letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer',
                  padding: '11px 20px', transition: 'all 0.2s',
                  color: tab === t ? '#c9a84c' : '#3a3020',
                  borderBottom: tab === t ? '1px solid #c9a84c' : '1px solid transparent',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Upload tab */}
          {tab === 'upload' && (
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
              onClick={() => !preview && fileRef.current?.click()}
              style={{
                border: `1px dashed ${drag ? '#c9a84c' : '#1e1c17'}`,
                borderRadius: 4, minHeight: 320,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: preview ? 'default' : 'pointer',
                position: 'relative', overflow: 'hidden',
                background: drag ? 'rgba(201,168,76,0.025)' : 'transparent',
                transition: 'all 0.2s'
              }}>
              {preview ? (
                <>
                  <img src={preview} alt="preview" style={{
                    width: '100%', maxHeight: 400,
                    objectFit: 'contain', display: 'block',
                    background: '#080807', padding: 20
                  }} />
                  {loading && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(11,11,12,0.88)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 18
                    }}>
                      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <div style={{
                          position: 'absolute', left: 0, right: 0, height: 1,
                          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)',
                          animation: 'scan 2.8s ease-in-out infinite'
                        }} />
                      </div>
                      <div style={{
                        width: 34, height: 34,
                        border: '1px solid #c9a84c',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <p style={{ color: '#c9a84c', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                        {loadMsg}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 56 }}>
                  <div style={{
                    fontFamily: 'serif', fontSize: 44,
                    color: '#d6b785', marginBottom: 18, opacity: 0.6
                  }}>◈</div>
                  <p className="serif" style={{ fontSize: 18, color: '#987c50', marginBottom: 8 }}>
                    Drop currency image here
                  </p>
                  <p className="muted">or click to browse files</p>
                  <p style={{ fontSize: 10, color: '#f3dea7', marginTop: 18, letterSpacing: 2, textTransform: 'uppercase' }}>
                    JPG · PNG · WEBP
                  </p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])} />
            </div>
          )}

          {/* Camera tab */}
          {tab === 'camera' && (
            <div style={{
              border: '1px solid #1a1810', borderRadius: 4,
              overflow: 'hidden', minHeight: 320,
              background: '#080807', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', position: 'relative'
            }}>
              <video ref={videoRef} autoPlay playsInline muted style={{
                width: '100%', display: camActive ? 'block' : 'none',
                maxHeight: 400, objectFit: 'cover'
              }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {preview && !camActive && (
                <img src={preview} style={{
                  width: '100%', maxHeight: 400,
                  objectFit: 'contain', background: '#080807', padding: 20
                }} alt="captured" />
              )}
              {!camActive && !preview && (
                <div style={{ textAlign: 'center', padding: 48 }}>
                  <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.15, fontFamily: 'serif' }}>◉</div>
                  <p className="serif" style={{ fontSize: 16, color: '#e8c286' }}>Camera not active</p>
                </div>
              )}
              {/* Alignment guides */}
              {camActive && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{
                    position: 'absolute', top: '20%', left: '10%', right: '10%', bottom: '20%',
                    border: '1px solid rgba(201,168,76,0.3)', borderRadius: 2
                  }} />
                  {[
                    { top: '20%', left: '10%', borderTop: '2px solid #c9a84c', borderLeft: '2px solid #c9a84c' },
                    { top: '20%', right: '10%', borderTop: '2px solid #c9a84c', borderRight: '2px solid #c9a84c' },
                    { bottom: '20%', left: '10%', borderBottom: '2px solid #c9a84c', borderLeft: '2px solid #c9a84c' },
                    { bottom: '20%', right: '10%', borderBottom: '2px solid #c9a84c', borderRight: '2px solid #c9a84c' },
                  ].map((style, i) => (
                    <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...style }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disclaimer — shows for both tabs */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'rgba(201,168,76,0.04)', border: '1px solid #2a2010',
            borderRadius: 2, padding: '10px 14px', marginTop: 14
          }}>
            <span style={{ color: '#c9a84c', fontSize: 13, lineHeight: 1, marginTop: 1 }}>ⓘ</span>
            <p style={{ fontSize: 12, color: '#a08a63', lineHeight: 1.6 }}>
              Please photograph or upload <span style={{ color: '#c9a84c' }}>only one banknote at a time</span>.
              Images with multiple or overlapping notes may produce inaccurate results.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p style={{
              color: '#c9784c', fontSize: 12, marginTop: 12,
              padding: '10px 14px', border: '1px solid #3a1a0a',
              borderRadius: 2, background: 'rgba(201,120,76,0.05)'
            }}>{error}</p>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            {tab === 'camera' && !camActive && !preview && (
              <button className="btn-primary" onClick={startCam} style={{ flex: 1 }}>
                Activate Camera
              </button>
            )}
            {tab === 'camera' && camActive && (
              <button className="btn-primary" onClick={capture} style={{ flex: 1 }}>
                Capture Frame
              </button>
            )}
            {preview && !loading && (
              <>
                <button className="btn-primary" onClick={analyse} style={{ flex: 1 }}>
                  Analyse Currency
                </button>
                <button onClick={clear} style={{
                  background: 'transparent', border: '1px solid #2a2518',
                  color: '#6b6355', fontFamily: "'Jost', sans-serif",
                  fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: 'pointer', padding: '10px 22px', borderRadius: 2,
                  transition: 'all 0.2s'
                }}>Clear</button>
              </>
            )}
            {tab === 'upload' && !preview && (
              <button onClick={() => fileRef.current?.click()} style={{
                background: 'transparent', border: '1px solid #2a2518',
                color: '#6b6355', fontFamily: "'Jost', sans-serif",
                fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
                cursor: 'pointer', padding: '10px 22px', borderRadius: 2, flex: 1
              }}>Browse Files</button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Supported currencies */}
          <div style={{
            background: '#0f0e0b', border: '1px solid #2a2010',
            borderRadius: 4, padding: '20px 18px'
          }}>
            <p style={{ fontSize: 10, color: '#d9a654', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
              Supported Currencies
            </p>
            {[
              { flag: '🇮🇳', name: 'Indian Rupee',   code: 'INR', symbol: '₹' },
              { flag: '🇺🇸', name: 'US Dollar',      code: 'USD', symbol: '$' },
              { flag: '🇪🇺', name: 'Euro',           code: 'EUR', symbol: '€' },
              { flag: '🇯🇵', name: 'Japanese Yen',   code: 'JPY', symbol: '¥' },
              { flag: '🇰🇷', name: 'Korean Won',     code: 'KRW', symbol: '₩' },
            ].map(({ flag, name, code, symbol }) => (
              <div key={code} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0', borderBottom: '1px solid #1a1810'
              }}>
                <span style={{ fontSize: 20 }}>{flag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: '#d4c9b0', fontWeight: 500 }}>{name}</p>
                  <p style={{ fontSize: 11, color: '#d3a151' }}>{code}</p>
                </div>
                <span style={{ fontFamily: 'serif', fontSize: 20, color: '#f0cd6e' }}>{symbol}</span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{
            background: '#0f0e0b', border: '1px solid #1e1c17',
            borderRadius: 4, padding: '16px 18px'
          }}>
            <p style={{ fontSize: 10, color: '#f0c074', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Tips for best results
            </p>
            {[
              'Use even, natural lighting',
              'Place note flat on dark surface',
              'Note should fill 70–90% of frame',
              'Avoid glare on polymer notes',
              'Photograph one note at a time',
            ].map((t, i) => (
              <p key={i} style={{
                fontSize: 12, color: '#f2d09a', marginBottom: 8,
                paddingLeft: 12, borderLeft: '1px solid #1e1c17', lineHeight: 1.5
              }}>· {t}</p>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; } 100% { top: 100%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}