/**
 * Created by thanatv on 12/7/17.
 */

// import _ from 'lodash'

export const state = () => ({
  // All contour lines
  // Data structure of contour paths to fit in vue2-google-maps gmap-polygon library
  // paths: [
  //   [ {lat: 1.380, lng: 103.800}, {lat:1.380, lng: 103.810}, {lat: 1.390, lng: 103.810}, {lat: 1.390, lng: 103.800} ],
  //   [ {lat: 1.382, lng: 103.802}, {lat:1.382, lng: 103.808}, {lat: 1.388, lng: 103.808}, {lat: 1.388, lng: 103.802} ],
  // ]
  contours: [],
  // All places (markers)
  places: []
})

// export const getters = {
//   htsSatelliteSelected (state) {
//     return state.selectedSatellites.filter(x => x.type === 'Broadband' || x.type === 'HTS').length > 0
//   }
// }

export const mutations = {
  SET_AND_CONVERT_GEOJSON_TO_VUE_GOOGLE_MAPS (state, { geojsonObjects }) {
    state.contours = geojsonObjects.map(convertGeojsonContourToVueGoogleMaps)
  }
}

export const actions = {
  setAndConvertGeojsonToVueGoogleMaps ({ commit }, geojsonObjects) {
    commit('SET_AND_CONVERT_GEOJSON_TO_VUE_GOOGLE_MAPS', geojsonObjects)
  }
}

// {
//   "_id" : ObjectId("5a0bf46387be03713b007be1"),
//   "__v" : 0,
//   "type" : "Feature",
//   "geometry" : {
//   "coordinates" : [
//     [
//       [
//         107.71,
//         17.457
//       ],
//
//     ]
//   ],
//     "type" : "Polygon"
// },
//   "properties" : {
//   "peakLongitude" : 107.5,
//     "peakLatitude" : 17.2,
//     "parameter" : "eirp",
//     "path" : "forward",
//     "name" : "206",
//     "satellite" : "Thaicom 4",
//     "relativeGain" : -0.1
// }
// }
function convertGeojsonContourToVueGoogleMaps (geojsonContour) {
  try {
    // console.log(`geo contour = ${JSON.stringify(geojsonContour, undefined, 2)}`)
    return {
      path: convertGeojsonPolygonCoordinatesToPaths(geojsonContour.geometry.coordinates),
      options: constructPolygonOptions(),
      properties: geojsonContour.properties,
      showOnMap: true
    }
  } catch (e) {
    return false
  }
}

function constructPolygonOptions () {
  return {
    strokeColor: '#FF0000',
    strokeWeight: 2,
    fillOpacity: 0
  }
}

// Source: https://github.com/xkjyeah/vue-google-maps/blob/vue2/examples/polygon-editing-geojson.html
function convertGeojsonPolygonCoordinatesToPaths (polygonCoordinates) {
  // console.log(`Ring = ${JSON.stringify(polygonCoordinates)}`)
  // return polygonCoordinates[0].map(ring =>
  //   ring.slice(0, ring.length - 1)
  //     .map(([lng, lat]) => ({lat, lng}))
  // )
  return polygonCoordinates[0].map(ring => {
    return {
      lat: ring[1],
      lng: ring[0]
    }
  })
}
