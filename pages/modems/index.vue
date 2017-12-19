<template>
  <section>
    <h1 class="title">All Modems</h1>
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
    }
  }
</script>
