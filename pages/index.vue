<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 class="fullwidth">
      <v-row>
        <v-col sm="12" md="4">
          <v-text-field
              label="Suche"
              outlined
              v-model="filter.search"
              @input="filterProjects()"
              class="mt-3"
          ></v-text-field>
        </v-col>
        <v-col sm="12" md>
          <v-select v-model="filter.fillial" item-text="name" item-value="id" :items="filterData.fillials" @input="filterProjects()" label="Filiale auswählen" placeholder="Choose Fliale" outlined class="mt-3"></v-select>
        </v-col>
        <v-col sm="12" md>
          <v-select v-model="filter.foreman_id" item-text="name" item-value="id" :items="filterData.brigads" @input="filterProjects()" label="Brigade auswählen" placeholder="Choose Brigad" outlined class="mt-3"></v-select>
        </v-col>
        <v-col sm="12" md>
          <v-select v-model="filter.status_id" item-text="name" item-value="id" :items="filterData.statuses" @input="filterProjects()" label="Status auswählen" outlined class="mt-3"></v-select>
        </v-col>

      </v-row>
     
      <v-card class="my-5">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Projekt Nummer</v-list-item-title>
          </v-list-item-content>
          <v-chip class="ma-2" color="secondary">Status</v-chip>
          <v-chip class="ma-2 mr-12" color="secondary">Datum</v-chip>
        </v-list-item>
      </v-card>
      <v-list>
        <v-card class="my-5 elevation-4" v-for="project in projects" :key="project.id">
          <v-list-item :to="`/project/${project.id}`">
            <v-list-item-content>
              <v-list-item-title>#{{project.client_id}}</v-list-item-title>
            </v-list-item-content>
            <v-chip class="ma-2 mr-4" :color="project.statusColor">{{project.statusText}}</v-chip>
            <v-chip class="ma-2" color="secondary">{{project.created_at}}</v-chip>
          </v-list-item>
        </v-card>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        middleware: 'authenticated',
        data() {
            return {
              filterData: {},
              filter: {
                foreman_id: null,
                status_id: null
              },
            }
        },
        computed: {
            ...mapState({
                projects: state => state.projects.projects,
                user: state => state.auth.user,
            }),
        },
        mounted() {
            this.getProjectsList()
            this.getFilterData();
        },
        methods: {
            ...mapActions('projects', ['getProjects']),
            getProjectsList() {
              this.getProjects(this.filter).then(() => {
                this.$nuxt.$loading.finish();
              }).catch((error) => {
                this.$nuxt.$loading.finish();
                let message = error.response.data.message;
                this.$toast.error(message).goAway(1500);
              });
            },
         
            getFilterData() {
              this.$axios.get('projects/getFilterData').then(res => {
                this.filterData = res.data;
                this.filterData.fillials.unshift("");
                this.filterData.brigads.unshift({id: null, name: ''});
                this.filterData.statuses.unshift({id: null, name: ''});
              }).catch(error => {
                console.log(error.response);
              })
            },
          filterProjects(){
              this.getProjectsList();
            },
            getColor(status) {
                if (status == "Working") {
                    return "primary";
                } else if (status == "Errors") {
                    return "red";
                } else if (status == "New") {
                    return "orange";
                } else {
                    return "default";
                }
            }
        }
    };
</script>
