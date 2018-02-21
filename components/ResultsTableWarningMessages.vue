<template>
  <b-message
    title="Notes"
    type="is-info">
    <ol>
      <li
        v-for="message in messages"
      >{{message}}</li>
    </ol>
  </b-message>
</template>

<script>
  export default {
    props: {
      messages: {
        required: true,
        type: Array
      }
    }
  }
</script>
