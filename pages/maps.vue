<template>
  <div>
    <h1 class="title">Maps</h1>
    <h2 class="subtitle">View Thaicom satellite contours on Google Maps</h2>
    <!--<b-field grouped>
      <b-field label="Satellite">
        <satellite-selector
          :multiple="false"
          :satellite-options="satelliteOptions"
          @satellites-changed="updateSatellites"
        />
      </b-field>
      <b-field label="Transponders" expanded>
        <satellite-transponder-selector
          :multiple="true"
          :transponder-options="filteredTransponders"
          @transponders-changed="updateTransponders"
        />
      </b-field>
      <b-field
        v-if="showBroadbandOptions"
        label="Copy from Excel?"
      >
        <b-checkbox v-model="copyFromExcel"></b-checkbox>
      </b-field>
      <b-field
        v-broadbandManualions"
        label="Path"
      >
        <path-selector
          :multiple="true"
          @paths-changed="updatePaths"
        />
      </b-field>
      <b-field
        v-broadbandManualions"
        label="Defined Contours"
      >
        <defined-contour-selector
          :multiple="true"
          @defined-contours-changed="updateDefinedContours"
        />
      </b-field>

      <b-field
        v-if="readyToSubmit"
        label="Submit"
      >
        <p class="control">
          <button class="button is-primary"
            @click="submitContours"
          >Submit</button>
        </p>
      </b-field>
    </b-field>-->
    <div class="columns">
      <div class="column is-2">
        <b-field label="Satellite">
          <satellite-selector
            :multiple="false"
            :satellite-options="satelliteOptions"
            @satellites-changed="updateSatellites"
          />
        </b-field>
      </div>
      <div class="column is-6">
        <b-field label="Transponders">
          <satellite-transponder-selector
            :multiple="true"
            :transponder-options="filteredTransponders"
            @transponders-changed="updateTransponders"
          />
        </b-field>
      </div>
      <div class="column is-2">
        <b-field
          v-if="showBroadbandOptions"
          label="Copy from Excel?"
        >
          <b-checkbox v-model="copyFromExcel"></b-checkbox>
        </b-field>
      </div>
    </div>
    <div class="columns">
      <div class="column is-3">
        <b-field
          v-if="broadbandManual"
          label="Path"
        >
          <path-selector
            :multiple="true"
            @paths-changed="updatePaths"
          />
        </b-field>
      </div>
      <div class="column is-4">
        <b-field
          v-if="broadbandManual"
          label="Defined Contours"
        >
          <defined-contour-selector
            :multiple="true"
            @defined-contours-changed="updateDefinedContours"
          />
        </b-field>
      </div>
      <div class="column is-3">
        <b-field
          v-if="readyToSubmit"
          label="Submit"
        >
          <p class="control">
            <button class="button is-primary"
                    @click="submitContours"
            >Submit</button>
          </p>
        </b-field>
      </div>
    </div>
    <base-map ref="map" />

  </div>
</template>

<script>
  /* eslint-disable no-undef */

  import axios from 'axios'
  import _ from 'lodash'
  import BaseMap from '@/components/BaseMap'
  import SatelliteSelector from '@/components/SatelliteSelector'
  import SatelliteTransponderSelector from '@/components/SatelliteTranspondersSelector'
  import PathSelector from '@/components/PathSelector'
  import DefinedContourSelector from '@/components/DefinedContourSelector'
  import BCheckbox from '../node_modules/buefy/src/components/checkbox/Checkbox'
  export default {
    components: {
      BCheckbox,
      BaseMap,
      SatelliteSelector,
      SatelliteTransponderSelector,
      PathSelector,
      DefinedContourSelector
    },
    async asyncData () {
      // Fetch the satellite from the API
      try {
        let satelliteResult = await axios.get('/satellites')
        let transponderResult = await axios.get('/allTransponders')
        if (satelliteResult && transponderResult) {
          return {
            // Sort to get Thaicom satellite first then sort by name
            satelliteOptions: _.orderBy(satelliteResult.data.satellites, ['isThaicom', 'name'], ['desc', 'asc']),
            transponderOptions: transponderResult.data.transponders
          }
        } else {
          return {
            satelliteOptions: []
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        selectedSatellites: [],
        selectedTransponders: [],
        selectedPaths: [],
        selectedDefinedContours: [],
        copyFromExcel: false
      }
    },
    computed: {
      filteredTransponders () {
        let satelliteNames = _.map(this.selectedSatellites, x => x.name)
        let filteredTransponders = this.transponderOptions.filter(tp => _.includes(satelliteNames, tp.satellite))

        // Sorted transponders by satellite name, uplink beam name and uplink frequency
        let orderedTransponders = _.orderBy(filteredTransponders, ['satellite', 'uplink_beam', 'uplink_cf'], ['asc', 'asc', 'asc'])

        // Transform for multi-select
        return this.$_transformTransponderOptions(orderedTransponders)
      },
      isBroadbandSatelliteSelected () {
        if (this.selectedSatellites.length > 0) {
          return this.selectedSatellites[0].type === 'Broadband'
        }
        return false
      },
      readyToSubmit () {
        if (this.isBroadbandSatelliteSelected) {
          return this.selectedPaths.length > 0 && this.selectedDefinedContours.length > 0
        }
        return false
      },
      showBroadbandOptions () {
        return this.selectedTransponders.length > 0 && this.isBroadbandSatelliteSelected
      },
      broadbandManual () {
        return this.showBroadbandOptions && !this.copyFromExcel
      }
    },
    methods: {
      async submitContours () {
        this.resetMap()
        // For broadband satellite, select path and beams manually
        if (this.broadbandManual) {
          let query = {
            beams: this.selectedTransponders.map(tp => tp.name), // get names only for broadband = beam
            paths: this.selectedPaths,
            definedContours: this.selectedDefinedContours,
            satellite: this.selectedSatellites[0].name
          }
          let contourResult = await axios.post('/get-defined-contours', query)
          let contours = contourResult.data.contours
          // Setup categories = defined contours
          let categories = this.selectedDefinedContours.map(this.$_definedContourText)
          // Set categories to Vuex Store
          this.$store.dispatch('map/addNewCategories', categories)
          // Add category to each contour line properties
          contours.forEach(c => {
            c.properties.category = this.$_definedContourText(c.properties.definedContour)
          })
          // Set contours to store
          this.$store.dispatch('map/setContours', contours)
          // Expand map
          this.$_expandMap(this.$refs.map.$refs.contourMap)
        }
      },
      launchCopyFromExcelModal () {
        console.log('gg')
      },
      updateSatellites (value) {
        if (typeof value.satellites === 'object') {
          this.selectedSatellites = [value.satellites]
        } else {
          this.selectedSatellites = value.satellites
        }
      },
      updateTransponders (value) {
        this.selectedTransponders = value.transponders
      },
      updatePaths (value) {
        this.selectedPaths = value.paths
      },
      updateDefinedContours (value) {
        this.selectedDefinedContours = value.definedContours
      },
      resetMap () {
        this.$store.dispatch('map/resetMap')
      }
    }
  }
</script>
