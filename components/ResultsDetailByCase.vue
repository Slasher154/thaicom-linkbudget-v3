<template>
  <div>
    <div>
      <b-field>
        <b-radio-button v-model="condition"
                        native-value="Clear"
                        type="is-success">
          Clear Sky
        </b-radio-button>

        <b-radio-button v-model="condition"
                        native-value="Rain"
                        type="is-danger">
          Rain Fade
        </b-radio-button>
      </b-field>
    </div>
    <p>Note: There is no rain fade result for finding max coverage requests</p>
    <br>
    <div>
      <h4 class="title is-4">Summary</h4>
      <b-table
        :data="linkResultInArrayForm"
        :bordered="true"
      >
        <template scope="props">

          <b-table-column v-for="(column, index) in assumptionTableFields"
                          :key="index"
                          :label="column.title"
                          :field="column.name"
          >
            {{ props.row[column.name] }}
          </b-table-column>
        </template>
        <template slot="detail" scope="props">
          <results-detail-by-case
            :linkResult="props.row"
          />
        </template>
      </b-table>
    </div>
    <br>
    <div class="columns">
      <!-- Uplink -->
      <div class="column is-3">
        <h4 class="title is-4">Uplink</h4>
        <results-detail-by-case-table
          :data="generateParameterTable('uplink')"
        />
      </div>
      <!-- Satellite -->
      <div class="column is-3">
        <h4 class="title is-4">Satellite</h4>
        <results-detail-by-case-table
          :data="generateParameterTable('satellite')"
        />
      </div>
      <!-- Downlink -->
      <div class="column is-3">
        <h4 class="title is-4">Downlink</h4>
        <results-detail-by-case-table
          :data="generateParameterTable('downlink')"
        />
      </div>
      <!-- Carrier -->
      <div class="column is-3">
        <h4 class="title is-4">Carrier</h4>
        <results-detail-by-case-table
          :data="generateParameterTable('carrier')"
        />
      </div>
    </div>


  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import _ from 'lodash'
  import ResultsDetailByCaseTable from './ResultsDetailByCaseTable'
  export default {
    components: {
      ResultsDetailByCaseTable
    },
    props: {
      linkResult: {
        type: Object,
        required: true
      },
      path: {
        type: String,
        default: 'forward'
      }
    },
    data () {
      return {
        condition: 'Clear',
        assumptionFields: [
          `cnTotal`,
          `mcgName`,
          `linkMargin`,
          `requiredMargin`,
          `passedText`,
          `occupiedBandwidth`,
          `dataRate`,
          `operatingHpaPower`,
          `uplinkAvailability`,
          `downlinkAvailability`,
          `linkAvailability`
        ],
        uplinkFields: [
          'uplinkEirp',
          'uplinkGt',
          'uplinkPointingLoss',
          'uplinkXpolLoss',
          'uplinkAtmLoss',
          'noiseBandwidth',
          'cnUplink'
        ],
        downlinkFields: [
          'downlinkEirp',
          'saturatedEirpAtLoc',
          'downlinkPathLoss',
          'downlinkAtmLoss',
          'downlinkAvailability',
          'downlinkContour',
          'antGain',
          'antennaTemp',
          'systemTemp',
          'downlinkGt',
          'noiseBandwidth',
          'cnDownlink'
        ],
        satelliteFields: [
          'channel',
          'operatingMode',
          'channelDeepin',
          'operatingSfd',
          'operatingPfdPerCarrier',
          'carrierPfd',
          'gainVariation'
        ],
        carrierFields: [
          'cnUplink',
          'ciUplinkIntermod',
          'ciUplinkAdjSat',
          'ciUplinkXpol',
          'ciUplinkXcells',
          'ciUplink',
          'cnDownlink',
          'ciDownlinkAdjSat',
          'ciDownlinkIntermod',
          'ciDownlinkXpol',
          'ciDownlinkXcells',
          'cnTotal',
          'requiredMargin',
          'linkMargin'
        ]
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'findFieldObject'
      ]),
      assumptionTableFields () {
        let assumptionFields = this.assumptionFields
        let assumptionsTableData = assumptionFields.map(f => {
          let fieldObject = this.findFieldObject(f)
          let title = `${fieldObject.title}`
          if (fieldObject.unit !== '') {
            title += ` (${fieldObject.unit})`
          }
          return {
            title,
            name: `${f}${this.condition}`
          }
        })
        return assumptionsTableData
      },
      linkResultInArrayForm () {
        return [this.linkResult]
      }
    },
    methods: {
      generateParameterTable (field) {
        let fields = this[field + 'Fields']
        let result = this.linkResult
        console.log(JSON.stringify(result))
        let parameterTable = fields.map(f => {
          // Find the unit and title of this field
          let unit = ''
          let parameter = ''
          let value = ''
          let fieldObject = this.findFieldObject(f)
          if (fieldObject) {
            parameter = fieldObject.title
            unit = fieldObject.unit
            // Find the value from link result
            if (_.has(result, `${f}${this.condition}`)) {
              value = result[`${f}${this.condition}`]
            } else {
              value = result[f]
            }
          }
          return {
            parameter,
            value,
            unit
          }
        })
        return parameterTable
      }
    }
  }
</script>
