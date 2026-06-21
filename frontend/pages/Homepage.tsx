import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import MoxMascot from '@/components/common/MoxMascot';

const pathCards = [
  {
    title: 'I’m a Student',
    description: 'Explore tools, games, and launch resources built for youth who want to create something real.',
    cta: 'Explore Creator Tools',
    href: '/tools',
  },
  {
    title: 'I’m a Partner',
    description: 'Bring CreatorLaunch to your school, summer program, or community organization.',
    cta: 'Partner With Us',
    href: '/partners',
  },
  {
    title: 'I’m a Donor',
    description: 'Help fund entrepreneurship opportunities, learning materials, and launch experiences for youth.',
    cta: 'Support Our Mission',
    href: '/donate',
  },
  {
    title: 'I’m Just Curious',
    description: 'Learn about CreatorLaunch, meet Mox, and see how we help young creators move from ideas to action.',
    cta: 'Learn More',
    href: '/about',
  },
];

const toolCards = [
  {
    title: 'Build-a-Business Challenge',
    description: 'Answer guided prompts and save your idea so you can keep building it later.',
  },
  {
    title: 'Spin the Startup Wheel',
    description: 'Get a complete idea combo with an audience, offer, hook, challenge, and bonus twist.',
  },
  {
    title: 'Founder Toolkit',
    description: 'Download easy templates like pitch guides, launch checklists, pricing worksheets, and more.',
  },
  {
    title: 'Launch Cost Calculator',
    description: 'Estimate what it could cost to get your first idea off the ground.',
  },
];

const Homepage = () => {
  return (
    <Layout title="CreatorLaunch | Building the Next Generation of Founders">
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-orange-50">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center bg-white border border-red-100 rounded-full px-4 py-2 mb-6 shadow-sm">
                <span className="text-sm font-semibold text-primary">Youth-founded. Youth-run. Built for young creators.</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-dark leading-tight mb-6">
                Building the Next Generation of Founders.
              </h1>

              <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto mb-8">
                CreatorLaunch is a youth-led nonprofit helping young entrepreneurs turn ideas into real ventures through workshops, launch support, donor-funded opportunities, and practical tools built for youth.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/partners" className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                  Bring CreatorLaunch to Your Community
                </Link>
                <Link href="/donate" className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Support Our Mission
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <p className="text-primary font-semibold mb-3">Feature 10</p>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Choose Your Path</h2>
              <p className="text-lg text-medium">Whether you are a student, partner, donor, or just exploring, there is a place for you in CreatorLaunch.</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {pathCards.map((card) => (
                <div key={card.title} className="bg-light rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
                  <h3 className="text-xl font-bold text-dark mb-3">{card.title}</h3>
                  <p className="text-medium mb-6 flex-1">{card.description}</p>
                  <Link href={card.href} className="text-primary font-semibold hover:underline">
                    {card.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <p className="text-primary font-semibold mb-3">Feature 2</p>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">What Donations Can Do</h2>
              <p className="text-lg text-medium">Connect support to real impact so donors can clearly see how their giving helps young creators.</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-4xl font-black text-primary mb-2">$25</p>
                <h3 className="text-lg font-bold text-dark mb-2">One student founder kit</h3>
                <p className="text-medium">Helps cover printed worksheets, ideation materials, and workshop supplies.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-4xl font-black text-primary mb-2">$100</p>
                <h3 className="text-lg font-bold text-dark mb-2">Mini workshop support</h3>
                <p className="text-medium">Helps support a hands-on entrepreneurship session for a small student group.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-4xl font-black text-primary mb-2">$250</p>
                <h3 className="text-lg font-bold text-dark mb-2">Launch-ready cohort help</h3>
                <p className="text-medium">Can help fund materials, activity support, and launch readiness for a group of youth participants.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-4xl font-black text-primary mb-2">$500+</p>
                <h3 className="text-lg font-bold text-dark mb-2">Bigger opportunity support</h3>
                <p className="text-medium">Supports deeper programming, student opportunities, and expanded access for more families.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.08fr_0.92fr] gap-10 items-center">
              <div>
                <p className="text-primary font-semibold mb-3">Features 3, 6, 13, and 14</p>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Tools Young Founders Can Actually Use</h2>
                <p className="text-lg text-medium mb-8">
                  CreatorLaunch is not just inspiration. It is action. We are adding interactive tools that help students brainstorm ideas, make decisions, and take real next steps.
                </p>

                <div className="grid sm:grid-cols-2 gap-5">
                  {toolCards.map((tool) => (
                    <div key={tool.title} className="bg-light rounded-2xl p-5 border border-gray-100">
                      <h3 className="text-lg font-bold text-dark mb-2">{tool.title}</h3>
                      <p className="text-medium">{tool.description}</p>
                    </div>
                  ))}
                </div>

                <Link href="/tools" className="inline-block mt-8 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                  Explore Creator Tools
                </Link>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                <p className="text-white/70 font-semibold mb-3">Feature 5</p>
                <h2 className="text-3xl font-bold mb-4">Certificate Verification</h2>
                <p className="text-white/85 text-lg mb-6">
                  CreatorLaunch certificates can be officially generated by staff, saved in the system, and verified by the public using a unique code.
                </p>
                <div className="space-y-3 text-white/85 mb-8">
                  <p>• Generate and save certificates for real CreatorLaunch programs.</p>
                  <p>• Give each certificate a unique verification code.</p>
                  <p>• Let anyone confirm whether a certificate is real.</p>
                </div>
                <Link href="/verify-certificate" className="inline-block bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Verify a Certificate
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-violet-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
              <div className="bg-white rounded-[2rem] border border-violet-100 shadow-sm p-8">
                <MoxMascot showWordmark className="max-w-[380px] mx-auto" />
              </div>
              <div>
                <p className="text-primary font-semibold mb-3">Feature 7</p>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Meet Mox, Our Creative Spark</h2>
                <p className="text-lg text-medium mb-5">
                  Mox is the tiny creative spark inside every young creator. He pops out of the CreatorLaunch idea box whenever someone has a new idea, makes a plan, or launches something into the world.
                </p>
                <p className="text-lg text-medium mb-8">
                  He is playful, brave, curious, and supportive — a simple, memorable character that helps make CreatorLaunch feel more youthful, welcoming, and fun.
                </p>
                <Link href="/meet-mox" className="inline-block bg-dark text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Meet Mox
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to help a young idea grow?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-white/90">
              You can support CreatorLaunch by donating, partnering with us, or simply sharing what we are building with your community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/partners" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Bring CreatorLaunch to Your Community
              </Link>
              <Link href="/donate" className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                Support Our Mission
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Homepage;