<template>
  <section>
    <h1 class="title">Edit antenna: {{antenna.name}}</h1>
    <antenna-base
      :antenna="antenna"
      @antennaChanged="updateAntenna"
    >
    </antenna-base>
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
        <span>Save antenna to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  import AntennaBase from '@/components/admin/AntennaBase'
  import axios from 'axios'
  export default {
    components: {
      AntennaBase
    },
    // Validate route parameters
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async asyncData ({ params }) {
      // Fetch the antenna from database via API
      try {
        let antennaResult = await axios.post('/antennas/find-by-id', { antennaId: params.id })
        if (antennaResult) {
          return {
            antenna: antennaResult.data.antenna
          }
        } else {
          console.log(`Antenna with ID ${params.id} cannot be found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        newAntenna: {}
      }
    },
    methods: {
      updateAntenna (value) {
        this.newAntenna = value
      },
      saveChanges () {
        this.newAntenna._id = this.antenna._id
        this.$dialog.confirm({
          message: `Save chanegs to '${this.antenna.name}'?`,
          onConfirm: () => {
            axios.post('/antennas/edit', { antenna: this.newAntenna }).then(result => {
              this.$toast.open(`${result.data.antenna.name} has been successfully edited.`)
              this.$router.replace({ name: 'antennas' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>
