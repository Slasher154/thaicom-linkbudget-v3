/* eslint-disable spaced-comment */
/**
 * Created by thanatv on 12/7/17.
 */

import _ from 'lodash'
import pluralize from 'pluralize'

export const state = () => ({
  // All contour lines
  // Data structure of contour paths to fit in vue2-google-maps gmap-polygon library
  // paths: [
  //   [ {lat: 1.380, lng: 103.800}, {lat:1.380, lng: 103.810}, {lat: 1.390, lng: 103.810}, {lat: 1.390, lng: 103.800} ],
  //   [ {lat: 1.382, lng: 103.802}, {lat:1.382, lng: 103.808}, {lat: 1.388, lng: 103.808}, {lat: 1.388, lng: 103.802} ],
  // ]
  // From Vue Color Compact Picker
  colorChoices: ['#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'],
  forwardContours: [], // Google maps Polygons
  returnContours: [], // Google maps Polylines (using Polyline so it's able to show as dotted lines)
  // All places (markers)
  places: [],
  // Beam Labels
  beamLabels: [],
  // Forward Filter Fields
  forwardFilterFields: [
    'mcg', 'antenna', 'linkMargin'
  ],
  // Return Filter Fields
  returnFilterFields: [],
  // Selected options for forward and return link (MCG, antenna name, link margin, BUC)
  forwardCombinationFilters: {},
  returnCombinationFilters: {},
  // Contour categories
  forwardCategories: [],
  returnCategories: [],
  categories: [],
  strokeWeight: 1,
  placeLabels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
})

export const getters = {
  extractFieldsForSelector (state) {
    return (field, path) => {
      let fields = state[path + 'Contours'].map(c => {
        return c.properties[field]
      })
      return _.uniq(fields)
    }
  }
}

export const mutations = {
  SET_AND_CONVERT_GEOJSON_TO_VUE_GOOGLE_MAPS (state, {geojsonObjects, path}) {
    console.log(JSON.stringify(geojsonObjects))
    // state[path + 'Contours'] = geojsonObjects.map(x => convertGeojsonContourToVueGoogleMaps(x, path, state.categories))
    // Push new contours
    geojsonObjects.map(x => convertGeojsonContourToVueGoogleMaps(x, path, state.categories)).forEach(y => {
      state[path + 'Contours'].push(y)
    })
  },
  ADD_GEOJSON_TO_MAP (state, {geojsonObjects, path, color}) {
    geojsonObjects.forEach(obj => {
      obj.color = color
    })
    let contours = geojsonObjects.map(convertGeojsonContourToVueGoogleMaps)
    Object.assign(state[path + 'Contours'], contours)
  },
  GENERATE_BEAM_LABELS (state, path) {
    state.beamLabels = []
    // Loop all contours and get unique beam name, peak latitude and peak longitude
    let allContours = _.concat(state.forwardContours, state.returnContours)
    let uniqueBeamLabels = _.uniqBy(allContours.map(c => {
      return {
        position: {
          lat: c.properties.peakLatitude - 0.3,
          lng: c.properties.peakLongitude
        },
        text: c.properties.name,
        showOnMap: true
      }
    }), (p) => p.text)
    state.beamLabels = uniqueBeamLabels
  },
  SET_PLACES (state, {places}) {
    state.places = places
  },
  ADD_NEW_PLACE (state, place) {
    let currentMaximumIndex = 0
    let places = state.places
    if (places.length > 0) {
      // Find the maximum index of current place, then add by one
      currentMaximumIndex = _.max(places.map(c => c.index))
      currentMaximumIndex++
    }
    places.push({
      name: place.name,
      index: currentMaximumIndex,
      position: place.position,
      showOnMap: place.showOnMap,
      label: state.placeLabels[currentMaximumIndex % state.placeLabels.length]
    })
  },
  SET_COMBINATION_FILTERS (state, {path, parameter, value}) {
    console.log(`Updating ${path} ${parameter} to ${JSON.stringify(value)}`)
    state[path + 'CombinationFilters'][parameter] = value
  },
  CONSTRUCT_CONTOUR_CATEGORIES (state, path) {
    // Empty the current array
    state[path + 'Categories'] = []
    let count = 1
    let param = path + 'CombinationFilters'
    for (let mcg of state[param].mcgs) {
      for (let antenna of state[param].antennas) {
        for (let linkMargin of state[param].linkMargins) {
          state[path + 'Categories'].push({
            mcg,
            antenna,
            linkMargin,
            name: `${mcg} - ${antenna} - ${linkMargin} dB`,
            color: state.colorChoices[(count % state.colorChoices.length) - 1],
            index: count++,
            showOnMap: true
          })
        }
      }
    }
  },
  VISUALIZE_CONTOURS (state, path) {
    // Find the matching category to set the color
    state[path + 'Contours'].forEach(contour => {
      let matchedCategory = findCategory(state[path + 'Categories'], contour, state[path + 'FilterFields'])
      contour.options.strokeColor = matchedCategory.color
    })
  },
  REFRESH_CONTOUR_VISIBILITY (state, path) {
    // Check whether each category should be shown on map or not based on selected filter
    state[path + 'Categories'].forEach(category => {
      let filterFields = state[path + 'FilterFields']
      category.showOnMap = _.every(filterFields.map(field => {
        return _.includes(state[path + 'CombinationFilters'][pluralize(field)], category[field])
      }))
    })
    // Loop all contours and updates its visibility based on its category visibility
    state[path + 'Contours'].forEach(contour => {
      contour.showOnMap = findCategory(state[path + 'Categories'], contour, state[path + 'FilterFields']).showOnMap
    })
    // // Loop all contours to check if the changed parameter is still being selected or not
    // state[path + 'Contours'].forEach(contour => {
    //   if (_.includes(value, contour.properties[parameter])) {
    //     console.log(`${parameter} ${contour.properties[parameter]} is included in ${JSON.stringify(value)}. Show it`)
    //     contour.showOnMap = true
    //   } else {
    //     console.log(`${parameter} ${contour.properties[parameter]} is not included in ${JSON.stringify(value)}. Hide it`)
    //     contour.showOnMap = false
    //   }
    // })
  },
  TOGGLE_BEAM_LABELS (state, showLabel) {
    state.beamLabels.forEach(label => {
      label.showOnMap = showLabel
    })
  },
  // Add a new category into this map, to keep track of its color and display as map legends
  ADD_NEW_CATEGORY (state, name) {
    let currentMaximumIndex = 0
    let categories = state.categories
    // Check if category name is not already existed, we push it to new category
    if (!categories.find(c => c.name === name)) {
      if (categories.length > 0) {
        currentMaximumIndex = _.max(categories.map(c => c.index))
        currentMaximumIndex++
      }
      categories.push({
        name,
        color: state.colorChoices[currentMaximumIndex % state.colorChoices.length],
        index: currentMaximumIndex
      })
    }
  },
  // Remove all categories
  REMOVE_ALL_CATEGORIES (state) {
    state.categories = []
  },
  REMOVE_ALL_CONTOURS (state) {
    state.forwardContours = []
    state.returnContours = []
  },
  REMOVE_ALL_PLACES (state) {
    state.places = []
  },
  REMOVE_ALL_BEAM_LABELS (state) {
    state.beamLabels = []
  },
  SET_CATEGORY_NAME (state, {index, name}) {
    let categoryToEdit = state.categories.find(c => c.index === index)
    categoryToEdit.name = name
  }
}

