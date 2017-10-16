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

  // Find best transponders from input locations
  findBestTransponders: false,

  // Adjacent Satellite Interferences
  adjacentSatelliteTransponderOptions: [],
  selectedAdjacentSatelliteTransponders: [],

  // Defined contours
  definedContours: ['Peak', '50%', 'EOC', 'EOC-2']
})

export const getters = {
  htsSatelliteSelected (state) {
    return state.selectedSatellites.filter(x => x.type === 'Broadband' || x.type === 'HTS').length > 0
  },
  filteredRemoteLocationOptions (state, getters) {
    let locationOptions = state.remoteLocationOptions
    // Add Peak, 50%, EOC, and EOC-2 option if selected satellites contains HTS
    if (getters.htsSatelliteSelected) {
      // construct an array of defined contours
      let definedContourOptions = state.definedContours.map(x => {
        return {
          name: x,
          type: 'definedContours'
        }
      })
      locationOptions = _.concat(definedContourOptions, locationOptions)
    }
    return locationOptions
  },
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
  SET_LOCATION_OPTIONS (state, { locations }) {
    state.gatewayLocationOptions = locations
    state.remoteLocationOptions = locations
  },
  SET_SELECTED_REMOTE_LOCATIONS (state, { locations }) {
    state.selectedRemoteLocations = locations
  },
  SET_REMOTE_ANTENNA_OPTIONS (state, { antennas }) {
    state.remoteAntennaOptions = antennas
  },
  SET_SELECTED_REMOTE_ANTENNAS (state, { antennas }) {
    state.selectedRemoteAntennas = antennas
  },
  SET_REMOTE_BUC_OPTIONS (state, { bucs }) {
    state.remoteBucOptions = bucs
  },
  SET_SELECTED_REMOTE_BUCS (state, { bucs }) {
    state.selectedRemoteBucs = bucs
  },
  ADD_SELECTED_BANDWIDTH (state, { bandwidth }) {
    state.selectedBandwidth.push(bandwidth)
  },
  REMOVE_SELECTED_BANDWIDTH (state, id) {
    _.remove(state.selectedBandwidth, x => x.id === id)
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
    state.selectedRemoteAntennas.forEach(antenna => {
      state.selectedRemoteLocations.forEach(location => {
        state.selectedRemoteBucs.forEach(hpa => {
          state.selectedBandwidth.forEach(bandwidth => {
            stations.push({location, antenna, hpa, bandwidth})
          })
        })
      })
    })
    state.remoteStations = stations
  },
  SET_REMOTE_STATIONS (state, { stations }) {
    state.remoteStations = stations
  },
  UPDATE_FIND_BEST_TRANSPONDERS (state, status) {
    state.findBestTransponders = status
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
  setLocationOptions ({ commit }, locations) {
    commit('SET_LOCATION_OPTIONS', locations)
  },
  setSelectedRemoteLocations ({ commit }, locations) {
    commit('SET_SELECTED_REMOTE_LOCATIONS', locations)
    commit('GENERATE_REMOTE_STATIONS')
  },
  setRemoteAntennaOptions ({ commit }, antennas) {
    commit('SET_REMOTE_ANTENNA_OPTIONS', antennas)
  },
  setSelectedRemoteAntennas ({ commit }, antennas) {
    commit('SET_SELECTED_REMOTE_ANTENNAS', antennas)
    commit('GENERATE_REMOTE_STATIONS')
  },
  setRemoteBucOptions ({ commit }, bucs) {
    commit('SET_REMOTE_BUC_OPTIONS', bucs)
  },
  setSelectedRemoteBucs ({ commit }, bucs) {
    commit('SET_SELECTED_REMOTE_BUCS', bucs)
    commit('GENERATE_REMOTE_STATIONS')
  },
  addSelectedBandwidth ({ commit }, bandwidth) {
    commit('ADD_SELECTED_BANDWIDTH', bandwidth)
    commit('GENERATE_REMOTE_STATIONS')
  },
  removeSelectedBandwidth ({ commit }, id) {
    commit('REMOVE_SELECTED_BANDWIDTH', id)
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
  setRemoteStations ({ commit }, stations) {
    commit('SET_REMOTE_STATIONS', stations)
  },
  updateFindBestTransponders ({ commit }, status) {
    commit('UPDATE_FIND_BEST_TRANSPONDERS', status)
  }
}
