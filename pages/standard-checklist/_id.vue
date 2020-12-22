<template>
  <v-layout column>
    <v-flex>
      <v-row class="justify-end" v-if="project.status_id === 4 && (isObinspector || isForeman || isAdmin)">
        <v-card class="my-5 elevation-4 d-flex">
          <v-col>
            <v-btn color="success" @click="openProjectDialog('ready')">
              Fertig
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="primary" @click="openProjectDialog('backToReadyForMontage')">
              Back to ready for testing
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="red" @click="openProjectDialog('disputed')">
              Closed the project, something want wrong
            </v-btn>
          </v-col>
        </v-card>
        <v-dialog fullscreen v-model="projectDialog" persistent>
          <v-card class="pa-6">
            <v-form ref="dialogForm" id="dialogForm">
              <p>
                By signing this checklist, you agree that the work was rendered efficiently and in accordance with the
                list of works indicated in the order sheet.
              </p>
              <v-text-field name="first_name" v-if="project_type === 'ready'" label="First Name"></v-text-field>
              <v-text-field name="last_name" v-if="project_type === 'ready'" label="Last Name"></v-text-field>
              <vue-signature v-if="project_type === 'ready'" ref="signature" class="signature" :sigOption="option"
                             :w="'100%'" :h="'58vh'"></vue-signature>
              <v-row class="d-flex flex-wrap-reverse">
                <v-checkbox class="pr-6" v-model="dialogForm.status" label="Kelne Beanstandung" value="1"></v-checkbox>
                <v-checkbox class="pr-6" v-model="dialogForm.status" label="Siehe Fehler protokoll"
                            value="0"></v-checkbox>
              </v-row>
              <v-btn v-if="project_type === 'ready'" color="green" @click="clearSignature">Clear</v-btn>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn large color="green darken-1" @click="projectDialog = false">Cancel</v-btn>
                <v-btn large color="primary darken-1" :disabled="disableBtn" @click="saveNote">Save</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-row>
    </v-flex>
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
            <v-card class="my-5">
              <v-list-item>
                <v-spacer></v-spacer>
                <v-chip class="ma-2" color="secondary">Kelne Beanstandung</v-chip>
                <v-chip class="ma-2" color="secondary">Siehe Fehler protokoll</v-chip>
              </v-list-item>
            </v-card>
            <v-card
              class="my-5 elevation-4"
              v-for="(checklist, i) in checklists"
              :key="checklist.id"
              v-if="checklist.type === 'standard'"

            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ checklist.name }}</v-list-item-title>
                </v-list-item-content>
                <v-btn color="secondary" class="mr-3" v-if="isForeman || isAdmin"
                       @click="showChecklistFileDialog(checklist)">
                  Bild hinzufügen
                </v-btn>
                <v-btn color="primary" class="mr-12" v-if="isForeman || isAdmin"
                       @click="showChecklistNotDialog(checklist)">
                  Notiz hinzufügen
                </v-btn>
                <v-btn class="mr-12" v-if="checklist.notes || checklist.images.length"
                       :to="`/standard-checklist/show/` + checklist.id" icon color="primary">
                  <v-icon color="green darken-2">mdi-eye</v-icon>
                </v-btn>
                <v-btn class="mr-12" icon color="primary" @click="changeChecklistItemStatus(checklist.id, 1)">
                  <v-icon color="green darken-2" v-if="checklist.status">mdi-check-box-outline</v-icon>
                  <v-icon color="green darken-2" v-else>mdi-checkbox-blank-outline</v-icon>
                </v-btn>
                <v-btn class="ml-12 mr-8" icon color="primary" @click="changeChecklistItemStatus(checklist.id,0)">
                  <v-icon color="green darken-2" v-if="checklist.status || checklist.status == null">
                    mdi-checkbox-blank-outline
                  </v-icon>
                  <v-icon color="green darken-2" v-else>mdi-check-box-outline</v-icon>
                </v-btn>
                <v-chip class="ma-2" v-if="isAdmin">
                  <v-btn icon color="error" @click="showConfirmDeleteChecklistDialog( checklist.id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-chip>
              </v-list-item>
            </v-card>
            <v-row justify="end" v-if="isAdmin">
              <v-col xl="auto">
                <v-btn :to="`/project/`+ project.id +'/standard/add'" depressed color="primary">
                  hinzufügen
                </v-btn>
              </v-col>
            </v-row>
          </v-list>
        </v-flex>
      </v-col>
    </v-row>
    <v-flex>
    </v-flex>
    <v-dialog v-model="checklistNoteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{ project.client_id }}</v-card-title>
        <v-card class="pa-6">
          <v-form ref="dialogForm" id="checklistNoteForm">
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
          <v-form ref="dialogForm" id="checklistFileForm">
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
import VueSignature from 'vue-signature'
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    VueSignature
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
    }
  },
  computed: {
    ...mapState({
      checklists: state => state.checklist.checklists,
      project: state => state.projects.project,
    })
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
        this.$toast.error(message).goAway(1500);
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
          this.$toast.error(message).goAway(1500);
        })
      }
    },

    changeChecklistItemStatus(id, status) {
      this.changeStatus({id: id, status: status}).then(res => {
        this.$toast.success('Notiz erfolgreich gespeichert!');
      }).catch(err => {
        let message = error.response.data.message;
        this.$toast.error(message).goAway(1500);
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
        this.$toast.error(message).goAway(1500);
      })
    },
    undoSignature() {
      this.$refs.signature.undo();
    },
    clearSignature() {
      this.$refs.signature.clear();
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
        if (this.project_type == 'ready') {
          let signaturePng = this.$refs.signature.save();
          let signatureFile = this.dataURLtoFile(signaturePng, 'signature.png');
          formData.append('signature', signatureFile);
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
.signature {
  border: 2px solid black;
  border-radius: 5px;
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>
