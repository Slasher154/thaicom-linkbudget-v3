<template>
  <div>
    <h1 class="title">Save this request to database</h1>
    <b-field
      horizontal
      label="Request Name">
      <b-input
        v-model="savedRequest.requestName"
        type="text" />
    </b-field>
    <b-field
      horizontal
    >
      <button
        class="button is-primary"
        @click="saveRequest"
        :disabled="nameBlank"
      >Submit</button>
    </b-field>
    <hr>
    <!--<h1 class="title">Export result to CSV</h1>-->
  </div>
</template>

<script>
  import axios from 'axios'
  import BField from '../node_modules/buefy/src/components/field/Field'
  export default {
    components: {
      BField
    },
    data () {
      return {
        savedRequest: {
          requestName: ''
        }
      }
    },
    computed: {
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
        axios.post('/request/save', { savedRequest }).then(result => {
          this.$toast.open('This request has been saved as xxx')
        }).catch(e => {
          this.$toast.open(e)
        })
      }
    }
  }
</script>
