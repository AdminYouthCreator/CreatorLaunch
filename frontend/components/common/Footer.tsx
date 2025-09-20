// ################## ----- FOOTER COMPONENT ----- ##################
// Site footer with branding, links, and social media
// Pulls configuration data from config.json file
// ################################################################
import Link from 'next/link';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import config from '@/config/config.json';

// ################## ----- FOOTER COMPONENT ----- ##################
// Main footer component with logo, links, and social icons
// Uses configuration data for dynamic content
// ##########################################################
export const Footer = () => {
  const { footer } = config;

  return (
    <footer className="site-footer">
      <div className="container mx-auto px-4">
        <div className="footer-grid">
          {/* Logo & Description */}
          <div className="footer-col">
          <img
            src={footer.logo.src}
            alt={footer.logo.alt}
            className="footer-logo"
          />
          <p className="footer-desc">{footer.description}</p>
          <div className="footer-social">
            <a
              href={footer.social[0].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="social-icon" />
            </a>
            <a
              href={footer.social[1].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="social-icon" />
            </a>
            <a
              href={footer.social[2].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="social-icon" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {footer.quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.link} className="footer-link">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <h3>Resources</h3>
          <ul className="footer-links">
            {footer.resources.map((r) => (
              <li key={r.label}>
                <Link href={r.link} className="footer-link">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="container mx-auto px-4">
        <div className="footer-bottom">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
};
