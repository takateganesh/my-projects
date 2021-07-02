import { doFetchList } from '@/services/hub.service'

import { getField, updateField } from 'vuex-map-fields';
import humps from 'lodash-humps';

// import createHumps from 'lodash-humps/lib/createHumps';
// import { snakeCase } from 'lodash';
// const snakes = createHumps(snakeCase)

export const hubList = {
    namespaced: true,
    state: {
        list: [],
        selected: [],
        recordsCount: 0,
        inProgress: false,
        exportedEnv: "",
        error: null
    },
    getters: {
        getField,
    },
    mutations: {
        updateField,
        inProgress(state, yesOrNo) {
            state.inProgress = yesOrNo
        },
        setExportedEnv(state, env) {
            state.exportedEnv = env;
        },
        setList(state, list) {
            state.selected = [];
            for (let i in state.list) {
                state.selected.push(false);
                state.selected[i] = false;
            }
            for (let hub=0; hub<list.length; hub++) {
                if(list[hub].roles && list[hub].roles.length){
                    for(let j=0; j<list[hub].roles.length; j++){
                        let descr = list[hub].roles[j].descriptioni18N;
                        delete list[hub].roles[j].descriptioni18N;
                        list[hub].roles[j].descriptioni18n = descr;
                    }
                }
            }
            state.list = list;

        },
        setListCount(state, number) {
            state.recordsCount = number;
        }
    },
    actions: {
        fetchList: async ({ commit }, { nameLike,pageNumber, limit }) => {
            commit('inProgress', true);
            try {
                let offset = (pageNumber - 1) * limit;
                const response = await doFetchList({nameLike,limit, offset});
               // console.log('app list response:', response);
                if (response.range != null) {
                    let recordsCount = response.range.split("/");
                    commit('setListCount', Number(recordsCount[1]));
                    const list = await response.data;
                    if (list) {
                        commit('setList', humps((list)));
                    } else
                        commit('setList', []);
                    
                    return humps((list));
                }
            }
            finally {
                commit('inProgress', false);
            }
        },
    },

}