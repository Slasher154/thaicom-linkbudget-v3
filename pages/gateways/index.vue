<template>
  <section>
    <h1 class="title">All Gateways</h1>
    <h2 class="subtitle">To view gateway data, select 'Edit'</h2>
    <div class="field">
      <p class="control">
        <nuxt-link
          tag="button"
          class="button is-success"
          :to="{ path: 'gateways/add'}">
          <b-icon pack="fa" icon="plus"></b-icon>
          <span>Add gateway</span>
        </nuxt-link>
      </p>
    </div>
    <b-table
      :data="gateways"
    >
      <template scope="props">
        <b-table-column
          label="Name"
          field="name"
          sortable
        >
          {{props.row.name}}
        </b-table-column>

        <b-table-column
          label="City"
          field="city"
          sortable
        >
          {{props.row.city}}
        </b-table-column>
        <b-table-column
          label="Country"
          field="country"
        >
          {{props.row.country}}
        </b-table-column>
        <b-table-column
          label="Latitude"
          field="lat"
        >
          {{props.row.lat}}
        </b-table-column>
        <b-table-column
          label="Longitude"
          field="lon"
        >
          {{props.row.lon}}
        </b-table-column>
        <b-table-column
          label="Actions"
        >
          <nuxt-link
            :to="{ name: 'gateways-edit-id', params: { id: props.row._id }}"
          >
            Edit
          </nuxt-link>
          &nbsp
          <a
            @click="deleteGateway(props.row._id, props.row.name)"
          >
            Delete
          </a>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
  import axios from 'axios'
  export default {
    async asyncData () {
      // Fetch the gateway from database via API
      try {
        let gatewayResult = await axios.get('/gateways')
        return {
          gateways: gatewayResult.data.gateways
        }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      deleteGateway (gatewayId, name) {
        this.$dialog.confirm({
          message: `Delete '${name} from the gateway database?`,
          onConfirm: () => {
            axios.post('/gateways/delete', { gatewayId }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.gateway.name} has been deleted from the database`)
                window.location.reload(true) // refresh the page
              }
            }).catch(e => {
              this.$toast.open(e)
            })
          }
        })
      }
    }
  }
</script>
