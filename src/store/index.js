import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

const state = {
    occurError: false, // 是否发生了错误
    infoFetched: false, // 新接口——用户信息是否已获取
    userName: '', //用户名
    userMsg: { //考生性别、所在省市高考科类、vip到期时间、理想专业、理想院校
        xb: "",
        viptime: "",
        lxzy:[],
        lxyx:[]
    }, 
    isMember: false, //会员标志
    ss: { // 生源地
        key: "",
        value: "",
        xgk: false,
        cknf:""
    },
    gkfs: "",// 高考分数（高考成绩）
    gkwc: "",// 高考位次（高考成绩）
    pcmc: "",//用户所选批次
    gkkl: "",// 高考科类：kl --理工、文史、综合改革
    kskm: "",// 考试科目（综合改革时不为空）
    gknf: "2018", // 高考年份
    isloading: false, 
    step: { //判断当前用户步骤
        completeOne: false, //是否完成采集信息
        finish: false //是否用户批次选择
    },
    zyList: [],
    zhiyid: "",
    loading: false,
    loginTimeOut: false, //判断session是否超时
    cpResult: false, //判断是否完成测评
    zyListFinshed: false, //志愿列表是否请求过
    zyListReload:false //判断是否修改过成绩、批次
}

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});

export default store;