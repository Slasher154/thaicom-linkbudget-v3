<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">ADVANCED OPTIONS</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="field">
          <b-checkbox
            v-model="findMaxCoverage"
            @input="updateMaxCoverage"
          >Find maximum coverage</b-checkbox>
        </div>
        <div
          v-if="findMaxCoverage"
          class="columns">
          <div class="column is-6">
            <b-field label="Forward Link Margin(s) (dB)">
              <b-input placeholder="Example: 2,0"
                @input="updateForwardLinkMargins"
              ></b-input>
            </b-field>
          </div>
          <div class="column is-6" v-if="!findMatchingReturnCoverage">
            <b-field label="Return Link Margin(s) (dB)">
              <b-input placeholder="Example: 2,0"
               @input="updateReturnLinkMargins"
              ></b-input>
            </b-field>
          </div>
        </div>
        <div v-if="findMaxCoverage" class="field">
          <b-checkbox
            v-model="findMatchingReturnCoverage"
            @input="updateMatchingReturnCoverage"
          >Automatically calculate the performance at the matching return beam contour
            <b-tooltip
              label="Using this option means, after the forward maximum contour is found for each station, it will automatically find the return beam contour that covers the forward contour. Then, it attempts to close the link with given return MCGs, capacity and BUC size. In this case, the modem's default link margin value will be used for return link"
              size="is-large"
              type="is-info"
              multilined>
              <span><strong>(?)</strong></span>
            </b-tooltip>
          </b-checkbox>
        </div>
        <article
          v-if="findMaxCoverage"
          class="message is-info">
          <div class="message-body">
            Finding maximum coverage will require the user to input fixed MCG(s) and transponder(s). Finding best transponder and best MCG options cannot be selected simultaneously with finding maximum coverage. Using this option will ignore any locations input by user. In addition, you need to give the desired link margins in comma separated value. This link margin will be applied to find the max coverage under clear sky condition and will overwrite the existing modem link margin value.
          </div>
        </article>
        <div class="field">
          <b-checkbox
            v-model="findMaxLinkAvailability"
            @input="updateMaxLinkAvailability"
          >Find maximum total link availability</b-checkbox>
        </div>
        <article
          v-if="findMaxLinkAvailability"
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
        findMaxCoverage: false,
        findMaxLinkAvailability: false,
        findMatchingReturnCoverage: true,
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
      updateMatchingReturnCoverage (status) {
        this.dispatchOption('setMatchingReturnCoverage', status)
      },
      updateMaxLinkAvailability (status) {
        this.dispatchOption('setMaxLinkAvailability', status)
      },
      updateMaxMode (status) {
        this.dispatchOption('setMaxMode', status)
      },
      updateForwardLinkMargins (value) {
        let arrayOfLinkMargins = value.split(',')
        this.dispatchOption('setForwardLinkMargins', arrayOfLinkMargins.map(v => +v))
      },
      updateReturnLinkMargins (value) {
        let arrayOfLinkMargins = value.split(',')
        this.dispatchOption('setReturnLinkMargins', arrayOfLinkMargins.map(v => +v))
      }
    }
  }
</script>
