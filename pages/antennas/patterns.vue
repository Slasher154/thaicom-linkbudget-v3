<template>
  <div>
    <h1 class="title">Antenna Patterns</h1>
    <hr>
    <b-field label="Select Antenna">
      <b-select
        @input="updateAntenna"
        placeholder="Select antenna"
      >
        <option>Select antenna</option>
        <option
          v-for="antenna in antennas"
          :value="antenna._id"
          :key="antenna._id"
        >{{antenna.name}}
        </option>
      </b-select>
    </b-field>
    <hr>
    <template v-if="antennaSelected">
      <antenna-pattern-base
        v-for="(pattern, index) in selectedAntenna.rx_patterns"
        :key="index"
        :pattern="pattern"
        :index="index"
        :antennaSize="selectedAntenna.size"
        @patternChanged="updatePattern('rx',...arguments)"
      />
      <b-field>
        <p class="control">
          <button class="button is-info"
                  @click="addPattern('rx')"
          >
            <b-icon
              icon="plus"
              pack="fa">
            </b-icon>
            <span>Add Rx Pattern</span>
          </button>
        </p>
      </b-field>
      <hr>
      <antenna-pattern-base
        v-for="(pattern, index) in selectedAntenna.tx_patterns"
        :key="index"
        :pattern="pattern"
        :index="index"
        :antennaSize="selectedAntenna.size"
        @patternChanged="updatePattern('tx',...arguments)"
      />
      <b-field>
        <p class="control">
          <button class="button is-warning"
                  @click="addPattern('tx')"
          >
            <b-icon
              icon="plus"
              pack="fa">
            </b-icon>
            <span>Add Tx Pattern</span>
          </button>
        </p>
      </b-field>
      <b-field horizontal label="Remarks">
        <b-input
          v-model="remarks"
          placeholder="Put your description about pattern here"
        ></b-input>
      </b-field>
      <hr>
      <button
        class="button is-primary"
        @click="savePatterns"
      >
        <b-icon
          pack="fa"
          icon="save"
        ></b-icon>
        <span>Save to database</span>
      </button>

    </template>


  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import AntennaPatternBase from '@/components/admin/AntennaPatternBase'
  export default {
    components: {
      AntennaPatternBase
    },
    async asyncData () {
      try {
        let antennasResult = await axios.get('/antennas')
        return {antennas: antennasResult.data.antennas}
      } catch (e) {
        console.log(e)
      }
    },
    data () {
      return {
        selectedAntenna: {},
        txPatterns: [],
        rxPatterns: [],
        remarks: '',
        currentIndex: 0
      }
    },
    computed: {
      antennaSelected () {
        return _.has(this.selectedAntenna, 'name')
      }
    },
    methods: {
      updateAntenna (value) {
        this.selectedAntenna = this.antennas.find(x => x._id === value)
        this.txPatterns = this.selectedAntenna.tx_patterns
        this.rxPatterns = this.selectedAntenna.rx_patterns
        this.remarks = this.selectedAntenna.remarks
      },
      addPattern (path) {
        this.selectedAntenna[path + '_patterns'].push({
          frequency: 0,
          data: [],
          index: this.currentIndex++
        })
      },
      updatePattern (path, value) {
        let patternIndex = _.findIndex(this[path + 'Patterns'], {index: value.index})
        if (patternIndex > -1) {
          this[path + 'Patterns'].splice(patternIndex, 1, value)
        } else {
          this[path + 'Patterns'].push(value)
        }
      },
      savePatterns () {
        this.$dialog.confirm({
          message: `Save pattern changes of '${this.selectedAntenna.name}' to database?`,
          onConfirm: () => {
            let patterns = {
              tx_patterns: this.txPatterns,
              rx_patterns: this.rxPatterns,
              remarks: this.remarks
            }
            axios.post('/antenna-pattern/save', {_id: this.selectedAntenna._id, patterns}).then(result => {
              this.$toast.open(`The patterns of antenna '${this.selectedAntenna.name}' has been updated. `)
              window.location.reload(true)
            }).catch(e => {
              this.$toast.open(e)
            })
          }
        })
      }
    }
  }
</script>
