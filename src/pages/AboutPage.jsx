import { useNavigate } from 'react-router-dom'

const STATS = [
  { value: '28',   label: 'Currency Classes' },
  { value: '5',    label: 'Countries' },
  { value: '93%',  label: 'Model Accuracy' },
  { value: '16K',  label: 'Training Images' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Capture',  desc: 'Upload a photo or use your camera to frame the currency note or coin.' },
  { n: '02', title: 'Analyse',  desc: 'ResNet50V2 classifies the image across 28 denomination classes.' },
  { n: '03', title: 'Identify', desc: 'Currency, denomination, country, and face value are extracted.' },
  { n: '04', title: 'Convert',  desc: 'Live INR conversion with 10-year historical exchange rate chart.' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 48px 80px' }}>

      {/* ── Hero ── */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          width: 56, height: 56, border: '1px solid #c9a84c',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#c9a84c', fontSize: 22,
          margin: '0 auto 20px'
        }}>◈</div>
        <h1 className="display" style={{
          fontSize: 48, fontWeight: 500, color: '#d4c9b0',
          marginBottom: 16, letterSpacing: 1
        }}>
          About <span style={{
            background: 'linear-gradient(90deg, #c9a84c, #f5e6a3, #c9a84c)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>CURREX</span>
        </h1>
        <p className="serif" style={{
          fontSize: 18, color: '#98886e', fontStyle: 'italic',
          maxWidth: 560, margin: '0 auto', lineHeight: 1.9
        }}>
          An AI-powered currency recognition platform — identify banknotes,
          get live INR conversion, and explore 10 years of exchange rate history.
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, background: '#1e1c17', border: '1px solid #1e1c17',
        borderRadius: 4, overflow: 'hidden', marginBottom: 48
      }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{
            background: '#0f0e0b', padding: '28px 20px', textAlign: 'center'
          }}>
            <p className="serif" style={{
              fontSize: 36, color: '#c9a84c', fontWeight: 400, marginBottom: 6
            }}>{value}</p>
            <p style={{ fontSize: 11, color: '#928165', letterSpacing: 2, textTransform: 'uppercase' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── How it works ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#a78f69', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>How It Works</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {HOW_IT_WORKS.map(({ n, title, desc }) => (
            <div key={n} style={{
              background: '#0f0e0b', border: '1px solid #1e1c17',
              borderRadius: 4, padding: '20px 16px'
            }}>
              <p className="serif" style={{ fontSize: 32, color: '#2a2010', marginBottom: 8 }}>{n}</p>
              <p style={{ fontSize: 13, color: '#c9a84c', fontWeight: 500, marginBottom: 8, letterSpacing: 1 }}>
                {title}
              </p>
              <p style={{ fontSize: 12, color: '#b0956a', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Supported currencies ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#e4ac4b', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>Supported Currencies</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee', country: 'India',          symbol: '₹', denoms: '₹10 ₹20 ₹50 ₹100 ₹200 ₹500', rate: '1.00' },
            { code: 'USD', flag: '🇺🇸', name: 'US Dollar',    country: 'United States',  symbol: '$', denoms: '$1 $5 $10 $50 $100',         rate: '83.5' },
            { code: 'EUR', flag: '🇪🇺', name: 'Euro',          country: 'European Union', symbol: '€', denoms: '€5 €10 €20 €50 €100',        rate: '90.1' },
            { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', country: 'Japan',          symbol: '¥', denoms: '¥1000 ¥2000 ¥5000 ¥10000',   rate: '0.56' },
            { code: 'KRW', flag: '🇰🇷', name: 'Korean Won',   country: 'South Korea',    symbol: '₩', denoms: '₩10 – ₩50000',               rate: '0.062' },
          ].map(({ code, flag, name, country, symbol, denoms, rate }) => (
            <div key={code} style={{
              background: '#0f0e0b', border: '1px solid #2a2010',
              borderRadius: 4, padding: '20px 18px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 12, right: 16, opacity: 0.06,
                fontSize: 60, fontFamily: 'serif', lineHeight: 1, userSelect: 'none', color: '#c9a84c'
              }}>{symbol}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{flag}</span>
                <span style={{
                  fontSize: 10, padding: '3px 8px', border: '1px solid #2a2010',
                  color: '#b5945f', letterSpacing: 1, borderRadius: 1
                }}>{code}</span>
              </div>
              <p style={{ fontSize: 15, color: '#d4c9b0', fontWeight: 500, marginBottom: 2 }}>{name}</p>
              <p style={{ fontSize: 11, color: '#8d682d', marginBottom: 12 }}>{country}</p>
              <p style={{ fontSize: 11, color: '#e8e2da', marginBottom: 6, lineHeight: 1.7 }}>{denoms}</p>
              <p style={{ fontSize: 11, color: '#724805', borderTop: '1px solid #1e1c17', paddingTop: 8, marginTop: 8 }}>
                1 {code} = ₹{rate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Model details ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#4a4235', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>Model Architecture</p>
        <div style={{
          background: '#0f0e0b', border: '1px solid #1e1c17',
          borderRadius: 4, padding: 24
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: 11, color: '#3a3020', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                Architecture
              </p>
              {[
                { layer: 'Base',     detail: 'ResNet50V2 — ImageNet pretrained' },
                { layer: 'Pooling',  detail: 'GlobalAveragePooling2D' },
                { layer: 'Norm',     detail: 'BatchNormalization' },
                { layer: 'Dense',    detail: '256 neurons — ReLU + L2(0.01)' },
                { layer: 'Dropout',  detail: '0.5 — regularisation' },
                { layer: 'Output',   detail: '28 classes — Softmax' },
              ].map(({ layer, detail }) => (
                <div key={layer} style={{
                  display: 'flex', gap: 12, padding: '7px 0',
                  borderBottom: '1px solid #0f0e0b'
                }}>
                  <span style={{
                    fontSize: 10, color: '#c9a84c', letterSpacing: 1,
                    textTransform: 'uppercase', width: 60, flexShrink: 0, marginTop: 1
                  }}>{layer}</span>
                  <span style={{ fontSize: 13, color: '#eace9d' }}>{detail}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#a88a59', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                Training Details
              </p>
              {[
                { label: 'Training images',   value: '~13,813' },
                { label: 'Validation images',  value: '2,802' },
                { label: 'Classes',            value: '28 (5 currencies)' },
                { label: 'Phase 1 LR',         value: '1e-3 — head only' },
                { label: 'Phase 2 LR',         value: '1e-5 — top layers' },
                { label: 'Optimiser',          value: 'Adam' },
                { label: 'Loss',               value: 'Categorical crossentropy' },
                { label: 'Val accuracy',       value: '93.04%' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 0', borderBottom: '1px solid #0f0e0b'
                }}>
                  <span style={{ fontSize: 12, color: '#ba9f74' }}>{label}</span>
                  <span style={{ fontSize: 12, color: '#ccb27f' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Limitations ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#a38351', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>Known Limitations & Future Work</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'Currency scope',   desc: 'Currently supports INR, USD, EUR, JPY, KRW. GBP and AED were evaluated but dropped due to lack of usable datasets.' },
            { title: 'Multiple notes',   desc: 'Designed for one note per photo. Overlapping or multiple notes in a single frame may reduce accuracy.' },
            { title: 'Image quality',    desc: 'Performance drops on heavily crumpled, poorly lit, or extreme-angle photos.' },
            { title: 'Fake detection',   desc: 'No counterfeit detection in this version — recognition and conversion only.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{
              background: '#0f0e0b', border: '1px solid #1e1c17',
              borderRadius: 4, padding: '16px 18px',
              borderLeft: '2px solid #2a2010'
            }}>
              <p style={{ fontSize: 13, color: '#c9a84c', marginBottom: 6, fontWeight: 500 }}>{title}</p>
              <p style={{ fontSize: 12, color: '#bd9758', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech stack link-out ── */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <button onClick={() => navigate('/tech')} style={{
          background: 'transparent', border: '1px solid #2a2518',
          color: '#c9a84c', fontFamily: "'Jost', sans-serif",
          fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
          cursor: 'pointer', padding: '12px 28px', borderRadius: 2
        }}>
          View Full Technology Stack →
        </button>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <div style={{ color: '#cc9a49', fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>
          ✦ ──────────────────── ✦
        </div>
        <p style={{ fontSize: 10, color: '#81622f', letterSpacing: 2, textTransform: 'uppercase', lineHeight: 2 }}>
          CURREX · Currency Intelligence Platform<br />
          ResNet50V2 · FastAPI · React · Firebase · Recharts
        </p>
      </div>

    </div>
  )
}