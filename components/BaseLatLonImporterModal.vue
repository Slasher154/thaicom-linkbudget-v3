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
                <tr v-for="location in sampleLocations">
                  <td>{{location.name}}</td>
                  <td>{{location.country}}</td>
                  <td>{{location.coords | transformCoords(latLonFormat)}}</td>
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
            <!--<b-field :label="coordsText">-->
              <!--<b-input type="textarea" size="is-large"></b-input>-->
            <!--</b-field>-->
            <no-ssr placeholder="loading...">
                <hot-table ref="coordsTable" :root="root" :settings="hotSettings"></hot-table>
            </no-ssr>

          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary">Add locations</button>
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-success" type="button" @click="printData">Print</button>

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
        sampleLocations: [
          {
            name: 'Bangkok',
            country: 'Thailand',
            coords: {
              lat: 13.826,
              lng: 100.58
            }
          },
          {
            name: 'Nonthaburi',
            country: 'Thailand',
            coords: {
              lat: 13.861,
              lng: 100.534
            }
          }
        ]
      }
    },
    computed: {
      coordsText () {
        return this.latLonFormat === 'latLon' ? 'Latitude,Longitude' : 'Longitude,Latitude'
      }
    },
    methods: {
      printData () {
        console.log(JSON.stringify(this.$refs.coordsTable.getData(), undefined, 2))
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

