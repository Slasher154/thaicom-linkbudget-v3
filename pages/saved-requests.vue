<template>
  <div>
    <h1 class="title">My Saved Requests</h1>
    <hr>
    <b-table
      :data="savedRequests"
      :bordered="true"
    >
      <template scope="props">

        <b-table-column
          label="Name"
        >
          {{ props.row.requestName }}
        </b-table-column>
        <b-table-column
          label="Requested Date"
        >
          {{ convertTime(props.row.requestedDate) }}
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
  import axios from 'axios'
  import BTable from '../node_modules/buefy/src/components/table/Table'
  import BTableColumn from '../node_modules/buefy/src/components/table/TableColumn'
  export default {
    components: {
      BTableColumn,
      BTable
    },
    async created () {
      try {
        let user = this.$store.state.oauth.user
        let result = await axios.post('/saved-requests', {
          requestorEmployeeId: user.username
        })
        this.savedRequests = result.data.savedRequests
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        savedRequests: []
      }
    },
    methods: {
      convertTime (timeInMilliseconds) {
        return this.$_convertMillisecondsToText(timeInMilliseconds)
      }
    }
  }
</script>
