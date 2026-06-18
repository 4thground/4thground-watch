/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://js.paystack.co https://checkout.paystack.com https://iframe.mediadelivery.net https://player.mediadelivery.net; connect-src 'self' https://api.paystack.co https://checkout.paystack.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
