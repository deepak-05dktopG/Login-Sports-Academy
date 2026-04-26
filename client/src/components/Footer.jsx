/**
 * What it is: Website footer component.
 * Non-tech note: This controls the bottom section with contact/social info.
 */

import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaEnvelope,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaSwimmingPool,
  FaTableTennis,
} from "react-icons/fa";



// Website footer with Login Sports Academy branding, social links, navigation, and contact info
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0f1629 40%, #141b2d 100%)",
        color: "white",
        paddingTop: "3rem", /* Reduced from 5rem */
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Floating Glow Blobs */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(0,212,255,0.12), transparent)",
          top: "-80px",
          left: "-80px",
          filter: "blur(60px)",
        }}
      ></div>
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(255,184,0,0.1), transparent)",
          bottom: "-100px",
          right: "-100px",
          filter: "blur(70px)",
        }}
      ></div>

      <Container>
        <Row className="g-4">
          {/* Column 1 – Brand Info */}
          <Col md={4}>
            <div 
              onClick={
              // Navigates to homepage when logo is clicked
              () => {
                navigate("/");
              }}
              style={{ cursor: "pointer", marginBottom: "15px" }}
            >
              <img 
                src="/assets/Logo.png" 
                alt="Login Sports Academy Logo" 
                style={{ 
                  height: "70px", 
                  width: "auto", 
                  marginBottom: "10px",
                  filter: "drop-shadow(0 0 12px rgba(0,212,255,0.3))"
                }} 
              />
            </div>
            <h4
              className="fw-bold mb-2"
              style={{ 
                fontSize: "1.4rem", 
                fontFamily: "'Orbitron', sans-serif",
                background: "linear-gradient(135deg, #FFB800, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LOG IN SPORTS ACADEMY
            </h4>
            <p className="mb-1" style={{ opacity: 0.7, fontSize: "0.85rem", fontStyle: "italic" }}>
              Unlock Your Game. Elevate Your Passion.
            </p>
            <div className="d-flex gap-2 mb-3" style={{ fontSize: "0.8rem" }}>
              <span style={{ 
                padding: "3px 10px", borderRadius: "999px", 
                background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)",
                color: "#4DE8FF", display: "flex", alignItems: "center", gap: "4px"
              }}>
                <FaSwimmingPool /> Swimming
              </span>
              <span style={{ 
                padding: "3px 10px", borderRadius: "999px",
                background: "rgba(255,184,0,0.12)", border: "1px solid rgba(255,184,0,0.25)",
                color: "#FFD54F", display: "flex", alignItems: "center", gap: "4px"
              }}>
                <FaTableTennis /> Badminton
              </span>
            </div>
            <p className="mb-3" style={{ opacity: 0.7, lineHeight: "1.6", fontSize: "0.85rem" }}>
              Train with FINA-level coaches & National players. Professional coaching for swimming & badminton for all ages.
            </p>
            <div className="d-flex gap-3">
              {[
                { icon: <FaInstagram />, link: "https://www.instagram.com/loginsportsacademy" },
                { icon: <FaWhatsapp />, link: "https://wa.me/919952139201" },
              ].map(
              // Renders each social media icon as a circular link
              (social, index) => {
                return (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "1.1rem",
                      transition: "all 0.4s ease",
                    }}
                    onMouseEnter={
                    // Highlights social media icon on hover
                    e => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #00D4FF, #FFB800)";
                      e.currentTarget.style.color = "#0a0e1a";
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.4)";
                    }}
                    onMouseLeave={
                    // Resets social media icon to default style
                    e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>
          </Col>

          {/* Column 2 – Quick Links */}
          <Col md={4}>
            <h5 className="fw-semibold mb-3" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.9)" }}>
              Quick Links
            </h5>
            <div className="d-flex flex-column gap-2">
              {[
                { text: "Our Programs", link: "/programs" },
                { text: "Membership Plans", link: "/membership" },
                { text: "About Us", link: "/about" },
                { text: "Our Team", link: "/team" },
                // { text: "Shop", link: "/shop" },
                { text: "Contact Us", link: "/contact" },
              ].map(
              // Renders each quick link as a footer navigation item
              (link, i) => {
                return (
                  <Link
                    key={i}
                    to={link.link}
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      fontSize: "0.9rem",
                    }}
                    onMouseEnter={
                    // Adds left padding indent on quick link hover
                    e => {
                      e.currentTarget.style.color = "#00D4FF";
                      e.currentTarget.style.paddingLeft = "8px";
                    }}
                    onMouseLeave={
                    // Removes left padding indent when mouse leaves quick link
                    e => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </div>
          </Col>

          {/* Column 3 – Contact */}
          <Col md={4}>
            <h5 className="fw-semibold mb-3" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.9)" }}>
              Contact Us
            </h5>
            <div className="d-flex flex-column gap-3">
              {[
                {
                  icon: <FaMapMarkerAlt />,
                  text: "2/295 A, Muthayapillai Thottam, Sankagiri Main Rd, Kathayammal Nagar, Nethimedu, Salem - 636002",
                },
                {
                  icon: <FaPhone />,
                  text: "+91 9952139201",
                  link: "tel:+919952139201",
                },
                {
                  icon: <FaPhone />,
                  text: "+91 9952169201",
                  link: "tel:+919952169201",
                },
                {
                  icon: <FaPhone />,
                  text: "+91 9865068086",
                  link: "tel:+919865068086",
                },
                {
                  icon: <FaEnvelope />,
                  text: "loginsportsacademy@gmail.com",
                  link: "mailto:loginsportsacademy@gmail.com",
                },
              ].map(
              // Renders each contact detail with icons
              (item, i) => {
                return (
                  <div key={i} className="d-flex gap-3 align-items-start">
                    <div style={{ fontSize: "1rem", marginTop: "2px", color: "#00D4FF", opacity: 0.7 }}>
                      {item.icon}
                    </div>
                    {item.link ? (
                      <a
                        href={item.link}
                        style={{
                          color: "rgba(255,255,255,0.65)",
                          textDecoration: "none",
                          transition: "color 0.3s ease",
                          fontSize: "0.88rem",
                        }}
                        onMouseEnter={
                        // Makes contact link brighter on hover
                        e => {
                          return (e.currentTarget.style.color = "#FFB800");
                        }}
                        onMouseLeave={
                        // Restores contact link to default
                        e => {
                          return (e.currentTarget.style.color = "rgba(255,255,255,0.65)");
                        }
                        }
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="mb-0" style={{ opacity: 0.65, fontSize: "0.88rem" }}>
                        {item.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>

        {/* Divider */}
        <hr
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: "1.5rem",
            marginBottom: "1.5rem"
          }}
        />

        {/* Bottom Bar */}
        <p
          className="text-center mb-0 pb-3"
          style={{
            opacity: 0.5,
            fontSize: "0.82rem",
            letterSpacing: "0.3px",
          }}
        >
          © {new Date().getFullYear()} Login Sports Academy. All rights reserved. <br />
          <a href="https://loginsportsacademy.in" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            loginsportsacademy.in
          </a>
        </p>
      </Container>

      {/* Top Wave */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="position-absolute top-0 start-0 w-100"
        style={{ transform: "rotate(180deg)", height: "40px" }}
      >
        <path
          fill="#0a0e1a"
          d="M0,64L60,69.3C120,75,240,85,360,85.3C480,85,600,75,720,74.7C840,75,960,85,1080,90.7C1200,96,1320,96,1380,85.3L1440,75V100H0Z"
        ></path>
      </svg>
    </footer>
  );
};

export default Footer;
