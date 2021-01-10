<template>
    <v-layout column justify-center align-center>
        <v-flex xs12 class="fullwidth">
            <v-card class="my-5 elevation-4">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>{{id === 'add' ? 'hinzufügen' : 'bearbeiten'}} <span>{{type}}</span> checklist</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
            <v-form
                ref="form"
                id="checklistForm"
                v-model="valid"
                lazy-validation
            >
                <v-text-field
                    v-model="checklistData.name"
                    :counter="10"
                    :rules="nameRules"
                    label="Name"
                    name="name"
                    required
                ></v-text-field>

                <v-text-field
                  v-model="checklistData.price"
                  :counter="10"
                  type="number"
                  v-if="type === 'improvements'"
                  :rules="priceRules"
                  label="Preis"
                  name="price"
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
        type: null,
        id: null,
        valid: true,
        nameRules: [
          v => !!v || 'Name ist erforderlich',
        ],
        priceRules: [
          v => !!v || 'Price ist erforderlich',
        ],
        emailRules: [
          v => !!v || 'E-mail ist erforderlich',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        roles: [
          {value: 1, text: 'Admin'},
          {value: 2, text: 'Lagerhalter'},
          {value: 3, text: 'Manager'},
          {value: 4, text: 'Vorarbeiter'},
          {value: 5, text: 'OBI Mitarbeiter'},
        ],
        checklistData: {}
      };
    },
    computed: {
      ...mapState({
        checklists_item: state => state.checklist.checklists_item,
      }),
    },
    mounted() {
      this.id = this.$route.params.id;
      this.type = this.$route.params.type;
      if (this.id !== 'add') {
        this.getChecklistItem({id: this.id}).then(res => {
          this.checklistData = {...this.checklists_item};
        }).catch(err => {


        })
      } else {
        this.checklistData = {}
      }
      this.checklistData.type = this.$route.params.type
      this.checklistData.project_id = this.$route.params.project
    },
    methods: {
      ...mapActions('checklist', ['getChecklistItem', 'addChecklistsItem', 'editChecklistsItem']),
      send () {
        if(this.$refs.form.validate()){
            let form = document.getElementById('checklistForm');
            const formData = new FormData(form);
            formData.append('project_id', this.checklistData.project_id)
            formData.append('type', this.checklistData.type)
          if (this.id === 'add') {
            this.addChecklistsItem(formData).then(res => {
              this.$router.back();
            }).catch(err => {
              let error = err.response.data.message;
              this.$toast.error(error);
            })
          } else {
            this.editChecklistsItem({id: this.id, data: formData, type: this.type}).then(res => {
              this.$router.back();
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
