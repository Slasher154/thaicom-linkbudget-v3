module.exports = {
  /*
  ** Headers of the page
  */
  dev: (process.env.NODE_ENV !== 'production'), // true when 'npm run dev', false when 'npm run build' then 'npm start'
  head: {
    title: 'thaicom-linkbudget-v3',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Thaicom Link Budget for Thaicom 4 and Maritime Projects v3' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  plugins: [
    '~plugins/axios',
    '~plugins/buefy'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: ['axios'], // https://nuxtjs.org/guide/plugins/
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
