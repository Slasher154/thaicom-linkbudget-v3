<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">SATELLITES AND TRANSPONDERS</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="columns">

          <!-- Satellite Field -->
          <div class="column is-3">
            <b-field label="Satellite">
              <satellite-selector
                :multiple="true"
                :satellite-options="$store.state.linkcalc.satelliteOptions"
                :default-selected-satellites="defaultSatellites"
                @satellites-changed="updateSatellites"
              />
            </b-field>
          </div>
          <!-- End of satellite field -->

          <!-- Transponders Field -->
          <div
            v-if="$store.state.linkcalc.selectedSatellites.length > 0"
            class="column is-4"
          >
            <b-field label="Transponders">
              <satellite-transponder-selector
                :multiple="true"
                :transponder-options="transponderOptions"
                :default-selected-transponders="defaultTransponders"
                @transponders-changed="updateTransponders"
              />
            </b-field>
          </div>
          <!--End of transponder field-->
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SatelliteSelector from '@/components/SatelliteSelector'
  import SatelliteTransponderSelector from '@/components/SatelliteTranspondersSelector'
  export default {
    components: {
      SatelliteSelector,
      SatelliteTransponderSelector
    },
    data () {
      return {
        message: '34fee',
        satellites: [],
        defaultSatellites: [],
        defaultTransponders: []
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'filteredTransponders'
      ]),
      transponderOptions () {
        let transformedTranspondersForMultiselect = this.$_transformTransponderOptions(this.filteredTransponders)
        return transformedTranspondersForMultiselect
      }
    },
    methods: {
      updateSatellites ({ satellites }) {
        this.$store.dispatch('linkcalc/setSelectedSatellites', { satellites })
      },
      updateTransponders ({ transponders }) {
        this.$store.dispatch('linkcalc/setSelectedTransponders', { transponders })
      }
    }
  }
</script>
