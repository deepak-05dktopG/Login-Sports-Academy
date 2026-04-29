/**
 * What it is: Website top navigation bar component.
 * Non-tech note: This controls the menu links at the top of the site.
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar as BsNavbar } from "react-bootstrap";

// Main navigation bar for the Login Sports Academy website with scroll effects and mobile menu
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  useEffect(
  // Adds scroll listener to toggle transparent/solid navbar background on scroll
  () => {
    // Sets navbar background solid when scrolled past 60px
    const handleScroll = () => {
      return setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return (
      // Removes scroll listener on component unmount
      () => {
        return window.removeEventListener("scroll", handleScroll);
      }
    );
  }, []);

  const links = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
    { path: "/membership", label: "Membership" },
    { path: "/team", label: "Team" },
    // { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
  ];

  // Navbar background logic
  const navbarStyle = {
    background: isScrolled || expanded
      ? "linear-gradient(135deg, rgba(10,14,26,0.98), rgba(15,22,41,0.98))"
      : "transparent",
    backdropFilter: isScrolled || expanded ? "blur(16px)" : "none",
    boxShadow: isScrolled
      ? "0 4px 30px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.06)"
      : "none",
    transition: "background 0.3s ease, backdrop-filter 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
    borderBottom: isScrolled || expanded ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
    transform: "translateZ(0)", // Hardware acceleration for smoother mobile scrolling/animations
    willChange: "background, backdrop-filter"
  };

  // Returns style object for nav links with active page highlighting
  const linkStyle = path => {
    const isActive = location.pathname === path;
    return ({
      color: "#fff",
      fontWeight: 600,
      fontSize: "0.9rem",
      margin: "0.4rem 0.5rem",
      padding: "0.4rem 0.85rem",
      borderRadius: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      background: isActive
        ? "linear-gradient(90deg, rgba(0,212,255,0.2), rgba(255,184,0,0.15))"
        : "transparent",
      borderBottom: isActive ? "2px solid #00D4FF" : "2px solid transparent",
      transition: "all 0.3s ease"
    });
  };

  const buttonStyle = {
    borderRadius: "50px",
    padding: "0.45rem 1.3rem",
    background: "linear-gradient(90deg, #00D4FF, #0066FF)",
    backgroundSize: "200% 200%",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    boxShadow: "0 0 16px rgba(0,212,255,0.3)",
    transition: "all 0.4s ease",
  };

  // Animates button gradient and scale on mouse hover
  const handleHover = (e, enter) => {
    e.currentTarget.style.backgroundPosition = enter ? "100% 0%" : "0% 0%";
    e.currentTarget.style.transform = enter ? "scale(1.05)" : "scale(1)";
    e.currentTarget.style.boxShadow = enter
      ? "0 0 24px rgba(0,212,255,0.5)"
      : "0 0 16px rgba(0,212,255,0.3)";
  };

  return (
    <>
      <BsNavbar
        expanded={expanded}
        onToggle={
        // Toggles mobile hamburger menu open/closed
        () => {
          return setExpanded(!expanded);
        }}
        expand="lg"
        fixed="top"
        style={navbarStyle}
        className={`py-1 main-navbar ${expanded ? 'main-navbar--expanded' : ''} ${isScrolled ? 'main-navbar--scrolled' : ''}`}
      >
        <Container>
          {/* Brand */}
          <BsNavbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center"
            onClick={
            // Closes mobile menu and navigates to homepage
            () => {
              return setExpanded(false);
            }}
            onDoubleClick={
            // Secret triple-click on logo navigates to admin login page
            () => {
              setClickCount(clickCount + 1);
              if (clickCount + 1 === 3) {
                navigate("/admin");
                setClickCount(0);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <img 
              src="/assets/Logo.png" 
              alt="Login Sports Academy Logo" 
              className=" logo-3d-animate"
              style={{ 
                height: "60px", 
                width: "auto", 
                marginRight: "25px",
                filter: isScrolled ? "none" : "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))"
              }} 
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span
                className="main-navbar__brand-title"
                style={{
                  margin: 0,
                  fontSize: "clamp(0.95rem, 2.8vw, 1.25rem)",
                  fontWeight: 800,
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "1.5px",
                  background: "linear-gradient(135deg, #FFB800 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                LOG IN
              </span>
              <span
                style={{
                  fontSize: "clamp(0.55rem, 1.5vw, 0.7rem)",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  color: "rgba(255,255,255,0.75)",
                  textTransform: "uppercase",
                }}
              >
                Sports Academy
              </span>
            </div>
          </BsNavbar.Brand>

          {/* Mobile Toggle */}
          <BsNavbar.Toggle
            aria-controls="main-nav"
            className="main-navbar__toggle"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "6px 10px",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "1.3rem",
                fontWeight: 700,
              }}
            >
              ☰
            </span>
          </BsNavbar.Toggle>

          {/* Nav Links */}
          <BsNavbar.Collapse id="main-nav" className="mt-3 mt-lg-0">
            <Nav className="mx-auto text-center text-lg-start main-navbar__links">
              {links.map(
              // Renders each navigation link
              item => {
                return (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    onClick={
                    // Closes mobile menu when a nav link is tapped
                    () => {
                      return setExpanded(false);
                    }}
                    className="main-navbar__link"
                    style={linkStyle(item.path)}
                    onMouseEnter={
                    // Highlights the nav link background on hover
                    e => {
                      if (location.pathname !== item.path)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={
                    // Removes nav link hover highlight
                    e => {
                      if (location.pathname !== item.path)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {item.label}
                  </Nav.Link>
                );
              })}
            </Nav>

            {/* CTA Buttons */}
            <div className="d-flex justify-content-center justify-content-lg-end gap-2 mt-3 mt-lg-0 main-navbar__cta">
              
              <Link to="/admin" onClick={
              // Closes mobile menu when Login button is tapped
              () => {
                return setExpanded(false);
              }}>
                <Button
                  style={{
                    borderRadius: "50px",
                    padding: "0.45rem 1.3rem",
                    background: "linear-gradient(90deg, #FFB800, #FF6B35)",
                    backgroundSize: "200% 200%",
                    border: "none",
                    color: "#0a0e1a",
                    fontWeight: 700,
                    boxShadow: "0 0 16px rgba(255,184,0,0.3)",
                    transition: "all 0.4s ease",
                  }}
                  onMouseEnter={
                  // Animates Login button gradient shift and glow on hover
                  e => {
                    e.currentTarget.style.backgroundPosition = "100% 0%";
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(255,184,0,0.5)";
                  }}
                  onMouseLeave={
                  // Resets Login button to default style
                  e => {
                    e.currentTarget.style.backgroundPosition = "0% 0%";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(255,184,0,0.3)";
                  }}
                >
                  Admin
                </Button>
              </Link>
              
              <Link to="/membership" onClick={
              // Closes mobile menu when Join Now button is tapped
              () => {
                return setExpanded(false);
              }}>
                <Button
                  style={buttonStyle}
                  onMouseEnter={
                  // Animates Join Now button hover effect
                  e => {
                    return handleHover(e, true);
                  }}
                  onMouseLeave={
                  // Resets Join Now button to default style
                  e => {
                    return handleHover(e, false);
                  }}
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </>
  );
};

const styles = `
  .navbar-collapse {
    will-change: height, opacity;
    transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .navbar-toggler:focus {
    box-shadow: none !important;
    outline: none !important;
  }

  .main-navbar {
    backface-visibility: hidden;
  }

  /* Reduce paint operations during mobile expansion */
  @media (max-width: 991px) {
    .navbar-collapse.collapsing, .navbar-collapse.show {
      background: transparent;
      margin-top: 15px;
      padding-bottom: 20px;
    }
  }
  
  @keyframes logo3DFloat {
    0% { transform: perspective(800px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1.5); }
    50% { transform: perspective(800px) translateY(-4px) rotateX(4deg) rotateY(5deg) scale(1.55); }
    100% { transform: perspective(800px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1.5); }
  }
  
  .logo-3d-animate {
    animation: logo3DFloat 5s ease-in-out infinite;
    transform-style: preserve-3d;
    will-change: transform;
  }
`;

// Inject styles once
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Navbar;
