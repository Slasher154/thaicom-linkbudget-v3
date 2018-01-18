<template>
  <section>
    <h1 class="title">All Bucs</h1>
    <h2 class="subtitle">To view buc data, select 'Edit'</h2>
    <div class="field">
      <p class="control">
        <nuxt-link
          tag="button"
          class="button is-success"
          :to="{ path: 'bucs/add'}">
          <b-icon pack="fa" icon="plus"></b-icon>
          <span>Add buc</span>
        </nuxt-link>
      </p>
    </div>
    <b-table
      :data="bucs"
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
          label="Size (W)"
          field="size"
          sortable
        >
          {{props.row.size}}
        </b-table-column>
        <b-table-column
          label="IFL (dB)"
          field="ifl"
        >
          {{props.row.ifl}}
        </b-table-column>
        <b-table-column
          label="OBO (dB)"
          field="obo"
        >
          {{props.row.obo}}
        </b-table-column>
        <b-table-column
          label="Actions"
        >
          <nuxt-link
            :to="{ name: 'bucs-edit-id', params: { id: props.row._id }}"
          >
            Edit
          </nuxt-link>
          &nbsp
          <a
            @click="deleteBuc(props.row._id, props.row.name)"
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
      // Fetch the buc from database via API
      try {
        let bucResult = await axios.get('/bucs')
        return {
          bucs: bucResult.data.bucs
        }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      deleteBuc (bucId, name) {
        this.$dialog.confirm({
          message: `Delete '${name} from the buc database?`,
          onConfirm: () => {
            axios.post('/bucs/delete', { bucId }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.buc.name} has been deleted from the database`)
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
