<template>
    <div class="zyck-zy-list">
        <div class="zy-list-toggle" v-if="hiddenList" @click="showList(true)">展开志愿</div>
        <div class="zy-list-content" v-else>
            <div class="zy-list-content_button" @click="hiddenList = true">收起</div>
            <table class="zy-list-table">
                <thead>
                    <tr>
                        <th colspan="3" style="color: #999;font-weight: 400;">志愿列表</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="zylist.length>0">
                        <template v-for="item in zylist">
                            <tr>
                                <th width="80" :rowspan="item.zy!=null?2:1">{{item.zhiy.value}}</th>
                                <td>
                                    <template v-if="item.yx.value!=''">
                                        {{item.yx.value}}
                                    </template>
                                    <template v-else><span style="color: #999;">请添加志愿</span></template>
                                </td>
                                <td width="60" class="zyck-text-center">
                                    <Button type="text" style="color: #2689e6;" @click="delZy(zhiyid, item.zhiy.key)"  v-if="item.zy!=null">移除</Button>
                                </td>
                            </tr>
                            <tr v-if="item.zy!=null">
                                <td colspan="2">
                                    <template v-for="zyitem,index in item.zy">
                                        <template v-if="zyitem!=null">
                                            <span :class="zyitem.lqfx.key | fx-color" :title="'录取可能性'+zyitem.lqfx.value">{{zyitem.zymc}}</span>
                                            <template v-if="index<item.zy.length-1">、</template>
                                        </template>
                                        <template v-else>-</template>
                                    </template>
                                </td>
                            </tr>
                        </template>
                    </template>
                    <template v-else>
                        <template  v-for="n in 5">
                            <tr>
                                <th width="80">{{n-1 | zyIndex}}</th>
                                <td><span style="color: #999;">请添加志愿</span></td>
                            </tr>
                        </template>
                    </template>
                    <tr>
                        <td colspan="3" class="button-warp">
                            <Button type="primary" @click=" zybModal= true " long size="large">生成志愿报告</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Modal v-model="zybModal" title="生成志愿报告">
            <Input v-model.trim="zybName" placeholder="请输入志愿报告名称" style="width: 300px"></Input>
            <div slot="footer">
                <Button type="text" @click="zybModal= false">取消</Button>
                <Button type="primary" @click="saveZhiyList" :disabled="disabled">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { getZylist } from 'vuex'
import {  delzhiy, savezhiylist } from '../api/axios'
export default {
    name: 'zylist',
    data () {
        return {
            hiddenList: true,
            zybName: '',
            zybModal: false
        }
    },
    computed: {
        zylist () {
            return this.$store.state.zyList;
        },
        zhiyid () {
            return this.$store.state.zhiyid;
        },
        disabled () {
            return this.zybName=='' ? true : false;
        }
    },
    methods: {
        delZy (zhiyid,zhiy) {
            delzhiy({"zhiyid": zhiyid, "zhiy": zhiy}).then(({data}) => {
                if(data.flag) {
                    this.$store.commit('setZylist', { zylist: data.msg.zylist, zhiyid: data.msg.zhiyid });
                    this.$Message.success("移除志愿成功");
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err => {})
        },
        saveZhiyList () {
            if(this.zybName==''){
                this.$Message.warning("请输入志愿表名称");
                return false;
            }
            savezhiylist( { "bgmc": this.zybName }).then( ({data}) => {
                if(data.flag) {
                    this.$store.commit('resetZylist');
                    this.$router.push({ name: 'zhylist' });
                } else {
                    this.$Message.error(data.msg);
                }
            }).catch(err=> {})
        },
        showList (flag) {
            if(flag&&!this.$store.state.zyListFinshed) {
                this.$store.dispatch('getZylist');
            }
            this.hiddenList = false;
        }
    },
    mounted () {
        this.hiddenList = true;
    }
}
</script>

