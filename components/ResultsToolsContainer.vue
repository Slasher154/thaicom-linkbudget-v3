<template>
  <div>
    <h1 class="title">Save this request to database</h1>
    <b-field
      horizontal
      label="Request Description">
      <b-input
        v-model="savedRequest.description"
        type="text"/>
    </b-field>
    <b-field
      horizontal
    >
      <button
        class="button is-primary"
        @click="saveRequest"
        :disabled="nameBlank"
      >Submit
      </button>
    </b-field>
    <hr>
    <h1 class="title">Generate CSV File</h1>
    <!--<a-->
      <!--v-if="downloadUrl != ''"-->
      <!--:href="downloadUrl"-->
    <!--&gt;Download</a>-->
    <button
      class="button is-info"
      @click="exportToCsv('forward')"
    >
      Export Results to CSV -- Forward
    </button>&nbsp
    <button
      class="button is-warning"
      @click="exportToCsv('return')"
    >
      Export Results to CSV -- Return
    </button>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import json2csv from 'json2csv'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        savedRequest: {
          description: ''
        },
        downloadUrl: ''
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'linkResultsTableData'
      ]),
      nameBlank () {
        return this.savedRequest.requestName === ''
      }
    },
    methods: {
      saveRequest () {
        // Formulate the saved request object
        let savedRequest = this.savedRequest
        // Get the results from vuex store
        savedRequest.results = this.$store.state.linkcalc.linkResults
        // Add name and employee ID to the properties
        let user = this.$store.state.oauth.user
        Object.assign(savedRequest, {
          requestorEmployeeId: user.username,
          requestorName: `${user.name} ${user.family_name}`,
          requestedDate: this.$moment().valueOf()
        })
        axios.post('/request/save', {savedRequest}).then(result => {
          this.$toast.open(`This request has been saved as ${result.data.savedRequest.requestName}.`)
        }).catch(e => {
          this.$toast.open(e)
        })
      },
      exportToCsv (path) {
        // Get field names, data and column names
        let fields = this.$store.state.linkcalc[path + 'TableFields'].map(x => x.name)
        let fieldNames = this.$store.state.linkcalc[path + 'TableFields'].map(x => x.title)
        let data = this.linkResultsTableData(path)
        let csv = json2csv({ data, fields, fieldNames })
        // Check if this reqeust has name already (saved requests), if yes, put it in file title
        let requestName = ''
        if (_.has(this.$store.state.linkcalc.savedRequest, 'requestName')) {
          requestName = this.$store.state.linkcalc.savedRequest.requestName + '_'
        }
        let fileTitle = `${requestName}${path}_results`
        let exportedFileName = fileTitle + '.csv' || 'export.csv'
        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFileName)
        } else {
          let link = document.createElement('a')
          if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            let url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', exportedFileName)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      }
    }
  }
</script>
