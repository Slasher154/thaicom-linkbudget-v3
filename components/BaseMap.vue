<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">MAPS</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="map-container">
          <gmap-map :center="center" :zoom="zoom" :style="mapStyle">
            <!--<gmap-marker :position="{lat:1.38, lng:103.8}">-->
            <!--</gmap-marker>-->
            <!--<gmap-info-window :position="{lat:1.38, lng:103.8}">-->
              <!--Hello world!-->
            <!--</gmap-info-window>-->
          </gmap-map>
        </div>
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
        default: 300
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
