<template>
  <section>
    <h1 class="title">All Modems</h1>
    <h2 class="subtitle">To view modem data, select 'Edit'</h2>
    <div class="field">
      <p class="control">
        <nuxt-link tag="button" class="button is-success" :to="{ path: 'modems/add'}">Add Modem</nuxt-link>
      </p>
    </div>
    <b-table
      :data="modems"
      default-sort="vendor"
    >
      <template scope="props">
        <b-table-column
          label="Vendor"
          field="vendor"
          sortable
        >
          {{props.row.vendor}}
        </b-table-column>
        <b-table-column
          label="Name"
        >
          {{props.row.name}}
        </b-table-column>

        <b-table-column
          label="Actions"
        >
          <nuxt-link
            :to="{ name: 'modems-edit-id', params: { id: props.row._id }}"
          >Edit</nuxt-link>
          &nbsp
          <a
            @click="deleteModem(props.row._id, props.row.name)"
          >Delete</a>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
  import axios from 'axios'
  export default {
    async asyncData () {
      // Fetch the modem from database via API
      // Fetch the vendors
      try {
        let modemsResult = await axios.get('/modems')
        return {
          modems: modemsResult.data.modems
        }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      deleteModem (modemId, name) {
        this.$dialog.confirm({
          message: `Delete '${name}' from the modem database?`,
          onConfirm: () => {
            axios.post('/modems/delete', { modemId }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.modem.name} has been deleted from the database`)
                window.location.reload(true) // Refresh the page
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
