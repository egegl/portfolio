import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Expose CHAT_SYSTEM_PROMPT from .env.local to client-side code _with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_CHAT_SYSTEM_PROMPT: process.env.CHAT_SYSTEM_PROMPT,
  },
};

export default nextConfig;
