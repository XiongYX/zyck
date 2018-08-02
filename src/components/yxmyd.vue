<template>
    <div class="zyck-yxmyd">
        <Row>
            <Col span="8" class="zyck-yxmyd-left">
                <div class="zyck-yxmyd-title">{{title}}</div>
                <div class="zyck-yxmyd-pf">{{pf}}</div>
                <Rate disabled :value="parseFloat(pf)" allow-half></Rate>
                <div class="zyck-yxmyd-num">{{num}}人投票</div>
            </Col>
            <Col span="16" class="zyck-yxmyd-right">
                <template v-for = "item in detail">
                    <Row style="margin-bottom: 5px;">
                        <Col span="3">
                            <div class="ivu-rate detail-rate">
                                <span class="ivu-rate-title">{{item.key}}</span>
                                <div class="ivu-rate-star ivu-rate-star-zero">
                                    <span type="half" class="ivu-rate-star-content"></span>
                                </div>
                            </div>
                        </Col>
                        <Col span="21">
                            <Progress :percent="item.value"><span class="ivu-progress-text-inner">{{item.value + '%'}}</span></Progress>
                        </Col>
                    </Row>
                </template>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    name: 'yxmyd',
    data () {
        return {
        }
    },
    props: ['title', 'pf', 'num', 'detail']
}
</script>

