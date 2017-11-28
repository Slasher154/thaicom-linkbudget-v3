/**
 * Created by thanatv on 9/26/17.
 */

import _ from 'lodash'

export const state = () => ({

  // Request Information
  requestName: '',

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

  // Modem and MCGs
  selectedModemsAndMcgs: [],

  // Default Gateway
  useDefaultGateway: true,

  // Link Availability
  selectedLinkAvailabilities: [],

  // Max Mode
  maxMode: false,

  // Finding Max Coverage
  findMaxCoverage: false,

  // Link margins (available in finding max coverage mode)
  forwardLinkMargins: [],
  returnLinkMargins: [],

  // Finidng Max total link availability
  findMaxLinkAvailability: false,

  // Find best transponders from input locations
  findBestTransponders: false,

  // Adjacent Satellite Interferences
  adjacentSatelliteTransponderOptions: [],
  selectedAdjacentSatelliteTransponders: [],

  // Defined contours
  definedContours: ['Peak', '50%', 'EOC', 'EOC-2'],

  // Test
  test: [],

  // Link Result
  linkResults: {},

  // Field name mappers
  fieldNameMappers: [
    {
      'name': 'channelOutputBackoff',
      'title': 'Transponder Output Backoff @ Full Load',
      'unit': 'dB'
    },
    {
      'name': 'channelDeepin',
      'title': 'Transponder Deep-in @ Full Load',
      'unit': 'dB'
    },
    {
      'name': 'channel',
      'title': 'Transponder',
      'unit': ''
    },
    {
      'name': 'operatingMode',
      'title': 'Transponder Operating Mode',
      'unit': ''
    },
    {
      'name': 'operatingSfd',
      'title': 'Operating SFD @ Location @ Atten',
      'unit': 'dBW/m^2'
    },
    {
      'name': 'operatingPfdPerCarrier',
      'title': 'Operating PFD per Carrier @ Desired Level',
      'unit': 'dBW/m^2'
    },
    {
      'name': 'carrierPfd',
      'title': 'Actual Carrier PFD',
      'unit': 'dBW/m^2'
    },
    {
      'name': 'carrierObo',
      'title': 'Carrier Output Backoff',
      'unit': 'dB'
    },
    {
      'name': 'gainVariation',
      'title': 'Gain Variation',
      'unit': 'dB'
    },
    {
      'name': 'uplinkPointingLoss',
      'title': 'Uplink Pointing Loss',
      'unit': 'dB'
    },
    {
      'name': 'uplinkXpolLoss',
      'title': 'Uplink Xpol Loss',
      'unit': 'dB'
    },
    {
      'name': 'uplinkAtmLoss',
      'title': 'Upllink Atmospheric Loss',
      'unit': 'dB'
    },
    {
      'name': 'uplinkEirp',
      'title': 'EIRP Uplink',
      'unit': 'dBW'
    },
    {
      'name': 'uplinkGt',
      'title': 'G/T Uplink',
      'unit': 'dB/K'
    },
    {
      'name': 'uplinkPathLoss',
      'title': 'Uplink Path Loss',
      'unit': 'dB'
    },
    {
      'name': 'uplinkCondition',
      'title': 'Uplink Condition',
      'unit': ''
    },
    {
      'name': 'uplinkAvailability',
      'title': 'Uplink Availability',
      'unit': '%'
    },
    {
      'name': 'uplinkContour',
      'title': 'Uplink Contour',
      'unit': 'dB'
    },
    {
      'name': 'operatingHpaPower',
      'title': 'Operating HPA Power',
      'unit': 'W'
    },
    {
      'name': 'cnUplink',
      'title': 'C/N Uplink',
      'unit': 'dB'
    },
    {
      'name': 'antennaTemp',
      'title': 'Antenna Temperature',
      'unit': 'K'
    },
    {
      'name': 'systemTemp',
      'title': 'System Temperature',
      'unit': 'K'
    },
    {
      'name': 'antGain',
      'title': 'Antenna Gain',
      'unit': 'dBi'
    },
    {
      'name': 'downlinkPointingLoss',
      'title': 'Downlink Pointing Loss',
      'unit': 'dB'
    },
    {
      'name': 'downlinkXpolLoss',
      'title': 'Downlink Xpol Loss',
      'unit': 'dB'
    },
    {
      'name': 'downlinkAtmLoss',
      'title': 'Downlink Atmospheric Loss',
      'unit': 'dB'
    },
    {
      'name': 'downlinkEirp',
      'title': 'EIRP Downlink',
      'unit': 'dBW'
    },
    {
      'name': 'saturatedEirpAtLoc',
      'title': 'Saturated EIRP @ Location',
      'unit': 'dBW'
    },
    {
      'name': 'downlinkGt',
      'title': 'G/T Downlink',
      'unit': 'dB/K'
    },
    {
      'name': 'downlinkPathLoss',
      'title': 'Downlink Path Loss',
      'unit': 'dB'
    },
    {
      'name': 'downlinkCondition',
      'title': 'Downlink Condition',
      'unit': ''
    },
    {
      'name': 'downlinkAvailability',
      'title': 'Downlink Availability',
      'unit': '%'
    },
    {
      'name': 'downlinkContour',
      'title': 'Downlink Contour',
      'unit': 'dB'
    },
    {
      'name': 'cnDownlink',
      'title': 'C/N Downlink',
      'unit': 'dB'
    },
    {
      'name': 'ciUplinkIntermod',
      'title': 'C/I Uplink Intermod',
      'unit': 'dB'
    },
    {
      'name': 'ciUplinkAdjSat',
      'title': 'C/I Uplink Adjacent Satellite',
      'unit': 'dB'
    },
    {
      'name': 'ciUplinkXpol',
      'title': 'C/I Uplink Xpol',
      'unit': 'dB'
    },
    {
      'name': 'ciUplinkXCells',
      'title': 'C/I Uplink Cross Cells',
      'unit': 'dB'
    },
    {
      'name': 'ciDownlinkAdjSat',
      'title': 'C/I Downlink Adjacent Satellite',
      'unit': 'dB'
    },
    {
      'name': 'ciDownlinkIntermod',
      'title': 'C/I Downlink Intermod',
      'unit': 'dB'
    },
    {
      'name': 'ciDownlinkXpol',
      'title': 'C/I Downlink Xpol',
      'unit': 'dB'
    },
    {
      'name': 'ciDownlinkXcells',
      'title': 'C/I Downlink Cross Cells',
      'unit': 'dB'
    },
    {
      'name': 'ciUplink',
      'title': 'C/I Uplink',
      'unit': 'dB'
    },
    {
      'name': 'ciDownlink',
      'title': 'C/I Downlink',
      'unit': 'dB'
    },
    {
      'name': 'cnTotal',
      'title': 'C/N Total',
      'unit': 'dB'
    },
    {
      'name': 'linkMargin',
      'title': 'Link Margin',
      'unit': 'dB'
    },
    {
      'name': 'requiredMargin',
      'title': 'Required Link Margin',
      'unit': 'dB'
    },
    {
      'name': 'passed',
      'title': 'Pass?',
      'unit': 'Y/N'
    },
    {
      'name': 'linkAvailability',
      'title': 'Total Link Availability',
      'unit': '%'
    },
    {
      'name': 'occupiedBandwidth',
      'title': 'Occupied Bandwidth',
      'unit': 'MHz'
    },
    {
      'name': 'noiseBandwidth',
      'title': 'Noise Bandwidth',
      'unit': 'MHz'
    },
    {
      'name': 'roundupBandwidth',
      'title': 'Rounded Up Bandwidth',
      'unit': 'MHz'
    },
    {
      'name': 'guardband',
      'title': 'Guard Band',
      'unit': '%'
    },
    {
      'name': 'dataRate',
      'title': 'Data Rate',
      'unit': 'Mbps'
    },
    {
      'name': 'powerUtilPercent',
      'title': 'Power Utilization',
      'unit': '%'
    },
    {
      'name': 'rollOffFactor',
      'title': 'Roll-off Factor',
      'unit': ''
    },
    {
      'name': 'mcgName',
      'title': 'MCG',
      'unit': ''
    },
    {
      'name': 'mcgSpectralEfficiency',
      'title': 'Spectral Efficiency',
      'unit': 'bps/Hz'
    },
    {
      'name': 'mcgEsNo',
      'title': 'MCG Es/No Threshold',
      'unit': 'dB'
    },
    {
      'name': 'antennaName',
      'title': 'Antenna',
      'unit': ''
    },
    {
      'name': 'antennaSize',
      'title': 'Antenna Size',
      'unit': 'm'
    },
    {
      'name': 'bucName',
      'title': 'BUC',
      'unit': ''
    },
    {
      'name': 'bucSize',
      'title': 'BUC Size',
      'unit': 'W'
    },
    {
      'name': 'locationName',
      'title': 'Location',
      'unit': ''
    },
    {
      'name': 'coordinates',
      'title': 'Coordinates',
      'unit': ''
    },
    {
      'name': 'targetedForwardBandwidth',
      'title': 'Target Bandwidth',
      'unit': ''
    },
    {
      'name': 'targetedReturnBandwidth',
      'title': 'Target Bandwidth',
      'unit': ''
    }
  ],

  // Link results field
  forwardTableFields: [],
  returnTableFields: [],

  // Link results default shown fields
  forwardTableDefaultFields: [
    'antennaName',
    'locationName',
    'channelClear',
    'mcgNameClear',
    'mcgSpectralEfficiencyClear',
    'dataRateClear',
    'mcgNameRain',
    'mcgSpectralEfficiencyRain',
    'dataRateRain',
    'linkAvailabilityRain',
    'passedClear'
  ],
  returnTableDefaultFields: [
    'antennaName',
    'bucName',
    'locationName',
    'channelClear',
    'mcgNameClear',
    'mcgSpectralEfficiencyClear',
    'dataRateClear',
    'mcgNameRain',
    'mcgSpectralEfficiencyRain',
    'dataRateRain',
    'linkAvailabilityRain',
    'passedClear'
  ]
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
  linkResultsFields (state) {
    return path => {
      let fields = []
      if (state.linkResults[path + 'LinkResults']) {
        let clearSkyResult = state.linkResults[path + 'LinkResults'][0]['clearSky']
        for (var prop in clearSkyResult) {
          if (clearSkyResult.hasOwnProperty(prop)) {
            fields.push({
              name: prop
            })
          }
        }
      }
      return fields
    }
  },
  linkResultsTableData (state) {
    return path => {
      if (state.linkResults[path + 'LinkResults']) {
        return state.linkResults[path + 'LinkResults'].map(x => {
          return flattenLinkResults(x, x.assumptions)
        })
      }
      return []
    }
  },
  requestObject (state) {
    let object = {
      satellites: state.selectedSatellites,
      transponders: state.selectedTransponders,
      gatewayStations: state.gatewayStations,
      remoteStations: state.remoteStations,
      remoteAntennas: state.selectedRemoteAntennas,
      remoteBucs: state.selectedRemoteBucs,
      remoteLocations: state.selectedRemoteLocations,
      bandwidth: state.selectedBandwidth,
      modemsAndMcgs: state.selectedModemsAndMcgs,
      useDefaultGateway: state.useDefaultGateway,
      maxMode: state.maxMode,
      forwardLinkMargins: state.forwardLinkMargins,
      returnLinkMargins: state.returnLinkMargins,
      findMaxCoverage: state.findMaxCoverage,
      findMaxLinkAvailability: state.findMaxLinkAvailability,
      findBestTransponders: state.findBestTransponders,
      requestName: state.requestName
    }
    return object
  }
}

export const mutations = {
  SET_REQUEST_NAME (state, name) {
    state.requestName = name
  },
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
  SET_SELECTED_MODEMS (state, { modems }) {
    state.selectedModems = modems
  },
  UPSERT_SELECTED_MODEMS_AND_MCGS (state, { modem }) {
    // if this modem is not in the array before, add it. Otherwise, replace the current one
    upsert(state.selectedModemsAndMcgs, { _id: modem._id }, modem)
  },
  REMOVE_SELECTED_MODEMS_AND_MCGS (state, { modem }) {
    _.remove(state.selectedModemsAndMcgs, x => x._id === modem._id)
  },
  SET_GATEWAY_STATIONS (state, { stations }) {
    state.gatewayStations = stations
  },
  SET_LOCATION_OPTIONS (state, { locations }) {
    state.gatewayLocationOptions = locations
    state.remoteLocationOptions = locations
  },
  SET_SELECTED_REMOTE_LOCATIONS (state, { locations }) {
    state.selectedRemoteLocations = locations
  },
  ADD_REMOTE_LOCATIONS_OPTIONS (state, { locations }) {
    locations.forEach(location => state.remoteLocationOptions.push(location))
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
        state.selectedRemoteBucs.forEach(buc => {
          state.selectedBandwidth.forEach(bandwidth => {
            stations.push({location, antenna, buc, bandwidth})
          })
        })
      })
    })
    state.remoteStations = stations
  },
  SET_REMOTE_STATIONS (state, { stations }) {
    state.remoteStations = stations
  },
  SET_USE_DEFAULT_GATEWAY (state, status) {
    state.useDefaultGateway = status
  },
  UPDATE_FIND_BEST_TRANSPONDERS (state, status) {
    state.findBestTransponders = status
  },
  SET_MAX_MODE (state, status) {
    state.maxMode = status
  },
  SET_MAX_COVERAGE (state, status) {
    state.findMaxCoverage = status
  },
  SET_FORWARD_LINK_MARGINS (state, arrayOfLinkMargins) {
    state.forwardLinkMargins = arrayOfLinkMargins
  },
  SET_RETURN_LINK_MARGINS (state, arrayOfLinkMargins) {
    state.returnLinkMargins = arrayOfLinkMargins
  },
  SET_MAX_LINK_AVAILABILITY (state, status) {
    state.findMaxLinkAvailability = status
  },
  PUSH_TEST (state, value) {
    state.test.push(value)
  },
  SET_LINK_RESULTS (state, { linkResults }) {
    state.linkResults = linkResults
  },
  GENERATE_TABLE_FIELDS (state, { path, data }) {
    let columns = []
    for (var prop in data) {
      columns.push({
        name: prop,
        title: mapName(state.fieldNameMappers, prop),
        visible: _.includes(state[path + 'TableDefaultFields'], prop)
      })
    }
    state[path + 'TableFields'] = columns
  },
  SET_TABLE_FIELDS (state, { path, list }) {
    state[path + 'TableFields'] = list
  },
  HIDE_FIELD (state, { path, element }) {
    let fieldToHide = state[path + 'TableFields'].find(f => f.name === element.name)
    fieldToHide.visible = false
  },
  ADD_FIELDS (state, { path, fields }) {
    fields.forEach(field => {
      let fieldToAdd = state[path + 'TableFields'].find(f => f.name === field.name)
      fieldToAdd.visible = true
    })
  }
}

