<template>
  <div>
    <results-map-filter-container
      v-if="$store.state.map.forwardContours.length > 0"
      path="forward" />
    <div class="columns">
      <div class="column is-9">
        <gmap-map :center="center" :zoom="zoom" :style="mapStyle" ref="contourMap">
          <gmap-marker
            v-for="(m, index) in $store.state.map.places"
            v-if="m.showOnMap"
            :key="index"
            :position="m.position"
          >
          </gmap-marker>
          <gmap-polygon
            v-for="(p, index) in $store.state.map.forwardContours"
            v-if="p.showOnMap"
            :key="index"
            :options="p.options"
            :path="p.path"
          >
          </gmap-polygon>
          <gmap-polygon
            v-for="(p, index) in $store.state.map.returnContours"
            v-if="p.showOnMap"
            :key="index"
            :options="p.options"
            :path="p.path"
          >
          </gmap-polygon>
        </gmap-map>
      </div>
      <div class="column is-3">
        <button class="button is-primary" @click="loadMap">Load map</button>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-undef */ // Suppress due to 'google is not defined' error (vue2-google maps package add google maps library so it's not defined in this file)

  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import _ from 'lodash'
  import ResultsMapFilterContainer from './ResultsMapFilterContainer'
  import { Compact } from 'vue-color'
  export default {
    components: {
      ResultsMapFilterContainer,
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
        paths.forEach(path => {
          this.$store.state.map[path + 'Contours'].forEach(contour => {
            contour.path.forEach(point => {
              bounds.extend(point)
            })
          })
        })
        this.$refs.contourMap.fitBounds(bounds)
        this.$refs.contourMap.resizePreserveCenter()
      },
      async fetchContourFromDatabaseAndSetToStore (contourObjects, path) {
        try {
          let results = await axios.post('/get-contour-lines', {contourObjects})
          console.log(JSON.stringify(results.data.contours))
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
