/**
 * Created by thanatv on 9/26/17.
 */

import Vue from 'vue'
import axios from 'axios'

// Import and set nuxt.js options
let config = require('../nuxt.config.js')

var myAxios = axios.create({
  baseURL: config.dev ? 'https://jsonplaceholder.typicode.com' : 'http://localhost:24444'
})

// Prototype the custom axios instance into Vue >> https://stackoverflow.com/questions/41879928/switching-from-vue-resource-to-axios
Vue.prototype.$http = myAxios
