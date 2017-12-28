<template>
  <section>
    <h1 class="title">Add new modem</h1>
    <modem-base
      :modem="modem"
      @modemChanged="updateModem"
    ></modem-base>
    <hr>
    <div class="has-text-centered">
      <button class="button is-primary" @click="addModem">
        <b-icon
          pack="fa"
          icon="save">
        </b-icon>
        <span>Save modem to database</span>
      </button>
    </div>
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
        this.$dialog.confirm({
          message: `Add '${this.newModem.name}'?`,
          onConfirm: () => {
            axios.post('/modems/add', { modem: this.newModem }).then(result => {
              this.$toast.open(`${result.data.modem.name} has been successfully added.`)
              this.$router.replace({ name: 'modems' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>
