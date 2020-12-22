<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 class="fullwidth">
            <v-card class="my-5 elevation-4">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Nutzer {{user_id === 'add' ? 'hinzufügen' : 'bearbeiten'}} </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-text-field
                    v-model="profileData.name"
                    :counter="10"
                    :rules="nameRules"
                    label="Name"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="profileData.email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="profileData.password"
                    label="Passwort"
                    required
                ></v-text-field>
                <v-select
                    v-model="profileData.role_id"
                    :items="roles"
                    @input="changeRole"
                    :rules="[v => !!v || 'Role ist erforderlich']"
                    label="Role"
                    required
                ></v-select>

                <v-select
                    v-if="fillials.length"
                    v-model="profileData.fillial_id"
                    :items="fillials"
                    item-text="name"
                    item-value="id"
                    :rules="[v => !!v || 'Filial ist erforderlich']"
                    label="Fillial"
                    required
                ></v-select>

                <v-btn
                    color="primary"
                    @click="send"
                >
                    Speichern
                </v-btn>
            </v-form>

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
  import {mapState, mapActions} from 'vuex';

  export default {
    middleware: 'authenticated',
    data() {
      return {
        user_id: null,
        valid: true,
        nameRules: [
          v => !!v || 'Name ist erforderlich',
        ],
        passwordRules: [
          v => !!v || 'Name ist erforderlich',
        ],
        emailRules: [
          v => !!v || 'E-mail ist erforderlich',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        roles: [
          {value: 1, text: 'admin'},
          {value: 2, text: 'storekeeper'},
          {value: 3, text: 'manager'},
          {value: 4, text: 'foreman'},
          {value: 5, text: 'obinspector'},
        ],
        profileData: {},
          profileCredentials: {},
        fillials: []
      };
    },
    computed: {
      ...mapState({
        profile: state => state.profile.profile,
      }),
    },
    created() {
      this.user_id = this.$route.params.id;
      if (this.user_id !== 'add') {
        this.getProfile({id: this.user_id}).then(res => {
          this.profileData = {...this.profile};
        }).catch(err => {


        })
      } else {
        this.profileData = {}
      }
    },
    methods: {
      ...mapActions('profile', ['addProfile', 'getProfile', 'editProfile']),
      changeRole(){
        if (this.profileData.role_id === 5) {
          this.$axios.post('users/changingRole', {role_id: this.profileData.role_id}).then(res => {
            this.fillials = res.data.fillials;
          }).catch(err => {
            let error = err.response.data.message;
            this.$toast.error(error).goAway(1500);
          })
        } else {
          this.fillials = [];
        }
      },
        updatePassword() {
            if(this.$refs.credentialsForm.validate()){
                this.$axios.put('users/update-password/' + this.profile.id, this.profileCredentials).then(res => {
                    this.$toast.success(res.data.message).goAway(1500);
                    this.profileCredentials = {}
                }).catch(err => {
                    let error = err.response.data.message;
                    this.$toast.error(error).goAway(1500);
                })
            }
        },
      send () {
        let _this = this
        if(_this.$refs.form.validate()){
          if (_this.user_id === 'add') {
            console.log(this.profileDat);
            _this.addProfile(_this.profileData).then(res => {
              _this.$router.push({ name: 'profile' });
            }).catch(err => {
              let error = err.response.data.message;
              _this.$toast.error(error).goAway(1500);
            })
          } else {
            _this.editProfile({id: this.user_id, data: this.profileData}).then(res => {
              this.$router.push({ name: 'profile' });
            }).catch(err => {
              let error = err.response.data.message;
              _this.$toast.error(error).goAway(1500);
            })
          }

        }
      },
    }
  };
</script>
