<template>
  <v-layout column justify-center align-center>
    <v-flex xs6 class="fullwidth">
      <h1>Survey for order #202-03-27 completion</h1>
      <v-row>
        <v-col>
          <h1>Auftrag #{{project.number}}</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">
          <v-chip class="ma-2" color="secondary">{{project.date}}</v-chip>
          <v-chip class="ma-2" :color="getColor(project.status)">{{project.status}}</v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs9>
          <v-text-field label="Client ID" v-model="project.number" disabled></v-text-field>
          <v-file-input show-size counter multiple chips label="Upload files"></v-file-input>
          <v-btn color="primary">Shipped (confirm)</v-btn>
          <v-btn :color="'orange'">Revert Changes</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-card class="mx-auto" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">2020327.pdf</v-list-item-title>
                <v-list-item-subtitle>List of items to be shipped</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey">
                <img
                  src="https://lh3.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w"
                  alt
                />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-btn text>Download</v-btn>
            </v-card-actions>
          </v-card>
          <v-card class="mx-auto mt-5" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">2020327.pdf</v-list-item-title>
                <v-list-item-subtitle>Document attached by warehouse</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey">
                <img
                  src="https://lh3.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w"
                  alt
                />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-btn text>löschen</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      project: {
        number: "202-03-27",
        date: "02.04.2020",
        status: "Neu",
        clientId: "3231",
        address: "518-320 Lenina St.",
        name: "Ivan Alex",
        brigad: "brigad 1",
        note: ""
      },
      brigads: ["brigad 1", "brigad 2", "brigad 3"]
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

<style>
</style>
