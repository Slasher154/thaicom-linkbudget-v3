<template>
  <div class="column is-12">
    <!-- Name -->
    <b-field
      horizontal
      label="Name"
    >
      <b-input
        v-model="newTransponder.name"
        name="transponderName"
      >
      </b-input>
    </b-field>

    <!-- Satellite -->
    <b-field
      horizontal
      label="Satellite"
    >
      <satellite-selector
        :multiple="false"
        :satellite-options="satelliteOptions"
        @satellites-changed="updateSatellites"
      />
    </b-field>

    <!-- Uplink CF -->
    <b-field
      horizontal
      label="Uplink Center Frequency (GHz)"
    >
      <b-input
        v-model.number="newTransponder.uplink_cf"
        name="transponderUplinkCf"
        step="0.0001"
        min="0"
      >
      </b-input>
    </b-field>

    <!-- Downlink CF -->
    <b-field
      horizontal
      label="Downlink Center Frequency (GHz)"
    >
      <b-input
        v-model.number="newTransponder.downlink_cf"
        name="transponderDownlinkCf"
        step="0.0001"
        min="0"
      >
      </b-input>
    </b-field>

    <!-- Bandwidth -->
    <b-field
      horizontal
      label="Transponder Bandwidth (MHz)"
    >
      <b-input
        v-model.number="newTransponder.bandwidth"
        name="transponderBandwidth"
        step="0.1"
      >
      </b-input>
    </b-field>

    <!-- Uplink Beam -->
    <b-field
      horizontal
      label="Uplink Beam"
    >
      <b-input
        v-model="newTransponder.uplink_beam"
        name="transponderUplinkBeam"
        placeholder="For Broadband, put the same name as transponder name"
      >
      </b-input>
    </b-field>

    <!-- G/T Peak -->
    <b-field
      horizontal
      label="G/T Peak (dB/K)"
    >
      <b-input
        v-model.number="newTransponder.gt_peak"
        name="transponderGtPeak"
        step="0.01"
      >
      </b-input>
    </b-field>

    <!-- Uplink Pol -->
    <b-field
      horizontal
      label="Uplink Polarization"
    >
      <b-select
        v-model="newTransponder.uplink_pol"
      >
        <option
          v-for="pol in polarizationOptions"
          :value="pol">{{pol}}</option>
      </b-select>
    </b-field>

    <!-- Downlink Beam -->
    <b-field
      horizontal
      label="Downlink Beam"
    >
      <b-input
        v-model="newTransponder.downlink_beam"
        name="transponderDownlinkBeam"
        placeholder="For Broadband, put the same name as transponder name"
      >
      </b-input>
    </b-field>

    <!-- Saturate EIRP at Peak -->
    <b-field
      horizontal
      label="Saturated EIRP at Beam Peak (dBW)"
    >
      <b-input
        v-model.number="newTransponder.saturated_eirp_peak"
        name="transponderSaturatedEirpPeak"
        step="0.01"
      >
      </b-input>
    </b-field>

    <!-- Downlink Pol -->
    <b-field
      horizontal
      label="Downlink Polarization"
    >
      <b-select
        v-model="newTransponder.downlink_pol"
      >
        <option
          v-for="pol in polarizationOptions"
          :value="pol">{{pol}}</option>
      </b-select>
    </b-field>

    <!-- TWTA Name -->
    <b-field
      horizontal
      label="TWTA Name"
    >
      <b-input
        v-model="newTransponder.transponder"
        name="transponderTwtaName"
      >
      </b-input>
    </b-field>

    <!-- Dynamic Range -->
    <b-field
      horizontal
      label="Dynamic Range (dB)"
    >
      <b-input
        v-model.number="newTransponder.dynamic_range"
        name="transponderDynamicRange"
      >
      </b-input>
    </b-field>

    <!-- Mode of operation (ALC / FGM) -->
    <b-field
      horizontal
      label="Downlink Polarization"
    >
      <b-select
        v-model="newTransponder.mode"
      >
        <option
          v-for="mode in transponderModeOptions"
          :value="mode">{{mode}}</option>
      </b-select>
    </b-field>

    <!-- SFD -->
    <b-field
      horizontal
      label="Saturated Flux Density (dBW/m^2)"
    >
      <b-input
        v-model.number="newTransponder.sfd"
        name="transponderSfd"
        step="0.0001"
      >
      </b-input>
    </b-field>

    <!-- Country -->
    <b-field
      horizontal
      label="Country"
    >
      <b-input
        v-model="newTransponder.country"
        name="transponderCountry"
      >
      </b-input>
    </b-field>

    <!-- 50% contour -->
    <b-field
      horizontal
      label="50% Contour"
    >
      <b-input
        v-model.number="newTransponder.contour_50"
        name="transponder50Contour"
        step="0.01"
      >
      </b-input>
    </b-field>

    <!-- EOC contour -->
    <b-field
      horizontal
      label="EOC Contour"
    >
      <b-input
        v-model.number="newTransponder.contour_eoc"
        name="transponderEocContour"
        step="0.01"
      >
      </b-input>
    </b-field>

    <!-- Gateway name -->
    <b-field
      horizontal
      label="Default Gateway"
    >
      <b-input
        v-model="newTransponder.default_gateway"
        name="transponderDefaultGateway"
      >
      </b-input>
    </b-field>

    <!-- Latitude -->
    <b-field
      horizontal
      label="Latitude"
    >
      <b-input
        v-model.number="newTransponder.lat"
        placeholder="Lat/lon will be used as represent location of this transponder when not specified"
        name="transponderLat"
        step="0.0001"
      >
      </b-input>
    </b-field>

    <!-- Longitude -->
    <b-field
      horizontal
      label="Longitude"
    >
      <b-input
        v-model.number="newTransponder.lon"
        placeholder="Lat/lon will be used as represent location of this transponder when not specified"
        name="transponderLat"
        step="0.0001"
      >
      </b-input>
    </b-field>

    <!-- Current number of carriers -->
    <b-field
      horizontal
      label="Current Carriers Number"
    >
      <b-select
        v-model="newTransponder.current_num_carriers"
      >
        <option
          v-for="num in currentNumCarrierOptions"
          :value="num">{{num}}</option>
      </b-select>
    </b-field>

    <!--&lt;!&ndash; Backoff Settings  &ndash;&gt;
    <backoff-settings-base
      v-for="settings in backoffSettings"
      :settingsObject="settings"
      @settingsUpdate="updateSettings"
    />-->

    <!-- EIRP Density Adjacent Satellite Uplink -->
    <b-field
      horizontal
      label="EIRP Density Adjacent Satellite Uplink (dBW/Hz)"
    >
      <b-input
        v-model.number="newTransponder.eirp_density_adjacent_satellite_uplink"
        name="transponderEirpDensityAdjacentSatelliteUplink"
        step="0.01"
      >
      </b-input>
    </b-field>

    <!-- Adjacent Satellite Orbital Slot -->
    <b-field
      horizontal
      label="Adjacent Satellite Orbital Slot"
    >
      <b-input
        v-model.number="newTransponder.adjacent_satellite_orbital_slot"
        name="transponderAdjSatelliteOrbitalSlot"
        step="0.1"
      >
      </b-input>
    </b-field>

    <!-- C/I Downlink Adjacent Satellite -->
    <b-field
      horizontal
      label="C/I Downlink Adjacent Satellite (dB)"
    >
      <b-input
        v-model.number="newTransponder.ci_downlink_adj_sat"
        name="transponderCiDownlinkAdjSat"
        step="0.1"
      >
      </b-input>
    </b-field>

    <!-- Delta EIRP Down -->
    <b-field
      horizontal
      label="Delta EIRP Down (dB)"
    >
      <b-input
        v-model.number="newTransponder.delta_eirp_down"
        name="transponderDeltaEIRPDown"
        step="0.1"
      >
      </b-input>
    </b-field>

    <!-- Broadband Forward Additional Fields -->
    <template
      v-if="isBroadband && transponderPath === 'forward'">

      <!-- Type -->
      <b-field
        horizontal
        label="Path"
      >
        <b-input
          v-model="newTransponder.type"
          name="transponderType"
          disabled
        >
        </b-input>
      </b-field>

      <!-- C/I Downlink Adjacent Cell 50% -->
      <b-field
        horizontal
        label="C/I Downlink Adjacent Cell 50% (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_downlink_adj_cell_50"
          name="transponderCiDownlinkAdjCell50"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- C/I Downlink Adjacent Cell EOC -->
      <b-field
        horizontal
        label="C/I Downlink Adjacent Cell EOC (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_downlink_adj_cell_eoc"
          name="transponderCiDownlinkAdjCellEoc"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- C/I Uplink Adjacent Cell -->
      <b-field
        horizontal
        label="C/I Downlink Adjacent Cell EOC (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_uplink_adj_cell"
          name="transponderCiUplinkAdjCell"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- EIRP Density Adjacent Satellite Downlink -->
      <b-field
        horizontal
        label="EIRP Density Adjacent Satellite Downlink (dB)"
      >
        <b-input
          v-model.number="newTransponder.eirp_density_adjacent_satellite_downlink"
          name="transponderEirpDensityAdjacentSatelliteDownlink"
          step="0.1"
        >
        </b-input>
      </b-field>

    </template>

    <!-- Broadband Return Additional Fields -->
    <template
      v-if="isBroadband && transponderPath === 'return'">
      <!-- Type -->
      <b-field
        horizontal
        label="Path"
      >
        <b-input
          v-model="newTransponder.type"
          name="transponderType"
          disabled
        >
        </b-input>
      </b-field>

      <!-- Designed Deepin -->
      <b-field
        horizontal
        label="Designed Deepin (dB)"
      >
        <b-input
          v-model.number="newTransponder.designed_deepin"
          placeholder="Positive Number"
          name="transponderDeepin"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- C/I Uplink Adjacent Cell 50% -->
      <b-field
        horizontal
        label="C/I Uplink Adjacent Cell 50% (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_uplink_adj_cell_50"
          name="transponderCiUplinkAdjCell50"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- C/I Uplink Adjacent Cell EOC -->
      <b-field
        horizontal
        label="C/I Uplink Adjacent Cell EOC (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_uplink_adj_cell_eoc"
          name="transponderCiUplinkAdjCellEoc"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- C/I Uplink Adjacent Satellite -->
      <b-field
        horizontal
        label="C/I Uplink Adjacent Satellite (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_uplink_adj_sat"
          name="transponderCiUplinkAdjSat"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- C/I Downlink Adjacent Cell -->
      <b-field
        horizontal
        label="C/I Downlink Adjacent Cell (dB)"
      >
        <b-input
          v-model.number="newTransponder.ci_downlink_adj_cell"
          name="transponderCiDownlinkAdjCell"
          step="0.1"
        >
        </b-input>
      </b-field>

      <!-- EIRP Density Adjacent Satellite Uplink -->
      <b-field
        horizontal
        label="EIRP Density Adjacent Satellite Uplink (dB)"
      >
        <b-input
          v-model.number="newTransponder.eirp_density_adjacent_satellite_uplink"
          name="transponderEirpDensityAdjacentSatelliteUplink"
          step="0.1"
        >
        </b-input>
      </b-field>

    </template>
  </div>
