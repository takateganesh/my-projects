import { getField, updateField } from 'vuex-map-fields';

export const layout = {
  namespaced: true,
  state: {
    sidebarClose: false,
    sidebarStatic: false,
    sidebarActiveElement: null,
    showUserAccount: false,
    breadcrum: "Dashboard",
    windowSize: {
      width: 0,
      height: 0
    },
    widgets: {}
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    toggleSidebar(state) {
      state.sidebarClose = !state.sidebarClose;
    },
    toggleUserAccount(state) {
      state.showUserAccount = !state.showUserAccount;
    },
    switchSidebar(state, value) {
      if (value) {
        state.sidebarClose = value;
      } else {
        state.sidebarClose = !state.sidebarClose;
      }
    },
    setSidebarState(state, value) {
      state.sedebarClose = value;
    },
    handleSwipe(state, e) {
      if (e.direction === 4) {
        state.sidebarClose = false;
      }
      if (e.direction === 2 && !state.sidebarClose) {
        state.sidebarClose = true;
        return;
      }
    },
    changeSidebarActive(state, index) {
      state.sidebarActiveElement = index;
    },
    setBreadCrum(state, breadcrum) {
      state.breadcrum = breadcrum;
    },
    updateWindowSize(state, window) {
      state.windowSize.width = window.innerWidth;
      state.windowSize.height = window.innerHeight;
    }
  },

  actions: {
    toggleSidebar({ commit }) {
      commit('toggleSidebar');
    },
    switchSidebar({ commit }, value) {
      commit('switchSidebar', value);
    },
    handleSwipe({ commit }, e) {
      commit('handleSwipe', e);
    },
    changeSidebarActive({ commit }, index) {
      commit('changeSidebarActive', index);
    },
    toggleUserAccount({ commit }) {
      commit('toggleUserAccount');
    },
    setBreadCrum({ commit }, breadcrum) {
      commit('setBreadCrum', breadcrum);
    },
    updateWindowSize({ commit }, window) {
      commit('updateWindowSize', window);
    },

  }

}
