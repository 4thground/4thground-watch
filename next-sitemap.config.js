module.exports = {
  siteUrl: 'https://watch.4thground.com',
  generateRobotsTxt: true,
  exclude: ['/checkout/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://watch.4thground.com/sitemap.xml',
    ],
  },
}
