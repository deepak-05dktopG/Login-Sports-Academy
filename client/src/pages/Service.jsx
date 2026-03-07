/**
 * Programs page (Login Swim Academy redesign)
 */

import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaBullseye, FaChild, FaClock, FaMedal, FaSwimmer } from 'react-icons/fa'

import Navbar from '../components/Navbar'
import WaveSeparator from '../components/WaveSeparator'

const Service = () => {
  const tracks = [
    {
      title: 'Kids — Water Confidence',
      badge: 'Beginner',
      icon: <FaChild />,
      points: ['Water safety routines', 'Breath control', 'Float + glide', 'Basic kick + movement'],
    },
    {
      title: 'Stroke Foundations',
      badge: 'Technique',
      icon: <FaSwimmer />,
      points: ['Freestyle basics', 'Backstroke basics', 'Body position', 'Efficient breathing'],
    },
    {
      title: 'Endurance & Pace',
      badge: 'Fitness',
      icon: <FaClock />,
      points: ['Pacing practice', 'Endurance sets', 'Turn basics', 'Consistency & form'],
    },
    {
      title: 'Competitive Prep',
      badge: 'Advanced',
      icon: <FaMedal />,
      points: ['Starts & turns', 'Race strategy', 'Training cycles', 'Performance habits'],
    },
  ]

  return (
    <div>
      <Navbar />

      <section className="hero-pool" style={{ paddingTop: 92 }}>
        <Container className="section-pad">
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <div style={{ fontWeight: 800, opacity: 0.9 }}>Programs</div>
                <h1 className="mt-2" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)', lineHeight: 1.04 }}>
                  Swim training that’s structured, measurable, and supportive.
                </h1>
                <p className="mt-3" style={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 640 }}>
                  We keep the focus strictly on swimming training. Choose the track that matches your level and goals —
                  our instructors guide technique, build stamina, and reinforce water safety.
                </p>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Link to="/contact" className="btn btn-foam">
                    Enquire About Batches
                  </Link>
                  <Link to="/membership" className="btn btn-ocean">
                    See Membership
                  </Link>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4" style={{ opacity: 0.9 }}>
                  <Badge bg="transparent" className="text-white border border-white border-opacity-25">
                    <FaBullseye className="me-2" /> Goal-based drills
                  </Badge>
                  <Badge bg="transparent" className="text-white border border-white border-opacity-25">
                    Technique cues that stick
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <WaveSeparator fill="var(--foam-50)" />
      </section>

      <section style={{ background: 'var(--tint-aqua-1)' }}>
        <Container className="section-pad">
          <Row className="mb-4">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <h2>Program Tracks</h2>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>
                  Each track has a clear focus and progress markers. If you’re unsure where to start, message us and we’ll
                  suggest the right entry point.
                </p>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            {tracks.map(t => (
              <Col key={t.title} md={6} lg={3}>
                <div data-reveal className="reveal">
                  <Card className="surface h-100" style={{ border: '1px solid var(--line)' }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            display: 'grid',
                            placeItems: 'center',
                            color: 'var(--ocean-900)',
                            background: 'var(--foam-100)',
                            fontSize: 18,
                          }}
                        >
                          {t.icon}
                        </div>
                        <span
                          className="px-3 py-1"
                          style={{
                            borderRadius: 999,
                            border: '1px solid var(--line)',
                            background: 'var(--foam-100)',
                            fontWeight: 800,
                            color: 'var(--ocean-900)',
                            fontSize: '0.85rem',
                          }}
                        >
                          {t.badge}
                        </span>
                      </div>
                      <Card.Title style={{ fontWeight: 900 }}>{t.title}</Card.Title>
                      <ul className="mb-0" style={{ color: 'var(--ink-700)', lineHeight: 1.9, paddingLeft: 18 }}>
                        {t.points.map(p => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section style={{ background: 'var(--tint-aqua-2)' }}>
        <Container className="section-pad">
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <div data-reveal className="reveal">
                <h2>What makes this different</h2>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>
                  We avoid noisy, over-complicated sessions. Training is designed to be repeatable, easy to understand,
                  and consistent week to week.
                </p>
                <div className="surface" style={{ padding: 18 }}>
                  <Row className="g-3">
                    {[
                      { t: 'Clear session structure', d: 'Warm-up → drills → main set → feedback.' },
                      { t: 'Cues you can apply', d: 'Simple corrections that improve efficiency quickly.' },
                      { t: 'Progress tracking', d: 'Checkpoints for comfort, form, and stamina.' },
                      { t: 'Safety habits', d: 'Confidence comes from routines and calm training.' },
                    ].map(item => (
                      <Col key={item.t} md={6}>
                        <div style={{ fontWeight: 900 }}>{item.t}</div>
                        <div style={{ color: 'var(--ink-700)' }}>{item.d}</div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div data-reveal className="reveal surface surface--glass" style={{ padding: 18 }}>
                <h3 style={{ fontSize: '1.2rem' }}>Level placement</h3>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7, marginBottom: 0 }}>
                  If you’re not sure where to start, we’ll recommend the best track after a quick baseline check.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="hero-ocean">
        <Container className="section-pad">
          <Row className="align-items-center g-3">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <h2 style={{ marginBottom: 10 }}>Not sure which program fits?</h2>
                <p style={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 760 }}>
                  Share the swimmer’s age and current comfort level — we’ll recommend a starting track.
                </p>
              </div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div data-reveal className="reveal">
                <Link to="/contact" className="btn btn-foam ripple-hover">
                  Send a Message
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Service
