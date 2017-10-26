<template>
  <div>
    <b-field :label="modem.name">
      <!--<div class="block">-->
        <!--<b-radio-->
          <!--v-model="bestMcg"-->
          <!--native-value="true"-->
        <!--&gt;-->
          <!--Best MCG-->
        <!--</b-radio>-->
        <!--<b-radio-->
          <!--v-model="bestMcg"-->
          <!--native-value="false"-->
        <!--&gt;-->
          <!--Manual Pick MCG-->
        <!--</b-radio>-->
      <!--</div>-->
      <div class="field">
        <b-switch
          v-model="bestMcg"
          @input="dispatchModem"
        >
          Find Best MCG
        </b-switch>
      </div>
    </b-field>
    <template v-if="!bestMcg">
      <b-field>
        <modem-mcgs-selector
          :mcgOptions="forwardMcgs"
          placeholder="Pick forward MCG(s)"
          @mcgs-changed="updateForwardMcgs"
        />
      </b-field>
      <b-field>
        <modem-mcgs-selector
          :mcgOptions="returnMcgs"
          placeholder="Pick return MCG(s)"
          @mcgs-changed="updateReturnMcgs"
        />
      </b-field>
    </template>
    <br>
  </div>
</template>

<script>
  import ModemMcgsSelector from './ModemMcgsSelector'
  import _ from 'lodash'
  export default {
    components: {
      ModemMcgsSelector
    },
    data () {
      return {
        bestMcg: true,
        selectedForwardMcgs: [],
        selectedReturnMcgs: []
      }
    },
    mounted () {
      this.dispatchModem()
    },
    destroyed () {
      // Remove the selected MCG of this modem
      this.$store.dispatch('linkcalc/removeSelectedModemsAndMcgs', { modem: _.cloneDeep(this.modem) })
    },
    methods: {
      findMcgsFromPath (type) {
        let application = this.modem.applications.find(x => x.type === type) || this.modem.applications[0]
        return application.mcgs
      },
      updateMcgs () {
        // Update forward application MCG with selected flag
        let modem = _.cloneDeep(this.$store.state.linkcalc.selectedModemsAndMcgs.find(x => x._id === this.modem._id)) || _.cloneDeep(this.modem)
        let forwardApplication = modem.applications.find(x => x.type === 'forward') || modem.applications[0]
        forwardApplication.mcgs = this.selectedForwardMcgs
        // Set type to String 'forward' (it may be either 'broadcast' or 'SCPC' before
        forwardApplication.type = 'forward'
        let returnApplication = modem.applications.find(x => x.type === 'return') || _.cloneDeep(this.modem.applications[0])
        returnApplication.mcgs = this.selectedReturnMcgs
        // Set type to String 'return' (it may be either 'broadcast' or 'SCPC' before
        returnApplication.type = 'return'
        // Push the cloned application as the 2nd application for return path
        if (modem.applications.length === 1) {
          modem.applications.push(returnApplication)
        }
        this.$store.dispatch('linkcalc/upsertSelectedModemsAndMcgs', { modem: this.extendModemObject(modem) })
      },
      updateForwardMcgs ({ mcgs }) {
        this.selectedForwardMcgs = mcgs
        this.updateMcgs()
      },
      updateReturnMcgs ({ mcgs }) {
        this.selectedReturnMcgs = mcgs
        this.updateMcgs()
      },
      extendModemObject (modemObj) {
        return _.assign(modemObj, { bestMcg: this.bestMcg })
      },
      dispatchModem () {
        let modem = this.extendModemObject(_.cloneDeep(this.modem))
        if (this.bestMcg) {
          this.$store.dispatch('linkcalc/upsertSelectedModemsAndMcgs', { modem })
        } else {
          // if not find best mcg is selected, clear the MCGs array of all application first
          modem.applications.forEach(x => {
            x.mcgs = []
          })
          this.$store.dispatch('linkcalc/upsertSelectedModemsAndMcgs', { modem })
        }
      }
    },
    computed: {
      forwardMcgs () {
        return this.findMcgsFromPath('forward')
      },
      returnMcgs () {
        return this.findMcgsFromPath('return')
      }
    },
    props: {
      modem: {
        type: Object,
        required: true
      }
    }
  }
</script>
