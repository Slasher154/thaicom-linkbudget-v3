<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{title}}</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column is-8">

            <h4 style="text-decoration: underline">Example of desired contours from Excel format</h4>
            <p>Please replicate this format in Microsoft Excel then copy the rows to the textbox on the right (no header row)</p>
            <!-- Example table of desired locations format -->
            <br>
            <table
              v-if="isBroadband"
              class="table is-bordered">
              <thead>
              <tr>
                <th>Beam Name</th>
                <th>Path</th>
                <th>Relative Contour (dB)</th>
                <th>Category Name</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="contour in broadbandContours">
                <td>{{contour.name}}</td>
                <td>{{contour.path}}</td>
                <td>{{contour.contourValue}}</td>
                <td>{{contour.category}}</td>
              </tr>
              </tbody>
            </table>
            <article class="message is-warning">
              <div class="message-body">
                <ul>
                  <li
                    v-for="(remark,index) in remarks"
                    :key="index"
                  >
                    * {{remark}}
                  </li>
                </ul>
              </div>
            </article>
            <br>


          </div>
          <div class="column is-4">

            <!-- Textarea to receive user input -->
            <b-field label="Stations copied from Excel">
              <b-input
                type="textarea"
                v-model="contoursText"
                @input="updateContours"
              ></b-input>
            </b-field>

            <!-- Validation Message Notification Box -->
            <article
              v-if="validationMessages.length > 0"
              class="message is-danger">
              <div class="message-body">
                <ol>
                  <li v-for="message in validationMessages">{{message}}</li>
                </ol>
              </div>
            </article>
          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click.prevent="addContours">Add contours to map</button>
        <button class="button" type="button" @click="$parent.close()">Close</button>

      </footer>
    </div>
  </form>
</template>

<script>
  import NoSSR from 'vue-no-ssr'
  /* eslint-disable no-unused-vars */

  export default {
    components: {
      'no-ssr': NoSSR
    },
    props: {
      title: {
        type: String,
        default: 'Import your coordinates'
      },
      isBroadband: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        contoursText: '',
        broadbandContours: [
          {
            name: '207',
            path: 'forward',
            contourValue: -7,
            category: '0 dB Link Margin'
          },
          {
            name: '207',
            path: 'forward',
            contourValue: -4.7,
            category: '2 dB Link Margin'
          }
        ],
        validationMessages: [],
        contours: []
      }
    },
    computed: {
      remarks () {
        if (this.isBroadband) {
          let broadbandRemarks = []
          broadbandRemarks.push(`Relative contour must be negative number only`)
          broadbandRemarks.push(`Allowed text for path: 'forward', 'return'`)
          broadbandRemarks.push(`Category is a text that will be shown as map legends`)
          return broadbandRemarks
        } else {
          return []
        }
      },
      columnHeaders () {
        if (this.isBroadband) {
          return ['name', 'path', 'contourValue', 'category']
        } else {
          return []
        }
      }
    },
    methods: {
      addContours () {
        this.$emit('contoursAdded', {contours: this.contours})
        this.$parent.close() // close the modal
      },
      updateContours () {
        if (this.contoursText) {
          this.validationMessages = []
          let contours = []
          let transformedContourObjects = this.$_transformExcelTableToObjects(this.contoursText, this.columnHeaders)
          // Transform into proper stations object format
          if (transformedContourObjects) {
            transformedContourObjects.forEach(contour => {
              // Validate the path
              let pathText = contour.path.toLowerCase()
              if (!['forward', 'return'].includes(pathText)) {
                this.validationMessages.push(`${contour.path} is not a valid value for path. Only 'forward' or 'return' is allowed`)
              } else {
                contour.path = pathText
              }
              // Validate the contour value
              let contourValue = this.$_round(+contour.contourValue, 1)
              if (contourValue > 0) {
                this.validationMessages.push(`${contour.contourValue} is not a valid contour value`)
              } else {
                contour.contourValue = contourValue
              }
              // If there is no validation messages (all data is valid), generate the location object
              if (this.validationMessages.length === 0) {
                contours.push(contour)
              } else {
                this.$_alertError(this.validationMessages.join(','))
              }
            })
          } else {
            this.$_alertError(`This copied table is in incorrect format`)
          }
          this.contours = contours
        }
      }
    }
  }
</script>

<style scoped>
  .modal-card {
    width: auto;
  }
</style>


