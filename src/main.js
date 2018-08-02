// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.  
import Vue from 'vue';
import Layout from './components/layout';
import router from './router';
import iView from 'iview';
import store from './store';
import axios from 'axios';
import filter from './filter';
import VueWechatTitle from 'vue-wechat-title';
import './styles/main.less';
import 'babel-polyfill';

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueWechatTitle);

router.beforeEach((to, from, next) => {

    if(!store.state.infoFetched) {
        store.commit('changeLoading', true);
        store.dispatch('getAllInfo').then(() => {
            store.commit('changeLoading', false);
            // 如果获取了用户信息发生了错误，就转向错误路由
            if(store.state.occurError) {
                router.replace({
                    name: "error"
                });
            } else if(null === to.name) {
                router.replace({
                    name: "yxfirst"
                });
            } else {
                next({
                    path: to.path
                });
            }
        })
        next(false);
    } else {
        // 判断是否能显示yxfirst
        if('yxfirst' === to.name) {
            if(!store.state.isMember) {
                router.replace({
                    name: "buy"
                });
            } else if(!store.state.step.completeOne) {
                router.replace({
                    name: "yhxx"
                });
            } else if(!store.state.step.finish) {
                router.replace({
                    name: "bkpc"
                });
            } else {
                next();
            }
        } else {
            next();
        }
    }

});

router.afterEach((to, from) => {
    gtag('config', 'UA-100524-6', {
        'page_path': to.fullPath
    });
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(Layout)
})
