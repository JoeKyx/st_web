// store/index.js

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        game: {}
    },
    getters: {},
    mutations: {
        setGame(state, payload) {
            state.game = payload
        }
    },
    actions: {
        setGame(context, payload) {
            context.commit("changeName", payload);
        }

    }
});