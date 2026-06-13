import type { MetadataRoute } from 'next';

const BASE_URL = 'https://fundibot.qwabi.co.za';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Traditional + AI search crawlers are all explicitly welcome.
      // Googlebot, Bingbot, PerplexityBot, ChatGPT-User, GPTBot,
      // ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, etc.
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
