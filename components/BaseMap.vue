<template>
  <div>
    <div class="columns">
      <div class="column is-9">
        <gmap-map
          :center="center"
          :zoom="zoom"
          :style="mapStyle"
          :options="mapOptions"
          ref="contourMap">
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
      <!-- Map Legends / places column -->
      <div class="column is-3">
        <h4 class="title is-4" style="text-decoration: underline">Map Legends</h4>
        <div class="map-legends">
          <results-map-legend
            v-for="category in $store.state.map.categories"
            :item="category"
            :key="category.index" />
        </div>

        <p v-if="$store.state.map.categories.length == 0">There is no legend yet. It will appear when contours are added.
        </p>
        <br>
        <b-field grouped group-multiline
          v-if="$store.state.map.beamLabels.length > 0"
        >
          <p class="control">
            <button
              class="button is-info"
              @click="toggleBeamLabels(true)"
            >Show Beam Labels</button>
          </p>
          <p class="control">
            <button
              class="button is-danger"
              @click="toggleBeamLabels(false)"
            >Hide Beam Labels</button>
          </p>
        </b-field>
        <br>
        <h4 class="title is-4" style="text-decoration: underline">Places</h4>
        <b-table
          v-if="$store.state.map.places.length > 0"
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
        <p v-else>
          There is no place yet. Click 'Add marker' to add one.
        </p>
        <br>
        <b-field grouped group-multiline>
          <p class="control">
            <button
              class="button is-warning"
              @click="isLatLonImporterModalActive = true"
            >Add marker(s)</button>
          </p>
          <p class="control">
            <button
              v-if="$store.state.map.places.length > 0"
              class="button is-danger"
              @click="removeMarkers"
            >Remove Markers</button>
          </p>
        </b-field>

        <b-modal :active.sync="isLatLonImporterModalActive" has-modal-card>
          <base-lat-lon-importer-modal
            title="Add Markers"
            @locationsAdded="addMarkersFromExcel"
          />
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
  import ResultsMapLegend from './ResultsMapLegend'
  import BaseLatLonImporterModal from './BaseLatLonImporterModal'
  export default {
    components: {
      ResultsMapLegend,
      BaseLatLonImporterModal
    },
    props: {
      center: {
        type: Object,
        default () {
          return {
            lat: 13.8602,
            lng: 100.5129
          }
        }
      },
      zoom: {
        type: Number,
        default: 5
      },
      height: {
        type: Number,
        default: 700
      }
    },
    data () {
      return {
        isLatLonImporterModalActive: false
      }
    },
    computed: {
      mapStyle () {
        return `width: 100%; height: ${this.height}px;`
      },
      mapOptions () {
        return {
          fullscreenControl: true
        }
      }
    },
    methods: {
      addMarkersFromExcel (value) {
        let locations = value.locations
        if (locations) {
          // Extract location and position of the user input locations
          this.$store.dispatch('map/addNewPlaces', locations.map(loc => {
            return {
              name: loc.name,
              position: {
                lat: loc.lat,
                lng: loc.lon
              },
              showOnMap: true
            }
          }))
          this.$_expandMap(this.$refs.contourMap)
        }
      },
      removeMarkers () {
        this.$store.dispatch('map/removeAllPlaces')
      },
      toggleBeamLabels (showLabel) {
        this.$store.dispatch('map/toggleBeamLabels', showLabel)
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
      }
    }
  }
</script>

<style>
  /*.map-container {*/
    /*width: 500px;*/
    /*height: 300px;*/
  /*}*/
  .map-legends {
    display: grid;
    grid-row-gap: .5rem;
  }
</style>
