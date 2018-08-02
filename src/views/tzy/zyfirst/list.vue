<style lang="less" scoped>
.tzy-seach-warp {
    border: 1px solid #e9eaec;
    margin-bottom: 20px;
}
.zyck-zhiy-tb {
    td {
        padding: 6px 0;   
    }
}
</style>

<template>
    <div>
        <div class="tzy-seach-warp">
            <check-list list-name="理想专业：" :list="lxzyList" :has-select="true" label-width="110px">
                <template v-for="item in lxzyList">
                    <Tag style="margin: 10px 10px 10px 0;" class="zyck-tag">{{item.ml.value}}<template v-if="item.kl.value != ''">-{{item.kl.value}}</template><template v-if="item.zy.value != ''">-{{item.zy.value}}</template></Tag>
                </template>
                <Button type="text" style="color: #2689E6;height: 30px;line-height: 30px;margin: 10px 10px 10px 0px;" @click="lxzyShow = true">
                    <template v-if="lxzyList.length>0">修改</template>
                    <template v-else>添加</template>
                </Button>
                <template v-if="lxzyList.length>0">
                    <Checkbox v-model="postData.sxCondition" style="vertical-align: middle;">作为筛选条件</Checkbox>
                </template>
            </check-list>
            <check-list list-name="院校所在地：" :list="ssList" @check-item="checkSsItem" label-width="110px"></check-list>
            <check-list list-name="院校类型：" :list="xxlxList" @check-item="checkLxItem" label-width="110px"></check-list>
            <check-list list-name="院校特性：" :list="xxtxList" @check-item="checkTxItem" label-width="110px" :isHelp="true"></check-list>
            <check-list list-name="其他：" :list="[]" :has-select="true" label-width="110px">
                <div style="padding: 10px 0;">
                    <select class="zyck-select" style="width:200px" v-model="postData.xxls">
                        <option value="">院校隶属</option>
                        <template v-for="item in xxlsList">
                            <option :value="item.key">{{item.value}}</option>
                        </template>
                    </select>
                    <select class="zyck-select" style="width:200px" v-model="postData.jyl">
                        <option value="">就业情况</option>
                        <template v-for="item in jylList">
                            <option :value="item.key">{{item.value}}</option>
                        </template>
                    </select>
                    <select class="zyck-select" style="width:200px" v-model="postData.kylqqk">
                        <option value="">考研录取情况</option>
                        <template v-for="item in kylqqkList">
                            <option :value="item.key">{{item.value}}</option>
                        </template>
                    </select>
                </div>
            </check-list>
            <div style="padding: 10px 0; border-top: 1px solid #e9eaec; text-align: center;">
                <Button style="width: 180px" size="large" type="primary" @click="buildList(true)">按以上条件筛选专业</Button>
            </div>
        </div>
        <Alert type="warning" show-icon banner v-if="tableListEmpty">
            <template slot="desc">
                根据你所填写的信息，经系统测算，没有合适的推荐结果。
            </template>
        </Alert>
        <zy-table :table-list="tableList" :years="years" :xxyx="postData.xxyx" @zy-expend="expend" @show-yxmyd="showYxmyd" @show-zymyd="showZymyd" @add-zy="addZy" v-else></zy-table>
        <div class="zyck-seach-more" v-if="tableList.length!==0&&postData.currentPage<Math.ceil(count/postData.pageSize)-1" @click="showmore">查看更多 <Icon type="chevron-right"></Icon></div>
        <zy-list ref="zyList"></zy-list>
        <Modal title="填报" v-model="modalTb" @on-ok="postZy">
            <table v-if="yxIndex!=-1 && modalTb" class="zyck-zhiy-tb">
                <tr>
                    <td class="text-nowarp zyck-text-right zyck-text-top">{{tableList[yxIndex].xx.xxmc}}：</td>
                    <td class="zyck-text-top">
                        <CheckboxGroup v-model="zyData.lqkid">
                            <template v-for="item in tableList[yxIndex].zy">
                                <template v-if="item!=null">
                                    <template v-if="zyData.lqkid.length>=6 && !zyData.lqkid.includes(item.lqkid)">
                                        <Checkbox :label="item.lqkid" disabled title="最多选择6个专业！">{{item.zymc}}</Checkbox>
                                    </template>
                                    <template v-else>
                                        <Checkbox :label="item.lqkid">{{item.zymc}}</Checkbox>
                                    </template>
                                </template>
                                <template v-else>系统异常请重试！</template>
                            </template>
                        </CheckboxGroup>
                    </td>
                </tr>
                <tr>
                    <td class="text-nowarp zyck-text-right zyck-text-top">平行志愿：</td>
                    <td class="zyck-text-top">
                        <RadioGroup v-model="zyData.zhiy">
                            <template v-for="item in zhiyList">
                                <Radio :label="item.key">{{item.value}}</Radio>
                            </template>
                        </RadioGroup>
                    </td>
                </tr>
            </table>
            <div slot="footer">
                <Button type="text"  @click="modalTb = false">取消</Button>
                <Button type="primary" @click="postZy" :disabled="tzydisabled">确定</Button>
            </div>
        </Modal>
        <template v-if = "lxzyShow">
            <lxzy :modalClosable="true" :editZy="lxzyShow" @closezy="closezy" @on-updata="updataZy"></lxzy>
        </template>
        <Modal v-model="yxmydShow" :title="'院校满意度 - '+yxmydtitle">
            <template v-for = "item in yxmyd">
                <yxmyd :title="item.mydmc" :pf="item.pf" :num="item.num" :detail="item.detail"></yxmyd>
            </template>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" @click="yxmydShow = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="zymydShow" :title="'专业满意度 - '+yxmydtitle +' - '+ zymydtitle" class="zyck-zymyd-modal">
            <Row>
                <template v-for = "item in zymyd">
                    <Col span="12">
                        <zymyd :title="item.mydmc" :pf="item.pf" :num="item.num" :detail="item.detail"></zymyd>
                    </Col>
                </template>
            </Row>
            <div slot="footer" style="text-align: center;">
                <Button type="primary" @click="zymydShow = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import cxtj from "../../../data/cxtj-zyfirst.json";
    import { setZyxx, setZylist } from 'Vuex'
    import { getZytjQuery, getZytjDetail, getZytj, postZhiy, getyxmyd, getzymyd } from '../../../api/axios'
    import checkList from '../../../components/checklist'
    import zyTable from '../../../components/zytable'
    import zyList from '../../../components/zylist'
    import lxzy from '../../bkmsg/editzy'
    import yxmyd from '../../../components/yxmyd'
    import zymyd from '../../../components/zymyd'
    export default {
        name: 'yxlist',
        components: {
            checkList,
            zyTable,
            zyList,
            lxzy,
            yxmyd,
            zymyd
        },
        data() {
            return {
                zymydShow: false,
                yxmydShow: false,
                lxzyShow: false,
                modalTb: false,
                years: [],
                tableList: [],
                tableListEmpty: false,
                count: 0,
                postData: {
                    "sxCondition":false,
                    "xxyx": false,
                    "xxszd": [],
                    "xxlx": [],
                    "xxls": "",
                    "kylqqk": "",
                    "jyl": "",
                    "xxtx": [],
                    "currentPage": 0,
                    "pageSize": 10
                },
                zhiyList: [
                    {value: "一志愿", key: "1"},
                    {value: "二志愿", key: "2"},
                    {value: "三志愿", key: "3"},
                    {value: "四志愿", key: "4"},
                    {value: "五志愿", key: "5"}
                ],
                yxIndex: -1,
                zyIndex: -1,
                zyData: {
                    zhiy: '',
                    lqkid: []
                },
                jylList: [],
                kylqqkList: [],
                xxlsList: [],
                ssList: [],
                xxlxList: [],
                xxtxList: [],
                yxmyd: [],
                zymyd: [],
                yxmydtitle: '',
                zymydtitle: ''
            }
        },
        computed: {
            lxzyList () {
                return this.$store.state.userMsg.lxzy;
            },
            tzydisabled () {
                if(this.zyData.zhiy!=''&&this.zyData.lqkid.length>0) {
                    return false;
                } else {
                    return true;
                }
            },
            maxLimt(id) {
                if (this.zyData.lqkid.length>=6 && !this.zyData.lqkid.includes(id)) {
                    return true;
                }
            }
        },
        methods: {
            showmore () {
                this.postData.currentPage++;
                this.buildList(false);
            },
            postZy () {
                let value =  this.zyData.zhiy;
                let zyList = this.$store.state.zyList;
                let mark = -1;
                zyList.map((item, index) => {
                    if(value==item.zhiy.key && item.yx.value!='' && item.yx.value != this.tableList[this.yxIndex].xx.xxmc) {
                        mark = index;
                    }
                })
                if(mark!=-1) {
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
                                h('span','你的'+zyList[mark].zhiy.value+'已填报为 '),
                                h('strong',zyList[mark].yx.value),
                                h('span','，确定替换吗？')
                            ])
                        },
                        onOk: () => {
                            this.postZyMessage();
                        }
                    })
                } else {
                    this.postZyMessage()
                }
            },
            postZyMessage () {
                postZhiy(this.zyData).then(({data}) => {
                    if(data.flag) {
                        this.modalTb = false;
                        this.$store.commit('setZylist', { zylist: data.msg.zylist, zhiyid: data.msg.zhiyid });
                        this.$Message.success("添加成功");
                        this.$refs['zyList'].showList(false);
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {});
            },
            addZy (arr) { //添加志愿
                this.zyData.zhiy = ''; //清空
                this.zyData.zydm = [];
                this.zyData.lqkid = [];
                this.yxIndex = arr[0];
                this.zyIndex = arr[1];
                let yxdm = this.tableList[arr[0]].xx.xxdm;
                let zyList = this.$store.state.zyList;
                this.$nextTick().then(()=>{
                    zyList.map((item,index) => {
                        if(yxdm==item.yx.key) {
                            this.zyData.zhiy = zyList[index].zhiy.key;
                            item.zy.map( zyitem => {
                                if(!this.zyData.lqkid.includes(zyitem.lqkid)) {
                                    this.zyData.lqkid.push(zyitem.lqkid);
                                }
                            });
                        }
                    })
                    if(arr[1] != -1){
                        let lqkid = this.tableList[arr[0]].zy[arr[1]].lqkid;
                        if(!this.zyData.lqkid.includes(lqkid)) {
                            this.zyData.lqkid.push(this.tableList[arr[0]].zy[arr[1]].lqkid);
                        }
                    }
                })
                this.modalTb = true;
            },
            showYxmyd (yxdm) {
                this.$store.commit('changeLoading', true);
                getyxmyd(yxdm).then(({data}) => {
                    this.$store.commit('changeLoading', false);
                    if(data.flag) {
                        this.yxmydShow = true;
                        let msg = JSON.parse(data.msg);
                        this.yxmyd = msg.myd;
                        this.yxmydtitle = msg.yxmc;
                        
                    } else {
                        this.$Message.error(data.msg);
                    }
                } ).catch(err=> {});
            },
            showZymyd (myd) {
                this.$store.commit('changeLoading', true);
                getzymyd(myd).then(({data}) => {
                    this.$store.commit('changeLoading', false);
                    if(data.flag) {
                        this.zymydShow = true;
                        let msg = JSON.parse(data.msg);
                        this.zymyd = msg.myd;
                        this.yxmydtitle = msg.yxmc;
                        this.zymydtitle = msg.zymc;
                    } else {
                        this.$Message.error(data.msg);
                    }
                } ).catch(err=> {});
            },
            buildList (flag) {
                this.$store.commit('changeLoading', true);
                if(this.postData.xxdm) {
                     this.$delete(this.postData, 'xxdm');
                }
                if(this.postData.fxlx) {
                     this.$delete(this.postData, 'fxlx');
                }
                if(this.postData.zylist) {
                     this.$delete(this.postData, 'zylist');
                }
                getZytjQuery(this.postData).then( ({ data }) => {
                    setTimeout(() => {
                         this.$store.commit('changeLoading', false);
                    }, 300);
                    if(data.flag) {
                        this.$nextTick().then(()=>{
                            if(flag) {
                                this.tableList = data.msg.tjlist;
                                this.years = data.msg.years;
                                this.count = data.msg.count;
                            } else {
                                this.tableList = [...this.tableList,...data.msg.tjlist];
                            }
                            if(this.tableList.length==0) {
                                this.tableListEmpty = true;
                            } else {
                                this.tableListEmpty = false;
                            }
                        })
                    } else {
                        this.$Message.error(data.msg);
                    }
                }).catch(err => {})
            },
            resetData () {
                this.postData.currentPage = 0;
                this.buildList(true);
            },
            updataZy () {
                this.lxzyShow = false;
                this.resetData();
            },
            checkSsItem (code) {
                this.postData.xxszd = code;
            },
            checkLxItem (code) {
                this.postData.xxlx = code;
            },
            checkTxItem (code) {
                this.postData.xxtx = code;
            },
            expend ({ index, xxdm, fxlx, flag, zy}) {
                let zylist = [zy[0].zydm+'_'+zy[0].lqfx.key];
                Object.assign(this.postData, { "xxdm": xxdm, "fxlx":fxlx, "zylist":zylist });
                if(!this.tableList[index].zydetail) {
                    this.$store.commit('changeLoading', true)
                    getZytjDetail(this.postData).then( ({ data }) => {
                        this.$store.commit('changeLoading', false)
                        if(!data.flag) {
                            this.$Message.error(data.msg);
                        } else {
                            this.$set(this.tableList[index],'zydetail',data.msg.tjlist)
                            this.$set(this.tableList[index],'isexpend', flag)
                        }
                    }).catch(err => {})
                } else {
                    this.$set(this.tableList[index], 'isexpend', flag)
                }
            },
            closezy () {
                this.lxzyShow = false;
            },
            getZytj () {
                this.xxlxList = cxtj.xxlx;
                this.ssList = cxtj.xxszd;
                this.xxtxList = cxtj.xxtx;
                this.xxlsList = cxtj.xxls;
                this.jylList = cxtj.jyl;
                this.kylqqkList = cxtj.kylqqk;
            }
        },
        created () {
            this.getZytj();
        },
        mounted () {
            this.resetData();
        },
        watch: {
            '$route': function(to,from){
                if (this.$store.state.zyListReload) {
                    this.resetData();
                    this.$store.commit('changeRload', false);
                }
            }
        }
    }
</script>
