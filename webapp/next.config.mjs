/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
      if (!isServer) {
          // Fixes npm packages that depend on `fs` module
          config.resolve.fallback.fs = false;
      }

      config.module.rules.push({
          test: /\.node$/,
          use: 'node-loader',
      });

      return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["humble-barnacle-x4pwjjrj7g9hxx4-3000.app.github.dev"],
    },
  },
}


export default nextConfig