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
                <td>{{station.locationName}}</td>
                <td>{{station.country}}</td>
                <td>{{station.coords | transformCoords(latLonFormat)}}</td>
                <td>{{station.antenna}}</td>
                <td>{{station.buc}}</td>
                <td>{{station.bandwidth}}</td>
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
            <b-field :label="coordsText">
              <b-input
                type="textarea"
                v-model="stationsText"
                size="is-large"
                @input="updateStations"
              ></b-input>
            </b-field>
            <!--<no-ssr placeholder="loading...">-->
              <!--<hot-table ref="coordsTable" :root="root" :settings="hotSettings"></hot-table>-->
            <!--</no-ssr>-->


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
        root: 'test-hot',
        hotSettings: {
          data: [['a', 'ab'], ['cd', 'eg']],
          colHeaders: true
        },
        latLonFormat: 'latLon',
        stations: [
          {
            locationName: 'Bangkok',
            country: 'Thailand',
            coords: {
              lat: 13.826,
              lng: 100.58
            },
            antenna: 1.2,
            buc: 2,
            bandwidth: '4/2'
          },
          {
            locationName: 'Nonthaburi',
            country: 'Thailand',
            coords: {
              lat: 13.861,
              lng: 100.534
            },
            antenna: 1.8,
            buc: 2,
            bandwidth: '6/4'
          }
        ],
        stationsText: '',
        columnHeaders: [
          'locationName', 'country', 'coords', 'antenna', 'buc', 'bandwidth'
        ]
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
          let validationPassed = true
          let stations = this.$_transformExcelTableToObjects(this.stationsText, this.columnHeaders)
          // Transform coords text into object
          if (stations) {
            stations.forEach(station => {
              let extractedCoords = this.$_extractCoordinateText(station.coords, this.latLonFormat === 'latLon')
              if (!extractedCoords && !validationPassed) { // Check validation passed to trigger the toast only 1 time
                this.$toast.open(`${station.coords} is not a valid ${this.latLonFormat} coordinates`)
                validationPassed = false
              } else {
                station.coords = extractedCoords
              }
            })
            if (!validationPassed) {
              this.stationsText = ''
              this.stations = []
            } else {
              this.stations = stations
            }
          } else {
            this.$toast.open('The copied table is in incorrect format')
          }
        }
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

