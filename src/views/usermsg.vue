<style lang="less" scoped>
.zyck-usermsg {
    width: 685px;
    margin: 40px auto 20px auto;
    .usermsg-row {
        line-height: 60px;
        border-bottom: 1px solid #dddee1;
        font-size: 16px;
    }
    .row-con {
        position: relative;
        font-weight: 700;
    }
}
</style>
<template>
    <div>
        <h2 class="zyck-main-title">会员信息</h2>
        <div class="zyck-usermsg">
            <Row class="usermsg-row">
                <Col span="6" class="row-title">姓名</Col>
                <Col span="18" class="row-con">{{userName}}</Col>
            </Row>
            <Row class="usermsg-row">
                <Col span="6" class="row-title">性别</Col>
                <Col span="18" class="row-con">{{userMsg.xb}}</Col>
            </Row>
            <Row class="usermsg-row">
                <Col span="6" class="row-title">所在省市</Col>
                <Col span="18" class="row-con">{{userSS}}</Col>
            </Row>
            <Row class="usermsg-row">
                <Col span="6" class="row-title">
                    <template v-if="gkkl.length == 2">高考科类</template>
                    <template v-else>选考科目</template>
                </Col>
                <Col span="18" class="row-con">
                    <template v-if="gkkl.length == 2">{{gkkl}}</template>
                    <template v-else>{{kskm}}</template>
                </Col>
            </Row>
            <Row class="usermsg-row">
                <Col span="6" class="row-title">高考年份</Col>
                <Col span="18" class="row-con">{{gknf}}年</Col>
            </Row>
            <Row class="usermsg-row">
                <Col span="6" class="row-title">高考成绩</Col>
                <Col span="18" class="row-con">{{gkcj}}</Col>
            </Row>
            <Row class="usermsg-row">
                <Col span="6" class="row-title" style="color: #f26317;">会员到期时间</Col>
                <Col span="18" class="row-con" style="color: #f26317;">{{userMsg.viptime}}</Col>
            </Row>
            <Row class="usermsg-row" style="border-bottom: none;">
                <Button type="primary" size="large" @click="goResult">估分填志愿</Button>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'usermsg',
        computed: {
            userName () {
                return this.$store.state.userName;
            },
            userMsg () {
                return this.$store.state.userMsg;
            },
            gkkl () {
                return this.$store.state.gkkl;
            },
            kskm () {
                return this.$store.state.kskm;
            },
            userSS () {
                return this.$store.state.ss.value;
            },
            gknf(){
                return this.$store.state.gknf;
            },
            gkcj(){
                if (this.$store.state.gkfs!='') {
                    return this.$store.state.gkfs+'分'
                } else {
                    return this.$store.state.gkwc+'位'
                }
            }
        },
        methods: {
            goResult () {
                this.$router.push({ name: 'yxfirst' });
            }
        }
    }
</script>
