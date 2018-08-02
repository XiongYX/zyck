<style lang="less" scoped>
    .zhy-table{
        margin: 20px;
    }
</style>
<template>
    <div>
        <h2 class="zyck-main-title">我的志愿表</h2>
        <div class="zhy-table">
            <Table stripe :columns="tableColumns" :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
    import { getzhiylist,delZybg } from '../../api/axios.js';
    export default {
        name: 'zhylist',
        data () {
            let _this = this;
            return {
                tableColumns: [
                    {
                        title: '报告时间',
                        key: 'time'
                    },
                    {
                        title: '报告名称',
                        key: 'bgmc'
                    },
                    {
                        title: '报考批次',
                        key: 'pcmc'
                    },
                    {
                        title: '报考科类',
                        key: 'klmc'
                    },
                    {
                        title: '使用成绩',
                        key: 'sycj'
                    },
                    {
                        title: '操作',
                        key: 'handle',
                        align: 'center',
                        render: (h, params) => {
                            return h('div',[
                                h('i-button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        color: '#45bb93',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click() {
                                            _this.$router.push({path:'/zhydetail/' + params.row.zhiyid});
                                        }
                                    }
                                }, "查看"),
                                h('i-button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        marginLeft:'10px',
                                        color: '#f44043',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click() {
                                            _this.delZybg(params.row.zhiyid, params.index, params.row.bgmc);
                                        }
                                    }
                                }, "删除")
                            ]);
                        }
                    }
                ],
                tableData: []
            }
        },
        methods: {
            delZybg (id, index, bgmc) {
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
                            h('span','是否删除 '+bgmc+' ？'),
                        ])
                    },
                    onOk: () => {
                        delZybg({id:id}).then( ( {data} ) => {
                            if (data.flag) {
                                this.tableData.splice(index,1);
                                this.$Message.success('删除成功');
                            } else {
                                this.$Message.error(data.msg);
                            }
                        }).catch(err => {});
                    }
                })
            }
        },
        mounted () {
            this.$store.commit('changeLoading', true);
            getzhiylist().then( ( {data} ) => {
                this.$store.commit('changeLoading', false);
                if (data.flag) {
                    this.tableData = data.msg;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err => {
                this.$Message.error('网络错误，请重试！');
            });
        }
    }
</script>
