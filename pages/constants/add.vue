<template>
  <section>
    <h1 class="title">Add new Constant</h1>
    <constant-base
      :constant="constant"
      @constantChanged="updateConstant"
    ></constant-base>
    <hr>
    <div class="has-text-centered">
      <button class="button is-primary" @click="addConstant">
        <b-icon
          pack="fa"
          icon="save">
        </b-icon>
        <span>Save Constant to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  /* eslint-disable indent */

  import ConstantBase from '@/components/admin/ConstantBase'
  import axios from 'axios'
  export default {
    components: {
      ConstantBase
    },
    data () {
      return {
        constant: {},
        newConstant: {}
      }
    },
    methods: {
      updateConstant (value) {
        this.newConstant = value
      },
      addConstant () {
        this.$dialog.confirm({
          message: `Add '${this.newConstant.name}'?`,
          onConfirm: () => {
            axios.post('/constants/add', { constant: this.newConstant }).then(result => {
              this.$toast.open(`${result.data.constant.name} has been successfully added.`)
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

