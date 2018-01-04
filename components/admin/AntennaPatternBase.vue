<template>
  <div class="columns">
    <div class="column">
      <b-field horizontal label="Frequency (GHz)">
        <b-input
          v-model.number="newPattern.frequency"
          @input="generatePattern"
        >
        </b-input>
      </b-field>
      <b-field horizontal label="Data">
        <b-input
          v-model="patternDataText"
          @input="generatePattern"
          type="textarea"
          placeholder="Copy degrees and GRR from Excel and paste in here"
        >
        </b-input>
      </b-field>
    </div>
    <div class="column">

    </div>
  </div>
</template>

<script>
  export default {
    props: {
      pattern: {
        type: Object,
        required: true
      },
      index: {
        type: Number
      }
    },
    data () {
      return {
        newPattern: {
          frequency: 12,
          data: []
        },
        patternDataText: '',
        columnHeaders: ['degree', 'value']
      }
    },
    methods: {
      generatePattern () {
        // Construct pattern object
        let arrayOfPatternValues = this.$_transformExcelTableToObjects(this.patternDataText, this.columnHeaders)
        if (arrayOfPatternValues) {
          arrayOfPatternValues.forEach(v => {
            v.degree = +v.degree
            v.value = +v.value
          })
          let pattern = Object.assign({}, this.newPattern, { index: this.index, data: arrayOfPatternValues })
          this.$emit('patternChanged', pattern)
        }
      }
    },
    mounted () {
      this.newPattern = this.pattern
    },
    watch: {
      pattern: {
        handler (newVal) {
          this.newPattern = newVal
        },
        deep: true
      }
    }
  }
</script>
