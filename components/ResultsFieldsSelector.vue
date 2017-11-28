<template>
  <multiselect v-model="selectedFields"
               :options="fieldOptions"
               :multiple="true"
               :close-on-select="true"
               :clear-on-select="false"
               :hide-selected="true"
               :custom-label="fieldName"
               track-by="name"
               @input="onChanged"
  >
    <template
      slot="tag"
      scope="props">
      <b-tag
        closable
        @close="props.remove(props.option)"
      >{{props.option.name}}</b-tag>
    </template>
  </multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  export default {
    components: { Multiselect },
    props: {
      fieldOptions: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        default: false
      },
      defaultSelectedFields: {
        type: Array,
        default: () => []
      },
      refreshCounter: {
        type: Number
      }
    },
    data () {
      return {
        selectedFields: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('selected-fields-changed', { fields: this.selectedFields })
      },
      fieldName ({ name }) {
        return `${name}`
      }
    },
    mounted () {
      this.selectedFields = this.defaultSelectedFields || []
    },
    watch: {
      defaultSelectedFields (newValue) {
        this.selectedFields = newValue
      },
      refreshCounter () {
        this.selectedFields = []
      }
    }
  }
</script>
