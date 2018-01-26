<template>
  <b-table
    :data="resultTableData"
    :row-class="(row, index) => row.passedTextClear === 'Yes' ? '' : 'is-danger'"
    detailed
    detail-key="index"
  >
    <template scope="props">

      <b-table-column v-for="(column, index) in tableFields"
                      :key="index"
                      :label="column.title"
                      :visible="column.visible"
                      :field="column.name"
                      sortable
      >
        {{ props.row[column.name] }}
      </b-table-column>
    </template>
    <template slot="detail" scope="props">
      <results-detail-by-case
        :linkResult="props.row"
        :path="path"
      />
    </template>
  </b-table>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ResultsDetailByCase from './ResultsDetailByCase'
  export default {
    components: {
      ResultsDetailByCase
    },
    props: {
      path: {
        type: String,
        default: 'forward'
      }
    },
    computed: {
      ...mapGetters('linkcalc', [
        'linkResultsTableData'
      ]),
      tableFields () {
        return this.$store.state.linkcalc[this.path + 'TableFields']
      },
      resultTableData () {
        let results = this.linkResultsTableData(this.path)
        results.forEach((re, index) => {
          re.index = index
        })
        return results
      }
    }
  }
</script>

<style>
  tr.is-danger {
    background: hsl(348, 100%, 61%) !important;
    color: white
  }
</style>
