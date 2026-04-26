import { useEffect } from "react"
import { NavLink } from "react-router-dom"
import Navbar from "../components/Navbar"
import AOS from "aos"
import "aos/dist/aos.css"
import { FaSwimmingPool, FaTableTennis, FaArrowRight, FaUsers } from "react-icons/fa"

const Team = () => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: false, offset: 50 });
    AOS.refresh();
  }, [])

  const swimmingTeam = {
    leadership: [
      { name: "Mr. V. Vijeesh", position: "CEO & Head Coach", image: "/assets/vijeesh.jpg", eligibilities: ["Represented India - FINA", "NIS, ASCA Level 3 Certified"] },
      { name: "Mr. Manikandan", position: "Director", image: "/assets/manikandan.jpg", eligibilities: ["National Swimmer", "NIS, ASCA Level 3"] },
    ],
    coaches: [
      { name: "Mr. V. Vijeesh", position: "Coach", image: "/assets/Team/vijeesh.jpg", eligibilities: ["International Swimmer", "ASCA Level 3"] },
      { name: "Mr. Naveen Kumar", position: "Coach", image: "/assets/Team/naveenKumar.jpeg", eligibilities: ["State Swimmer ASCA Certified"] },
      { name: "Mr. Ajeesh", position: "Coach", image: "/assets/Team/Ajeesh.png", eligibilities: ["State Swimmer ASCA Certified"] },
      { name: "Ms. Bindhu", position: "Coach", image: "/assets/Team/Bindhu.jpeg", eligibilities: ["National Swimmer", "ASCA Level 3"] },
      { name: "Ms. Latha", position: "Coach", image: "/assets/Team/Latha.jpeg", eligibilities: [] },
      { name: "Ms. Karthika S", position: "Coach", image: "/assets/Team/Karthika.jpeg", eligibilities: ["National Swimmer", "ASCA Level 3"] },
    ],

  }

  const badmintonTeam = [
    { name: "Ranjith", position: "Head Coach", eligibilities: ["University Level Player", "Footwork Specialist"] },
    { name: "Kishore", position: "Head Coach", eligibilities: ["National Level Player", "Game Strategy Expert"] },
  ]

  // Premium Styled Card Component
  const BentoMemberCard = ({ member, type }) => {
    const isSwimming = type === "swimming";
    const accent = isSwimming ? "#00D4FF" : "#FFB800";
    const icon = isSwimming ? "🏊" : "🏸";

    return (
      <div className="elite-member-card">
        <div className="elite-card-inner">
          <div className="elite-image-area">
            {member.image ? (
              <img src={member.image} alt={member.name} className="elite-image" />
            ) : (
              <div className="elite-image-placeholder">{icon}</div>
            )}
            <div className="elite-card-overlay"></div>
          </div>
          <div className="elite-info-area">
            <h4 className="elite-name">{member.name}</h4>
            <p className="elite-role" style={{ color: accent }}>{member.position}</p>
            <div className="elite-tags">
              {member.eligibilities.map((elig, idx) => (
                <span key={idx} className="elite-tag">
                  {elig}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#050810", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      {/* ======================= IMMERSIVE HERO ======================= */}
      <section style={{
        position: "relative",
        minHeight: "70vh",
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
          background: "linear-gradient(to bottom, rgba(5,8,16,0.5) 0%, rgba(5,8,16,0.9) 60%, #050810 100%)",
          zIndex: 1
        }} />

        <div style={{ zIndex: 2, maxWidth: "900px" }} data-aos="zoom-out" data-aos-duration="1200">
          <div className="mb-4 d-inline-flex align-items-center gap-3 px-4 py-2" style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <FaUsers style={{ color: "#00D4FF" }} />
            <span style={{ fontSize: "0.9rem", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Elite Professionals</span>
          </div>
          
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "20px",
            textShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            MEET OUR <br />
            <span style={{ background: "linear-gradient(135deg, #00D4FF, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EXPERT TEAM</span>
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
          }}>
            Certified professionals with FINA, ASCA & National-level credentials dedicated to your success in Swimming & Badminton.
          </p>
        </div>
      </section>

      {/* ======================= SWIMMING TEAM ======================= */}
      <section style={{ padding: "0 0 100px", position: "relative", zIndex: 5, marginTop: "-50px" }}>
        <div className="container">
          <div className="bento-section-card border-swimming" data-aos="fade-up">
            
            <div className="d-flex align-items-center gap-3 mb-5">
              <div className="icon-badge bg-swimming-light"><FaSwimmingPool className="text-swimming" /></div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
                Swimming <span style={{ color: "#00D4FF" }}>Team</span>
              </h2>
            </div>

            {/* Leadership */}
            <div className="mb-5">
              <h4 className="section-title-modern">Leadership</h4>
              <div className="leadership-grid">
                {swimmingTeam.leadership.map((m, i) => (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                    <BentoMemberCard member={m} type="swimming" />
                  </div>
                ))}
              </div>
            </div>

            {/* Coaches */}
            <div className="mb-5">
              <h4 className="section-title-modern">Our Team</h4>
              <div className="coaches-grid">
                {swimmingTeam.coaches.map((m, i) => (
                  <div key={i} data-aos="fade-up" data-aos-delay={i * 50}>
                    <BentoMemberCard member={m} type="swimming" />
                  </div>
                ))}
              </div>
            </div>

  

          </div>
        </div>
      </section>

      {/* ======================= BADMINTON TEAM ======================= */}
      <section style={{ padding: "0 0 100px", position: "relative" }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(255,184,0,0.05), transparent 60%)", filter: "blur(60px)", zIndex: 0 }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="bento-section-card border-badminton" data-aos="fade-up">
            
            <div className="d-flex align-items-center gap-3 mb-5">
              <div className="icon-badge bg-badminton-light"><FaTableTennis className="text-badminton" /></div>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
                Badminton <span style={{ color: "#FFB800" }}>Coaches</span>
              </h2>
            </div>

            <div className="bento-grid-team bento-grid-half">
              {badmintonTeam.map((m, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                  <BentoMemberCard member={m} type="badminton" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ======================= CTA ======================= */}
      <section style={{ padding: "100px 0", backgroundColor: "#0a0e1a", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" data-aos="zoom-in">
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "2.5rem", fontWeight: 800, marginBottom: "20px" }}>
            Ready to <span style={{ color: "#00D4FF" }}>Train?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 40px" }}>
            Join our world-class coaching team and redefine your potential today.
          </p>
          <NavLink to="/membership" className="bento-btn primary-btn">
            Become a Member <FaArrowRight />
          </NavLink>
        </div>
      </section>

      {/* Styles for Elite Team UI */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .section-title-modern {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-bottom: 40px;
          text-align: center;
        }

        .leadership-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .coaches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .elite-member-card {
          position: relative;
          background: rgba(255,255,255,0.02);
          border-radius: 30px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255,255,255,0.08);
          height: 100%;
        }

        .elite-member-card:hover {
          transform: translateY(-15px);
          background: rgba(255,255,255,0.05);
          border-color: rgba(0,212,255,0.3);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }

        .elite-image-area {
          position: relative;
          width: 100%;
          height: 350px;
          overflow: hidden;
        }

        .elite-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .elite-member-card:hover .elite-image {
          transform: scale(1.1);
        }

        .elite-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          background: #0a0e1a;
          opacity: 0.3;
        }

        .elite-card-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent 40%, rgba(5,8,16,0.9) 100%);
        }

        .elite-info-area {
          padding: 25px;
          position: relative;
          z-index: 2;
          margin-top: -60px;
        }

        .elite-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 5px;
        }

        .elite-role {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1.5px;
          margin-bottom: 20px;
        }

        .elite-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .elite-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 50px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          transition: all 0.3s ease;
        }

        .elite-member-card:hover .elite-tag {
          border-color: rgba(0,212,255,0.2);
          color: #fff;
          background: rgba(0,212,255,0.1);
        }

        .bento-section-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 80px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          border-top: 5px solid transparent;
        }

        .border-swimming { border-top-color: #00D4FF; }
        .border-badminton { border-top-color: #FFB800; }

        .icon-badge {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        
        .bg-swimming-light { background: rgba(0,212,255,0.15); }
        .bg-badminton-light { background: rgba(255,184,0,0.15); }
        .text-badminton { color: #FFB800; }

        .bento-grid-team {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .bento-grid-coaches {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .bento-grid-half {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        /* Member Card */
        .bento-member-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .bento-member-card.bg-swimming:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(0,212,255,0.3);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,212,255,0.15);
        }

        .bento-member-card.bg-badminton:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,184,0,0.3);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(255,184,0,0.15);
        }

        .member-image-wrapper {
          aspect-ratio: 1/1;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .member-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .bento-member-card:hover .member-image {
          transform: scale(1.05);
        }

        .member-image-placeholder {
          font-size: 4rem;
          opacity: 0.5;
        }

        .member-details {
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .member-name {
          font-weight: 800;
          font-size: 1rem;
          margin-bottom: 5px;
        }

        .member-position {
          color: rgba(255,255,255,0.6);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }

        .member-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: center;
          margin-top: auto;
        }

        .member-tag {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 700;
        }

        /* Buttons */
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

        /* Responsive */
        @media (max-width: 768px) {
          .bento-section-card { padding: 30px 20px; border-radius: 30px; }
          .bento-grid-team { grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .bento-grid-coaches, .bento-grid-half { grid-template-columns: repeat(2, 1fr); }
          .member-details { padding: 15px 10px; }
          .member-name { font-size: 0.9rem; }
          .member-position { font-size: 0.7rem; }
          .member-tag { font-size: 0.6rem; padding: 3px 6px; }
        }
      `}</style>
    </div>
  );
};

export default Team;
