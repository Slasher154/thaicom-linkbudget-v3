<template>
  <section>
    <h1 class="title">Add new Gateway</h1>
    <gateway-base
      :gateway="gateway"
      @gatewayChanged="updateGateway"
    ></gateway-base>
    <hr>
    <div class="has-text-centered">
      <button class="button is-primary" @click="addGateway">
        <b-icon
          pack="fa"
          icon="save">
        </b-icon>
        <span>Save Gateway to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  /* eslint-disable indent */

  import GatewayBase from '@/components/admin/GatewayBase'
  import axios from 'axios'
  export default {
    components: {
      GatewayBase
    },
    data () {
      return {
        gateway: {},
        newGateway: {}
      }
    },
    methods: {
      updateGateway (value) {
        this.newGateway = value
      },
      addGateway () {
        this.$dialog.confirm({
          message: `Add '${this.newGateway.name}'?`,
          onConfirm: () => {
            axios.post('/gateways/add', { gateway: this.newGateway }).then(result => {
              this.$toast.open(`${result.data.gateway.name} has been successfully added.`)
              this.$router.replace({ name: 'gateways' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>

