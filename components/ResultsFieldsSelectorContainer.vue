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
    </div>
    <div class="column is-9">
      <!-- Draggable list -->
      <b-field label="Selected fields (drag to sort table columns)">
        <div class="control">
          <b-taglist>
            <draggable v-model="fields" @start="drag=true" @end="drag=false">
              <b-tag
                v-for="element in fields"
                v-if="element.visible"
                type="is-info" closable
                @close="hideField(element)"
              >{{element.name}}
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
        refreshCounter: 1
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
      }
    }
  }
</script>
