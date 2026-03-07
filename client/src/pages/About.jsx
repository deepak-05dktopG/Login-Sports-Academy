/**
 * About page (Login Swim Academy redesign)
 */

import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaAnchor, FaClipboardCheck, FaShieldAlt, FaWaveSquare } from 'react-icons/fa'

import Navbar from '../components/Navbar'
import WaveSeparator from '../components/WaveSeparator'
import { BRAND } from '../content/brand'

const About = () => {
  return (
    <div>
      <Navbar />

      <section className="hero-pool" style={{ paddingTop: 92 }}>
        <Container className="section-pad">
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <div data-reveal className="reveal">
                <div style={{ fontWeight: 800, opacity: 0.9 }}>About</div>
                <h1 className="mt-2" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)', lineHeight: 1.04 }}>
                  A modern swim academy built on calm training and strong fundamentals.
                </h1>
                <p className="mt-3" style={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 620 }}>
                  {BRAND.name} focuses strictly on swimming training — from water confidence to refined stroke mechanics.
                  Our sessions are structured, safety-led, and designed to help swimmers progress step-by-step.
                </p>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Link to="/programs" className="btn btn-foam">
                    View Programs
                  </Link>
                  <Link to="/contact" className="btn btn-ocean">
                    Talk to Us
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <WaveSeparator fill="var(--foam-50)" />
      </section>

      <section style={{ background: 'var(--tint-aqua-1)' }}>
        <Container className="section-pad">
          <Row className="g-4">
            {[
              {
                icon: <FaShieldAlt />,
                title: 'Safety-first progression',
                desc: 'We build confidence through predictable routines, clear cues, and gradual challenge — never rushed.',
              },
              {
                icon: <FaWaveSquare />,
                title: 'Technique-led training',
                desc: 'Body position, breathing, timing, and efficiency are built with repeatable drills and feedback.',
              },
              {
                icon: <FaClipboardCheck />,
                title: 'Structured training plans',
                desc: 'Sessions follow a simple structure so swimmers can feel momentum and track improvements weekly.',
              },
              {
                icon: <FaAnchor />,
                title: 'Supportive environment',
                desc: 'A calm, encouraging culture helps kids and adults build trust, consistency, and strong habits.',
              },
            ].map(item => (
              <Col key={item.title} md={6} lg={3}>
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
                          background: 'var(--foam-100)',
                          color: 'var(--ocean-900)',
                          marginBottom: 14,
                        }}
                      >
                        {item.icon}
                      </div>
                      <Card.Title style={{ fontWeight: 900 }}>{item.title}</Card.Title>
                      <Card.Text style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>{item.desc}</Card.Text>
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
            <Col lg={6}>
              <div data-reveal className="reveal">
                <h2>What you can expect</h2>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7, maxWidth: 720 }}>
                  Whether the goal is water confidence, fitness, or competitive performance, our approach stays simple:
                  strong fundamentals, consistent feedback, and steady progress.
                </p>
                <div className="surface" style={{ padding: 18 }}>
                  <ul className="mb-0" style={{ color: 'var(--ink-700)', lineHeight: 1.9 }}>
                    <li>Warm-up + mobility suitable for the age group</li>
                    <li>Technique drills with clear cues</li>
                    <li>Main set for endurance, pacing, or skill repetition</li>
                    <li>Cool-down + quick feedback</li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div data-reveal className="reveal surface surface--glass" style={{ padding: 18 }}>
                <h3 style={{ fontSize: '1.2rem' }}>Training environment</h3>
                <p style={{ color: 'var(--ink-700)', lineHeight: 1.7, marginBottom: 0 }}>
                  Sessions run in a clean, structured pool setting with instructor guidance, repeatable drills, and clear
                  weekly goals.
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
                <h2 style={{ marginBottom: 10 }}>Have questions about the right level?</h2>
                <p style={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 760 }}>
                  Send a message and tell us the swimmer’s age and comfort level. We’ll suggest a starting program and
                  next steps.
                </p>
              </div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div data-reveal className="reveal">
                <Link to="/contact" className="btn btn-foam ripple-hover">
                  Contact
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default About
