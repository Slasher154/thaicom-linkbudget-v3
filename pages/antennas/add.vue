<template>
  <section>
    <h1 class="title">Add new antenna</h1>
    <antenna-base
      :antenna="antenna"
      @antennaChanged="updateAntenna"
    ></antenna-base>
    <hr>
    <div class="has-text-centered">
      <button class="button is-primary" @click="addAntenna">
        <b-icon
          pack="fa"
          icon="save">
        </b-icon>
        <span>Save antenna to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  /* eslint-disable indent */

  import AntennaBase from '@/components/admin/AntennaBase'
  import axios from 'axios'
  export default {
    components: {
      AntennaBase
    },
    data () {
      return {
        antenna: {},
        newAntenna: {}
      }
    },
    methods: {
      updateAntenna (value) {
        this.newAntenna = value
      },
      addAntenna () {
        this.$dialog.confirm({
          message: `Add '${this.newAntenna.name}'?`,
          onConfirm: () => {
            axios.post('/antennas/add', { antenna: this.newAntenna }).then(result => {
              this.$toast.open(`${result.data.antenna.name} has been successfully added.`)
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
