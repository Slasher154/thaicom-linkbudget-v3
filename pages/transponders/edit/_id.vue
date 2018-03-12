<template>
  <section>
    <h1 class="title">Edit Transponder: {{transponder.name}}</h1>
    <transponder-base
      :transponder="transponder"
      :isBroadband="isBroadband"
      :transponderPath="transponder.type"
      @transponderChanged="updateTransponder"
    >
    </transponder-base>
    <div class="has-text-centered">
      <button
        class="button is-primary"
        @click="saveChanges"
      >
        <b-icon
          pack="fa"
          icon="save"
        >
        </b-icon>
        <span>Save Transponder to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  import TransponderBase from '@/components/admin/TransponderBase'
  import axios from 'axios'
  export default {
    components: {
      TransponderBase
    },
    // Validate route parameters
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async asyncData ({ params }) {
      // Fetch the transponder from database via API
      try {
        let transponderResult = await axios.post('/transponders/find-by-id', { transponderId: params.id })
        if (transponderResult) {
          let transponder = transponderResult.data.transponder
          let satelliteResult = await axios.post('/satellites-by-name', { name: transponder.satellite })
          if (satelliteResult) {
            return {
              transponder,
              satellite: satelliteResult.data.satellite
            }
          }
          return null
        } else {
          console.log(`Transponder with ID ${params.id} cannot be found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        newTransponder: {}
      }
    },
    computed: {
      isBroadband () {
        return this.satellite.type === 'Broadband'
      }
    },
    methods: {
      updateTransponder (value) {
        this.newTransponder = value
      },
      saveChanges () {
        this.newTransponder._id = this.transponder._id
        this.$dialog.confirm({
          message: `Save changes to '${this.transponder.name}'?`,
          onConfirm: () => {
            console.log(JSON.stringify(this.newTransponder, undefined, 2))
            axios.post('/transponders/edit', { transponder: this.newTransponder }).then(result => {
              this.$toast.open(`Transponder has been successfully edited.`)
              this.$router.replace({ name: 'transponders' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>
