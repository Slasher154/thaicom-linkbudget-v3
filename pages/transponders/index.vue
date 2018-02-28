<template>
  <section>
    <h1 class="title">All Transponders</h1>
    <h2 class="subtitle">To view transponder data, select 'Edit'</h2>
    <div class="field">
      <p class="control">
        <nuxt-link
          tag="button"
          class="button is-success"
          :to="{ path: 'transponders/add'}">
          <b-icon pack="fa" icon="plus"></b-icon>
          <span>Add transponder</span>
        </nuxt-link>
      </p>
    </div>
    <b-table
      :data="transponders"
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
          label="Satellite"
          field="satellite"
          sortable
        >
          {{props.row.satellite}}
        </b-table-column>
        <b-table-column
          label="Country"
          field="country"
          sortable
        >
          {{props.row.satellite}}
        </b-table-column>
        <b-table-column
          label="Path"
          field="path"
          sortable
        >
          {{props.row.type}}
        </b-table-column>
        <b-table-column
          label="Uplink CF (GHz)"
          field="uplink_cf"
          sortable
        >
          {{props.row.uplink_cf}}
        </b-table-column>
        <b-table-column
          label="Downlink CF (GHz)"
          field="downlink_cf"
          sortable
        >
          {{props.row.downlink_cf}}
        </b-table-column>
        <b-table-column
          label="Bandwidth (MHz)"
          field="bandwidth"
          sortable
        >
          {{props.row.bandwidth}}
        </b-table-column>
        <b-table-column
          label="Saturated EIRP Peak (dBW)"
          field="saturated_eirp_peak"
          sortable
        >
          {{props.row.saturated_eirp_peak}}
        </b-table-column>
        <b-table-column
          label="Uplink Pol"
          field="uplink_pol"
          sortable
        >
          {{props.row.uplink_pol}}
        </b-table-column>
        <b-table-column
          label="Downlink Pol"
          field="downlink_pol"
        >
          {{props.row.downlink_pol}}
        </b-table-column>
        <b-table-column
          label="Contour 50% (dB)"
          field="contour_50"
        >
          {{props.row.contour_50}}
        </b-table-column>
        <b-table-column
          label="Contour EOC (dB)"
          field="contour_eoc"
        >
          {{props.row.contour_eoc}}
        </b-table-column>
        <b-table-column
          label="Actions"
        >
          <nuxt-link
            :to="{ name: 'transponders-edit-id', params: { id: props.row._id }}"
          >
            Edit
          </nuxt-link>
          &nbsp
          <!--<a
            @click="deleteTransponder(props.row._id, props.row.name)"
          >
            Delete
          </a>-->
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
  import axios from 'axios'
  export default {
    async asyncData () {
      // Fetch the transponder from database via API
      try {
        let transponderResult = await axios.post('/transponders-by-satellite', { satellite: 'Thaicom 4' })
        return {
          transponders: transponderResult.data.transponders
        }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      deleteTransponder (transponderId, name) {
        this.$dialog.confirm({
          message: `Delete '${name} from the transponder database?`,
          onConfirm: () => {
            axios.post('/transponders/delete', { transponderId }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.transponder.name} has been deleted from the database`)
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
