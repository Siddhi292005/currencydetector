const TECH_STACK = [
  {
    category: 'Machine Learning',
    items: [
      { name: 'ResNet50V2',         desc: 'Pre-trained CNN fine-tuned on 8,477+ currency images across 28 classes' },
      { name: 'TensorFlow / Keras', desc: 'Model training, data augmentation, and two-phase fine-tuning pipeline' },
      { name: 'scikit-learn',       desc: 'Class weighting, confusion matrix, classification metrics' },
      { name: 'Google Colab',       desc: 'GPU-backed training environment for the full pipeline' },
    ]
  },
  {
    category: 'Backend',
    items: [
      { name: 'FastAPI',  desc: 'Python backend serving model predictions via REST API' },
      { name: 'Uvicorn',  desc: 'ASGI server running the FastAPI application' },
      { name: 'httpx',    desc: 'Async client for fetching live and historical exchange rates' },
      { name: 'Pillow',   desc: 'Image preprocessing — resizing, RGB conversion, normalisation' },
    ]
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React 19',        desc: 'Component-based single page application' },
      { name: 'Vite 8',          desc: 'Build tool and dev server with instant hot reload' },
      { name: 'React Router v7', desc: 'Client-side routing across 6 pages with protected route guards' },
      { name: 'Recharts',        desc: '10-year INR exchange rate history visualised as area charts' },
      { name: 'Axios',           desc: 'HTTP client for multipart image uploads to the backend' },
    ]
  },
  {
    category: 'Auth & Data',
    items: [
      { name: 'Firebase Auth', desc: 'Email/password and Google OAuth authentication' },
      { name: 'Firestore',     desc: 'Per-user scan history stored as NoSQL documents' },
    ]
  },
  {
    category: 'External Data',
    items: [
      { name: 'frankfurter.app', desc: 'Free live and historical exchange rate provider' },
    ]
  },
]

export default function TechStackPage() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 48px 80px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ color: '#674d24', fontSize: 11, letterSpacing: 3, marginBottom: 14 }}>
          ✦ ──────── ✦
        </div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 44, fontWeight: 500, color: '#d4c9b0'
        }}>Technology Stack</h2>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          color: '#5a5040', fontSize: 16, marginTop: 12,
          fontStyle: 'italic', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.8
        }}>
          Every tool, framework, and service powering CURREX — from model training to deployment.
        </p>
      </div>

      {/* Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {TECH_STACK.map(({ category, items }) => (
          <div key={category} style={{
            background: '#0f0e0b', border: '1px solid #1e1c17',
            borderRadius: 4, overflow: 'hidden', display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Column header */}
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid #1e1c17',
              background: '#080807'
            }}>
              <p style={{
                fontSize: 11, color: '#c9a84c', letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 500
              }}>
                {category}
              </p>
            </div>

            {/* Column items */}
            <div style={{ padding: '18px 20px', flex: 1 }}>
              {items.map(({ name, desc }, i) => (
                <div key={name} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  marginBottom: i < items.length - 1 ? 16 : 0
                }}>
                  <div style={{
                    width: 30, height: 30, border: '1px solid #2a2010',
                    borderRadius: 2, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#c9a84c', fontSize: 12,
                    flexShrink: 0, marginTop: 1
                  }}>◈</div>
                  <div>
                    <p style={{ fontSize: 13, color: '#d4c9b0', fontWeight: 500, marginBottom: 3 }}>
                      {name}
                    </p>
                    <p style={{ fontSize: 12, color: '#a7772b', lineHeight: 1.6 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <div style={{ color: '#2a2010', fontSize: 11, letterSpacing: 3 }}>
          ✦ ──────────── ✦
        </div>
      </div>
    </div>
  )
}