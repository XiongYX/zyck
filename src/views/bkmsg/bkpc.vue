<template>
    <div :style="!modalClosable?'height:500px;':''">
        <Modal class="no-footer"  v-model="modaBkpc" width="990" :closable="modalClosable" :mask-closable="false" @on-cancel="closeModal">
            <div class="zyck-modal-con">
                <h2 class="zyck-modal-title">请选择批次</span></h2>
            </div>
            <Row class="bkpc-card" style="text-align: center;">
                <template v-if="socre.length>0">
                    <template v-if="socre.length>0" v-for="item in socre">
                        <Col span="8" style="display: inline-block; float: none;">
                            <Card class="first-card">
                                <div class="card-con">
                                    <div class="card-title">{{item.pcmc}}</div>
                                    <div class="card-subtext">{{dataYear}}年省控线  {{kl}}</div>
                                    <div class="card-num">{{item.num}}</div>
                                    <Button type="primary" style="width: 50%; border-radius: 0;" @click="nextStep(item.pcdm,item.pcmc)">开始</Button>
                                </div>
                            </Card>
                        </Col>
                    </template>
                </template>
                <template v-else>
                    <div style="height: 150px; line-height: 150px; text-align: center; font-size: 16px; color: #f44043;">无推荐批次，请稍后重试！</div>
                </template>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import { getTjpc,pcxz } from '../../api/axios.js';
    export default {
        name: 'yhxx',
        data () {
            return {
                modaBkpc: false,
                dataYear: '',
                kl: '',
                socre:[],
            }
        },
        props: {
            modalClosable: {
                type:Boolean,
                default: false
            },
            editPc: {
                type:Boolean,
                default: false
            }
        },
        methods: {
            nextStep (pcdm,pcmc) {
                pcxz({ pcdm:pcdm }).then( ( {data} ) => {
                    if (data.flag) {
                        if(this.editPc) {
                            this.$store.state.pcmc = pcmc;
                            this.$store.commit('changeRload', true);
                            this.$emit('on-updata');
                            return;
                        }
                        if (!this.$store.state.step.finish) {
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
                                        h('span','建议你做一下专业心理测评，通过专业心理测评我们可以为你推荐适合你的专业！'),
                                    ])
                                },
                                okText: '做测评',
                                onOk: () => {
                                    this.$store.commit('changeLoading', true);
                                    window.location.href = '/zyck/cp/xqcp.action?from=zyck';
                                },
                                cancelText: '以后再做，下一步',
                                onCancel: () => {
                                    this.$store.dispatch('getAllInfo').then(() => {
                                        this.$store.state.step.finish = true;
                                        this.$router.push({ name: 'yxfirst' });
                                    });
                                }
                            });
                        } else {
                            this.$router.push({ name: 'yxfirst' });
                        }
                    } else {
                        this.$Message.error(data.msg.result);
                    }
                }).catch(err => {})
            },
            closeModal () {
                this.$emit('closebkpc');
            }
        },
        created () {
            getTjpc().then( ( {data} ) => {
                if (data.flag) {
                    this.dataYear = data.msg.dataYear;
                    this.kl = data.msg.kl;
                    this.socre = data.msg.socre;
                    if (this.socre.length>0) {
                        this.modaBkpc = true;
                    } else {
                        this.$Message.error('无推荐批次，请稍后重试！');
                        this.$emit('closebkpc');
                    }
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err => {})
        }
    }
</script>