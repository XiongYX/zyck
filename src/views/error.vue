<template>
    <div>
        <Alert type="warning" show-icon>
            <template slot="desc"><span style="font-size: 16px;">服务异常，请稍后再试！</span></template>
        </Alert>
        <div style="text-align: center;">
            <Button style="width: 120px; margin-top: 20px;" size="large" type="primary" :disabled="disable" @click="goresult()">重试
                <template v-if="disable">（{{countSecond}}）</template>
            </Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'error',
        data() {
            return {
                disable: true,
                countSecond:5
            }
        },
        methods: {
            count () {
                let int = setInterval(()=>{
                    if (this.countSecond > 1) {
                        --this.countSecond
                    } else {
                        this.disable = false;
                        clearInterval(int);
                    }
                },'1000')
            },
            goresult () {
                window.location.href = '/zyck/stu/';
            }
        },
        mounted () {
            this.count();
        }
    }
</script>
