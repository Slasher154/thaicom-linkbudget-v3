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
          <nuxt-link
            :to="{ name: 'saved-requests-id', params: { id: props.row._id }}"
          >{{ props.row.requestName }}
          </nuxt-link>
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
  export default {
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
