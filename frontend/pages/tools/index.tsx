import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import api from '@/utils/api';
import MoxMascot from '@/components/common/MoxMascot';

const STORAGE_KEY = 'creatorlaunch-build-a-business-response';

const ideaPools = {
  audience: ['student artists', 'young athletes', 'teen creators', 'families', 'school clubs', 'local nonprofits'],
  offers: ['custom merch', 'digital design services', 'snack boxes', 'event support', 'study kits', 'social media content'],
  hooks: ['built by youth', 'low-cost starter option', 'subscription friendly', 'community impact angle', 'eco-friendly twist', 'customizable for schools'],
  challenges: ['make your first sale in 7 days', 'get 3 testimonials', 'launch with less than $100', 'sell at a community event', 'test demand before buying inventory', 'find 10 potential customers'],
  bonus: ['Add a social impact component.', 'Partner with a local school.', 'Use a preorder model.', 'Try a referral reward.', 'Turn it into a workshop.', 'Build it with a friend or team.'],
};

const toolkitFiles = [
  {
    name: 'Elevator-Pitch-Template.txt',
    title: 'Elevator Pitch Template',
    content: `CREATORLAUNCH ELEVATOR PITCH TEMPLATE

1. My business idea is:
2. The problem I solve is:
3. The people I help are:
4. My solution/product/service is:
5. What makes it different is:
6. My goal for the next 30 days is:

Quick Pitch Formula:
Hi, my name is [NAME], and I am building [BUSINESS NAME], a [PRODUCT/SERVICE] for [AUDIENCE]. We help solve [PROBLEM] by [YOUR SOLUTION]. Right now, I am focused on [NEXT STEP].`,
  },
  {
    name: 'Market-Research-Checklist.txt',
    title: 'Market Research Checklist',
    content: `CREATORLAUNCH MARKET RESEARCH CHECKLIST

- Who is my target customer?
- Where do they spend time?
- What problem do they have?
- What are they using now?
- How much are they likely to pay?
- What do 3 competitors offer?
- What makes my idea different?
- Who can I interview this week?

Action Step:
Talk to at least 5 real people before you launch.`,
  },
  {
    name: 'Pricing-Worksheet.txt',
    title: 'Pricing Worksheet',
    content: `CREATORLAUNCH PRICING WORKSHEET

Product or service:
Cost to make or deliver one unit:
Packaging / supplies cost:
Marketing cost per sale (estimated):
Desired profit per sale:
Suggested price:

Formula:
Total Cost + Desired Profit = Starting Price

Questions:
- Is my price easy to explain?
- Does it make sense for my audience?
- Can I test 2 price points?`,
  },
  {
    name: 'Launch-Checklist.txt',
    title: 'Launch Checklist',
    content: `CREATORLAUNCH LAUNCH CHECKLIST

BEFORE LAUNCH
- Finalize your idea
- Test with real people
- Set your price
- Create a simple brand
- Decide how people will order
- Prepare photos or examples

LAUNCH WEEK
- Announce your business
- Share your offer online
- Ask for feedback
- Track what works
- Celebrate your first step

REMEMBER
You do not need a perfect business to start. You need a real first step.`,
  },
];

