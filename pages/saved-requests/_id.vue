<template>
  <div>
    <h1 class="title">View Request: {{savedRequest.requestName}}</h1>
    <h2 class="subtitle">Description: {{savedRequest.description}}</h2>
    <h2 class="subtitle">Requested by: {{savedRequest.requestorName}} on {{requestedDate}}</h2>
    <hr>
    <b-tabs
      v-model="activeTab"
      type="is-toggle"
      position="is-centered"
      class="block"
    >
      <b-tab-item label="Assumptions">
        <br>
        <b-message>
          The assumptions cannot be edited right now. This will be implemented in the future.
        </b-message>
      </b-tab-item>
      <b-tab-item label="Results">
        <results-container />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import ResultsContainer from '@/components/ResultsContainer'
  export default {
    // Validate route parameters
    components: {
      ResultsContainer
    },
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async fetch ({ params, store }) {
      // Fetch the saved request from database via API
      try {
        let savedRequestResult = await axios.post('/request/find-by-id', { savedRequestId: params.id })
        if (savedRequestResult) {
          // Save results to store
          store.dispatch('linkcalc/setLinkResults', {linkResults: savedRequestResult.data.savedRequest.results})
          // Save other details of saved request to store, omit the result as it is separately saved in the line above
          store.dispatch('linkcalc/setSavedRequest', { savedRequest: _.omit(savedRequestResult.data.savedRequest, 'results') })
        } else {
          console.log(`Saved request with ID ${params.id} cannot be found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        activeTab: 1
      }
    },
    computed: {
      savedRequest () {
        return this.$store.state.linkcalc.savedRequest
      },
      requestedDate () {
        return this.$_convertMillisecondsToText(this.savedRequest.requestedDate)
      }
    }
  }
</script>
