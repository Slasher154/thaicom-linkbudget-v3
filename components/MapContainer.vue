<template>
  <div>
    <base-map
      :height="600"
      :zoom="4"
    />
  </div>
</template>

<script>
  import BaseMap from './BaseMap'
  export default {
    components: {
      BaseMap
    }
  }
</script>
