<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact v-if="item.availability.includes(userRole)">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click.prevent="signOut()">
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Ausloggen'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon class="hidden-xs-only" @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapState} from 'vuex';

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Projekte",
          availability: [1, 2, 3, 4, 5],
          to: "/"
        },
        {
          icon: "mdi-apps",
          title: "endabnahmeprotokoll",
          availability: [1, 4],
          to: "/standard-checklist"
        },
        {
          icon: "mdi-apps",
          title: "Zusatzfragebogen",
          availability: [1, 4],
          to: "/improvements-checklist"
        },
        {
          icon: "mdi-account",
          availability: [1],
          title: "Nutzer",
          to: "/profile"
        },
        {
          icon: "mdi-account",
          availability: [1],
          title: "Fillial",
          to: "/fillial"
        },
        {
          icon: "mdi-calendar-month",
          availability: [1, 3],
          title: "Kalender",
          to: "/calendar"
        },
        // {
        //   icon: "mdi-warehouse",
        //   title: "Warehouse",
        //   availability: [1],
        //   to: "/warehouse"
        // },
        {
          icon: "mdi-account-group",
          title: "Brigad",
          availability: [1, 3],
          to: "/brigad"
        },
        {
          icon: "mdi-account-cog",
          title: "Profile",
          availability: [1, 2, 3, 4, 5],
          to: "/profile-settings"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ESAD CRM"
    };
  },
  methods: {
    signOut() {
      this.$auth.logout().then(res => {
        this.$router.push({ name: 'login' });
      })
    }
  }
};
</script>
<style>
.fullwidth {
  width: 100%;
}
.v-chip .v-chip__content {
  color: white;
}
a {
  text-decoration: none !important;
}
</style>
