<template>
  <div class="column is-12">
    <b-field
      horizontal
      label="Name"
    >
      <b-input
        v-model="newConstant.name"
        name="constantName"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Alias"
    >
      <b-input
        v-model="newConstant.alias"
        name="constantAlias"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Value"
    >
      <b-input
        v-model="newConstant.value"
        name="constantValue"
      >
      </b-input>
    </b-field>
    <b-field
      horizontal
      label="Unit"
    >
      <b-input
        v-model.number="newConstant.unit"
        name="constantUnit"
      >
      </b-input>
    </b-field>


  </div>
</template>

<script>
  export default {
    props: {
      constant: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        newConstant: {
          name: '',
          alias: '',
          value: 0,
          unit: ''
        }
      }
    },
    mounted () {
      if (this.constant.name) {
        this.newConstant = Object.assign({}, this.constant)
      }
    },
    methods: {
      emitConstant (newConstant) {
        // construct constant object
        let constant = Object.assign({}, newConstant)
        if (!isNaN(constant.value)) {
          constant.value = +constant.value // convert to number
        }
        this.$emit('constantChanged', constant)
      }
    },
    watch: {
      constant (newVal) {
        this.newConstant = newVal
      },
      newConstant: {
        handler (newVal) {
          this.emitConstant(newVal)
        },
        deep: true
      }
    }
  }
</script>
