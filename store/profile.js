export const getters = {
  profiles(state) {
    return state.profiles
  }
};

export const mutations = {
  setProfiles(state, profiles) {
    state.profiles = profiles
  },
  setProfile(state, profile) {
    state.profile = profile
  },
  removeProfile(state, id) {
    state.profiles = state.profiles.filter(profile => profile.id != id);
  },
  addNewProfile(state, profile) {
    state.profiles.push(profile)
  },
};

export const actions = {
  getProfile({commit}, params) {
    return this.$axios.get('users/' + params.id).then(res => {
      commit('setProfile', res.data.data)
    })
  },
  getProfiles({commit}, params) {
    return this.$axios.get('users').then(res => {
      commit('setProfiles', res.data.data)
    })
  },
  addProfile({commit}, params) {
    return this.$axios.post('users', params).then(res => {
      commit('addNewProfile', res.data.data)
    })
  },
  editProfile({commit}, params) {
    return this.$axios.put('users/'+params.id, params.data);
  },
  deleteProfile({commit}, params) {
    return this.$axios.delete('users/'+params.id).then(res => {
      commit('removeProfile', params.id)
    })
  },
};

export const state = () => ({
  profiles: [],
  profile: {}
});
