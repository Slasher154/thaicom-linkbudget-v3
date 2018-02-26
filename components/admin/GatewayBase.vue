<template>
  <div class="column is-12">
    <b-field
      horizontal
      label="Name"
    >
      <b-input
        v-model="newGateway.name"
        name="gatewayName"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="City"
    >
      <b-input
        v-model="newGateway.city"
        name="gatewayCity"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Country"
    >
      <b-input
        v-model="newGateway.country"
        name="gatewayCountry"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Latitude (+/-)"
    >
      <b-input
        v-model.number="newGateway.lat"
        name="gatewayLat"
        step="0.0001"
        min="-90"
        max="90"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Longitude (+/-)"
    >
      <b-input
        v-model.number="newGateway.lon"
        name="gatewayLon"
        step="0.0001"
        min="-180"
        max="180"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Default Gateway Availability (%)"
    >
      <b-input
        v-model.number="newGateway.gateway_availability"
        name="gatewayAvailability"
        step="0.01"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Default Remote Availability (%)"
    >
      <b-input
        v-model.number="newGateway.remote_availability"
        name="remoteAvailability"
        step="0.01"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Antenna Size (m)"
    >
      <b-input
        v-model.number="newGateway.ant_size"
        name="gatewayAntSize"
        step="0.1"
      >
      </b-input>
    </b-field>
    <!-- Site diversity -->

  </div>
</template>

<script>
  export default {
    props: {
      gateway: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        newGateway: {
          name: '',
          city: '',
          country: '',
          lat: 0,
          lon: 0,
          gateway_availability: 99.5,
          remote_availability: 99.5,
          ant_size: 8.1,
          hpa: {
            type: 'hpa',
            size: 500,
            obo: 4,
            ifl: 2,
            intermod: 25,
            upc: 5,
            intermod_rain: 19
          },
          siteDiversity: {
            name: '',
            city: '',
            country: '',
            lat: 0,
            lon: 0,
            gateway_availability: 99.5,
            remote_availability: 99.5,
            ant_size: 8.1,
            distance_from_main: 40,
            hpa: {
              type: 'hpa',
              size: 500,
              obo: 4,
              ifl: 2,
              intermod: 25,
              upc: 5,
              intermod_rain: 19
            }
          }
        }
      }
    },
    mounted () {
      if (this.gateway.name) {
        this.newGateway = Object.assign({}, this.gateway)
      }
    },
    methods: {
      emitGateway (newGateway) {
        // construct gateway object
        let gateway = Object.assign({}, newGateway)
        this.$emit('gatewayChanged', gateway)
      }
    },
    watch: {
      gateway (newVal) {
        this.newGateway = newVal
      },
      newGateway: {
        handler (newVal) {
          this.emitGateway(newVal)
        },
        deep: true
      }
    }
  }
</script>
