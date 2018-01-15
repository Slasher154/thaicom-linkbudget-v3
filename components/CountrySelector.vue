<template>
  <div>
    <multiselect v-model="selectedCountries"
                 :options="countryOptions"
                 :multiple="true"
                 :close-on-select="true"
                 :clear-on-select="false"
                 :hide-selected="true"
                 placeholder="Pick 1 or more countries"
                 track-by="name"
                 label="name"
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
      countryOptions: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        required: true,
        default: false
      },
      defaultSelectedCountries: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        selectedCountries: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('countries-changed', { countries: this.selectedCountries })
      },
      satelliteWithSlot ({ name, orbital_slot }) {
        return `${name} (${this.$_convertOrbitalSlotToLetter(orbital_slot)})`
      }
    },
    mounted () {
      this.selectedCountries = this.defaultSelectedCountries || []
    },
    watch: {
      defaultSelectedCountries (newValue) {
        this.selectedCountries = newValue
      }
    }
  }
</script>

