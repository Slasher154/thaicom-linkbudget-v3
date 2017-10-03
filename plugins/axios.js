/**
 * Created by thanatv on 9/26/17.
 */

// import Vue from 'vue'
import axios from 'axios'

// Import and set nuxt.js options
let config = require('../nuxt.config.js')

axios.defaults.baseURL = config.dev ? 'http://localhost:23324/v1' : 'http://http://linkcalc-api.thaicom.net/v1'

// var myAxios = axios.create({
//   baseURL: config.dev ? 'http://localhost:23324/v1' : 'http://http://linkcalc-api.thaicom.net/v1'
// })
//
// // Prototype the custom axios instance into Vue >> https://stackoverflow.com/questions/41879928/switching-from-vue-resource-to-axios
// Vue.prototype.$http = myAxios
