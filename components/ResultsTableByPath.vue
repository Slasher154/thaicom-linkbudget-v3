<template>
  <b-table
    :data="linkResultsTableData(path)"
    :bordered="true"
  >
    <template scope="props">

      <b-table-column v-for="(column, index) in tableFields"
                      :key="index"
                      :label="column.title"
                      :visible="column.visible">
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
