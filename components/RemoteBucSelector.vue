<template>
  <div>
    <multiselect v-model="selectedBucs"
                 :options="bucOptions"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="true"
                 :hide-selected="true"
                 placeholder="Pick 1 or more bucs"
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
      bucOptions: {
        type: Array,
        required: true
      },
      defaultSelectedBucs: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        selectedBucs: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('bucs-changed', { bucs: this.selectedBucs })
      }
    },
    mounted () {
      this.selectedBucs = this.defaultSelectedBucs || []
    },
    watch: {
      defaultSelectedBucs (newValue) {
        this.selectedBucs = newValue
      }
    }
  }
</script>