export const actions = {
  setAndConvertGeojsonToVueGoogleMaps ({commit}, geojsonObjects) {
    commit('SET_AND_CONVERT_GEOJSON_TO_VUE_GOOGLE_MAPS', geojsonObjects)
    commit('GENERATE_BEAM_LABELS', geojsonObjects.path)
  },
  changeCombinationFilters ({commit}, options) { // Trigger when users select dropdown to change contour shown on map
    commit('SET_COMBINATION_FILTERS', options) // Set the value of the changed filters to the new value
    options.parameter = pluralize.singular(options.parameter)
    commit('REFRESH_CONTOUR_VISIBILITY', options.path) // Trigger contour visibility due to filter changed
  },
  setPlaces ({commit}, places) {
    commit('SET_PLACES', places)
  },
  addNewPlaces ({commit}, places) {
    places.forEach(p => commit('ADD_NEW_PLACE', p))
  },
  addEocLines ({commit}, geojsonObjects) {
    geojsonObjects.color = '#FE9200'
    commit('ADD_GEOJSON_TO_MAP', geojsonObjects)
  },
  addFarthestLines ({commit}, geojsonObjects) {
    geojsonObjects.color = '#FCDC00'
    commit('ADD_GEOJSON_TO_MAP', geojsonObjects)
  },
  setupFiltersAndCategories ({commit, getters, state}, path) {
    state[path + 'FilterFields'].forEach(parameter => {
      commit('SET_COMBINATION_FILTERS', {
        path,
        parameter: pluralize(parameter),
        value: getters.extractFieldsForSelector(parameter, path)
      })
    })
    // Create contour categories
    commit('CONSTRUCT_CONTOUR_CATEGORIES', path)
    // Set the visual options of the contour lines based on newly created categories
    commit('VISUALIZE_CONTOURS', path)
  },
  addNewCategory ({commit}, category) {
    commit('ADD_NEW_CATEGORY', category)
  },
  addNewCategories ({commit}, categories) {
    categories.forEach(c => commit('ADD_NEW_CATEGORY', c))
  },
  setContours ({commit}, geojsonObjects) {
    // Divide contours into forward and return
    let paths = ['forward', 'return']
    paths.forEach(p => {
      let filteredContours = geojsonObjects.filter(g => g.properties.path === p)
      //console.log(JSON.stringify(filteredContours))
      if (filteredContours.length > 0) {
        commit('SET_AND_CONVERT_GEOJSON_TO_VUE_GOOGLE_MAPS', {
          geojsonObjects: filteredContours,
          path: p
        })
      }
    })
    // Generate beam labels
    commit('GENERATE_BEAM_LABELS')
  },
  removeAllPlaces ({commit}) {
    commit('REMOVE_ALL_PLACES')
  },
  removeAllContours ({commit}) {
    commit('REMOVE_ALL_CATEGORIES')
    commit('REMOVE_ALL_CONTOURS')
    commit('REMOVE_ALL_BEAM_LABELS')
  },
  setCategoryName ({commit}, category) {
    commit('SET_CATEGORY_NAME', category)
  },
  resetMap ({commit}) {
    commit('REMOVE_ALL_CATEGORIES')
    commit('REMOVE_ALL_CONTOURS')
    commit('REMOVE_ALL_BEAM_LABELS')
    commit('REMOVE_ALL_PLACES')
  },
  toggleBeamLabels ({commit}, showLabel) {
    commit('TOGGLE_BEAM_LABELS', showLabel)
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
function convertGeojsonContourToVueGoogleMaps (geojsonContour, path = 'forward', categories = []) {
  try {
    // console.log(`geo contour = ${JSON.stringify(geojsonContour, undefined, 2)}`)
    // If it's forward contour, the contours are polygon and 'paths' property will be used
    // If it's return contour, the contours are polyline and 'path' property will be used
    let pathProperty = path === 'forward' ? 'paths' : 'path'
    let googleMapPath = convertGeojsonPolygonCoordinatesToPaths(geojsonContour.geometry.coordinates, path)
    // Find the color from geojson property and category color
    let color = categories.find(c => c.name === geojsonContour.properties.category).color
    let pathObject = {
      options: constructPolygonOptions(color, path),
      properties: geojsonContour.properties,
      showOnMap: true
    }
    pathObject[pathProperty] = googleMapPath
    return pathObject
  } catch (e) {
    return false
  }
}

function constructPolygonOptions (color = '#FF0000', path = 'forward') {
  // Returns solid polygon options for forward link
  if (path === 'forward') {
    return {
      strokeColor: color,
      strokeWeight: 2,
      fillOpacity: 0
    }
  } else {
    // Returns dashed polyline options for return link
    let lineSymbol = {
      path: 0, // a dot
      fillOpacity: 1
    }
    let options = {
      strokeOpacity: 0,
      strokeColor: color,
      strokeWeight: 1,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '5px'
      }]
    }
    return options
  }
}

