<style lang="less" scoped>
.zyck-info {
    position: relative;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
    .zyck-zt-link {
        position: absolute;
        top: 2px;
        right: 0;
        font-size: 16px;
    }
}
.zyck-tab {
    background: #f5f5f5;
    font-size: 16px;
    margin-bottom: 20px;
    ul {
        margin: 0;
    }
    li {
        float: left;
        width: 50%;
        box-sizing: border-box;
        list-style: none;
        text-align: center;
        a {
            display: block;
            height: 50px;
            line-height: 50px;
            border: 1px solid #e8e8e8;
            color: #333;
            &.router-link-active {
                border: 1px solid #45bb93;
                color: #45bb93;
            }
        }
    }
}
.zyck-info—fs {
    margin-left: 10px;
}
.zyck-info-tip {
    color: #999; font-size: 16px;padding: 0;
    &:hover {
        color: #45BB93;
    }
}
.zyck-info-pc {
   margin-left: 30px; 
   margin-right: 10px;
}
</style>
<template>
    <div>
        <div class="zyck-info">
            你的高考信息：<span class="zyck-info—kl">{{kl}}</span>
            <template v-if="fs!=''">
                {{fs}}分 <Button type="text" icon="edit" title="修改成绩" style="color: #2689E6;font-size: 16px;padding: 0;"  @click="resetCj('0')"></Button></span>
            </template>
            <template v-else>
                <span class="zyck-info—fs">{{wc}}位 <Button type="text" icon="edit" title="修改成绩" style="color: #2689E6;font-size: 16px;padding: 0;"  @click="resetCj('1')"></Button></span>
            </template>
            <span class="zyck-info-pc">{{pc}}</span>
            <Button type="ghost" size="small" style="color: #2689E6;border-color: #2689E6" @click="resetPc">重选批次</Button>
            <a class="zyck-zt-link" href="/gkzt/tbzyzn2018" target="_blank">【专题】 2018年志愿填报指南</a>
        </div>
        <div class="zyck-tab clearfix">
            <ul>
                <li><router-link to="/tzy/yxfirst">院校优先</router-link></li>
                <li><router-link to="/tzy/zyfirst">专业优先</router-link></li>
            </ul>
        </div>
        <template v-if="bkpcShow">
            <bkpc :modalClosable="true" :editPc="true" @closebkpc="closebkpc" @on-updata="updataPcModal"></bkpc>
        </template>
        <keep-alive>
            <router-view v-wechat-title="$route.meta.title" ref="childView"></router-view>
        </keep-alive>
        <Modal v-model="cjMoadl" title="修改成绩">
            <div class="zyck-tips-modal-small">
                <template v-if="!sffb">
                    <span v-html="cjtitle"></span>
                </template>
                <template v-else>
                    <span class="strong">{{ssmc}}</span> 的高考成绩已于 <span class="strong">{{cjfbsj}}</span> 公布，你的成绩修改确认后不可更改。
                </template>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <RadioGroup v-model="cjlx" size="large" v-if="cjlist.length!=0" @on-change = "changeCjlx">
                    <template v-for="item in cjlist">
                        <Radio :label="item.key">{{item.lxmc}}</Radio>
                    </template>
                </RadioGroup>
                <Input v-model="cjvalue" :disabled="diableInput" :placeholder="placeholder" style="width: 300px"></Input>
            </div>
            <div slot="footer">
                <Button type="text"  @click="cjMoadl = false">取消</Button>
                <Button type="primary" @click="saveCj">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { updatacj, savecj, getzhiyexist, delzhiydoc } from '../../api/axios'
import bkpc from '../bkmsg/bkpc'
export default {
    name: 'tzy',
    data() {
        return {
            cjMoadl: false,
            bkpcShow: false,
            cjtitle: '',
            sffb: false,
            diableInput:false,
            ssmc: '',
            gknf: '',
            cjfbsj: '',
            cjlx: '',
            cjvalue: '',
            cjlist: [],
            placeholder: ''
        }
    },
    components: {
        bkpc
    },
    computed: {
        cknf () {
            return this.$store.state.ss.cknf;
        },
        kl () {
            return this.$store.state.gkkl;
        },
        fs () {
            return this.$store.state.gkfs;
        },
        wc () {
            return this.$store.state.gkwc;
        },
        pc () {
            return this.$store.state.pcmc;
        },
        yxgs () {
            return this.$store.state.userMsg.lxyx.length;
        }
    },
    methods: {
        changeCjlx (value) {
            this.cjlist.forEach((item,index) => {
                if(item.key == value) {
                    this.diableInput = item.disable;
                    this.cjvalue = this.cjlist[index].value;
                    this.placeholder = '请输入'+ this.cjlist[index].lxmc;
                }
            });
        },
        saveCj () {
            savecj({ cjvalue: this.cjvalue, cjlx: this.cjlx }).then(({data})=>{
                if(data.flag) {
                    this.cjMoadl = false;
                    this.$store.commit('changeCjxx', data.msg);
                    this.$store.commit('changeRload', true);
                    this.$refs.childView.buildList(true);
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err=> {});
        },
        resetCj (type) {
            this.confirm(this.updatacj);
            this.$nextTick().then(()=>{
                this.cjlx = type;
            });
        },
        resetPc () {
            this.confirm(this.updataPc);
        },
        updataPc () {
            this.bkpcShow = true;
        },
        confirm (fn) {
            getzhiyexist().then(({data})=>{
                if(data.flag) {
                    if(data.msg) {
                        this.$Modal.confirm({
                            title: '提示',
                            render: (h) => {
                                return h('div', [
                                    h('Icon',{
                                        style: {
                                            marginTop: '15px',
                                            marginRight: '18px',
                                            verticalAlign:'-8px'
                                        },
                                        props:{
                                            type:'android-alert',
                                            color:'#f26317',
                                            size:36
                                        }
                                    }),
                                    h('span','你有未生成的志愿报告，点击确定后将删除，是否继续？'),
                                ])
                            },
                            onOk: () => {
                                delzhiydoc().then(({data})=>{
                                    if(data.flag) {
                                        this.$store.dispatch('getZylist');
                                        fn();
                                    } else {
                                        this.$Message.error(data.msg);
                                    }
                                }).catch(err=> {});
                            }
                        });
                    } else {
                        fn();
                    }
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err=> {});
        },
        updatacj () {
            updatacj().then(({data})=>{
                if(data.flag) {
                    if (data.msg.total!='') {
                        this.cjMoadl = true;
                        this.cjlist = data.msg.cjlist;
                        this.cjtitle = '每天最多可修改 <span class="strong">'+data.msg.total+'</span> 次，目前剩余 <span class="strong">'+data.msg.last+'</span> 次';
                        this.cjvalue = data.msg.cjlist[0].value;
                        this.cjlx = data.msg.cjlist[0].key;
                        this.diableInput = data.msg.cjlist[0].disable;
                        this.placeholder = '请输入'+ this.cjlist[0].lxmc;
                        this.sffb = data.msg.sffb;
                        this.ssmc = data.msg.ssmc;
                        this.gknf = data.msg.gknf;
                        this.cjfbsj = data.msg.cjfbsj;
                    } else {
                        this.$Message.error('系统异常，请稍后重试！');
                    }
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err => {});
        },
        updataPcModal () {
            this.bkpcShow = false;
            this.$refs.childView.getZytj();
            this.$refs.childView.resetData();
        },
        closebkpc () {
            this.bkpcShow = false;
        }
    }
}
</script>

