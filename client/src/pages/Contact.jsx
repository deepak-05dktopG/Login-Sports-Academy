/**
 * What it is: Website page (Contact screen).
 * Non-tech note: This is the contact form + contact details users can send.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "@emailjs/browser";
import Swal from 'sweetalert2';
import { formatDateTime } from "../utils/dateTime";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaClock, FaHeadset, FaUsers } from "react-icons/fa";


const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";



// Contact page — feedback form (EmailJS + DB), office hours, social links, and FAQ for Login Sports Academy
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(
  // Initialize AOS scroll animations for contact sections on page load
  () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out-cubic",
      once: false,
      offset: 80,
      disable: false
    });
    AOS.refresh();
  }, []);

  // Update form field value (name, email, phone, or message) as user types
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit feedback: save to database then send email + auto-reply via EmailJS
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database first
      const response = await fetch(`${apiBase}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save feedback');
      }
      
      // Then send email via EmailJS
      try {
        await emailjs.send(
          "service_ecp1fzd",
          "template_gos1gyj",
          {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            message: formData.message,
				time: formatDateTime(new Date()),
          },
          "mbQp-0kZOmadPSjVn"
        );
        
        // Send auto-reply
        await emailjs.send("service_ecp1fzd", "template_paafjhg", {
          from_name: formData.name,
          phone: formData.phone,
        }, "mbQp-0kZOmadPSjVn");
        // Both database and email successful
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Message Sent Successfully!',
          text: "We received your message. We'll get back to you within 24 hours!",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          background: 'linear-gradient(135deg, #4ECDC4, #54A0FF)',
          color: '#fff',
          iconColor: '#fff'
        });
      } catch (emailError) {
        console.error('EmailJS error:', emailError);
        // Database saved but email failed
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Message Saved!',
          text: "We'll get back to you soon. (Email notification pending)",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          background: 'linear-gradient(135deg, #FFD93D, #FF9FF3)',
          color: '#fff',
          iconColor: '#fff'
        });
      }

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to Send Message',
        text: 'Try again later or contact via Phone/Email/WhatsApp.',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: 'linear-gradient(135deg, #FF6B6B, #FF9FF3)',
        color: '#fff',
        iconColor: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    { icon: <FaPhone size={28} />, link: 'tel:+919952139201', title: "Phone", value: "+91 99521-39201", color: "#00D4FF" },
    { icon: <FaEnvelope size={28} />, link: 'mailto:loginsportsacademy@gmail.com', title: "Email", value: "loginsportsacademy@gmail.com", color: "#FFB800" },
    { icon: <FaMapMarkerAlt size={28} />, link: 'https://maps.google.com/?q=Login+Sports+Academy+Salem', title: "Location", value: "Nethimedu, Salem - 636002", color: "#00D4FF" },
    { icon: <FaWhatsapp size={28} />, link: 'https://wa.me/919952139201', title: "WhatsApp", value: "+91 99521-39201", color: "#25D366" }
  ];

  const officeHours = [
    { day: "Tue - Sat (Swimming)", hours: "6:00 AM - 6:00 PM" },
    { day: "Sun & Mon (Swimming)", hours: "6:00 AM - 6:00 PM (Public)" },
    { day: "Mon - Fri (Badminton)", hours: "5:00 AM - 10:00 PM" },
    { day: "Sat & Sun (Badminton)", hours: "10:00 AM - 8:00 PM" }
  ];

  const socialMedia = [
    { icon: <FaInstagram size={24} />, name: "Instagram", color: "#E4405F", link: "https://www.instagram.com/loginsportsacademy" },
    { icon: <FaWhatsapp size={24} />, name: "WhatsApp", color: "#25D366", link: "https://wa.me/919952139201" },
  ];

  const mainStyle = {
    minHeight: "auto",
    overflow: "hidden",
    position: "relative"
  };

  const [hoveredCard, setHoveredCard] = useState(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [socialHovered, setSocialHovered] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#050810", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      {/* ======================= IMMERSIVE HERO ======================= */}
      <section style={{
        position: "relative",
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 20px 50px",
        overflow: "hidden"
      }}>
        {/* Background Image with Parallax & Ken Burns Effect */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/assets/home_hero_indian.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "kenBurns 20s infinite alternate ease-in-out",
          zIndex: 0
        }} />
        
        {/* Cinematic Gradient Overlay */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to bottom, rgba(5,8,16,0.6) 0%, rgba(5,8,16,0.9) 70%, #050810 100%)",
          zIndex: 1
        }} />

        <div style={{ zIndex: 2, maxWidth: "900px" }} data-aos="zoom-out" data-aos-duration="1200">
          <div className="mb-4 d-inline-flex align-items-center gap-3 px-4 py-2" style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <FaHeadset style={{ color: "#00D4FF" }} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>We're Here To Help</span>
          </div>
          
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "20px",
            textShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            GET IN <span style={{ background: "linear-gradient(135deg, #00D4FF, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TOUCH</span>
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
          }}>
            Have a question about our programs, membership, or timings? Drop us a message and our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* ======================= CONTACT BENTO SECTION ======================= */}
      <section style={{ padding: "0 0 100px", position: "relative", zIndex: 5, marginTop: "-80px" }}>
        <div className="container">
          <div className="row g-4 mb-4">
            {/* Form Section */}
            <div className="col-lg-7" data-aos="fade-up" data-aos-delay="0">
              <div className="bento-contact-card h-100" style={{ padding: "50px" }}>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "30px", color: "#fff" }}>
                  Send a <span style={{ color: "#FFB800" }}>Message</span>
                </h3>
                
                <form onSubmit={handleSubmit} className="bento-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" name="name" className="bento-input" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" name="email" className="bento-input" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <input type="tel" name="phone" className="bento-input" pattern="[0-9]{10,14}" minLength="10" maxLength="14" placeholder="WhatsApp Number (10 digits)" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <textarea name="message" className="bento-input" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="bento-btn w-100 justify-content-center" disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick Links / Info Section */}
            <div className="col-lg-5 d-flex flex-column gap-4">
              {contactMethods.map((method, idx) => (
                <a href={method.link} key={idx} className="bento-contact-mini-card" data-aos="fade-up" data-aos-delay={idx * 50}>
                  <div className="contact-icon" style={{ backgroundColor: `${method.color}15`, color: method.color }}>
                    {method.icon}
                  </div>
                  <div>
                    <h5 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: "0 0 5px 0" }}>{method.title}</h5>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", margin: 0, fontWeight: 500 }}>{method.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {/* Office Hours */}
            <div className="col-lg-6" data-aos="fade-up">
              <div className="bento-contact-card h-100" style={{ padding: "40px" }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="contact-icon" style={{ backgroundColor: "rgba(0,212,255,0.15)", color: "#00D4FF" }}><FaClock size={24} /></div>
                  <h4 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Hours of Operation</h4>
                </div>
                
                <div className="d-flex flex-column gap-3">
                  {officeHours.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center" style={{ paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "0.9rem" }}>{item.day}</span>
                      <span style={{ color: "#FFD54F", fontWeight: 700, fontSize: "0.95rem" }}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="col-lg-6" data-aos="fade-up">
              <div className="bento-contact-card h-100" style={{ padding: "40px" }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="contact-icon" style={{ backgroundColor: "rgba(255,184,0,0.15)", color: "#FFB800" }}><FaUsers size={24} /></div>
                  <h4 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>FAQ</h4>
                </div>

                <div className="bento-faq-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#00D4FF", fontSize: "0.85rem", marginBottom: "8px" }}>What age groups?</div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", margin: 0 }}>Swimming: all ages. Badminton: Age 6 and above. Beginners to advanced.</p>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#FFB800", fontSize: "0.85rem", marginBottom: "8px" }}>Ladies only batch?</div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", margin: 0 }}>Yes, exclusive ladies swimming batch Tue–Sat 10–11 AM.</p>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#00D4FF", fontSize: "0.85rem", marginBottom: "8px" }}>Are coaches certified?</div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", margin: 0 }}>Yes — FINA World Championship reps, ASCA Level 3, National players.</p>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#FFB800", fontSize: "0.85rem", marginBottom: "8px" }}>Need special shoes?</div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", margin: 0 }}>Yes, non-marking shoes are strictly mandatory for badminton.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .bento-contact-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .bento-contact-mini-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .bento-contact-mini-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-5px);
        }

        .contact-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Form Inputs */
        .bento-input {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 15px !important;
          padding: 16px 20px !important;
          color: #fff !important;
          font-size: 0.95rem;
          width: 100%;
          transition: all 0.3s ease;
        }

        .bento-input::placeholder { color: rgba(255,255,255,0.4) !important; }

        .bento-input:focus {
          background: rgba(255,255,255,0.06) !important;
          border-color: #00D4FF !important;
          box-shadow: 0 0 15px rgba(0,212,255,0.2) !important;
          outline: none !important;
        }

        textarea.bento-input {
          resize: vertical;
          min-height: 120px;
        }

        .bento-btn {
          background: linear-gradient(135deg, #00D4FF, #0066FF);
          color: white;
          border: none;
          padding: 16px 30px;
          border-radius: 15px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .bento-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,212,255,0.3);
        }

        .bento-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .bento-contact-card { padding: 30px 20px !important; }
          .bento-faq-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
