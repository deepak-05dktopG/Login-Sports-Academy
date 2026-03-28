import { useState } from 'react'
import { Container, Row, Col, Form, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaRegClock, FaPhone } from 'react-icons/fa'
import emailjs from "@emailjs/browser";
import Swal from 'sweetalert2';
import { formatDateTime } from "../utils/dateTime";
import Navbar from '../components/Navbar'
import WaveSeparator from '../components/WaveSeparator'
import { BRAND } from '../content/brand'

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
          "service_hvi4aa5",
          "template_e19fi3a",
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
        await emailjs.send("service_hvi4aa5", "template_e19fi3a", {
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

  return (
    <div>
      <Navbar />

      <section className="hero-pool" style={{ paddingTop: 92 }}>
        <Container className="section-pad">
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div data-reveal className="reveal">
                <div style={{ fontWeight: 800, opacity: 0.9 }}>Contact</div>
                <h1 className="mt-2" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)', lineHeight: 1.04 }}>
                  Send a message. We’ll guide the next step.
                </h1>
                <p className="mt-3" style={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 640 }}>
                  Share the swimmer’s age, comfort level, and your goal (confidence, technique, fitness, or competition).
                  We’ll recommend the best starting track.
                </p>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <a href={`mailto:${BRAND.email}`} className="btn btn-foam">
                    Email Us
                  </a>
                  <Link to="/programs" className="btn btn-ocean">
                    View Programs
                  </Link>
                </div>

                <div className="mt-4" style={{ padding: 20, borderRadius: 18, background: 'rgba(0,119,182,0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 32px rgba(0,119,182,0.12)' }}>
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="bg-white bg-opacity-10"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <FaEnvelope />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900 }}>Email</div>
                      <div style={{ opacity: 0.9 }}>{BRAND.email}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3 mt-3">
                    <div
                      className="bg-white bg-opacity-10"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <FaPhone />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900 }}>Phone</div>
                      <div style={{ opacity: 0.9 }}>
                        {[BRAND.phonePrimary, BRAND.phoneSecondary, BRAND.phoneTertiary].filter(Boolean).map((phone, i) => (
                          <div key={i}><a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{phone}</a></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3 mt-3">
                    <div
                      className="bg-white bg-opacity-10"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <FaRegClock />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900 }}>Response time</div>
                      <div style={{ opacity: 0.9 }}>Typically within 24 hours.</div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div data-reveal className="reveal" style={{ padding: 24, borderRadius: 20, background: 'rgba(0,180,216,0.12)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(0,180,216,0.3)', boxShadow: '0 8px 32px rgba(0,180,216,0.15)', color: '#fff' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Send a message</h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 14 }}>
                  This goes directly to our inbox and is saved for follow-up.
                </p>

                {status?.message ? (
                  <Alert variant={status.type} className="mb-3">
                    {status.message}
                  </Alert>
                ) : null}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 800, color: '#fff' }}>Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 800, color: '#fff' }}>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 800, color: '#fff' }}>Phone / WhatsApp</Form.Label>
                        <Form.Control
                          type="tel"
                          inputMode="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your number"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 800, color: '#fff' }}>Topic</Form.Label>
                        <Form.Control value="Swimming training" disabled />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label style={{ fontWeight: 800, color: '#fff' }}>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us age, current level, and your goal."
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <button type="submit" className="btn btn-ocean w-100" disabled={loading}>
                        {loading ? 'Sending…' : 'Send Message'}
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
        <WaveSeparator fill="var(--foam-50)" />
      </section>

      <section style={{ background: 'rgba(52, 143, 203, 0.65)' }}>
        <Container className="section-pad">
          <Row className="g-4">
            <Col lg={6}>
              <div data-reveal className="reveal" style={{ padding: 22, borderRadius: 18, background: 'rgba(2,62,138,0.18)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(2,62,138,0.25)', boxShadow: '0 8px 32px rgba(2,62,138,0.12)', color: '#fff' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Before you message</h3>
                <ul className="mb-0" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.9, paddingLeft: 18 }}>
                  <li>Share age + current comfort level in water.</li>
                  <li>Tell us your goal: confidence, technique, fitness, or competition.</li>
                  <li>Mention any timing preference (morning/evening).</li>
                </ul>
              </div>
            </Col>
            <Col lg={6}>
              <div data-reveal className="reveal" style={{ padding: 22, borderRadius: 18, background: 'rgba(144,224,239,0.18)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(144,224,239,0.35)', boxShadow: '0 8px 32px rgba(144,224,239,0.12)', color: '#fff' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Email</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>
                  Prefer email? Write to us anytime.
                </p>
                <a href={`mailto:${BRAND.email}`} className="btn btn-foam">
                  {BRAND.email}
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}

export default Contact
