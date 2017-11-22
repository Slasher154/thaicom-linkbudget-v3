<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">INFORMATION</p>
    </header>
    <div class="card-content">
      <div class="content">
        <b-field label="Request Name">
          <b-input
            placeholder="Request Name"
            @input="updateRequestName"
          ></b-input>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      updateRequestName (value) {
        this.$store.dispatch('linkcalc/setRequestName', value)
      }
    }
  }
</script>
