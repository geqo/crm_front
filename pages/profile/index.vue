<template>
<v-layout column justify-center align-center>
    <v-flex xs12 class="fullwidth">
      <v-card class="my-5 elevation-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Nutzer</v-list-item-title>
          </v-list-item-content>
          <v-item>
            <v-btn to="/profile/add" depressed color="primary">
              Nutzer hinzufügen
            </v-btn>
          </v-item>
        </v-list-item>
      </v-card>
      <v-list v-if="profiles">
        <v-card
          class="my-5 elevation-4"
          v-for="profile in profiles"
          :key="profile.id"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{profile.name}}</v-list-item-title>
            </v-list-item-content>
            <v-chip class="ma-2">
              <v-btn icon color="primary" :to="`/profile/`+profile.id">
                <v-icon>edit</v-icon>
              </v-btn>
            </v-chip>
            <v-chip class="ma-2">
              <v-btn icon color="error" @click.prevent="showConfirmDeleteDialog(profile.id)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-chip>
          </v-list-item>
        </v-card>
      </v-list>
    </v-flex>
    <v-dialog v-model="confirmDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Nutzer</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
          <v-btn color="green darken-1" text @click="deleteUser">Yes</v-btn>
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
        user_id: null
    };
  },
  computed: {
    ...mapState({
      profiles: state => state.profile.profiles,
    }),
  },
  mounted() {
    this.getProfiles().then(res => {
    }).catch(err => {
      let error = err.response.data.message;
      this.$toast.error(error).goAway(1500);
    });
  },
  methods: {
    ...mapActions('profile', ['getProfiles', 'deleteProfile']),
    showConfirmDeleteDialog(id) {
      this.confirmDelete = true;
      this.user_id = id;
    },
    deleteUser() {
      this.deleteProfile({id: this.user_id}).then(res => {
        this.$toast.success(res.data.message).goAway(1500);
        this.confirmDelete = false;
        this.user_id = null;
      }).catch(err => {
        this.confirmDelete = false;
        this.user_id = null;
        let error = err.response.data.message;
        this.$toast.error(error).goAway(1500);
      });
    },
   
  }
};
</script>
