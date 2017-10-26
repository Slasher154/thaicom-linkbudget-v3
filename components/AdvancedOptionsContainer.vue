<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">ADVANCED OPTIONS</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="field">
          <b-checkbox
            v-model="maxCoverage"
            @input="updateMaxCoverage"
          >Find maximum coverage</b-checkbox>
        </div>
        <article
          v-if="maxCoverage"
          class="message is-info">
          <div class="message-body">
            Finding maximum coverage will require the user to input fixed MCG(s) and transponder(s). Finding best transponder and best MCG options cannot be selected simultaneously with finding maximum coverage. Using this option will ignore any locations input by user.
          </div>
        </article>
        <div class="field">
          <b-checkbox
            v-model="maxLinkAvailability"
            @input="updateMaxLinkAvailability"
          >Find maximum total link availability</b-checkbox>
        </div>
        <article
          v-if="maxLinkAvailability"
          class="message is-info">
          <div class="message-body">
            The calculation will attempt to find maximum total link availability based on the least efficient MCG (for ACM) at rain fade or the given fixed MCG, instead of calculate based on standard total link availability.
          </div>
        </article>
        <div class="field">
          <b-checkbox
            v-model="maxMode"
            @input="updateMaxMode"
          >Calculate with Max Mode</b-checkbox>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        maxCoverage: false,
        maxLinkAvailability: false,
        maxMode: false
      }
    },
    methods: {
      dispatchOption (option, status) {
        this.$store.dispatch(`linkcalc/${option}`, status)
      },
      updateMaxCoverage (status) {
        this.dispatchOption('setMaxCoverage', status)
      },
      updateMaxLinkAvailability (status) {
        this.dispatchOption('setMaxLinkAvailability', status)
      },
      updateMaxMode (status) {
        this.dispatchOption('setMaxMode', status)
      }
    }
  }
</script>
