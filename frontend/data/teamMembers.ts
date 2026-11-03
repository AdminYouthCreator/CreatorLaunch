export interface CreatorLaunchPerson {
  slug: string;
  name: string;
  role: string;
  organizationTitle?: string;
  email?: string;
  image: string;
  shortDescription: string;
  extendedDescription: string;
  group: 'team' | 'board';
}

export const teamMembers: CreatorLaunchPerson[] = [
  {
    slug: 'qwentin-blassingame',
    name: 'Qwentin Blassingame',
    role: 'Founder & Executive Director',
    group: 'team',
    email: 'qwentin@youthcreatorlaunch.org',
    image: '/assets/qwentin-pfp.png',
    shortDescription:
      'Founder of CreatorLaunch, focused on youth entrepreneurship, technology, nonprofit growth, and building real launch opportunities for young creators.',
    extendedDescription:
      'Qwentin Blassingame founded CreatorLaunch after seeing how many young people have ideas but not enough access to real entrepreneurship tools, support, or launch opportunities. As Founder and Executive Director, Qwentin leads the vision, partnerships, platform development, programming direction, and community strategy for CreatorLaunch. His work is centered on making entrepreneurship feel possible for students before adulthood, especially through hands-on workshops, youth-led programming, and digital tools that help young creators build something real.',
  },
  {
    slug: 'aereon-robinson',
    name: 'Aereon Robinson',
    role: 'Co-Founder & Executive Manager',
    group: 'team',
    email: 'aereon@youthcreatorlaunch.org',
    image: '/assets/aereon-pfp.jpeg',
    shortDescription:
      'Co-Founder and operations leader helping CreatorLaunch grow responsibly while supporting meaningful youth-centered programming.',
    extendedDescription:
      'Aereon Robinson supports CreatorLaunch through operations, strategy, and program execution. As Co-Founder and Executive Manager, Aereon helps make sure the organization runs smoothly and that programs are structured to create real value for young people. He brings experience in youth-focused nonprofit leadership and community-centered work, helping CreatorLaunch stay grounded in impact, responsibility, and practical support for students.',
  },
  {
    slug: 'rose-blassingame',
    name: 'Rose Blassingame',
    role: 'Financial Manager',
    group: 'team',
    email: 'rose@youthcreatorlaunch.org',
    image: '/assets/rose-pfp.png',
    shortDescription:
      'Financial Manager supporting CreatorLaunch’s responsible growth, budgeting, sustainability, and long-term community impact.',
    extendedDescription:
      'Rose Blassingame supports the financial side of CreatorLaunch, helping the organization think carefully about sustainability, budgeting, responsible spending, and long-term impact. As Financial Manager, Rose helps keep CreatorLaunch grounded as it grows, making sure resources are used to support the mission and expand opportunities for young entrepreneurs.',
  },
];

export const boardMembers: CreatorLaunchPerson[] = [
  {
    slug: 'jack-krewson',
    name: 'Jack Krewson',
    role: 'Board Member',
    organizationTitle: 'Founder & CEO, Kairos Academies',
    group: 'board',
    image:
      'https://static.wixstatic.com/media/07d0bd_4c4ee9b7adce46dbab8ad2e33241549b~mv2.jpg/v1/fill/w_544,h_544,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-empty-state_edited.jpg',
    shortDescription:
      'Founder and CEO of Kairos Academies, with 10 years in education and experience building a St. Louis nonprofit charter school from the ground up.',
    extendedDescription:
      'Jack Krewson is the Founder and CEO of Kairos Academies and a lifelong St. Louis resident. Over 10 years in education, he built a nonprofit charter school from the ground up. He brings experience in entrepreneurship, nonprofit leadership, finance, fundraising, governance, communications, and program design. On the CreatorLaunch board, Jack focuses on clear governance and a practical strategic plan that keeps programming and fundraising aligned. He is drawn to CreatorLaunch’s belief that students can build and lead organizations of their own.',
  },
];

export const creatorLaunchPeople = [...teamMembers, ...boardMembers];
