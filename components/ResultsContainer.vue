<template>
  <div>
    <results-separate-by-path
      v-if="resultNotEmpty"
    />
   <div v-else>
     <br>
     <article class="message has-text-centered">
       <div class="message-body">
         There is no result yet. Submitting the link budget request will generate the result here.
       </div>
     </article>
   </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import ResultsSeparateByPath from './ResultsSeparateByPath'
  export default {
    components: {
      ResultsSeparateByPath
    },
    computed: {
      resultNotEmpty () {
        return !_.isEmpty(this.$store.state.linkcalc.linkResults)
      }
    }
  }
</script>
