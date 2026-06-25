/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://iframe.mediadelivery.net https://player.mediadelivery.net https://payhip.com https://*.payhip.com; connect-src 'self' https://payhip.com https://*.payhip.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://payhip.com https://*.payhip.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://payhip.com https://*.payhip.com;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
