<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 class="fullwidth">
      <v-card class="my-5 elevation-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Projekt Nummer</v-list-item-title>
          </v-list-item-content>
          <v-chip class="ma-2" color="secondary">Status</v-chip>
          <v-chip class="ma-2" color="secondary">Datum</v-chip>
        </v-list-item>
      </v-card>
      <v-list>
        <v-card
          class="my-5 elevation-4"
          v-for="project in projects"
          :key="project.number"
          :disabled="project.status != 'New'"
        >
          <v-list-item to="/project-warhouse">
            <v-list-item-content>
              <v-list-item-title>#{{project.number}}</v-list-item-title>
            </v-list-item-content>

            <v-chip class="ma-2" :color="getColor(project.status)">{{project.status}}</v-chip>
            <v-chip class="ma-2" color="secondary">{{project.date}}</v-chip>
          </v-list-item>
        </v-card>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      projects: [
        {
          number: "202-03-27",
          date: "02.04.2020",
          status: "New"
        },
        {
          number: "202-03-28",
          date: "03.04.2020",
          status: "New"
        },
        {
          number: "202-03-29",
          date: "03.04.2020",
          status: "Shipped"
        }
      ]
    };
  },
  methods: {
    getColor(status) {
      if (status == "Working") {
        return "primary";
      } else if (status == "Errors") {
        return "red";
      } else if (status == "New") {
        return "orange";
      } else {
        return "default";
      }
    }
  }
};
</script>