</template>

<script>
  import axios from 'axios'
  import SatelliteSelector from '@/components/SatelliteSelector'
  import BackoffSettingsBase from './BackoffSettingsBase'
  export default {
    components: {
      SatelliteSelector,
      BackoffSettingsBase
    },
    props: {
      transponder: {
        type: Object,
        required: true
      },
      isBroadband: {
        type: Boolean,
        required: true
      },
      transponderPath: {
        type: String,
        required: true,
        default: 'forward'
      }
    },
    async created () {
      let satelliteResult = await axios.post('/satellites-by-slot', {slot: 119.5})
      this.satelliteOptions = satelliteResult.data.satellites
    },
    data () {
      return {
        satelliteOptions: [],
        transponderModeOptions: ['ALC', 'FGM'],
        polarizationOptions: ['V', 'H', 'LHCP', 'RHCP'],
        currentNumCarrierOptions: ['one', 'two', 'multi'],
        newTransponder: {},
        broadbandTransponderTemplate: {
          name: '',
          satellite: 'Thaicom 4',
          uplink_cf: 14.2855,
          downlink_cf: 19.9855,
          bandwidth: 179,
          uplink_beam: '',
          gt_peak: 19.3,
          uplink_pol: 'H',
          downlink_beam: '',
          saturated_eirp_peak: 55.9,
          downlink_pol: 'H',
          transponder: '3620D1',
          dynamic_range: 25,
          mode: 'ALC',
          sfd: -69.54146969,
          country: 'Australia',
          contour_50: -2.81,
          contour_eoc: -5.87,
          default_gateway: '',
          lat: -22.14,
          lon: 149.05,
          current_num_carriers: 'multi',
          backoff_settings: [
            {
              num_carriers: 'single',
              ibo: 0,
              obo: 0,
              intermod: 0
            },
            {
              num_carriers: 'two',
              ibo: 0,
              obo: 0,
              intermod: 0
            },
            {
              num_carriers: 'multi',
              ibo: 0,
              obo: 0,
              intermod: 0
            }
          ],
          eirp_density_adjacent_satellite_uplink: -60,
          adjacent_satellite_orbital_slot: 122.2,
          ci_downlink_adj_sat: 25.0,
          delta_eirp_down: 0.49
        },
        forwardAdditionalFields: {
          type: 'forward',
          ci_downlink_adj_cell_50: 26.6,
          ci_downlink_adj_cell_eoc: 23.42,
          ci_uplink_adj_cell: 24.49,
          eirp_density_adjacent_satellite_downlink: -60
        },
        returnAdditionalFields: {
          type: 'return',
          designed_deepin: 9,
          ci_uplink_adj_cell_50: 26.6,
          ci_uplink_adj_cell_eoc: 23.42,
          ci_uplink_adj_sat: 25,
          ci_downlink_adj_cell: 24.49,
          eirp_density_adjacent_satellite_uplink: -60
        },
        conventionalTransponderTemplate: {}
      }
    },
    mounted () {
      if (this.transponder.name) {
        this.newTransponder = Object.assign({}, this.transponder)
        console.log('TP has name')
      } else { // add new transponder
        if (this.isBroadband) {
          console.log('TP is broadband')
          let newTransponder = Object.assign({}, this.broadbandTransponderTemplate, this[this.transponderPath + 'AdditionalFields'])
          this.newTransponder = newTransponder
        } else { // conventional
          let newTransponder = Object.assign({}, this.conventionalTransponderTemplate)
          this.newTransponder = newTransponder
        }
      }
    },
    methods: {
      updateSettings (value) {
        console.log('Settings updated')
      },
      updateSatellites (value) {
        console.log(JSON.stringify(value))
        this.newTransponder.satellite = value.satellites.name
      },
      emitTransponder (newTransponder) {
        // construct transponder object
        let transponder = Object.assign({}, newTransponder)
        this.$emit('transponderChanged', transponder)
      }
    },
    watch: {
      transponder (newVal) {
        this.newTransponder = Object.assign({}, newVal)
      },
      newTransponder: {
        handler (newVal) {
          this.emitTransponder(newVal)
        },
        deep: true
      }
    }
  }
</script>

