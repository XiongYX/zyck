import axios from 'axios'
import store from '../store';
import iView from 'iview';
import qs from 'qs'

// const ajaxUrl = 'http://rap2api.taobao.org/app/mock/12739/';//后台测试路径：'//gaokao.chdi.com.cn/zyck/api/'
//  全局配置项

axios.defaults.baseURL = process.env.API;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


// 获取主信息
let fetchInfo = axios.create({
    header: { 'Content-Type': 'application/json', 'Cache-Control' : 'no-cache' },
    timeout: 20000,
    withCredentials: true,
    // maxRedirects: 0,
    paramsSerializer: function(params){
        return qs.stringify(params,{encodeValuesOnly: true, arrayFormat: 'repeat'})
    },

    transformRequest: [function (data) {
        return qs.stringify(data,{encodeValuesOnly: true, arrayFormat: 'repeat'});
    }]

});

//  通用ajax请求
let fetch = axios.create({
    header: { 'Content-Type': 'application/json', 'Cache-Control' : 'no-cache' },
    timeout: 20000,
    withCredentials: true,
    // maxRedirects: 0,
    paramsSerializer: function(params){
        // 增加数组与对象化处理
        // zy=1111&zy=2222&zy=3333
        return qs.stringify(params,{encodeValuesOnly: true, arrayFormat: 'repeat'})
    },

    transformRequest: [function (data) {
        return qs.stringify(data,{encodeValuesOnly: true, arrayFormat: 'repeat'});
        // document.getElementById('zyck-loading').display = "block"; 
    }]

});

// 全局设置返回值得拦截器
fetch.interceptors.request.use(function (config){
    // 解决ie下的请求缓存问题
    if('get'=== config.method){
        if (config.params) {
            Object.assign(config.params, { '_t': new Date().valueOf()})
        } else {
            config.params = { _t: new Date().valueOf() }
        }
    }
    return config;
},function (error) {
    return Promise.reject(error);
});

// 全局设置返回值得拦截器
fetch.interceptors.response.use(function (response){
    // 同域下的302跳转
    if(!!!(response.data)){
       store.commit('changeloginTime',true);
    }
    return response;
},function (error) {
    store.commit('changeLoading',false);

   if(error.response && error.response.status){
        //同域下发生异常：40x、 50x 
        iView.Modal.error({'title':'提示', 'content': "服务异常，请稍后重试", 'closable':true});
        // iView.Message.error("服务异常，请稍后重试");
   }
   else if(error.code==='ECONNABORTED' && error.message.indexOf('timeout')!=-1){
    // 请求超时 timeout： ECONNABORTED
        iView.Modal.error({'title':'提示', 'content': "请求超时，请稍后重试", 'closable':true});
        // iView.Message.error("请求超时，请稍后重试");
        // console.log("请求超时...")
    }
   else{
    // 发生跨域302跳转
    store.commit('changeloginTime',true);
   }
   
    return Promise.reject(error); 
    
})

// 主入口，获取信息时单独处理 
 fetchInfo.interceptors.response.use(function (response){
    store.commit('setInfoFetched',true);
    // 同域下的302跳转
    if(!!!(response.data)){
       store.commit('changeloginTime',true);
    }
    return response;
},function (error) {
    // 已请求完成
    store.commit('setInfoFetched',true);
    store.commit('changeLoading',false);
   if(error.response && error.response.status){
        //同域下发生异常：40x、 50x 
        store.commit('setOccurError',true);
   }
   else if(error.code==='ECONNABORTED' && error.message.indexOf('timeout')!=-1){
    // 请求超时 timeout： ECONNABORTED
         store.commit('setOccurError',true);
        // console.log("请求超时...")
    }
   else{
    // 发生跨域302跳转
    store.commit('changeloginTime',true);
   }
   
    return Promise.reject(error); 
    
})




export function getInfo() { //获取用户全部信息
    return fetchInfo({
            url: 'ksxx/info',
            method: 'get'
        });
}

export function PayForMember(postData) { // 获取购买信息 
    return fetch({
        url: 'member/pay',
        method: 'post',
        data: postData
    });
}
export function agreedPolicy() { // 用户同意使用协议
    return fetch({
        url: 'member/policy',
        method: 'post'
    });
}
export function getMemberPrice() { // 获取购买信息 
    return fetch({
        url: 'member/price',
        method: 'get'
    });
}

