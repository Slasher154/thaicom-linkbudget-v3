<template>
  <section>
    <h1 class="title">Edit Constant: {{constant.name}}</h1>
    <constant-base
      :constant="constant"
      @constantChanged="updateConstant"
    >
    </constant-base>
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
        <span>Save Constant to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  import ConstantBase from '@/components/admin/ConstantBase'
  import axios from 'axios'
  export default {
    components: {
      ConstantBase
    },
    // Validate route parameters
    validate ({ params }) {
      // ID must be String
      return typeof params.id === 'string'
    },
    async asyncData ({ params }) {
      // Fetch the constant from database via API
      try {
        let constantResult = await axios.post('/constants/find-by-id', { constantId: params.id })
        if (constantResult) {
          return {
            constant: constantResult.data.constant
          }
        } else {
          console.log(`Constant with ID ${params.id} cannot be found`)
        }
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        newConstant: {}
      }
    },
    methods: {
      updateConstant (value) {
        this.newConstant = value
      },
      saveChanges () {
        this.newConstant._id = this.constant._id
        this.$dialog.confirm({
          message: `Save chanegs to '${this.constant.name}'?`,
          onConfirm: () => {
            axios.post('/constants/edit', { constant: this.newConstant }).then(result => {
              this.$toast.open(`${result.data.constant.name} has been successfully edited.`)
              this.$router.replace({ name: 'constants' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>