export const actions = {
  setRequestName ({ commit }, name) {
    commit('SET_REQUEST_NAME', name)
  },
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
  setSelectedModems ({ commit }, modems) {
    commit('SET_SELECTED_MODEMS', modems)
  },
  upsertSelectedModemsAndMcgs ({ commit }, modem) {
    commit('UPSERT_SELECTED_MODEMS_AND_MCGS', modem)
  },
  removeSelectedModemsAndMcgs ({ commit }, modem) {
    commit('REMOVE_SELECTED_MODEMS_AND_MCGS', modem)
  },
  setGatewayStations ({ commit }, stations) {
    commit('SET_GATEWAY_STATIONS', stations)
  },
  setLocationOptions ({ commit }, locations) {
    commit('SET_LOCATION_OPTIONS', locations)
  },
  setSelectedRemoteLocations ({ commit }, locations) {
    commit('SET_SELECTED_REMOTE_LOCATIONS', locations)
    commit('GENERATE_REMOTE_STATIONS')
  },
  addRemoteLocationOptions ({ commit }, locations) {
    commit('ADD_REMOTE_LOCATIONS_OPTIONS', locations)
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
  },
  setUseDefaultGateway ({ commit }, status) {
    commit('SET_USE_DEFAULT_GATEWAY', status)
  },
  setMaxMode ({ commit }, status) {
    commit('SET_MAX_MODE', status)
  },
  setMaxCoverage ({ commit }, status) {
    commit('SET_MAX_COVERAGE', status)
  },
  setForawrdLinkMargins ({ commit }, arrayOfLinkMargins) {
    commit('SET_FORWARD_LINK_MARGINS', arrayOfLinkMargins)
  },
  setReturnLinkMargins ({ commit }, arrayOfLinkMargins) {
    commit('SET_FORWARD_LINK_MARGINS', arrayOfLinkMargins)
  },
  setMaxLinkAvailability ({ commit }, status) {
    commit('SET_MAX_LINK_AVAILABILITY', status)
  },
  pushTest ({ commit }, value) {
    commit('PUSH_TEST', value)
  },
  setLinkResults ({ commit, getters }, linkResults) {
    commit('SET_LINK_RESULTS', linkResults)
    // Generate array of table fields for forward and return links
    let paths = ['forward', 'return']
    paths.forEach(path => {
      let dataTable = getters.linkResultsTableData(path)
      let data = dataTable[0]
      commit('GENERATE_TABLE_FIELDS', { path, data })
    })
  },
  setTableFields ({ commit }, data) {
    commit('SET_TABLE_FIELDS', data)
  },
  hideField ({ commit }, element) {
    commit('HIDE_FIELD', element)
  },
  addFields ({ commit }, fields) {
    commit('ADD_FIELDS', fields)
  }
}

