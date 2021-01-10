<template>
<v-layout column justify-center align-center>
    <v-flex xs12 class="fullwidth">
      <v-card class="my-5 elevation-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Team</v-list-item-title>
          </v-list-item-content>
          <v-btn color="primary" to="/brigad/add">
            Team hinzufügen
          </v-btn>
        </v-list-item>
      </v-card>
      <v-list>
        <v-card
          class="my-5 elevation-4"
          v-for="brigades in brigades_list"
          :key="brigades.id"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>#{{brigades.name}}</v-list-item-title>
            </v-list-item-content>
            <v-chip class="ma-2">
              <v-btn icon color="primary" :to="`/brigad/`+brigades.id">
                <v-icon>edit</v-icon>
              </v-btn>
            </v-chip>
            <v-chip class="ma-2">
              <v-btn icon color="error" @click.prevent="showConfirmDeleteDialog(brigades.id)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-chip>
          </v-list-item>
        </v-card>
      </v-list>
    </v-flex>
  <v-dialog v-model="confirmDelete" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Team löschen</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
        <v-btn color="green darken-1" text @click="removeBrigad">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-layout>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
  middleware: 'authenticated',
  data() {
    return {
      confirmDelete: false,
      brigad_id: null
    };
  },
  computed: {
    ...mapState({
      projects: state => state.projects.projects,
      foreman_list: state => state.foreman.foreman_list,
      brigades_list: state => state.foreman.brigades_list,
    }),
  },
  mounted() {
    this.getBrigadesList();
  },
  methods: {
    ...mapActions('foreman', ['getBrigade', 'deleteBrigad']),
    getBrigadesList() {
      this.getBrigade();
    },
    showConfirmDeleteDialog(id) {
      this.confirmDelete = true;
      this.brigad_id = id;
    },
    removeBrigad() {
      this.deleteBrigad({id: this.brigad_id}).then(res => {
        this.$toast.success('Team gelöscht!');
        this.confirmDelete = false;
        this.brigad_id = null;
      }).catch(err => {
        this.confirmDelete = false;
        this.brigad_id = null;
        let error = err.response.data.message;
        this.$toast.error(error);
      });
    },
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
