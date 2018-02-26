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
    <!-- HPA -->
    <b-field
      horizontal
      label="HPA Size (Watts)"
    >
      <b-input
        v-model.number="newGateway.hpa.size"
        name="gatewayHpaSize"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="HPA Output Backoff (dB)"
    >
      <b-input
        v-model.number="newGateway.hpa.obo"
        name="gatewayHpaObo"
        step="0.1"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Gateway IFL"
    >
      <b-input
        v-model.number="newGateway.hpa.ifl"
        name="gatewayHpaIfl"
        step="0.1"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="HPA Intermodulation at Clear Sky(dB)"
    >
      <b-input
        v-model.number="newGateway.hpa.intermod"
        name="gatewayHpaIntermod"
        step="0.1"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Gateway UPC (dB)"
    >
      <b-input
        v-model.number="newGateway.hpa.upc"
        name="gatewayHpaUpc"
        step="0.1"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="HPA Intermodulation at Rain Fade(dB)"
    >
      <b-input
        v-model.number="newGateway.hpa.intermod_rain"
        name="gatewayHpaIntermodRain"
        step="0.1"
      >
      </b-input>
    </b-field>
    <!-- Site diversity -->

    <b-field
      v-if="!siteDiversity"
      horizontal
      label=""
    >
      <p class="control">
        <button
          @click="addSiteDiversity"
          class="button is-primary">Add Site Diversity</button>
      </p>
    </b-field>
    <b-field
      v-if="siteDiversity"
      horizontal
      label=""
    >
      <p class="control">
        <button
          @click="removeSiteDiversity"
          class="button is-danger">Remove Site Diversity</button>
      </p>
    </b-field>
    <template v-if="siteDiversity">
      <b-field
        horizontal
        label=""
      >
        <span><strong>Site Diversity</strong></span>
      </b-field>
      <b-field
        horizontal
        label="Name"
      >
        <b-input
          v-model="siteDiversity.name"
          name="gatewayName"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="City"
      >
        <b-input
          v-model="siteDiversity.city"
          name="gatewayCity"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="Country"
      >
        <b-input
          v-model="siteDiversity.country"
          name="gatewayCountry"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="Latitude (+/-)"
      >
        <b-input
          v-model.number="siteDiversity.lat"
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
          v-model.number="siteDiversity.lon"
          name="gatewayLon"
          step="0.0001"
          min="-180"
          max="180"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="Antenna Size (m)"
      >
        <b-input
          v-model.number="siteDiversity.ant_size"
          name="gatewayAntSize"
          step="0.1"
        >
        </b-input>
      </b-field>
      <!-- HPA -->
      <b-field
        horizontal
        label="HPA Size (Watts)"
      >
        <b-input
          v-model.number="siteDiversity.hpa.size"
          name="gatewayHpaSize"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="HPA Output Backoff (dB)"
      >
        <b-input
          v-model.number="siteDiversity.hpa.obo"
          name="gatewayHpaObo"
          step="0.1"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="Gateway IFL"
      >
        <b-input
          v-model.number="siteDiversity.hpa.ifl"
          name="gatewayHpaIfl"
          step="0.1"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="HPA Intermodulation at Clear Sky(dB)"
      >
        <b-input
          v-model.number="siteDiversity.hpa.intermod"
          name="gatewayHpaIntermod"
          step="0.1"
        >
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="HPA Intermodulation at Rain Fade(dB)"
      >
        <b-input
          v-model.number="siteDiversity.hpa.intermod_rain"
          name="gatewayHpaIntermodRain"
          step="0.1"
        >
        </b-input>
      </b-field>
    </template>

  </div>
</template>

<script>
  import _ from 'lodash'
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
          }
        },
        siteDiversity: null,
        siteDiversityTemplate: {
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
    },
    mounted () {
      if (this.gateway.name) {
        this.newGateway = Object.assign({}, this.gateway)
        if (_.has(this.gateway, 'site_diversity')) {
          this.siteDiversity = this.gateway.site_diversity
        }
      }
    },
    methods: {
      emitGateway (newGateway, newDiversity) {
        // construct gateway object
        let gateway = Object.assign({}, newGateway)
        if (newDiversity) {
          gateway.site_diversity = newDiversity
        } else {
          // if diversity gateway does not exist = don't want diversity gateway anymore, remove it from properties
          gateway = _.omit(gateway, 'site_diversity')
        }
        this.$emit('gatewayChanged', gateway)
      },
      addSiteDiversity () {
        let siteDiversity = Object.assign({}, this.siteDiversityTemplate)
        this.siteDiversity = siteDiversity
      },
      removeSiteDiversity () {
        this.siteDiversity = null
      }
    },
    watch: {
      gateway (newVal) {
        this.newGateway = newVal
        if (_.has(this.gateway, 'site_diversity')) {
          this.siteDiversity = this.gateway.site_diversity
        }
      },
      newGateway: {
        handler (newVal) {
          this.emitGateway(newVal, this.siteDiversity)
        },
        deep: true
      },
      siteDiversity: {
        handler (newVal) {
          this.emitGateway(this.newGateway, newVal)
        },
        deep: true
      }
    }
  }
</script>
