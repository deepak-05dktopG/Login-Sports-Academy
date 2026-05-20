import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSwimmingPool, FaTableTennis, FaTrophy, FaUsers, FaCheckCircle, FaStar, FaArrowRight, FaMedal, FaGlobeAsia, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: false, offset: 50 });
    AOS.refresh();
    
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${apiBase}/gallery`);
        const data = await response.json();
        if (data.success) { setGallery(data.data); }
      } catch (error) { console.error('Error fetching gallery:', error); }
    };
    fetchGallery();
  }, []);

  const [gallery, setGallery] = useState([]);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const stats = [
    { icon: <FaUsers />, number: "6+", label: "ASCA Certified Coaches", color: "#00D4FF" },
    { icon: <FaStar />, number: "2", label: "National Coaches", color: "#FFB800" },
    { icon: <FaTrophy />, number: "45+", label: "National Medals Won", color: "#00D4FF" },
    { icon: <FaGlobeAsia />, number: "FINA", label: "Championship Reps", color: "#FFB800" },
  ];

  const values = [
    { icon: <FaTrophy />, title: "Excellence", desc: "World-class coaching standards with FINA & ASCA certifications.", color: "#00D4FF" },
    { icon: <FaUsers />, title: "Inclusivity", desc: "Programs for all ages & levels — from beginners to national athletes.", color: "#FFB800" },
    { icon: <FaMedal />, title: "Achievement", desc: "Track record of producing state and national-level medalists.", color: "#00D4FF" },
    { icon: <FaGlobeAsia />, title: "Vision", desc: "Building Salem's premier multi-sport training destination.", color: "#FFB800" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#050810", color: "#fff" }}>
      <Navbar />

      {/* ======================= IMMERSIVE HERO ======================= */}
      <section style={{
        position: "relative",
        minHeight: "75vh",
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
          backgroundImage: "url('/assets/homehero1.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "kenBurns 20s infinite alternate ease-in-out",
          zIndex: 0
        }} />
        
        {/* Cinematic Gradient Overlay */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to bottom, rgba(5,8,16,0.5) 0%, rgba(5,8,16,0.8) 60%, #050810 100%)",
          zIndex: 1
        }} />

        <div style={{ zIndex: 2, maxWidth: "900px" }} data-aos="zoom-out" data-aos-duration="1200">
          <div className="mb-4 d-inline-flex align-items-center gap-3 px-4 py-2" style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <FaStar style={{ color: "#FFB800" }} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Salem's Elite Academy</span>
          </div>
          
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "20px",
            textShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            ABOUT LOGIN <br />
            <span style={{ background: "linear-gradient(135deg, #00D4FF, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SPORTS ACADEMY</span>
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
          }}>
            Established with a vision to build champions, we are Salem's premier destination for professional Swimming and Badminton coaching.
          </p>
        </div>
      </section>

      {/* ======================= STATS BENTO ======================= */}
      <section style={{ padding: "40px 0 80px", position: "relative", zIndex: 5, marginTop: "-80px" }}>
        <div className="container">
          <div className="bento-grid-stats">
            {stats.map((stat, i) => (
              <div className="bento-stat-card" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <div style={{ fontSize: "2.5rem", marginBottom: "15px", color: stat.color }}>{stat.icon}</div>
                <h3 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "'Orbitron', sans-serif", margin: "0 0 5px", color: "#fff" }}>{stat.number}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", margin: 0, fontWeight: 700 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= OUR STORY (ASYMMETRICAL) ======================= */}
      <section style={{ padding: "60px 0 100px", position: "relative" }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="story-image-wrapper">
                <img src="/assets/homehero2.jpeg" alt="Academy Facilities" className="img-fluid" />
                <div className="story-badge">
                  <FaMedal style={{ fontSize: "2rem", color: "#FFB800", marginBottom: "10px" }} />
                  <h5 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem" }}>Excellence</h5>
                  <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.8 }}>Since Inception</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6" data-aos="fade-left">
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800, marginBottom: "20px" }}>
                OUR <span style={{ color: "#00D4FF" }}>LEGACY</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "30px" }}>
                Login Sports Academy brings together the best infrastructure and coaching talent in Salem. Our swimming program is spearheaded by FINA World Championship representatives and National Medalists. Our Badminton courts host university and national-level coaching.
              </p>
              
              <div className="d-flex flex-column gap-3">
                <div className="legacy-item">
                  <div className="legacy-icon" style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00D4FF" }}><FaSwimmingPool /></div>
                  <div>
                    <h5 style={{ margin: "0 0 5px", fontWeight: 700 }}>Swimming</h5>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>ASCA Level 3 coaches, dedicated ladies batches, and competitive training.</p>
                  </div>
                </div>
                <div className="legacy-item">
                  <div className="legacy-icon" style={{ backgroundColor: "rgba(255,184,0,0.1)", color: "#FFB800" }}><FaTableTennis /></div>
                  <div>
                    <h5 style={{ margin: "0 0 5px", fontWeight: 700 }}>Badminton</h5>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Professional wooden/synthetic courts with footwork & strategy coaching.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CORE VALUES BENTO ======================= */}
      <section style={{ padding: "80px 0", backgroundColor: "#0a0e1a", position: "relative" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,212,255,0.05), transparent 60%)", filter: "blur(60px)", zIndex: 0 }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800 }}>
              CORE <span style={{ color: "#FFB800" }}>VALUES</span>
            </h2>
          </div>
          
          <div className="bento-grid-values">
            {values.map((v, i) => (
              <div className="bento-value-card" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="value-icon" style={{ color: v.color }}>{v.icon}</div>
                <h4 style={{ color: "#fff", fontWeight: 800, marginBottom: "15px", fontSize: "1.3rem" }}>{v.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= GALLERY SECTION ======================= */}
      {gallery.length > 0 && (
        <section style={{ padding: "100px 0", backgroundColor: "#050810" }}>
          <div className="container">
            <div className="text-center mb-5" data-aos="fade-up">
              <p className="section-pre-title" style={{ color: "#00D4FF", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "15px" }}>Moments of Achievement</p>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800 }}>OUR <span style={{ color: "#00D4FF" }}>GALLERY</span></h2>
            </div>

            <div className="gallery-grid">
              {(isGalleryExpanded ? gallery : gallery.slice(0, 3)).map((img, i) => (
                <div className="gallery-item-pro" key={img._id} data-aos="zoom-in" data-aos-delay={i * 50}>
                  <img src={img.imageUrl} alt={img.title || "Gallery Image"} loading="lazy" />
                  <div className="gallery-hover-overlay">
                    <p>{img.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {gallery.length > 3 && (
              <div className="text-center mt-5">
                <button 
                  onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                  className="bento-btn"
                  style={{ background: "transparent", border: "2px solid #fff", color: "#fff", padding: "12px 40px" }}
                >
                  {isGalleryExpanded ? "Show Less" : "See More"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================= LOCATION & CONTACT ======================= */}
      <section style={{ padding: "100px 0", position: "relative" }}>
        <div className="container">
          <div className="row g-5 align-items-stretch">
            <div className="col-lg-5" data-aos="fade-right">
              <div className="bento-contact-card">
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.2rem", fontWeight: 800, marginBottom: "30px" }}>
                  FIND <span style={{ color: "#00D4FF" }}>US</span>
                </h2>
                
                <div className="contact-detail">
                  <div className="contact-icon"><FaMapMarkerAlt /></div>
                  <div>
                    <h6 style={{ color: "#FFB800", fontWeight: 700, margin: "0 0 5px" }}>Address</h6>
                    <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.6 }}>
                      Muthaiya Pillai Thottam, 2/295 A,<br />
                      Sankari Main Rd, Kathayammal Nagar,<br />
                      Nethimedu, Salem - 636002
                    </p>
                  </div>
                </div>

                <div className="contact-detail mt-4">
                  <div className="contact-icon"><FaPhoneAlt /></div>
                  <div>
                    <h6 style={{ color: "#FFB800", fontWeight: 700, margin: "0 0 5px" }}>Phone</h6>
                    <div className="d-flex flex-column gap-1">
                      <a href="tel:+919952139201" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>+91 99521 39201</a>
                      <a href="tel:+919865068086" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>+91 98650 68086</a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5">
                  <NavLink to="/contact" className="bento-btn primary-btn w-100 justify-content-center">
                    Get in Touch <FaArrowRight />
                  </NavLink>
                </div>
              </div>
            </div>
            
            <div className="col-lg-7" data-aos="fade-left">
              <div className="map-wrapper">
                <iframe
                  title="Login Sports Academy Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.5!2d78.146!3d11.664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM5JzUwLjQiTiA3OMKwMDgnNDUuNiJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles for Bento Box UI */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        .bento-grid-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        .bento-stat-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 30px 20px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .bento-stat-card:hover {
          transform: translateY(-10px);
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .story-image-wrapper {
          position: relative;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .story-image-wrapper img {
          width: 100%;
          height: auto;
          object-fit: cover;
          aspect-ratio: 4/5;
        }
        
        .story-badge {
          position: absolute;
          bottom: 30px;
          right: -30px;
          background: rgba(10,14,26,0.85);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 20px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          transform: translateX(-50px);
        }
        
        .legacy-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        
        .legacy-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
          transform: translateX(10px);
        }
        
        .legacy-icon {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .bento-grid-values {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        
        .bento-value-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 30px;
          padding: 40px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }
        
        .bento-value-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 25px;
        }
        
        .bento-contact-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 40px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .contact-detail {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }
        
        .contact-icon {
          color: #00D4FF;
          font-size: 1.2rem;
          margin-top: 2px;
        }
        
        .map-wrapper {
          border-radius: 30px;
          overflow: hidden;
          height: 100%;
          min-height: 400px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .bento-btn {
          padding: 16px 36px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
        }
        
        .primary-btn {
          background: linear-gradient(135deg, #00D4FF, #0066FF);
          color: white;
          box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
        }
        
        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 212, 255, 0.4);
          color: white;
        }

        /* Gallery CSS */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }
        .gallery-item-pro {
          position: relative;
          border-radius: 25px;
          overflow: hidden;
          aspect-ratio: 4/3;
          border: 1px solid rgba(255,255,255,0.1);
          background: #0a0e1a;
        }
        .gallery-item-pro img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: #000;
        }
        .gallery-hover-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 25px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
        }
        .gallery-hover-overlay p {
          color: #fff;
          margin: 0;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .gallery-item-pro:hover img {
          transform: scale(1.1);
        }
        .gallery-item-pro:hover .gallery-hover-overlay {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .bento-grid-stats { grid-template-columns: repeat(2, 1fr); }
          .story-badge { right: 20px; transform: translateX(0); }
        }
        
        @media (max-width: 768px) {
          .bento-grid-values { grid-template-columns: 1fr; }
          .bento-grid-stats { grid-template-columns: 1fr; gap: 15px; }
          section { padding: 60px 0; }
        }
      `}</style>
    </div>
  );
};

export default About;
