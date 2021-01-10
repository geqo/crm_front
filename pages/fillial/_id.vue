<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 class="fullwidth">
            <v-card class="my-5 elevation-4">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Filiale {{fillial_id === 'add' ? 'hinzufügen' : 'bearbeiten'}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-text-field
                    v-model="formData.name"
                    :counter="10"
                    :rules="nameRules"
                    label="Name"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="formData.email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                ></v-text-field>

                <v-btn
                    color="primary"
                    @click="send"
                >
                    Speichern
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
        fillial_id: null,
        valid: true,
        formData: {},
        nameRules: [
          v => !!v || 'Name ist erforderlich',
        ],
        emailRules: [
          v => !!v || 'E-mail ist erforderlich',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
      };
    },
    computed: {
      ...mapState({
          fillial: state => state.fillial.fillial,
      }),
    },
    created() {
      this.fillial_id = this.$route.params.id;
      if (this.fillial_id !== 'add') {
          this.getFillial({id: this.fillial_id}).then(res => {
              this.formData = {...this.fillial};
          }).catch(err => {


          })
      } else {
        this.profileData = {}
      }
    },
    methods: {
      ...mapActions('fillial', ['addFillial', 'editFillial', 'getFillial']),
        send() {
            let _this = this;
            if(_this.$refs.form.validate()){
                if (_this.fillial_id === 'add') {
                    _this.addFillial(_this.formData).then(res => {
                        _this.$router.push({ name: 'fillial' });
                    }).catch(err => {
                        let error = err.response.data.message;
                        _this.$toast.error(error);
                    })
                } else {
                    _this.editFillial({id: this.fillial_id, data: this.formData}).then(res => {
                        this.$router.push({ name: 'fillial' });
                    }).catch(err => {
                        let error = err.response.data.message;
                        _this.$toast.error(error);
                    })
                }

            }
        }
    }
  };
</script>
