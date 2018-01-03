<template>
  <div>
    <h1 class="title">My Saved Requests</h1>
    <hr>
    <b-table
      v-if="savedRequests.length > 0"
      :data="savedRequests"
      :bordered="true"
    >
      <template scope="props">

        <b-table-column
          label="Name"
          field="requestName"
          sortable
        >
          <nuxt-link
            :to="{ name: 'saved-requests-id', params: { id: props.row._id }}"
          >{{ props.row.requestName }}
          </nuxt-link>
        </b-table-column>
        <b-table-column
          label="Description"
          field="description"
          sortable
        >
          {{ props.row.description }}
        </b-table-column>
        <b-table-column
          label="Requested Date"
        >
          {{ convertTime(props.row.requestedDate) }}
        </b-table-column>
      </template>
    </b-table>
    <b-message
      v-else
    >You don't have any saved link budget requests yet.</b-message>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  export default {
    async created () {
      try {
        let user = this.$store.state.oauth.user
        let result = await axios.post('/saved-requests', {
          requestorEmployeeId: user.username
        })
        // Sorted by descending date by default
        this.savedRequests = _.orderBy(result.data.savedRequests, ['requestedDate'], ['desc'])
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
