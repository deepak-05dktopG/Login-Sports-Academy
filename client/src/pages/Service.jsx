import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSwimmingPool, FaTableTennis, FaTrophy, FaUsers, FaClock, FaCheckCircle, FaArrowRight, FaStar, FaCalendarAlt } from "react-icons/fa";

const Service = () => {
  const [activeSport, setActiveSport] = useState("swimming");

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: false, offset: 50 });
    AOS.refresh();
  }, []);

  const swimmingSchedule = [
    { day: "Sun & Mon", time: "6:00 AM – 6:00 PM", type: "Public Time", badge: "🏊 Open" },
    { day: "Tue – Sat", time: "6:00 – 9:00 AM", type: "Morning Batch", badge: "🎓 Coach" },
    { day: "Tue – Sat", time: "10:00 – 11:00 AM", type: "Ladies Batch", badge: "👩 Ladies" },
    { day: "Tue – Sat", time: "11:00 AM – 3:00 PM", type: "Public Batch", badge: "🏊 Open" },
    { day: "Tue – Sat", time: "4:00 – 6:00 PM", type: "Evening Coaching", badge: "🎓 Coach" },
  ];

  const badmintonSchedule = [
    { day: "Mon – Fri", time: "5:30 PM – 8:00 PM", type: "Coaching Sessions", badge: "🎓 Coach" },
    { day: "Mon – Fri", time: "10:00 AM – 5:00 PM", type: "Court Rental", badge: "🕐 Hourly" },
    { day: "Mon – Fri", time: "5–10 AM & 8–10 PM", type: "Membership Hours", badge: "🏸 Members" },
    { day: "Sat & Sun", time: "10:00 AM – 8:00 PM", type: "Weekend Open Play", badge: "🏸 Open" },
  ];

  const swimmingCoaching = [
    "FINA-level & ASCA certified coaches",
    "Separate Ladies Batch available",
    "School Curriculum Activity Program",
    "Competitive training for national events",
    "Lifeguard certified safety at all times",
  ];

  const badmintonCoaching = [
    "Proper Footwork & Court Movements",
    "Stroke Techniques & Shot Accuracy",
    "Strengthening & Fitness Training",
    "Game Understanding & Match Play",
    "Fun & Skill Development for all levels",
  ];

  const accent = activeSport === "swimming" ? "#00D4FF" : "#FFB800";
  const accentGrad = activeSport === "swimming" ? "linear-gradient(135deg, #00D4FF, #0066FF)" : "linear-gradient(135deg, #FFB800, #FF6B35)";

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
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/assets/home_hero_indian.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "kenBurns 20s infinite alternate ease-in-out",
          zIndex: 0
        }} />
        
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to bottom, rgba(5,8,16,0.6) 0%, rgba(5,8,16,0.9) 80%, #050810 100%)",
          zIndex: 1
        }} />

        <div style={{ zIndex: 2, maxWidth: "900px" }} data-aos="zoom-out" data-aos-duration="1200">
          <div className="mb-4 d-inline-flex align-items-center gap-3 px-4 py-2" style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <FaTrophy style={{ color: "#FFB800" }} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Elite Training Programs</span>
          </div>
          
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "20px",
            textShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            TRAIN LIKE A <br />
            <span style={{ background: "linear-gradient(135deg, #00D4FF, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CHAMPION</span>
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
          }}>
            Professional Swimming & Badminton coaching for beginners, intermediate, and advanced athletes. Age 6 & above.
          </p>
        </div>
      </section>

      {/* ======================= INTERACTIVE SCHEDULE BENTO ======================= */}
      <section style={{ padding: "0 0 80px", position: "relative", zIndex: 5, marginTop: "-80px" }}>
        <div className="container">
          <div className="bento-schedule-card" data-aos="fade-up">
            
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-4">
              <div>
                <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
                  SESSION <span style={{ color: accent }}>SCHEDULES</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", margin: "5px 0 0" }}>Select a sport to view timings</p>
              </div>

              <div className="sport-tabs-bento">
                <button 
                  className={`sport-tab-bento ${activeSport === 'swimming' ? 'active-swimming' : ''}`} 
                  onClick={() => setActiveSport('swimming')}
                >
                  <FaSwimmingPool /> Swimming
                </button>
                <button 
                  className={`sport-tab-bento ${activeSport === 'badminton' ? 'active-badminton' : ''}`} 
                  onClick={() => setActiveSport('badminton')}
                >
                  <FaTableTennis /> Badminton
                </button>
              </div>
            </div>

            <div className="schedule-grid">
              {(activeSport === 'swimming' ? swimmingSchedule : badmintonSchedule).map((row, i) => (
                <div key={i} className="schedule-item">
                  <div className="schedule-day">{row.day}</div>
                  <div className="schedule-time" style={{ color: accent }}>{row.time}</div>
                  <div className="schedule-type">{row.type}</div>
                  <div className="schedule-badge" style={{ color: accent, backgroundColor: `${accent}15`, borderColor: `${accent}30` }}>
                    {row.badge}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ======================= COACHING PROGRAMS ======================= */}
      <section style={{ padding: "60px 0", backgroundColor: "#0a0e1a", position: "relative" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,212,255,0.05), transparent 60%)", filter: "blur(60px)", zIndex: 0 }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800 }}>
              OUR <span style={{ color: "#FFB800" }}>PROGRAMS</span>
            </h2>
          </div>
          
          <div className="row g-5">
            {/* Swimming Program */}
            <div className="col-lg-6" data-aos="fade-right">
              <div className="bento-program-card border-swimming">
                <div className="program-header">
                  <div className="program-icon icon-swimming"><FaSwimmingPool /></div>
                  <div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, margin: 0 }}>Swimming</h3>
                    <p style={{ color: "#00D4FF", fontWeight: 600, fontSize: "0.85rem", margin: 0, textTransform: "uppercase" }}>FINA & ASCA Certified</p>
                  </div>
                </div>
                
                <ul className="program-list">
                  {swimmingCoaching.map((item, i) => (
                    <li key={i}>
                      <FaCheckCircle className="check-swimming" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="program-footer bg-swimming-light">
                  <span className="fw-bold text-swimming">🏅 Achievement</span>
                  <span className="opacity-75 d-block mt-1">Produced multiple National Medalists & State Champions.</span>
                </div>
              </div>
            </div>

            {/* Badminton Program */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="bento-program-card border-badminton">
                <div className="program-header">
                  <div className="program-icon icon-badminton"><FaTableTennis /></div>
                  <div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, margin: 0 }}>Badminton</h3>
                    <p style={{ color: "#FFB800", fontWeight: 600, fontSize: "0.85rem", margin: 0, textTransform: "uppercase" }}>National Level Coaches</p>
                  </div>
                </div>
                
                <ul className="program-list">
                  {badmintonCoaching.map((item, i) => (
                    <li key={i}>
                      <FaCheckCircle className="check-badminton" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="program-footer bg-badminton-light">
                  <span className="fw-bold text-badminton">📋 Eligibility</span>
                  <span className="opacity-75 d-block mt-1">Beginners to Advanced • Non-Marking Shoes Mandatory.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= TARIFF BENTO ======================= */}
      <section style={{ padding: "100px 0", position: "relative" }}>
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800 }}>
              MEMBERSHIP <span style={{ color: "#00D4FF" }}>TARIFF</span>
            </h2>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Swimming Tariff */}
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div className="bento-tariff-card text-center h-100">
                <div style={{ fontSize: "3rem", color: "#00D4FF", marginBottom: "20px" }}><FaSwimmingPool /></div>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, marginBottom: "15px" }}>Swimming Plans</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "30px", lineHeight: 1.6 }}>
                  Our swimming plans are highly customizable based on batches, coaching level, and duration.
                </p>
                <NavLink to="/membership" className="bento-btn btn-swimming mt-auto d-inline-flex">
                  View Full Swimming Tariff <FaArrowRight />
                </NavLink>
              </div>
            </div>

            {/* Badminton Tariff */}
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="bento-tariff-card h-100">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <FaTableTennis style={{ fontSize: "2rem", color: "#FFB800" }} />
                  <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, margin: 0 }}>Badminton Tariff</h3>
                </div>
                
                <div className="tariff-list">
                  {[
                    { plan: "Coaching Fees", price: "₹2,000 / mo" },
                    { plan: "Monthly Membership", price: "₹1,200 / mo" },
                    { plan: "6 Months Membership", price: "₹6,600" },
                    { plan: "1 Year Membership", price: "₹12,000" },
                  ].map((t, i) => (
                    <div key={i} className="tariff-item">
                      <span className="tariff-name">{t.plan}</span>
                      <span className="tariff-price">{t.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= TRAINING INSIGHTS ======================= */}
      <section style={{ padding: "100px 0", backgroundColor: "#0a0e1a", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-4" data-aos="fade-right">
              <div style={{ position: "relative", borderRadius: "30px", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "380px" }}>
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  style={{ width: "100%", display: "block" }}
                >
                  <source src="/assets/trainingvideo.mp4" type="video/mp4" />
                </video>
                <div style={{ position: "absolute", bottom: "20px", left: "20px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", padding: "8px 16px", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 800, color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
                  LIVE COACHING
                </div>
              </div>
            </div>
            
            <div className="col-lg-8" data-aos="fade-left">
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800, marginBottom: "20px" }}>
                SEE THE <span style={{ color: "#00D4FF" }}>ACTION</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "30px" }}>
                Our training methodology focuses on technical perfection and mental resilience. Watch how our athletes train under professional guidance to master their sport and achieve excellence.
              </p>
              
              <div className="d-flex flex-column gap-3">
                <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <FaClock style={{ color: "#FFB800", fontSize: "1.5rem" }} />
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 700 }}>Structured Sessions</h5>
                    <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.6 }}>Every minute is planned for maximum skill development and growth.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <FaTrophy style={{ color: "#00D4FF", fontSize: "1.5rem" }} />
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 700 }}>Expert Oversight</h5>
                    <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.6 }}>Real-time technical feedback from state and national level coaches.</p>
                  </div>
                </div>
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

        .bento-schedule-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 50px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .sport-tabs-bento {
          display: flex;
          background: rgba(0,0,0,0.3);
          border-radius: 50px;
          padding: 6px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .sport-tab-bento {
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.6);
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .sport-tab-bento:hover {
          color: white;
        }

        .active-swimming {
          background: linear-gradient(135deg, #00D4FF, #0066FF);
          color: white;
          box-shadow: 0 5px 15px rgba(0,212,255,0.3);
        }

        .active-badminton {
          background: linear-gradient(135deg, #FFB800, #FF6B35);
          color: white;
          box-shadow: 0 5px 15px rgba(255,184,0,0.3);
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .schedule-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .schedule-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-5px);
        }

        .schedule-day {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.5);
          font-weight: 700;
          margin-bottom: 5px;
        }

        .schedule-time {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .schedule-type {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 20px;
        }

        .schedule-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid;
        }

        /* Program Cards */
        .bento-program-card {
          background: rgba(255,255,255,0.02);
          border-radius: 30px;
          padding: 40px;
          border-top: 4px solid transparent;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .border-swimming { border-top-color: #00D4FF; }
        .border-swimming:hover { box-shadow: 0 15px 40px rgba(0,212,255,0.15); transform: translateY(-5px); background: rgba(255,255,255,0.04); }
        
        .border-badminton { border-top-color: #FFB800; }
        .border-badminton:hover { box-shadow: 0 15px 40px rgba(255,184,0,0.15); transform: translateY(-5px); background: rgba(255,255,255,0.04); }

        .program-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .program-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        
        .icon-swimming { background: rgba(0,212,255,0.1); color: #00D4FF; }
        .icon-badminton { background: rgba(255,184,0,0.1); color: #FFB800; }

        .program-list {
          list-style: none;
          padding: 0;
          margin: 0 0 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          flex-grow: 1;
        }

        .program-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
        }

        .check-swimming { color: #00D4FF; margin-top: 4px; flex-shrink: 0; }
        .check-badminton { color: #FFB800; margin-top: 4px; flex-shrink: 0; }

        .program-footer {
          padding: 20px;
          border-radius: 15px;
          font-size: 0.85rem;
        }

        .bg-swimming-light { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.1); }
        .text-swimming { color: #00D4FF; }
        
        .bg-badminton-light { background: rgba(255,184,0,0.05); border: 1px solid rgba(255,184,0,0.1); }
        .text-badminton { color: #FFB800; }

        /* Tariff Cards */
        .bento-tariff-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .bento-tariff-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .tariff-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          flex-grow: 1;
        }

        .tariff-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: rgba(255,184,0,0.05);
          border: 1px solid rgba(255,184,0,0.1);
          border-radius: 15px;
        }

        .tariff-name {
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .tariff-price {
          color: #FFD54F;
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .bento-btn {
          padding: 14px 30px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-swimming {
          background: linear-gradient(135deg, #00D4FF, #0066FF);
          color: white;
          box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
        }

        .btn-swimming:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 212, 255, 0.4);
          color: white;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .bento-schedule-card { padding: 30px 20px; }
          .sport-tabs-bento { width: 100%; display: flex; }
          .sport-tab-bento { flex: 1; justify-content: center; padding: 10px; font-size: 0.85rem; }
          section { padding: 60px 0; }
          .schedule-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Service;