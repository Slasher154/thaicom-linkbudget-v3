const axios = require('axios')
require('dotenv').config()
const path = require('path')
module.exports = {
  /*
  ** Headers of the page
  */
  dev: (process.env.NODE_ENV !== 'production'), // true when 'npm run dev', false when 'npm run build' then 'npm start'
  // only environment variables set in here can be accessed with process.env.xx inside the rest of the code
  env: {
    apiUrl: process.env.API_URL,
    baseUrl: process.env.BASE_URL
  },
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
      { rel: 'stylesheet', href: 'https://cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css' }, // Material
      { rel: 'stylesheet', href: 'https://unpkg.com/vue-multiselect@2.0.0/dist/vue-multiselect.min.css' }

    ]
  },
  modules: ['nuxt-oauth'],
  oauth: {
    sessionName: 'mySession',
    secretKey: 'mykey',
    oauthHost: 'https://poseidon.thaicom.net/connect',
    oauthClientID: process.env.CLIENT_ID,
    oauthClientSecret: process.env.CLIENT_SECRET,
    fetchUser: async (accessToken) => {
      let config = { headers: { 'authorization': 'Bearer ' + accessToken } }
      try {
        let user = await axios.get('https://poseidon.thaicom.net/account/Userinfo', config)
        if (user) {
          console.log(`${user.data.name} ${user.data.family_name} successfully logs into the system.`)
          return user.data
        } else {
          console.log(`No user found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    onLogout: (req, res) => {
      console.log(`User is successfully logged out.`)
    },
    testMode: false
  },
  plugins: [
    '~plugins/axios',
    '~plugins/buefy',
    '~plugins/filters',
    '~plugins/googlemaps',
    '~plugins/mixins',
    '~plugins/moment',
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
    // Comment this out due to when assigning fetchUser in Oauth2 settings it causes an "Cannot assign to read only property 'exports' of object '#<Object>'" error in axios.js plugins
    // vendor: ['axios'], // https://nuxtjs.org/guide/plugins/
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      // Fix the npm run build error >> https://github.com/xkjyeah/vue-google-maps/issues/268
      config.module.rules.splice(0, 0, {
        test: /\.js$/,
        include: [path.resolve(__dirname, './node_modules/vue2-google-maps')],
        loader: 'babel-loader'
      })
    },
    // Add this to remove buefy css warning as discussed in https://github.com/rafaelpimpa/buefy/issues/306
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    }
  }
}
