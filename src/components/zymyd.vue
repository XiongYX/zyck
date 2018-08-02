<template>
    <div class="zyck-zymyd">
        <div class="zyck-zymyd-title">{{title}}</div>
        <div class="zyck-zymyd-pf"><Rate disabled :value="parseFloat(pf)" allow-half></Rate>{{pf}}<span class="zyck-zymyd-num">（{{num}}人投票）</span></div>
        <div class="zyck-yxmyd-detail">
            <template v-for = "item in detail">
                <Row style="margin-bottom: 5px;">
                    <Col span="4">
                        <div class="ivu-rate detail-rate">
                            <span class="ivu-rate-title">{{item.key}}</span>
                            <div class="ivu-rate-star ivu-rate-star-zero">
                                <span type="half" class="ivu-rate-star-content"></span>
                            </div>
                        </div>
                    </Col>
                    <Col span="20">
                        <Progress :percent="item.value"><span class="ivu-progress-text-inner">{{item.value + '%'}}</span></Progress>
                    </Col>
                </Row>
            </template>
        </div> 
    </div>
</template>
<script>
export default {
    name: 'zymyd',
    data () {
        return {
        }
    },
    props: ['title', 'pf', 'num', 'detail']
}
</script>
