import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';

const routes = [
    {
        path: '/',
        meta: {
            title: '高考填报志愿综合参考系统'
        },
        name: 'index',
        redirect: {
            name: 'yxfirst'
        }
    },
    {
        path: '/buy',
        meta: {
            title: '开通会员_高考填报志愿综合参考系统'
        },
        name: 'buy',
        beforeEnter: (to, from, next) => {

            if(!store.state.isMember){ next();}
            else{
                next({name:"index"})
            }
    
        },
        component: (resolve) => require(['../views/buy/index'], resolve)
    },
    {
        path: '/bkmsg/yhxx',
        meta: {
            title: '报考信息_高考填报志愿综合参考系统',
        },
        name: 'yhxx',
        beforeEnter: (to, from, next) => {
            if(!store.state.step.completeOne){ next();}
            else{
                next({name:"index"})
            }
        
        },
        component: (resolve) => require(['../views/bkmsg/yhxx'], resolve)
    },
    {
        path: '/bkmsg/bkpc',
        meta: {
            title: '报考批次_高考填报志愿综合参考系统'
        },
        name: 'bkpc',
        beforeEnter: (to, from, next) => {
            if(!store.state.step.finish){ next();}
            else{
                next({name:"index"})
            }
        
        },
        component: (resolve) => require(['../views/bkmsg/bkpc'], resolve)
    },
    {
        path: '/tzy',
        meta: {
            title: '添加志愿_高考填报志愿综合参考系统'
        },
        component: (resolve) => require(['../views/tzy'], resolve),
        children: [
            {
                path: '',
                meta: {
                    title: '院校优先_高考填报志愿综合参考系统'
                },
                component: (resolve) => require(['../views/tzy/yxfirst/list'], resolve)
            },
            {
                path: 'yxfirst',
                meta: {
                    title: '院校优先_高考填报志愿综合参考系统',
                    activename: 'yxlist'
                },
                name: 'yxfirst',
                component: (resolve) => require(['../views/tzy/yxfirst/list'], resolve)
            },
            {
                path: 'zyfirst',
                meta: {
                    title: '专业优先_高考填报志愿综合参考系统',
                    activename: 'zylist'
                },
                name: 'zyfirst',
                component: (resolve) => require(['../views/tzy/zyfirst/list'], resolve)
            }
        ]
    },
    {
        path: '/zhylist',
        meta: {
            title: '我的志愿表_高考填报志愿综合参考系统',
            activename: 'zhylist'
        },
        name: 'zhylist',
        component: (resolve) => require(['../views/zhylist/list'], resolve)
    },
    {
        path: '/zhydetail/:id',
        meta: {
            title: '我的志愿表_高考填报志愿综合参考系统',
            activename: 'zhylist'
        },
        name: 'zhydetail',
        component: (resolve) => require(['../views/zhylist/detail'], resolve)
    },
    {
        path: '/usermsg',
        meta: {
            title: '会员信息_高考填报志愿综合参考系统',
            activename: 'user'
        },
        name: 'usermsg',
        component: (resolve) => require(['../views/usermsg'], resolve)
    },
    {
        path: '/cpresult',
        meta: {
            title: '专业心理测评_高考填报志愿综合参考系统',
            activename: 'cp'
        },
        name: 'cpresult',
        component: (resolve) => require(['../views/cpresult'], resolve)
    },
    {
        path: '/error',
        meta: {
            title: '错误_高考填报志愿综合参考系统',
            activename: 'error'
        },
        name: 'error',
        component: (resolve) => require(['../views/error'], resolve)
    }
]
Vue.use(Router)
export default new Router({
    base: '/zyck/stu/', //使用正确的路由配置
    mode: 'history',
    routes: routes
})