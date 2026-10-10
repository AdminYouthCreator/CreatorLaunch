import React from 'react';
import Layout from '@/components/common/Layout';
import MoxMascot from '@/components/common/MoxMascot';

const catchphrases = [
  'Got an idea? Let’s launch it.',
  'Think it. Sketch it. Build it. Launch it.',
  'Every big idea starts in the box.',
  'Pop out and create.',
  'Your idea belongs out in the world.',
];

const traits = [
  ['Curious', 'Always asking, “what can we make?”'],
  ['Supportive', 'Encourages youth to try, even when the idea is not perfect yet.'],
  ['Creative', 'Always sketching, brainstorming, and experimenting.'],
  ['Playful', 'Fun, lighthearted, and never too serious.'],
  ['Brave', 'Willing to try new things and launch bold ideas.'],
  ['Helpful', 'Acts like a little guide for students starting projects or businesses.'],
];

const MeetMoxPage = () => {
  return (
    <Layout
      title="Meet Mox | CreatorLaunch"
      description="Meet Mox, the playful CreatorLaunch mascot who represents ideas coming to life."
    >
      <main className="min-h-screen bg-white">
        <section className="page-hero py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
              <div>
                <p className="section-kicker mb-5">
                  Our Mascot
                </p>
                <h1 className="page-title text-dark mb-6">
                  Meet Mox
                </h1>
                <p className="text-lg md:text-xl text-medium max-w-2xl mb-6">
                  Mox is the tiny creative spark inside every young creator. He lives inside
                  the CreatorLaunch idea box and pops out whenever someone has a new idea,
                  starts a project, makes a plan, or launches something into the world.
                </p>
                <p className="text-lg text-medium max-w-2xl">
                  He is not supposed to be realistic. He is a fun brand character that can
                  show up across the website, social media, flyers, stickers, shirts,
                  certificates, and student resources.
                </p>
              </div>

              <div className="mox-stage p-6 md:p-10">
                <MoxMascot showWordmark className="max-w-[420px] mx-auto" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              <div className="soft-card bg-light p-8">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  What Mox Represents
                </h2>
                <ul className="space-y-3 text-medium">
                  <li>
                    <strong className="text-dark">Ideas coming to life:</strong> the box
                    represents hidden potential, and Mox popping out shows that every young
                    person has something inside them worth sharing.
                  </li>
                  <li>
                    <strong className="text-dark">Creativity and action:</strong> Mox is
                    not just about thinking of ideas. He represents sketching, planning,
                    testing, building, and launching.
                  </li>
                  <li>
                    <strong className="text-dark">Surprise and possibility:</strong> because
                    he pops out of a box, he feels playful, exciting, and full of potential.
                  </li>
                </ul>
              </div>

              <div className="soft-card bg-light p-8">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  Visual Language
                </h2>
                <ul className="space-y-3 text-medium">
                  <li>• Soft dark navy / black blob shape</li>
                  <li>• Two simple white oval eyes</li>
                  <li>• Purple CreatorLaunch idea box</li>
                  <li>• Spark shapes and motion accents</li>
                  <li>• Purple, teal, white, dark navy, and small orange / yellow accents</li>
                  <li>• Simple enough for web, stickers, merch, and certificates</li>
                </ul>
              </div>

              <div className="band-dark rounded-[28px] p-8">
                <h2 className="text-2xl font-bold mb-4">Catchphrases</h2>
                <ul className="space-y-3 text-white/85">
                  {catchphrases.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                  Mox’s Personality
                </h2>
                <p className="text-lg text-medium">
                  Mox is not just a mascot. He is a creative idea buddy for young people
                  trying something new.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {traits.map(([title, description]) => (
                  <div key={title} className="soft-card p-6">
                    <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
                    <p className="text-medium">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default MeetMoxPage;