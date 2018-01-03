<template>

  <div>

    <h1 class="title">Thaicom Link Budget v3</h1>
    <h2 class="subtitle">The revolution of link budget (hopefully)</h2>
    <button
      class="button is-primary"
      @click.prevent="submitSampleResultToServer">
      Submit sample request
    </button>
    <button
      class="button is-info"
      @click.prevent="submitMaxContourResultToServer">
      Submit sample max contour request
    </button>

    <b-tabs v-model="activeTab" type="is-toggle" position="is-centered" class="block">
      <b-tab-item label="Request">
        <br>
        <request-name-container/>
        <br>
        <satellite-selectors-container/>
        <br>
        <div
          v-if="$store.state.linkcalc.selectedTransponders.length > 0 || $store.state.linkcalc.findBestTransponders"
          class="columns">
          <div class="column is-6">
            <gateway-selectors-container/>
            <br>
            <modem-selectors-container/>
            <br>
            <advanced-options-container/>
          </div>
          <div class="column is-6">
            <remote-selectors-container/>
          </div>
        </div>

        <div
          v-if="$store.state.linkcalc
          .selectedTransponders.length > 0 || $store.state.linkcalc.findBestTransponders"
          class="columns">
          <div class="column" v-show="false">
            <map-container/>
          </div>
        </div>

        <div class="columns">
          <div class="column has-text-centered">
            <button
              class="button is-primary"
              @click.prevent="submitRequest">
              Submit
            </button>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item label="Results">
        <results-container/>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  /* eslint-disable spaced-comment,indent */
  import { mapGetters } from 'vuex'
  import RequestNameContainer from '@/components/RequestNameContainer'
  import SatelliteSelectorsContainer from '@/components/SatelliteSelectorsContainer'
  import GatewaySelectorsContainer from '@/components/GatewaySelectorsContainer'
  import RemoteSelectorsContainer from '@/components/RemoteSelectorsContainer'
  import ModemSelectorsContainer from '@/components/ModemSelectorsContainer'
  import AdvancedOptionsContainer from '@/components/AdvancedOptionsContainer'
  import MapContainer from '@/components/MapContainer'
  import ResultsContainer from '@/components/ResultsContainer'

  import axios from 'axios'
  export default {
    authenticated: true,
    name: 'Index',
    components: {
      RequestNameContainer,
      SatelliteSelectorsContainer,
      GatewaySelectorsContainer,
      RemoteSelectorsContainer,
      ModemSelectorsContainer,
      AdvancedOptionsContainer,
      MapContainer,
      ResultsContainer
    },
    async fetch ({store}) {
      try {
        // Fill the store with satellite options
        let satelliteResult = await axios.post('/satellites-by-slot', {slot: 119.5})
        store.dispatch('linkcalc/setSatelliteOptions', {satellites: satelliteResult.data.satellites})

        // Fill the store with transponders options
        let tpResult = await axios.get('allTransponders')
        store.dispatch('linkcalc/setTransponderOptions', {transponders: tpResult.data.transponders})

        // Fill the store with modem options
        let modemResult = await axios.get('/modems')
        store.dispatch('linkcalc/setModemOptions', {modems: modemResult.data.modems})

        // Fill the store with location options
        let locationResult = await axios.get('/locationswithcoords')
        store.dispatch('linkcalc/setLocationOptions', {locations: locationResult.data.locations})

        // Fill the store with antenna options
        let antennaResult = await axios.get('/antennas')
        store.dispatch('linkcalc/setRemoteAntennaOptions', {antennas: antennaResult.data.antennas})

        // Fill the store with buc options
        let bucResult = await axios.get('/bucs')
        store.dispatch('linkcalc/setRemoteBucOptions', {bucs: bucResult.data.bucs})

        // Fill the store with user profile
//        let config = { headers: { 'authorization': 'Bearer ' + store.state.oauth.accessToken } }
//        console.log(`Config = ${config}`)
//        let user = await axios.get('https://poseidon.thaicom.net/account/Userinfo', config)
//        if (user) {
//          console.log(user)
//          store.dispatch('linkcalc/setUser', { user: user.data })
//        } else {
//          console.log(`No user found`)
//        }
//        store.dispatch('linkcalc/setUser', { user })
      } catch (error) {
        throw error
      }
//
    },
    data () {
      return {
        activeTab: 0,
        sampleLink: {
          'satellites': [
            {
              '_id': 'Q962ttEf4266TwTB4',
              'name': 'Thaicom 4',
              'orbital_slot': 119.5,
              'skb': 0.05,
              'type': 'Broadband',
              'isThaicom': true,
              'isActive': true
            }
          ],
          'transponders': [
            {
              '_id': 'JGpDvdfuzfpoYnG7Q',
              'name': '207',
              'satellite': 'Thaicom 4',
              'uplink_cf': 27.086,
              'downlink_cf': 12.286,
              'bandwidth': 171,
              'type': 'forward',
              'uplink_beam': '3H',
              'gt_peak': 20.3,
              'uplink_pol': 'H',
              'downlink_beam': '207',
              'saturated_eirp_peak': 59.13,
              'downlink_pol': 'V',
              'transponder': '3310R2',
              'dynamic_range': 25,
              'mode': 'ALC',
              'sfd': -62.27,
              'eirp_up_channel': 73.74273412,
              'country': 'Thailand',
              'contour_50': -2.3,
              'contour_eoc': -4.5,
              'default_gateway': '3H',
              'lat': 14,
              'lon': 100.4,
              'ci_downlink_adj_cell_50': 18.8,
              'ci_downlink_adj_cell_eoc': 18.14,
              'ci_downlink_adj_sat': 25,
              'ci_uplink_adj_cell': 25.69,
              'current_num_carriers': 'multi',
              'ci_uplink_adj_sat': 25,
              'eirp_density_adjacent_satellite_downlink': -100,
              'adjacent_satellite_orbital_slot': 0,
              'backoff_settings': [
                {
                  'intermod': 17,
                  'obo': -3,
                  'ibo': 0,
                  'num_carriers': 'single'
                },
                {
                  'intermod': 17,
                  'obo': -3,
                  'ibo': 0,
                  'num_carriers': 'two'
                },
                {
                  'intermod': 20,
                  'obo': -4.9,
                  'ibo': 0,
                  'num_carriers': 'multi'
                }
              ]
            }
          ],
          'gatewayStations': [],
          'remoteStations': [
            {
              'location': {
                'name': 'EOC',
                'type': 'definedContours'
              },
              'antenna': {
                '_id': '5nN4bkz6GLNW7csrz',
                'name': '1.2 m',
                'type': 'Standard',
                'size': 1.2,
                'vendor': 'Standard'
              },
              'buc': {
                '_id': '97GFspvo5gkCRJYML',
                'type': 'Standard',
                'category': 'buc',
                'size': 4,
                'name': '4W',
                'ifl': 0.3,
                'obo': 0.5
              },
              'bandwidth': {
                'id': 1,
                'forward': 6,
                'return': 3,
                'unit': 'Mbps'
              },
              'transponder': {
                '_id': 'JGpDvdfuzfpoYnG7Q',
                'name': '207',
                'satellite': 'Thaicom 4',
                'uplink_cf': 27.086,
                'downlink_cf': 12.286,
                'bandwidth': 171,
                'type': 'forward',
                'uplink_beam': '3H',
                'gt_peak': 20.3,
                'uplink_pol': 'H',
                'downlink_beam': '207',
                'saturated_eirp_peak': 59.13,
                'downlink_pol': 'V',
                'transponder': '3310R2',
                'dynamic_range': 25,
                'mode': 'ALC',
                'sfd': -62.27,
                'eirp_up_channel': 73.74273412,
                'country': 'Thailand',
                'contour_50': -2.3,
                'contour_eoc': -4.5,
                'default_gateway': '3H',
                'lat': 14,
                'lon': 100.4,
                'ci_downlink_adj_cell_50': 18.8,
                'ci_downlink_adj_cell_eoc': 18.14,
                'ci_downlink_adj_sat': 25,
                'ci_uplink_adj_cell': 25.69,
                'current_num_carriers': 'multi',
                'ci_uplink_adj_sat': 25,
                'eirp_density_adjacent_satellite_downlink': -100,
                'adjacent_satellite_orbital_slot': 0,
                'backoff_settings': [
                  {
                    'intermod': 17,
                    'obo': -3,
                    'ibo': 0,
                    'num_carriers': 'single'
                  },
                  {
                    'intermod': 17,
                    'obo': -3,
                    'ibo': 0,
                    'num_carriers': 'two'
                  },
                  {
                    'intermod': 20,
                    'obo': -4.9,
                    'ibo': 0,
                    'num_carriers': 'multi'
                  }
                ]
              }
            }
          ],
          'remoteAntennas': [
            {
              '_id': '5nN4bkz6GLNW7csrz',
              'name': '1.2 m',
              'type': 'Standard',
              'size': 1.2,
              'vendor': 'Standard'
            }
          ],
          'remoteBucs': [
            {
              '_id': '97GFspvo5gkCRJYML',
              'type': 'Standard',
              'category': 'buc',
              'size': 2,
              'name': '2W',
              'ifl': 0.3,
              'obo': 0.5
            }
          ],
          'remoteLocations': [
            {
              'name': '50%',
              'type': 'definedContours'
            },
            {
              'name': 'EOC',
              'type': 'definedContours'
            }
          ],
          'bandwidth': [
            {
              'id': 1,
              'forward': 6,
              'return': 3,
              'unit': 'Mbps'
            }
          ],
          'modemsAndMcgs': [
            {
              '_id': '7LxgNPpxpBXvg8b7o',
              'name': 'Hughes Jupiter for INDIA  (BT=5% for FWD and 20% for RTN)',
              'vendor': 'Hughes',
              'applications': [
                {
                  'mcgs': [
                    {
                      'es_no': -0.9,
                      'spectral_efficiency': 0.479,
                      'name': 'QPSK 1/4'
                    },
                    {
                      'es_no': -0.42,
                      'spectral_efficiency': 0.641,
                      'name': 'QPSK 1/3'
                    },
                    {
                      'es_no': 0.39,
                      'spectral_efficiency': 0.771,
                      'name': 'QPSK 2/5'
                    },
                    {
                      'es_no': 0.83,
                      'spectral_efficiency': 0.889,
                      'name': 'QPSK 9/20'
                    },
                    {
                      'es_no': 1.49,
                      'spectral_efficiency': 0.965,
                      'name': 'QPSK 1/2'
                    },
                    {
                      'es_no': 2,
                      'spectral_efficiency': 1.089,
                      'name': 'QPSK 11/20'
                    },
                    {
                      'es_no': 2.6,
                      'spectral_efficiency': 1.16,
                      'name': 'QPSK 3/5'
                    },
                    {
                      'es_no': 3.4,
                      'spectral_efficiency': 1.291,
                      'name': 'QPSK 2/3'
                    },
                    {
                      'es_no': 4.5,
                      'spectral_efficiency': 1.452,
                      'name': 'QPSK 3/4'
                    },
                    {
                      'es_no': 5.1,
                      'spectral_efficiency': 1.549,
                      'name': 'QPSK 4/5'
                    },
                    {
                      'es_no': 5.59,
                      'spectral_efficiency': 1.615,
                      'name': 'QPSK 5/6'
                    },
                    {
                      'es_no': 6.2,
                      'spectral_efficiency': 1.936,
                      'name': '8PSK 2/3'
                    },
                    {
                      'es_no': 7.19,
                      'spectral_efficiency': 2.178,
                      'name': '8PSK 3/4'
                    },
                    {
                      'es_no': 8.46,
                      'spectral_efficiency': 2.282,
                      'name': '16APSK 26/45'
                    },
                    {
                      'es_no': 8.48,
                      'spectral_efficiency': 2.422,
                      'name': '8PSK 5/6'
                    },
                    {
                      'es_no': 8.98,
                      'spectral_efficiency': 2.458,
                      'name': '16APSK 28/45'
                    },
                    {
                      'es_no': 9.28,
                      'spectral_efficiency': 2.525,
                      'name': '16APSK 23/36'
                    },
                    {
                      'es_no': 9.5,
                      'spectral_efficiency': 2.896,
                      'name': '16APSK 3/4'
                    },
                    {
                      'es_no': 10.88,
                      'spectral_efficiency': 3.09,
                      'name': '16APSK 4/5'
                    },
                    {
                      'es_no': 11.74,
                      'spectral_efficiency': 3.222,
                      'name': '16APSK 5/6'
                    },
                    {
                      'es_no': 12.32,
                      'spectral_efficiency': 3.44,
                      'name': '16APSK 8/9'
                    },
                    {
                      'es_no': 13.16,
                      'spectral_efficiency': 3.57,
                      'name': '32APSK 13/18'
                    },
                    {
                      'es_no': 13.69,
                      'spectral_efficiency': 3.866,
                      'name': '32APSK 4/5'
                    },
                    {
                      'es_no': 14.5,
                      'spectral_efficiency': 4.031,
                      'name': '32APSK 5/6'
                    },
                    {
                      'es_no': 15.39,
                      'spectral_efficiency': 4.303,
                      'name': '32APSK 8/9'
                    },
                    {
                      'es_no': 17.09,
                      'spectral_efficiency': 4.35,
                      'name': '32APSK 9/10'
                    }
                  ],
                  'roll_off_factor': 1.05,
                  'symbol_rates': [],
                  'maximum_symbol_rate': 235000,
                  'minimum_symbol_rate': 1000,
                  'link_margin': 0.9,
                  'acm': true,
                  'type': 'forward',
                  'name': 'Outbound DVB-S2X'
                },
                {
                  'mcgs': [
                    {
                      'es_no': 3.06,
                      'spectral_efficiency': 1,
                      'name': 'OQPSK 1/2'
                    },
                    {
                      'es_no': 4.33,
                      'spectral_efficiency': 1.33,
                      'name': 'OQPSK 2/3'
                    },
                    {
                      'es_no': 6.09,
                      'spectral_efficiency': 1.6,
                      'name': 'OQPSK 4/5'
                    },
                    {
                      'es_no': 7.81,
                      'spectral_efficiency': 2,
                      'name': '8PSK 2/3'
                    },
                    {
                      'es_no': 7.96,
                      'spectral_efficiency': 1.6,
                      'name': 'OQPSK 9/10'
                    },
                    {
                      'es_no': 10,
                      'spectral_efficiency': 2.4,
                      'name': '8PSK 4/5'
                    },
                    {
                      'es_no': 11.89,
                      'spectral_efficiency': 2.67,
                      'name': '8PSK 8/9'
                    }
                  ],
                  'roll_off_factor': 1.2,
                  'symbol_rates': [
                    512,
                    1024,
                    2048,
                    4096,
                    6144,
                    8192,
                    12228
                  ],
                  'maximum_symbol_rate': 12228,
                  'minimum_symbol_rate': 512,
                  'link_margin': 0.3,
                  'acm': true,
                  'type': 'return',
                  'name': 'Hughes Jupiter for INDIA  (BT=5% for FWD and 20% for RTN)'
                }
              ],
              'warning_messages': [],
              'findBestMcg': true
            }
          ],
          'useDefaultGateway': true,
          'maxMode': true,
          'findMaxCoverage': false,
          'findMaxLinkAvailability': false,
          'findBestTransponders': false,
          'requestName': 'Test Thaicom 4'
        },
        sampleMaxContourLink: {
          'satellites': [
            {
              '_id': 'Q962ttEf4266TwTB4',
              'name': 'Thaicom 4',
              'orbital_slot': 119.5,
              'skb': 0.05,
              'type': 'Broadband',
              'isThaicom': true,
              'isActive': true
            }
          ],
          'transponders': [
            {
              '_id': '36EEMmrPy5RY4QBZP',
              'name': '503',
              'satellite': 'Thaicom 4',
              'uplink_cf': 29.631,
              'downlink_cf': 12.331,
              'bandwidth': 262.5,
              'type': 'forward',
              'uplink_beam': '8V',
              'gt_peak': 18.54,
              'uplink_pol': 'V',
              'downlink_beam': '503',
              'saturated_eirp_peak': 61.18,
              'downlink_pol': 'V',
              'transponder': '3310F2',
              'dynamic_range': 25,
              'mode': 'ALC',
              'sfd': -61.41,
              'eirp_up_channel': 70.60406609,
              'country': 'Australia',
              'contour_50': -1.9,
              'contour_eoc': -3.99,
              'default_gateway': '8V',
              'lat': -18.12,
              'lon': 145.45,
              'ci_downlink_adj_cell_50': 24.7,
              'ci_downlink_adj_cell_eoc': 19.37,
              'ci_downlink_adj_sat': 25,
              'ci_uplink_adj_cell': 28.34,
              'current_num_carriers': 'multi',
              'ci_uplink_adj_sat': 25,
              'eirp_density_adjacent_satellite_downlink': -23.4,
              'adjacent_satellite_orbital_slot': 122.2,
              'delta_eirp_down': 0.38,
              'backoff_settings': [
                {
                  'intermod': 17,
                  'obo': -3,
                  'ibo': 0,
                  'num_carriers': 'single'
                },
                {
                  'intermod': 17,
                  'obo': -3,
                  'ibo': 0,
                  'num_carriers': 'two'
                },
                {
                  'intermod': 20,
                  'obo': -4,
                  'ibo': 0,
                  'num_carriers': 'multi'
                }
              ]
            }
          ],
          'gatewayStations': [],
          'remoteStations': [
            {
              'location': {
                'name': 'maxContour',
                'type': 'definedContours'
              },
              'antenna': {
                '_id': '5nN4bkz6GLNW7csrz',
                'name': '1.2 m',
                'type': 'Standard',
                'size': 1.2,
                'vendor': 'Standard'
              },
              'buc': {
                '_id': '97GFspvo5gkCRJYML',
                'type': 'Standard',
                'category': 'buc',
                'size': 2,
                'name': '2W',
                'ifl': 0.3,
                'obo': 0.5
              },
              'bandwidth': {
                'id': 1,
                'forward': 4,
                'return': 2,
                'unit': 'Mbps'
              }
            }
          ],
          'remoteAntennas': [
            {
              '_id': '5nN4bkz6GLNW7csrz',
              'name': '1.2 m',
              'type': 'Standard',
              'size': 1.2,
              'vendor': 'Standard'
            }
          ],
          'remoteBucs': [
            {
              '_id': '97GFspvo5gkCRJYML',
              'type': 'Standard',
              'category': 'buc',
              'size': 2,
              'name': '2W',
              'ifl': 0.3,
              'obo': 0.5
            }
          ],
          'remoteLocations': [
            {
              'name': 'maxContour',
              'type': 'definedContours'
            }
          ],
          'bandwidth': [
            {
              'id': 1,
              'forward': 4,
              'return': 2,
              'unit': 'Mbps'
            }
          ],
          'modemsAndMcgs': [
            {
              '_id': '7LxgNPpxpBXvg8b7o',
              'name': 'Hughes Jupiter for INDIA  (BT=5% for FWD and 20% for RTN)',
              'vendor': 'Hughes',
              'applications': [
                {
                  'mcgs': [
                    {
                      'es_no': 7.19,
                      'spectral_efficiency': 2.178,
                      'name': '8PSK 3/4'
                    }
                  ],
                  'roll_off_factor': 1.05,
                  'symbol_rates': [],
                  'maximum_symbol_rate': 235000,
                  'minimum_symbol_rate': 1000,
                  'link_margin': 0.9,
                  'acm': true,
                  'type': 'forward',
                  'name': 'Outbound DVB-S2X'
                },
                {
                  'mcgs': [
                    {
                      'es_no': 10,
                      'spectral_efficiency': 2.4,
                      'name': '8PSK 4/5'
                    }
                  ],
                  'roll_off_factor': 1.2,
                  'symbol_rates': [
                    512,
                    1024,
                    2048,
                    4096,
                    6144,
                    8192,
                    12228
                  ],
                  'maximum_symbol_rate': 12228,
                  'minimum_symbol_rate': 512,
                  'link_margin': 0.3,
                  'acm': true,
                  'type': 'return',
                  'name': 'Hughes Jupiter for INDIA  (BT=5% for FWD and 20% for RTN)'
                }
              ],
              'warning_messages': [],
              'findBestMcg': false
            }
          ],
          'useDefaultGateway': true,
          'maxMode': false,
          'forwardLinkMargins': [
            2,
            0
          ],
          'returnLinkMargins': [],
          'findMaxCoverage': true,
          'findMatchingReturnCoverage': true,
          'findMaxLinkAvailability': false,
          'findBestTransponders': false,
          'requestName': 'test'
        }
      }
    },
    methods: {
      submitRequest () {
//        this.$toast.open('Request submitted')
        this.submitResultToServer()
      },
      validate () {
        alert('')
      },
      async submitResultToServer () {
        // Construct the link budget requests input from the store
        const loadingComponent = this.$loading.open()
        let requestObject = this.requestObject
        console.log(JSON.stringify(requestObject, undefined, 2))
        let results = await axios.post('/linkbudget-request', {requestObject})
        // Save the result to Vuex Store
        this.$store.dispatch('linkcalc/setLinkResults', {linkResults: results.data})
//        console.log(JSON.stringify(results.data, undefined, 2))
        loadingComponent.close()
        this.activeTab = 1
      },
      submitSampleResultToServer () {
        this.submitLinkToServer(this.sampleLink)
      },
      submitMaxContourResultToServer () {
        // Set max contour option to true to simulate this mode
        this.$store.dispatch('linkcalc/setMaxCoverage', true)
        this.submitLinkToServer(this.sampleMaxContourLink)
      },
      async submitLinkToServer (requestObject) {
        // Construct the link budget requests input from the store
        const loadingComponent = this.$loading.open()
        console.log(JSON.stringify(requestObject, undefined, 2))
        let results = await axios.post('/linkbudget-request', {requestObject})
        // Save the result to Vuex Store
        this.$store.dispatch('linkcalc/setLinkResults', {linkResults: results.data})
        console.log(JSON.stringify(results.data, undefined, 2))
        loadingComponent.close()
        this.activeTab = 1
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'requestObject'
      ])
    }
  }
</script>

