<template>
  <div class="field has-addons">
    <p class="control">
      <a class="button is-static">
        <span class="current-color"
              :style="'background-color: ' + newItem.color"
              @click="showPicker(newItem)"
        ></span>

        <!--<compact-picker :value="colors"-->
                        <!--@input="updateFromPicker"-->
                        <!--v-if="picker === 'compact' && displayPicker"></compact-picker>-->
      </a>
    </p>
    <p class="control is-expanded">
      <input type="text" class="input"
             :value="newItem.name"
             @input="updateName"
             >
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
        displayPicker: false,
        newItem: {
          index: 0,
          name: '',
          color: ''
        }
      }
    },
    methods: {
      showPicker (item) {
        if (item.color) {
          this.colors = item.color
        }
      },
      updateName (e) {
        this.$store.dispatch('map/setCategoryName', { index: this.newItem.index, name: e.target.value })
      }
    },
    mounted () {
      this.newItem = this.item
    },
    watch: {
      item (newVal) {
        this.newItem = newVal
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
