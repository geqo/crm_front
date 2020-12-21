export const getters = {
    projects(state) {
        return state.projects;
    },
    project(state) {
      return state.project;
    },
};

export const mutations = {
    set(state, projects) {
        state.projects = projects
    },
    setProject(state, project) {
      state.project = project
    },
    setCalendar(state, calendar) {
      state.calendar = calendar
    },
    addCalendar(state, calendar) {
      state.calendar.push(calendar);
    },
    deleteWebFile(state, id) {
        state.project.web_files = state.project.web_files.filter(item => item.id != id);
    },
};

export const actions = {
    async getProjects({commit}, params) {
        return this.$axios.post('projects', params).then(res => {
          commit('set', res.data.projects)
        })
    },
    async getProject({commit}, params) {
        return this.$axios.post('/project/' + params.id).then(res => {
          commit('setProject', res.data.project);
        });
    },
    async changeProjectStatusToWorking({commit}, params) {
        return this.$axios.post('/project/'+params.id+'/working').then(res => {
          commit('setProject', res.data.project);
        });
    },
    async update({commit}, params) {
        return this.$axios.post('/project/'+params.id+'/update', params.data).then(res => {
            commit('setProject', res.data.data);
        });
    },
    async readyForMontage({commit}, params) {
        return this.$axios.post('/project/'+params.id+'/readyForMontage', params.data).then(res => {
          commit('setProject', res.data.project);
        });
    },

    async deleteProjectFile({commit}, params) {
        return this.$axios.delete('/files/'+params.id).then(res => {
          commit('deleteWebFile', params.id);
        });
    },
    async changeProjectStatusReadyToMontage({commit}, params) {
        return this.$axios.post('/project/'+params.id+'/readyForMontage').then(res => {
          commit('setProject', res.data.project);
        });
    },
    async installMontage({commit}, params) {
        return this.$axios.post('/project/'+params.id+'/montage', params.data);
    },
    async getCalendar({commit}, params) {
        return this.$axios.post('calendar', params).then(res => {
            commit('setCalendar', res.data.data)
        })
    },

    async changeProjectStatus({commit}, params) {
        return this.$axios.post('/project/'+params.id+'/' + params.status, params.data).then(res => {
        })
    },
};

export const state = () => ({
    calendar: [],
    projects: [],
    project: {},
});
