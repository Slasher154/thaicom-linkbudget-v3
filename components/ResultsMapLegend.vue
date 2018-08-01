<template>
  <div>
    <div class="field has-addons">
      <p class="control"
         @click="showPicker"
      >
        <a class="button is-static"
        >
        <span class="current-color"
              :style="'background-color: ' + newItem.color"
        ></span>
        </a>
      </p>
      <p class="control is-expanded">
        <input type="text" class="input"
               v-model="newItem.name"
               @input="updateName"
        >
      </p>
      <p class="control">
        <a class="button is-danger"
           @click="removeLegend"
        >
          <b-icon pack="fa" icon="close"></b-icon>
        </a>
      </p>
    </div>
    <compact-picker
      :value="newItem.color"
      @input="updateColor"
      v-if="displayPicker"
    >
    </compact-picker>
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
        colors: { r: 25, g: 77, b: 51, a: 1 },
        displayPicker: false,
        newItem: {
          index: 0,
          name: '',
          color: ''
        }
      }
    },
    methods: {
      showPicker () {
        console.log('color picked')
        this.displayPicker = true
      },
      removeLegend () {
        this.$store.dispatch('map/removeCategory', this.newItem)
      },
      updateName () {
        this.$store.dispatch('map/setCategoryName', this.newItem)
      },
      updateColor (color) {
        console.log('New color is ' + color.hex)
        this.newItem.color = color.hex
        this.displayPicker = false
        this.$store.dispatch('map/setCategoryColor', this.newItem)
      }
    },
    mounted () {
      this.newItem = Object.assign({}, this.item)
    },
    watch: {
      item (newVal) {
        this.newItem = Object.assign({}, newVal)
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
