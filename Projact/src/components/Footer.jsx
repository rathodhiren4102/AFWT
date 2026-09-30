import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section">
          <h4 style={{ fontFamily: 'Outfit, Inter, sans-serif', fontSize: '20px', letterSpacing: '-0.5px' }}>
            gilded<span style={{ color: 'var(--accent-purple)' }}>blade</span><span style={{ color: 'var(--accent-red)' }}>.</span>
          </h4>
          <p style={{ maxWidth: '270px', marginTop: '12px', lineHeight: '1.7' }}>
            Where classic barbering meets modern luxury. Elevate your style and experience the gold-standard in men's grooming.
          </p>
          <div className="footer-socials">
            {/* Facebook */}
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Opening Hours</h4>
          <ul style={{ marginTop: '12px' }}>
            <li>Monday – Friday: 9:00 AM – 8:00 PM</li>
            <li>Saturday: 9:00 AM – 6:00 PM</li>
            <li>Sunday: By Appointment Only</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact &amp; Location</h4>
          <ul style={{ marginTop: '12px' }}>
            <li>📍 102, First Floor, Kanhaiya Building, Linking Road, Bandra West, Mumbai</li>
            <li>📞 +91 63693 36820</li>
            <li>✉️ GildedBlade@gmail.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul style={{ marginTop: '12px' }}>
            <li><a href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Book Appointment</a></li>
            <li><a href="/register" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Create Account</a></li>
            <li><a href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Staff Login</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Gilded Blade Barber Portal — B.Tech AFWT Project</p>
      </div>
    </footer>
  );
}

export default Footer;
