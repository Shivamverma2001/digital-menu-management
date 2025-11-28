/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/**",
      },
      // Vercel Blob Storage
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Allow any HTTPS image URLs (for user-uploaded images)
      {
        protocol: "https",
        hostname: "**",
      },
      // Allow HTTP images (for development/testing)
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default config;
