<style lang="less" scoped>
.zyck-loading {
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(255,255,255,0.8);
    z-index: 10000;
    top: 0;
    left: 0;
}
.spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
    margin-top:-30px;
    width: 50px;
    height: 60px;
    text-align: center;
    font-size: 10px;
}
 
.spinner > div {
    background-color: #45bb93;
    height: 100%;
    width: 6px;
    display: inline-block;
    -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
    animation: stretchdelay 1.2s infinite ease-in-out;
}
 
.spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}
 
.spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
}
 
.spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}
 
.spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}
 
@-webkit-keyframes stretchdelay {
    0%, 40%, 100% { -webkit-transform: scaleY(0.4) } 
    20% { -webkit-transform: scaleY(1.0) }
}
 
@keyframes stretchdelay {
    0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
    }  20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
    }
}
</style>
<template>
    <div id="zyck-loading">
        <div class="zyck-loading" v-if="loading">
            <div class="spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    computed: {
        loading () {
            return this.$store.state.loading;
        }
    }
}
</script>