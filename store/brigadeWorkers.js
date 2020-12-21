export const getters = {
  brigade_workers(state) {
    return state.brigade_workers;
  },
};

export const mutations = {
  set(state, brigade_workers) {
    state.brigade_workers = brigade_workers
  },
};

export const actions = {
  getBrigadeWorkers({commit}) {
    return this.$axios.get('brigadeWorkers').then(res => {
      commit('set', res.data.data)
    })
  },

};

export const state = () => ({
  brigade_workers: []
});
