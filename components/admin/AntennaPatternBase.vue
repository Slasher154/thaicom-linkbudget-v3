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
      <antenna-pattern-graph
        v-if="patternData.length > 0"
        :patternData="patternData"
        :onAxisGain="onAxisGain"
      />
    </div>
  </div>

</template>

<script>
  import AntennaPatternGraph from '../AntennaPatternGraph'
  export default {
    components: {
      AntennaPatternGraph
    },
    props: {
      pattern: {
        type: Object,
        required: true
      },
      antennaSize: {
        type: Number
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
        patternData: [],
        columnHeaders: ['degree', 'value']
      }
    },
    computed: {
      onAxisGain () {
        if (this.antennaSize && this.newPattern.frequency) {
          let antennaEfficiency = 0.6
          let wavelength = (3 * Math.pow(10, 8)) / (this.newPattern.frequency * Math.pow(10, 9))
          return 10 * Math.log10(antennaEfficiency * Math.pow(Math.PI * this.antennaSize / wavelength, 2))
        } else {
          return null
        }
      }
    },
    methods: {
      generatePattern () {
        // Construct pattern object
        if (this.patternDataText !== '') {
          let arrayOfPatternValues = this.$_transformExcelTableToObjects(this.patternDataText, this.columnHeaders)
          if (arrayOfPatternValues) {
            arrayOfPatternValues.forEach(v => {
              v.degree = +v.degree
              v.value = +v.value
            })
            this.patternData = arrayOfPatternValues // Assign to component data to show in the graph
            let pattern = Object.assign({}, this.newPattern, {index: this.index, data: arrayOfPatternValues})
            this.$emit('patternChanged', pattern)
          }
        }
      }
    },
    mounted () {
      this.newPattern = this.pattern
      this.patternData = this.pattern.data // show the pattern in graph when component is mounted or updated
    },
    watch: {
      pattern: {
        handler (newVal) {
          this.newPattern = newVal
          this.patternData = newVal.data // update the pattern in graph when antenna size is changed
        },
        deep: true
      }
    }
  }
</script>
