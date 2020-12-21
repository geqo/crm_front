export const getters = {
  foreman_list(state) {
    return state.foreman_list;
  },
  brigades_list(state) {
    return state.brigades_list;
  },
  foreman(state) {
    return state.foreman;
  },
};

export const mutations = {
  setForemanList(state, foreman_list) {
    state.foreman_list = foreman_list
  },
  setBrigadesList(state, brigades_list) {
    state.brigades_list = brigades_list
  },
  setForeman(state, foreman) {
    state.foreman = foreman
  },
  addForeman(state, foreman) {
    state.foreman_list.push(foreman)
  },
  addWorkers(state, worker) {
    state.foreman.workers.push(worker)
  },
  removeBrigades(state, id) {
    state.brigades_list = state.brigades_list.filter(brigade => brigade.id != id);
  },
  removeWorker(state, params) {
    state.foreman.workers.splice(params.index, 1)
  },
};

export const actions = {
  async getForemans({commit}) {
    return this.$axios.get('foremans').then(res => {
      commit('setForemanList', res.data.data)
    })
  },
  async getBrigade({commit}) {
    return this.$axios.get('brigades').then(res => {
      commit('setBrigadesList', res.data.data)
    })
  },
  async getForeman({commit}, params) {
    return this.$axios.get('foremans/' + params.id).then(res => {
      commit('setForeman', res.data.data)
    })
  },
  async addForeman({commit}, params) {
    return this.$axios.post('foremans', params).then(res => {
      commit('addForeman', res.data.data)
    })
  },
  async editForeman({commit}, params) {
    return this.$axios.post('foremans/' + params.id, params.data).then(res => {
    })
  },
  async deleteBrigad({commit}, params) {
    return this.$axios.delete('foremans/' + params.id).then(res => {
      commit('removeBrigades', params.id)
    })
  },
  deleteBrigadeWorkers({commit}, params) {
    return this.$axios.delete('brigadeWorkers/' + params.id).then(res => {
      commit('removeWorker', params)
    })
  },
};

export const state = () => ({
  foreman_list: [],
  brigades_list: [],
  foreman: [],
});
