<template>
  <div>
    <!--<nav class="level has-shadow is-primary">-->
      <!--<div class="container">-->
            <!--<div class="level-left">-->
              <!--<div class="level-item">-->
                <!--<h3>Link Budget</h3>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="level-right">-->
              <!--<div class="level-item">-->

              <!--</div>-->
              <!--<p class="level-item"><a class="button is-info">Logout</a></p>-->
            <!--</div>-->
        <!--</div>-->
    <!--</nav>-->
    <the-heading />

    <section class="section">
        <div class="container">
          <nuxt />
        </div>
      </section>

  </div>
</template>

<script>
  import TheHeading from '@/components/TheHeading'
  export default {
    components: { TheHeading }
  }
</script>
