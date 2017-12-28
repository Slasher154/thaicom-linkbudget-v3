<template>
  <section>
    <h1 class="title">All Antennas</h1>
    <h2 class="subtitle">To view antenna data, select 'Edit'</h2>
    <div class="field">
      <p class="control">
        <nuxt-link
          tag="button"
          class="button is-success"
          :to="{ path: 'antennas/add'}">
        <b-icon pack="fa" icon="plus"></b-icon>
          <span>Add antenna</span>
        </nuxt-link>
      </p>
    </div>
    <b-table
      :data="antennas"
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
        label="Vendor"
        field="vendor"
        sortable
       >
         {{props.row.vendor}}
       </b-table-column>
       <b-table-column
        label="Size (m)"
        field="size"
        sortable
       >
         {{props.row.size}}
       </b-table-column>
       <b-table-column
        label="Actions"
       >
         <nuxt-link
           :to="{ name: 'antennas-edit-id', params: { id: props.row._id }}"
           >
           Edit
         </nuxt-link>
         &nbsp
         <a
          @click="deleteAntenna(props.row._id, props.row.name)"
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
  import BTableColumn from '../../node_modules/buefy/src/components/table/TableColumn'
  export default {
    components: {BTableColumn},
    async asyncData () {
      // Fetch the antenna from database via API
      try {
        let antennaResult = await axios.get('/antennas')
        return {
          antennas: antennaResult.data.antennas
        }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      deleteAntenna (antennaId, name) {
        this.$dialog.confirm({
          message: `Delete '${name} from the antenna database?`,
          onConfirm: () => {
            axios.post('/antennas/delete', { antennaId }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.antenna.name} has been deleted from the database`)
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
