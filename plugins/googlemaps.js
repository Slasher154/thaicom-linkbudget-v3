/**
 * Created by thanatv on 10/11/17.
 */

import Vue from 'vue'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDthuAAkP9IYaN7Cr8M32fYk6-O_adwD2k',
    v: '3.29',
    libraries: 'places'
  }
})
