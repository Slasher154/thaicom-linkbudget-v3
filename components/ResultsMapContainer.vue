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
            <button class="button is-info" @click="toggleContours('forward')">Show/Hide FWD</button>
          </p>
          <p class="control">
            <button class="button is-info" @click="toggleContours('return')">Show/Hide RTN</button>
          </p>
          <p class="control">
            <button class="button is-warning" @click="showEocLines">Show EOC Lines</button>
          </p>
          <p class="control">
            <button class="button is-primary" @click="loadMap">Reload map</button>
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
    <base-map ref="map"/>
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
        col: [],
        places: [],
        showPathGroup: ['forward', 'return']
      }
    },
    async mounted () {
      this.loadMap()
    },
    methods: {
      async loadMap () {
        // Reset all elements on map
        this.$store.dispatch('map/resetMap')
        // Clear the places
        this.places = []
        // Check if there is a link budget result in the store
        let linkResults = this.$store.state.linkcalc.linkResults
        if (linkResults) {
          for (let path of ['forward', 'return']) {
            let contourObjects = this.transformLinkResultsToContourObjectsQuery(path)
            if (contourObjects.length > 0) {
              await this.fetchContourFromDatabaseAndSetToStore(contourObjects, path)
            }
            // Add places
            this.addPlacesFromLinkResults(path)
          }
          // Add Places to map
          this.$store.dispatch('map/addNewPlaces', _.uniqBy(this.places, p => {
            return p.name + ' ' + p.position.lat + ' ' + p.position.lng
          }))
          this.expandMap()
        } else {
          console.log('Result not found')
        }
      },
      async showEocLines () {
        let linkResults = this.$store.state.linkcalc.linkResults
        if (linkResults) {
          for (let path of ['forward', 'return']) {
            let pathResults = linkResults[path + 'LinkResults']
            let transponders = pathResults.map(re => re.assumptions.remoteStation[path + 'Transponder'])
            console.log(JSON.stringify(transponders))
            let uniqueTransponders = _.uniqBy(transponders, tp => {
              return tp.name
            })
            let queryObject = {transponders: uniqueTransponders}
            console.log(JSON.stringify('Query obj = ' + JSON.stringify(queryObject)))
            await this.fetchEocContoursAndSetToStore(queryObject, path)
          }
          this.expandMap()
        }
      },
      async fetchEocContoursAndSetToStore (queryObject, path) {
        try {
          let results = await axios.post('/get-eoc-lines', queryObject)
          console.log('EOC = ' + JSON.stringify(results.data.contours))
          let contours = results.data.contours
          this.$store.dispatch('map/addNewCategories', _.uniq(contours.map(c => c.properties.category)))
          this.$store.dispatch('map/setAndConvertGeojsonToVueGoogleMaps', {geojsonObjects: contours, path})
          //this.$store.dispatch('map/addEocLines', {geojsonObjects: results.data.contours, path: this.path})
        } catch (e) {
          this.$_alertError(e)
        }
      },
      addPlace ({name, position}) {
        this.places.push({
          name,
          position,
          showOnMap: true
        })
      },
      addPlacesFromLinkResults (path) {
        // Get the link results which is used to show in the results table
        let linkResults = this.linkResultsTableData(path)
        // Extract places and push
        let places = _.uniq(linkResults.filter(re => {
          return !re.locationType || (re.locationType !== 'findMaxCoverage' && re.locationType !== 'definedContours')
        }).map(f => {
          return {
            name: f.locationName,
            position: {
              lat: f.locationLat,
              lng: f.locationLon
            }
          }
        }))
        console.log('places = ' + JSON.stringify(places))
        places.forEach(p => this.addPlace(p))
      },
      expandMap () {
        this.$_expandMap(this.$refs.map.$refs.contourMap)
      },
      transformLinkResultsToContourObjectsQuery (path) {
        // Get the link results which is used to show in the results table
        let linkResults = this.linkResultsTableData(path)
        // return linkResults.map(re => this.convertLinkResultsToQueryObject(re, path))
        // Transform to query only the link with station that with type maxContour and definedContour
        // This is basically filtered out location with name since we don't need to show contour of lat/lon locations
        return linkResults.filter(re => {
          return re.locationType === 'definedContours' || re.locationType === 'maxContour'
        }).map(f => this.convertLinkResultsToQueryObject(f, path))
      },
      convertLinkResultsToQueryObject (linkResult, path) {
        let query = {
          name: linkResult.channelClear,
          satellite: linkResult.satelliteName,
          path: path,
          contourValue: linkResult[this.linkText(path) + 'ContourClear']
        }
        // Add category, depending on the link results type.
        // If it's finding max coverage, it's from the combination of fields
        // If it's defined contour (50%, EOC, EOC-2), that becomes the category
        // If the location is lat/lng, there is no category added. (no contour line shown)
        if (linkResult.findMaxCoverage) {
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
        } else if (linkResult.locationType === 'definedContours') {
          query.category = linkResult.locationName
        } else {
          console.log('No category will be added')
        }
        return query
      },
      async fetchContourFromDatabaseAndSetToStore (contourObjects, path) {
        try {
          let results = await axios.post('/get-contour-lines', {contourObjects})
          let geojsonObjects = results.data.contours
          // Construct categories from returned results and set to map
          let categories = _.uniq(geojsonObjects.map(obj => obj.properties.category))
          this.$store.dispatch('map/addNewCategories', categories)
          // Set this value to map store
          this.$store.dispatch('map/setAndConvertGeojsonToVueGoogleMaps', {geojsonObjects, path})
        } catch (e) {
          console.log(e)
        }
      },
      toggleContours (path) {
        this.$store.dispatch('map/toggleContours', path)
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
