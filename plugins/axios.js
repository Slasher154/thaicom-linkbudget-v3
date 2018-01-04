/**
 * Created by thanatv on 9/26/17.
 */

// import Vue from 'vue'
import axios from 'axios'

// apiUrl is set from env properties in nuxt.config.js
axios.defaults.baseURL = process.env.apiUrl
