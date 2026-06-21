export interface NgpfGame {
  slug: string;
  name: string;
  activity: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  extraDisclaimer?: string;
}

export const ngpfDisclaimer =
  'Game courtesy of Next Gen Personal Finance (NGPF). This game is shared under a Creative Commons BY-NC 3.0 license and is not endorsed or sponsored by Next Gen Personal Finance.';

export const ngpfGames: NgpfGame[] = [
  {
    slug: 'shady-sams-slick-wheels',
    name: "Shady Sam’s Slick Wheels",
    activity: 'Buying a Car',
    description:
      'Learn shady sales tactics as you help car buyers find the best deal - for the dealership.',
    extraDisclaimer:
      'Shady Sam is an over-the-top cartoon villain designed to teach you about sneaky sales tricks. Most car salespeople aren’t this bad, but knowing these tactics helps you become a smarter buyer!',
    embedUrl: 'https://shadysamslickwheels.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/Slickwheels_2x.gif',
  },
  {
    slug: 'money-magic',
    name: 'Money Magic',
    activity: 'Budgeting',
    description:
      'Help Enzo manage his budget, reach his savings goal, and make it to Vegas.',
    embedUrl: 'https://playmoneymagic.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/moneymagic_2x.gif',
  },
  {
    slug: 'bummer',
    name: 'Bummer!',
    activity: 'Insurance',
    description:
      'Can you select insurance to help you survive a few spins on the dreaded Wheel of Bummers?',
    embedUrl: 'https://thebummergame.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/Bummer_2x.gif',
  },
  {
    slug: 'influencd',
    name: 'Influenc’d',
    activity: 'Entrepreneurship',
    description:
      'Find out what it’s like to be an entrepreneur through the lens of being an influencer.',
    embedUrl: 'https://playinfluencd.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/Influencd_2x.gif',
  },
  {
    slug: 'build-your-stax',
    name: 'Build your $TAX',
    activity: 'Investing',
    description:
      'See the consequences of 20 years of investing decisions in just 20 minutes.',
    embedUrl: 'https://buildyourstax.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/stax_2x.gif',
  },
  {
    slug: 'credit-clash',
    name: 'Credit Clash',
    activity: 'Managing Credit',
    description:
      'Battle your way to the perfect credit score. May the cards be in your favor.',
    embedUrl: 'https://creditclash.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/creditclash_2x.gif',
  },
  {
    slug: 'spent',
    name: 'SPENT',
    activity: 'Budgeting',
    description:
      'Living paycheck to paycheck is stressful. Can you make it through the month?',
    embedUrl: 'https://playspent.org/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/spent_2x.gif',
  },
  {
    slug: 'shady-sam',
    name: 'Shady Sam',
    activity: 'Types of Credit',
    description:
      'Students will learn the “tricks of the loan trade” as they play the role of a loan shark and try to maximize their profits.',
    embedUrl: 'https://shadysam.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/shadysam_2x.gif',
  },
  {
    slug: 'the-uber-game',
    name: 'The Uber Game',
    activity: 'Career',
    description:
      'Can you make it as an Uber driver with two kids to support and a mortgage payment due in a week?',
    embedUrl: 'https://ig.ft.com/uber-game/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/Uber_2x.gif',
  },
  {
    slug: 'cat-insanity',
    name: 'Cat Insanity',
    activity: 'Managing Credit',
    description:
      'When it comes to debt, how do you get kids to care about things like interest rates, compounding and minimum payments?',
    embedUrl: 'https://playcatinsanity.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/web/arcade-games/hover/catinsanity_2x.gif',
  },
  {
    slug: 'crypto-craze',
    name: 'Crypto Craze',
    activity: 'Cryptocurrency',
    description:
      'Pick the right cryptocurrencies and build your fortune, or lose it all.',
    embedUrl: 'https://playcryptocraze.com/',
    thumbnailUrl:
      'https://d3f7q2msm2165u.cloudfront.net/aaa-content/user/files/arcade/CryptoCraze2:8:23.jpg',
  },
];

export const getNgpfGameBySlug = (slug?: string) => {
  return ngpfGames.find((game) => game.slug === slug);
};