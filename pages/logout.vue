<template>

  <div>
    <h1>Logging out...</h1>
    <a :href="logoutUrl" ref="logoutLink"></a>
  </div>
</template>

<script>
  export default {
    mounted () {
      const elem = this.$refs.logoutLink
      elem.click()
    },
    computed: {
      logoutUrl () {
        let redirectUrl = process.env.baseUrl
        return `https://poseidon.thaicom.net/connect/directlogout?callback_url=${redirectUrl}`
      }
    }
  }
</script>
