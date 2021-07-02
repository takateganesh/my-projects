import { doPostOne, doFetchOne, doPatchOne } from '@/services/hub.service'

import { getField, updateField } from 'vuex-map-fields'
import humps from 'lodash-humps'
import createHumps from 'lodash-humps/lib/createHumps'
import { snakeCase, merge } from 'lodash'
const snakes = createHumps(snakeCase)

let languageList = ['en','ro','hi','fr'];

export const hubOne = {
    namespaced: true,
    state: {
        one: {  },
        oneDefault: {
            name: '',
            jwtSecret: '',
            syncUsersUrl: '/oak/rpc/sync_users',
            syncTeamsUrl: '/oak/rpc/sync_teams',
            roles: []
        },
        routeDefault: {
            "slot": "",
            "title": "",
            "url": ""
        },
        languageList: languageList,
        messageLanguage: languageList[0],
        roleObject: { id:"", roleName:"", descriptioni18n: { en:"",ro:"", hi:"", fr:"" } },
        inProgress: true,
    },
    getters: {
        getField,
    },
    mutations: {
        updateField,
        setOne(state, one) {
            if(one.roles && one.roles.length){
                for(let j=0; j<one.roles.length; j++){
                    if(one.roles[j].descriptioni18N){
                        let descr = one.roles[j].descriptioni18N;
                        delete one.roles[j].descriptioni18N;
                        one.roles[j].descriptioni18n = descr;
                    }
                }
            }
            state.one = one;
        },
        inProgress(state, yesOrNo) {
            state.inProgress = yesOrNo
        },
        addRoute(state, route) {
            state.one.routes.push(route);
        },
        editRoute(state, { index, route }) {
            state.one.routes[index] = route;
        },
        resetDefaultRoute(state) {
            state.routeDefault = {
                "slot": "",
                "title": "",
                "url": ""
            };
        },
        saveNewRole(state) {
            if(!state.roleObject.editFlag){
                state.one.roles.push({
                    id : state.roleObject.id,
                    name: state.roleObject.roleName,
                    descriptioni18n : state.roleObject.descriptioni18n              
                });
                
            }else{
                state.one.roles.filter((role)=>{
                    if(state.roleObject.id == role.id){
                        role.id = state.roleObject.id,
                        role.name= state.roleObject.roleName,
                        role.descriptioni18n = state.roleObject.descriptioni18n 
                    }
                    return role;
                });
            }
            state.roleObject = { id:"", roleName:"", descriptioni18n: { en:"",ro:"", hi:"", fr:"" } };            
        },
        deleteRole(state, obj){
            let roles = []
            state.one.roles.filter((role)=>{
                if(obj.id != role.id){
                    roles.push(role); 
                }
            });
            state.one.roles = [];
            state.one.roles = roles;
        },
        editRole(state, obj){
            state.roleObject = {
                id : obj.id,
                roleName : obj.name,
                descriptioni18n : obj.descriptioni18n,
                editFlag : true
            }
        },
        newRole(state){
            state.messageLanguage = languageList[0];
            state.roleObject = { id:"", roleName:"", descriptioni18n: { en:"",ro:"", hi:"", fr:"" } };
        }
    },
    actions: {
        new({ commit, state }) {
            commit('inProgress', false);
            commit('setOne', state.oneDefault);
        },
        saveRole({ commit }) {
            commit('saveNewRole');
        },
        editRole({ commit }, {role}) {
            commit('editRole',role);
        },
        newRole({ commit }) {
            commit('newRole');
        },
        deleteRole({ commit }, {role}) {
            commit('deleteRole',role);
        },
        fetchOne: async ({ state, commit }, {hubName}) => {
            commit('setOne', state.oneDefault);
            commit('inProgress', true);
            try {
                const list = await doFetchOne({hubName});
                if (list) {
                    let a = merge({}, state.oneDefault);
                    commit('setOne', merge(a, humps(list[0])));
                }
            } 
            // eslint-disable-next-line no-useless-catch
            catch (err) {
                throw err;
            }
            finally {
                commit('inProgress', false);
            }
        },

        create: async({ commit, state }) => {
            commit('inProgress', true);
            try {
                const created = await doPostOne({hub:snakes(Object.assign({}, state.one))});
                commit('setOne', humps(created));
            }
            // eslint-disable-next-line no-useless-catch
            catch (err) {
                throw err;
            }
            finally {
                commit('inProgress', false);
            }
        },
        
        update: async({ commit, state }) => {
            commit('inProgress', true);
            try {
                const updated = await doPatchOne({hub:snakes(Object.assign({}, state.one))});
                commit('setOne', humps(updated));
            }
            // eslint-disable-next-line no-useless-catch
            catch (err) {
                throw err;
            }
            finally {
                commit('inProgress', false);
            }
        },

        resetDefaultRoute: async ({ commit }) => {
            commit('resetDefaultRoute');
        }
    },
}