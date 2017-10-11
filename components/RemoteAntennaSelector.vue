<template>
  <div>
    <multiselect v-model="selectedAntennas"
                 :options="antennaOptions"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="true"
                 :hide-selected="true"
                 placeholder="Pick 1 or more antennas"
                 label="name"
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
      antennaOptions: {
        type: Array,
        required: true
      },
      defaultSelectedAntennas: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        selectedAntennas: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('antennas-changed', { antennas: this.selectedAntennas })
      }
    },
    mounted () {
      this.selectedAntennas = this.defaultSelectedAntennas || []
    },
    watch: {
      defaultSelectedAntennas (newValue) {
        this.selectedAntennas = newValue
      }
    }
  }
</script>
