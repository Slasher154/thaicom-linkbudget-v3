<template>

  <div>

    <h1 class="title">Thaicom Link Budget v3</h1>
    <h2 class="subtitle">The revolution of link budget (hopefully)</h2>

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
      } catch (error) {
        throw error
      }
//
    },
    data () {
      return {
        activeTab: 0
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

