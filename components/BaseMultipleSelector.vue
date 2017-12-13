<template>
  <div>
    <multiselect v-model="selectedValues"
                 :options="options"
                 :multiple="true"
                 :close-on-select="false"
                 :clear-on-select="true"
                 :hide-selected="true"
                 :placeholder="placeholder"
                 @input="onChanged"
    >
      <template
        slot="tag"
        scope="props">
        <b-tag
          closable
          size="is-medium"
          @close="props.remove(props.option)"
        >{{props.option}}</b-tag>
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
      options: {
        type: Array,
        required: true
      },
      defaultSelectedValues: {
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: 'Select 1 or more'
      }
    },
    data () {
      return {
        selectedValues: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('values-changed', this.selectedValues)
      }
    },
    mounted () {
      this.selectedValues = this.defaultSelectedValues || []
    },
    watch: {
      defaultSelectedValues (newValue) {
        this.selectedValues = newValue
      }
    }
  }
</script>

