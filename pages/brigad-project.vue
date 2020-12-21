<template>
  <v-layout column justify-center align-center>
    <v-flex xs6 class="fullwidth">
      <v-row>
        <v-col>
          <h1>Order #{{project.number}}</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">
          <v-chip class="ma-2" color="secondary">{{project.date}}</v-chip>
          <v-chip class="ma-2" :color="getColor(project.status)">{{project.status}}</v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs9>
          <v-text-field label="Client Name" v-model="project.number" disabled></v-text-field>
          <v-text-field label="Client Address" v-model="project.address" disabled></v-text-field>
          <v-text-field label="Notes" v-model="project.note" disabled></v-text-field>
          <v-btn color="primary" to="/brigad-form">Complete (confirm)</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-card class="mx-auto" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">2020327.pdf</v-list-item-title>
                <v-list-item-subtitle>Installation instructions</v-list-item-subtitle>
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
        date: "02.04.2020 11:30",
        status: "Installation",
        clientId: "3231",
        address: "518-320 Lenina St.",
        name: "Ivan Alex",
        brigad: "brigad 1",
        note: "Leave the dog inside"
      },
      brigads: ["brigad 1", "brigad 2", "brigad 3"]
    };
  },
  methods: {
    getColor(status) {
      if (status == "Installation") {
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
