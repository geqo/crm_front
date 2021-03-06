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
            zurückpfeifen
          </v-btn>
        </v-col>
        <v-col>
          <v-btn color="red" @click="openProjectDialog('disputed')">
            Closed the project, something want wrong
          </v-btn>
        </v-col>
      </v-card>
      <v-dialog class="pa-6" fullscreen v-model="projectDialog" persistent>
        <v-card class="pa-6">
          <v-form ref="dialogForm" id="dialogForm" class="pa-8">
            <p>
              By signing this checklist, you agree that the work was rendered efficiently and in accordance with the list of works indicated in the order sheet.
            </p>
            <v-text-field name="first_name" v-if="project_type === 'ready'" label="Vorname"></v-text-field>
            <v-text-field name="last_name" v-if="project_type === 'ready'" label="Nachname"></v-text-field>
            <vue-signature v-if="project_type === 'ready'" ref="signature" class="signature" :sigOption="option" :w="'100%'" :h="'58vh'" ></vue-signature>
            <v-row class="d-flex flex-wrap-reverse">
              <v-checkbox class="pr-6" v-model="dialogForm.status" label="Kelne Beanstandung" value="1"></v-checkbox>
              <v-checkbox class="pr-6" v-model="dialogForm.status" label="Siehe Fehler protokoll" value="0"></v-checkbox>
            </v-row>
            <v-btn v-if="project_type === 'ready'"  color="green" @click="clearSignature">Klar</v-btn>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn large color="green darken-1" @click="projectDialog = false">Stornieren</v-btn>
              <v-btn large color="primary darken-1" :disabled="disableBtn" @click="saveNote">Sparen</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
    </v-flex>
    <v-flex>
    <v-row>
      <v-col>
        <v-flex xs12 class="fullwidth">
          <v-card class="my-5 elevation-4">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Zusatzfragebogen</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-list>
            <v-card
              class="my-5 elevation-4"
              v-for="checklist in checklists"
              :key="checklist.id"
              v-if="checklist.type === 'improvements'"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{checklist.name}}</v-list-item-title>
                </v-list-item-content>
                <v-btn color="secondary" class="mr-3" v-if="isForeman || isAdmin" @click="showChecklistFileDialog(checklist)">
                  Bild hinzufügen
                </v-btn>
                <v-btn color="primary" class="mr-3" v-if="isForeman || isAdmin" @click="showChecklistNotDialog(checklist)">
                  Notiz hinzufügen
                </v-btn>
                <v-btn class="mr-12" :to="`/improvements-checklist/show/` + checklist.id"  icon color="primary">
                  <v-icon color="green darken-2">mdi-eye</v-icon>
                </v-btn>
                <v-chip class="ma-2" v-if="isAdmin">
                  <v-btn icon color="error" @click="showConfirmDeleteChecklistDialog(checklist.id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-chip>
              </v-list-item>
            </v-card>
            <v-row justify="end" v-if="isAdmin">
              <v-col xl="auto">
                <v-btn :to="`/project/`+ project.id +'/improvements/add'" depressed color="primary">
                  hinzufügen
                </v-btn>
              </v-col>
            </v-row>
          </v-list>
        </v-flex>
      </v-col>
    </v-row>
    </v-flex>

    <v-dialog v-model="confirmDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">gelöscht</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDelete = false">No</v-btn>
          <v-btn color="green darken-1" text @click="removeChecklist">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="checklistNoteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{project.client_id }}</v-card-title>
        <v-card class="pa-6">
          <v-form ref="dialogForm" id="checklistNoteForm">
            <v-textarea outlined autofocus label="Notiz" name="notes" :rules="notesRules" :value="checked_checklist.notes"></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text :disabled="disableBtn" @click="sendChecklistNotes">speichern</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>

    <v-dialog v-model="checklistFileDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">{{project.client_id }}</v-card-title>
        <v-card class="pa-6">
          <v-form ref="dialogForm" id="checklistFileForm">
            <v-file-input ref="checklistFile" :rules="filesRules" name="files[]" show-size counter multiple label="Dateieingabe"></v-file-input>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" :disabled="disableBtn"  text @click="sendChecklistFiles">speichern</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import VueSignature from "vue-signature"

  export default {
    components:{
      VueSignature
    },
    data() {
      return {
        project_type: '',
        dialogForm: {
            status: 1
        },
        option:{
          penColor:"rgb(0, 0, 0)",
          backgroundColor:"rgb(255,255,255)"
        },
        notesRules: [
          v => !!v || 'Notiz ist erforderlich',
        ],
        filesRules: [
          v => !!v || 'Datei ist erforderlich',
        ],
        valid: true,
        checklistNotForm: {},
        checked_checklist: {},
        checklistNoteDialog: false,
        checklistFileDialog: false,
        projectDialog: false,
        confirmDelete: false,
        noteDialog: false,
        disableBtn: false,
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
          this.$toast.error(message);
        });
      }).catch((error) => {
        this.$nuxt.$loading.finish();
        let message = error.response.data.message;
        this.$toast.error(message);
      });
    },
    methods: {
      ...mapActions('projects', ['getProject', 'changeProjectStatusToWorking', 'readyForMontage', 'changeProjectStatusReadyToMontage', 'changeProjectStatus']),
      ...mapActions('checklist', ['getChecklist', 'changeCheckboxStatus', 'changeStatus', 'deleteChecklistsItem', 'addNoteChecklistsItem', 'addFileChecklistsItem']),
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
          this.$toast.success('Files saved successfully!');
          this.checklistFileDialog = false;
          this.disableBtn = false;
          this.$refs.checklistFile.value = null;
        }).catch(err => {
          this.disableBtn = false;
          let message = error.response.data.message;
          this.$toast.error(message);
        })

      },
      sendChecklistNotes(){
        if(this.$refs.dialogForm.validate()){

          let form = document.getElementById('checklistNoteForm');
          let formData = new FormData(form);
          this.disableBtn = true;
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



      showConfirmDeleteChecklistDialog(id) {
        this.confirmDelete = true;
        this.checklist_id = id;
      },
      removeChecklist() {
        this.deleteChecklistsItem({id: this.checklist_id}).then().catch(error => {
          let message = error.response.data.message;
          this.confirmDelete = false;
          this.$toast.error(message);
        })
      },
      undoSignature(){
        this.$refs.signature.undo();
      },
      clearSignature(){
        this.$refs.signature.clear();
      },
      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      },
      openProjectDialog(type) {
        this.project_type = type;
        this.projectDialog = true;
      },
      undoSignature(){
        this.$refs.signature.undo();
      },
      clearSignature(){
        this.$refs.signature.clear();
      },
      saveNote() {
        if(this.$refs.dialogForm.validate()){
          let form = document.getElementById('dialogForm');
          const formData = new FormData(form);
          this.disableBtn = true
          if(this.project_type == 'ready') {
            let signaturePng = this.$refs.signature.save();
            let signatureFile = this.dataURLtoFile(signaturePng, 'signature.png');
            formData.append('signature', signatureFile);
          }
          this.changeProjectStatus({id: this.$route.params.id, data: formData, status: this.project_type}).then(res => {
            this.$router.back();
            this.disableBtn = false
          }).catch(error => {
            this.disableBtn = false
            let message = error.response.data.message;
            this.$toast.error(message);
          })
        }

      },
      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
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
