<template>
  <div class="column is-12">
    <b-field
      horizontal
      label="Name"
    >
      <b-input
        v-model="newAntenna.name"
        name="antennaName"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Vendor">
      <b-select
        v-model="newAntenna.vendor">
        <option
          v-for="(vendor, index) in vendorOptions"
          :value="vendor"
          :key="index"
          >{{vendor}}</option>
      </b-select>
    </b-field>
    <b-field
      horizontal
      label="Size (m)"
      >
      <b-input
        v-model.number="newAntenna.size"
        name="antennaSize"
        step="0.1"
      >
      </b-input>
    </b-field>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    props: {
      antenna: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        newAntenna: {
          name: '',
          vendor: 'Standard',
          size: 1.2
        },
        vendorOptions: []
      }
    },
    async created () {
      try {
        let result = await axios.get('/antenna-vendors')
        this.vendorOptions = result.data.antennaVendors.map(x => x.name)
      } catch (e) {
        console.log(e)
      }
    },
    mounted () {
      if (this.antenna.name && this.antenna.vendor) {
        this.newAntenna = Object.assign({}, this.antenna)
      }
    },
    methods: {
      emitAntenna (newAntenna) {
        // construct antenna object
        let antenna = Object.assign({}, newAntenna)
        this.$emit('antennaChanged', antenna)
      }
    },
    watch: {
      antenna (newVal) {
        this.newAntenna = newVal
      },
      newAntenna: {
        handler (newVal) {
          this.emitAntenna(newVal)
        },
        deep: true
      }
    }
  }
</script>
