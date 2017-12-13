<template>
  <div class="columns">
    <div class="column is-3">
      <b-field label="MCG">
        <base-multiple-selector
          :options="mcgOptions"
          :defaultSelectedValues="mcgOptions"
          @values-changed="updateFieldToStore('mcgs', ...arguments)"
        />
      </b-field>
    </div>
    <div class="column is-3">
      <b-field label="Antenna">
        <base-multiple-selector
          :options="antennaOptions"
          :defaultSelectedValues="antennaOptions"
          @values-changed="updateFieldToStore('antennas', ...arguments)"
        />
        <!--About ...arguments https://github.com/vuejs/vue/issues/5527 -->
      </b-field>
    </div>
    <div class="column is-3">
      <b-field label="Link Margin (dB)">
        <base-multiple-selector
          :options="linkMarginOptions"
          :defaultSelectedValues="linkMarginOptions"
          @values-changed="updateFieldToStore('linkMargins', ...arguments)"
        />
        <!--About ...arguments https://github.com/vuejs/vue/issues/5527 -->
      </b-field>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BaseMultipleSelector from './BaseMultipleSelector'
  import ModemMcgsSelector from './ModemMcgsSelector'
  export default {
    components: {
      BaseMultipleSelector,
      ModemMcgsSelector
    },
    props: {
      path: {
        type: String,
        required: true,
        default: 'forward'
      }
    },
    computed: {
      ...mapGetters('map', [
        'extractFieldsForSelector'
      ]),
      antennaOptions () {
        return this.extractFieldsForSelector('antenna', this.path)
      },
      dataRateOptions () {
        return this.extractFieldsForSelector('dataRate', this.path)
      },
      linkMarginOptions () {
        return this.extractFieldsForSelector('linkMargin', this.path)
      },
      mcgOptions () {
        return this.extractFieldsForSelector('mcg', this.path)
      }
    },
    methods: {
      updateFieldToStore (field, value) {
        const loadingComponent = this.$loading.open()
        this.$store.dispatch('map/changeCombinationFilters', { path: this.path, parameter: field, value })
        loadingComponent.close()
      }
    }
  }
</script>
