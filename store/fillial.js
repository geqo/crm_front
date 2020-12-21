export const getters = {
    fillials(state) {
        return state.fillials;
    },

};

export const mutations = {
    setFillials (state, fillials) {
        state.fillials = fillials
    },
    setFillial(state, fillial) {
        state.fillial = fillial
    },
    removeFillial(state, id) {
        state.fillials = state.fillials.filter(fillial => fillial.id != id);
    },
    addNewFillial(state, profile) {
        state.fillials.push(profile)
    },
};

export const actions = {
    getFillials ({commit}) {
        return this.$axios.get('fillial').then(res => {
            commit('setFillials', res.data.fillials)
        })
    },

    getFillial({commit}, params) {
        return this.$axios.get('fillial/' + params.id).then(res => {
            commit('setFillial', res.data.fillial)
        })
    },
    editFillial({commit}, params) {
        return this.$axios.put('fillial/'+params.id, params.data);
    },
    addFillial({commit}, params) {
        return this.$axios.post('fillial', params).then(res => {
            commit('setFillials', res.data.fillials)
        })
    },
    deleteFillial({commit}, params) {
        return this.$axios.delete('fillial/'+params.id).then(res => {
            commit('removeFillial', params.id)
        })
    },

};

export const state = () => ({
    fillials: [],
    fillial: {},
});
