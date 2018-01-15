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
                :isDisabled="findBestTransponders"
                @transponders-changed="updateTransponders"
              />
            </b-field>

            <div class="field">
              <b-checkbox
                :value="findBestTransponders"
                @input="updateFindBestTransponders"
              >Find best transponders from input remote locations</b-checkbox>
            </div>

            <b-field label="Country"
              v-if="$store.state.linkcalc.findBestTransponders"
              message="Select countries will find the beams faster"
            >
              <country-selector
                :country-options="$store.state.linkcalc.countryOptions"
                :multiple="true"
                @countries-changed="updateCountries"
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
  import { mapGetters, mapState } from 'vuex'
  import SatelliteSelector from '@/components/SatelliteSelector'
  import SatelliteTransponderSelector from '@/components/SatelliteTranspondersSelector'
  import CountrySelector from '@/components/CountrySelector'
  export default {
    components: {
      SatelliteSelector,
      SatelliteTransponderSelector,
      CountrySelector
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
      ...mapState('linkcalc', {
        findBestTransponders: state => state.findBestTransponders
      }),
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
      },
      updateFindBestTransponders (value) {
        this.$store.dispatch('linkcalc/updateFindBestTransponders', value)
      },
      updateCountries ({ countries }) {
        this.$store.dispatch('linkcalc/setSelectedCountries', { countries: countries.map(x => x.name) })
      }
    }
  }
</script>
