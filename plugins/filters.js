/**
 * Created by thanatv on 9/28/17.
 */

import Vue from 'vue'

Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
})

Vue.filter('wrap', function (value, begin, end) {
  return begin + value + end
})
