import './styles.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">          {/* Company Section */}
          <div className="footer-section footer-company">
            <h3 className="footer-title">🎸 El mundo de las guitarras</h3>
            <p className="footer-description">
              Tu tienda de confianza que ofrece instrumentos de calidad 
              con un servicio al cliente excepcional y asesoramiento experto para músicos de todos los niveles.
            </p>
          </div>

          {/* Links Container - Side by Side */}
          <div className="footer-links-container">
            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/productos">Products</a></li>
                <li><a href="/ofertas">Offers</a></li>
                <li><a href="/contacto">Contact</a></li>
                <li><a href="/perfil">My Account</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Customer Service</h4>
              <ul className="footer-links">
                <li><a href="/help">Help Center</a></li>
                <li><a href="/shipping">Shipping Info</a></li>
                <li><a href="/returns">Returns & Refunds</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/support">Support</a></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Contact Info</h4>
              <div className="footer-contact">                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Niños Heroes 706, Tercero de Cobián Centro, 27220 Torreón, Coah.</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+52 871 123 4567</span>
                </div>                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>info@elmundodelasguitarras.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">        <div className="footer-container">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} El mundo de las guitarras. Todos los derechos reservados.</p>
            <div className="footer-legal">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
