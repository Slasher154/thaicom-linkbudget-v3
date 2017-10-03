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
    }
  }
})
