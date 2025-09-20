/** @type {import('next').NextConfig} */
// ################## ----- NEXT.JS CONFIGURATION ----- ##################
// Configuration file for Next.js build and runtime settings
// Defines React strict mode, image domains, and experimental features
// ####################################################################
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for better debugging
  images: {
    domains: ['localhost'], // Add image domains here when needed
  },
  trailingSlash: false, // Don't add trailing slashes to URLs
  
  // API rewrites for development (optional - direct API calls are preferred)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/:path*`,
      },
    ];
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
