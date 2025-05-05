import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_CHAT_SYSTEM_PROMPT:
      process.env.CHAT_SYSTEM_PROMPT || process.env.NEXT_PUBLIC_CHAT_SYSTEM_PROMPT,
  },
};

export default nextConfig;