function flattenLinkResults (linkResults, assumptions) {
  let resultObject = {}
  // Flatten the remote station
  _.assign(resultObject, flattenRemoteStation(assumptions.remoteStation))
  console.log(`Flatten object = ${JSON.stringify(resultObject)}`)
  // Flatten the clear sky link
  let flattenClearSkyLink = flattenConditionLink(linkResults.clearSky, 'Clear')
  _.assign(resultObject, flattenClearSkyLink)
  console.log(`Result of clr = ${JSON.stringify(flattenClearSkyLink)}`)
  // Flatten the rain fade link
  let flattenRainFadeLink = flattenConditionLink(linkResults.rainFade, 'Rain')
  _.assign(resultObject, flattenRainFadeLink)
  console.log(`Result of rain = ${JSON.stringify(flattenRainFadeLink)}`)
  return resultObject
}

function flattenConditionLink (linkResult, condition) {
  let resultObject = {}
  for (var prop in linkResult) {
    // console.log(`Type of ${prop} is ${typeof linkResult[prop]}`)
    if (linkResult.hasOwnProperty(prop) && (typeof linkResult[prop] === 'string' || typeof linkResult[prop] === 'number' || typeof linkResult[prop] === 'boolean')) {
      resultObject[prop + condition] = linkResult[prop]
    }
  }
  // Includes the MCG
  // console.log(`Flatten condition = ${JSON.stringify(resultObject)}`)
  _.assign(resultObject, flattenMcg(linkResult.mcg))
  return resultObject
}

