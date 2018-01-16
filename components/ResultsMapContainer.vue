<template>
  <div>
    <!-- Show filter if only it's finding max contour and there are any contour lines -->
    <results-map-filter-container
      v-if="$store.state.map.forwardContours.length > 0 && $store.state.linkcalc.findMaxCoverage"
      path="forward" />
    <div class="columns">
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
          <gmap-polygon
            v-for="(p, index) in $store.state.map.returnContours"
            v-if="p.showOnMap"
            :key="index"
            :options="p.options"
            :paths="p.paths"
          >
          </gmap-polygon>
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
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-undef,spaced-comment */ // Suppress due to 'google is not defined' error (vue2-google maps package add google maps library so it's not defined in this file)

  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import _ from 'lodash'
  import ResultsMapFilterContainer from './ResultsMapFilterContainer'
  import ResultsMapLegend from './ResultsMapLegend'
  import { Compact } from 'vue-color'
  export default {
    components: {
      ResultsMapFilterContainer,
      ResultsMapLegend,
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
    methods: {
      async loadMap () {
        // Fetch contours from database and display on map
        this.$refs.contourMap.resizePreserveCenter()
        let contourObjects = this.transformLinkResultsToContourObjectsQuery(this.path)
        await this.fetchContourFromDatabaseAndSetToStore(contourObjects, this.path)
        this.expandMapToShowAllContours()
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
          this.expandMapToShowAllContours()
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
          this.expandMapToShowAllContours()
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
          this.expandMapToShowAllContours()
        }
      },
      transformLinkResultsToContourObjectsQuery (path) {
        // Get the link results which is used to show in the results table
        let linkResults = this.linkResultsTableData(path)
        return linkResults.map(this.convertLinkResultsToQueryObject)
      },
      convertLinkResultsToQueryObject (linkResult) {
        // console.log(JSON.stringify(linkResult, undefined, 2))
        let query = {
          name: linkResult.channelClear,
          satellite: linkResult.satelliteName,
          path: this.path,
          contourValue: linkResult[this.link + 'ContourClear']
        }
        // console.log(JSON.stringify(query))
        return query
      },
      expandMapToShowAllContours () { // Fit the map bounds to all polygons
        // Obtain the map bounds
        let bounds = new google.maps.LatLngBounds()
        // let bounds = this.$refs.contourMap.$mapObject.getBounds()
        let paths = ['forward', 'return']
        /*paths.forEach(path => {
          this.$store.state.map[path + 'Contours'].forEach(contour => {
            contour.paths.forEach(point => {
              bounds.extend(point)
            })
          })
        })*/
        paths.forEach(p => {
          this.$store.state.map[p + 'Contours'].forEach(contour => {
            contour.paths.forEach(contourPath => {
              contourPath.forEach(point => {
                bounds.extend(point)
              })
            })
          })
        })
        this.$refs.contourMap.fitBounds(bounds)
        this.$refs.contourMap.resizePreserveCenter()
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
          this.$store.dispatch('map/setupFiltersAndCategories', path)
        } catch (e) {
          console.log(e)
        }
      },
      constructGoogleDynamicBeamLabelIcon (beamName) {
        let googleChartsUrl = 'https://chart.googleapis.com/chart?'
        let bubbleStyle = 'd_bubble_text_small'
        let frameStyle = 'bbT' // Balloon frame, no tail
        let text = beamName.split(' ').join('+') // Text in dynamic icon URL with spaces must be joint by +
        let fillColor = 'C6EF8C'
        let textColor = '000000'
        let chldSyntax = `${frameStyle}|${text}|${fillColor}|${textColor}`
        return `${googleChartsUrl}chst=${bubbleStyle}&chld=${chldSyntax}`
      },
      toggleBeamLabel () {
        this.$store.dispatch('map/toggleBeamLabel')
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'linkResultsTableData'
      ]),
      link () {
        if (this.path === 'forward') {
          return 'downlink'
        } else {
          return 'uplink'
        }
      },
      mapStyle () {
        return `width: 100%; height: ${this.height}px;`
      }
    }
  }
</script>
