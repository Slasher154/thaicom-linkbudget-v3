<template>
  <div>
    <multiselect v-model="selectedSatellites"
                 :options="satelliteOptions"
                 :multiple="multiple"
                 :close-on-select="true"
                 :clear-on-select="true"
                 :hide-selected="true"
                 :custom-label="satelliteWithSlot"
                 select-label=""
                 placeholder="Pick 1 or more satellites"
                 track-by="name"
                 @input="onChanged"
    >
      <template
        slot="tag"
        scope="props">
        <b-tag
          closable
          size="is-medium"
          @close="props.remove(props.option)"
        >{{props.option.name}}</b-tag>
      </template>
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
        default: () => []
      }
    },
    data () {
      return {
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

