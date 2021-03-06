import colors from 'vuetify/es5/util/colors';

export default {
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: './plugins/mixins/user.js' },
    { src: './plugins/vue-signature-pad.js', ssr: true}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    '@nuxtjs/auth',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    https: false,
    baseURL: 'https://api.esad-gmbh.de/api'
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth/login', method: 'post', propertyName: 'token' },
          logout: { url: 'auth/logout', method: 'get' },
          user: false
        }
      }
    },
    plugins: [{ src: '~/plugins/auth.js', mode: 'client' }]
  },
  toast: {
    position: 'bottom-left',
    iconPack: 'fontawesome',
    keepOnHover: true,
    type: ['success', 'info', 'error'],
    duration: 3500,
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  *
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
