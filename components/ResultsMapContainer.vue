<template>
  <div>
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
            v-for="(p, index) in $store.state.map.contours"
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
  export default {
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
        path: 'forward'
      }
    },
    methods: {
      loadMap () {
        this.$refs.contourMap.resizePreserveCenter()
        let contourObjects = this.transformLinkResultsToContourObjectsQuery(this.path)
        this.fetchContourFromDatabaseAndSetToStore(contourObjects)
        this.expandMapToShowAllContours()
      },
      transformLinkResultsToContourObjectsQuery (path) {
        // Get the link results which is used to show in the results table
        let linkResults = this.linkResultsTableData(path)
        return linkResults.map(this.convertLinkResultsToQueryObject)
      },
      convertLinkResultsToQueryObject (linkResult) {
        // console.log(JSON.stringify(linkResult, undefined, 2))
        let link = 'downlink'
        if (this.path === 'return') {
          link = 'uplink'
        }
        let query = {
          name: linkResult.channelClear,
          satellite: linkResult.satelliteName,
          path: this.path,
          contourValue: linkResult[link + 'ContourClear']
        }
        // console.log(JSON.stringify(query))
        return query
      },
      expandMapToShowAllContours () { // Fit the map bounds to all polygons
        // Obtain the map bounds
        let bounds = new google.maps.LatLngBounds()
        // let bounds = this.$refs.contourMap.$mapObject.getBounds()
        this.$store.state.map.contours.forEach(contour => {
          contour.path.forEach(point => {
            bounds.extend(point)
          })
        })
        this.$refs.contourMap.fitBounds(bounds)
      },
      async fetchContourFromDatabaseAndSetToStore (contourObjects) {
        try {
          let results = await axios.post('/get-contour-lines', {contourObjects})
          console.log(JSON.stringify(results.data.contours))
          let geojsonObjects = results.data.contours
          // Set this value to map store
          this.$store.dispatch('map/setAndConvertGeojsonToVueGoogleMaps', {geojsonObjects})
        } catch (e) {
          console.log(e)
        }
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'linkResultsTableData'
      ]),
      mapStyle () {
        return `width: 100%; height: ${this.height}px;`
      }
    }
  }
</script>
