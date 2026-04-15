/** @type {import('next').NextConfig} */

const PROD_ORIGIN = 'https://roastmycv.live';

const securityHeaders = [
  // Strict-Transport-Security — includeSubDomains + preload
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // Prevent MIME sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Cross-Origin-Opener-Policy — isolate browsing context
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  // Referrer policy — don't leak full URL to third parties
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Permissions policy — disable unused browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  // Content-Security-Policy
  // - default-src: self only
  // - script-src: self + framer-motion (inline eval needed) + Vercel Speed Insights
  // - style-src: self + unsafe-inline (Tailwind injects inline styles)
  // - img-src: self + data URIs (favicon SVG)
  // - connect-src: self + Anthropic API + Upstash REST + Vercel Speed Insights
  // - font-src: self + Google Fonts
  // - frame-ancestors: none (replaces X-Frame-Options for CSP-aware browsers)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self' https://api.anthropic.com https://*.upstash.io https://vitals.vercel-insights.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  // pdf-parse uses some Node.js-only features
  experimental: { serverComponentsExternalPackages: ['pdf-parse'] },

  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Restrict CORS on API routes to production origin only
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: PROD_ORIGIN },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
