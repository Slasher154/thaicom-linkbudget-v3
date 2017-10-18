<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{title}}</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">

            <h4 style="text-decoration: underline">Example of desired location format</h4>
            <p>Please replicate this format in Microsoft Excel then copy the location rows to the textbox on the right (no header row)</p>

            <!-- Example table of desired locations format -->
            <table class="table is-bordered">
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th>Country</th>
                  <th>{{coordsText}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="location in locations">
                  <td>{{location.name}}</td>
                  <td>{{location.country}}</td>
                  <td>{{location | transformCoords(latLonFormat)}}</td>
                </tr>
              </tbody>
            </table>

            <article class="message is-warning">
              <div class="message-body">
                You can just give arbitary location name such as 'Location 1', 'Location 2' but it is really helpful to give a recognizable location name as it will be displayed in the link budget results
              </div>
            </article>
          </div>
          <div class="column">
            <div class="block">
              <b-radio
                v-model="latLonFormat"
                native-value="latLon">
                Lat,Lon
              </b-radio>
              <b-radio
                v-model="latLonFormat"
                native-value="lonLat">
                Lon,Lat
              </b-radio>
            </div>

            <!-- Textarea to receive user input -->
            <b-field label="Locations copied from Excel">
              <b-input
                type="textarea"
                v-model="locationsText"
                @input="updateLocations"
              ></b-input>
            </b-field>

          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click.prevent="addLocations">Add locations</button>
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
    data () {
      return {
        root: 'test-hot',
        hotSettings: {
          data: [['a', 'ab'], ['cd', 'eg']],
          colHeaders: true
        },
        locationsText: '',
        latLonFormat: 'latLon',
        locations: [
          {
            name: 'Bangkok',
            country: 'Thailand',
            lat: 13.826,
            lon: 100.86
          },
          {
            name: 'Nonthaburi',
            country: 'Thailand',
            lat: 13.598,
            lon: 100.543
          }
        ],
        columnHeaders: ['locationName', 'country', 'coords'],
        validationMessages: []
      }
    },
    computed: {
      coordsText () {
        return this.latLonFormat === 'latLon' ? 'Latitude,Longitude' : 'Longitude,Latitude'
      }
    },
    methods: {
      updateLocations () {
        if (this.locationsText) {
          let locations = []
          let transformedLocationObjects = this.$_transformExcelTableToObjects(this.locationsText, this.columnHeaders)
          // Transform into proper stations object format
          if (transformedLocationObjects) {
            transformedLocationObjects.forEach(location => {
              // Validate the coordinates
              let extractedCoords = this.$_extractCoordinateText(location.coords, this.latLonFormat === 'latLon')
              if (!extractedCoords) {
                this.validationMessages.push(`${location.coords} is not a valid ${this.latLonFormat} coordinates`)
              }
              // If there is no validation messages (all data is valid), generate the location object
              if (this.validationMessages.length === 0) {
                locations.push({
                  name: location.locationName,
                  country: location.country,
                  lat: extractedCoords.lat,
                  lon: extractedCoords.lon
                })
              } else {
                this.openValidationMessageToast()
              }
            })
            this.locations = locations
          } else {
            this.validationMessages.push('The copied table is in incorrect format')
            this.openValidationMessageToast()
            this.locations = []
          }
        }
      },
      addLocations () {
        this.$emit('locationsAdded', { locations: this.locations })
        this.$parent.close() // close the modal
      },
      openValidationMessageToast () {
        this.$toast.open(this.validationMessages.join(','))
      }
    },
    props: {
      title: {
        type: String,
        default: 'Import your coordinates'
      }
    }
  }
</script>

<style scoped>
  .modal-card {
    width: auto;
  }
</style>

