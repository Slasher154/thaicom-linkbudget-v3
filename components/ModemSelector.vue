<template>
  <multiselect v-model="selectedModems"
               :options="modemOptions"
               :multiple="multiple"
               :close-on-select="true"
               :clear-on-select="false"
               :hide-selected="true"
               :disabled="isDisabled"
               group-values="modems"
               group-label="category"
               placeholder="Pick 1 or more modems"
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
</template>

<script>
  /* eslint-disable camelcase */

  import Multiselect from 'vue-multiselect'
  export default {
    components: { Multiselect },
    props: {
      modemOptions: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        required: true,
        default: false
      },
      defaultSelectedModems: {
        type: Array,
        default: () => []
      },
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedModems: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('modems-changed', { modems: this.selectedModems })
      }
    },
    mounted () {
      this.selectedModems = this.defaultSelectedModems || []
    },
    watch: {
      defaultSelectedTransponders (newValue) {
        this.selectedModems = newValue
        this.$emit('modems-changed', { modems: this.selectedModems })
      }
    }
  }
</script>


