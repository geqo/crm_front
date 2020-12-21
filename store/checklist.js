export const getters = {
  checklist(state) {
    return state.checklist;
  },
  checklists_item(state) {
    return state.checklists_item;
  },
};

export const mutations = {
  set(state, checklists) {
    state.checklists = checklists
  },
  setChecklistsItem(state, checklists_item) {
    state.checklists_item = checklists_item
  },
  addChecklistsItem(state, checklists_item) {
    state.checklists.push(checklists_item)
  },
  editChecklistsItem(state, checklists_item) {
    state.checklists.push(checklists_item)
  },

  removeChecklistsItem(state, id) {
    state.checklists = state.checklists.filter(checklists_item => checklists_item.id != id);
  },

  removeChecklistsItemImage(state, id) {
    state.checklists_item.images = state.checklists_item.images.filter(item => item.id !== id);
  },

  updateChecklistsItem(state, params) {
    state.checklists = state.checklists.map(checklists_item => {
      if (checklists_item.id == params.id) {
        return params.data
      }
      return checklists_item
    });
  },

  changeStatus(state, data) {
    state.checklists = state.checklists.map(checklists_item => {
      if (checklists_item.id == data.id) {
        checklists_item.status = data.status;
        return checklists_item
      }
      return checklists_item
    });
    console.log(state.checklists);
  },
};

export const actions = {
  async getChecklist({commit}, params) {
    return this.$axios.get('project/' +params.id+  '/checklist').then(res => {
      commit('set', res.data.checklists)
    })
  },
  async getChecklistItem({commit}, params) {
    return this.$axios.get('/checklist/' + params.id).then(res => {
      commit('setChecklistsItem', res.data.data)
    })
  },
  async addChecklistsItem({commit}, params) {
    return this.$axios.post('checklist', params).then(res => {
      commit('addChecklistsItem', res.data.checklist)
    })
  },
  async editChecklistsItem({commit}, params) {
    return this.$axios.put('checklist/' + params.id, params.data).then(res => {
      commit('editChecklistsItem', params.id, res.data.data)
    })
  },

  async deleteChecklistImage({commit}, params) {
    return this.$axios.post('checklistImage/'+ params.id + '/delete').then(res => {
      commit('removeChecklistsItemImage', params.id)
    })
  },

  async changeStatus({commit}, params) {
    return this.$axios.get('checklist/'+ params.id + '/change-status/' + params.status).then(res => {
      commit('changeStatus', { id: params.id , status: params.status})
    })
  },

  async deleteChecklistsItem({commit}, params) {
    return this.$axios.delete('checklist/' + params.id).then(res => {
      commit('removeChecklistsItem', params.id)
    })
  },

  async addFileChecklistsItem({commit}, params) {
    return this.$axios.post('/checklist/'+params.id+'/add-file', params.data).then(res => {
    })
  },

  async addNoteChecklistsItem({commit}, params) {
    return this.$axios.post('/checklist/'+params.id+'/add-note', params.data).then(res => {
      commit('updateChecklistsItem', {id: params.id, data: res.data.data})
    })
  },

  async changeCheckboxStatus({commit}, params) {
    commit('changeStatus', { id: params.id , status: params.status})
  },

};

export const state = () => ({
  checklists: [],
  checklists_item: {}
});
