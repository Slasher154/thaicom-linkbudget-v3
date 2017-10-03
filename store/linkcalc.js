/**
 * Created by thanatv on 9/26/17.
 */

import _ from 'lodash'

export const state = () => ({
  // Satellites
  satelliteOptions: [],
  selectedSatellites: [],

  // Transponders
  transponderOptions: [],
  filteredTransponders: [],
  selectedTransponders: [],

  // Gateway Antennas
  gatewayAntennaOptions: [],
  selectedGatewayAntennas: [],

  // Gateway Locations
  gatewayLocationOptions: [],
  selectedGatewayLocations: [],

  // Gateway HPAs
  selectedGatewayHpas: [],
  gatewayHpaOptions: [],

  // Gateway Stations
  gatewayStations: [],

  // Remote Antennas
  remoteAntennaOptions: [],
  selectedRemoteAntennas: [],

  // Remote Locations
  remoteLocationOptions: [],
  selectedRemoteLocations: [],

  // Remote BUCs
  remoteBucOptions: [],
  selectedRemoteBucs: [],

  // Remote Stations
  remoteStations: [],

  // Bandwidth
  selectedBandwidth: [],

  // Communication Mode ('1-way' or '2-way')
  communicationModeOptions: ['1-way', '2-way'],
  selectedCommunicationMode: '2-way',

  // Modem
  modemOptions: [],
  selectedModems: [],

  // Link Availability
  selectedLinkAvailabilities: [],

  // Max Mode
  isMaxMode: false,

  // Adjacent Satellite Interferences
  adjacentSatelliteTransponderOptions: [],
  selectedAdjacentSatelliteTransponders: []
})

export const getters = {
  filteredTransponders (state) {
    let satelliteNames = _.map(state.selectedSatellites, x => x.name)
    let filteredTransponders = state.transponderOptions.filter(tp => _.includes(satelliteNames, tp.satellite))

    // Return sorted transponders by satellite name, uplink beam name and uplink frequency
    return _.sortBy(filteredTransponders, ['satellite', 'uplink_beam', 'uplink_cf'])
  },
  gatewayStations (state) {
    return state.selectedGatewayHpas
  }
}

export const mutations = {
  SET_SATELLITE_OPTIONS (state, { satellites }) {
    state.satelliteOptions = satellites
  },
  SET_SELECTED_SATELLITES (state, { satellites }) {
    state.selectedSatellites = satellites
  },
  SET_TRANSPONDER_OPTIONS (state, { transponders }) {
    state.transponderOptions = transponders
  },
  SET_SELECTED_TRANSPONDERS (state, { transponders }) {
    state.selectedTransponders = transponders
  },
  SET_MODEM_OPTIONS (state, { modems }) {
    state.modemOptions = modems
  },
  GENERATE_GATEWAY_STATIONS (state) {
    let stations = []
    // Loop through selected gateway antennas, locations and HPA to form a combination of them
    // Ex. 2 Gateways, 2 Locations and 2 HPA will create 2*2*2 = 8 Gateway Stations
    state.selectedGatewayAntennas.forEach(gateway => {
      state.selectedGatewayLocations.forEach(location => {
        state.selectedGatewayHpas.forEach(hpa => {
          stations.push({ location, gateway, hpa })
        })
      })
    })
    state.gatewayStations = stations
  },
  UPDATE_GATEWAY_STATIONS (state, { stations }) {
    state.gatewayStations = stations
  },
  GENERATE_REMOTE_STATIONS (state) {
    let stations = []
    // Loop through selected remote antennas, locations, BUC and bandwidth to form a combination of them
    // Ex. 2 Gateways, 2 Locations and 2 BUCs and 2 Bandwidth will create 2*2*2*2 = 16 Remote Stations
    state.selectedRemoteAntennas.forEach(gateway => {
      state.selectedRemoteLocations.forEach(location => {
        state.selectedRemoteBucs.forEach(hpa => {
          state.selectedBandwidth.forEach(bandwidth => {
            stations.push({location, gateway, hpa, bandwidth})
          })
        })
      })
    })
    state.gatewayStations = stations
  },
  UPDATE_REMOTE_STATIONS (state, { stations }) {
    state.remoteStations = stations
  }
}

export const actions = {
  // This action expected { satellites: [] } as a payload
  setSatelliteOptions ({ commit }, satellites) {
    commit('SET_SATELLITE_OPTIONS', satellites)
  },
  setSelectedSatellites ({ commit }, satellites) {
    commit('SET_SELECTED_SATELLITES', satellites)
  },
  setTransponderOptions ({ commit }, transponders) {
    commit('SET_TRANSPONDER_OPTIONS', transponders)
  },
  setSelectedTransponders ({ commit }, transponders) {
    commit('SET_SELECTED_TRANSPONDERS', transponders)
  },
  setModemOptions ({ commit }, modems) {
    commit('SET_MODEM_OPTIONS', modems)
  },
  // setSelectedModems({ commit }, modems) {
  //   commit('SET_SELECTED_MODEMS', modems)
  // }),
  generateGatewayStations ({ commit }) {
    commit('GENERATE_GATEWAY_STATIONS')
  },
  updateGatewayStations ({ commit }, stations) {
    commit('UPDATE_GATEWAY_STATIONS', stations)
  },
  generateRemoteStations ({ commit }) {
    commit('GENERATE_REMOTE_STATIONS')
  },
  updateRemoteStations ({ commit }, stations) {
    commit('UPDATE_REMOTE_STATIONS', stations)
  }
}
