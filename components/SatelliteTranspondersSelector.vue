<template>
  <multiselect v-model="selectedTransponders"
               :options="transponderOptions"
               :multiple="true"
               :close-on-select="false"
               :clear-on-select="false"
               :hide-selected="true"
               :disabled="isDisabled"
               group-values="transponders"
               group-label="category"
               placeholder="Pick 1 or more transponders"
               track-by="name"
               label="name"
               @input="onChanged"
  >
  </multiselect>
</template>

<script>
  /* eslint-disable camelcase */

  import Multiselect from 'vue-multiselect'
  export default {
    components: { Multiselect },
    props: {
      transponderOptions: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        required: true,
        default: false
      },
      defaultSelectedTransponders: {
        type: Array,
        default: []
      },
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedTransponders: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('transponders-changed', { transponders: this.selectedTransponders })
      },
      transponderLabel ({ name, uplink_beam, downlink_beam, satellite }) {
        return `${name}`
      }
    },
    mounted () {
      this.selectedTransponders = this.defaultSelectedTransponders || []
    },
    watch: {
      defaultSelectedTransponders (newValue) {
        this.selectedTransponders = newValue
      }
    }
  }
</script>

