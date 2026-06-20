import Link from 'next/link';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container mx-auto px-4">
        <div className="footer-grid">
          <div className="footer-col">
            <img
              src="/assets/footer-logo.png"
              alt="CreatorLaunch Logo"
              className="footer-logo"
            />

            <p className="footer-desc">
              CreatorLaunch is a youth-led 501(c)(3) nonprofit helping young people
              learn entrepreneurship, build ideas, and launch real ventures through
              community workshops, partnerships, and digital tools.
            </p>

            <div className="footer-social">
              <a
                href="https://www.linkedin.com/company/the-young-ceo-launchpad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorLaunch LinkedIn"
              >
                <FaLinkedin className="social-icon" />
              </a>

              <a
                href="https://www.instagram.com/thecreatorlaunch"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorLaunch Instagram"
              >
                <FaInstagram className="social-icon" />
              </a>

              <a
                href="https://www.facebook.com/people/CreatorLaunch/61577895815824/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorLaunch Facebook"
              >
                <FaFacebook className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>For Communities</h3>
            <ul className="footer-links">
              <li>
                <Link href="/bring-creatorlaunch" className="footer-link">
                  Bring CreatorLaunch
                </Link>
              </li>
              <li>
                <Link href="/partners" className="footer-link">
                  Partners
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    'Bring CreatorLaunch to our community'
                  )}`}
                  className="footer-link"
                >
                  Request a Workshop
                </a>
              </li>
              <li>
                <Link href="/donate" className="footer-link">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>About</h3>
            <ul className="footer-links">
              <li>
                <Link href="/about" className="footer-link">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about/team" className="footer-link">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/progress" className="footer-link">
                  Digital Platform
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <ul className="footer-links">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    'General CreatorLaunch Inquiry'
                  )}`}
                  className="footer-link"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    'Partnership Inquiry'
                  )}`}
                  className="footer-link"
                >
                  Partnership Inquiry
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    'Donation Inquiry'
                  )}`}
                  className="footer-link"
                >
                  Donation Inquiry
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="container mx-auto px-4">
        <div className="footer-bottom">
          <p>
            CreatorLaunch is a nationally recognized 501(c)(3) nonprofit organization.
            EIN: 39-2689174
          </p>
          <p className="mt-2">© 2026 CreatorLaunch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};