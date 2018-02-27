/* eslint-disable no-undef */
/**
 * Created by thanatv on 9/28/17.
 */

import Vue from 'vue'
import _ from 'lodash'

Vue.mixin({
  methods: {
    $_convertOrbitalSlotToLetter (slot) {
      if (!(_.isNumber(slot)) || slot > 180 || slot < -180) {
        return 'Invalid Orbital Slot'
      } else if (slot >= 0) {
        return `${slot} E`
      } else {
        return `${slot} W`
      }
    },
    // Transform the transponder array into a group to show with Vue Multiselect
    $_transformTransponderOptions (transponderOptions) {
      // Separate the HTS satellite and conventional first (use different criteria to group)
      // Only HTS transponders have 'country' field and also filter for only 'forward' and 'broadcast' beams
      let htsTransponders = _.sortBy(_.filter(transponderOptions, x => _.includes(_.keys(x), 'country') && _.includes(['forward', 'broadcast'], x.type)), 'name')
      let conventionalTransponders = _.reject(transponderOptions, x => _.includes(_.keys(x), 'country'))

      // Group HTS transponders by country
      let groupedHtsTransponders = _.groupBy(htsTransponders, x => `${x.country} (${x.satellite})`)
      let groupedConventionalTransponders = _.groupBy(conventionalTransponders, x => `${x.uplink_beam} (${x.satellite})`)

      // Transform to grouped objects suitable for Vue Multiselect >> https://monterail.github.io/vue-multiselect/#sub-option-groups
      let transformedHtsTransponders = []
      _.keys(groupedHtsTransponders).forEach(key => {
        transformedHtsTransponders.push({
          category: key,
          transponders: groupedHtsTransponders[key]
        })
      })
      let transformedConventionalTransponders = []
      _.keys(groupedConventionalTransponders).forEach(key => {
        transformedConventionalTransponders.push({
          category: key,
          transponders: groupedConventionalTransponders[key]
        })
      })
      // Concatenate both array and return
      let concatenatedTransponders = _.concat(_.sortBy(transformedHtsTransponders, 'category'), _.sortBy(transformedConventionalTransponders, 'category'))
      return concatenatedTransponders
    },
    $_transformModemOptions (modemOptions) {
      // Group modem by vendor
      let groupedModems = _.groupBy(modemOptions, x => x.vendor)

      // Transform to grouped objects suitable for Vue Multiselect
      let transformedModems = []
      _.keys(groupedModems).forEach(key => {
        transformedModems.push({
          category: key,
          modems: groupedModems[key]
        })
      })
      return transformedModems
    },
    $_transformExcelTableToObjects (stringData, columnHeaders) {
      // Source: https://stackoverflow.com/questions/2006468/copy-paste-from-excel-to-a-web-page
      // StringData is data copied from Excel, columnHeaders are fields
      let objects = []
      // split into rows
      let rows = stringData.split('\n')

      // Note how we start at rowNr = 1, because 0 is the column row
      for (let rowNr = 0; rowNr < rows.length; rowNr++) {
        let o = {}
        let data = rows[rowNr].split('\t')

        // Check if number of columns is equal to column headers, if not, return null
        if (data.length !== columnHeaders.length) {
          objects = null
          break
        }

        // Loop through all the data
        for (let cellNr = 0; cellNr < data.length; cellNr++) {
          o[columnHeaders[cellNr]] = data[cellNr]
        }

        objects.push(o)
      }
      return objects
    },
    $_extractCoordinateText (coordsText, latlonMode) {
      // Regex source: https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
      let latlonRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      let lonlatRegex = /^\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/
      let coordsObj = {}
      if (latlonMode && latlonRegex.test(coordsText)) {
        coordsObj = {
          lat: +coordsText.split(',')[0],
          lon: +coordsText.split(',')[1]
        }
      } else if (!latlonMode && lonlatRegex.test(coordsText)) {
        coordsObj = {
          lon: +coordsText.split(',')[0],
          lat: +coordsText.split(',')[1]
        }
      } else {
        return false
      }
      return coordsObj
    },
    $_validateBandwidthText (bandwidthText) {
      let bandwidthRegex = /^\d{1,5}\/\d{1,5}$/
      return bandwidthRegex.test(bandwidthText)
    },
    $_transformBandwidthTextToObject (bandwidthText, unit) {
      if (this.$_validateBandwidthText(bandwidthText)) {
        let splitBandwidthText = bandwidthText.split('/')
        return {
          forward: +splitBandwidthText[0],
          return: +splitBandwidthText[1],
          unit
        }
      }
      return false
    },
    $_findAntennaObjectFromText (antennaText, antennaOptions) {
      return antennaOptions.find(antenna => {
        return antenna.name.split(' ').join('') === antennaText.split(' ').join('') || antenna.size === +antennaText
      })
    },
    $_findBucObjectFromText (bucText, bucOptions) {
      return bucOptions.find(buc => {
        return buc.name === bucText.toUpperCase() || buc.size === +bucText
      })
    },
    $_validateGatewayAntennaText (antennaText) {
      return !isNaN(antennaText) && +antennaText > 0
    },
    $_transformGatewayAntennaText (antennaText) {
      if (this.$_validateGatewayAntennaText(antennaText)) {
        return {
          name: `${antennaText} m`,
          size: +antennaText
        }
      }
      return false
    },
    $_validateHpaText (hpaText) {
      return !isNaN(hpaText) && +hpaText > 0
    },
    $_transformHpaText (hpaText) {
      if (this.$_validateHpaText(hpaText)) {
        return {
          name: `${hpaText}W`,
          size: +hpaText
        }
      }
      return false
    },
    $_validateOboText (oboText) {
      return !isNaN(oboText) && +oboText >= 0
    },
    $_transformOboText (oboText) {
      if (this.$_validateHpaText(oboText)) {
        return +oboText
      }
      return false
    },
    $_validateIflText (iflText) {
      return !isNaN(iflText) && +iflText >= 0
    },
    $_transformIflText (iflText) {
      if (this.$_validateHpaText(iflText)) {
        return +iflText
      }
      return false
    },
    $_convertMillisecondsToText (timeInMilliseconds) {
      console.log(timeInMilliseconds)
      return this.$moment(parseInt(timeInMilliseconds)).format('dddd, MMMM Do YYYY, kk:mm')
    },
    $_definedContourText (name) {
      if (name === '50') {
        return '50%'
      } else if (name === 'eoc') {
        return 'EOC'
      } else if (name === 'eoc-2') {
        return 'EOC-2'
      } else if (name === 'peak') {
        return 'Peak'
      } else {
        return ''
      }
    },
    $_alertError (message) {
      this.$dialog.alert({
        title: 'Error',
        message,
        type: 'is-danger',
        hasIcon: true,
        icon: 'times-circle',
        iconPack: 'fa'
      })
    },
    $_expandMap (map) {
      // Obtain the map bounds
      let bounds = new google.maps.LatLngBounds()
      // Expand to all forward contours
      this.$store.state.map.forwardContours.forEach(contour => {
        contour.paths.forEach(contourPath => {
          contourPath.forEach(point => {
            bounds.extend(point)
          })
        })
      })
      // Expand to all return contours
      this.$store.state.map.returnContours.forEach(contour => {
        contour.path.forEach(point => {
          bounds.extend(point)
        })
      })
      // Expand to all place markers
      this.$store.state.map.places.forEach(place => {
        bounds.extend(place.position)
      })
      map.fitBounds(bounds)
      map.resizePreserveCenter()
    },
    $_round (value, precision) {
      let multiplier = Math.pow(10, precision || 0)
      return Math.round(value * multiplier) / multiplier
    },
    $_pathText (path) {
      if (path === 'forward') {
        return 'FWD'
      } else if (path === 'return') {
        return 'RTN'
      } else {
        return ''
      }
    }
  }
})
