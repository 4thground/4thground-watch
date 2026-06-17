/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://gumroad.com https://*.gumroad.com; frame-src 'self' https://iframe.mediadelivery.net https://player.mediadelivery.net https://gumroad.com https://*.gumroad.com; connect-src 'self' https://gumroad.com https://*.gumroad.com https://api.gumroad.com; img-src 'self' https: data:;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
