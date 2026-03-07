/**
 * What it is: Website page (Team screen).
 * Non-tech note: This file shows team members and related information.
 */

import { NavLink } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

import Navbar from '../components/Navbar'
import { BRAND } from '../content/brand'

const teamData = {
  leadership: {
    title: 'Leadership',
    members: [
      {
        name: 'Mr. V. Vijeesh',
        position: 'CEO & Chairman',
        image: '/assets/vijeesh.jpg',
        eligibilities: [
          'Represented India - FINA Masters World Championships(2015 & 2025)',
          'NIS,ASCA Level 3 Certified',
        ],
      },
      {
        name: 'Mr. Manikandan',
        position: 'Director',
        image: '/assets/manikandan.jpg',
        eligibilities: ['National-Level Swimmer', 'NIS,ASCA Level 3 Certified'],
      },
      {
        name: 'Mr. Pramod',
        position: 'Director',
        image: '/assets/pramod.jpg',
        eligibilities: ['National Gold Medalist', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. Sunil',
        position: 'Director',
        image: '/assets/sunil.jpg',
        eligibilities: ['State_Level Swimmer', '15 years coaching & Management Experience'],
      },
    ],
  },
  coaching: {
    title: 'Coaching Team',
    members: [
      {
        name: 'Ms. Vijitha',
        position: 'Head Coach',
        image: '/assets/vijitha.jpg',
        eligibilities: ['National Swimmer', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. Lalith Kumar',
        position: 'Head Coach',
        image: '/assets/lalithkumar.jpg',
        eligibilities: ['National Swimmer', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. Sathish',
        position: 'Head Coach',
        image: '/assets/sathish.jpg',
        eligibilities: ['National Swimmer', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. S. Ajayan',
        position: 'Head Coach',
        image: '/assets/ajayan.jpg',
        eligibilities: ['National Swimmer', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. Vishnu Das S',
        position: 'Coach',
        image: '/assets/vishnudas.jpg',
        eligibilities: ['National Swimmer', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. Lokeshwaran',
        position: 'Coach',
        image: '/assets/ajeesh.jpg',
        eligibilities: ['National Swimmer', 'ASCA Certified'],
      },
      {
        name: 'Mr. Ajeesh',
        position: 'Coach',
        image: '/assets/lokeshwaran.jpg',
        eligibilities: ['National Swimmer', 'ASCA Certified'],
      },
      {
        name: 'Mr. Kururaj',
        position: 'Coach',
        image: '/assets/gururaj.jpg',
        eligibilities: ['National Swimmer', 'NIS,ASCA Certified'],
      },
      {
        name: 'Mr. Naveen Kumar',
        position: 'Coach',
        image: '/assets/naveenkumar.jpg',
        eligibilities: ['State Swimmer', 'ASCA Certified'],
      },
      {
        name: 'Ms. Reena Augustine',
        position: 'Coach',
        image: '/assets/reenaagustine.jpg',
        eligibilities: ['State Swimmer', 'ASCA Certified'],
      },
      {
        name: 'Mr. Nishant',
        position: 'Assistant Coach',
        image: '/assets/nishant.jpg',
        eligibilities: ['State Swimmer', 'ASCA Certified'],
      },
      {
        name: 'Mr. Sreerag',
        position: 'Assistant Coach',
        image: '/assets/sreerag.jpg',
        eligibilities: ['State Swimmer', 'ASCA Certified'],
      },
      {
        name: 'Mr. Aneesh',
        position: 'Assistant Coach',
        image: '/assets/aneesh.jpg',
        eligibilities: ['State Swimmer', 'ASCA Certified'],
      },
    ],
  },
  safety: {
    title: 'Safety & Support',
    members: [
      {
        name: 'Mr. Udaya Kumar',
        position: 'Lifeguard',
        image: '/assets/udayakumar.jpg',
        eligibilities: ['Lifeguard Course - Level 2 Certified'],
      },
      {
        name: 'Mr. Hariharan',
        position: 'Lifeguard',
        image: '/assets/hariharan.jpg',
        eligibilities: ['Lifeguard Course - Level 2 Certified'],
      },
    ],
  },
  administration: {
    title: 'Administration & Promotion',
    members: [
      {
        name: 'Ms. Elakiya',
        position: 'Reception & Promotion',
        image: '/assets/ilakiya.jpg',
        eligibilities: ['M.Sc. in Computer Science'],
      },
      {
        name: 'Ms. Priya',
        position: 'Reception & Social Media Promotion',
        image: '/assets/priya.jpg',
        eligibilities: ['M.Sc. in Computer Science'],
      },
    ],
  },
}

function TeamMemberCard({ member }) {
  return (
    <div className="surface surface--glass h-100 overflow-hidden">
      <div style={{ aspectRatio: '4/5', background: 'rgba(6, 24, 38, 0.06)' }}>
        <img
          src={member.image}
          alt={member.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div className="p-3">
        <div className="fw-bold" style={{ color: 'var(--ocean-900)' }}>
          {member.name}
        </div>
        <div className="small fw-semibold text-uppercase" style={{ color: 'var(--aqua-600)', letterSpacing: '0.04em' }}>
          {member.position}
        </div>
        <div className="mt-2 d-flex flex-wrap gap-2">
          {(member.eligibilities || []).slice(0, 2).map((eligibility) => (
            <span
              key={eligibility}
              className="badge rounded-pill"
              style={{
                background: 'rgba(11, 179, 200, 0.12)',
                border: '1px solid rgba(11, 179, 200, 0.24)',
                color: 'var(--ocean-900)',
              }}
            >
              {eligibility}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamSection({ title, members, cols = { xs: 12, sm: 6, md: 4, lg: 3 } }) {
  return (
    <section className="section-pad">
      <Container>
        <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
          <h2 className="h3 m-0" style={{ color: 'var(--ocean-900)' }}>
            {title}
          </h2>
          <div
            aria-hidden="true"
            style={{ height: 2, flex: '1 1 240px', background: 'rgba(11, 179, 200, 0.22)' }}
          />
        </div>

        <Row className="g-4">
          {members.map((member) => (
            <Col key={`${title}-${member.name}`} xs={cols.xs} sm={cols.sm} md={cols.md} lg={cols.lg}>
              <TeamMemberCard member={member} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

const Team = () => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar />

      <section className="hero-pool">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-3">Meet Our Team</h1>
              <p className="lead mb-4" style={{ opacity: 0.92, maxWidth: 760 }}>
                The people behind {BRAND.shortName}: certified coaches, leadership, and support staff focused on
                safe training and confident swimming.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <NavLink to="/contact" className="btn btn-foam">
                  Connect With Us
                </NavLink>
                <NavLink to="/programs" className="btn btn-ocean">
                  Explore Programs
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection title={teamData.leadership.title} members={teamData.leadership.members} cols={{ xs: 12, sm: 6, md: 4, lg: 3 }} />
      <TeamSection title={teamData.coaching.title} members={teamData.coaching.members} cols={{ xs: 12, sm: 6, md: 4, lg: 3 }} />
      <TeamSection title={teamData.safety.title} members={teamData.safety.members} cols={{ xs: 12, sm: 6, md: 4, lg: 3 }} />
      <TeamSection title={teamData.administration.title} members={teamData.administration.members} cols={{ xs: 12, sm: 6, md: 4, lg: 3 }} />

      <section className="section-pad">
        <Container>
          <div className="surface surface--glass p-4 p-md-5 text-center">
            <h2 className="h3 mb-3" style={{ color: 'var(--ocean-900)' }}>
              Join our community
            </h2>
            <p className="mb-4" style={{ maxWidth: 760, margin: '0 auto', color: 'var(--ink-700)' }}>
              Want to talk to a coach or plan your training path? Send us a message and we’ll guide you.
            </p>
            <NavLink to="/contact" className="btn btn-ocean">
              Contact Us
            </NavLink>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Team

