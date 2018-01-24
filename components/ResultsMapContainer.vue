<template>
  <div>
    <!-- Show filter if only it's finding max contour and there are any contour lines -->
    <!--<results-map-filter-container
      v-if="$store.state.map.forwardContours.length > 0 && $store.state.linkcalc.findMaxCoverage"
      path="forward" />-->
    <div class="columns">
      <div class="column is-9">
        <b-field grouped group-multiline position="is-right">
          <p class="control">
            <button class="button is-primary" @click="loadMap">Load map</button>
          </p>
        </b-field>
      </div>
    </div>
    <!--<div class="columns">
      <div class="column is-9">
        <gmap-map :center="center" :zoom="zoom" :style="mapStyle" ref="contourMap">
          <gmap-marker
            v-for="(m, index) in $store.state.map.places"
            v-if="m.showOnMap"
            :key="index"
            :position="m.position"
            :label="m.label"
          >
          </gmap-marker>
          <gmap-marker
            v-for="(m, index) in $store.state.map.beamLabels"
            v-if="m.showOnMap"
            :key="index"
            :position="m.position"
            :icon="constructGoogleDynamicBeamLabelIcon(m.text)"
          >
          </gmap-marker>
          <gmap-polygon
            v-for="(p, index) in $store.state.map.forwardContours"
            v-if="p.showOnMap"
            :key="index"
            :options="p.options"
            :paths="p.paths"
          >
          </gmap-polygon>
          <gmap-polyline
            v-for="(p, index) in $store.state.map.returnContours"
            v-if="p.showOnMap"
            :key="index"
            :options="p.options"
            :path="p.path"
          >
          </gmap-polyline>
        </gmap-map>
      </div>
      <div class="column is-3">
          <results-map-legend v-for="(category, index) in $store.state.map.forwardCategories"
                              v-if="category.showOnMap"
                              :key="index"
                              :item="category"
          />
        <div class="field">
          <p class="control">
            <button class="button is-primary" @click="loadMap">Show Max Contours</button>
          </p>
        </div>
        <div class="field"
          v-if="!$store.state.linkcalc.findBestTransponders"
        >
          <p class="control">
            <button class="button is-warning" @click="showEocLinesOfSelectedBeams">Show EOC Linesof selected beams</button>
          </p>
        </div>
        <div class="field"
             v-if="$store.state.linkcalc.findBestTransponders"
        >
          <p class="control">
            <button class="button is-warning" @click="showEocLinesOfFindBestTransponders">Show EOC Lines of all {{$store.state.linkcalc.selectedCountries.join(',')}} beams</button>
          </p>
        </div>
        <div class="field"
             v-if="$store.state.linkcalc.findBestTransponders"
        >
          <p class="control">
            <button class="button is-danger" @click="showFarthestDatabaseLinesOfFindBestTransponders">Show max contour database lines of all {{$store.state.linkcalc.selectedCountries.join(',')}} beams</button>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-success" @click="toggleLocationMarkers">Toggle Location Markers</button>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-info" @click="toggleBeamLabel">Toggle Beam Label</button>
          </p>
        </div>
        <b-table
          :data="$store.state.map.places"
          :bordered="true"
          :striped="true"
          :narrowed="true"
        >
          <template scope="props">
            <b-table-column
              label="Legend"
            >
              {{props.row.label}}
            </b-table-column>
            <b-table-column
              label="Name"
            >
              {{props.row.name}}
            </b-table-column>
          </template>
        </b-table>


      </div>
    </div>-->
    <base-map ref="map" />
  </div>
</template>

