import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // Enable React Strict Mode for development
  env: {
    NEXT_PUBLIC_REACT_STRICT_MODE: "true", // Set to "true" to enable React Strict Mode
  },
};

export default nextConfig;
