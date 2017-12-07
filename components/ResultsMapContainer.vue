<template>
  <div>
    <div class="columns">
      <div class="column is-9">
        <gmap-map :center="center" :zoom="zoom" :style="mapStyle" ref="contourMap">
          <gmap-marker
            v-for="(m, index) in $store.state.map.contours"
            v-if="m.showOnMap"
            :key="index"
            :position="m.position"
          >
          </gmap-marker>
        </gmap-map>
      </div>
      <div class="column is-3">
        <button class="button is-primary" @click="resize">Load map</button>
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
        default: 13
      },
      height: {
        type: Number,
        default: 700
      }
    },
    methods: {
      resize () {
        this.$refs.contourMap.resizePreserveCenter()
      }
    },
    computed: {
      mapStyle () {
        return `width: 100%; height: ${this.height}px;`
      }
    }
  }
</script>
