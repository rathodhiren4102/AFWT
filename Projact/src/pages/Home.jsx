import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../services/api';
import { getRolePath } from '../utils/role';

function Home() {
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const dashboardLink = user ? getRolePath(user.role) : '/customer';

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetchServices();
        if (res.success) {
          setServices(res.data || res.services || []);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
  }, []);

  const getServiceImage = (service, index) => {
    if (service.image && service.image.trim() !== '') {
      return service.image;
    }
    const name = (service.name || '').toLowerCase();
    const category = (service.category || '').toLowerCase();

    if (name.includes('beard') || name.includes('shave') || category.includes('beard')) {
      if (name.includes('trim')) return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600';
      if (name.includes('royal')) return 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=600';
      return 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600';
    }

    if (name.includes('facial') || category.includes('facial') || category.includes('skin')) {
      if (name.includes('premium')) return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600';
      return 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600';
    }

    if (name.includes('color') || name.includes('highlight') || category.includes('color')) {
      if (name.includes('highlight')) return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600';
      return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600';
    }

    if (name.includes('haircut') || category.includes('haircut') || name.includes('cut')) {
      if (name.includes('kids')) return 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&q=80&w=600';
      if (name.includes('premium')) return 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=600';
      return 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600';
    }

    if (name.includes('massage') || name.includes('spa') || category.includes('massage') || category.includes('spa')) {
      if (name.includes('body') || name.includes('spa')) return 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600';
      return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600';
    }

    const fallbackImages = [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=600',
    ];

    return fallbackImages[index % fallbackImages.length];
  };

  const galleryItems = [
    { id: 1, title: 'Textured Crop Fade', stylist: 'Vikram Malhotra', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Executive Contour', stylist: 'Amit Sharma', image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'Modern Pompadour', stylist: 'Amit Sharma', image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&q=80&w=400' },
    { id: 4, title: 'Beard Sculpting', stylist: 'Vikram Malhotra', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400' },
  ];

  const testimonials = [
    { id: 1, quote: 'Best styling experience of my life. Gilded Blade is in a league of its own. High attention to detail!', client: 'Deepak K.', role: 'Regular Customer', initials: 'DK' },
    { id: 2, quote: "The team is incredible. Vikram's beard trims and hot towel treatments are simply unmatched.", client: 'Jayesh L.', role: 'Executive Member', initials: 'JL' },
    { id: 3, quote: 'Top tier service! Booked an appointment in 10 seconds and walked out looking like a new man.', client: 'Sneha M.', role: 'Grooming Client', initials: 'SM' },
  ];

  return (
    <div style={{ padding: '0 6% 60px' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="hero" style={{ position: 'relative' }}>
        {/* Decorative bg shapes */}
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />

        {/* Left: text */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Appointments Now Open
          </div>

          <h1>
            Premium<br />
            <span className="hero-accent">Barber</span> &amp;<br />
            Grooming.
          </h1>

          <p>
            Haircuts, beard stylings &amp; skin care — booked online in seconds.
            Experience the gold-standard in men's grooming at Gilded Blade.
          </p>

          <div className="hero-actions">
            {user ? (
              <Link to={dashboardLink}>
                <button className="btn">Go to Dashboard →</button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn">Book an Appointment →</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-secondary">Create Account</button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right: illustration */}
        <div className="hero-right">
          <div className="hero-illustration">
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=700"
              alt="Barber at work"
              className="hero-img-inner"
            />
          </div>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">1,200+</span>
          <span className="stat-label">Happy Clients</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">6+</span>
          <span className="stat-label">Expert Barbers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">4.9 ★</span>
          <span className="stat-label">Client Rating</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">100%</span>
          <span className="stat-label">Precision Guarantee</span>
        </div>
      </div>

      {/* ── SERVICES ─────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <div className="section-header">
          <div className="section-tag">Our Menu</div>
          <h2 className="section-title">
            Popular <span className="accent-red">Services</span>
          </h2>
          <p className="section-subtitle">
            Curated hair styling and grooming packages designed for the modern gentleman.
          </p>
        </div>

        {loadingServices ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : (
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={service._id || service.id || index}>
                <div
                  className="service-image-placeholder"
                  style={{ backgroundImage: `url(${getServiceImage(service, index)})` }}
                />
                <div className="service-card-content">
                  <h3 className="service-card-title">{service.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', minHeight: '52px', lineHeight: '1.6' }}>{service.description}</p>
                  <div className="service-card-meta">
                    <span className="service-card-price">
                      {typeof service.price === 'number' ? `₹${service.price}` : service.price}
                    </span>
                    <span className="service-card-duration">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {typeof service.duration === 'number' ? `${service.duration} mins` : service.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── GALLERY ──────────────────────────────────────── */}
      <div style={{ marginTop: '80px' }}>
        <div className="section-header">
          <div className="section-tag">Our Work</div>
          <h2 className="section-title">
            Barber <span className="accent-red">Showcase</span>
          </h2>
          <p className="section-subtitle">
            Razor-sharp fades and detailed styles crafted by our master stylists.
          </p>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div className="gallery-item" key={item.id}>
              <div className="gallery-image" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="gallery-overlay">
                <h4>{item.title}</h4>
                <p>Stylist: {item.stylist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <div style={{ marginTop: '80px' }}>
        <div className="section-header">
          <div className="section-tag">Reviews</div>
          <h2 className="section-title">
            What Our <span className="accent-red">Clients Say</span>
          </h2>
          <p className="section-subtitle">
            Hear from the gentlemen who trust us with their look.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.id}>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-client">
                <div className="client-avatar">{t.initials}</div>
                <div className="client-info">
                  <h4>{t.client}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA STRIP ────────────────────────────────────── */}
      <div style={{
        marginTop: '80px',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
        borderRadius: '24px',
        padding: '60px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', marginBottom: '10px' }}>
            Ready for your next<br />great cut?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '400px', lineHeight: '1.6' }}>
            Book your appointment online in under 60 seconds. No waiting. No hassle.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link to={user ? dashboardLink : '/login'}>
            <button style={{
              background: '#ffffff',
              color: 'var(--primary)',
              border: 'none',
              padding: '14px 36px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif',
            }}
              onMouseEnter={e => { e.target.style.background = 'var(--accent-red)'; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = '#ffffff'; e.target.style.color = 'var(--primary)'; }}
            >
              {user ? 'Open Dashboard →' : 'Book Now →'}
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Home;
