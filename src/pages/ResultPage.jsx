import { useLocation, useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { HISTORICAL_RATES } from '../utils/constants'

export default function ResultPage() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  if (!state?.result) {
    navigate('/')
    return null
  }

  const { result, imageUrl } = state
  const chartData = HISTORICAL_RATES[result.currency] || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: '#0f0e0b', border: '1px solid #2a2010',
          padding: '10px 14px', borderRadius: 2
        }}>
          <p style={{ fontSize: 11, color: '#f3ca88', marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 15, color: '#c9a84c', fontFamily: 'serif' }}>
            ₹{payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '52px 48px 80px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
        <button onClick={() => navigate('/')} style={{
          background: 'transparent', border: '1px solid #2a2518',
          color: '#6b6355', fontFamily: "'Jost', sans-serif",
          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          cursor: 'pointer', padding: '9px 16px', borderRadius: 2
        }}>← Back</button>
        <div style={{ flex: 1, color: '#2a2010', fontSize: 11, letterSpacing: 3, textAlign: 'center' }}>
          ✦ ────────────────────── ✦
        </div>
        <button onClick={() => navigate('/')} style={{
          background: 'linear-gradient(135deg, #c9a84c, #a8882e)',
          border: 'none', color: '#0b0b0c',
          fontFamily: "'Jost', sans-serif", fontWeight: 600,
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          cursor: 'pointer', padding: '9px 20px', borderRadius: 2
        }}>New Scan</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{
            background: '#0f0e0b', border: '1px solid #1e1c17',
            borderRadius: 4, overflow: 'hidden', position: 'relative'
          }}>
            {imageUrl && (
              <img src={imageUrl} alt="currency" style={{
                width: '100%', maxHeight: 280,
                objectFit: 'contain', display: 'block',
                background: '#080807', padding: 16
              }} />
            )}
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <span style={{
                background: 'rgba(11,11,12,0.9)', border: '1px solid #2a2010',
                color: '#c9a84c', fontSize: 10, letterSpacing: 1.5,
                padding: '3px 9px', borderRadius: 1,
                fontFamily: "'Jost', sans-serif", textTransform: 'uppercase'
              }}>
                {result.confidence?.toFixed(1)}% confidence
              </span>
            </div>
          </div>

          <div style={{
            background: '#0f0e0b', border: '1px solid #2a2010',
            borderRadius: 4, padding: 24, position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 36 }}>{result.flag}</span>
                <div>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 24, color: '#d4c9b0', fontWeight: 400, marginBottom: 2
                  }}>{result.currency === 'INR' ? 'Indian Rupee' :
                      result.currency === 'USD' ? 'US Dollar' :
                      result.currency === 'EUR' ? 'Euro' :
                      result.currency === 'JPY' ? 'Japanese Yen' :
                      result.currency === 'KRW' ? 'Korean Won' : result.currency}
                  </h3>
                  <p style={{ fontSize: 12, color: '#3a3020' }}>{result.country}</p>
                </div>
              </div>
              <span style={{
                fontSize: 10, padding: '3px 8px',
                border: '1px solid #2a2010', color: '#4a4235',
                letterSpacing: 1, borderRadius: 1,
                fontFamily: "'Jost', sans-serif"
              }}>
                {result.currency}
              </span>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 1, background: '#1a1810',
              border: '1px solid #1a1810', borderRadius: 2,
              overflow: 'hidden', marginBottom: 16
            }}>
              {[
                { label: 'Face Value',     value: result.face_value },
                { label: 'INR Equivalent', value: `₹${result.inr_value?.toLocaleString()}` },
                { label: 'Exchange Rate',  value: `1 ${result.currency} = ₹${result.exchange_rate}` },
                { label: 'Confidence',     value: `${result.confidence?.toFixed(1)}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#0f0e0b', padding: '13px 14px' }}>
                  <p style={{ fontSize: 10, color: '#2a2010', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: '#c9a84c', fontWeight: 400 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#0f0e0b', border: '1px solid #1e1c17',
            borderRadius: 4, padding: '16px 18px'
          }}>
            <p style={{ fontSize: 10, color: '#3a3020', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Quick Reference
            </p>
            {[1, 5, 10, 50, 100].map(mult => (
              <div key={mult} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', borderBottom: '1px solid #0f0e0b'
              }}>
                <span style={{ fontSize: 13, color: '#4a4235' }}>
                  {result.symbol}{(result.denomination * mult).toLocaleString()}
                </span>
                <span style={{ fontSize: 13, color: '#6b6355' }}>
                  ₹{(result.inr_value * mult).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 10 year chart */}
          <div style={{
            background: '#0f0e0b', border: '1px solid #1e1c17',
            borderRadius: 4, padding: 24
          }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: '#3a3020', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                10-Year Exchange Rate vs INR
              </p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#c9a84c' }}>
                1 {result.currency} = ₹{result.exchange_rate}
              </p>
              <p style={{ fontSize: 11, color: '#3a3020', marginTop: 4 }}>
                {chartData.length > 0 ? (
                  (() => {
                    const first = chartData[0]?.rate
                    const last  = chartData[chartData.length - 1]?.rate
                    const change = ((last - first) / first * 100).toFixed(1)
                    const up = last > first
                    return (
                      <span style={{ color: up ? '#4e9a6e' : '#c9784c' }}>
                        {up ? '▲' : '▼'} {Math.abs(change)}% since {chartData[0]?.year}
                      </span>
                    )
                  })()
                ) : '—'}
              </p>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c9a84c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1810" />
                  <XAxis
                    dataKey="year" stroke="#3a3020"
                    tick={{ fontSize: 10, fill: '#4a4235', fontFamily: 'Jost' }}
                  />
                  <YAxis
                    stroke="#3a3020"
                    tick={{ fontSize: 10, fill: '#4a4235', fontFamily: 'Jost' }}
                    tickFormatter={v => `₹${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={result.exchange_rate}
                    stroke="#c9a84c" strokeDasharray="4 4"
                    strokeOpacity={0.5}
                  />
                  <Area
                    type="monotone" dataKey="rate"
                    stroke="#c9a84c" strokeWidth={1.5}
                    fill="url(#goldGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#c9a84c', stroke: '#0f0e0b', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <p style={{ color: '#3a3020', fontSize: 13, fontFamily: 'serif', fontStyle: 'italic' }}>
                  Historical data not available for {result.currency}
                </p>
              </div>
            )}
          </div>

          {result.top_predictions?.length > 0 && (
            <div style={{
              background: '#0f0e0b', border: '1px solid #1e1c17',
              borderRadius: 4, padding: '16px 18px'
            }}>
              <p style={{ fontSize: 10, color: '#3a3020', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                Top Predictions
              </p>
              {result.top_predictions.map(({ class_label, confidence }, i) => (
                <div key={class_label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 0', borderBottom: '1px solid #0f0e0b'
                }}>
                  <span style={{ fontSize: 11, color: '#2a2010', width: 16 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, color: i === 0 ? '#c9a84c' : '#6b6355' }}>
                    {class_label}
                  </span>
                 
                  <div style={{ width: 80, height: 4, background: '#1a1810', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${confidence}%`, height: '100%',
                      background: i === 0 ? '#c9a84c' : '#2a2010',
                      borderRadius: 2
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#4a4235', width: 44, textAlign: 'right' }}>
                    {confidence.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{
            background: '#0f0e0b', border: '1px solid #1e1c17',
            borderRadius: 4, padding: '16px 18px'
          }}>
            <p style={{ fontSize: 10, color: '#3a3020', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              All {result.currency} Denominations
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {getDenominations(result.currency).map(d => (
                <span key={d} style={{
                  fontSize: 11, padding: '3px 9px', borderRadius: 1,
                  fontFamily: "'Jost', sans-serif", letterSpacing: 1,
                  background: String(d).includes(String(result.denomination))
                    ? 'rgba(201,168,76,0.1)' : '#080807',
                  border: `1px solid ${String(d).includes(String(result.denomination))
                    ? '#2a2010' : '#1a1810'}`,
                  color: String(d).includes(String(result.denomination))
                    ? '#c9a84c' : '#3a3020'
                }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function getDenominations(currency) {
  const map = {
    INR: ['₹10', '₹20', '₹50', '₹100', '₹200', '₹500'],
    USD: ['$1', '$5', '$10', '$50', '$100'],
    EUR: ['€5', '€10', '€20', '€50', '€100'],
    JPY: ['¥1000', '¥2000', '¥5000', '¥10000'],
    KRW: ['₩10', '₩50', '₩100', '₩500', '₩1000', '₩5000', '₩10000', '₩50000'],
  }
  return map[currency] || []
}