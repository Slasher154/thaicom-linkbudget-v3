<template>
  <!-- Field Selector -->
  <div class="columns">
    <div class="column is-3">
      <b-field label="(+) Add Fields">
        <b-field grouped>
          <result-fields-selector
            :fieldOptions="tableFields"
            :refreshCounter="refreshCounter"
            @selected-fields-changed="saveFields"
          />
          <p class="control" expanded>
            <button class="button is-success"
                    @click.prevent="addFields">
              +
            </button>
          </p>
        </b-field>
      </b-field>
      <b-field>
        <p class="control">
          <button
            class="button is-warning"
            @click="copyToClipboard"
          >Copy Table to Clipboard</button>
        </p>
      </b-field>
      <b-field>
        <!-- Hidden text input for CSV that will be copied to clipboard -->
        <input type="text" v-model="hiddenCsv" hidden>
      </b-field>
    </div>
    <div class="column is-9">
      <!-- Draggable list -->
      <b-field label="Selected fields (drag to sort table columns)">
        <div class="control">
          <b-taglist>
            <draggable v-model="fields" @start="drag=true" @end="drag=false">
              <b-tag
                v-for="(element,index) in fields"
                v-if="element.visible"
                type="is-info" closable
                :key="index"
                @close="hideField(element)"
              >{{element.title}}
              </b-tag>
            </draggable>
          </b-taglist>
        </div>
      </b-field>
    </div>
  </div>
</template>

<script>
  import ResultFieldsSelector from './ResultsFieldsSelector'
  import draggable from 'vuedraggable'
  export default {
    components: {
      ResultFieldsSelector,
      draggable
    },
    props: {
      path: {
        type: String,
        default: 'forward'
      }
    },
    data () {
      return {
        fieldsToAdd: [],
        refreshCounter: 1,
        hiddenCsv: 'Text to copy'
      }
    },
    computed: {
      fields: {
        get () {
          return this.$store.state.linkcalc[this.path + 'TableFields']
        },
        set (val) {
          this.$store.dispatch('linkcalc/setTableFields', { path: this.path, list: val })
        }
      },
      tableFields () {
        return this.$store.state.linkcalc[this.path + 'TableFields']
      }
    },
    methods: {
      addFields () {
        this.$store.dispatch('linkcalc/addFields', { path: this.path, fields: this.fieldsToAdd })
        // Clear the list
        this.refreshCounter++
      },
      hideField (element) {
        this.$store.dispatch('linkcalc/hideField', { path: this.path, element })
      },
      saveFields ({ fields }) {
        console.log(fields)
        this.fieldsToAdd = fields
      },
      copyToClipboard () {
        this.$store.dispatch('linkcalc/generateResultTableCsv', { path: this.path })
        this.$copyText(this.$store.state.linkcalc.resultTableCsv).then(e => {
          this.$toast.open('Table is now copied to the clipboard')
        }).catch(e => {
          this.$toast.open('Table cannot be copied')
        })
      }
    }
  }
</script>
