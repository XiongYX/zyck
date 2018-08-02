<template>
    <div class="ivu-layout-footer-wrapper">
        <div class="ivu-layout-footer">
            Copyright © 2003-{{gknf}} <a href="//www.chsi.com.cn/" target="_blank">学信网</a> All Rights Reserved<a class="call-title" href="/zyck/memberbenefits.jsp" target="_blank">会员权益</a><a class="call-title" href="/zyck/tbsm.jsp" target="_blank">特别声明</a><span class="call-title">服务热线：</span>010-82199588
        </div>
    </div>
</template>

<script>
export default {
    name: 'mainFooter',
    computed: {
        gknf(){
            return this.$store.state.gknf;
        }
    }
}
</script>