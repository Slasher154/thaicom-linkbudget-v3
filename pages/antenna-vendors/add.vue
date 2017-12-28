<template>
  <section>
    <h1 class="title">Add Antenna Vendor</h1>
    <b-field
      horizontal
      label="Name"
    >
      <b-input
        v-model="name"
      ></b-input>
    </b-field>
    <b-field
      horizontal
    >
      <button
        class="button is-primary"
        @click="saveToDatabase"
      >
        Add to database
      </button>
    </b-field>
  </section>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        name: ''
      }
    },
    methods: {
      saveToDatabase () {
        this.$dialog.confirm({
          message: `Add '${this.name}' to antenna vendor database?`,
          onConfirm: () => {
            axios.post('/antenna-vendors/add', { name: this.name }).then(result => {
              if (result) {
                this.$toast.open(`${result.data.antennaVendor.name} has been successfully added to database`)
                this.$router.replace({ name: 'antennas' })
              }
            }).catch(e => {
              this.$toast.open(e)
            })
          }
        })
      }
    }
  }
</script>
