/**
 * Created by thanatv on 12/7/17.
 */

// import _ from 'lodash'

export const state = () => ({
  // All contour lines
  contours: [],
  // All places (markers)
  places: []
})

export const getters = {
  htsSatelliteSelected (state) {
    return state.selectedSatellites.filter(x => x.type === 'Broadband' || x.type === 'HTS').length > 0
  }
}

export const mutations = {
  SET_REQUEST_NAME (state, name) {
    state.requestName = name
  }
}

export const actions = {
  setRequestName ({ commit }, name) {
    commit('SET_REQUEST_NAME', name)
  }
}
