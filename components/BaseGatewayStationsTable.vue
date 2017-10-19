<template>
  <table class="table is-bordered">
    <thead>
    <tr>
      <th>Location Name</th>
      <th>Country</th>
      <th>{{coordsText}}</th>
      <th>Antenna (m)</th>
      <th>HPA (Watts)</th>
      <th>Input Feed Loss (dB)</th>
      <th>HPA Output Backoff (dB)</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="station in stations">
      <td>{{station.location.name}}</td>
      <td>{{station.location.country}}</td>
      <td>{{station.location | transformCoords(latLonFormat)}}</td>
      <td>{{station.antenna.size}}</td>
      <td>{{station.hpa.size}}</td>
      <td>{{station.ifl}}</td>
      <td>{{station.obo}}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      stations: {
        type: Array,
        default: []
      },
      latLonFormat: {
        type: String,
        default: 'latLon'
      },
      coordsText: {
        type: String,
        default: 'Latitude, Longitude'
      }
    }
  }
</script>
