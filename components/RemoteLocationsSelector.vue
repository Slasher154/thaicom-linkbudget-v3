<template>
  <div>
    <multiselect v-model="selectedLocations"
                 :options="locationOptions"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="true"
                 :hide-selected="true"
                 placeholder="Pick 1 or more locations"
                 label="name"
                 track-by="name"
                 @input="onChanged"
    >
      <template
        slot="tag"
        scope="props"
      >
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
      locationOptions: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        required: true,
        default: true
      },
      defaultSelectedLocations: {
        type: Array,
        default: []
      },
      selectedLocationsFromOutside: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        selectedLocations: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('locations-changed', { locations: this.selectedLocations })
      }
    },
    mounted () {
      this.selectedLocations = this.defaultSelectedLocations || []
    },
    watch: {
      defaultSelectedLocations (newValue) {
        this.selectedLocations = newValue
      },
      selectedLocationsFromOutside (newValue) {
        newValue.forEach(location => {
          this.selectedLocations.push(location)
        })
        this.$emit('locations-changed', { locations: this.selectedLocations })
      }
    }
  }
</script>

