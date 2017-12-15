<template>
  <section>
    <h1 class="title">Add new modem</h1>
    <modem-base
      :modem="modem"
      @modemChanged="updateModem"
    ></modem-base>
    <b-field
      position="is-centered">
      <p class="control">
        <button class="button is-primary" @click="addModem">Add modem</button>
      </p>
    </b-field>
  </section>
</template>

<script>
  /* eslint-disable indent */

  import ModemBase from '@/components/admin/ModemBase'
  import axios from 'axios'
  export default {
    components: {
      ModemBase
    },
    async asyncData () {
      // Fetch the modem from database via API
      // Fetch teh vendors
      try {
        let result = await axios.get('/modem-vendors')
        return {
          modemVendors: result.data.modemVendors.map(x => x.name)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        modem: {},
        newModem: {}
      }
    },
    methods: {
      updateModem (value) {
        this.newModem = value
      },
      addModem () {
        axios.post('/modems/add', { modem: this.newModem }).then(result => {
          this.$toast.open('Modem add')
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>
