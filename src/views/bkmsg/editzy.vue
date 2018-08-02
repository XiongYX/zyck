<style lang="less" scoped>
.ivu-form-item {
    margin-bottom: 16px;
}
</style>
<template>
    <div :style="!modalClosable?'height:620px;':''">
        <Modal v-model="modaEditzy" width="860" :closable="modalClosable" :mask-closable="false" @on-cancel="closeModal">
            <div class="zyck-modal-con">
                <h2 class="zyck-modal-title">请选择专业</h2>
                <p class="zyck-modal-subtitle">最多10个</p>
                <Form :model="formItem" :label-width="150">
                    <FormItem label="我要自选专业：">
                        <Row>
                            <Col span="6">
                                <select class="zyck-select" v-model="mlIndex" @change="updateMl">
                                    <option value="">请选择专业门类</option>
                                    <template v-for="(option, index) in formItem.ml">
                                        <option :value="index">{{option.value}}</option>
                                    </template>
                                </select>
                            </Col>
                            <Col span="1" style="text-align: center">-</Col>
                            <Col span="6">
                                <select class="zyck-select" v-model="klIndex" @change="updateKl">
                                    <option value="">请选择专业科类</option>
                                    <template v-for="(option, index) in formItem.kl">
                                        <option :value="index">{{option.value}}</option>
                                    </template>
                                </select>
                            </Col>
                            <Col span="1" style="text-align: center">-</Col>
                            <Col span="6">
                                <select class="zyck-select" v-model="zyIndex" @change="updateZy">
                                    <option value="">请选择专业</option>
                                    <template v-for="(option, index) in formItem.zy">
                                        <option :value="index">{{option.value}}</option>
                                    </template>
                                </select>
                            </Col>
                            <Col span="1">&ensp;</Col>
                            <Col span="3">
                                <Button type="primary" style="border-radius: 4px;" @click="addZy">添加</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="从测评结果选：">
                        <template v-if="cpResult">
                            <div class="zyck-edit-cp-con">
                                <ul class="clearfix">
                                    <template v-if="cpresultList.length>0" v-for="(item,index) in cpresultList">
                                        <li @click="toggleZy(item)" :class="{'seach-list-item-checked' : item.lxzy}">{{item.zymc}}</li>
                                    </template>
                                    <template v-else>暂无推荐结果！</template>
                                </ul>
                            </div>
                        </template>
                        <template v-else>
                            <div class="zyck-item-text" style="color: #999;">无测评结果，开始 <a href="/zyck/cp/xqcp.action?from=zyck">专业心理测评</a></div>
                        </template>
                    </FormItem>
                    <FormItem label="已选择专业：" style="border-top: 1px dashed #d5d5d5; padding-top: 16px; margin-bottom: 0;">
                        <template v-if="formItem.choosenZy.length > 0">
                            <template v-for="(item,index) in formItem.choosenZy">
                                <Tag class="zyck-tag" closable @on-close="deleteZy(index)">
                                    {{item.ml.value}}<template v-if="item.kl.value != ''">-{{item.kl.value}}</template><template v-if="item.zy.value != ''">-{{item.zy.value}}</template>
                                </Tag>
                            </template>
                            <div class="form-item-subtext">还可以选 {{10-formItem.choosenZy.length}} 个</div>
                        </template>
                        <template v-else>
                            <div class="zyck-item-text">无</div>
                        </template>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" size="large" style="width: 20%;" :loading="modal_loading" :disabled="disableBtn" :title="disableTitle" @click="goResult">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { setLxzy } from 'vuex';
    import { xzYxzy,getZykm,getZy,bcYxzy,getCpresult } from '../../api/axios.js';
    export default {
        name: 'editZy',
        data () {
            return {
                modaEditzy: true,
                modal_loading: false,
                cpresultList: [],
                zyType:'zx',
                mlIndex:'',
                klIndex:'',
                zyIndex:'',
                formItem: {
                    ml: [],
                    kl: [],
                    zy: [],
                    curMl:{
                        key: '',
                        value: ''
                    },
                    curKl:{
                        key: '',
                        value: ''
                    },
                    curZy:{
                        key: '',
                        value: ''
                    },
                    choosenZy: [],
                    choosenCode: []
                }
            }
        },
        props: {
            modalClosable: {
                type:Boolean,
                default: false
            },
            editZy: {
                type:Boolean,
                default: false
            }
        },
        computed: {
            disableBtn () {
                if ( this.formItem.choosenZy.length <= 10 ) {
                    return false;
                } else {
                    return true;
                }
            },
            disableTitle () {
                if( this.formItem.choosenZy.length > 10 ) {
                    return '最多选择10所专业！';
                }
            },
            cpResult () {
                let cp = this.$store.state.cpResult;
                if(cp) {
                    this.queryList();
                }
                return cp;
            }
        },
        methods: {
            updateMl () {
                let index = this.mlIndex;
                if (index!='' || index=='0') {
                    let option = this.formItem.ml[index];
                    this.formItem.curMl = {key: option.key, value:option.value};
                    //通过专业门类获取专业科目
                    getZykm( {zymldm:option.key} ).then( ( {data} ) => {
                        if (data.flag) {
                            this.formItem.kl = data.msg.zyklList;
                            this.klIndex = '';
                            this.formItem.curKl = {key: '', value:''};
                            this.formItem.zy = [];
                            this.zyIndex = '';
                            this.formItem.curZy = {key: '', value:''};
                        } else {
                            this.$Message.error(data.msg);
                        }
                    }).catch(err => {});
                }
            },
            updateKl () {
                let index = this.klIndex;
                this.formItem.curKl = {key: '', value:''};
                if (index!='' || index=='0') {
                    let option = this.formItem.kl[index];
                    this.formItem.curKl = {key: option.key, value:option.value};
                    //通过专业科类获取专业信息
                    getZy( {zykldm:option.key} ).then( ( {data} ) => {
                        if (data.flag) {
                            this.formItem.zy = data.msg.zyList;
                            this.zyIndex = '';
                            this.formItem.curZy = {key: '', value:''};
                        } else {
                            this.$Message.error(data.msg);
                        }
                    }).catch(err => {});
                }
            },
            updateZy () {
                let index = this.zyIndex;
                this.formItem.curZy = {key: '', value:''};
                if (index!='' || index=='0') {
                    let option = this.formItem.zy[index];
                    this.formItem.curZy = {key: option.key, value:option.value};
                }
            },
            addZy (){
                if (this.formItem.curMl.key != '') {
                    let choosenCode = this.formItem.curMl.key;
                    if (this.formItem.curKl.key != '') {
                        choosenCode = this.formItem.curKl.key;
                        if (this.formItem.curZy.key != '') {
                            choosenCode = this.formItem.curZy.key;
                        }
                    } else {
                        this.$Message.warning('请选择科类！');
                        return
                    }
                    let choosenZy = {
                        ml:this.formItem.curMl,
                        kl:this.formItem.curKl,
                        zy:this.formItem.curZy
                    }
                    if (this.formItem.choosenCode.includes(choosenCode)) {
                        this.$Message.warning('已选择该专业！');
                    } else if (this.formItem.choosenCode.length >=10) {
                        this.$Message.warning('最多可以添加10个专业！');
                    } else {
                        this.formItem.choosenZy.push(choosenZy);
                        this.formItem.choosenCode.push(choosenCode);
                    }
                } else {
                    this.$Message.warning('请选择专业！');
                }
            },
            deleteZy (index) {
                this.formItem.choosenZy.splice(index,1);
                this.formItem.choosenCode.splice(index,1);
                this.cpresultList.forEach((item) => {
                    if(this.formItem.choosenCode.includes(item.zydm)){
                        this.$set(item, 'lxzy', true);
                    } else {
                        this.$set(item, 'lxzy', false);
                    }
                });
            },
            goResult () {
                bcYxzy({ zydms:this.formItem.choosenCode }).then( ( {data} ) => {
                    if (data.flag) {
                        this.$store.commit('setLxzy',data);
                        this.$emit('closezy');
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {})
            },
            closeModal () {
                this.$emit('closezy');
            },
            toggleZy (item) {
                if(this.formItem.choosenCode.includes(item.zydm)){
                    this.$set(item, 'lxzy', false);
                    this.formItem.choosenZy.splice(this.formItem.choosenCode.indexOf(item.zydm),1);
                    this.formItem.choosenCode.splice(this.formItem.choosenCode.indexOf(item.zydm), 1);
                } else {
                    if (this.formItem.choosenCode.length >=10) {
                        this.$Message.warning('最多可以添加10个专业！');
                    } else {
                        let choosenZy = {
                            ml:{
                                key: item.zydm,
                                value: item.zymc
                            },
                            kl:{
                                key: '',
                                value: ''
                            },
                            zy:{
                                key: '',
                                value: ''
                            }
                        }
                        this.$set(item, 'lxzy', true);
                        this.formItem.choosenCode.push(item.zydm);
                        this.formItem.choosenZy.push(choosenZy);
                    }
                }
            },
            queryList () {
                getCpresult().then( ( {data} ) => {
                    if (data.flag) {
                        if (data.msg.finishCp) {
                            this.cpresultList = data.msg.cpresultList;
                            this.cpresultList.forEach((item) => {
                                if(this.formItem.choosenCode.includes(item.zydm)){
                                    this.$set(item, 'lxzy', true);
                                } else {
                                    this.$set(item, 'lxzy', false);
                                }
                            });
                        }
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {});
            }
        },
        created () {
            xzYxzy().then( ( {data} ) => {
                if (data.flag) {
                    this.formItem.ml = data.msg.zymlList;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err => {});
        },
        mounted () {
            this.formItem.choosenZy = [...this.$store.state.userMsg.lxzy];
            this.formItem.choosenZy.forEach((item) => {
                if (item.zy.key!='') {
                    this.formItem.choosenCode.push(item.zy.key);
                }else if (item.kl.key!='') {
                    this.formItem.choosenCode.push(item.kl.key);
                }else {
                    this.formItem.choosenCode.push(item.ml.key);
                }
            });
        }
    }
</script>