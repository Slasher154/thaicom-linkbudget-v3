<template>
  <div>
    <b-field horizontal>
      <p class="control">
        <a class="button is-static">Application {{index +1}}</a>
      </p>
    </b-field>
    <b-field horizontal
             label="Name"
    >
      <b-input name="name" placeholder="Application Name" v-model="newApplication.name" />
    </b-field>
    <b-field horizontal label="Type">
      <b-select v-model="newApplication.type">
        <option value="forward">Forward</option>
        <option value="return">Return</option>
        <option value="Broadcast">Broadcast</option>
        <option value="SCPC">SCPC</option>
      </b-select>
    </b-field>
    <b-field horizontal label="ACM">
      <b-checkbox v-model="newApplication.acm" />
    </b-field>
    <b-field horizontal label="Default Link Margin (dB)">
      <b-input
        v-model.number="newApplication.link_margin"
        name="linkMargin"
        type="number"
        min="0"
        placeholder="Link Margin (dB)"
      />
    </b-field>
    <b-field horizontal label="Minimum Symbol Rate (ksps)">
      <b-input
        v-model.number="newApplication.minimum_symbol_rate"
        name="minimumSymbolRate"
        type="number"
        min="0"
        />
    </b-field>
    <b-field horizontal label="Maximum Symbol Rate (ksps)">
      <b-input
        v-model.number="newApplication.maximum_symbol_rate"
        name="maximumSymbolRate"
        type="number"
        min="0"
        />
    </b-field>
    <b-field horizontal
             label="Available Symbol Rates (ksps)"
    >
      <b-input
        :value="symbolRates"
        @input="updateSymbolRates"
        placeholder="Ex. 128,256,512,1024,2048. If there is no limitation of symbol rates, just leave it blank."
        />
    </b-field>
    <b-field horizontal
      label="Roll-off factor"
      placeholder="Please input one value only. Ex. 1.05 or 1.2 or 1.35">
      <b-input
        v-model.number="newApplication.roll_off_factor"
        name="rollOffFactor"
        type="number"
        step="0.01"
        min="0"
      />
    </b-field>
    <modem-mcg-container
      :mcgs="newApplication.mcgs"
      @mcgsChanged="updateMcgs"
    />
    <hr>
  </div>
</template>

<script>
  import ModemMcgContainer from './ModemMcgContainer'
  import _ from 'lodash'
  export default {
    components: {
      ModemMcgContainer
    },
    props: {
      application: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        newApplication: {
          name: '',
          type: 'forward',
          acm: true,
          link_margin: 2,
          minimum_symbol_rate: 1000,
          maximum_symbol_rate: 30000,
          roll_off_factor: 1.2,
          symbol_rates: [],
          mcgs: []
        },
        mcgs: [],
        symbolRates: ''
      }
    },
    methods: {
      updateSymbolRates (value) {
        this.newApplication.symbol_rates = value.split(',').map(v => +v)
      },
      updateMcgs (value) {
        this.mcgs = value
        let newApp = _.cloneDeep(this.newApplication)
        newApp.mcgs = value
        this.emitChange(newApp)
      },
      emitChange (app) {
        let newApp = _.cloneDeep(app)
        newApp.mcgs = app.mcgs
        newApp.index = this.index
        this.$emit('applicationChanged', newApp)
      }
    },
    mounted () {
      this.newApplication = Object.assign({}, this.application)
      // Update Symbol Rates
      this.symbolRates = this.newApplication.symbol_rates.join(',')
    },
    watch: {
      newApplication: {
        handler (newVal) {
          // Emit the change to the parent
          this.emitChange(newVal)
        },
        deep: true
      }
    }
  }
</script>
