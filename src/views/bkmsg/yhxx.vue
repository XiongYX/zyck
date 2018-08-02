<template>
    <div style="height: 620px;">
        <Modal v-model="modaYhxx" width="680" :closable="false" :mask-closable="false">
            <div class="zyck-modal-con">
                <h2 class="zyck-modal-title">完善考生信息</h2>
                <p class="zyck-modal-subtitle">以下所有项目均为必填项，请认真填写</p>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <FormItem label="姓名：">
                        <template v-if="userName!=''">
                            <div class="zyck-yhxm">{{userName}}<span class="zyck-yhxm-sub">（注：来自实名注册，如果需要修改请前往 <a href="https://account.chsi.com.cn/passport/login">实名注册</a> 修改！）</span></div>
                        </template>
                        <template v-else>
                            <div class="zyck-yhxm">未知<span class="zyck-yhxm-sub">（请前往 <a href="https://account.chsi.com.cn/passport/login">实名注册</a> 修改！）</span></div>
                        </template>
                    </FormItem>
                    <FormItem label="性别：" prop="xb">
                        <RadioGroup v-model="formValidate.xb">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                        <span class="zyck-sub">（性别确定后不可更改。）</span>
                    </FormItem>
                    <FormItem label="所在省市：">
                        <template v-if="userSs!=null">
                            <div class="zyck-yhxm">{{userSs.value}}<span class="zyck-yhxm-sub">（注：来自购买会员时选定的省市。）</span></div>
                        </template>
                        <template v-else>
                            <div class="zyck-yhxm">暂无，读取错误！<span class="zyck-yhxm-sub">（注：来自购买会员时选定的省市。）</span></div>
                        </template>
                    </FormItem>
                    <template v-if="userSs!=null">
                        <template v-if="!userSs.xgk">
                            <FormItem label="高考科类：" prop="kldm">
                                <RadioGroup v-model="formValidate.kldm">
                                    <Radio label="1">文史</Radio>
                                    <Radio label="5">理工</Radio>
                                </RadioGroup>
                                <span class="zyck-sub">（高考科类确定后不可更改。）</span>
                            </FormItem>
                        </template>
                        <template v-if="userSs.xgk">
                            <FormItem label="选考科目：" prop="kskmdm">
                                <CheckboxGroup v-model="formValidate.kskmdm">
                                    <Checkbox label="04">物理</Checkbox>
                                    <Checkbox label="05">化学</Checkbox>
                                    <Checkbox label="06">生物</Checkbox>
                                    <Checkbox label="15">技术</Checkbox>
                                    <Checkbox label="07">政治</Checkbox>
                                    <Checkbox label="08">历史</Checkbox>
                                    <Checkbox label="09">地理</Checkbox>
                                </CheckboxGroup>
                                <div class="form-item-subtext">选考科目确定后不可更改</div>
                            </FormItem>
                        </template>
                    </template>
                    <FormItem label="成绩：" prop="userScore">
                        <Tabs type="card" :value="formValidate.cjlx" size="small" @on-click="changeName">
                            <TabPane label="位次" name="1">
                                <Input v-model="userScore.wcNum" placeholder="请输入位次"></Input>
                            </TabPane>
                            <TabPane label="预估总分" name="0">
                                <Input v-model="userScore.totalScore" placeholder="请输入预估总分（100-750）"></Input>
                            </TabPane>
                            <span class="tips"slot="extra">推荐你填写位次，志愿估算更精确。</span>
                        </Tabs>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" size="large" style="width: 30%;" :loading="modal_loading" @click="handleSubmit('formValidate')">下一步</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { getSslist } from 'vuex';
    import { bcKsxx } from '../../api/axios.js';
    export default {
        name: 'yhxx',
        data () {
            const validateScore = (rule, value, callback) => {
                if (this.userScore.totalScore != '' || this.userScore.wcNum != '') {
                    callback();
                }else {
                    callback(new Error('至少填写一个成绩！'));
                }
            };
            return {
                modaYhxx: true,
                modal_loading: false,
                userScore: {
                    totalScore: '',
                    wcNum: ''
                },
                formValidate: {
                    xb: '',
                    kldm: '',
                    kskmdm: [],
                    cjlx: '1',
                    cjlxvalue: ''
                },
                ruleValidate: {
                    xb: [
                        { required: true, message: '请选择性别！', trigger: 'change' }
                    ],
                    kldm: [
                        { required: true, message: '请选择高考科类！', trigger: 'change' }
                    ],
                    kskmdm: [
                        { required: true, type: 'array', min: 3, message: '选考科目必须为三个！', trigger: 'change' },
                        { type: 'array', max: 3, message: '选考科目必须为三个！', trigger: 'change' }
                    ],
                    userScore: [
                        { required: true, validator: validateScore, trigger: 'submit' }
                    ]
                }
            }
        },
        computed: {
            userSs () {
                return this.$store.state.ss;
            },
            userName () {
                return this.$store.state.userName;
            },
            gkkl () {
                if(this.userSs.xgk){
                    return '选考科目';
                } else {
                    return '高考科类';
                }
            }
        },
        methods: {
            handleSubmit (name) {
                if (this.$store.state.ss!=null) {
                    if (this.$store.state.ss.xgk) {
                        this.formValidate.kldm = 'Z';
                    }
                }
                if (this.formValidate.cjlx=='0') {
                    this.formValidate.cjlxvalue=this.userScore.totalScore;
                } else {
                    this.formValidate.cjlxvalue=this.userScore.wcNum;
                }
                this.$refs[name].validate((valid) => {
                    let _this = this;
                    if (valid) {
                        _this.$Modal.confirm({
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
                                    h('span','性别、'+_this.gkkl+'确定后不可修改，是否继续？'),
                                ])
                            },
                            onOk: () => {
                                bcKsxx(_this.formValidate).then( ({data}) => { //保存用户信息
                                    if (data.flag) {
                                        _this.$store.state.step.completeOne = true;
                                        _this.$router.push({ name: 'bkpc' });
                                    } else {
                                        _this.$Message.error(data.msg);
                                    }
                                }).catch(err => {});
                            }
                        });
                    } else {
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            changeName (name) {
                this.formValidate.cjlx = name;
                this.formValidate.cjlxvalue = '';
            }
        }
    }
</script>