<template>
  <div>

    <!-- Nav tabs -->
    <b-tabs
      v-model="activeTab"
      @change="tabChanged"
    >

      <!-- Forward Link results tab -->
      <b-tab-item label="Forward Link">
        <br>

        <results-fields-selector-container
          path="forward"
        />

        <results-table-by-path
          path="forward"
        />
        <br>
        <results-table-warning-messages
          v-if="warningMessages('forward').length > 0"
          :messages="warningMessages('forward')"
        />

     </b-tab-item>

      <b-tab-item label="Return Link">
        <br>

        <results-fields-selector-container
          path="return"
        />

        <results-table-by-path
          path="return"
        />
        <br>
        <results-table-warning-messages
          v-if="warningMessages('return').length > 0"
          :messages="warningMessages('return')"
          />
      </b-tab-item>

      <b-tab-item label="Maps">
        <br>
        <results-map-container ref="mapContainer" />
      </b-tab-item>

      <b-tab-item label="Tools">
        <br/>
        <results-tools-container />
      </b-tab-item>
    </b-tabs>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ResultsFieldsSelectorContainer from './ResultsFieldsSelectorContainer'
  import ResultsTableByPath from './ResultsTableByPath.vue'
  import ResultsMapContainer from './ResultsMapContainer'
  import ResultsToolsContainer from './ResultsToolsContainer'
  import ResultsTableWarningMessages from './ResultsTableWarningMessages'
  export default {
    components: {
      ResultsFieldsSelectorContainer,
      ResultsTableByPath,
      ResultsMapContainer,
      ResultsToolsContainer,
      ResultsTableWarningMessages
    },
    props: {
      linkResults: {
        type: Array
      }
    },
    data () {
      return {
        activeTab: 0,
        field: 'cnDownlink'
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'linkResultsFields',
        'linkResultsTableData'
      ]),
      forwardLinkResults () {
        return this.$store.state.linkcalc.linkResults.forwardLinkResults
      },
      returnLinkResults () {
        return this.$store.state.linkcalc.linkResults.returnLinkResults
      }
    },
    methods: {
      tabChanged (index) {
        console.log('TAb changed to ' + index)
        if (index === 2) {
          this.$refs.mapContainer.$refs.map.$refs.contourMap.resizePreserveCenter()
        }
        // this.$_expandMap(this.$refs.mapContainer.$refs.baseMap.$refs.contourMap)
      },
      warningMessages (path) {
        return this.$store.state.linkcalc.linkResults[path + 'WarningMessages']
      }
    }
  }
</script>

<style>
  .tab-content {
    overflow: visible !important;
  }
</style>
