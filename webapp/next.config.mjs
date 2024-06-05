/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        allowedOrigins: ['*.domain.com', 'domain.com', 'mysubdomain.domain.com'],
      },
    },
  };
  
  export default nextConfig;
  