const CreatorToolsPage = () => {
  const [builderForm, setBuilderForm] = useState({
    name: '',
    email: '',
    role: 'student',
    ideaName: '',
    problem: '',
    audience: '',
    offer: '',
    revenueModel: '',
    nextStep: '',
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const [startupWheel, setStartupWheel] = useState({
    audience: 'teen creators',
    offer: 'custom merch',
    hook: 'built by youth',
    challenge: 'make your first sale in 7 days',
    bonus: 'Add a social impact component.',
  });

  const [calculator, setCalculator] = useState({
    inventory: 75,
    branding: 40,
    website: 0,
    packaging: 30,
    marketing: 25,
    eventFees: 0,
    extras: 20,
  });

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBuilderForm((current) => ({ ...current, ...parsed }));
      } catch (error) {
        console.error('Failed to restore Build-a-Business draft', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(builderForm));
    }
  }, [builderForm]);

  const totalLaunchCost = useMemo(() => {
    return (Object.values(calculator) as number[]).reduce((sum, value) => sum + Number(value || 0), 0);
  }, [calculator]);

  const launchAdvice = useMemo(() => {
    if (totalLaunchCost <= 100) {
      return 'Great starting point. This is a very realistic micro-launch budget for a youth founder.';
    }
    if (totalLaunchCost <= 250) {
      return 'This is still a manageable starter budget. Consider preorders or sponsorships to reduce your risk.';
    }
    if (totalLaunchCost <= 500) {
      return 'This is a solid launch budget. You may want a small fundraiser, grant, or partner support plan.';
    }
    return 'This is a bigger launch budget. Break your idea into phases so you can test demand before spending too much.';
  }, [totalLaunchCost]);

  const updateBuilderField = (field: string, value: string) => {
    setBuilderForm((current) => ({ ...current, [field]: value }));
    setSaveMessage('');
    setSaveError('');
  };

  const spinStartupWheel = () => {
    const pick = (items: string[]) => items[Math.floor(Math.random() * items.length)];

    setStartupWheel({
      audience: pick(ideaPools.audience),
      offer: pick(ideaPools.offers),
      hook: pick(ideaPools.hooks),
      challenge: pick(ideaPools.challenges),
      bonus: pick(ideaPools.bonus),
    });
  };

  const downloadToolkitFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const submitBusinessBuilder = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaveLoading(true);
    setSaveMessage('');
    setSaveError('');

    try {
      const payload = {
        name: builderForm.name,
        email: builderForm.email,
        role: builderForm.role,
        response: {
          ideaName: builderForm.ideaName,
          problem: builderForm.problem,
          audience: builderForm.audience,
          offer: builderForm.offer,
          revenueModel: builderForm.revenueModel,
          nextStep: builderForm.nextStep,
        },
      };

      await api.post('/api/tools/build-a-business', payload);
      setSaveMessage('Saved! Your Build-a-Business response was stored and your draft is still saved locally too.');
    } catch (error: any) {
      console.error(error);
      setSaveError(
        error?.response?.data?.message ||
          'We could not save your response to the website right now, but your draft is still saved in this browser.'
      );
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Layout title="Creator Tools | CreatorLaunch" description="Interactive CreatorLaunch tools for idea generation, startup practice, founder worksheets, and launch planning.">
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-primary font-semibold mb-3">Hands-on. Youth-friendly. Action-focused.</p>
              <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">Creator Tools</h1>
              <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto mb-8">
                Explore practical tools made to help young people brainstorm ideas, take action, and launch with confidence.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
                {['Build-a-Business', 'Startup Wheel', 'Founder Toolkit', 'Launch Calculator'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="bg-white border border-red-100 px-4 py-2 rounded-full hover:border-primary transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="build-a-business" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
              <div className="bg-light rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-red-100 text-primary flex items-center justify-center text-2xl">🧠</span>
                  <div>
                    <p className="text-primary font-semibold">Feature 3</p>
                    <h2 className="text-3xl font-bold text-dark">Build-a-Business Challenge</h2>
                  </div>
                </div>
                <p className="text-medium mb-8 text-lg">
                  Answer a few simple questions to shape your idea. Your draft is automatically saved in your browser, and when you click save, the response is also stored in CreatorLaunch.
                </p>

                <form onSubmit={submitBusinessBuilder} className="space-y-5">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">Your Name</label>
                      <input className="w-full rounded-xl border border-gray-200 px-4 py-3" value={builderForm.name} onChange={(e) => updateBuilderField('name', e.target.value)} placeholder="Optional" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">Email</label>
                      <input className="w-full rounded-xl border border-gray-200 px-4 py-3" value={builderForm.email} onChange={(e) => updateBuilderField('email', e.target.value)} placeholder="Optional" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">I am a...</label>
                      <select className="w-full rounded-xl border border-gray-200 px-4 py-3" value={builderForm.role} onChange={(e) => updateBuilderField('role', e.target.value)}>
                        <option value="student">Student</option>
                        <option value="educator">Educator</option>
                        <option value="parent">Parent</option>
                        <option value="supporter">Supporter</option>
                      </select>
                    </div>
                  </div>

                  {[
                    ['ideaName', 'Idea Name', 'What are you calling your idea?'],
                    ['problem', 'Problem', 'What problem are you solving?'],
                    ['audience', 'Customer', 'Who is this for?'],
                    ['offer', 'Offer', 'What are you selling, making, or providing?'],
                    ['revenueModel', 'How It Makes Money', 'How will money come in?'],
                    ['nextStep', 'Next Step', 'What is one realistic action you can take this week?'],
                  ].map(([field, label, placeholder]) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-dark mb-2">{label}</label>
                      <textarea
                        rows={field === 'problem' || field === 'offer' ? 4 : 3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3"
                        value={(builderForm as any)[field]}
                        onChange={(e) => updateBuilderField(field, e.target.value)}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button type="submit" disabled={saveLoading} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-70">
                      {saveLoading ? 'Saving...' : 'Save My Response'}
                    </button>
                    <button type="button" onClick={() => setBuilderForm({ name: '', email: '', role: 'student', ideaName: '', problem: '', audience: '', offer: '', revenueModel: '', nextStep: '' })} className="border border-gray-200 px-6 py-3 rounded-xl font-semibold text-dark hover:bg-gray-50 transition-colors">
                      Clear Draft
                    </button>
                  </div>

                  {saveMessage ? <p className="text-green-700 font-medium">{saveMessage}</p> : null}
                  {saveError ? <p className="text-red-600 font-medium">{saveError}</p> : null}
                </form>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Quick Tips from CreatorLaunch</h3>
                  <ul className="space-y-3 text-white/85">
                    <li>• Start with a real problem, not just a cool idea.</li>
                    <li>• Talk to actual people before you spend money.</li>
                    <li>• Your first version can be small, simple, and imperfect.</li>
                    <li>• Test quickly, learn quickly, and keep moving.</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
                  <h3 className="text-2xl font-bold text-dark mb-3">Need inspiration?</h3>
                  <p className="text-medium mb-5">
                    Use the Startup Wheel below to shake loose new ideas, or visit <Link href="/meet-mox" className="text-primary font-semibold hover:underline">Meet Mox</Link> for an extra push of creative energy.
                  </p>
                  <MoxMascot className="max-w-[260px] mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="startup-wheel" className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <p className="text-primary font-semibold mb-3">Feature 6</p>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Spin the Startup Wheel</h2>
                <p className="text-lg text-medium">
                  This is more than one random prompt. You get an audience, an offer, a unique hook, a challenge, and a bonus twist to push your creativity further.
                </p>
              </div>

              <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="aspect-square rounded-full border-[12px] border-red-100 bg-gradient-to-br from-white to-red-50 flex items-center justify-center mx-auto max-w-[340px]">
                    <div className="w-[72%] h-[72%] rounded-full bg-primary text-white flex items-center justify-center text-center p-6 shadow-lg">
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-white/75">Creator Wheel</p>
                        <p className="text-2xl md:text-3xl font-black mt-2">Spin for a startup idea</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={spinStartupWheel} className="w-full mt-8 bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    Spin the Wheel
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    ['Audience', startupWheel.audience],
                    ['Offer', startupWheel.offer],
                    ['Unique Hook', startupWheel.hook],
                    ['Launch Challenge', startupWheel.challenge],
                    ['Bonus Twist', startupWheel.bonus],
                    ['Instant Combo', `Build a ${startupWheel.offer} idea for ${startupWheel.audience} with a ${startupWheel.hook} angle.`],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">{label}</p>
                      <p className="text-dark font-semibold text-lg">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="founder-toolkit" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <p className="text-primary font-semibold mb-3">Feature 13</p>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Founder Toolkit Downloads</h2>
                <p className="text-lg text-medium">
                  Grab practical CreatorLaunch templates that help students move from ideas to action.
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {toolkitFiles.map((item) => (
                  <div key={item.name} className="bg-light rounded-2xl p-6 border border-gray-100 flex flex-col">
                    <div className="text-3xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                    <p className="text-medium mb-6 flex-1">Simple, practical, and ready to use right away.</p>
                    <button onClick={() => downloadToolkitFile(item.name, item.content)} className="bg-dark text-white px-4 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="launch-calculator" className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.95fr] gap-8 items-start">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <p className="text-primary font-semibold mb-3">Feature 14</p>
                <h2 className="text-3xl font-bold text-dark mb-4">What Does It Cost to Launch?</h2>
                <p className="text-medium mb-8 text-lg">
                  Estimate the cost of getting a small business idea off the ground. Adjust each category to see what is realistic for a first launch.
                </p>

                <div className="space-y-5">
                  {[
                    ['inventory', 'Inventory or supplies'],
                    ['branding', 'Branding or design'],
                    ['website', 'Website or store setup'],
                    ['packaging', 'Packaging'],
                    ['marketing', 'Marketing'],
                    ['eventFees', 'Pop-up / event fees'],
                    ['extras', 'Other extras'],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-semibold text-dark">{label}</label>
                        <span className="text-primary font-bold">${(calculator as any)[key]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="5"
                        value={(calculator as any)[key]}
                        onChange={(e) => setCalculator((current) => ({ ...current, [key]: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-3xl p-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-white/60 mb-2">Estimated Launch Budget</p>
                  <h3 className="text-5xl font-black mb-3">${totalLaunchCost}</h3>
                  <p className="text-white/85">{launchAdvice}</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-bold text-dark mb-4">Budget Smarts</h3>
                  <ul className="space-y-3 text-medium">
                    <li>• Start with the smallest version you can test.</li>
                    <li>• Preorders can reduce inventory risk.</li>
                    <li>• Local events can be a great first sales channel.</li>
                    <li>• A good first step is often more valuable than a perfect plan.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default CreatorToolsPage;