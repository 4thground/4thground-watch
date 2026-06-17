/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://gumroad.com https://*.gumroad.com https://iframe.mediadelivery.net https://player.mediadelivery.net; connect-src 'self' https://gumroad.com https://*.gumroad.com https://api.gumroad.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
