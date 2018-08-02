<template>
    <div class="buy-box" style="padding:10px 30px">
        <Modal
            v-model = "modal1"
            width = "800"
            title = "会员使用协议"
            okText = "同意并继续"
            cancelText = "取消"
            @on-ok = "agreet_it"
            @on-cancel = "cancel_it">
            <div id="member-policy" style="height:300px; overflow:auto; "> 
               <h4>适用对象</h4>
               <p>本系统只适用报考本科层次的考生，报考科类仅限“文史、理工、综合改革”，不含“文理综合、 外语（文）、 艺术（文）、 体育（文）、 外语（理）、 艺术（理）、 体育（理）、 单独考试、 艺术（不分文理）”。</p>
        
               <h4>会员费用及有效期</h4>
               <p>一次性付费，60元。有效期自购买会员当日至2018年8月30日。</p>

               <h4>会员服务</h4>
               <p>在有效期内，可使用一次专业心理测评服务；每天修改高考分数及位次的累计次数为5次。</p>
               <h4>特别声明</h4>
               <ul>
                 <li>1. 系统所提供的各类功能仅供参考，不作为填报志愿的最终依据，考生在正式填报志愿时，还需要结合多方面信息进行报考，本系统不对录取结果进行任何担保。</li>
                 <li>2. 各高校及专业的录取平均分，仅作为参考数据，实际数据请以高校正式公布的数据为准。</li>
                 <li>3. 系统所提供服务的最终解释权归学信网所有。</li>
               </ul>
            </div>
        </Modal>
        <Modal v-model="modal2" width="360"  class-name="vertical-center-modal"  @on-cancel="closePay">
            <p slot="header" style="text-align:left">
                <span>请进入支付页面进行付款</span>
            </p>
            <div style="text-align:center; font-size:16px; color:#f60;">
                <p> <Icon type="information-circled"></Icon> 请在新打开的页面上完成付款！</p>
            </div>
            <div slot="footer" style="text-align:center;">
                <Button type="success" style="margin-right:15px;" size="large" @click="paySuccess">已完成付款</Button>
                <a href="https://pay.chsi.com.cn/help/index.action?answ=faq" target="_blank" class="ivu-btn ivu-btn-ghost ivu-btn-large">付款遇到问题</a>
            </div>
        </Modal>
        <Modal v-model="modal3" width="500"  class-name="vertical-center-modal"  @on-cancel="closePay" title="开通会员">
            <div style="font-size: 16px;line-height: 1.8;">高考年份为：<span style="color: #45bb93">{{memberPrice.gknf}}</span> 年；<br>
            高考省份为：<span style="color: #45bb93">{{currentProvice.ssmc}}</span><span style="color: #999;">（购买后将不可更改）</span>；<br>会员费用：<span class="pirce-currency" style="font-size: 16px;">￥</span><span class="price-number" style="font-size: 16px;">{{memberPrice.price}}</span> <span style="color: #999;">（到期时间：{{memberPrice.expiry}}）</span>。</div>
            <div slot="footer" style="text-align:center">
                <a :href="redirectUrl" @click="goPay" class="ivu-btn ivu-btn-primary" target="_blank"><span>确认支付</span></a>
            </div>
        </Modal>
        <Alert show-icon style="margin-bottom: 20px;">
            <strong>特别提示</strong>
            <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
            <template slot="desc">1. 本系统 <strong class="fx-color3" style="font-size: 16px;">只适用报考本科层次</strong> 的考生，不适用于报考高职（专科）和预科层次考生；<br>
                2. 本科层次的考生，报考科类仅限“文史、理工、综合改革”，不含“文理综合、 外语（文）、 艺术（文）、 体育（文）、 外语（理）、 艺术（理）、 体育（理）、 单独考试、 艺术（不分文理）”。
