<template>
  <v-layout column justify-center align-center>
    <v-flex xs6 class="fullwidth">
      <v-row>
        <v-col>
          <h1>Order #{{project.client_id}}</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">
          <v-btn v-if="project.status_id === 1 && (isStorekeeper || isAdmin)" color="primary" @click="setStatusWorking(project.id)">In Arbeit</v-btn>
          <v-btn v-if="project.status_id === 2 && (isStorekeeper || isAdmin)" color="primary" @click="setStatusReadyToMontage(project.id)">Fertig to Montage</v-btn>
          <v-chip class="ma-2" color="secondary">{{project.created_at}}</v-chip>
          <v-chip class="ma-2" :color="project.statusColor">{{project.statusText}}</v-chip>
        </v-col>

      </v-row>
      <v-row>
        <v-col xs9>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit()" id="projectForm">
            <v-text-field label="Client ID" v-if="project" v-model="project.client_id" disabled></v-text-field>
            <v-text-field name="address" disabled label="Address" :value="project.address"></v-text-field>
            <v-text-field name="shipping_address" :disabled="project.status_id === 5" label="Shipping Address" :value="project.shipping_address"></v-text-field>
            <v-text-field name="client_mobil" disabled label="Client Mobil" :value="project.client_mobil"></v-text-field>
            <v-text-field name="order_date" disabled label="Order Date" :value="project.order_date"></v-text-field>
            <v-text-field name="order_number" disabled label="Order Number" :value="project.order_number"></v-text-field>
            <v-text-field label="Full Name" v-model="project.full_name" disabled></v-text-field>
            <v-text-field label="Brigad" v-if="project.foremans && project.foremans.length" :value="project.foremans[0].name" disabled></v-text-field>
            <v-row>
              <v-col xs1>
                <v-text-field name="brigadir_price" type="number" label="Foreman Price" :value="project.brigadir_price" :disabled="(!isForeman && !isAdmin)"></v-text-field>
              </v-col>
              <v-col xs9>
                <v-text-field name="price" type="number" label="Price" :value="project.price" :disabled="(!isManager && !isAdmin)"></v-text-field>
              </v-col>
            </v-row>
            <v-textarea name="notes" v-if="project.status_id === 2" label="Notes" :value="project.notes"></v-textarea>
            <v-file-input :rules="filesRules" ref="projectFile" name="files[]" v-if="project.status_id === 2" show-size counter multiple label="File input"></v-file-input>
            <v-btn type="submit" color="primary">Save</v-btn>
          </v-form>
        </v-col>

        <v-spacer></v-spacer>
        <v-col>
          <div v-if="project.status_id === 5">
            <p class="text-center">Checklist Files</p>
            <div class="overflow-y-auto file-content">
              <v-card v-if="project.checklist_pdf" class="mx-auto mb-2" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1">
                      <v-btn icon>
                        <a :href="project.checklist_pdf" download target="_blank">
                          <v-icon>download</v-icon>
                        </a>
                      </v-btn>
                      checklist pdf
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions>
                </v-card-actions>
              </v-card>
              <v-card v-if="project.improvements_pdf" class="mx-auto mb-2" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1">
                      <v-btn icon>
                        <a :href="project.improvements_pdf" download target="_blank">
                          <v-icon>download</v-icon>
                        </a>
                      </v-btn>
                      improvements pdf
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions>
                </v-card-actions>
              </v-card>
            </div>
          </div>
        
          <v-btn color="green" type="button" @click="showImages">
            <span>Show Images</span>
          </v-btn>
        </v-col>
    
        <v-col v-if="project.mail_files && project.mail_files.length">
          <v-row>
            <v-col class="align-center col d-flex justify-center">
              <span class="mt-0 text-center">Mail Files</span>
            </v-col>
            <v-col>
              <v-btn color="primary" class="float-right"@click.prevent="downloadAll">Download all</v-btn>
            </v-col>
          </v-row>
          <div class="overflow-y-auto file-content">
            <v-card v-for="file in project.mail_files" :key="file.id" class="mx-auto mb-2" max-width="344" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-subtitle v-if="file.type === 'web'">Uploaded file</v-list-item-subtitle>
                  <v-list-item-title class="headline mb-1">
                    <v-btn icon>
                      <a :href="file.path" download target="_blank">
                        <v-icon>download</v-icon>
                      </a>
                    </v-btn>
                    {{ file.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="file.type === 'pdf'">File downloaded from email</v-list-item-subtitle>
                </v-list-item-content>
      
                <v-list-item-avatar tile size="40" color="grey">
                  <img v-if="file.icon_path" :src="file.icon_path" alt />
                  <img v-else src="~assets/img/no-image.png" alt />
                </v-list-item-avatar>
              </v-list-item>
    
              <v-card-actions>
      
      
              
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
        <v-col v-if="project.web_files && project.web_files.length">
          <p class="text-center">Web Files</p>
          <div class="overflow-y-auto file-content">
            <v-card v-for="file in project.web_files" :key="file.id" class="mx-auto mb-2" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">
                  <v-btn icon>
                    <a :href="file.path" download>
                      <v-icon>download</v-icon>
                    </a>
                  </v-btn>
                  {{ file.name }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="file.type === 'web'">Uploaded file</v-list-item-subtitle>
                <v-list-item-subtitle v-if="file.type === 'mail'">File downloaded from email</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="40" color="grey">
                <img v-if="file.icon_path" :src="file.icon_path" alt/>
                <img v-else src="~assets/img/no-image.png" alt />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
              <v-btn color="error" v-if="project.status_id !== 5 || project.status_id !== 6">
                <a href="" @click.prevent="deleteFile(file.id)">Delete</a>
              </v-btn>
            </v-card-actions>
          </v-card>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="project.status_id === 5">

        <v-col>
          <p>signature</p>
          <img class="w-100 h-100" :src="'https://api.esad-gmbh.de/storage/projects/2/' + project.signature" alt="">
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <template>
            <v-expansion-panels>
              <v-expansion-panel
              >
                <v-expansion-panel-header>Options</v-expansion-panel-header>
                <v-expansion-panel-content v-if="project.options">
                  <v-row>
                    <v-col :class="{'bg-grin': option.is_x == 1}" class="py-0 option-item" xl="6" v-for="option in JSON.parse(project.options)"
                           :key="option.id">
                        <div class="border d-flex justify-space-between">
                          <div>
                            <p class="mb-2 mt-2">{{option.name}}</p>
                          </div>
                          <v-chip class="ma-2" v-if="option.is_x == 1">
                            <v-icon >mdi-close</v-icon>
                          </v-chip>
                        </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </v-col>
      </v-row>
     
   
      <v-row>
        <v-col>
          <v-timeline :reverse="true" dense>
            <v-timeline-item :color="log.statusColor" :icon="log.icon" v-for="log in project.logs" :key="log.id">
              <v-card class="elevation-6">
                <v-card-title class="headline">{{log.statusText}} <span class="text-red ml-3" v-if="log.isRE">RE</span></v-card-title>
                <v-card-text>
                  <p class="log-date">{{moment(log.created_at, 'DD.MM.YYYY HH:mm')}}</p>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
    </v-flex>
    <v-dialog max-width="900" v-model="projectImagesDialog">
      <v-card
        elevation="24"
        max-width="900"
        class="mx-auto"
      >
        <v-system-bar lights-out  v-if="projectImagesList.length"></v-system-bar>
        <v-carousel
          v-if="projectImagesList.length"
          hide-delimiter-background
          delimiter-icon="mdi-minus"
          height="350"
        >
          <v-carousel-item
            v-for="(image, i) in projectImagesList"
            :key="i"
            :src="image.path"
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
          </v-carousel-item>
        </v-carousel>
        <v-card
          v-if="projectNotesList.length"
        >
        <v-list-item>Notes:</v-list-item>
        <v-list-item two-line
           v-for="(note, i) in projectNotesList"
           :key="i"
        >
          <v-list-item-content>
            <v-list-item-subtitle>{{note}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        </v-card>
        <v-card v-if="!projectImagesList.length && !projectNotesList.length">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle>This project don't have images or notes</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-card>
    </v-dialog>
    
    <v-dialog fullscreen v-model="projectDialog" persistent>
      <v-card class="pa-6">
        <v-form ref="dialogForm" id="dialogForm" v-model="dialogForm" >
          <v-textarea label="Note" name="notes" :rules="notesRules" :value="dialogForm.note"></v-textarea>
          <vue-signature v-if="project_type === 'ready'" ref="signature" class="signature" :sigOption="option" :w="'100%'" :h="'68vh'" ></vue-signature>
          <v-btn class="mt-2" v-if="project_type === 'ready'" color="green" @click="undoSignature">Undo</v-btn>
          <v-btn class="mt-2" v-if="project_type === 'ready'" color="green" @click="clearSignature">Clear</v-btn>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="projectDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="saveNote">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import moment from "moment"
    import VueSignature from "vue-signature"

    export default {
      components:{
        VueSignature
      },
      middleware: 'authenticated',
      computed: {
            ...mapState({
                checklists: state => state.checklist.checklists,
                project: state => state.projects.project,
                user: state => state.auth.user,
            })
        },
        data() {
            return {
              option:{
                penColor:"rgb(0, 0, 0)",
                backgroundColor:"rgb(255,255,255)"
              },
              valid: true,
              dialogFormValid: true,
              projectDialog: false,
              notesRules: [
                v => !!v || 'Notes is required',
              ],
              filesRules: [
                v => !!v || 'Files is required',
              ],
              form_data: {},
              project_type: '',
              dialogForm: {},
              checklistNotForm: {},
              projectImagesList: [],
              projectNotesList: [],
              checklist_id: 0,
              checked_checklist_id: 0,
              projectImagesDialog: false,
              checklistNotDialog: false
            };
        },
        mounted() {
          this.getProject({id: this.$route.params.id}).then(() => {
            this.$nuxt.$loading.finish();
            if (this.project.status_id  === 4){
              this.getChecklist({id: this.$route.params.id}).then().catch((error) => {
                this.$nuxt.$loading.finish();
                let message = error.response.data.message;
                this.$toast.error(message).goAway(1500);
              });
            }
          }).catch((error) => {
            this.$nuxt.$loading.finish();
            let message = error.response.data.message;
            this.$toast.error(message).goAway(1500);
          });
        
        },
        methods: {
            ...mapActions('projects', ['getProject', 'changeProjectStatusToWorking', 'readyForMontage', 'changeProjectStatusReadyToMontage', 'changeProjectStatus', 'update', 'deleteProjectFile']),
            showImages() {

              this.$axios.get('/project/' + this.project.id +'/images').then(res => {
                this.projectImagesList = res.data.data.images;
                this.projectNotesList = res.data.data.notes;
                this.projectImagesDialog = true;
              })
            },
            openProjectDialog(type) {
              this.project_type = type;
              this.projectDialog = true;
            },
            downloadAll() {
              this.$axios.get('/project/' + this.project.id +'/downloadAll').then(res => {
                window.open(res.data.data);
              })
            },
            deleteFile (id) {
              this.deleteProjectFile({id: id}).then(res => {
                this.$toast.success('File Deleted successfully!').goAway(1500);
              }).catch(error => {
                let message = error.response.data.message;
                this.$toast.error(message).goAway(1500);
              })
            },
            saveNote() {
              if(this.$refs.dialogForm.validate()){
                let form = document.getElementById('dialogForm');
                const formData = new FormData(form);
                if(this.project_type == 'ready') {
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
            dataURLtoFile(dataurl, filename) {
              var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
              while(n--){
                u8arr[n] = bstr.charCodeAt(n);
              }
              return new File([u8arr], filename, {type:mime});
            },
            undoSignature(){
              this.$refs.signature.undo();
            },
            clearSignature(){
              this.$refs.signature.clear();
            },
            getColor(status) {
                if (status == "Ready") {
                    return "primary";
                } else if (status == "Disputed") {
                    return "red";
                } else if (status == "New") {
                    return "orange";
                } else {
                    return "default";
                }
            },
            submit() {
              let form = document.getElementById('projectForm');
              let formData = new FormData(form);
              if(this.$refs.form.validate()){
                this.update({id: this.$route.params.id, data: formData}).then(res => {
                  this.$toast.success('Project updated successfully!').goAway(1500);
                  this.$refs.projectFile.value = null;
                }).catch(error => {
                  let message = error.response.data.message;
                  this.$toast.error(message).goAway(1500);
                })
              }
            },
            setStatusWorking(id){
              this.changeProjectStatusToWorking({id: id}).then(res => {
              }).catch(err => {
                let message = err.response.data.message;
                this.$toast.error(message).goAway(1500);
              })
            },
            setStatusReadyToMontage(id){
              this.changeProjectStatusReadyToMontage({id: id}).then(res => {
                this.$router.back();
              }).catch(err => {
                let message = err.response.data.message;
                this.$toast.error(message).goAway(1500);
              })
            },
            moment(value, format) {
              return moment.utc(value).format(format)
            }
        }
    };
</script>

<style>
  .file-content {
    max-height: 65vh;
  }
  .signature {
    border: 2px solid black;
    border-radius: 5px;
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
  .log-date {
    font-size: 18px;
  }
  .text-red {
    color: red;
  }
  .option-item{
    border: 1px solid #88958a;
  }
  .theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
    color: #000!important;
  }
  .bg-grin {
    background-color: rgb(138 224 151);
  }
</style>
