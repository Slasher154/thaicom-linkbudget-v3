<template>
  <div>
    <multiselect v-model="selectedPaths"
                 :options="pathOptions"
                 :multiple="multiple"
                 :close-on-select="true"
                 :clear-on-select="false"
                 :hide-selected="true"
                 select-label=""
                 placeholder="Pick 1 or more paths"
                 label="label"
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
        >{{props.option.label}}</b-tag>
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
      multiple: {
        type: Boolean,
        required: true,
        default: false
      },
      defaultSelectedPaths: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        pathOptions: [{
          name: 'forward',
          label: 'Forward'
        }, {
          name: 'return',
          label: 'Return'
        }],
        selectedPaths: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('paths-changed', { paths: this.selectedPaths.map(x => x.name) })
      }
    },
    mounted () {
      this.selectedPaths = this.defaultSelectedPaths || []
    },
    watch: {
      defaultSelectedPaths (newValue) {
        this.selectedPaths = newValue
      }
    }
  }
</script>


