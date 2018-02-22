<template>
  <section>
    <h1 class="title">All Constants</h1>
    <h2 class="subtitle">To view constant data, select 'Edit'</h2>
    <div class="field">
      <p class="control">
        <nuxt-link
          tag="button"
          class="button is-success"
          :to="{ path: 'constants/add'}">
          <b-icon pack="fa" icon="plus"></b-icon>
          <span>Add constant</span>
        </nuxt-link>
      </p>
    </div>
    <b-table
      :data="constants"
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
          label="Alias"
          field="alias"
          sortable
        >
          {{props.row.alias}}
        </b-table-column>
        <b-table-column
          label="Value"
          field="value"
        >
          {{props.row.value}}
        </b-table-column>
        <b-table-column
          label="Unit"
          field="unit"
        >
          {{props.row.unit}}
        </b-table-column>
        <b-table-column
          label="Actions"
        >
          <nuxt-link
            :to="{ name: 'constants-edit-id', params: { id: props.row._id }}"
          >
            Edit
          </nuxt-link>
          &nbsp
          <a
            @click="deleteConstant(props.row._id, props.row.name)"
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
      // Fetch the constant from database via API
      try {
        let constantResult = await axios.get('/constants')
        return {
          constants: constantResult.data.constants
        }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      deleteConstant (constantId, name) {
        this.$dialog.confirm({
          message: `Delete '${name} from the constant database?`,
          onConfirm: () => {
            axios.post('/constants/delete', { constantId }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.constant.name} has been deleted from the database`)
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
