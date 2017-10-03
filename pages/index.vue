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

    </div>
</template>

<script>
  /* eslint-disable spaced-comment,indent */

  import SatelliteSelectorsContainer from '@/components/SatelliteSelectorsContainer'
  import axios from 'axios'
  export default {
    components: {
      SatelliteSelectorsContainer
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
      } catch (error) {
        throw error
      }
//
    }
  }
</script>

