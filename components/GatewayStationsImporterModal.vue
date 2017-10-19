<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{title}}</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">

            <h4 style="text-decoration: underline">Example of desired stations format</h4>
            <p>Please replicate this format in Microsoft Excel then copy the stations to the textbox on the right (no header row)</p>

            <!-- Example table of desired locations format -->
            <table class="table is-bordered">
              <thead>
              <tr>
                <th>Location Name</th>
                <th>Country</th>
                <th>{{coordsText}}</th>
                <th>Antenna (m)</th>
                <th>HPA (Watts)</th>
                <th>Input Feed Loss (dB)</th>
                <th>HPA Output Backoff (dB)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="station in stations">
                <td>{{station.location.name}}</td>
                <td>{{station.location.country}}</td>
                <td>{{station.location | transformCoords(latLonFormat)}}</td>
                <td>{{station.antenna.size}}</td>
                <td>{{station.hpa.size}}</td>
                <td>{{station.ifl}}</td>
                <td>{{station.obo}}</td>
              </tr>
              </tbody>
            </table>


            <article class="message is-warning">
              <div class="message-body">
                <ul>
                  <li>You can just give arbitary location name such as 'Location 1', 'Location 2' but it is really helpful to give a recognizable location name as it will be displayed in the link budget results
                  </li>
                  <li>Antenna text must match the following antenna names in our database</li>
                  <li>BUC size can be number or number with 'w' or 'W'</li>
                </ul>
              </div>
            </article>
          </div>
          <div class="column">

            <!-- Lat,Lon format selector -->
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
            <b-field label="Stations copied from Excel">
              <b-input
                type="textarea"
                v-model="stationsText"
                @input="updateStations"
              ></b-input>
            </b-field>

            <!-- Validation Message Notification Box -->
            <article
              v-if="validationMessages.length > 0"
              class="message is-danger">
              <div class="message-body">
                <ul>
                  <li v-for="message in validationMessages">{{message}}</li>
                </ul>
              </div>
            </article>
          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click.prevent="addStations">Add stations</button>
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
        latLonFormat: 'latLon',
        stations: [
          {
            location: {
              name: 'Bangkok',
              country: 'Thailand',
              lat: 13.826,
              lon: 100.58
            },
            antenna: {
              size: 7.6
            },
            hpa: {
              size: 500
            },
            ifl: 3,
            obo: 4
          },
          {
            location: {
              name: 'Nonthaburi',
              country: 'Thailand',
              lat: 13.861,
              lon: 100.534
            },
            antenna: {
              size: 8.1
            },
            hpa: {
              size: 500
            },
            ifl: 3,
            obo: 4
          }
        ],
        stationsText: '',
        columnHeaders: [
          'locationName', 'country', 'coords', 'antenna', 'hpa', 'ifl', 'obo'
        ],
        validationMessages: []
      }
    },
    computed: {
      coordsText () {
        return this.latLonFormat === 'latLon' ? 'Latitude,Longitude' : 'Longitude,Latitude'
      }
    },
    methods: {
      addStations () {
        this.$emit('stationsAdded', { stations: this.stations })
        this.$parent.close() // close the modal
      },
      updateStations () {
        if (this.stationsText) {
          this.validationMessages = []
          let stations = []
          let transformedStationObjects = this.$_transformExcelTableToObjects(this.stationsText, this.columnHeaders)
          // Transform into proper stations object format
          if (transformedStationObjects) {
            transformedStationObjects.forEach(station => {
              // Validate the coordinates
              let extractedCoords = this.$_extractCoordinateText(station.coords, this.latLonFormat === 'latLon')
              if (!extractedCoords) {
                this.validationMessages.push(`${station.coords} is not a valid ${this.latLonFormat} coordinates`)
              }
              // TODO: Validate the country
              // Validate the antenna
              let antenna = this.$_transformGatewayAntennaText(station.antenna)
              if (!antenna) {
                this.validationMessages.push(`${station.antenna} is not a valid gateway antenna format`)
              }
              // Validate the HPA
              let hpa = this.$_transformHpaText(station.hpa)
              if (!hpa) {
                this.validationMessages.push(`${station.hpa} is not a valid HPA format`)
              }
              // Validate the OBO
              let obo = this.$_transformOboText(station.obo)
              if (!obo) {
                this.validationMessages.push(`${station.obo} is not a valid OBO format`)
              }
              // Validate the IFL
              let ifl = this.$_transformIflText(station.ifl)
              if (!ifl) {
                this.validationMessages.push(`${station.ifl} is not a valid ifl format`)
              }
              // If there is no validation messages (all data is valid), generate the location object
              if (this.validationMessages.length === 0) {
                stations.push({
                  location: {
                    name: station.locationName,
                    country: station.country,
                    lat: +extractedCoords.lat,
                    lon: +extractedCoords.lon
                  },
                  antenna,
                  hpa,
                  obo,
                  ifl
                })
              } else {
                this.openValidationMessageToast()
              }
            })
            this.stations = stations
          } else {
            this.validationMessages.push('The copied table is in incorrect format')
            this.openValidationMessageToast()
            this.stations = []
          }
        }
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

