import { getInfo, getZylist } from '../api/axios.js';
export default {
    // 获取用户所有信息
    getAllInfo: ({ commit, state}) => {
        return getInfo().then( ({data}) => { 
            commit('setALLInfo', data);
        }).catch(err => {})
    },
    getZylist: ({ commit, state }) => {
        getZylist().then(({ data }) => { 
            commit('setZylist', { zylist: data.msg.zylist, zhiyid: data.msg.zhiyid });
        }).catch(err => { })
    }
}