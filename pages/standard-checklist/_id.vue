<template>
  <v-layout column>
    <v-flex>
      <v-row v-if="project.status_id > 3">
        <v-col>
          <v-flex xs12 class="fullwidth">
            <v-card class="my-5 elevation-4">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>endabnahmeprotokoll</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
            <v-list>
              <v-list-item>
                <v-spacer></v-spacer>
                <v-chip class="ma-2" color="secondary">Kelne Beanstandung</v-chip>
                <v-chip class="ma-2" color="secondary">Siehe Fehler protokoll</v-chip>
              </v-list-item>

              <v-card
                class="my-5 elevation-4"
                v-for="(checklist, i) in checklists"
                :key="checklist.id"
                v-if="checklist.type === 'standard'"

              >
                <v-list-item>
                  <v-list-item-content>
                    <v-banner elevation="0" max-width="90%">{{ checklist.name }}</v-banner>
                  </v-list-item-content>
                  <v-btn color="secondary" class="mr-3" v-if="isForeman || isAdmin"
                         @click="showChecklistFileDialog(checklist)">
                    Bild hinzufügen
                  </v-btn>
                  <v-btn color="primary" class="mr-3" v-if="isForeman || isAdmin"
                         @click="showChecklistNotDialog(checklist)">
                    Notiz hinzufügen
                  </v-btn>
                  <v-btn class="mr-3" v-if="checklist.notes || checklist.images.length"
                         :to="`/standard-checklist/show/` + checklist.id" icon color="primary">
                    <v-icon color="green darken-2">mdi-eye</v-icon>
                  </v-btn>
                  <toggle-button class="mr-3 ml-6"
                                 :value="checklist.status === null ? true : !!checklist.status"
                                 :font-size="14"
                                 :labels="{checked: 'in Ordnung', unchecked: 'Warnung'}"
                                 :sync="true"
                                 :color="{checked: '#4caf50', unchecked: '#f44336', disabled: '#808080'}"
                                 :width="115"
                                 :height="32"
                                 @change="changeChecklistItemStatus(checklist.id, $event.value)"
                  />
                  <v-chip class="" v-if="isAdmin">
                    <v-btn icon color="error" @click="showConfirmDeleteChecklistDialog( checklist.id)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-chip>
                </v-list-item>
              </v-card>

            </v-list>
          </v-flex>
        </v-col>
      </v-row>
    </v-flex>
    <v-flex>
      <v-row v-if="project.status_id === 4 && (isObinspector || isForeman || isAdmin)">
        <v-card width="100%" class="mx-3 d-flex" flat>
          <v-btn v-if="isAdmin" :to="`/project/`+ project.id +'/standard/add'" depressed color="primary">
            hinzufügen
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn class="mr-5" :color="finalStatus ? 'success' : 'red'" @click="openProjectDialog('ready')">
            {{ finalStatus ? 'Fertig' : 'Closed the project, something want wrong' }}
          </v-btn>
          <v-btn color="primary" @click="openProjectDialog('backToReadyForMontage')">
            Back to ready for testing
          </v-btn>
        </v-card>
      </v-row>
    </v-flex>

    <v-dialog fullscreen v-model="projectDialog" persistent>
      <v-card class="mx-6 d-flex flex-column">

        <v-card-title>
          By signing this checklist, you agree that the work was rendered efficiently and in accordance with the
          list of works indicated in the order sheet.
        </v-card-title>

        <v-card-text class="flex-grow-1">
          <v-form v-model="formValidate" ref="dialogForm" id="dialogForm">
            <div class="d-flex">

              <v-card class="signature-box" elevation="0">
                <v-text-field :rules="requiredRule" name="first_name1" v-if="project_type === 'ready'"
                              label="First Name"></v-text-field>
                <v-text-field :rules="requiredRule" name="last_name1" v-if="project_type === 'ready'"
                              label="Last Name"></v-text-field>
                <vue-signature
                  :rules="requiredRule"
                  v-if="project_type === 'ready'"
                  ref="signature1"
                  class="signature"
                  :sigOption="option"
                  :w="'100%'"
                  :h="'62vh'"
                />
                <v-card-actions>
                  <v-btn v-if="project_type === 'ready'" color="green" @click="$refs.signature1.clear()">Clear</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="signature-box" elevation="0">

                <v-text-field :rules="requiredRule" name="first_name2" v-if="project_type === 'ready'" label="First Name"></v-text-field>
                <v-text-field :rules="requiredRule" name="last_name2" v-if="project_type === 'ready'" label="Last Name"></v-text-field>
                <vue-signature
                  :rules="requiredRule"
                  v-if="project_type === 'ready'"
                  ref="signature2"
                  class="signature"
                  :sigOption="option"
                  :w="'100%'"
                  :h="'62vh'"
                />

                <v-card-actions>
                  <v-btn v-if="project_type === 'ready'" color="green" @click="$refs.signature2.clear()">Clear</v-btn>
                </v-card-actions>
              </v-card>

            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-10">
          <span class="text-h6 mr-5">Status:</span>
          <v-chip
            :color="finalStatus ? '#4caf50' : '#f44336'"
            class="font-weight-black"
          >
            {{ finalStatus ? 'Kelne Beanstandung' : 'Siehe Fehler protokoll' }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn large color="warning darken-1" @click="projectDialog = false">Cancel</v-btn>
          <v-btn large color="primary darken-1" :disabled="disableBtn" @click="saveNote">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="checklistNoteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{ project.client_id }}</v-card-title>
        <v-card class="pa-6">
          <v-form ref="checklistNoteForm" id="checklistNoteForm">
            <v-textarea outlined autofocus label="Notiz" name="notes" :rules="notesRules"
                        :value="checked_checklist.notes"></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" :disabled="disableBtn" text @click="sendChecklistNotes">speichern</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="checklistFileDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{ project.client_id }}</v-card-title>
        <v-card class="pa-6">
          <v-form ref="checklistFileForm" id="checklistFileForm">
            <v-file-input accept="image/png, image/jpeg, image/bmp;capture=camera"
                          ref="checklistFile"
                          :rules="filesRules"
                          name="files[]"
                          show-size
                          counter
                          multiple
                          label="Dateieingabe"
            ></v-file-input>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" :disabled="disableBtn" text @click="sendChecklistFiles">speichern</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Checklistenelement löschen</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
          <v-btn color="green darken-1" text @click="acceptDeleteChecklistItem">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'
