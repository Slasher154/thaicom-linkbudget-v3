<template>
  <div>
    <multiselect v-model="selectedDefinedContours"
                 :options="definedContourOptions"
                 :multiple="multiple"
                 :close-on-select="false"
                 :clear-on-select="false"
                 :hide-selected="true"
                 select-label=""
                 placeholder="Pick 1 or more defined contours"
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
      defaultSelectedDefinedContours: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        definedContourOptions: [{
          name: '50',
          label: '50%'
        }, {
          name: 'eoc',
          label: 'EOC'
        }, {
          name: 'eoc-2',
          label: 'EOC-2'
        }],
        selectedDefinedContours: []
      }
    },
    methods: {
      onChanged () {
        this.$emit('defined-contours-changed', { definedContours: this.selectedDefinedContours.map(x => x.name) })
      }
    },
    mounted () {
      this.selectedDefinedContours = this.defaultSelectedDefinedContours || []
    },
    watch: {
      defaultSelectedDefinedContours (newValue) {
        this.selectedDefinedContours = newValue
      }
    }
  }
</script>