<script>
  /* eslint-disable no-undef,spaced-comment */ // Suppress due to 'google is not defined' error (vue2-google maps package add google maps library so it's not defined in this file)

  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import _ from 'lodash'
  import BaseMap from './BaseMap'
  import ResultsMapFilterContainer from './ResultsMapFilterContainer'
  import ResultsMapLegend from './ResultsMapLegend'
  import { Compact } from 'vue-color'
  export default {
    components: {
      ResultsMapFilterContainer,
      ResultsMapLegend,
      BaseMap,
      CompactPicker: Compact
    },
    props: {
      center: {
        type: Object,
        default () {
          return {
            lat: 7,
            lng: 100
          }
        }
      },
      zoom: {
        type: Number,
        default: 7
      },
      height: {
        type: Number,
        default: 700
      }
    },
    data () {
      return {
        path: 'forward',
        colors: {
          hex: '#194d33'
        },
        col: []
      }
    },
    async mounted () {
      this.loadMap()
    },
    methods: {
      async loadMap () {
        // Reset all elements on map
        this.$store.dispatch('map/resetMap')
        // Check if there is a link budget result in the store
        let linkResults = this.$store.state.linkcalc.linkResults
        console.log('Checking link result')
        if (linkResults) {
          console.log('Result found')
          // Check if it's max contour mode
          if (linkResults.assumptions.findMaxCoverage) {
            // Add contours from forward link
            for (let path of ['forward', 'return']) {
              let contourObjects = this.transformLinkResultsToContourObjectsQuery(path)
              await this.fetchContourFromDatabaseAndSetToStore(contourObjects, path)
            }
          } else {

          }
          this.$_expandMap(this.$refs.map.$refs.contourMap)
        } else {
          console.log('Result not found')
        }
      },
      async showEocLinesOfSelectedBeams () {
        // Check if any transponder is selected
        if (this.$store.state.linkcalc.selectedTransponders.length === 0) {
          this.$_alertError('Please select at least 1 transponder')
        } else {
          let queryObject = { transponders: this.$store.state.linkcalc.selectedTransponders }
          await this.fetchEocContoursAndSetToStore(queryObject)
        }
      },
      async showEocLinesOfFindBestTransponders () {
        // Get EOC contours of all beams in selected countries
        if (this.$store.state.linkcalc.selectedCountries.length === 0) {
          this.$_alertError('Please select at least 1 country')
        } else {
          let transpondersToQuery = this.findTranspondersOfSelectedCountries()
          let queryObject = { transponders: transpondersToQuery }
          await this.fetchEocContoursAndSetToStore(queryObject)
        }
      },
      async showFarthestDatabaseLinesOfFindBestTransponders () {
        let transpondersToQuery = this.findTranspondersOfSelectedCountries()
        try {
          this.$refs.contourMap.resizePreserveCenter()
          let results = await axios.post('/get-farthest-database-contours', { transponders: transpondersToQuery })
          this.$store.dispatch('map/addFarthestLines', { geojsonObjects: results.data.contours, path: this.path })
        } catch (e) {
          this.$_alertError(e)
        }
      },
      async fetchEocContoursAndSetToStore (queryObject) {
        try {
          this.$refs.contourMap.resizePreserveCenter()
          let results = await axios.post('/get-eoc-lines', queryObject)
          console.log('EOC = ' + JSON.stringify(results.data.contours))
          this.$store.dispatch('map/addEocLines', { geojsonObjects: results.data.contours, path: this.path })
        } catch (e) {
          this.$_alertError(e)
        }
      },
      toggleLocationMarkers () {
        this.$refs.contourMap.resizePreserveCenter()
        // Extract all locations from the remote stations array
        if (this.$store.state.linkcalc.remoteStations.length === 0) {
          this.$_alertError('There is no remote station to extract the location from')
        } else {
          let uniqueLocations = _.uniq(_.map(this.$store.state.linkcalc.remoteStations, 'location'))
          // Set locations to 'places' in map store
          let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          let places = uniqueLocations.map((loc, index) => {
            return {
              position: {
                lat: loc.lat,
                lng: loc.lon
              },
              showOnMap: true,
              label: labels[index % labels.length],
              name: loc.name
            }
          })
          this.$store.dispatch('map/setPlaces', { places })
        }
      },
      transformLinkResultsToContourObjectsQuery (path) {
        // Get the link results which is used to show in the results table
        let linkResults = this.linkResultsTableData(path)
        return linkResults.map(re => this.convertLinkResultsToQueryObject(re, path))
      },
      convertLinkResultsToQueryObject (linkResult, path) {
        let query = {
          name: linkResult.channelClear,
          satellite: linkResult.satelliteName,
          path: path,
          contourValue: linkResult[this.linkText(path) + 'ContourClear']
        }
        // Add category from the combination of fields
        let fields = this.getFilterFields(path)
        console.log('Fields = ' + fields)
        let category = fields.map(f => {
          // If the field name in the link result doesn't end with 'Clear' (the assumption fields such as buc/antenna)
          // Just use that field, otherwise, add the word clear
          if (_.has(linkResult, f)) {
            return `${linkResult[f]} ${this.findFieldUnit(f)}`
          } else {
            return `${linkResult[f + 'Clear']} ${this.findFieldUnit(f)}`
          }
        }).join('-')
        // console.log(JSON.stringify(query))
        query.category = this.$_pathText(path) + ' - ' + category
        return query
      },
      findTranspondersOfSelectedCountries () {
        let transponders = this.$store.state.linkcalc.transponderOptions
        let countries = this.$store.state.linkcalc.selectedCountries
        return transponders.filter(tp => {
          return countries.includes(tp.country) && tp.type === 'forward' && this.$store.state.linkcalc.selectedSatellites.map(sat => sat.name).includes(tp.satellite)
        })
      },
      async fetchContourFromDatabaseAndSetToStore (contourObjects, path) {
        try {
          let results = await axios.post('/get-contour-lines', {contourObjects})
          let geojsonObjects = results.data.contours
          // Construct categories from returned results and set to map
          let categories = _.uniq(geojsonObjects.map(obj => obj.properties.category))
          this.$store.dispatch('map/addNewCategories', categories)
          // Set this value to map store
          this.$store.dispatch('map/setAndConvertGeojsonToVueGoogleMaps', { geojsonObjects, path })
          //this.$store.dispatch('map/setupFiltersAndCategories', path)
          /*let results = await axios.post('/get-contour-lines', {contourObjects})
          console.log(JSON.stringify(results.data.contours, undefined, 2))
          let geojsonObjects = results.data.contours
          // Loop the link results to re-map the returned contours with link budget results (so we know which contour line belongs to which results
          let linkResults = this.linkResultsTableData(path)
          let geojsonObjectsWithLinkProperties = linkResults.map(g => {
            // Find the respective contour
            let matchedContour = geojsonObjects.find(o => {
              let parameterName = g.satelliteType === 'Broadband' ? 'relativeGain' : 'eirp'
              return o.properties.name === g.channelClear && o.properties.satellite === g.satelliteName && o.properties.path === path && o.properties[parameterName] === g[this.link + 'ContourClear']
            })
            if (matchedContour) {
              let clonedContour = _.cloneDeep(matchedContour)
              // Add properties
              _.assign(clonedContour.properties, {
                mcg: g.mcgNameClear,
                antenna: g.antennaName,
                linkMargin: g.requiredMarginClear,
                dataRate: g.dataRateClear
              })
              if (path === 'return') {
                _.assign(clonedContour.properties, {
                  buc: g.bucName
                })
              }
              return clonedContour
            }
            return false
          })
          // Set this value to map store
          this.$store.dispatch('map/setAndConvertGeojsonToVueGoogleMaps', { geojsonObjects: geojsonObjectsWithLinkProperties, path })
          this.$store.dispatch('map/setupFiltersAndCategories', path)*/
        } catch (e) {
          console.log(e)
        }
      },
      linkText (path) {
        if (path === 'forward') {
          return 'downlink'
        } else {
          return 'uplink'
        }
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'linkResultsTableData',
        'findFieldUnit'
      ]),
      ...mapGetters('map', [
        'getFilterFields'
      ]),
      mapStyle () {
        return `width: 100%; height: ${this.height}px;`
      }
    }
  }
</script>
