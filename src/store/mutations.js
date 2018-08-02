export default {
    setALLInfo (states, data) {
        if(data.flag){
            states.isMember = data.msg.finishBuy;
            states.userName = data.msg.xm;
            states.step = {
                completeOne: data.msg.finishJBXX,
                finish: data.msg.finishPCXX
            };
            states.userMsg.xb = data.msg.xb;
            states.ss = data.msg.ss;
            states.userMsg.kl = data.msg.kl;
            states.gknf = data.msg.gknf;
            states.userMsg.viptime = data.msg.viptime;
            states.userMsg.lxzy = data.msg.lxzy;
            states.userMsg.lxyx = data.msg.lxyx;
            states.userMsg.gkcj = data.msg.gkcj;
            states.cpResult = data.msg.finishCp;
            states.gkfs = data.msg.gkfs;
            states.gkwc = data.msg.gkwc;
            states.pcmc = data.msg.pcmc;
            states.gkkl = data.msg.gkkl;
            states.kskm = data.msg.kskm;
        } else {
            states.occurError = true; //服务器已发生了错误
        }
    },
    setOccurError (states, data) {
          states.occurError = data;
    },
    setInfoFetched (states, data) {
          states.infoFetched = data;
    },
    setLxyx (states, data) {
        states.userMsg.lxyx = data.msg.lxyx;
    },
    setLxzy (states, data) {
        states.userMsg.lxzy = data.msg.lxzy;
    },
    setZylist(states, { zylist, zhiyid }) { //设置志愿列表，志愿id
        states.zyList = zylist;
        states.zhiyid = zhiyid;
        states.zyListFinshed = true;
    },
    resetZylist(states) { //设置志愿列表，志愿id
        states.zyList = [];
        states.zhiyid = '';
        states.zyListFinshed = false;
    },
    changeloginTime(states, data){
        states.loginTimeOut = data;
    },
    changeLoading(states, data) {
        // 登录超时，不再出现loading
        if(!!!states.loginTimeOut){
            states.loading = data;
        }
    },
    changeCjxx(states, data) {
        states.gkfs = data.gkfs;
        states.gkwc = data.gkwc;
    },
    changeRload(states, data) {
        states.zyListReload = data;
    }
}