<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        thaicom-linkbudget-v3
      </h1>
      <h2 class="subtitle">
        Thaicom Link Budget for Thaicom 4 and Maritime Projects v3
      </h2>
      <div class="notification">
        This container is <strong>centered</strong> on desktop.
      </div>
      <div class="posts" v-for="post in posts">
        <ul>
          <li><strong>{{post.title}}</strong></li>
          <li>{{post.body}}</li>
        </ul>
        <hr>
      </div>

    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data () {
    return {
      posts: {}
    }
  },
  created () {
    this.$http.get('/posts')
      .then(({data}) => {
        this.posts = data
      })
  }
}
</script>

