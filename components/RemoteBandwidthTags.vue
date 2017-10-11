<template>
  <b-field grouped group-multiline>
    <div
      v-if="item"
      v-for="item in $store.state.linkcalc.selectedBandwidth"
      key="item.id"
      class="control">
      <b-tag
        type="is-medium" attached closable
        @close="removeBandwidth(item.id)"
      >{{item.forward}}/{{item.return}} {{item.unit}}</b-tag>
    </div>

     </b-field>
</template>

<script>
  export default {
    methods: {
      removeBandwidth (id) {
        this.$store.dispatch('linkcalc/removeSelectedBandwidth', id)
        this.$forceUpdate() // Force update the component to remove the deleted tags
      }
    }
  }
</script>
