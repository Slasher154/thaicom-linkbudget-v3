<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{titleWithNumberOfStations}}</p>
      </header>
      <section class="modal-card-body">
        <!-- Example table of desired locations format -->
        <table class="table is-bordered">
          <thead>
          <tr>
            <th>No.</th>
            <th>Location Name</th>
            <th>Country</th>
            <th>Coordinates (Lat, Lon)</th>
            <th>Antenna</th>
            <th>BUC</th>
            <th>Bandwidth</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(station, index) in stations">
            <td>{{index+1}}</td>
            <td>{{station.location.name}}</td>
            <td>{{station.location.country}}</td>
            <td>{{station.location.lat}},{{station.location.lon}}</td>
            <td>{{station.antenna.name}}</td>
            <td>{{station.buc.name}}</td>
            <td>{{station.bandwidth | transformToBandwidthText }}</td>
          </tr>
          </tbody>
        </table>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
      </footer>
    </div>
  </form>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Import your coordinates'
      },
      stations: {
        type: Array,
        default: []
      }
    },
    computed: {
      titleWithNumberOfStations () {
        return `${this.title} (${this.stations.length} Stations)`
      }
    }
  }
</script>

<style scoped>
  .modal-card {
    width: auto;
  }
</style>

