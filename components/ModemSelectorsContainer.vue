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

      </div>


    </div>
  </div>
</template>

<script>
  import ModemSelector from './ModemSelector'
  export default {
    components: {
      ModemSelector
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
