<template>
  <section>
    <h1 class="title">Add new BUC</h1>
    <buc-base
      :buc="buc"
      @bucChanged="updateBuc"
    ></buc-base>
    <hr>
    <div class="has-text-centered">
      <button class="button is-primary" @click="addBuc">
        <b-icon
          pack="fa"
          icon="save">
        </b-icon>
        <span>Save BUC to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  /* eslint-disable indent */

  import BucBase from '@/components/admin/BucBase'
  import axios from 'axios'
  export default {
    components: {
      BucBase
    },
    data () {
      return {
        buc: {},
        newBuc: {}
      }
    },
    methods: {
      updateBuc (value) {
        this.newBuc = value
      },
      addBuc () {
        this.$dialog.confirm({
          message: `Add '${this.newBuc.name}'?`,
          onConfirm: () => {
            axios.post('/bucs/add', { buc: this.newBuc }).then(result => {
              this.$toast.open(`${result.data.buc.name} has been successfully added.`)
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
