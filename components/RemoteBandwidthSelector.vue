<template>
    <b-field>
      <b-select placeholder="Unit" v-model="unit">
        <option value="kbps">kbps</option>
        <option value="Mbps">Mbps</option>
        <option value="kHz">kHz</option>
        <option value="MHz">MHz</option>
        <option value="ksps">ksps</option>
        <option value="Msps">Msps</option>
      </b-select>
      <b-input
        type="text"
        :placeholder="placeholder"
        v-model="bandwidth"
        @keyup.enter.native="addBandwidth"
      ></b-input>
      <p class="control">
        <button
          class="button is-success"
          @click="addBandwidth"
        >Add</button>
      </p>
    </b-field>
</template>

<script>
  export default {
    data () {
      return {
        placeholder: 'Ex. 4/2',
        bandwidth: '',
        unit: 'Mbps',
        id: 1
      }
    },
    methods: {
      addBandwidth () {
        let bandwidthText = this.bandwidth

        // Test Regex of bandwidth input
        if (!this.$_validateBandwidthText(bandwidthText)) {
          this.$toast.open(`${bandwidthText} is not a valid bandwidth value`)
        } else {
          // Split the bandwidth into forward and return
          let splitBandwidth = bandwidthText.split('/')
          let bandwidth = {
            id: this.id++,
            forward: +splitBandwidth[0],
            return: +splitBandwidth[1],
            unit: this.unit
          }
          this.$emit('bandwidthAdded', { bandwidth })

          // clear the number
          this.bandwidth = ''
          this.placeholder = ''
        }
      }
    }
  }
</script>
