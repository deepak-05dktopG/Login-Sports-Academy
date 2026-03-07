/**
 * Public site navbar (Login Swim Academy redesign)
 */

import { useEffect, useState } from 'react'
import { Container, Nav, Navbar as BsNavbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

import { BRAND } from '../content/brand'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/programs', label: 'Programs' },
    { to: '/membership', label: 'Membership' },
    { to: '/contact', label: 'Contact' },
  ]

  const navbarStyle = isScrolled
    ? {
        background: 'rgba(8, 38, 61, 0.92)',
        backdropFilter: 'blur(14px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
      }
    : {
        background: 'transparent',
      }

  const brandTextStyle = {
    fontFamily: "Outfit, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: '#fff',
    fontSize: '1.1rem',
  }

  const brandTextMobileStyle = {
    ...brandTextStyle,
    fontSize: '1.0rem',
  }

  const navLinkBaseStyle = {
    fontFamily: "Outfit, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    fontWeight: 500,
    letterSpacing: '0.01em',
    borderRadius: '10px',
    padding: '0.5rem 0.9rem',
    color: isScrolled ? 'rgba(202,240,248,0.92)' : 'rgba(255,255,255,0.90)',
  }

  const navLinkActiveStyle = {
    ...navLinkBaseStyle,
    background: 'rgba(11,179,200,0.18)',
    border: '1px solid rgba(11,179,200,0.35)',
    color: '#fff',
  }

  const navLinkMobileLayoutStyle = expanded
    ? {
        display: 'block',
        width: '85%',
        textAlign: 'center',
        margin: '0 auto',
      }
    : {}

  return (
    <BsNavbar
      expand="lg"
      fixed="top"
      variant="dark"
      expanded={expanded}
      onToggle={nextExpanded => setExpanded(nextExpanded)}
      className="py-2"
      style={navbarStyle}
    >
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="d-inline-flex align-items-center gap-2">
          <img src="/assets/brand/logo.svg" width="50" height="50" alt={`${BRAND.name} logo`} />
          <span className="d-inline d-sm-none" style={brandTextMobileStyle}>
            { BRAND.name}
          </span>
          <span className="d-none d-sm-inline" style={brandTextStyle}>
            {BRAND.name}
          </span>
        </BsNavbar.Brand>

        <BsNavbar.Toggle
          aria-controls="site-nav"
          className="border-0"
          style={{
            borderRadius: '10px',
            background: expanded ? 'rgba(255,255,255,0.08)' : 'transparent',
          }}
        />

        <BsNavbar.Collapse
          id="site-nav"
          className="py-2 py-lg-0"
          style={{
            ...(expanded
              ? {
                  marginTop: 10,
                  borderRadius: 14,
                  padding: 12,
                  background: 'rgba(8, 38, 61, 0.96)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }
              : {}),
          }}
        >
          <Nav className="mx-auto gap-1 flex-column flex-lg-row align-items-center">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setExpanded(false)}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  ...(isActive ? navLinkActiveStyle : navLinkBaseStyle),
                  ...navLinkMobileLayoutStyle,
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </Nav>

          <div
            className="d-flex gap-2 align-items-center justify-content-center justify-content-lg-end mt-2 mt-lg-0"
            style={expanded ? { width: '100%' } : undefined}
          >
            <Link
              to="/admin"
              className="btn"
              onClick={() => setExpanded(false)}
              style={{
                fontFamily: "Outfit, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
                fontWeight: 600,
                borderRadius: 999,
                padding: '0.42rem 0.9rem',
                fontSize: '0.95rem',
                width: expanded ? '85%' : undefined,
                textAlign: 'center',
                borderColor: 'rgba(202,240,248,0.55)',
                color: '#fff',
              }}
            >
              Staff Login
            </Link>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
