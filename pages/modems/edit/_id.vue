<template>
  <section>
    <h1 class="title">Edit modem: {{modem.name}}</h1>
    <modem-base
      :modem="modem"
      @modemChanged="updateModem"
    ></modem-base>
    <b-field
      position="is-centered">
      <p class="control">
        <button class="button is-primary" @click="saveChanges">Save Changes</button>
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
    // Validate route parameters
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async asyncData ({ params }) {
      // Fetch the modem from database via API
      try {
        console.log(`Modem ID = ${params.id}`)
        let modemResult = await axios.post('/modems/find-by-id', { modemId: params.id })
        return {
          modem: modemResult.data.modem
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        newModem: {},
        modem: {}
      }
    },
    methods: {
      updateModem (value) {
        this.newModem = value
      },
      saveChanges () {
        this.newModem._id = this.modem._id
        this.$dialog.confirm({
          message: `Save changes to '${this.modem.name}'?`,
          onConfirm: () => {
            axios.post('/modems/edit', { modem: this.newModem }).then(result => {
              this.$toast.open(`${result.data.modem.name} has been successfully edited.`)
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
