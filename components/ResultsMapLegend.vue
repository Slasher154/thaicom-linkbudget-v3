<template>
  <div class="field has-addons">
    <p class="control">
      <a class="button is-static">
        <span class="current-color"
              :style="'background-color: ' + item.color"
              @click="showPicker(item)"
        ></span>

        <!--<compact-picker :value="colors"-->
                        <!--@input="updateFromPicker"-->
                        <!--v-if="picker === 'compact' && displayPicker"></compact-picker>-->
      </a>
    </p>
    <p class="control is-expanded">
      <input type="text" class="input" v-model="item.name">
    </p>

  </div>
</template>

<script>
  import { Compact } from 'vue-color'
  export default {
    components: {
      CompactPicker: Compact
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        colors: {},
        displayPicker: false
      }
    },
    methods: {
      showPicker (item) {
        if (item.color) {
          this.colors = item.color
        }
      }
    }
  }
</script>

<style>
  .current-color {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #000;
    cursor: pointer;
  }
</style>
