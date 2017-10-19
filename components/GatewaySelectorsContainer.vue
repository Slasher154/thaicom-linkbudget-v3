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
              >Use Default Gateway</b-checkbox>
            </div>

            <b-field
              v-if="!useDefaultGateway"
            >
              <button class="button is-warning"
                      @click="isGatewayStationImporterModalActive = true">
                Import remote stations from spreadsheet
              </button>
            </b-field>

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
  export default {
    components: {
      GatewayStationsImporterModal
    },
    data () {
      return {
        useDefaultGateway: true,
        isGatewayStationImporterModalActive: false
      }
    },
    methods: {
      updateGatewayStations () {
        console.log('')
      }
    }
  }
</script>