</template>
        </Alert>
        <h3>选择你的高考省份</h3> 
        <div class="zyck-cp-con" style="margin:10px auto 20px 0px;">
                <ul class="clearfix" style="margin-bottom:15px;">
                    <template v-for="(item,index) in provicesList">
                        <li class="seach-list-item-disabled" v-if="!item.isopen"> 
                            <Badge count="未开通" ><span class="ssmc-label">{{item.ssmc}}</span></Badge>
                        </li>
                        
                        <li v-else @click="toggle_it(item)" :class="{'seach-list-item-checked' : (item === currentProvice)}">{{item.ssmc}}</li>
                    </template>
                </ul>
                
            <!--<Alert v-if="currentProvice.ssmc"><icon type="record" :size="2" color="#f44043"></icon><span class="current-provice-name">{{currentProvice.ssmc}}</span>是以{{currentProvice.cknf}}年的数据进行分析预测</Alert>-->   
        </div>
        <h3>会员费用</h3>
        <div class="member-price">
            <Row type="flex" justify="center" align="middle">
                <i-col span="2" >
                    <div style="text-align:right; padding-right:10px;">
                        <span class="pirce-currency">￥</span><span class="price-number">{{memberPrice.price}}</span>
                    </div>
                </i-col>
                <i-col span="14">
                        你购买的高考年份为 {{memberPrice.gknf}}年
                        <div class="summary">会员有效期至{{memberPrice.expiry}}</div>
                </i-col>
                <i-col span="4" style="right:15px;">
                    <Button type="success" :long="true" size="large" :disabled="iscanPay" :loading="loading" @click="payForMember">
                        <span v-if="!loading">支付</span>
                        <span v-else>支付中...</span>
                    </Button>
                </i-col>
                <i-col span="4">
                    <Button type="ghost" :long="true" @click="cancelBuy" size="large" >取消</Button>
                </i-col>
                <form ref="formInline"  target="_blank" :action="redirectUrl" inline></form>
            </Row>
        </div>
    </div>
</template>
<style lang="less" scoped>
    #member-policy { line-height: 26px; font-size: 14px; color: #777; }
    #member-policy h4{  margin-top: 15px; margin-bottom: 10px; color: #000; font-weight: 700; }
    #member-policy ul li{ padding-left: 10px; text-indent: -10px; }
    .zyck-cp-con{ width: auto; }
    .zyck-cp-con li{
        margin: 5px 15px 15px 0px;
    }
    .ssmc-label{
        display: inline-block;
        padding: 10px 5px;
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>
<script>
import store from '../../store';
import router from '../../router';
import { getMemberPrice, agreedPolicy, PayForMember } from '../../api/axios.js';
export default {
    name: 'pay',
    data(){
        return {
            // USERID从全局获取
            loading: false, //是否开始支付
            currentProvice : {}, //当前选中的省市
            agreedPolicy: false, // 用户是否已同意了使用协议
            modal1: false, //是否显示服务条款
            modal2: false, // 点击支付后的是否显示的弹出层
            modal3: false, // 回调支付订单
            provicesList: [], //开通省市存放
            memberPrice: {}, //会员价格等属性
            redirectUrl:"" // 支付url
        }
    },
    methods: {
        goPay () {
            this.modal3 = false;
            this.modal2 = true;
        },
        agreet_it() {
            agreedPolicy().then(({data}) => { 
                this.modal3 = false;
                this.agreedPolicy = true;
                this.payForMember();     
            })
            
        },
        cancel_it() {
            // this.agreedPolicy = false;
        },
        cancelBuy (){
            window.location.href = "/zyck/"
        },
        toggle_it(o) {
            this.currentProvice = o;
        },
        payForMember() {
            if(!this.agreedPolicy){
                this.modal1 = true;
            }
            if(this.currentProvice.ssdm && this.agreedPolicy){
              this.loading = true;
              PayForMember({"ssdm":this.currentProvice.ssdm}).then(({data}) =>{
                  if(data.flag){
                    this.modal3 = true;
                    this.redirectUrl = data.msg.redirecturl;
                  } else {
                      this.$Message.error(data.msg);
                  }
              }).catch(err => {});
            }
            else{

            }
        },
        paySuccess() { //支付成功
             this.loading = false;
             this.modal2 = false;
             // console.log('redirect to ')
             // router.push({name:'yhxx'});
             window.location.reload();
        },
        closePay() { //关闭支付弹出层
            this.loading = false;
        }
    },
    computed: {
        iscanPay() {
            return !!!this.currentProvice.ssdm
        }
    },
    created () {
        this.$store.commit('changeLoading', true)
        getMemberPrice().then( ( {data} ) => {
            this.provicesList = data.msg.provices;
            this.memberPrice = data.msg.member;
            this.$store.commit('changeLoading', false);
        }).catch(err => {});
    }

}
</script>
