import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container relative mx-auto px-4">
        <div className="footer-launch-card">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">
              Make room for big ideas
            </p>
            <h2>Bring CreatorLaunch to your community.</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bring-creatorlaunch"
              className="site-button bg-white text-dark hover:bg-amber-50"
            >
              Request a workshop <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/donate"
              className="site-button border border-white/15 bg-white/10 text-white hover:bg-white/15"
            >
              Support the mission
            </Link>
          </div>
        </div>

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
              className="mt-5 inline-block rounded-xl bg-white/95 p-2"
            >
              <img
                alt="Candid transparency seal"
                src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16387981/svg"
                className="h-auto max-w-[150px]"
              />
            </a>

            <div className="footer-social">
              <a
                href="https://www.linkedin.com/company/the-young-ceo-launchpad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorLaunch LinkedIn"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/thecreatorlaunch"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorLaunch Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/people/CreatorLaunch/61577895815824/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CreatorLaunch Facebook"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>For communities</h3>
            <ul className="footer-links">
              <li><Link href="/bring-creatorlaunch" className="footer-link">Bring CreatorLaunch</Link></li>
              <li><Link href="/partners" className="footer-link">Partners</Link></li>
              <li><Link href="/support" className="footer-link">Ways to support</Link></li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Bring CreatorLaunch to our community')}`}
                  className="footer-link"
                >
                  Request a workshop
                </a>
              </li>
              <li><Link href="/donate" className="footer-link">Donate</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <ul className="footer-links">
              <li><Link href="/games" className="footer-link">CreatorGames</Link></li>
              <li><Link href="/meet-mox" className="footer-link">Meet Mox</Link></li>
              <li><Link href="/progress" className="footer-link">Digital platform</Link></li>
              <li><Link href="/about" className="footer-link">About us</Link></li>
              <li><Link href="/about/team" className="footer-link">Team & Board</Link></li>
              <li><Link href="/verify-certificate" className="footer-link">Verify certificate</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Trust & policies</h3>
            <ul className="footer-links">
              <li><Link href="/privacy-policy" className="footer-link">Privacy policy</Link></li>
              <li><Link href="/youth-safety" className="footer-link">Youth safety</Link></li>
              <li><Link href="/donation-policy" className="footer-link">Donation policy</Link></li>
              <li><Link href="/community-guidelines" className="footer-link">Community guidelines</Link></li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CreatorLaunch Policy Question')}`}
                  className="footer-link"
                >
                  Policy question
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>
            CreatorLaunch is a nationally recognized 501(c)(3) nonprofit organization.
            EIN: 39-2689174
          </p>
          <p>© 2026 CreatorLaunch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
