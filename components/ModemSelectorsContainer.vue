<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">MODEM</p>
    </header>
    <div class="card-content">
      <div class="content">

        <b-field label="Modem(s)">
          <modem-selector
            :modemOptions="modemOptions"
            :multiple="true"
            @modems-changed="updateModems" />
        </b-field>
        <br>
        <modem-mcgs-selector-container
          v-for="modem in $store.state.linkcalc.selectedModems"
          :modem="modem"
        />
        <br>

      </div>


    </div>
  </div>
</template>

<script>
  import ModemSelector from './ModemSelector'
  import ModemMcgsSelectorContainer from './ModemMcgsSelectorsContainer'
  export default {
    components: {
      ModemSelector,
      ModemMcgsSelectorContainer
    },
    computed: {
      modemOptions () {
        return this.$_transformModemOptions(this.$store.state.linkcalc.modemOptions)
      }
    },
    methods: {
      updateModems ({ modems }) {
        this.$store.dispatch('linkcalc/setSelectedModems', { modems })
      }
    }
  }
</script>
