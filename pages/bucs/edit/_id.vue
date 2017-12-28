<template>
  <section>
    <h1 class="title">Edit BUC: {{buc.name}}</h1>
    <buc-base
      :buc="buc"
      @bucChanged="updateBuc"
    >
    </buc-base>
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
        <span>Save BUC to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  import BucBase from '@/components/admin/BucBase'
  import axios from 'axios'
  export default {
    components: {
      BucBase
    },
    // Validate route parameters
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async asyncData ({ params }) {
      // Fetch the buc from database via API
      try {
        let bucResult = await axios.post('/bucs/find-by-id', { bucId: params.id })
        if (bucResult) {
          return {
            buc: bucResult.data.buc
          }
        } else {
          console.log(`Buc with ID ${params.id} cannot be found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        newBuc: {}
      }
    },
    methods: {
      updateBuc (value) {
        this.newBuc = value
      },
      saveChanges () {
        this.newBuc._id = this.buc._id
        this.$dialog.confirm({
          message: `Save chanegs to '${this.buc.name}'?`,
          onConfirm: () => {
            axios.post('/bucs/edit', { buc: this.newBuc }).then(result => {
              this.$toast.open(`${result.data.buc.name} has been successfully edited.`)
              this.$router.replace({ name: 'bucs' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>
