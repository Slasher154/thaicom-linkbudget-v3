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
          lat: coordsText.split(',')[0],
          lng: coordsText.split(',')[1]
        }
      } else if (!latlonMode && lonlatRegex.test(coordsText)) {
        coordsObj = {
          lng: coordsText.split(',')[0],
          lat: coordsText.split(',')[1]
        }
      } else {
        return false
      }
      return coordsObj
    }
  }
})
