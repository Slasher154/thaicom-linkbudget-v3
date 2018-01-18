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
    </div>
  </div>
</template>

<script>
  export default {
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
    computed: {
      mapStyle () {
        return `width: 100%; height: ${this.height}px;`
      }
    }
  }
</script>

<style>
  /*.map-container {*/
    /*width: 500px;*/
    /*height: 300px;*/
  /*}*/
</style>
