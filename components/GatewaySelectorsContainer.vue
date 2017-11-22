<template>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">GATEWAY</p>
        </header>
        <div class="card-content">
          <div class="content">

            <div class="field">
              <b-checkbox
                v-model="useDefaultGateway"
                @input="updateUseDefaultGateway"
              >Use Default Gateway</b-checkbox>
            </div>

            <template v-if="!useDefaultGateway">
              <b-field>
                <button class="button is-warning"
                        @click="isGatewayStationImporterModalActive = true">
                  Import remote stations from spreadsheet
                </button>
              </b-field>
              <!-- Gateway Stations Table -->
              <base-gateway-stations-table
                v-if="$store.state.linkcalc.gatewayStations.length > 0"
                :stations="$store.state.linkcalc.gatewayStations"
              />
            </template>

            <!-- Gateway Station Importer Modal -->
            <b-modal :active.sync="isGatewayStationImporterModalActive" has-modal-card>
              <gateway-stations-importer-modal
                title="Gateway Stations Importer"
                @stationsAdded="updateGatewayStations"
              />
            </b-modal>
          </div>


        </div>
      </div>
</template>

<script>
  import GatewayStationsImporterModal from './GatewayStationsImporterModal'
  import BaseGatewayStationsTable from './BaseGatewayStationsTable'
  export default {
    components: {
      GatewayStationsImporterModal,
      BaseGatewayStationsTable
    },
    data () {
      return {
        useDefaultGateway: true,
        isGatewayStationImporterModalActive: false
      }
    },
    methods: {
      updateGatewayStations ({ stations }) {
        this.$store.dispatch('linkcalc/setGatewayStations', { stations })
      },
      updateUseDefaultGateway (status) {
        this.$store.dispatch('linkcalc/setUseDefaultGateway', status)
      }
    }
  }
</script>
