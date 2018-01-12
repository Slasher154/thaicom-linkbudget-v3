<template>
  <b-table
    :data="linkResultsTableData(path)"
    :row-class="(row, index) => row.passedTextClear === 'Yes' ? '' : 'is-danger'"
    :bordered="true"
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
  </b-table>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
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
