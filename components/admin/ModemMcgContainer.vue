<template>
  <div>
    <b-field label="MCGs copied from Excel">
      <b-input
        type="textarea"
        v-model="mcgText"
        @input="transformMcgsIntoArray"
      ></b-input>
    </b-field>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th>No.</th>
        <th>MCG</th>
        <th>Spectral Efficiency (MBE) (bps/Hz)</th>
        <th>Threshold Es/No (dB)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(mcg, index) in mcgArray"
          key="index"
      >
        <td>{{index + 1}}</td>
        <td>{{mcg.name}}</td>
        <td>{{mcg.spectral_efficiency}}</td>
        <td>{{mcg.es_no}}</td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        mcgArray: [],
        mcgText: '',
        columnHeaders: [
          'name', 'spectral_efficiency', 'es_no'
        ]
      }
    },
    props: {
      mcgs: {
        type: Array,
        required: true
      }
    },
    mounted () {
      if (this.mcgs && this.mcgs.length > 0) {
        this.mcgArray = this.mcgs
      }
    },
    methods: {
      transformMcgsIntoArray () {
        let transformedMcgArray = this.$_transformExcelTableToObjects(this.mcgText, this.columnHeaders)
        console.log(JSON.stringify(transformedMcgArray))
        transformedMcgArray.forEach(m => {
          m.spectral_efficiency = +m.spectral_efficiency
          m.es_no = +m.es_no
        })
        this.mcgArray = transformedMcgArray
        this.updateMcgs()
      },
      updateMcgs () {
        this.$emit('mcgsChanged', this.mcgArray)
      }
    },
    watch: {
      mcgs (newVal) {
        this.mcgArray = newVal
      }
    }
  }
</script>
