<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">REMOTE</p>
    </header>
    <div class="card-content">
      <div class="content">
        <b-field label="Locations">
          <remote-locations-selector
            :locationOptions="filteredRemoteLocationOptions"
            :multiple="true"
            :defaultSelectedLocations="defaultSelectedLocations"
            @locations-changed="updateLocations"
          />
        </b-field>
        <b-field>
          <button class="button is-info"
                  @click="isLatLonImporterModalActive = true">
            Import locations from spreadsheet
          </button>
        </b-field>
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
            label="Bandwidth"
            @bandwidthAdded="updateBandwidth"
          />
        </b-field>

        <remote-bandwidth-tags />

        <b-modal :active.sync="isLatLonImporterModalActive" has-modal-card>
          <base-lat-lon-importer-modal
            title="Remote Locations Importer"
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
  export default {
    components: {
      RemoteLocationsSelector,
      RemoteAntennaSelector,
      RemoteBucSelector,
      RemoteBandwidthSelector,
      RemoteBandwidthTags,
      BaseLatLonImporterModal
    },
    data () {
      return {
        defaultSelectedLocations: [],
        defaultSelectedAntennas: [],
        defaultSelectedBucs: [],
        isLatLonImporterModalActive: false
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'filteredRemoteLocationOptions'
      ])
    },
    methods: {
      updateLocations ({ locations }) {
        this.$store.dispatch('linkcalc/setSelectedRemoteLocations', { locations })
      },
      updateRemoteAntennas ({ antennas }) {
        this.$store.dispatch('linkcalc/setSelectedRemoteAntennas', { antennas })
      },
      updateRemoteBucs ({ bucs }) {
        this.$store.dispatch('linkcalc/setSelectedRemoteBucs', { bucs })
      },
      updateBandwidth ({ bandwidth }) {
        this.$store.dispatch('linkcalc/addSelectedBandwidth', { bandwidth })
      }
    }
  }
</script>
