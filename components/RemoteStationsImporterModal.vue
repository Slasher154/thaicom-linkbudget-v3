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
            <p>Please replicate this format in Microsoft Excel then copy the location rows to the textbox on the right (no header row)</p>

            <!-- Example table of desired locations format -->
            <table class="table is-bordered">
              <thead>
              <tr>
                <th>Location Name</th>
                <th>Country</th>
                <th>{{coordsText}}</th>
                <th>Antenna</th>
                <th>BUC</th>
                <th>Bandwidth</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="station in stations">
                <td>{{station.location.name}}</td>
                <td>{{station.location.country}}</td>
                <td>{{station.location | transformCoords(latLonFormat)}}</td>
                <td>{{station.antenna.name}}</td>
                <td>{{station.buc.name}}</td>
                <td>{{station.bandwidth | transformToBandwidthText }}</td>
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
                  <li>Bandwidth text must match the format '4/2'</li>
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

            <!-- Bandwidth Unit Selector -->
            <b-field label="Bandwidth Unit">
              <b-select placeholder="Unit" v-model="unit">
                <option value="kbps">kbps</option>
                <option value="Mbps">Mbps</option>
                <option value="kHz">kHz</option>
                <option value="MHz">MHz</option>
                <option value="ksps">ksps</option>
                <option value="Msps">Msps</option>
              </b-select>
            </b-field>

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
  import _ from 'lodash'
  /* eslint-disable no-unused-vars */

  export default {
    components: {
      'no-ssr': NoSSR
    },
    data () {
      return {
        latLonFormat: 'latLon',
        unit: 'Mbps',
        stations: [
          {
            location: {
              name: 'Bangkok',
              country: 'Thailand',
              lat: 13.826,
              lon: 100.58
            },
            antenna: {
              name: '1.2m'
            },
            buc: {
              name: '2W'
            },
            bandwidth: {
              forward: 4,
              return: 2,
              unit: ''
            }
          },
          {
            location: {
              name: 'Nonthaburi',
              country: 'Thailand',
              lat: 13.861,
              lon: 100.534
            },
            antenna: {
              name: '2.4m'
            },
            buc: {
              name: '4W'
            },
            bandwidth: {
              forward: 6,
              return: 4,
              unit: ''
            }
          }
        ],
        stationsText: '',
        columnHeaders: [
          'locationName', 'country', 'coords', 'antenna', 'buc', 'bandwidth'
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
              // Validate the bandwidth
              let bandwidth = this.$_transformBandwidthTextToObject(station.bandwidth, this.unit)
              if (!bandwidth) {
                this.validationMessages.push(`${station.bandwidth} is not a valid bandwidth format`)
              }
              // TODO: Validate the country
              // Validate the antenna
              let antenna = this.$_findAntennaObjectFromText(station.antenna, this.$store.state.linkcalc.remoteAntennaOptions)
              if (!antenna) {
                this.validationMessages.push(`${station.antenna} does not match any antenna in our database`)
              }
              // Validate the BUC
              let buc = this.$_findBucObjectFromText(station.buc, this.$store.state.linkcalc.remoteBucOptions)
              if (!buc) {
                this.validationMessages.push(`${station.buc} does not match any BUC in our database`)
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
                  buc,
                  bandwidth
                })
              }
            })
            this.openValidationMessageToast()
            this.stations = stations
          } else {
            this.validationMessages.push('The copied table is in incorrect format')
            this.openValidationMessageToast()
            this.stations = []
          }
        }
      },
      openValidationMessageToast () {
        this.validationMessages = _.uniq(this.validationMessages)
        // this.$toast.open(this.validationMessages.join(','))
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

