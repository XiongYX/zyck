<style lang="less" scoped>
.zhy-table{
    margin: 20px;
    table {
        width: 100%;
        line-height: 25px;
        border-collapse: collapse;
        border-spacing: 0;
        word-break: break-all;
        word-wrap: break-word;
        th {
            padding: 10px;
            border: 1px solid #d5d5d5;
            background-color: #f8f8f9;
        }
        td {
            padding: 5px 10px;
            border: 1px solid #d5d5d5;
        }
    }
}
</style>
<template>
    <div>
        <h2 class="zyck-main-title">志愿报告名称：{{bgmc}}</h2>
        <div class="zyck-sub-title">你的成绩：{{klmc}}&ensp;&ensp;{{sycj}}&ensp;&ensp;{{pcmc}}</div>
        <div class="zhy-table">
            <table>
                <tr>
                    <th rowspan="2" align="left">志愿</th>
                    <th rowspan="2" align="left">院校</th>
                    <th rowspan="2" align="left">专业（录取可能性）</th>
                    <th colspan="3" width="150" style="padding: 0;">录取平均分</th>
                </tr>
                <tr>
                    <template v-for="item,index in years">
                        <th width="80" style="padding: 0;">{{item}}</th>
                    </template>
                </tr>
                <template v-for="item,index in tableData">
                    <template v-if="item.zy!=null">
                        <tr>
                            <td :rowspan="item.zy.length+1" valign="top">{{index | zyIndex}}</td>
                            <td :rowspan="item.zy.length+1" valign="top">{{item.xxmc}}</td>
                        </tr>
                        <template v-for="zyItem in item.zy">
                            <tr>
                                <td>{{zyItem.zymc}}（<span :class="zyItem.lqfx.key | fx-color">{{zyItem.lqfx.value}}</span>）</td>
                                <template v-for="pjf in zyItem.zypjf">
                                    <td align="center">{{pjf}}</td>
                                </template>
                            </tr>
                        </template>
                    </template>
                    <template v-else>
                        <tr>
                            <td>{{index | zyIndex}}</td>
                            <td>{{item.xxmc}}</td>
                            <td>-</td>
                            <td align="center">-</td>
                            <td align="center">-</td>
                            <td align="center">-</td>
                        </tr>
                    </template>
                </template>
            </table>
        </div>
        <div style="text-align: center; margin-bottom: 50px;">
            <Button type="primary" size="large" @click="backList">返回志愿列表</Button>
        </div>
    </div>
</template>

<script>
    import { getzhiydetail } from '../../api/axios.js';
    export default {
        name: 'zhydetail',
        data () {
            return {
                bgmc: "",
                klmc: "",
                sycj: "",
                pcmc: "",
                years: [],
                tableData: []
            }
        },
        methods: {
            backList () {
                this.$router.push({name:'zhylist'});
            }
        },
        created () {
            this.$store.commit('changeLoading', true);
            getzhiydetail({zhiyid:this.$route.params.id}).then( ( {data} ) => {
                this.$store.commit('changeLoading', false);
                if (data.flag) {
                    this.klmc = data.msg.klmc;
                    this.sycj = data.msg.sycj;
                    this.pcmc = data.msg.pcmc;
                    this.bgmc = data.msg.bgmc;
                    this.years = data.msg.years;
                    this.tableData = data.msg.zhiy;
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err => {});
        }
    }
</script>