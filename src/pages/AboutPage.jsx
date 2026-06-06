

const TECH_STACK = [
  {
    category: 'Machine Learning',
    items: [
      { name: 'ResNet50V2',     desc: 'Pre-trained CNN fine-tuned on 8,477 currency images across 16 classes' },
      { name: 'TensorFlow / Keras', desc: 'Model training, data augmentation, and two-phase fine-tuning pipeline' },
      { name: 'FastAPI',        desc: 'Python backend serving model predictions via REST API' },
    ]
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React 19 + Vite', desc: 'Single page application with fast hot reload and optimised builds' },
      { name: 'React Router v7', desc: 'Client-side routing across 5 pages with protected route guards' },
      { name: 'Recharts',        desc: '10-year INR exchange rate history visualised as interactive area charts' },
    ]
  },
  {
    category: 'Auth & Data',
    items: [
      { name: 'Firebase Auth',  desc: 'Email/password and Google OAuth authentication' },
      { name: 'Firestore',      desc: 'Per-user scan history stored as NoSQL documents' },
    ]
  },
]

const STATS = [
  { value: '16',    label: 'Currency Classes' },
  { value: '3',     label: 'Countries' },
  { value: '94%',   label: 'Model Accuracy' },
  { value: '8.4K',  label: 'Training Images' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Capture',     desc: 'Upload a photo or use your camera to frame the currency note or coin.' },
  { n: '02', title: 'Analyse',     desc: 'ResNet50V2 classifies the image across 16 denomination classes.' },
  { n: '03', title: 'Identify',    desc: 'Currency, denomination, country, and face value are extracted.' },
  { n: '04', title: 'Convert',     desc: 'Live INR conversion with 10-year historical exchange rate chart.' },
]

export default function AboutPage() {
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
          fontSize: 18, color: '#5a5040', fontStyle: 'italic',
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
            <p style={{ fontSize: 11, color: '#4a4235', letterSpacing: 2, textTransform: 'uppercase' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── How it works ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#4a4235', letterSpacing: 3,
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
              <p style={{ fontSize: 12, color: '#4a4235', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Supported currencies ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#4a4235', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>Supported Currencies</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee',   country: 'India',          symbol: '₹', denoms: '₹10 ₹20 ₹50 ₹100 ₹200 ₹500',      rate: '1.00' },
            { code: 'USD', flag: '🇺🇸', name: 'US Dollar',      country: 'United States',  symbol: '$', denoms: '$1 $5 $10 $50 $100',                rate: '83.5' },
            { code: 'EUR', flag: '🇪🇺', name: 'Euro',           country: 'European Union', symbol: '€', denoms: '€5 €10 €20 €50 €100',               rate: '90.1' },
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
                  color: '#4a4235', letterSpacing: 1, borderRadius: 1
                }}>{code}</span>
              </div>
              <p style={{ fontSize: 15, color: '#d4c9b0', fontWeight: 500, marginBottom: 2 }}>{name}</p>
              <p style={{ fontSize: 11, color: '#3a3020', marginBottom: 12 }}>{country}</p>
              <p style={{ fontSize: 11, color: '#4a4235', marginBottom: 6, lineHeight: 1.7 }}>{denoms}</p>
              <p style={{ fontSize: 11, color: '#2a2010', borderTop: '1px solid #1e1c17', paddingTop: 8, marginTop: 8 }}>
                1 {code} = ₹{rate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech stack ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#4a4235', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>Technology Stack</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TECH_STACK.map(({ category, items }) => (
            <div key={category} style={{
              background: '#0f0e0b', border: '1px solid #1e1c17', borderRadius: 4, overflow: 'hidden'
            }}>
              <div style={{
                padding: '10px 20px', borderBottom: '1px solid #1e1c17',
                background: '#080807'
              }}>
                <p style={{ fontSize: 10, color: '#4a4235', letterSpacing: 2, textTransform: 'uppercase' }}>
                  {category}
                </p>
              </div>
              {items.map(({ name, desc }, i) => (
                <div key={name} style={{
                  display: 'flex', gap: 16, padding: '14px 20px', alignItems: 'flex-start',
                  borderBottom: i < items.length - 1 ? '1px solid #0f0e0b' : 'none'
                }}>
                  <div style={{
                    width: 36, height: 36, border: '1px solid #2a2010', borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#c9a84c', fontSize: 14, flexShrink: 0
                  }}>◈</div>
                  <div>
                    <p style={{ fontSize: 14, color: '#d4c9b0', fontWeight: 500, marginBottom: 3 }}>{name}</p>
                    <p style={{ fontSize: 12, color: '#4a4235', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
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
                { layer: 'Base',        detail: 'ResNet50V2 — ImageNet pretrained (frozen)' },
                { layer: 'Pooling',     detail: 'GlobalAveragePooling2D' },
                { layer: 'Norm',        detail: 'BatchNormalization' },
                { layer: 'Dense',       detail: '256 neurons — ReLU + L2(0.01)' },
                { layer: 'Dropout',     detail: '0.5 — regularisation' },
                { layer: 'Output',      detail: '16 classes — Softmax' },
              ].map(({ layer, detail }) => (
                <div key={layer} style={{
                  display: 'flex', gap: 12, padding: '7px 0',
                  borderBottom: '1px solid #0f0e0b'
                }}>
                  <span style={{
                    fontSize: 10, color: '#c9a84c', letterSpacing: 1,
                    textTransform: 'uppercase', width: 60, flexShrink: 0, marginTop: 1
                  }}>{layer}</span>
                  <span style={{ fontSize: 13, color: '#6b6355' }}>{detail}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#3a3020', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                Training Details
              </p>
              {[
                { label: 'Training images',  value: '8,477' },
                { label: 'Validation images',value: '1,374' },
                { label: 'Classes',          value: '16 (INR × 6, USD × 5, EUR × 5)' },
                { label: 'Phase 1 LR',       value: '1e-3 — head only' },
                { label: 'Phase 2 LR',       value: '1e-5 — top 20 layers' },
                { label: 'Optimiser',        value: 'Adam' },
                { label: 'Loss',             value: 'Categorical crossentropy' },
                { label: 'Val accuracy',     value: '~94%' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 0', borderBottom: '1px solid #0f0e0b'
                }}>
                  <span style={{ fontSize: 12, color: '#4a4235' }}>{label}</span>
                  <span style={{ fontSize: 12, color: '#8c7d5e' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Limitations ── */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, color: '#4a4235', letterSpacing: 3,
          textTransform: 'uppercase', textAlign: 'center', marginBottom: 28
        }}>Known Limitations & Future Work</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'Currency scope',     desc: 'Currently supports INR, USD, EUR. GBP, JPY, AED planned — pending dataset availability.' },
            { title: 'Coin recognition',   desc: 'Model trained on banknotes only. Coin detection to be added in a future version.' },
            { title: 'Image quality',      desc: 'Performance drops on heavily crumpled, poorly lit, or extreme-angle photos.' },
            { title: 'Exchange rates',     desc: 'Rates are pre-baked. Live API integration planned for real-time accuracy.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{
              background: '#0f0e0b', border: '1px solid #1e1c17',
              borderRadius: 4, padding: '16px 18px',
              borderLeft: '2px solid #2a2010'
            }}>
              <p style={{ fontSize: 13, color: '#c9a84c', marginBottom: 6, fontWeight: 500 }}>{title}</p>
              <p style={{ fontSize: 12, color: '#4a4235', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <div style={{ color: '#2a2010', fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>
          ✦ ──────────────────── ✦
        </div>
        <p style={{ fontSize: 10, color: '#2a2010', letterSpacing: 2, textTransform: 'uppercase', lineHeight: 2 }}>
          CURREX · Currency Intelligence Platform<br />
          ResNet50V2 · FastAPI · React · Firebase · Recharts
        </p>
      </div>

    </div>
  )
}