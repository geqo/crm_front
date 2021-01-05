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
            <v-row>
              <v-list-item>
                <v-spacer></v-spacer>
                <v-chip class="ma-2" color="secondary">Kelne Beanstandung</v-chip>
                <v-chip class="ma-2" color="secondary">Siehe Fehler protokoll</v-chip>
              </v-list-item>
            </v-row>
            <template v-if="checklistsData">
              <v-row v-for="(checklist, i) in checklistsData" :key="checklist.id" v-if="checklist.type === 'standard'">
                <v-card class="my-3" style="width: 100%">
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <v-card-title
                      class="headline"
                      v-text="checklist.name"
                    />
                    <v-card-title>
                      <div class="d-flex flex-no-wrap mb-auto">
                        <v-btn class="mr-3" v-if="checklist.notes || (checklist.images && checklist.images.length)"
                               :to="`/standard-checklist/show/` + checklist.id" icon color="primary">
                          <v-icon color="green darken-2">mdi-eye</v-icon>
                        </v-btn>
                        <v-btn color="secondary" class="mr-3" v-if="isForeman || isAdmin"
                               @click="checklist.showNote ? $set(checklist, 'showNote', !checklist.showNote) : $set(checklist, 'showNote', true)"
                        >
                          Notiz{{checklist.notes ? '(1)' : ''}}
                        </v-btn>
                        <v-btn color="secondary" class="mr-3" v-if="isForeman || isAdmin"
                               @click="showChecklistFileDialog(checklist)"
                        >
                          Foto{{checklist.images && checklist.images.length ? `(${checklist.images.length})` : ''}}
                        </v-btn>
                        <toggle-button class="mr-3"
                                       :value="checklist.status === null ? true : !!checklist.status"
                                       :font-size="14"
                                       :labels="{checked: 'Ordnung', unchecked: 'Fehler'}"
                                       :sync="true"
                                       :color="{checked: '#4caf50', unchecked: '#f44336', disabled: '#808080'}"
                                       :width="100"
                                       :height="36"
                                       @change="changeChecklistItemStatus(checklist.id, $event.value)"
                        />
                        <v-btn v-if="isAdmin" color="error" @click="showConfirmDeleteChecklistDialog( checklist.id)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </div>
                    </v-card-title>
                  </div>

                  <v-card-text>
                    <v-select
                      v-if="checklist.status === 0"
                      v-model="checklist.fail_code"
                      :items="items"
                      label="Fehlerkode"
                      clearable
                      @change="updateChecklistFailCode(checklist)"
                    ></v-select>
                    <template v-if="checklist.showNote">
                      <v-textarea
                        @click:clear="clearChecklistNote(checklist)"
                        v-if="isForeman || isAdmin"
                        clearable
                        auto-grow
                        rows="1"
                        label="Notiz"
                        name="notes"
                        v-model="checklist.notes"
                      >
                        <template v-if="checklist.notes && checklist.notes.length > 0" v-slot:append-outer>
                          <v-btn color="primary" @click="updateChecklistNote(checklist)">
                            <v-icon>save</v-icon>
                          </v-btn>
                        </template>
                      </v-textarea>
                    </template>
                  </v-card-text>
                </v-card>
              </v-row>
            </template>

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
            Fertig
          </v-btn>
          <v-btn color="primary" @click="openProjectDialog('backToReadyForMontage')">
            zurückpfeifen
          </v-btn>
        </v-card>
      </v-row>
    </v-flex>

    <v-dialog fullscreen v-model="projectDialog" persistent>
      <v-card class="mx-6 d-flex flex-column">

        <v-card-title>
          Bestätigung des Kundes :
          “Die Schränke sind Innen besenrein. Die Verpackung und der Montageablauf wurden entsorgt. Die Lieferung ist
          vollständig. Die Artikel entsprechen meiner Bestellung in Farbe und Ausführung!
        </v-card-title>

        <v-card-text class="flex-grow-1">
          <v-form v-model="formValidate" ref="dialogForm" id="dialogForm">
            <div class="d-flex">

              <v-card class="signature-box" elevation="0">
                <v-text-field :rules="requiredRule" name="client_first_name" v-if="project_type === 'ready'"
                              label="Kunde Vorname"></v-text-field>
                <v-text-field :rules="requiredRule" name="client_last_name" v-if="project_type === 'ready'"
                              label="Kunde Nachname"></v-text-field>
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
                  <v-btn v-if="project_type === 'ready'" color="green" @click="$refs.signature1.clear()">klar</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="signature-box" elevation="0">

                <v-text-field :rules="requiredRule" name="worker_first_name" v-if="project_type === 'ready'"
                              label="Monteur Vorname"></v-text-field>
                <v-text-field :rules="requiredRule" name="worker_last_name" v-if="project_type === 'ready'"
                              label="Monteur Nachname"></v-text-field>
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
                  <v-btn v-if="project_type === 'ready'" color="green" @click="$refs.signature2.clear()">klar</v-btn>
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
          <v-btn large color="warning darken-1" @click="projectDialog = false">Stornieren</v-btn>
          <v-btn :loading="loading" large color="primary darken-1" :disabled="disableBtn" @click="saveNote">Sparen</v-btn>
        </v-card-actions>
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
  name: 'StandardChecklist',
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
      checklistsData: [],
      items: [
        'Strom Installation nicht nach DIN Verordnung  gemacht',
        'Wasser Zufluss',
        'Wasser Abfluss',
        'Maße passen nicht',
        'Falsche Farbe',
        'Ware passen nicht im Treppenhaus oder im Küchenbereich',
        'Termin abgesagt',
      ],
      loading: false,
    }
  },
  computed: {
    ...mapState({
      project: state => state.projects.project,
    }),
    finalStatus() {
      return this.checklistsData.every(checklist => checklist.status);
    }
  },
  mounted() {
    this.getProject({id: this.$route.params.id}).then(() => {
      this.$nuxt.$loading.finish();
      this.getChecklist({id: this.$route.params.id}).then(() => {
        this.updateLocalData()
      }).catch((error) => {
        this.$nuxt.$loading.finish();
        this.$toast.error(error.response.data.message);
      });
    }).catch((error) => {
      this.$nuxt.$loading.finish();
      let message = error.response.data.message;
      this.$toast.error(message);
    });
  },
  methods: {
    ...mapActions('projects', [
      'getProject',
      'changeProjectStatusToWorking',
      'readyForMontage',
      'changeProjectStatusReadyToMontage',
      'changeProjectStatus'
    ]),
    ...mapActions('checklist', [
      'getChecklist',
      'changeCheckboxStatus',
      'changeStatus',
      'deleteChecklistsItem',
      'addFileChecklistsItem',
      'addNoteChecklistsItem',
      'addFailCodeChecklistsItem'
    ]),

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
        this.updateLocalData()
        this.$toast.success('Dateien erfolgreich gespeichert!');
        this.checklistFileDialog = false;
        this.disableBtn = false;
        this.$refs.checklistFile.value = null;
      }).catch(err => {
        this.disableBtn = false;
        let message = err.response.data.message;
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
        this.loading = true
        let form = document.getElementById('dialogForm');
        const formData = new FormData(form);
        if (this.project_type === 'ready') {
          const signature1File = this.dataURLtoFile(this.$refs.signature1.save(), 'client_signature.png');
          const signature2File = this.dataURLtoFile(this.$refs.signature2.save(), 'worker_signature.png');
          formData.append('client_signature', signature1File);
          formData.append('worker_signature', signature2File);
        }
        this.changeProjectStatus({id: this.$route.params.id, data: formData, status: this.project_type}).then(res => {
          this.$router.back();
        }).catch(error => {
          let message = error.response.data.message;
          this.$toast.error(message);
        }).finally(() => {
          this.loading = false
        })
      }

    },
    changeChecklistItemStatus(id, status) {
      this.changeStatus({id: id, status: status * 1}).then(res => {
        this.updateLocalData()
        this.$toast.success('Status erfolgreich gespeichert!');
      }).catch(err => {
        let message = err.response.data.message;
        this.$toast.error(message);
      })
    },
    clearChecklistNote(checklist) {
      checklist.notes = null
      this.updateChecklistNote(checklist)
    },
    updateChecklistNote(checklist) {
      this.addNoteChecklistsItem({id: checklist.id, data: checklist}).then(res => {
        this.updateLocalData()
        this.$toast.success('Notiz erfolgreich gespeichert!');
      }).catch(err => {
        let error = err.response.data.message;
        this.$toast.error(error);
      })
    },
    updateChecklistFailCode(checklist) {
      this.addFailCodeChecklistsItem({id: checklist.id, data: checklist, type: checklist.type}).then(res => {
        this.updateLocalData()
        this.$toast.success('Fehlerkode erfolgreich gespeichert!');
      }).catch(err => {
        let error = err.response.data.message;
        this.$toast.error(error);
      })
    },
    updateLocalData() {
      this.checklistsData = this.$store.state.checklist.checklists.map(checklist => {
        const data = { ...checklist };
        if (data.status === null) data.status = 1;
        return data;
      });
    }
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
