/** @type {import('next').NextConfig} */
// ################## ----- NEXT.JS CONFIGURATION ----- ##################
// Configuration file for Next.js build and runtime settings
// Defines React strict mode, image domains, and experimental features
// ####################################################################
const businessProgramOrigin = process.env.BUSINESS_PROGRAM_ORIGIN
  || 'https://creatorlaunch-student-business.creatorlaunc-8659.chatgpt.site';

const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for better debugging
  images: {
    domains: ['localhost'], // Add image domains here when needed
  },
  trailingSlash: false, // Don't add trailing slashes to URLs
  
  // API rewrites for development (optional - direct API calls are preferred)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/business-program',
          destination: `${businessProgramOrigin}/_main/login`,
        },
        {
          source: '/business-program/login',
          destination: `${businessProgramOrigin}/_main/login`,
        },
        {
          source: '/business-program/portal',
          destination: `${businessProgramOrigin}/_main/portal`,
        },
        {
          source: '/business-program/training',
          destination: `${businessProgramOrigin}/_main/training`,
        },
        {
          source: '/api/business-program/:path*',
          destination: `${businessProgramOrigin}/api/:path*`,
        },
      ],
      afterFiles: [
        {
          source: '/api/:path((?!boardapplication-proxy(?:/|$)).*)',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/:path*`,
        },
      ],
      fallback: [],
    };
  },
  
  // CORS headers for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