// Source: https://github.com/xkjyeah/vue-google-maps/blob/vue2/examples/polygon-editing-geojson.html
function convertGeojsonPolygonCoordinatesToPaths (polygonCoordinates, path = 'forward') {
  // console.log(`Ring = ${JSON.stringify(polygonCoordinates)}`)
  // return polygonCoordinates[0].map(ring =>
  //   ring.slice(0, ring.length - 1)
  //     .map(([lng, lat]) => ({lat, lng}))
  // )
  // Return polygons paths if it's forward
  if (path === 'forward') {
    return polygonCoordinates.map(rings => {
      return rings.map(ring => {
        return {
          lat: ring[1],
          lng: ring[0]
        }
      })
    })
    // Return polyline if it's return
  } else {
    return polygonCoordinates[0].map(ring => {
      return {
        lat: ring[1],
        lng: ring[0]
      }
    })
  }
}

function findCategory (arrayOfCategories, contourObject, filterFields) {
  let matchedCategory = arrayOfCategories.find(category => {
    return _.every(filterFields.map(field => {
      return category[field] === contourObject.properties[field]
    }))
  })
  return matchedCategory
}

// https://stackoverflow.com/questions/26703700/dynamic-nested-for-loops-to-be-solved-with-recursion
// function createCombinations (fields, currentCombinations) {
//   // prevent side-effects
//   let tempFields = fields.slice()
//
//   // recursively build a list combinations
//   let delimiter = ' | '
//   if (!tempFields || tempFields.length === 0) {
//     return currentCombinations
//   } else {
//     let combinations = []
//     let field = tempFields.pop()
//
//     for (let valueIndex = 0; valueIndex < field.length; valueIndex++) {
//       let valueName = field[valueIndex]
//
//       if (!currentCombinations || currentCombinations.length === 0) {
//         // let combinationName = valueName
//         let combinationName = {
//           value99: valueName
//         }
//         combinations.push(combinationName)
//       } else {
//         for (let combinationIndex = 0; combinationIndex < currentCombinations.length; combinationIndex++) {
//           let currentCombination = currentCombinations[combinationIndex]
//           // let combinationName = valueName + delimiter + currentCombination
//           let combinationName = _.cloneDeep(currentCombination)
//           combinationName['value' + combinationIndex] = valueName
//           combinations.push(combinationName)
//         }
//       }
//     }
//     return createCombinations(tempFields, combinations)
//   }
// }
