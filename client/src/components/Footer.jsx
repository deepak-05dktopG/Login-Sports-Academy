/**
 * Public site footer (Login Swim Academy redesign)
 */

import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'

import WaveSeparator from './WaveSeparator'
import { BRAND } from '../content/brand'

const Footer = () => {
  const year = new Date().getFullYear()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/programs', label: 'Programs' },
    { to: '/membership', label: 'Membership' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <footer style={{ background: 'var(--ocean-950)', color: '#fff', marginTop: '72px' }}>
      <WaveSeparator fill="var(--foam-50)" flipY />
      <div style={{ background: 'var(--ocean-950)' }}>
        <Container className="py-5">
          <Row className="gy-4">
            <Col lg={5}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src="/assets/Logo.png"
                  alt={`${BRAND.name} logo`}
                  style={{ width: 54, height: 54, objectFit: 'contain' }}
                />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>{BRAND.name}</div>
                  <div style={{ opacity: 0.8 }}>{BRAND.tagline}</div>
                </div>
              </div>
              <p style={{ opacity: 0.85, maxWidth: 520, lineHeight: 1.7 }}>
                Structured swim training built around safety, technique, and steady confidence — from first-time swimmers
                to stroke refinement.
              </p>
            </Col>

            <Col sm={6} lg={3}>
              <div style={{ fontWeight: 800, letterSpacing: '0.02em' }} className="mb-3">
                Quick Links
              </div>
              <div className="d-flex flex-column gap-2">
                {links.map(l => (
                  <Link key={l.to} to={l.to} style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </Col>

            <Col sm={6} lg={4}>
              <div style={{ fontWeight: 800, letterSpacing: '0.02em' }} className="mb-3">
                Contact
              </div>
              <div className="d-flex flex-column gap-3" style={{ opacity: 0.9 }}>
                <div className="d-flex gap-3 align-items-start">
                  <FaEnvelope style={{ marginTop: 3, color: 'var(--aqua-300)' }} />
                  <a href={`mailto:${BRAND.email}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {BRAND.email}
                  </a>
                </div>

                {[BRAND.phonePrimary, BRAND.phoneSecondary, BRAND.phoneTertiary].filter(Boolean).map((phone, idx) => (
                  <div key={idx} className="d-flex gap-3 align-items-start">
                    <FaPhone style={{ marginTop: 3, color: 'var(--aqua-300)' }} />
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: '#fff', textDecoration: 'none' }}>
                      {phone}
                    </a>
                  </div>
                ))}

                {BRAND.address ? (
                  <div className="d-flex gap-3 align-items-start">
                    <FaMapMarkerAlt style={{ marginTop: 3, color: 'var(--aqua-300)' }} />
                    <div>{BRAND.address}</div>
                  </div>
                ) : null}

                <div style={{ fontSize: '0.95rem', opacity: 0.75 }}>
                  For enquiries, send a message via the Contact page.
                </div>
              </div>
            </Col>
          </Row>

          <hr style={{ borderColor: 'rgba(255,255,255,0.12)', margin: '28px 0 18px' }} />
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2" style={{ opacity: 0.75 }}>
            <div>© {year} {BRAND.name}. All rights reserved.</div>
            <div>
              <Link to="/about" style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>
                About
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