export function getZytjQuery(postData) { //获取推介志愿列表 
    return fetch({
        url: 'zytj/query',
        method: 'get',
        params: postData
    });
}
export function getZytjDetail(postData) { //获取推介志愿列表-展开专业
    return fetch({
        url: 'zytj/expandzy',
        method: 'get',
        params: postData
    });
}
export function getZytj() { //获取推介志愿首页-查询条件
    return fetch({
        url: 'zytj',
        method: 'get'
    });
}
export function bcKsxx(postData) { //保存考生信息 
    return fetch({
        url: 'ksxx/bcksxx',
        method: 'post',
        data: postData
    });
}
export function getTjpc() { //获得推荐批次
    return fetch({
        url: 'ksxx/gettjpc',
        method: 'get'
    });
}
export function pcxz(postData) { //选择批次开始填写
    return fetch({
        url: 'ksxx/pcxz',
        method: 'post',
        data:postData
    });
}
export function cxYxmc(getData) { //模糊查询院校名称字段
    return fetch({
        url: 'ksxx/cxyxmc',
        method: 'get',
        params: getData
    });
}
export function bcYxgx(postData) { //保存意向高校
    return fetch({
        url: 'ksxx/bcyxgx',
        method: 'post',
        data: postData
    });
}
export function getZylist() { //获取志愿列表
    return fetch({
        url: 'zytj/expandzhiy',
        method: 'get',
    });
}
export function bcStep() { //保存状态
    return fetch({
        url: 'ksxx/bcsxyxgx',
        method: 'post'
    });
}
export function xzYxzy() { //获取门类数据
    return fetch({
        url: 'ksxx/xzyxzy',
        method: 'get'
    });
}
export function getZykm(postData) { //通过专业门类获取专业科目
    return fetch({
        url: 'ksxx/getzykm',
        method: 'get',
        params: postData
    });
}
export function getZy(postData) { //通过专业科类获取专业信息
    return fetch({
        url: 'ksxx/getzy',
        method: 'get',
        params: postData
    });
}
export function bcYxzy(postData) { //保存意向专业
    return fetch({
        url: 'ksxx/bcyxzy',
        method: 'post',
        data: postData
    });
}
export function getCpresult() { //获取测评结果
    return fetch({
        url: 'cp/getcpresult',
        method: 'get'
    });
}
export function bcXzzy(postData) { //保存测评结果选中专业
    return fetch({
        url: 'cp/bcxzzy',
        method: 'post',
        data: postData
    });
}
export function postZhiy(postData) { //保存志愿
    return fetch({
        url: 'zytj/savezhiy',
        method: 'post',
        data: postData
    }); 
}
export function delzhiy(postData) { //删除志愿
    return fetch({
        url: 'zytj/delzhiy',
        method: 'post',
        data: postData
    });
}
export function savezhiylist(postData) { //保存志愿表
    return fetch({
        url: 'zytj/generatezhiy',
        method: 'post',
        data: postData
    });
}
export function getzhiylist() { //我的志愿表
    return fetch({
        url: 'zytj/zhiylist',
        method: 'get'
    });
}
export function getzhiydetail(postData) { //我的志愿表-详细
    return fetch({
        url: 'zytj/zhiydetail',
        method: 'get',
        params: postData
    });
}
export function delZybg(postData) { //删除志愿报告
    return fetch({
        url: 'zytj/delzybg',
        method: 'post',
        data: postData
    });
}
export function updatacj() { //修改成绩
    return fetch({
        url: 'ksxx/xgcj',
        method: 'get'
    });
}
export function savecj(postData) { //保存成绩
    return fetch({
        url: 'ksxx/bccj',
        method: 'post',
        data: postData
    });
}
export function getyxmyd(postData) { //院校满意度
    return fetch({
        url: 'zytj/yxmyd',
        method: 'get',
        params: postData
    });
}
export function getzymyd(postData) { //专业满意度
    return fetch({
        url: 'zytj/yxzymyd',
        method: 'get',
        params: postData
    });
}
export function getzhiyexist(postData) { //志愿报告是否存在
    return fetch({
        url: 'zytj/wwczybgexist',
        method: 'get',
        params: postData
    });
}
export function delzhiydoc(postData) { //删除未完成志愿报告
    return fetch({
        url: 'zytj/delwwc',
        method: 'post',
        data:postData
    });
}