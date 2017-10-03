<template>
  <div>
    <multiselect v-model="selectedSatellites"
                 :options="satelliteOptions"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="false"
                 :hide-selected="true"
                 :custom-label="satelliteWithSlot"
                 placeholder="Pick 1 or more satellites"
                 track-by="name"
                 @input="onChanged"
    >
    </multiselect>
  </div>
</template>

<script>
  /* eslint-disable camelcase */

  import Multiselect from 'vue-multiselect'
  export default {
    components: { Multiselect },
    props: {
      satelliteOptions: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        required: true,
        default: false
      },
      defaultSelectedSatellites: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        value: [
          { name: 'Vue.js', language: 'JavaScript' }
        ],
        selectedSatellites: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('satellites-changed', { satellites: this.selectedSatellites })
      },
      satelliteWithSlot ({ name, orbital_slot }) {
        return `${name} (${this.$_convertOrbitalSlotToLetter(orbital_slot)})`
      }
    },
    mounted () {
      this.selectedSatellites = this.defaultSelectedSatellites || []
    },
    watch: {
      defaultSelectedSatellites (newValue) {
        this.selectedSatellites = newValue
      }
    }
  }
</script>

