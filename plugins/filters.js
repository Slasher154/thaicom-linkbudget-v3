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

Vue.filter('transformCoords', function (value, format) {
  if (format === 'latLon') {
    return `${value.lat},${value.lon}`
  } else if (format === 'lonLat') {
    return `${value.lon},${value.lat}`
  } else {
    return 'Invalid format'
  }
})

Vue.filter('transformToBandwidthText', function (value) {
  return `${value.forward}/${value.return} ${value.unit}`
})
