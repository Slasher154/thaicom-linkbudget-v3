<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">REMOTE</p>
    </header>
    <div class="card-content">
      <div class="content">

        <template v-if="!findMaxCoverage">
          <div class="field">
            <b-checkbox
              v-model="importRemoteStationsFromSpreadsheet"
            >Import remote stations from spreadsheet
            </b-checkbox>
          </div>
          <b-field
            v-if="importRemoteStationsFromSpreadsheet"
          >
            <button class="button is-warning"
                    @click="isRemoteStationImporterModalActive = true">
              Import remote stations from spreadsheet
            </button>
          </b-field>
        </template>

          <template
            v-if="!importRemoteStationsFromSpreadsheet"
          >
            <!-- Hide locations if max contour is selected -->
            <template v-if="!findMaxCoverage">
              <b-field label="Locations">
                <remote-locations-selector
                  :locationOptions="filteredRemoteLocationOptions"
                  :multiple="true"
                  :defaultSelectedLocations="defaultSelectedLocations"
                  :selectedLocationsFromOutside="selectedLocationsFromOutside"
                  @locations-changed="updateRemoteLocations"
                />
              </b-field>
              <b-field>
                <button class="button is-info"
                        @click="isLatLonImporterModalActive = true">
                  Import locations from spreadsheet
                </button>
              </b-field>
            </template>

            <b-field label="Antennas">
              <remote-antenna-selector
                :antennaOptions="$store.state.linkcalc.remoteAntennaOptions"
                :defaultSelectedAntennas="defaultSelectedAntennas"
                @antennas-changed="updateRemoteAntennas"
              />
            </b-field>
            <b-field label="Bucs">
              <remote-buc-selector
                :bucOptions="$store.state.linkcalc.remoteBucOptions"
                :defaultSelectedBucs="defaultSelectedBucs"
                @bucs-changed="updateRemoteBucs"
              />
            </b-field>

            <b-field label="Bandwidth">
              <remote-bandwidth-selector
                label="Bandwidth (You can press Enter to add)"
                @bandwidthAdded="updateRemoteBandwidth"
              />
            </b-field>

            <remote-bandwidth-tags/>
          </template>

          <b-field>
            <button class="button is-success"
                    @click="isGeneratedRemoteStationsShown = true">
              Show all generated remote stations
            </button>
          </b-field>

          <b-modal :active.sync="isLatLonImporterModalActive" has-modal-card>
            <base-lat-lon-importer-modal
              title="Remote Locations Importer"
              @locationsAdded="addRemoteLocationsFromExcel"
            />
          </b-modal>

          <b-modal :active.sync="isRemoteStationImporterModalActive" has-modal-card>
            <remote-stations-importer-modal
              title="Remote Stations Importer"
              @stationsAdded="updateRemoteStations"
            />
          </b-modal>

          <b-modal :active.sync="isGeneratedRemoteStationsShown" has-modal-card>
            <remote-stations-modal
              title="Remote Stations Combinations"
              :stations="$store.state.linkcalc.remoteStations"
            />
          </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable indent */

  import { mapGetters } from 'vuex'
  import RemoteLocationsSelector from './RemoteLocationsSelector'
  import RemoteAntennaSelector from './RemoteAntennaSelector'
  import RemoteBucSelector from './RemoteBucSelector'
  import RemoteBandwidthSelector from './RemoteBandwidthSelector'
  import RemoteBandwidthTags from './RemoteBandwidthTags'
  import BaseLatLonImporterModal from './BaseLatLonImporterModal'
  import RemoteStationsImporterModal from './RemoteStationsImporterModal'
  import RemoteStationsModal from './RemoteStationsModal'
  export default {
    components: {
      RemoteLocationsSelector,
      RemoteAntennaSelector,
      RemoteBucSelector,
      RemoteBandwidthSelector,
      RemoteBandwidthTags,
      BaseLatLonImporterModal,
      RemoteStationsImporterModal,
      RemoteStationsModal
    },
    data () {
      return {
        defaultSelectedLocations: [],
        selectedLocationsFromOutside: [],
        defaultSelectedAntennas: [],
        defaultSelectedBucs: [],
        isLatLonImporterModalActive: false,
        isRemoteStationImporterModalActive: false,
        importRemoteStationsFromSpreadsheet: false,
        isGeneratedRemoteStationsShown: false
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'filteredRemoteLocationOptions'
      ]),
      findMaxCoverage () {
        return this.$store.state.linkcalc.findMaxCoverage
      }
    },
    methods: {
      addRemoteLocationsFromExcel ({locations}) {
        this.$store.dispatch('linkcalc/addRemoteLocationOptions', {locations})
        this.selectedLocationsFromOutside = locations
      },
      updateRemoteLocations ({locations}) {
        this.$store.dispatch('linkcalc/setSelectedRemoteLocations', {locations})
      },
      updateRemoteAntennas ({antennas}) {
        this.$store.dispatch('linkcalc/setSelectedRemoteAntennas', {antennas})
      },
      updateRemoteBucs ({bucs}) {
        this.$store.dispatch('linkcalc/setSelectedRemoteBucs', {bucs})
      },
      updateRemoteBandwidth ({bandwidth}) {
        this.$store.dispatch('linkcalc/addSelectedBandwidth', {bandwidth})
      },
      updateRemoteStations ({stations}) {
        this.$store.dispatch('linkcalc/setRemoteStations', {stations})
      }
    }
  }
</script>
