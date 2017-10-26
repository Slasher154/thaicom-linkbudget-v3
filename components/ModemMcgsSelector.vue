<template>
  <div>
    <multiselect v-model="selectedMcgs"
                 :options="mcgOptions"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="true"
                 :hide-selected="true"
                 :placeholder="placeholder"
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
      mcgOptions: {
        type: Array,
        required: true
      },
      defaultSelectedMcgs: {
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: 'Pick your MCG(s)'
      }
    },
    data () {
      return {
        selectedMcgs: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('mcgs-changed', { mcgs: this.selectedMcgs })
      }
    },
    mounted () {
      this.selectedMcgs = this.defaultSelectedMcgs || []
    },
    watch: {
      defaultSelectedMcgs (newValue) {
        this.selectedMcgs = newValue
      }
    }
  }
</script>

