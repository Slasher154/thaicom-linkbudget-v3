<template>
  <div class="container">

    <!--Start Navbar-->
    <!--<nav class="navbar is-primary">-->

    <!--&lt;!&ndash; Logo &ndash;&gt;-->
    <!--<div class="navbar-brand">-->

    <!--</div>-->

    <!--&lt;!&ndash; Start navbar menu &ndash;&gt;-->
    <!--<div class="navbar-menu">-->

    <!--&lt;!&ndash; Left part of navbar menu &ndash;&gt;-->
    <!--<div class="navbar-start">-->

    <!--&lt;!&ndash;Navigation to home&ndash;&gt;-->
    <!--&lt;!&ndash;<nuxt-link&ndash;&gt;-->
    <!--&lt;!&ndash;to="/"&ndash;&gt;-->
    <!--&lt;!&ndash;class="nav-item"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;Home</nuxt-link>&ndash;&gt;-->
    <!--<a-->
    <!--href="/"-->
    <!--class="nav-item"-->
    <!--&gt;Home</a>-->

    <!--</div>-->

    <!--&lt;!&ndash;Right part of navbar menu&ndash;&gt;-->
    <!--<div class="navbar-end">-->

    <!--</div>-->

    <!--</div>-->
    <!--&lt;!&ndash; End navbar menu &ndash;&gt;-->
    <nav class="navbar is-transparent">

      <!--Start Navbar brand-->
      <div class="navbar-brand">

        <!--Logo-->
        <nuxt-link class="navbar-item" :to="{ path: '/'}">
          <img src="~/assets/images/thaicom-logo-640-160.png" alt="Thaicom Link Budget v3"
               width="112" height="28">
        </nuxt-link>

        <div class="navbar-burger burger" data-target="navMenuTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <!--End Navbar brand-->

      <!--Start Navbar menu-->
      <div id="navMenuTransparentExample" class="navbar-menu">

        <!--Start Navbar left menu-->
        <div class="navbar-start">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Database
            </a>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item" :to="{ name: 'antennas'}">Antennas</nuxt-link>
              <nuxt-link class="navbar-item" :to="{ name: 'antennas-patterns'}">Antenna Patterns</nuxt-link>
              <nuxt-link class="navbar-item" :to="{ name: 'bucs'}">Bucs</nuxt-link>
              <nuxt-link class="navbar-item" :to="{ name: 'constants'}">Constants</nuxt-link>
              <nuxt-link class="navbar-item" :to="{ name: 'gateways'}">Gateways</nuxt-link>
              <nuxt-link class="navbar-item" :to="{ name: 'modems'}">Modems</nuxt-link>
              <nuxt-link class="navbar-item" :to="{ name: 'transponders'}">Transponders</nuxt-link>


            </div>


          </div>

          <div class="navbar-item">
            <nuxt-link :to="{ name: 'saved-requests'}">My Requests</nuxt-link>
          </div>
          <div class="navbar-item">
            <nuxt-link :to="{ name: 'maps'}">Maps</nuxt-link>
          </div>

        </div>
        <!--End Navbar left menu-->

        <!--Start Navbar right menu-->
        <div class="navbar-end">

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              {{username}}
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                Profile
              </a>
              <a class="navbar-item">
                Menu 2
              </a>
              <a class="navbar-item">
                Menu 3
              </a>
              <hr class="navbar-divider">
              <div class="navbar-item">
                Menu 4
              </div>
            </div>
          </div>


          <div class="navbar-item">

              <p class="control">
                <nuxt-link tag="button" class="button is-primary" :to="{ path: 'auth/logout', query: { 'redirect-url': '/logout' }}">Logout</nuxt-link>
              </p>
            </div>
          </div>
        <!--End Navbar right menu-->
      </div>
      <!-- End Navbar menu -->

    </nav>


  </div>

</template>

<script>
  import _ from 'lodash'
  export default {
    computed: {
      username () {
        let user = this.$store.state.oauth.user
        if (user) {
          return this.toTitleCase(`${user.name} ${user.family_name} `)
        }
        return ''
      }
    },
    methods: {
      toTitleCase (str) {
        return _.startCase(_.toLower(str))
      }
    }
  }
</script>
