/**
 * What it is: Website page (Shop screen).
 * Non-tech note: This is the product listing page.
 */

import { NavLink } from 'react-router-dom'
import Slider from 'react-slick'

import Navbar from '../components/Navbar'
import { BRAND } from '../content/brand'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Swimming accessories shop page — displays product categories (caps, fins, boards, etc.)
const Shop = () => {
  // Organized products by type - dynamically loaded from folder structure
  const productCategories = {
    uvShieldAdult: {
      title: 'UV Shield Goggles - Adult',
      description: 'Advanced UV protection swimming goggles for adults',
      icon: '🥽',
      images: [
        '/assets/accesosaries/uv shield for adult/goggles1.jpg',
        '/assets/accesosaries/uv shield for adult/goggles2.jpg',
        '/assets/accesosaries/uv shield for adult/goggles3.jpg',
      ],
    },
    uvShieldKids: {
      title: 'UV Shield Goggles - Kids',
      description: 'UV protection swimming goggles specially designed for children',
      icon: '🧒',
      images: [
        '/assets/accesosaries/uv shield for kids/goggles1.jpg',
        '/assets/accesosaries/uv shield for kids/goggles2.jpg',
        '/assets/accesosaries/uv shield for kids/goggles3.jpg',
        '/assets/accesosaries/uv shield for kids/goggles4.jpg',
        '/assets/accesosaries/uv shield for kids/goggles5.jpg',
        '/assets/accesosaries/uv shield for kids/WhatsApp Image 2025-11-26 at 14.51.27_1265c5f2.jpg',
        '/assets/accesosaries/uv shield for kids/WhatsApp Image 2025-11-26 at 14.51.27_6da8a74f.jpg',
        '/assets/accesosaries/uv shield for kids/WhatsApp Image 2025-11-26 at 14.51.27_7b26a4b4.jpg',
      ],
    },
    airProtectionCap: {
      title: 'Air Protection Swimming Caps',
      description: 'Breathable air protection caps for comfortable swimming',
      icon: '🧢',
      images: [
        '/assets/accesosaries/air protection cap/WhatsApp Image 2025-11-26 at 14.53.19_ec5c9a83.jpg',
        '/assets/accesosaries/air protection cap/WhatsApp Image 2025-11-26 at 14.53.20_555befde.jpg',
        '/assets/accesosaries/air protection cap/WhatsApp Image 2025-11-26 at 14.53.20_8d9c0fd0.jpg',
      ],
    },
    armPad: {
      title: 'Arm Floats & Pads',
      description: 'Safety arm floats and pads for beginners and kids',
      icon: '🏊‍♂️',
      images: [
        '/assets/accesosaries/arm pad/WhatsApp Image 2025-11-26 at 14.52.22_0166343b.jpg',
        '/assets/accesosaries/arm pad/WhatsApp Image 2025-11-26 at 14.52.23_61845fce.jpg',
        '/assets/accesosaries/arm pad/WhatsApp Image 2025-11-26 at 14.52.23_761d01f8.jpg',
      ],
    },
    bubbleCap: {
      title: 'Bubble Caps - Kids & Adults',
      description: 'Comfortable bubble caps suitable for all ages',
      icon: '🎈',
      images: [
        '/assets/accesosaries/bubble cap for kids and adults/WhatsApp Image 2025-11-26 at 14.54.23_7fc43a39.jpg',
        '/assets/accesosaries/bubble cap for kids and adults/WhatsApp Image 2025-11-26 at 14.54.24_26163cc7.jpg',
        '/assets/accesosaries/bubble cap for kids and adults/WhatsApp Image 2025-11-26 at 14.54.24_2ac9dfbe.jpg',
        '/assets/accesosaries/bubble cap for kids and adults/WhatsApp Image 2025-11-26 at 14.54.24_8cb21e7d.jpg',
      ],
    },
    capsKids: {
      title: 'Swimming Caps - Kids',
      description: 'Colorful and comfortable swimming caps for children',
      icon: '👶',
      images: [
        '/assets/accesosaries/caps for kids/WhatsApp Image 2025-11-26 at 14.51.51_51dc6a94.jpg',
        '/assets/accesosaries/caps for kids/WhatsApp Image 2025-11-26 at 14.51.52_0b30df10.jpg',
        '/assets/accesosaries/caps for kids/WhatsApp Image 2025-11-26 at 14.51.52_1682b1c3.jpg',
        '/assets/accesosaries/caps for kids/WhatsApp Image 2025-11-26 at 14.51.52_e6443b3b.jpg',
      ],
    },
    capsKidsAdult: {
      title: 'Swimming Caps - Kids & Adults',
      description: 'Versatile swimming caps for all age groups',
      icon: '👨‍👩‍👧‍👦',
      images: [
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.50_4287b254.jpg',
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.50_9c6f32b2.jpg',
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.51_3b75f113.jpg',
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.51_6abdf24c.jpg',
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.51_9d7f0947.jpg',
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.51_e9feafaf.jpg',
        '/assets/accesosaries/caps for kids and adult/WhatsApp Image 2025-11-26 at 14.53.52_939a373d.jpg',
      ],
    },
    fins: {
      title: 'Swimming Fins - Kids & Adults',
      description: 'High-quality swimming fins for training and fun',
      icon: '🦈',
      images: [
        '/assets/accesosaries/fins for kids and adults/WhatsApp Image 2025-11-26 at 14.52.47_2840e466.jpg',
        '/assets/accesosaries/fins for kids and adults/WhatsApp Image 2025-11-26 at 14.52.47_aeeccdbb.jpg',
        '/assets/accesosaries/fins for kids and adults/WhatsApp Image 2025-11-26 at 14.52.48_26341c6f.jpg',
        '/assets/accesosaries/fins for kids and adults/WhatsApp Image 2025-11-26 at 14.52.48_6e174a8c.jpg',
        '/assets/accesosaries/fins for kids and adults/WhatsApp Image 2025-11-26 at 14.52.48_9e74271f.jpg',
      ],
    },
    pullBuoys: {
      title: 'Pull Buoys',
      description: 'Essential training aids for upper body strength development',
      icon: '🏊',
      images: [
        '/assets/accesosaries/pullbuoys/pullbuoy1.jpg',
        '/assets/accesosaries/pullbuoys/pullbuoy2.jpg',
        '/assets/accesosaries/pullbuoys/pullbuoy3.jpg',
        '/assets/accesosaries/pullbuoys/pullbuoy4.jpg',
      ],
    },
    kickboards: {
      title: 'Swimming Kickboards',
      description: 'Durable kickboards for effective leg strength training',
      icon: '🏄',
      images: [
        '/assets/accesosaries/swimmingboard/swimmingboard1.jpg',
        '/assets/accesosaries/swimmingboard/swimmingboard2.jpg',
        '/assets/accesosaries/swimmingboard/swimmingboard3.jpg',
        '/assets/accesosaries/swimmingboard/swimmingboard4.jpg',
      ],
    },
  }

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    arrows: true,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: false,
          variableWidth: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar />

      <section className="hero-pool">
        <div className="container py-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-3">Swim Gear Shop</h1>
              <p className="lead mb-4" style={{ opacity: 0.92, maxWidth: 860 }}>
                Browse swim accessories used in training at {BRAND.shortName}. For bulk enquiries and availability,
                message us anytime.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <NavLink to="/contact" className="btn btn-foam">
                  Contact for Orders
                </NavLink>
                <a href="#categories" className="btn btn-ocean">
                  View Categories
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section-pad">
        <div className="container">
          {Object.entries(productCategories).map(([key, category]) => (
            <div key={key} className="mb-5">
              <div className="surface surface--glass p-4 p-md-5 text-center mb-4">
                <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>{category.icon}</div>
                <h2 className="h3 fw-bold mb-2" style={{ color: 'var(--ocean-900)' }}>
                  {category.title}
                </h2>
                <p className="mb-0" style={{ color: 'var(--ink-700)' }}>
                  {category.description}
                </p>
              </div>

              <Slider {...carouselSettings}>
                {category.images.map((imagePath, index) => (
                  <div key={`${key}-${imagePath}-${index}`}>
                    <div className="surface surface--glass overflow-hidden" style={{ margin: 10 }}>
                      <div style={{ background: 'rgba(6, 24, 38, 0.05)' }}>
                        <img
                          src={imagePath}
                          alt={`${category.title} - ${index + 1}`}
                          style={{ width: '100%', height: 320, objectFit: 'contain', display: 'block' }}
                        />
                      </div>
                      <div className="p-3 text-center">
                        <div className="fw-bold" style={{ color: 'var(--ocean-900)' }}>
                          {category.title}
                        </div>
                        <div className="small" style={{ color: 'var(--ink-700)' }}>
                          {index + 1} of {category.images.length}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="surface surface--glass p-4 p-md-5 text-center">
            <h2 className="h3 mb-3" style={{ color: 'var(--ocean-900)' }}>
              Bulk orders & institutional supply
            </h2>
            <p className="mb-4" style={{ maxWidth: 860, margin: '0 auto', color: 'var(--ink-700)' }}>
              Need kits for schools, academies, or resorts? Share your requirements and we’ll respond with pricing and
              options.
            </p>
            <NavLink to="/contact" className="btn btn-ocean">
              Contact Us
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Shop
