<template>
  <antenna-pattern-chart
    :chart-data="chartData"
    :options="chartOptions"
  />
  <!--<antenna-pattern-chart />-->
</template>

<script>
  /* eslint-disable spaced-comment */
  import _ from 'lodash'
  import AntennaPatternChart from './charts/AntennaPatternChart'
  export default {
    components: {
      AntennaPatternChart
    },
    props: {
      patternData: {
        type: Array
      },
      onAxisGain: {
        type: Number
      }
    },
    data () {
      return {
        chartOptions: {
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              gridLines: {
                drawOnChartArea: true
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    },
    computed: {
      chartData () {
        let patternInXY = this.patternData.map(point => {
          return {
            x: point.degree,
            y: point.value
          }
        })
        let data = {
          datasets: [
            {
              label: 'Pattern Data',
              borderColor: 'red',
              data: patternInXY,
              pointRadius: 1,
              fill: false
            }
          ]
        }
        // Add 29-25log() line if on-axis gain is given
        if (this.onAxisGain) {
          data.datasets.push({
            label: '29-25log()',
            borderColor: 'green',
            data: this.generate29minus25logData(),
            pointRadius: 1,
            fill: false
          })
        }
        return data
      }
    },
    methods: {
      generate29minus25logData () {
        // Generate the 29-25log data between -4.5 to 4.5 degress with 0.1 step
        let degreesRange = _.range(-4.5, 4.5, 0.1)
        return degreesRange.map(deg => {
          return {
            x: deg,
            y: this.calculate29minus25log(deg)
          }
        })
      },
      calculate29minus25log (degrees) {
        if (Math.abs(degrees) < 1) {
          return 29 - this.onAxisGain
        } else {
          return 29 - (25 * Math.log10(Math.abs(degrees))) - this.onAxisGain
        }
      }
    }
  }
</script>
