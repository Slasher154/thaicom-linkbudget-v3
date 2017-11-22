module.exports = {
  /*
  ** Headers of the page
  */
  dev: (process.env.NODE_ENV !== 'production'), // true when 'npm run dev', false when 'npm run build' then 'npm start'
  head: {
    title: 'CSD LB',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Thaicom Link Budget for Thaicom 4 and Maritime Projects v3' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' }, // Font Awesome
      { rel: 'stylesheet', href: 'https://unpkg.com/vue-multiselect@2.0.0/dist/vue-multiselect.min.css' }

    ]
  },
  /*
  modules: ['nuxt-oauth'],
  oauth: {
    sessionName: 'mySession',
    secretKey: 'mykey',
    oauthHost: 'https://poseidon.thaicom.net/connect/token',
    oauthClientID: process.env.OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
    testMode: true
  },
  */
  plugins: [
    '~plugins/axios',
    '~plugins/buefy',
    '~plugins/filters',
    '~plugins/googlemaps',
    '~plugins/mixins',
    { src: '~/plugins/handsontable', ssr: false }
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
