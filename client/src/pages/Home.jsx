/**
 * Home page (Login Swim Academy redesign)
 */

import { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaChalkboardTeacher, FaChild, FaMedal, FaWater } from 'react-icons/fa'

import Navbar from '../components/Navbar'
import WaveSeparator from '../components/WaveSeparator'
import { BRAND } from '../content/brand'

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const [postsRes, galleryRes] = await Promise.all([
          fetch(`${apiBase}/posts`),
          fetch(`${apiBase}/gallery?isActive=true`),
        ])

        const postsJson = await postsRes.json().catch(() => null)
        const galleryJson = await galleryRes.json().catch(() => null)

        if (postsJson?.success) setPosts(postsJson.data || [])
        if (galleryJson?.success) setGalleryImages(galleryJson.data || [])
      } catch (e) {
        console.error('Home load failed:', e)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const programs = useMemo(() => {
    return [
      {
        icon: <FaChild />,
        title: 'Water Confidence (Kids)',
        desc: 'Gentle, safety-first sessions that build comfort in water, breath control, floating, and basic movement.',
      },
      {
        icon: <FaWater />,
        title: 'Stroke Foundations',
        desc: 'Technique-led training for freestyle, backstroke, and basic turns — with clear drills and measurable progress.',
      },
      {
        icon: <FaChalkboardTeacher />,
        title: 'Teen & Adult Training',
        desc: 'Improve efficiency, endurance, and pacing. Ideal for beginners, fitness swimmers, and returning athletes.',
      },
      {
        icon: <FaMedal />,
        title: 'Competitive Prep',
        desc: 'Structured training cycles focused on starts, turns, race strategy, and performance habits for events.',
      },
    ]
  }, [])

  const galleryFallback = useMemo(() => {
    return [
      {
        imageUrl: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80',
        title: 'Guided drills',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        title: 'Lane training',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1600965962748-7f2b4d9b3b6a?auto=format&fit=crop&w=1200&q=80',
        title: 'Technique focus',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1200&q=80',
        title: 'Beginner support',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1542996966-2e31c00bae31?auto=format&fit=crop&w=1200&q=80',
        title: 'Endurance sets',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1506821467170-438fc4f9fa50?auto=format&fit=crop&w=1200&q=80',
        title: 'Progress tracking',
      },
    ]
  }, [])

  const _gallery = (galleryImages?.length ? galleryImages : galleryFallback).slice(0, 9)
  const latestPosts = (posts || []).slice(0, 3)

  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className="hero-pool" style={{ paddingTop: 92 }}>
        <Container className="section-pad">
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <Badge bg="light" text="dark" className="px-3 py-2" style={{ borderRadius: 999 }}>
                  Swim training • Technique • Safety
                </Badge>
                <h1 className="mt-3" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)', lineHeight: 1.02 }}>
                  Build calm confidence in the water — with training that respects every starting point.
                </h1>
                <p className="mt-3" style={{ opacity: 0.9, maxWidth: 560, fontSize: '1.08rem', lineHeight: 1.7 }}>
                  {BRAND.name} delivers structured swimming training for kids, teens, and adults. We focus on technique,
                  safety routines, and steady progress you can feel each week.
                </p>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Link to="/contact" className="btn btn-ocean">
                    Enquire Now
                  </Link>
                  <Link to="/programs" className="btn btn-foam">
                    Explore Programs
                  </Link>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4" style={{ opacity: 0.9 }}>
                  <Badge bg="transparent" className="text-white border border-white border-opacity-25">
                    Small-batch attention
                  </Badge>
                  <Badge bg="transparent" className="text-white border border-white border-opacity-25">
                    Technique-first drills
                  </Badge>
                  <Badge bg="transparent" className="text-white border border-white border-opacity-25">
                    Safety-led progression
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <WaveSeparator fill="var(--foam-50)" />
      </section>

      {/* PROGRAMS */}
      <section style={{ background: 'var(--tint-aqua-1)' }}>
        <Container className="section-pad">
          <Row className="align-items-end mb-4 g-3">
            <Col lg={7}>
              <div data-reveal className="reveal">
                <div style={{ fontWeight: 800, color: 'var(--ocean-700)' }}>Programs</div>
                <h2 className="mt-2">Training paths designed for real progress</h2>
                <p style={{ color: 'var(--ink-700)', maxWidth: 720, lineHeight: 1.7 }}>
                  Choose a program that matches your level today — we’ll refine technique, set weekly goals, and build
                  confidence with safety routines that last.
                </p>
              </div>
            </Col>
            <Col lg={5} className="text-lg-end">
              <div data-reveal className="reveal">
                <Link to="/membership" className="btn btn-foam">
                  View Membership Options
                </Link>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            {programs.map(p => (
              <Col key={p.title} md={6} lg={3}>
                <div data-reveal className="reveal">
                  <Card className="surface h-100" style={{ border: '1px solid var(--line)' }}>
                    <Card.Body>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--ocean-900)',
                          background: 'var(--foam-100)',
                          marginBottom: 14,
                          fontSize: 18,
                        }}
                      >
                        {p.icon}
                      </div>
                      <Card.Title style={{ fontWeight: 900 }}>{p.title}</Card.Title>
                      <Card.Text style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>{p.desc}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'var(--tint-aqua-2)' }}>
        <Container className="section-pad">
          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <div data-reveal className="reveal">
                <h2>How training works</h2>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>
                  Every swimmer starts with a simple baseline check. From there, sessions use clear drills, progressive
                  sets, and feedback you can apply immediately.
                </p>

                <div className="surface" style={{ padding: 18 }}>
                  {[
                    { k: '1', t: 'Skill baseline', d: 'We assess comfort, breathing, and current stroke patterns.' },
                    { k: '2', t: 'Technique block', d: 'Small drills that improve body line, kick, and timing.' },
                    { k: '3', t: 'Endurance & pace', d: 'Age-appropriate sets that build stamina without burnout.' },
                    { k: '4', t: 'Progress check', d: 'Track improvements and update drills as skills level up.' },
                  ].map(step => (
                    <div key={step.k} className="d-flex gap-3 py-2" style={{ borderBottom: '1px solid var(--line)' }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          display: 'grid',
                          placeItems: 'center',
                          background: 'rgba(11,179,200,0.14)',
                          fontWeight: 900,
                          color: 'var(--ocean-900)',
                          flex: '0 0 auto',
                        }}
                      >
                        {step.k}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900 }}>{step.t}</div>
                        <div style={{ color: 'var(--ink-700)' }}>{step.d}</div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3">
                    <Link to="/contact" className="btn btn-ocean">
                      Ask About a Trial Session
                    </Link>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div data-reveal className="reveal surface surface--glass ripple-hover" style={{ padding: 12 }}>
                <img
                  alt="Swimming instructor guiding a learner"
                  src="https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1400"
                  style={{ width: '100%', height: 'clamp(280px, 70vw, 470px)', objectFit: 'cover', borderRadius: 18 }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* GALLERY */}
      {/* <section style={{ background: 'var(--tint-aqua-1)' }}>
        <Container className="section-pad">
          <Row className="align-items-end mb-4 g-3">
            <Col lg={7}>
              <div data-reveal className="reveal">
                <div style={{ fontWeight: 800, color: 'var(--ocean-700)' }}>Gallery</div>
                <h2 className="mt-2">Training moments & milestones</h2>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7, maxWidth: 720 }}>
                  A quick look at sessions, drills, and swimmer progress. (Admins can manage gallery images from the
                  staff dashboard.)
                </p>
              </div>
            </Col>
          </Row>

          <Row className="g-3">
            {gallery.map((img, idx) => (
              <Col key={img._id || `${img.imageUrl}-${idx}`} sm={6} lg={4}>
                <div data-reveal className="reveal">
                  <div className="surface ripple-hover" style={{ padding: 10 }}>
                    <img
                      src={img.imageUrl}
                      alt={img.title || img.description || 'Swimming gallery image'}
                      style={{ width: '100%', height: 230, objectFit: 'cover', borderRadius: 16 }}
                      loading="lazy"
                    />
                    <div className="pt-3 px-2 pb-2">
                      <div style={{ fontWeight: 900 }}>{img.title || `Session ${idx + 1}`}</div>
                      <div style={{ color: 'var(--ink-700)' }}>
                        {(img.description || '').slice(0, 70) || 'Focused practice, guided feedback, and steady confidence.'}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section> */}

      {/* UPDATES */}
      <section style={{ background: 'var(--foam-100)' }}>
        <Container className="section-pad">
          <Row className="align-items-end mb-4 g-3">
            <Col lg={7}>
              <div data-reveal className="reveal">
                <div style={{ fontWeight: 800, color: 'var(--ocean-700)' }}>Updates</div>
                <h2 className="mt-2">Announcements & academy notes</h2>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7, maxWidth: 720 }}>
                  News, achievements, and schedule notes posted by the team.
                </p>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            {(loading && !latestPosts.length) ? (
              <Col>
                <div className="surface" style={{ padding: 18 }}>
                  Loading updates…
                </div>
              </Col>
            ) : null}

            {latestPosts.map(p => (
              <Col key={p._id} md={6} lg={4}>
                <div data-reveal className="reveal">
                  <Card className="surface h-100 ripple-hover" style={{ border: '1px solid var(--line)' }}>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 22, borderTopRightRadius: 22 }}
                        loading="lazy"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title style={{ fontWeight: 900 }}>{p.title}</Card.Title>
                      <Card.Text style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>
                        {(p.caption || p.content || '').slice(0, 140) || 'New update from the team.'}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center" style={{ color: 'var(--ink-700)' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.author || 'Team'}</span>
                        <span style={{ fontSize: '0.9rem', opacity: 0.85 }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="hero-ocean">
        <Container className="section-pad">
          <Row className="align-items-center g-3">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <h2 style={{ marginBottom: 10 }}>Ready to start?</h2>
                <p style={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 760 }}>
                  Tell us the swimmer’s age and current comfort level. We’ll suggest the best starting plan and help you
                  schedule the first session.
                </p>
              </div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div data-reveal className="reveal">
                <Link to="/contact" className="btn btn-foam ripple-hover">
                  Contact the Academy
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Home
