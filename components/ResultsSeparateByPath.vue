<template>
  <div>

    <!-- Nav tabs -->
    <b-tabs
      v-model="activeTab"
    >

      <!-- Forward Link results tab -->
      <b-tab-item label="Forward Link">
        <br>

        <!-- Field Selector -->
        <b-field label="Fields">
          <result-fields-selector
            :fieldOptions="linkResultsFields('forward')"
            :multiple="true" />
        </b-field>

       <b-table
         :data="linkResultsTableData('forward')"
         :bordered="true"
       >
         <template scope="props">
           <b-table-column label="Antenna">
             {{ props.row.antennaName }}
           </b-table-column>
           <b-table-column label="Transponder">
             {{ props.row.channelClear }}
           </b-table-column>
           <b-table-column label="C/N Downlink">
             {{ props.row.cnDownlinkClear }}
           </b-table-column>
           <b-table-column label="C/N Total">
             {{ props.row.cnTotalClear }}
           </b-table-column>
           <b-table-column label="Data Rate (Mbps)">
             {{ props.row.dataRateClear }}
           </b-table-column>
         </template>
       </b-table>
     </b-tab-item>

      <b-tab-item label="Return Link">
        <br>
        <p>Return Link</p>
      </b-tab-item>

      <b-tab-item label="Maps">
        <br>
        <p>Maps</p>
      </b-tab-item>
    </b-tabs>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ResultFieldsSelector from './ResultsFieldsSelector'
  export default {
    components: {
      ResultFieldsSelector
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
