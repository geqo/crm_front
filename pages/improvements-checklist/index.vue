<template>
  <v-layout>
    <v-flex>
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
          <v-list-item :to="`/improvements-checklist/${project.id}`">
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
    name: "checklist",
    computed: {
      ...mapState({
        projects: state => state.projects.projects,
      }),
    },
    mounted() {
      this.getProjectsList()
    },
    methods: {
      ...mapActions('projects', ['getProjects']),
      getProjectsList() {
        this.getProjects(this.filter).then(() => {
        }).catch((error) => {
          let message = error.response.data.message;
          this.$toast.error(message);
        });
      }
    }
  }
</script>
