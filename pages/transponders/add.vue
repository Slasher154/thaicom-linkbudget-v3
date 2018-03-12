<template>
  <section>
    <h1 class="title">Add new Transponder</h1>
    <b-field
      label="Select Transponder Type to Add"
    >
      <b-select
        v-model="selectedNewTransponderType"
        :disabled="selectedNewTransponderType"
      >
        <option
          v-for="option in newTransponderTypeOptions"
          :value="option.value">
          {{option.text}}
        </option>
      </b-select>
    </b-field>

    <transponder-base
      v-if="selectedNewTransponderType"
      :transponder="transponder"
      :isBroadband="isBroadband"
      :transponderPath="transponderPath"
      @transponderChanged="updateTransponder"
    ></transponder-base>
    <hr>
    <div
      v-if="selectedNewTransponderType"
      class="has-text-centered">
      <button class="button is-primary" @click="addTransponder">
        <b-icon
          pack="fa"
          icon="save">
        </b-icon>
        <span>Save Transponder to database</span>
      </button>
    </div>
  </section>
</template>

<script>
  /* eslint-disable indent */

  import TransponderBase from '@/components/admin/TransponderBase'
  import axios from 'axios'
  export default {
    components: {
      TransponderBase
    },
    data () {
      return {
        newTransponderTypeOptions: [
          { value: 'broadbandForward', text: 'Broadband Forward', tpType: 'broadband', path: 'forward' },
          { value: 'broadbandReturn', text: 'Broadband Return', tpType: 'broadband', path: 'return' }
        ],
        selectedNewTransponderType: null,
        transponder: {
          // Add this object to generate default value for backoff settings in TransponderBase component
          backoff_settings: [
            {
              num_carriers: 'single',
              ibo: 0,
              obo: 0,
              intermod: 0
            },
            {
              num_carriers: 'two',
              ibo: 0,
              obo: 0,
              intermod: 0
            },
            {
              num_carriers: 'multi',
              ibo: 0,
              obo: 0,
              intermod: 0
            }
          ]
        },
        newTransponder: {}
      }
    },
    computed: {
      isBroadband () {
        return this.selectedNewTransponderType && this.findValueFromTransponderTypeOptions({
            selectedOptionValue: this.selectedNewTransponderType,
            valueToSearch: 'tpType'
          }) === 'broadband'
      },
      transponderPath () {
        if (this.selectedNewTransponderType) {
          return this.findValueFromTransponderTypeOptions({
              selectedOptionValue: this.selectedNewTransponderType,
              valueToSearch: 'path'
            })
        }
        return false
      }
    },
    methods: {
      findValueFromTransponderTypeOptions ({selectedOptionValue, valueToSearch}) {
        let selectedOption = this.newTransponderTypeOptions.find(op => op.value === selectedOptionValue)
        return selectedOption[valueToSearch]
      },
      updateTransponder (value) {
        this.newTransponder = value
      },
      addTransponder () {
        this.$dialog.confirm({
          message: `Add '${this.newTransponder.name}'?`,
          onConfirm: () => {
            axios.post('/transponders/add', { transponder: this.newTransponder }).then(result => {
              this.$toast.open(`${result.data.transponder.name} has been successfully added.`)
              this.$router.replace({ name: 'transponders' })
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }
    }
  }
</script>

