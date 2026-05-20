import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSwimmingPool, FaTableTennis, FaArrowRight, FaMapMarkerAlt, FaMedal, FaStar, FaUsers, FaCheckCircle } from "react-icons/fa";

const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const heroImages = [
    '/assets/homehero1.jpeg',
    '/assets/homehero2.jpeg'
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out-cubic", once: false, offset: 50 });
    AOS.refresh();
    fetchPosts();
    fetchGallery();
    // Show the promotional video modal on page load
    setShowVideoModal(true);

    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${apiBase}/gallery`);
      const data = await response.json();
      if (data.success) { setGallery(data.data); }
    } catch (error) { console.error('Error fetching gallery:', error); }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${apiBase}/posts`);
      const data = await response.json();
      if (data.success) { setPosts(data.data.slice(0, 3)); }
    } catch (error) { console.error('Error fetching posts:', error); }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#050810", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      {/* ======================= COMPACT RIGHT VIDEO HERO ======================= */}
      <section className="hero-compact-right">
        {/* Cinematic Background Image Slideshow */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="hero-bg-image"
            style={{
              backgroundImage: `url('${img}')`,
              opacity: currentHeroImage === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
          ></div>
        ))}
        <div className="hero-bg-overlay"></div>

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div className="row align-items-center" style={{ padding: "120px 0 80px 0" }}>

            {/* Typography & CTA */}
            <div className="col-lg-12 text-center" data-aos="fade-up" data-aos-duration="1200">
              <div className="hero-pill mb-4 mx-auto">
                <FaStar className="pill-icon" />
                Premium Sports Academy
              </div>

              <h1 className="hero-title-dynamic">
                DEFINE YOUR <br />
                <span className="text-gradient-gold">LEGACY.</span>
              </h1>

              <p className="hero-subtitle-dynamic mx-auto" style={{ maxWidth: '700px' }}>
                Train relentlessly. Perform flawlessly. Access Salem's elite Olympic-standard facilities and world-class coaching to unlock your true athletic potential.
              </p>

              <div className="hero-buttons-compact mt-5 justify-content-center">
                <NavLink to="/membership" className="btn-solid-gold-glow">
                  Join The Academy <FaArrowRight style={{ marginLeft: "8px" }} />
                </NavLink>
                <div className="hero-stats-inline ms-0 ms-sm-4 mt-4 mt-sm-0">
                  <div className="stat-item">
                    <strong>500+</strong> Athletes
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <strong>FINA</strong> Certified
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================= INFINITE MARQUEE ======================= */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>SWIMMING COACHING</span><span className="dot">•</span>
          <span>BADMINTON COURTS</span><span className="dot">•</span>
          <span>ELITE TRAINING</span><span className="dot">•</span>
          <span>LADIES BATCHES</span><span className="dot">•</span>
          <span>FINA CERTIFIED</span><span className="dot">•</span>
          <span>SWIMMING COACHING</span><span className="dot">•</span>
          <span>BADMINTON COURTS</span><span className="dot">•</span>
          <span>ELITE TRAINING</span><span className="dot">•</span>
          <span>LADIES BATCHES</span><span className="dot">•</span>
          <span>FINA CERTIFIED</span><span className="dot">•</span>
        </div>
      </div>

      {/* ======================= THE ACADEMY DIFFERENCE (ADVANCED BENTO) ======================= */}
      <section style={{ padding: "120px 0", position: "relative" }}>
        <div className="container" style={{ zIndex: 1, position: "relative" }}>

          <div className="text-center mb-5" data-aos="fade-up">
            <p className="section-pre-title">Why Choose Us</p>
            <h2 className="section-title">
              THE ACADEMY <span className="text-gradient-cyan">DIFFERENCE</span>
            </h2>
          </div>

          <div className="bento-grid-pro">
            {/* Box 1: Swimming (Large Image Card) */}
            <div className="bento-pro-item card-swimming" data-aos="fade-up" data-aos-delay="100">
              <div className="card-bg" style={{ backgroundImage: "url('/assets/homehero1.jpeg')" }} />
              <div className="card-overlay" />
              <div className="card-content">
                <div className="icon-glass cyan"><FaSwimmingPool /></div>
                <h3>Olympic Standard Swimming</h3>
                <p>Train in our pristine, temperature-regulated pools. From infant water safety to competitive stroke mechanics, led by ASCA Level 3 coaches.</p>
                <NavLink to="/programs" className="card-link cyan-link">Discover Swimming <FaArrowRight /></NavLink>
              </div>
            </div>

            {/* Box 2: Badminton (Large Image Card) */}
            <div className="bento-pro-item card-badminton" data-aos="fade-up" data-aos-delay="200">
              <div className="card-bg" style={{ backgroundImage: "url('/assets/homehero2.jpeg')" }} />
              <div className="card-overlay" />
              <div className="card-content">
                <div className="icon-glass gold"><FaTableTennis /></div>
                <h3>Professional Badminton Courts</h3>
                <p>BWF approved synthetic flooring. Elite coaching tailored for footwork, strategy, and power, suitable for enthusiasts and pros alike.</p>
                <NavLink to="/programs" className="card-link gold-link">Discover Badminton <FaArrowRight /></NavLink>
              </div>
            </div>

            {/* Box 3: Trust Badges (Redesigned) */}
            <div className="bento-pro-item card-commitment" data-aos="fade-up" data-aos-delay="300" style={{ gridColumn: "span 1" }}>
              <div className="commitment-header">
                <FaMedal className="commitment-main-icon" />
                <h3>Our Commitment</h3>
              </div>
              <div className="commitment-grid">
                <div className="commitment-tile">
                  <FaCheckCircle className="tile-icon-small text-cyan" />
                  <span>100% Lifeguard Supervised</span>
                </div>
                <div className="commitment-tile">
                  <FaCheckCircle className="tile-icon-small text-gold" />
                  <span>BWF Standard Courts</span>
                </div>
                <div className="commitment-tile">
                  <FaCheckCircle className="tile-icon-small text-cyan" />
                  <span>Hygienic Facilities</span>
                </div>
                <div className="commitment-tile">
                  <FaCheckCircle className="tile-icon-small text-gold" />
                  <span>Personalized Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= TRAINING EXCELLENCE (BACKGROUND VIDEO) ======================= */}
      <section style={{
        position: "relative",
        padding: "150px 0",
        backgroundColor: "#050810",
        overflow: "hidden"
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%",
            objectFit: "cover", transform: "translate(-50%, -50%)", zIndex: 0, opacity: 0.3
          }}
        >
          <source src="/assets/trainingvideo.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(rgba(5,8,16,0.8), rgba(5,8,16,0.5), rgba(5,8,16,0.8))", zIndex: 1 }}></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-10" data-aos="fade-up">
              <p className="section-pre-title">Our Atmosphere</p>
              <h2 className="section-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                TRAINING <span className="text-gradient-gold">EXCELLENCE</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.2rem", lineHeight: "1.8", maxWidth: "800px", margin: "30px auto" }}>
                Step inside Salem's most elite training environment. From the rhythm of the badminton courts to the precision of our Olympic-standard pools, our academy is built for one purpose: to help you achieve your peak performance.
              </p>

              <div className="d-flex justify-content-center flex-wrap gap-4 mb-5">
                <div className="t-stat" style={{ minWidth: "180px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
                  <h4>80+</h4>
                  <p>Weekly Batches</p>
                </div>
                <div className="t-stat" style={{ minWidth: "180px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
                  <h4>15+</h4>
                  <p>Expert Coaches</p>
                </div>
              </div>

              <NavLink to="/programs" className="btn-solid-gold-glow">
                Explore Programs <FaArrowRight style={{ marginLeft: "10px" }} />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= RECENT UPDATES ======================= */}
      {posts.length > 0 && (
        <section style={{ padding: "100px 0", backgroundColor: "#080c17", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-end mb-5" data-aos="fade-up">
              <div>
                <p className="section-pre-title">News & Events</p>
                <h2 className="section-title">LATEST <span className="text-gradient-gold">UPDATES</span></h2>
              </div>
              <NavLink to="/about" className="view-all-link">View All <FaArrowRight /></NavLink>
            </div>

            <div className="row g-5">
              {posts.map((post, i) => (
                <div className="col-lg-4 col-md-6" key={post._id} data-aos="fade-up" data-aos-delay={i * 150}>
                  <div className="modern-update-card">
                    {post.imageUrl ? (
                      <div className="update-img-container">
                        <img src={post.imageUrl} alt={post.title} className="update-img" />
                        <div className="update-date-badge">
                          <span className="day">{new Date(post.createdAt).getDate()}</span>
                          <span className="month">{new Date(post.createdAt).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                      </div>
                    ) : null}
                    <div className="update-content-box">
                      <h4 className="update-title">{post.title}</h4>
                      <p className="update-desc">{post.content}</p>
                      <button className="read-more-btn">Read More <FaArrowRight /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ======================= GALLERY SECTION ======================= */}
      {gallery.length > 0 && (
        <section style={{ padding: "100px 0", backgroundColor: "#050810" }}>
          <div className="container">
            <div className="text-center mb-5" data-aos="fade-up">
              <p className="section-pre-title">Moments of Achievement</p>
              <h2 className="section-title">OUR <span className="text-gradient-cyan">GALLERY</span></h2>
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
                  className="btn-outline-white"
                  style={{ padding: "12px 40px", borderRadius: "50px" }}
                >
                  {isGalleryExpanded ? "Show Less" : "See More"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======================= FINAL CTA WITH BACKGROUND VIDEO ======================= */}
      <section className="cta-video-section">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="cta-video-bg"
        >
          <source src="/assets/trainingvideo.mp4" type="video/mp4" />
        </video>
        <div className="cta-video-overlay"></div>

        <div className="container cta-video-content" data-aos="fade-up">
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, marginBottom: "20px" }}>
            READY TO <span className="text-gradient-gold">START?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2rem", marginBottom: "40px", maxWidth: "700px", margin: "0 auto 40px" }}>
            Join over 500+ active members today and transform your athletic journey at Salem's premier sports destination.
          </p>
          <NavLink to="/membership" className="btn-solid-gold-glow" style={{ padding: "20px 50px", fontSize: "1.2rem" }}>
            Become a Member Now <FaArrowRight style={{ marginLeft: "15px" }} />
          </NavLink>
        </div>
      </section>


      {/* ======================= STYLES ======================= */}
      <style>{`
        /* Animations */
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ======================= COMPACT RIGHT VIDEO HERO CSS ======================= */
        .hero-compact-right {
          position: relative;
          width: 100%;
          background-color: #050810;
          overflow: hidden;
        }

        .hero-bg-image {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: cover;
          background-position: center;
          z-index: 1;
        }

        .hero-bg-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, rgba(5,8,16,0.95) 0%, rgba(5,8,16,0.8) 50%, rgba(5,8,16,0.4) 100%);
          z-index: 2;
        }

        .compact-video-wrapper {
          position: relative;
          width: 100%;
          max-width: 360px; /* Made significantly smaller to prevent overflow */
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255,184,0,0.2);
          border: 2px solid rgba(255,184,0,0.3);
          background-color: #000;
          transition: transform 0.3s ease;
        }

        .compact-video-wrapper:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 212, 255, 0.15);
        }

        .compact-video-element {
          width: 100%;
          height: auto;
          display: block;
        }

        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #fff;
        }

        .pill-icon {
          color: #FFB800;
        }

        .hero-title-dynamic {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          margin-bottom: 25px;
          color: #ffffff;
          letter-spacing: -2px;
          text-transform: uppercase;
        }

        .text-gradient-gold {
          background: linear-gradient(135deg, #FFB800 0%, #ff8c00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 40px rgba(255,184,0,0.4);
        }

        .hero-subtitle-dynamic {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.1rem, 1.5vw, 1.25rem);
          color: rgba(255,255,255,0.8);
          max-width: 600px;
          line-height: 1.8;
          font-weight: 400;
        }

        .hero-buttons-compact {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-solid-gold-glow {
          background: linear-gradient(135deg, #FFB800 0%, #ff8c00 100%);
          color: #050810;
          padding: 16px 35px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(255,184,0,0.4);
          display: inline-flex;
          align-items: center;
        }

        .btn-solid-gold-glow:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255,184,0,0.6);
          color: #050810;
        }

        .hero-stats-inline {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-item {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-item strong {
          color: #fff;
          font-size: 1.2rem;
          font-family: 'Orbitron', sans-serif;
          display: block;
        }

        .stat-divider {
          width: 2px;
          height: 30px;
          background: rgba(255,255,255,0.1);
        }

        .btn-solid-cyan {
          background-color: #00D4FF;
          color: #03060f;
          padding: 16px 40px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid #00D4FF;
        }

        .btn-solid-cyan:hover {
          background-color: #00b8e6;
          border-color: #00b8e6;
          transform: translateY(-2px);
          color: #03060f;
        }

        .btn-outline-white {
          background-color: rgba(255,255,255,0.05);
          color: #ffffff;
          padding: 16px 40px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(5px);
        }

        .btn-outline-white:hover {
          background-color: rgba(255,255,255,0.15);
          border-color: #ffffff;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Infinite Marquee */
        .marquee-container {
          background: linear-gradient(90deg, #00D4FF, #0066FF);
          padding: 15px 0;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
        .marquee-content span {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #fff;
          padding: 0 20px;
          letter-spacing: 2px;
        }
        .marquee-content span.dot {
          opacity: 0.5;
        }

        /* Training Video Showcase CSS */
        .training-video-showcase {
          position: relative;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          background: #000;
        }
        .training-video-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .video-badge-float {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #ff3b30;
          border-radius: 50%;
          animation: pulseRed 1.5s infinite;
        }
        @keyframes pulseRed {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .training-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .t-stat {
          background: rgba(255,255,255,0.03);
          padding: 20px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .t-stat h4 {
          color: #00D4FF;
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          margin-bottom: 5px;
        }
        .t-stat p {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Section Titles */
        .section-pre-title {
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          margin: 0;
        }

        /* Advanced Bento Grid */
        .bento-grid-pro {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(300px, auto);
          gap: 25px;
        }

        .bento-pro-item {
          position: relative;
          border-radius: 30px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-pro-item:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .card-swimming { grid-column: span 2; grid-row: span 2; }
        .card-badminton { grid-column: span 1; grid-row: span 2; }
        
        @media (max-width: 992px) {
          .bento-grid-pro { grid-template-columns: 1fr; }
          .card-swimming, .card-badminton { grid-column: span 1; }
        }

        .card-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.8s ease;
          z-index: 0;
        }
        .bento-pro-item:hover .card-bg {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to top, rgba(5,8,16,1) 0%, rgba(5,8,16,0.5) 50%, transparent 100%);
          z-index: 1;
        }

        .card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .icon-glass {
          width: 70px; height: 70px;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          margin-bottom: 25px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .icon-glass.cyan { color: #00D4FF; }
        .icon-glass.gold { color: #FFB800; }

        .card-content h3 {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 15px;
        }
        .card-content p {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
          max-width: 90%;
        }

        .card-link {
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: gap 0.3s ease;
        }
        .card-link:hover { gap: 15px; }
        .cyan-link { color: #00D4FF; }
        .gold-link { color: #FFB800; }

        /* Trust List */
        .card-dark {
          background: rgba(255,255,255,0.03);
          grid-column: span 2;
        }
        .trust-list {
          list-style: none;
          padding: 0; margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .trust-list li {
          font-size: 1.1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.8);
        }
        .text-cyan { color: #00D4FF; }
        .text-gold { color: #FFB800; }

        @media (max-width: 768px) {
          .trust-list { grid-template-columns: 1fr; }
          .card-dark { grid-column: span 1; }
        }

        /* CTA Card */
        .card-cta {
          background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,102,255,0.1));
          border-color: rgba(0,212,255,0.2);
          display: flex;
          align-items: center;
          padding: 40px;
        }
        .cta-content { width: 100%; text-align: center; }

        /* Modern Updates Section */
        .view-all-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .view-all-link:hover {
          color: #fff;
          gap: 12px;
        }

        .modern-update-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .modern-update-card:hover {
          background: rgba(255,255,255,0.04);
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.1);
        }

        .update-img-container {
          width: 100%;
          height: 220px;
          position: relative;
          overflow: hidden;
        }
        .update-img {
          width: 100%; height: 100%;
          object-fit: contain;
          background-color: #080c17; /* match section background */
          transition: transform 0.5s ease;
        }
        .modern-update-card:hover .update-img {
          transform: scale(1.05);
        }

        .update-date-badge {
          position: absolute;
          top: 20px; right: 20px;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          padding: 8px 15px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          display: flex; flex-direction: column;
        }
        .update-date-badge .day {
          font-size: 1.4rem; font-weight: 900; color: #00D4FF; line-height: 1;
        }
        .update-date-badge .month {
          font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #fff;
        }

        .update-content-box {
          padding: 30px;
          display: flex; flex-direction: column; flex-grow: 1;
        }
        .update-title {
          font-size: 1.3rem; font-weight: 800; margin-bottom: 15px; line-height: 1.4;
        }
        .update-desc {
          color: rgba(255,255,255,0.6); font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .read-more-btn {
          margin-top: auto;
          background: none; border: none; padding: 0;
          color: #FFB800; font-weight: 700; font-size: 0.95rem;
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
          transition: gap 0.3s ease;
        }
        .modern-update-card:hover .read-more-btn { gap: 15px; }

        /* Final CTA Background Video CSS */
        .cta-video-section {
          position: relative;
          width: 100%;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #000;
        }
        .cta-video-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translate(-50%, -50%);
          z-index: 0;
          opacity: 0.5;
        }
        .cta-video-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(5,8,16,0.8), rgba(5,8,16,0.4), rgba(5,8,16,0.8));
          z-index: 1;
        }
        .cta-video-content {
          position: relative;
          z-index: 2;
          text-align: center;
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

        /* Commitment Section Styles */
        .card-commitment {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 35px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .commitment-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }
        .commitment-main-icon {
          font-size: 2.2rem;
          color: #FFB800;
        }
        .commitment-header h3 {
          margin: 0;
          font-weight: 800;
          font-size: 1.4rem;
        }
        .commitment-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .commitment-tile {
          background: rgba(255,255,255,0.02);
          padding: 15px;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.8);
        }
        .commitment-tile:hover {
          background: rgba(255,255,255,0.05);
          transform: translateY(-3px);
          border-color: rgba(0,212,255,0.2);
        }
        .tile-icon-small {
          font-size: 1.2rem;
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
      `}</style>

      {/* ======================= VIDEO POPUP MODAL ======================= */}
      {showVideoModal && (
        <div
          onClick={() => setShowVideoModal(false)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999,
            display: "flex", justifyContent: "center", alignItems: "center",
            backdropFilter: "blur(5px)",
            cursor: "pointer"
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative", width: "auto", height: "auto",
              maxWidth: "90vw", maxHeight: "90vh",
              background: "transparent", padding: "0", borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              display: "flex", justifyContent: "center", alignItems: "center",
              cursor: "default"
            }}>
            <button
              onClick={() => setShowVideoModal(false)}
              style={{
                position: "absolute", top: "-15px", right: "-15px",
                width: "40px", height: "40px", borderRadius: "50%",
                background: "#ff3b30", color: "#fff", border: "none",
                fontSize: "20px", fontWeight: "bold", cursor: "pointer",
                boxShadow: "0 4px 10px rgba(255, 59, 48, 0.4)", zIndex: 10,
                display: "flex", justifyContent: "center", alignItems: "center"
              }}
            >
              &times;
            </button>
            <video
              controls
              autoPlay
              playsInline
              style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px", display: "block", objectFit: "contain" }}
            >
              <source src="/assets/addvideo.mp4#t=12" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;