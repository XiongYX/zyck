<template>
    <div :style="!modalClosable?'height:620px;':''">
        <Modal v-model="modaEdityx" width="680" :closable="modalClosable" :mask-closable="false" @on-cancel="closeModal">
            <div class="zyck-modal-con">
                <h2 class="zyck-modal-title">请选择院校</h2>
                <p class="zyck-modal-subtitle">最多10个</p>
                <Form :model="formItem" :label-width="100">
                    <FormItem label="院校：">
                        <Input
                            v-model="formItem.school"
                            @on-change="querySchool"
                            @on-focus="showList"
                            @on-blur="delayClose"
                            clearable
                            placeholder="请输入院校名称（最少输入两个字）"
                            style="width: 100%">
                        </Input>
                        <template v-if="showDroplist">
                            <div class="ivu-select-dropdown" style="width: 100%;">
                                <template v-if="formItem.allSchool.length>0">
                                    <ul class="ivu-select-dropdown-list">
                                        <template v-for="item in formItem.allSchool">
                                            <li class="ivu-select-item" @mousedown="addSchool(item.key,item.value)">
                                                {{item.value}}
                                                <template v-if="item.checked">
                                                    <Icon type="checkmark" class="zyck-select-checked-icon"></Icon>
                                                </template>
                                            </li>
                                        </template>
                                    </ul>
                                </template>
                                <template v-else>
                                    <ul class="ivu-select-not-found">
                                        <li>无匹配院校</li>
                                    </ul>
                                </template>
                            </div>
                        </template>
                    </FormItem>
                    <FormItem label="已选择院校：">
                        <template v-if="formItem.choosenSchool.length > 0">
                            <template v-for="(item,index) in formItem.choosenSchool">
                                <Tag class="zyck-tag" closable @on-close="deleteSchool(index)">{{item.value}}</Tag>
                            </template>
                            <div class="form-item-subtext">还可以选 {{10-formItem.choosenSchool.length}} 个</div>
                        </template>
                        <template v-else>
                            <div class="zyck-item-text">无</div>
                        </template>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" size="large" style="width: 20%; margin-right: 20px;" :loading="modal_loading" :disabled="disableBtn" :title="disableTitle" @click="goResult">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { setLxyx } from 'vuex'
    import { cxYxmc,bcYxgx } from '../../api/axios.js';
    export default {
        name: 'editYx',
        data () {
            return {
                modaEdityx: true,
                modal_loading: false,
                showDroplist:false,
                searchloading: false,
                timeOut:true,
                formItem: {
                    school: '',
                    allSchool: [],
                    choosenSchool: [],
                    choosenCode:[]
                }
            }
        },
        props: {
            modalClosable: {
                type:Boolean,
                default: false
            },
            editYx: {
                type:Boolean,
                default: false
            }
        },
        computed: {
            disableBtn () {
                if ( this.formItem.choosenSchool.length <= 10 ) {
                    return false;
                } else {
                    return true;
                }
            },
            disableTitle () {
                if( this.formItem.choosenSchool.length > 10 ) {
                    return '最多选择10所院校！';
                }
            }
            
        },
        methods: {
            isChinese (value) {
                let re = /^[\u4e00-\u9fa5]+$/;
                if (re.test(value)) {
                    return true;
                } else {
                    return false;
                }
            },
            querySchool () {
                if (this.timeOut) {
                    let query = this.formItem.school.trim();
                    if (query.trim().length >= 2 && this.isChinese(query)) {
                        this.timeOut = false;
                        cxYxmc({ yxmc: query }).then( ( {data} ) => {
                            if (data.flag) {
                                this.formItem.allSchool = data.msg.yxList;
                                this.formItem.allSchool.forEach((item) => {
                                    this.$set(item, 'checked', false);
                                    this.setSelected(item);
                                });
                                setTimeout(() => {
                                    this.timeOut = true;
                                },500);
                            } else {
                                setTimeout(() => {
                                    this.timeOut = true;
                                },500);
                                this.$Message.error(data.msg);
                            }
                        }).catch(err => {
                            this.timeOut = true;
                        });
                    } else {
                        this.formItem.allSchool = [];
                    }
                }
            },
            addSchool (key,value){
                if (this.formItem.choosenCode.includes(key)) {
                    this.$Message.warning('已选择该院校！');
                } else if (this.formItem.choosenCode.length >=10) {
                    this.$Message.warning('最多可以添加10所院校！');
                } else {
                    this.formItem.choosenSchool.push({key:key, value:value});
                    this.formItem.choosenCode.push(key);
                    this.formItem.school = '';
                    this.showDroplist = false;
                }
            },
            setSelected (item) {
                if(this.formItem.choosenCode.length>0){
                    this.formItem.choosenCode.forEach((key) => {
                        if(key == item.key) {
                            this.$set(item, 'checked', true);
                        }
                    });
                }
            },
            deleteSchool (index) {
                this.formItem.choosenSchool.splice(index,1);
                this.formItem.choosenCode.splice(index,1);
            },
            goResult () {
                bcYxgx({ yxdms:this.formItem.choosenCode }).then( ( {data} ) => {
                    if (data.flag) {
                        this.$store.commit('setLxyx',data);
                        this.$emit('closeyx');
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {})
            },
            showList () {
                this.showDroplist = true;
            },
            delayClose () {
                this.showDroplist = false;
            },
            closeModal () {
                this.$emit('closeyx');
            }
        },
        mounted () {
            this.formItem.choosenSchool = [...this.$store.state.userMsg.lxyx];
            this.formItem.choosenSchool.forEach((item) => {
                this.formItem.choosenCode.push(item.key);
            });
        }
    }
</script>