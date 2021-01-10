<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 class="fullwidth">
            <v-card class="my-5 elevation-4">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>{{brigad_id == 'add' ? 'hinzufügen' : 'bearbeiten'}} Team</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-form
                ref="form"
                v-model="valid"
                id="foremanForm"
                lazy-validation
            >
                <v-text-field
                    :value="foremanData.name"
                    :counter="10"
                    name="name"
                    :rules="nameRules"
                    label="Name"
                    required
                ></v-text-field>
                <v-select
                    :value="foremanData.brigadir_id"
                    :items="foreman_list"
                    name="brigadir_id"
                    :rules="[v => !!v || 'Item is required']"
                    label="Brigadirs"
                    item-text="name"
                    item-value="id"
                    required
                ></v-select>
               <v-row justify="end" class="mb-3">
                   <v-btn
                     color="primary"
                     @click="addBrigadeWorker"
                   >Mittarbeiter hinzufügen</v-btn>
               </v-row>
                <v-row v-for="(workers, index) in foremanData.workers" :key="index">
                    <v-text-field
                      :value="foremanData.workers[index].name"
                      label="Name"
                      name="workers[][name]"
                      required
                      outlined
                      class="mr-2"
                    ></v-text-field>
                    <v-btn
                      color="error"
                      @click="deleteBrigadeWorker(workers.id, index)"
                    >
                      löschen
                    </v-btn>
                </v-row>


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
        brigad_id: null,
        valid: true,
        foremanData: {
          workers: [{id: 0, name: ""},]
        },
        foreman_id: {},
        nameRules: [
          v => !!v || 'Name ist erforderlich',
        ],
      };
    },
    computed: {
      ...mapState({
        foreman: state => state.foreman.foreman,
        foreman_list: state => state.foreman.foreman_list,
      }),
    },
    mounted() {
      this.getForemans()
      this.getBrigadeWorkers()
      this.brigad_id = this.$route.params.id;
      if (this.brigad_id !== 'add') {
        this.getForeman({id: this.brigad_id }).then(res => {
          this.foremanData = this.foreman;
        }).catch(error => {

        })
      } else {
        this.foremanData = {
          workers: [{name: ""}]
        }
      }
    },
    methods: {
      ...mapActions('foreman', ['getForeman', 'addForeman', 'editForeman', 'getForemans', 'deleteBrigadeWorkers']),
      ...mapActions('brigadeWorkers', ['getBrigadeWorkers']),
      addBrigadeWorker() {
        if (this.brigad_id === 'add') {
          this.foremanData.workers.push({id: 0, name: ""})
        } else {
          this.$store.commit('foreman/addWorkers', {id: 0, name: ""})
        }
      },
      deleteBrigadeWorker(id, index) {
        if (id == 0) {
          this.$store.commit('foreman/removeWorker', {id: 0, index: index})
        } else {
          this.deleteBrigadeWorkers({id: 0, index: index}).then(res => {
            this.$toast.success('Brigade worker has successfully deleted');
          })
        }
      },
      send () {
        if(this.$refs.form.validate()){
          let form = document.getElementById('foremanForm');
          const formData = new FormData(form);
          if (this.brigad_id === 'add') {
            this.addForeman(formData).then(res => {
              this.$router.push({ name: 'brigad' });
            }).catch(err => {
              let error = err.response.data.message;
              this.$toast.error(error);
            })
          } else {
            this.editForeman({id: this.brigad_id, data: formData}).then(res => {
              this.$router.push({ name: 'brigad' });
            }).catch(err => {
              let error = err.response.data.message;
              this.$toast.error(error);
            })
          }

        }
      },
    }
  };
</script>