function flattenMcg (mcg) {
  return {
    mcgName: mcg.name,
    mcgSpectralEfficiency: mcg.spectral_efficiency,
    mcgEsNo: mcg.es_no
  }
}

function flattenRemoteStation (remoteStation) {
  return {
    antennaName: remoteStation.antenna.name,
    antennaSize: remoteStation.antenna.size,
    bucName: remoteStation.buc.name,
    bucSize: remoteStation.buc.size,
    locationName: remoteStation.location.name,
    coordinates: _.has(remoteStation.location, 'lat') ? `${remoteStation.location.lat},${remoteStation.location.lon}` : '',
    targetedForwardBandwidth: `${remoteStation.bandwidth.forward} ${remoteStation.bandwidth.unit}`,
    targetedReturnBandwidth: `${remoteStation.bandwidth.return} ${remoteStation.bandwidth.unit}`
  }
}

function mapName (mappers, name) {
  let condition = ''
  let fieldName = name
  let matchedTitle
  if (name.endsWith('Clear')) {
    condition = 'Clear Sky'
    fieldName = name.replace('Clear', '')
  }
  if (name.endsWith('Rain')) {
    condition = 'Rain'
    fieldName = name.replace('Rain', '')
  }
  matchedTitle = mappers.find(m => m.name === fieldName)
  let unit = ''
  let title = ''
  if (matchedTitle) {
    title = matchedTitle.title
    unit = matchedTitle.unit ? `(${matchedTitle.unit})` : ''
    return `${title} ${condition} ${unit}`.trim()
  }
  return ''
}

function upsert (arr, key, newval) {
  var match = _.find(arr, key)
  if (match) {
    var index = _.indexOf(arr, _.find(arr, key))
    arr.splice(index, 1, newval)
  } else {
    arr.push(newval)
  }
};
