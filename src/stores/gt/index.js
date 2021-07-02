import Vue from 'vue';
import Vuex from 'vuex';
import { layout } from '../layout';

import { hubList } from './hub.list'
import { hubOne } from './hub.one'


Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        layout,
        hubList,
        hubOne,
    }
});