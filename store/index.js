export const getters = {
  authenticated(state) {

    return state.auth.loggedIn
  },

  user(state) {
    return state.auth.user
  },

  isAdmin(state) {
    return state.auth.user.role_id === 1
  },

  isStorekeeper(state) {
    return state.auth.user.role_id === 2
  },

  isManager(state) {
    return state.auth.user.role_id === 3
  },

  isForeman(state) {
    return state.auth.user.role_id === 4
  },

  isObinspector(state) {
    return state.auth.user.role_id === 5
  },

  userRole(state) {
      return state.auth.user.role_id
  },
};

export const state = () => ({
  loggedIn: false,
  user: {
    role_id: 0
  },
});
