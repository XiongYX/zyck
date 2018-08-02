<template>
    <div class="ch-sticky">
        <div class="layout">
            <Layout>
                <template v-if="isFinish!=''">
                    <template v-if="isMember">
                        <zyck-header></zyck-header>
                    </template>
                    <template v-else>
                        <buy-header></buy-header>
                    </template>
                </template>
                <Content :style="{padding: '40px 0 40px 0'}">
                    <Card :style="{width: '1180px' , margin: '0 auto'}" dis-hover>
                        <div style="min-height: 200px;">
                            <router-view v-wechat-title="$route.meta.title"></router-view>
                        </div>
                    </Card>
                </Content>
                <Modal v-model="loginTimeOut"  :closable="false" :mask-closable="false" title="提示">
                   <div>
                    <Icon type="android-alert" color="#f26317" size="36" style="vertical-align: -8px; margin-right: 10px;" />
                       <span style="font-size: 14px;">会话已过期，请 <a href="#"  @click.stop.prevent="reload">重新登录</a> 。</span>
                    </div>
                   <div slot="footer">
                    <Button type="primary" size="large" @click.stop.prevent="reload">确定</Button>
                    </div>
        
                </Modal>
            </Layout>
        </div>
        <zyck-footer></zyck-footer>
        <BackTop></BackTop>
        <loading :loading="false"></loading>
    </div>
</template>
<script>

    import buyHeader from './common/buyheader'
    import loading from './common/loading'
    import zyckHeader from './common/mainheader'
    import zyckFooter from './common/mainfooter'
    export default {
        name: 'layout',
        components: {
            zyckHeader,
            zyckFooter,
            buyHeader,
            loading
        },
        methods:{
            reload(){
                window.location.reload(true);
            }
        },
        computed: {
            loginTimeOut(){
                this.$store.commit('changeLoading', false);
                return this.$store.state.loginTimeOut;
            },
            isMember(){
                return this.$store.state.isMember;
            },
            isFinish(){
                return this.$store.state.userName;
            },
            gknf(){
                return this.$store.state.gknf;
            }
        }
    }
</script>