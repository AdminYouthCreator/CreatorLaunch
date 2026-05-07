export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  author: string;
  excerpt: string;
  content: string[];
  ctaText?: string;
  ctaHref?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'what-can-you-do-with-500',
    title: 'What Can You Do With $500?',
    date: '2025-07-22',
    displayDate: 'July 22, 2025',
    author: 'Qwentin Blassingame, Founder & Executive Director',
    excerpt:
      "A founder's note on the power of seed capital to transform a young person's entrepreneurial journey.",
    content: [
      "When you're a teenager, $500 can feel like a lot of money. It can buy a new gaming console, a cool pair of sneakers, or a lot of pizza.",
      'But what if it could buy a dream?',
      'When we were designing the CreatorLaunch workshop, we knew we had to do more than just teach business theory. We had to give our students the one thing that stops most founders before they even start: capital.',
      "That’s why the single most important line item in our budget is the $500 seed capital grant we will provide to every student in our program. This isn't a loan or a prize; it's a direct investment in their potential.",
      'With that $500, a student can go from having an idea to having a real business. They can purchase the domain name for their website, buy the first month of their e-commerce plan, order a sample of their t-shirt design to ensure its quality, and even run their first targeted social media ad. It transforms their business from a “what if” into a “what’s next.”',
      'More than the money itself, that seed capital is a powerful vote of confidence. It is us saying, “We believe in your idea. We believe in your potential. Now, go build it.”',
      'Right now, we are in the crucial phase of fundraising to make this a reality for our first 20 students. When you support our campaign, you are not just donating to a nonprofit. You are becoming a seed investor in the next generation of St. Louis leaders. You are giving a young person the resources to buy their dream.',
      'And that is an investment with a return that is truly priceless.',
    ],
    ctaText: 'Support Launch Capital',
    ctaHref: '/donate',
  },
  {
    slug: 'perfecting-the-engine',
    title: 'Before We Build the Rocket Ship, We’re Perfecting the Engine',
    date: '2025-07-22',
    displayDate: 'July 22, 2025',
    author: 'The CreatorLaunch Team',
    excerpt:
      "Before we build the rocket ship, we're perfecting the engine through our in-person entrepreneurship workshops.",
    content: [
      'From the very beginning, our vision for CreatorLaunch has been a powerful, scalable digital platform that can empower thousands of young entrepreneurs across the country. That vision is still our North Star, but we believe that to build something truly great, you must start with a strong foundation.',
      "That's why our first major initiative isn't only the digital platform. It is our in-person entrepreneurship workshop.",
      'Before we scale our program to the digital world, we want to perfect it in the real world. We believe there is no substitute for the magic that happens in a classroom: the direct mentorship, the collaborative energy of working with peers, and the confidence that comes from pitching a business idea to a live audience.',
      'Our 6-week, in-person workshop is the engine we are building. It is where we will refine our curriculum, test our educational model, and, most importantly, work directly with our first cohorts of Young CEOs to understand their needs. The lessons we learn together in this workshop will become the code and content of the digital platform in the future.',
      'Right now, our entire focus is on securing the funding to launch our very first workshop. This program will provide St. Louis students with business-building tools, professional guidance, and seed capital support to launch their first ventures.',
      "This workshop is the foundational first step. By supporting it, you're not just funding a class; you're helping us build the engine that will one day power thousands of entrepreneurial journeys.",
    ],
    ctaText: 'Partner With Us',
    ctaHref: '/partners',
  },
  {
    slug: 'building-creatorlaunch-progress-whats-next',
    title: "Building CreatorLaunch: Our Progress and What's Next",
    date: '2025-07-12',
    displayDate: 'July 12, 2025',
    author: 'The CreatorLaunch Team',
    excerpt:
      "It's been an incredibly busy and exciting few months. We wanted to share an update on our progress and what's next.",
    content: [
      'Hello, everyone!',
      "It's been an incredibly busy and exciting few months since we first announced our mission to build CreatorLaunch, and we wanted to share an update on our progress. Building a platform and a nonprofit from the ground up is a huge undertaking, and we are thrilled with the foundation we have laid so far.",
      'The first critical step was to create a legitimate, legal foundation for our work. CreatorLaunch has been incorporated in Missouri as a nonprofit organization. We have drafted bylaws, established our founding board, and continue building the framework needed to operate with transparency and integrity.',
      'This vision is too big to build alone. We have started recruiting for key volunteer roles, including developers, educators, organizers, and community supporters who can help bring the platform and workshop curriculum to life.',
      'Our next major phase is focused on two parallel tracks: fundraising and development. We are preparing to raise the seed funding needed for our first workshop cycle while continuing to build the technical foundation for the CreatorLaunch platform.',
      "Thank you for being a part of this journey with us. We are building more than a website; we are building a launchpad for the next generation of leaders, and we couldn't do it without your support.",
    ],
    ctaText: 'Join the Waitlist',
    ctaHref: '/contact',
  },
  {
    slug: 'its-not-about-the-t-shirt',
    title: 'It’s Not About the T-Shirt',
    date: '2025-07-08',
    displayDate: 'July 8, 2025',
    author: 'Qwentin Blassingame, Founder & Executive Director',
    excerpt:
      "While we're helping young people sell products, the true mission of CreatorLaunch goes far beyond that.",
    content: [
      'When we tell people we are building a platform for young people to design and sell products, they often say, “Oh, so you are helping kids sell t-shirts.”',
      'And while that is technically true, it misses the point entirely.',
      "CreatorLaunch was never really about the t-shirt, the sticker, or the logo design service. It is about the moment a young person realizes they can have an idea, create something real from it, and see someone else find value in their work. It is about the spark that ignites when they make their first sale, the first dollar they earned not from an allowance or a part-time job, but from their own creativity and courage.",
      'That moment is transformative.',
      'It is the moment a creative kid becomes a founder. It is the moment a student becomes a CEO. It is the moment they stop seeing themselves as just a consumer and start seeing themselves as a creator, a builder, and a problem-solver.',
      'The skills learned in that process, like calculating a profit margin, writing a marketing post, and responding to a customer inquiry, are valuable. But the real product we are building at CreatorLaunch is confidence. It is resilience. It is the belief in one’s ability to shape their future.',
      'So yes, we are helping young people sell products. But we are also helping them build the self-belief that will last a lifetime, long after that first product has been sold. And that is a mission worth building.',
    ],
    ctaText: 'Read Our Mission',
    ctaHref: '/about',
  },
  {
    slug: '3-signs-ready-for-creatorlaunch-workshop',
    title: '3 Signs You’re Ready for a CreatorLaunch Workshop',
    date: '2025-07-01',
    displayDate: 'July 1, 2025',
    author: 'The CreatorLaunch Team',
    excerpt:
      'Ever find yourself sketching logos, daydreaming about a business idea, or wondering if you have what it takes to be your own boss?',
    content: [
      'Ever find yourself sketching logos in your notebook? Daydreaming about a cool t-shirt design or a business idea? Wondering if you have what it takes to be your own boss? Taking the first step is often the hardest part, but you might be more prepared than you think. Our workshops are designed to turn that spark of curiosity into a real, operating business.',
      '1. You are full of ideas, even weird ones. This is the most important sign. You are constantly seeing problems and thinking of solutions, or you have a passion like art, music, fashion, gaming, or helping others that you want to share with the world. You do not need a perfect, 10-page business plan to start. You just need a spark. Our workshops are designed to help you catch that spark, refine it, and build a solid brand around it.',
      '2. You are eager to learn by doing. Are you tired of just reading from textbooks? Do you learn best when you get your hands dirty? That is exactly what our workshops are about. We believe the best way to learn about business is to actually build one. You learn how to price a product, market it to real customers, and build your own online store by doing it yourself with guidance along the way.',
      '3. You want to make an impact. Being an entrepreneur is not just about making money. It is about creating something that matters to you and your community. Whether you want to sell art that expresses a message, create a service that helps your neighbors, or build a brand that stands for something you believe in, you are driven by more than profit. You see business as a tool to make a real impact.',
      'If you saw yourself in any of these signs, you are exactly the kind of person we are looking for. You do not need experience, just passion and a willingness to try. CreatorLaunch provides the tools, support, and pathway to turn your spark into a real business.',
    ],
    ctaText: 'Apply or Join the Waitlist',
    ctaHref: '/contact',
  },
  {
    slug: '5-steps-to-launch-your-first-product',
    title: '5 Steps to Launch Your First Product',
    date: '2025-06-20',
    displayDate: 'June 20, 2025',
    author: 'CreatorLaunch Team',
    excerpt:
      "Dive into the fundamentals of product development and selling online. From idea to first sale, we've got you covered.",
    content: [
      'Launching a first product can feel huge, but it becomes manageable when you break it into steps.',
      'Step 1: Start with a real idea. Think about what you like, what problems you notice, and what people around you already care about. Your first product does not need to be perfect. It needs to be clear enough to test.',
      'Step 2: Define who it is for. A product becomes easier to build and market when you know who you are trying to help or reach. Think about your classmates, community, friends, or online audience.',
      'Step 3: Build your brand. Your name, colors, message, and style should help people understand what you stand for. Branding is not just a logo. It is the feeling people get when they see your work.',
      'Step 4: Price it with purpose. Your price should cover costs, leave room for profit, and still make sense for your audience. Learning this math early is one of the most powerful parts of entrepreneurship.',
      'Step 5: Launch, learn, and improve. Your first sale is not the finish line. It is feedback. Every customer, post, and product idea helps you get better.',
    ],
    ctaText: 'Start Building',
    ctaHref: '/contact',
  },
  {
    slug: 'power-of-a-youth-led-nonprofit',
    title: 'The Power of a Youth-Led Nonprofit',
    date: '2025-06-10',
    displayDate: 'June 10, 2025',
    author: 'Qwentin Blassingame',
    excerpt:
      'Our founder shares his vision on why young people are uniquely positioned to drive positive change.',
    content: [
      'As the founder of CreatorLaunch, I often get asked: why a youth-led nonprofit? The answer is simple but powerful: true empowerment begins when young people are not just beneficiaries, but active architects of their own future.',
      'Traditional education is crucial, but it often stops short of providing the hands-on, real-world experience necessary for entrepreneurial growth. A youth-led nonprofit like ours bridges this gap. We do not just teach theory; we provide tools and support for young people to do. They learn by designing, launching, selling, and earning.',
      'Who better to understand the needs and aspirations of young creators than young people themselves? Our team works to ensure that CreatorLaunch remains authentic and relevant. This built-in understanding allows us to create programs that resonate with our audience and foster a sense of ownership and community.',
      'The impact of a youth-led nonprofit extends beyond immediate program outcomes. By placing leadership in the hands of young people, we are helping cultivate the next generation of social innovators, business leaders, and community builders.',
      'These are not just business skills. They are life skills that will empower students in any path they choose.',
    ],
    ctaText: 'Explore CreatorLaunch',
    ctaHref: '/about',
  },
];

export const getBlogPostBySlug = (slug?: string) => {
  return blogPosts.find((post) => post.slug === slug);
};
