<template>
  <div>

    <!-- Nav tabs -->
    <b-tabs
      v-model="activeTab"
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


     </b-tab-item>

      <b-tab-item label="Return Link">
        <br>

        <results-fields-selector-container
          path="return"
        />

        <results-table-by-path
          path="return"
        />
      </b-tab-item>

      <b-tab-item label="Maps">
        <br>
        <results-map-container />
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
  export default {
    components: {
      ResultsFieldsSelectorContainer,
      ResultsTableByPath,
      ResultsMapContainer,
      ResultsToolsContainer
    },
    props: {
      linkResults: {
        type: Array
      }
    },
    data () {
      return {
        activeTab: 0,
        field: 'cnDonwlink'
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
    }
  }
</script>

<style>
  .tab-content {
    overflow: visible !important;
  }
</style>
