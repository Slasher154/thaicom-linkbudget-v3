<template>

    <div>

      <h1 class="title">Thaicom Link Budget v3</h1>
      <h2 class="subtitle">The revolution of link budget (hopefully)</h2>

      <article class="message is-warning">
        <div class="message-body">
          Fill the following information to request a link budget
        </div>
      </article>

      <satellite-selectors-container />
      <br>
      <div
        v-if="$store.state.linkcalc.selectedTransponders.length > 0 || $store.state.linkcalc.findBestTransponders"
        class="columns">
        <div class="column is-6">
          <gateway-selectors-container />
        </div>
        <div class="column is-6">
          <remote-selectors-container />
        </div>
      </div>
      <div
        v-if="$store.state.linkcalc.selectedTransponders.length > 0 || $store.state.linkcalc.findBestTransponders"
        class="columns">
        <div class="column">
          <map-container />
        </div>
      </div>
    </div>
</template>

<script>
  /* eslint-disable spaced-comment,indent */

  import SatelliteSelectorsContainer from '@/components/SatelliteSelectorsContainer'
  import GatewaySelectorsContainer from '@/components/GatewaySelectorsContainer'
  import RemoteSelectorsContainer from '@/components/RemoteSelectorsContainer'
  import MapContainer from '@/components/MapContainer'

  import axios from 'axios'
  export default {
    components: {
      SatelliteSelectorsContainer,
      GatewaySelectorsContainer,
      RemoteSelectorsContainer,
      MapContainer
    },
    async fetch ({ store }) {
      try {
        // Fill the store with satellite options
        let satelliteResult = await axios.get('/satellites')
        store.dispatch('linkcalc/setSatelliteOptions', { satellites: satelliteResult.data.satellites })

        // Fill the store with transponders options
        let tpResult = await axios.get('allTransponders')
        store.dispatch('linkcalc/setTransponderOptions', { transponders: tpResult.data.transponders })

        // Fill the store with modem options
        let modemResult = await axios.get('/modems')
        store.dispatch('linkcalc/setModemOptions', { modems: modemResult.data.modems })

        // Fill the store with location options
        let locationResult = await axios.get('/locationswithcoords')
        store.dispatch('linkcalc/setLocationOptions', { locations: locationResult.data.locations })

        // Fill the store with antenna options
        let antennaResult = await axios.get('/antennas')
        store.dispatch('linkcalc/setRemoteAntennaOptions', { antennas: antennaResult.data.antennas })

        // Fill the store with buc options
        let bucResult = await axios.get('/bucs')
        store.dispatch('linkcalc/setRemoteBucOptions', { bucs: bucResult.data.bucs })
      } catch (error) {
        throw error
      }
//
    }
  }
</script>

