<template>
  <b-table
    :data="data"
    :bordered="true"
    :narrowed="true"
  >
    <template scope="props">
      <b-table-column
        label="Parameter">
        {{props.row.parameter}}
      </b-table-column>
      <b-table-column
        label="Value"
      >
        {{props.row.value}}
      </b-table-column>
      <b-table-column
        label="Unit">
        {{props.row.unit}}
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
  export default {
    props: {
      data: {
        required: true
      }
    }
  }
</script>
