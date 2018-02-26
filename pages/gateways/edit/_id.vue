<template>
  <section>
    <h1 class="title">Edit Gateway: {{gateway.name}}</h1>
    <gateway-base
      :gateway="gateway"
      @gatewayChanged="updateGateway"
    >
    </gateway-base>
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
        <span>Save Gateway to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  import GatewayBase from '@/components/admin/GatewayBase'
  import axios from 'axios'
  export default {
    components: {
      GatewayBase
    },
    // Validate route parameters
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async asyncData ({ params }) {
      // Fetch the gateway from database via API
      try {
        let gatewayResult = await axios.post('/gateways/find-by-id', { gatewayId: params.id })
        if (gatewayResult) {
          return {
            gateway: gatewayResult.data.gateway
          }
        } else {
          console.log(`Gateway with ID ${params.id} cannot be found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        newGateway: {}
      }
    },
    methods: {
      updateGateway (value) {
        this.newGateway = value
      },
      saveChanges () {
        this.newGateway._id = this.gateway._id
        this.$dialog.confirm({
          message: `Save chanegs to '${this.gateway.name}'?`,
          onConfirm: () => {
            axios.post('/gateways/edit', { gateway: this.newGateway }).then(result => {
              this.$toast.open(`Gateway has been successfully edited.`)
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
