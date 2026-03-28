/**
 * Gallery page (public)
 */

import { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'

import Navbar from '../components/Navbar'
import WaveSeparator from '../components/WaveSeparator'

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${apiBase}/gallery?isActive=true`)
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.success) {
          throw new Error(json?.message || `Failed to load gallery (${res.status})`)
        }
        setItems(Array.isArray(json.data) ? json.data : [])
      } catch (e) {
        setError(e?.message || 'Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const fallback = useMemo(() => {
    return [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1400&q=80',
        title: 'Lane training',
        description: 'Swimmers perfecting their strokes across competition lanes.',
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=1400&q=80',
        title: 'Freestyle technique',
        description: 'Building speed and form with focused freestyle drills.',
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1400&q=80',
        title: 'Pool practice',
        description: 'Consistent pool sessions that build endurance and confidence.',
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=1400&q=80',
        title: 'Kids swimming lessons',
        description: 'Young swimmers learning water safety and basic strokes.',
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1622629797619-c100e3e67e2e?auto=format&fit=crop&w=1400&q=80',
        title: 'Backstroke drills',
        description: 'Refining backstroke technique with guided practice.',
      }
    ]
  }, [])

  const gallery = (items?.length ? items : fallback)

  return (
    <div>
      <Navbar />

      <section className="hero-pool" style={{ paddingTop: 92 }}>
        <Container className="section-pad">
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <Badge bg="light" text="dark" className="px-3 py-2" style={{ borderRadius: 999 }}>
                  Sessions • Technique • Progress
                </Badge>
                <h1 className="mt-3" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)', lineHeight: 1.05 }}>
                  Gallery
                </h1>
                <p className="mt-3" style={{ opacity: 0.9, maxWidth: 720, lineHeight: 1.7 }}>
                  A look at our training environment, swimmer milestones, and practice moments.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <WaveSeparator fill="var(--foam-50)" />
      </section>

      <section style={{ background: 'var(--tint-aqua-1)' }}>
        <Container className="section-pad">
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="surface" style={{ padding: 18 }}>
              Loading gallery…
            </div>
          ) : null}

          <Row className="g-3">
            {gallery.map((img, idx) => (
              <Col key={img._id || `${img.imageUrl}-${idx}`} sm={6} lg={4}>
                <Card className="surface h-100" style={{ overflow: 'hidden' }}>
                  <img
                    src={img.imageUrl}
                    alt={img.title || img.description || 'Swimming gallery image'}
                    style={{ width: '100%', height: 260, objectFit: 'contain' }}
                    loading="lazy"
                  />
                  <Card.Body>
                    <Card.Title style={{ fontWeight: 900 }}>{img.title}</Card.Title>
                    <div style={{ color: 'var(--ink-700)', lineHeight: 1.6 }}>
                      {(img.description || '').slice(0, 120)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  )
}
