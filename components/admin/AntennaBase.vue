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
    <b-field
      horizontal>
      <button class="button is-info"
        @click="toggleCustomGainvalue"
      >
        <b-icon pack="fa" :icon="customGainValueIcon">
        </b-icon>
        <span>{{customGainValueButtonText}}</span>
      </button>
    </b-field>
    <template
      v-if="showCustomGainValue"
    >
      <b-field
        horizontal
        label="Rx Gain (dBi)"
      >
        <b-input
          v-model.number="customGain.rx_gain.value"
          step="0.01"
          name="rxGain"
        ></b-input>
      </b-field>
      <b-field
        horizontal
        label="Rx Mid-band Frequency (GHz)">
        <b-input
          v-model.number="customGain.rx_gain.freq"
          step="0.001"
          name="rxFreq">
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="Tx Gain (dBi)"
        >
        <b-input
          v-model.number="customGain.tx_gain.value"
          step="0.01"
          name="txGain">
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="Tx Mid-band Frequency (GHz)"
        >
        <b-input
          v-model.number="customGain.tx_gain.freq"
          step="0.001"
          name="txFreq">
        </b-input>
      </b-field>
      <b-field
        horizontal
        label="G/T (dB/K)"
       >
        <b-input
          v-model.number="gt"
          step="0.01"
          name="gt"
          ></b-input>
      </b-field>
      <b-message
        type="is-warning"
        >
        <ul>
          <li>If Rx Gain, Tx Gain and mid-band frequency are given, the program will use this value instead of standard antenna gain formula.</li>
          <li>If G/T is given, the program will use this value instead of standard receive antenna gain formula and the given Rx Gain above. (overrides all)</li>
        </ul>
      </b-message>
    </template>
    <!--<b-field-->
      <!--horizontal>-->
      <!--<button class="button is-warning">-->
        <!--<b-icon pack="fa" icon="area-chart"></b-icon>-->
        <!--<span>Add Antenna Pattern</span>-->
      <!--</button>-->
    <!--</b-field>-->
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
        vendorOptions: [],
        showCustomGainValue: false,
        customGain: {
          tx_gain: {
            value: 0,
            freq: 0
          },
          rx_gain: {
            value: 0,
            freq: 0
          }
        },
        gt: 0
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
        // Set Tx Gain, Rx Gain, G/T
        this.customGain.tx_gain = this.antenna.tx_gain || { value: 0, freq: 0 }
        this.customGain.rx_gain = this.antenna.rx_gain || { value: 0, freq: 0 }
        this.gt = this.antenna.gt || 0
        // Show the custom gain by default if antenna props has one
        if (this.antenna.tx_gain || this.antenna.rx_gain || this.antenna.gt) {
          this.showCustomGainValue = true
        }
      }
    },
    computed: {
      customGainValueButtonText () {
        return this.showCustomGainValue ? 'Hide Custom Gain Value' : 'Add Custom Gain Value'
      },
      customGainValueIcon () {
        return this.showCustomGainValue ? 'minus' : 'plus'
      }
    },
    methods: {
      toggleCustomGainvalue () {
        this.showCustomGainValue = !this.showCustomGainValue
      },
      handleCustomGainValueChange (customGain, gt) {
        if (this.showCustomGainValue) {
          // Clone new antenna in this component and combine with given custom gain object
          let antenna = Object.assign({}, this.newAntenna, customGain)
          if (gt > 0) {
            antenna = Object.assign(antenna, { gt })
          }
          this.emitAntenna(antenna)
        }
      },
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
      customGain: {
        handler (newVal) {
          // If any value inside the custom gain object is changed, construct custom gain object and merge it into new antenna
          this.handleCustomGainValueChange(newVal, this.gt)
        },
        deep: true
      },
      gt (newVal) {
        this.handleCustomGainValueChange(this.customGain, newVal)
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
