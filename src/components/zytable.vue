<style lang="less" scoped>
.ivu-table {
    margin-bottom: 20px;
    table {
        border-collapse: collapse;
        width: 100%;
        &.children-table {
            border: 1px solid #80b5a3;
            border-top: none;
            th {
                height: auto;
                line-height: 1.2;
                padding: 8px 0;
                background: #F7F7F7;
                border-color: #e9eaec;
                color: #333;
            }
            td {
                background: #fff;
            }
            tr {
                &:last-child {
                    border-bottom: 0;
                    td {
                        border-bottom: 0;
                    }
                }
            }
        }
    }
    th {
        background: #1EA779;
        color: #fff;
        text-align: center;
        border-color: #1EA779;
        font-weight: 400;
        &.align-left {
            text-align: left;
        }
    }
    tbody {
        tr {
            border-bottom: 1px solid #e9eaec;
            &:nth-child(even) {
                background: #F2F7FD;
            }
            &.isexpend {
                border: 2px solid #80b5a3;
                border-bottom: none;
                td {
                    background: #E7F1F1;
                }
            }
        }
    }
    td {
        height: 60px;
        padding: 0 5px;
        .has-icon {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 20px;
            position: relative;
            .down-icon {
                position: absolute;
                right: 0;
            }
        }
    }
}
.zytable-link {
    color: #2689E6;
    &:hover {
        color: #2086e8;
    }
}
.zyck-takeup {
    cursor: pointer;
    .ivu-icon {
        margin-right: 5px;
    }
}
</style>
<template>
    <div class="ivu-table">
        <Affix>
            <table v-if="tableList.length!==0">
                <thead>
                    <tr>
                        <th rowspan="2" width="60">录取<br>可能性</th>
                        <th class="align-left" rowspan="2" width="280" style="padding-left: 10px;">院校</th>
                        <th rowspan="2" width="60">院校<br>所在地</th>
                        <th class="align-left" rowspan="2" style="padding-left: 5px;">专业</th>
                        <th rowspan="2" width="50">就业<br>情况</th>
                        <th rowspan="2" width="80">考研<br>录取情况</th>
                        <th class="align-left" rowspan="2" width="205" style="border-right:1px solid #40C397; padding-left: 5px;">{{xxyx ? '院校满意度' : '专业满意度'}}</th>
                        <th colspan="3" width="150" style="border-right:1px solid #40C397;border-bottom-color: #40C397;">录取平均分</th>
                        <th rowspan="2" width="50">添加<br />志愿</th>
                    </tr>
                    <tr>
                        <template v-for="item,index in years">
                            <th width="50" v-if="index===0">{{item}}</th>
                            <th width="50" v-if="index===1" style="border-left:1px solid #40C397;">{{item}}</th>
                            <th width="50" v-if="index===2" style="border-left:1px solid #40C397;border-right:1px solid #40C397;">{{item}}</th>
                        </template>
                    </tr>
                </thead>
            </table>
        </Affix>
        <table v-if="tableList.length!==0">
            <tbody>
                <template v-for="item,index in tableList">
                    <tr :class="{'isexpend': item.isexpend}">
                        <td :class="item.lqgl.key | fx-color" width="60" style="text-align: center;">
                            {{item.lqgl.value}}
                        </td>
                        <td class="zytable-tag" width="280" style="padding-left: 10px;">
                            <a class="zytable-link" :href="item.xx.xxmc | encodeYx" target="_blank">{{item.xx.xxmc}}</a>
                            <div class="zytable-tag-item">
                                <template v-for="tagitem in item.xx.xxtx">
                                    <Tag>{{tagitem}}</Tag>
                                </template>
                            </div>
                        </td>
                        <td class="zyck-text-center" width="60">
                            {{item.xx.xxszd}}
                        </td>
                        <td>
                            <div class="has-icon">
                                <template v-if="item.lqgl.key!='4'">
                                    <template v-for="zy,index in item.zy">
                                        <template v-if="zy!=null">
                                            <a class="zytable-link" :href="zy.zydm | encodeZy(zy.zymc)" target="_blank">{{zy.zymc}}</a>
                                            <template v-if="index!=item.zy.length-1">、</template>
                                        </template>
                                        <template v-else>-</template>
                                    </template>
                                    <template v-if="xxyx">
                                        <Button v-if="item.isexpend" type="text" icon="chevron-up" class="down-icon" @click="expend(index,item,false,item.zy)"></Button>
                                        <Button v-else type="text" icon="chevron-down" class="down-icon" @click="expend(index,item,true,item.zy)"></Button>
                                    </template>
                                </template>
                                <template v-else><span style="color: #999;">无推荐专业</span></template>
                            </div>
                        </td>
                        <td class="zyck-text-center" width="50">
                            <template v-if="item.jyl===null">-</template>
                            <template v-else>{{item.jyl}}</template>
                        </td>
                        <td class="zyck-text-center" width="80">
                            <template v-if="item.kylqqk===null">-</template>
                            <template v-else>{{item.kylqqk}}</template>
                        </td>
                        <td @click="xxyx ? showYxmyd(item.xx.xxdm) : showZymyd(item.xx.xxdm, item.zy[0].zydm)" width="205">
                            <Rate disabled allow-half :value="parseFloat(item.yxmyd.pf)"></Rate>
                            <span class="zyck-hover" style="color: #999; vertical-align: middle;">{{item.yxmyd.pf}}（{{item.yxmyd.num | changeNum}}人）</span>
                        </td>
                        <td class="zyck-text-center" width="50">{{item.pjf1}}</td>
                        <td class="zyck-text-center" width="50">{{item.pjf2}}</td>
                        <td class="zyck-text-center" width="50">{{item.pjf3}}</td>
                        <td class="zyck-text-center" width="50">
                            <template v-if="item.lqgl.key!='4'">
                                <Button type="text" style="color:#2689E6" @click="addZy([index,xxyx ? -1 : 0])">添加</Button>
                            </template>
                            <template v-else>-</template>
                        </td>
                    </tr>
                    <tr v-if="item.isexpend">
                        <td colspan="11" style="padding: 0;">
                            <table class="children-table">
                                <thead>
                                    <tr>
                                        <th rowspan="2" width="60">录取<br>可能性</th>
                                        <th class="align-left" style="padding-left: 10px;" rowspan="2" colspan="3">专业</th>
                                        <th rowspan="2" width="50">就业<br>情况</th>
                                        <th rowspan="2" width="80">考研<br>录取情况</th>
                                        <th class="align-left" rowspan="2" width="205" style="border-right:1px solid #e9eaec; padding-left: 5px;">专业满意度</th>
                                        <th colspan="3" width="150" style="border-right:1px solid #e9eaec; border-bottom-color: #e9eaec;">录取平均分</th>
                                        <th rowspan="2" width="50"></th>
                                    </tr>
                                    <tr>
                                        <template v-for="yearItem in years">
                                            <th width="50" style="border: 1px solid #e9eaec;">{{yearItem}}</th>
                                        </template>
                                    </tr>
                                </thead>
                                <tbody v-if="item.zydetail.length>0">
                                    <template v-for="zyItem,zyItemIndex in item.zydetail">
                                        <tr>
                                            <td :class="zyItem.lqfx.key | fx-color" width="60" style="text-align: center;">
                                                {{zyItem.lqfx.value}}
                                            </td>
                                            <td colspan="3" style="padding-left: 10px;">
                                                <template v-if="zyItem.zy!=null">
                                                    <a class="zytable-link" :href="zyItem.zy.zydm | encodeZy(zyItem.zy.zymc)" target="_blank">{{zyItem.zy.zymc}}</a>
                                                </template>
                                                <template v-else>-</template>
                                            </td>
                                            <td class="zyck-text-center">
                                                <template v-if="zyItem.jyl===null">-</template>
                                                <template v-else>{{zyItem.jyl}}</template>
                                            </td>
                                            <td class="zyck-text-center">
                                                <template v-if="zyItem.kylqqk===null">-</template>
                                                <template v-else>{{zyItem.kylqqk}}</template>
                                            </td>
                                            <td @click="showZymyd(item.xx.xxdm, zyItem.zy.zydm)">
                                                <Rate disabled :value="parseFloat(zyItem.zymyd.pf)" allow-half></Rate>
                                                <span class="zyck-hover" style="color: #999; vertical-align: middle;">{{ zyItem.zymyd.pf }}（{{zyItem.zymyd.num | changeNum}}人）</span>
                                            </td>
                                            <td class="zyck-text-center">{{zyItem.pjf1}}</td>
                                            <td class="zyck-text-center">{{zyItem.pjf2}}</td>
                                            <td class="zyck-text-center">{{zyItem.pjf3}}</td>
                                            <td class="zyck-text-center"><Button type="text" style="color:#2689E6" @click="addZy([index,zyItemIndex])">添加</Button></td>
                                        </tr>
                                    </template>
                                    <tr>
                                        <td colspan="11" class="zyck-text-center" style="height: 40px;">
                                            <span class="zyck-takeup" @click="expend(index,item,false,item.zy)">
                                                <Icon type="chevron-up"></Icon>收起专业
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <template v-if="tableList.length!==0">
            <Alert type="warning" style="margin-top: 20px; color: #666; background: #fff5e6;">
                <template v-if="xxyx">推荐结果说明：每种录取可能性最多推荐20个院校；所推荐出的专业为{{cknf}}年的数据，请以正式公布的实际招生计划数据为准。
                </template>
                <template v-else>推荐结果说明：每种录取可能性最多推荐20条数据；所推荐出的专业为{{cknf}}年的数据，请以正式公布的实际招生计划数据为准。
                </template>
            </Alert>
        </template>
    </div>
</template>
<script>
    import { getZytjDetail } from '../api/axios'
    export default {
        name: 'zytable',
        props: ['tableList', 'years', 'xxyx'],
        data () {
            return {
                valueDisabled: 2.1
            }
        },
        computed: {
            cknf () {
                if (this.$store.state.ss.cknf!='') {
                    return this.$store.state.ss.cknf;
                } else {
                    return '2017'
                }
            }
        },
        methods: {
            expend (index,o,flag,zy) {
                this.$emit('zy-expend',{index: index, xxdm: o.xx.xxdm, fxlx: o.lqgl.key, flag: flag, zy:zy});
            },
            showYxmyd (yxdm) {
                this.$emit('show-yxmyd', {'yxdm': yxdm });
            },
            showZymyd (yxdm, zydm) {
                this.$emit('show-zymyd',{'yxdm': yxdm, 'zydm': zydm });
            },
            addZy (arr) {
                this.$emit('add-zy',arr);
            }
        }
    }
</script>

