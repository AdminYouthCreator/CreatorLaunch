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

            <a
              aria-label="Young CEO Launchpad Candid profile"
              href="https://app.candid.org/profile/16387981/young-ceo-launchpad-39-2689174/?pkId=44192db8-d585-43ab-8759-0217c322caff"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4"
            >
              <img
                alt="Candid transparency seal"
                src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16387981/svg"
                className="max-w-[170px] h-auto"
              />
            </a>

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
                <Link href="/support" className="footer-link">
                  Ways to Support
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
            <h3>Learning & Platform</h3>
            <ul className="footer-links">
              <li>
                <Link href="/games" className="footer-link">
                  CreatorGames
                </Link>
              </li>
              <li>
                <Link href="/progress" className="footer-link">
                  Digital Platform
                </Link>
              </li>
              <li>
                <Link href="/verify-certificate" className="footer-link">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/meet-mox" className="footer-link">
                  Meet Mox
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Policies</h3>
            <ul className="footer-links">
              <li>
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/youth-safety" className="footer-link">
                  Youth Safety
                </Link>
              </li>
              <li>
                <Link href="/donation-policy" className="footer-link">
                  Donation Policy
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="footer-link">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    'CreatorLaunch Policy Question'
                  )}`}
                  className="footer-link"
                >
                  Policy Question
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
