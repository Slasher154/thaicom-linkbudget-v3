<template>
  <div class="column is-12">
    <b-field
      horizontal
      label="Name">
      <b-input
        v-model="newModem.name"
        name="modemName"
      />
    </b-field>
    <b-field
      horizontal
      label="Vendor">
      <b-select v-model="newModem.vendor">
        <option v-for="(vendor, index) in vendorOptions"
                :value="vendor"
                :key="index"
        >{{vendor}}
        </option>
      </b-select>
    </b-field>
    <hr>
    <modem-application
      v-for="(app, index) in newModem.applications"
      :key="index"
      :application="app"
      :index="index"
      @applicationChanged="updateApplication"
    />
    <b-field horizontal>
      <p class="control">
        <button class="button is-info" @click="addApp">Add Application</button>
      </p>
    </b-field>
  </div>

</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import ModemApplication from './ModemApplication'
  export default {
    components: {
      ModemApplication
    },
    props: {
      modem: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        newModem: {
          name: '',
          vendor: 'Gilat',
          warning_messages: [],
          applications: []
        },
        applications: [],
        vendorOptions: []
      }
    },
    async created () {
      try {
        let result = await axios.get('/modem-vendors')
        this.vendorOptions = result.data.modemVendors.map(x => x.name)
      } catch (e) {
        console.log(e)
      }
    },
    mounted () {
      if (this.modem.name && this.modem.vendor) {
        this.newModem = Object.assign({}, this.modem)
      }
    },
    computed: {
      dummyApplication () {
        return {
          name: '',
          type: 'forward',
          acm: true,
          link_margin: 2,
          minimum_symbol_rate: 1000,
          maximum_symbol_rate: 45000,
          symbol_rates: [],
          roll_off_factor: 1.2,
          mcgs: []
        }
      },
      submitButtonText () {
        return 'Add modem'
      }
    },
    methods: {
      // Create a dummy application
      addApp () {
        this.newModem.applications.push(_.cloneDeep(this.dummyApplication))
      },
      updateApplication (value) {
        console.log(JSON.stringify(value))
        let index = _.findIndex(this.applications, { index: value.index })
        if (index > -1) {
          console.log('app found!')
          this.applications.splice(index, 1, value)
        } else {
          console.log('add new app')
          this.applications.push(value)
        }
        this.emitModem(this.newModem)
      },
      emitModem (newModem) {
        // Construct modem object
        let modem = _.cloneDeep(newModem)
        modem.applications = this.applications
        this.$emit('modemChanged', modem)
      }
    },
    watch: {
      modem (newVal) {
        this.newModem = newVal
      },
      newModem (newVal) {
        this.emitModem(newVal)
      }
    }
  }
</script>
