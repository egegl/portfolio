import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Only expose safe environment variables to client-side code!
  // DO NOT expose Together API key or any secrets here.
  env: {
    // Make the chat system prompt available for both client/server.
    NEXT_PUBLIC_CHAT_SYSTEM_PROMPT: process.env.CHAT_SYSTEM_PROMPT,
  },
};

export default nextConfig;
