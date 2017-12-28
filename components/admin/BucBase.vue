<template>
  <div class="column is-12">
    <b-field
      horizontal
      label="Name"
    >
      <b-input
        v-model="newBuc.name"
        name="bucName"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Size (Watts)"
    >
      <b-input
        v-model.number="newBuc.size"
        name="bucSize"
        step="0.1"
        min="0"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="IFL (dB)"
    >
      <b-input
        v-model.number="newBuc.ifl"
        name="bucSize"
        step="0.1"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="OBO (dB)"
    >
      <b-input
        v-model.number="newBuc.obo"
        name="bucSize"
        step="0.1"
      >
      </b-input>
    </b-field>


  </div>
</template>

<script>
  export default {
    props: {
      buc: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        newBuc: {
          name: '',
          vendor: 'Standard',
          size: 0,
          category: 'buc',
          type: 'Standard',
          ifl: 0.3,
          obo: 0.5
        }
      }
    },
    mounted () {
      if (this.buc.name) {
        this.newBuc = Object.assign({}, this.buc)
      }
    },
    methods: {
      emitBuc (newBuc) {
        // construct buc object
        let buc = Object.assign({}, newBuc)
        this.$emit('bucChanged', buc)
      }
    },
    watch: {
      buc (newVal) {
        this.newBuc = newVal
      },
      newBuc: {
        handler (newVal) {
          this.emitBuc(newVal)
        },
        deep: true
      }
    }
  }
</script>
