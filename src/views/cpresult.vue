<template>
    <div>
        <h2 class="zyck-main-title">根据测评，你可能适合以下专业</h2>
        <div class="zyck-sub-title">最多选择10个</div>
        <div class="zyck-cp-con">
            <ul class="clearfix">
                <template v-if="cpresultList.length>0" v-for="(item,index) in cpresultList">
                    <li @click="toggleZy(item)" :class="{'seach-list-item-checked' : item.lxzy}">{{item.zymc}}</li>
                </template>
                <template v-else>暂无推荐结果！</template>
            </ul>
        </div>
        <div style="text-align: center; margin-bottom: 50px;">
            <Button type="primary" size="large" style="width: 20%;" :loading="modal_loading" :disabled="disableBtn" :title="disableTitle" @click="goResult">作为理想专业查看推荐结果</Button>
        </div>
    </div>
</template>

<script>
    import { setLxzy } from 'vuex'
    import { getCpresult,bcXzzy } from '../api/axios.js';
    export default {
        name: 'cpResult',
        data() {
            return {
                modal_loading: false,
                zyList: [],
                cpresultList: []
            }
        },
        computed: {
            disableBtn () {
                if (this.zyList.length > 0 && this.zyList.length <= 10 ) {
                    return false;
                } else {
                    return true;
                }
            },
            disableTitle () {
                if (this.zyList.length == 0 ) {
                    return '请选择至少选择1个专业！';
                } else if( this.zyList.length > 10 ) {
                    return '最多选择10个专业！';
                }
            }
        },
        methods: {
            toggleZy (item) {
                if(this.zyList.includes(item.zydm)){
                    this.$set(item, 'lxzy', false);
                    this.zyList.splice(this.zyList.indexOf(item.zydm), 1);
                } else {
                    this.$set(item, 'lxzy', true);
                    this.zyList.push(item.zydm);
                }
            },
            goResult () {
                bcXzzy({ zydms:this.zyList }).then( ( {data} ) => {
                    if (data.flag) {
                        this.$store.commit('setLxzy',data);
                        this.$router.push({ name: 'zyfirst' });
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {})
            },
            queryList () {
                this.$store.commit('changeLoading', true);
                getCpresult().then( ( {data} ) => {
                    if (data.flag) {
                        this.$store.commit('changeLoading', false);
                        if (data.msg.finishCp) {
                            this.cpresultList = data.msg.cpresultList;
                            this.cpresultList.forEach((item) => {
                                if (item.lxzy) {
                                    this.zyList.push(item.zydm);
                                }
                            });
                        } else {
                            window.location.href = '/zyck/cp/xqcp.action?from=zyck';
                        }
                    } else {
                        this.$store.commit('changeLoading', false);
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {});
            }
        },
        created () {
            this.queryList();
        }
    }
</script>