import VueSignature from 'vue-signature'
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    VueSignature, ToggleButton
  },
  data() {
    return {
      project_type: '',
      dialogForm: {
        status: 1
      },
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)'
      },
      requiredRule: [
        v => !!v || 'Notiz ist erforderlich',
      ],
      notesRules: [
        v => !!v || 'Notiz ist erforderlich',
      ],
      filesRules: [
        v => !!v || 'Dateien ist erforderlich',
      ],
      valid: true,
      checklistNotForm: {},
      checked_checklist: {},
      checklistNotDialog: false,
      projectDialog: false,
      confirmDelete: false,
      disableBtn: false,
      checklistNoteDialog: false,
      checklistFileDialog: false,
      formValidate: true,
    }
  },
  computed: {
    ...mapState({
      checklists: state => state.checklist.checklists,
      project: state => state.projects.project,
    }),
    finalStatus() {
      return this.checklists.every(checklist => {
        if(checklist.status === null) checklist.status = 1
        return checklist.status
      });
    }
  },
  mounted() {
    this.getProject({id: this.$route.params.id}).then(() => {
      this.$nuxt.$loading.finish();
      this.getChecklist({id: this.$route.params.id}).then().catch((error) => {
        this.$nuxt.$loading.finish();
        let message = error.response.data.message;
        this.$toast.error(message).goAway(1500);
      });
    }).catch((error) => {
      this.$nuxt.$loading.finish();
      let message = error.response.data.message;
      this.$toast.error(message).goAway(1500);
    });
  },
  methods: {
    ...mapActions('projects', ['getProject', 'changeProjectStatusToWorking', 'readyForMontage', 'changeProjectStatusReadyToMontage', 'changeProjectStatus']),
    ...mapActions('checklist', ['getChecklist', 'changeCheckboxStatus', 'changeStatus', 'deleteChecklistsItem', 'addFileChecklistsItem', 'addNoteChecklistsItem']),

    showChecklistNotDialog(checklist) {
      console.log(checklist);
      this.checked_checklist = checklist;
      this.checklistNoteDialog = true;
    },
    showChecklistFileDialog(checklist) {
      this.checked_checklist = checklist;
      this.checklistFileDialog = true;
    },
    sendChecklistFiles() {
      let form = document.getElementById('checklistFileForm');
      let formData = new FormData(form);
      this.disableBtn = true;
      this.addFileChecklistsItem({id: this.checked_checklist.id, data: formData}).then(res => {
        this.$toast.success('Files saved successfully!').goAway(1500);
        this.checklistFileDialog = false;
        this.disableBtn = false;
        this.$refs.checklistFile.value = null;
      }).catch(err => {
        this.disableBtn = false;
        let message = error.response.data.message;
        this.$toast.error(message);
      })

    },
    sendChecklistNotes() {
      if (this.$refs.dialogForm.validate()) {
        this.disableBtn = true;
        let form = document.getElementById('checklistNoteForm');
        let formData = new FormData(form);

        this.addNoteChecklistsItem({id: this.checked_checklist.id, data: formData}).then(res => {
          this.$toast.success('Notiz erfolgreich gespeichert!');
          this.checklistNoteDialog = false;
          this.disableBtn = false;
          document.getElementById('checklistNoteForm').reset();
        }).catch(err => {
          this.disableBtn = false;
          let message = error.response.data.message;
          this.$toast.error(message);
        })
      }
    },

    changeChecklistItemStatus(id, status) {
      this.changeStatus({id: id, status: status * 1}).then(res => {
        this.$toast.success('Notiz erfolgreich gespeichert!');
      }).catch(err => {
        let message = error.response.data.message;
        this.$toast.error(message);
      })
    },
    showConfirmDeleteChecklistDialog(id) {
      this.confirmDelete = true;
      this.checklist_id = id;
    },
    acceptDeleteChecklistItem() {
      this.deleteChecklistsItem({id: this.checklist_id}).then(res => {
        this.confirmDelete = false;
      }).catch(error => {
        let message = error.response.data.message;
        this.$toast.error(message);
      })
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type: mime});
    },
    openProjectDialog(type) {
      this.project_type = type;
      this.projectDialog = true;
    },
    saveNote() {
      if (this.$refs.dialogForm.validate()) {
        let form = document.getElementById('dialogForm');
        const formData = new FormData(form);
        if (this.project_type === 'ready') {
          const signature1File = this.dataURLtoFile(this.$refs.signature1.save(), 'signature1.png');
          const signature2File = this.dataURLtoFile(this.$refs.signature2.save(), 'signature2.png');
          formData.append('signature1', signature1File);
          formData.append('signature2', signature2File);
        }
        this.changeProjectStatus({id: this.$route.params.id, data: formData, status: this.project_type}).then(res => {
          this.$router.back();
        }).catch(error => {
          let message = error.response.data.message;
          this.$toast.error(message).goAway(1500);
        })
      }

    },
  }
}
</script>
<style>
.theme--light.v-banner.v-sheet .v-banner__wrapper {
  border-bottom: none;
}
</style>
<style>
.signature {
  border: 2px solid black;
  border-radius: 5px;
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.signature-box {
  width: 50%;
}

.signature-box:first-child {
  padding-right: 10px;
}
</style>
