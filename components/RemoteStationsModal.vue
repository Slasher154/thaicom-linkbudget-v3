<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{title}}</p>
      </header>
      <section class="modal-card-body">
        <!-- Example table of desired locations format -->
        <table class="table is-bordered">
          <thead>
          <tr>
            <th>Location Name</th>
            <th>Country</th>
            <th>Coordinates</th>
            <th>Antenna</th>
            <th>BUC</th>
            <th>Bandwidth</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="station in stations">
            <td>{{station.locationName}}</td>
            <td>{{station.country}}</td>
            <td>{{station.coords.lat}},{{station.coords.lng}}</td>
            <td>{{station.antenna}}</td>
            <td>{{station.buc}}</td>
            <td>{{station.bandwidth}}</td>
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
    }
  }
</script>

<style scoped>
  .modal-card {
    width: auto;
  }
</style>

