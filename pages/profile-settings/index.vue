<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 class="fullwidth">
      <v-form ref="credentialsForm" class="mt-10">
        <p>Profile Passwort aktualisieren</p>
        <v-text-field
          v-model="profileCredentials.password"
          label="Passwort"
          type="password"
          :rules="[v => !!v || 'Passwort ist erforderlich']"
          required
        ></v-text-field>
        <v-text-field
          v-model="profileCredentials.password_confirmation"
          label="Passwort bestätigen"
          type="password"
          :rules="[v => !!v || 'Passwort bestätigen ist erforderlich']"
          required
        ></v-text-field>
        <v-btn
          color="primary"
          @click="updatePassword"
        >
          Passwort aktualisieren
        </v-btn>
      </v-form>
    
    </v-flex>
  </v-layout>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    middleware: 'authenticated',
    data() {
      return {
        valid: true,
        profileCredentials: {},
      };
    },
    computed: {
    },
    mounted() {
      console.log('user', this.user);
    },
    methods: {
      ...mapActions('profile', ['getProfile']),
      updatePassword() {
        if(this.$refs.credentialsForm.validate()){
          this.$axios.put('users/update-password/' + this.user.id, this.profileCredentials).then(res => {
            this.$toast.success(res.data.message).goAway(1500);
            this.profileCredentials = {}
          }).catch(err => {
            let error = err.response.data.message;
            this.$toast.error(error).goAway(1500);
          })
        }
      },
    }
  };
</script>
