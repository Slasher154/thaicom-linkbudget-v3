<template>
  <b-field
    grouped
  >
    <b-field label="Backoff Settings">
      <b-input
        v-model="newSettingsObject.num_carriers"
        disabled
      ></b-input>
    </b-field>
    <b-field label="IBO (dB)">
      <b-input
        v-model.number="newSettingsObject.ibo"
        step="0.1"
      ></b-input>
    </b-field>
    <b-field label="OBO (dB)">
      <b-input
        v-model.number="newSettingsObject.obo"
        step="0.1"
      ></b-input>
    </b-field>
    <b-field label="Intermod (dB)">
      <b-input
        v-model.number="newSettingsObject.intermod"
        step="0.1"
      ></b-input>
    </b-field>
  </b-field>
</template>

<script>
  export default {
    mounted () {
      this.newSettingsObject = Object.assign({}, this.settingsObject)
    },
    props: {
      settingsObject: {}
    },
    data () {
      return {
        newSettingsObject: {}
      }
    },
    computed: {
      label () {
        return `Backoff Settings: ${this.settingsObject.num_carriers}`
      }
    },
    methods: {
      updateSettings (val) {
        // Push the update back to parent
        this.$emit('settingsUpdated', { settingsObject: Object.assign({}, val) })
      }
    },
    watch: {
      newSettingsObject: {
        handler (newVal) {
          this.updateSettings(newVal)
        },
        deep: true
      }
    }
  }
</script>
