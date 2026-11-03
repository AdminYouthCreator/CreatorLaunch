import Link from 'next/link';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container mx-auto px-4">
        <div className="footer-intro">
          <div>
            <img src="/assets/footer-logo.png" alt="CreatorLaunch" className="footer-logo" />
            <p className="footer-desc">
              A St. Louis youth-led nonprofit helping students turn ideas into practical
              projects.
            </p>
          </div>

          <div className="footer-contact">
            <p>Questions about the Student Business Program?</p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h3>Students &amp; families</h3>
            <ul className="footer-links">
              <li><Link href="/student-business-program" className="footer-link">Student Business Program</Link></li>
              <li><Link href="/games" className="footer-link">CreatorGames</Link></li>
              <li><Link href="/faq" className="footer-link">Frequently asked questions</Link></li>
              <li><Link href="/youth-safety" className="footer-link">Youth safety</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>CreatorLaunch</h3>
            <ul className="footer-links">
              <li><Link href="/about" className="footer-link">About</Link></li>
              <li><Link href="/about/team" className="footer-link">Team &amp; board</Link></li>
              <li><Link href="/blog" className="footer-link">Blog</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Get involved</h3>
            <ul className="footer-links">
              <li><Link href="/partners" className="footer-link">Partners</Link></li>
              <li><Link href="/support" className="footer-link">Ways to support</Link></li>
              <li><Link href="/donate" className="footer-link">Donate</Link></li>
              <li><Link href="/bring-creatorlaunch" className="footer-link">Bring CreatorLaunch</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Policies</h3>
            <ul className="footer-links">
              <li><Link href="/privacy-policy" className="footer-link">Privacy</Link></li>
              <li><Link href="/donation-policy" className="footer-link">Donations</Link></li>
              <li><Link href="/community-guidelines" className="footer-link">Community guidelines</Link></li>
              <li><Link href="/verify-certificate" className="footer-link">Verify certificate</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>501(c)(3) nonprofit · EIN 39-2689174</p>
            <p>© 2026 CreatorLaunch</p>
          </div>

          <a
            aria-label="CreatorLaunch Candid profile"
            href="https://app.candid.org/profile/16387981/young-ceo-launchpad-39-2689174/?pkId=44192db8-d585-43ab-8759-0217c322caff"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-seal"
          >
            <img
              alt="Candid transparency seal"
              src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/16387981/svg"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
