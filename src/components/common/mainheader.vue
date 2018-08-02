<template>
    <div>
        <Header>
            <Menu mode="horizontal" theme="dark" :active-name="activeName">
                <MenuItem name="logo" style="cursor: default;">
                    <h1 class="logo">高考填报志愿综合参考系统</h1>
                </MenuItem>
                <Submenu name="zhy" class="zyck-nav">
                    <template slot="title"><span class="zyck-menu-title">填志愿</span>
                    </template>
                    <MenuItem name="yxlist"><router-link to="/tzy/yxfirst">院校优先</router-link></MenuItem>
                    <MenuItem name="zylist"><router-link to="/tzy/zyfirst">专业优先</router-link></MenuItem>
                </Submenu>
                <MenuItem name="cp" class="zyck-nav">
                    <template v-if="cpResult">
                        <router-link to="/cpresult">专业心理测评</router-link>
                    </template>
                    <template v-else>
                        <a href="/zyck/cp/xqcp.action?from=zyck">专业心理测评</a>
                    </template>
                </MenuItem>
                <MenuItem name="zhylist" class="zyck-nav">
                    <router-link to="/zhylist">我的志愿表</router-link>
                </MenuItem>
                <MenuItem name="user" class="zyck-nav">
                    <router-link to="/usermsg">会员信息</router-link>
                </MenuItem>
                <MenuItem style="float: right; margin-right: 0;" name="out"><a href="/zyck/logout">退出</a>
                </MenuItem>
                <li class="username ivu-menu-item" style="float: right; margin: 0; padding: 0;" :title="userName">
                    <a href="//account.chsi.com.cn/account/account!show" target="_blank" style="padding-left: 0;">
                        <Icon type="android-contact" size="30"></Icon>
                        <template v-if="userName!=''">
                            {{userName}}
                        </template>
                        <template v-else>未知</template>
                    </a>
                </li>
                <li class="ivu-menu-item" style="float: right;">
                    <a href="/zyck/">首页</a>
                </li>
            </Menu>
            <template v-if="!isMember">
                <div class="cover-header"></div>
            </template>
        </Header>
    </div>
</template>

<script>
    export default {
        name: 'mainHeader',
        computed: {
            userName () {
                return this.$store.state.userName;
            },
            isMember () {
                return this.$store.state.isMember;
            },
            activeName () {
                if (this.$route.meta.activename) {
                    return this.$route.meta.activename;
                } else {
                    return '';
                }
            },
            cpResult () {
                return this.$store.state.cpResult;
            }
        }
    }
</script>
