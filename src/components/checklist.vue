<style lang="less" scoped>
    .zyck-seach-item {
        border-top: 1px solid #e9eaec;
        &:first-child {
            border-top: none;
        }
    }
    .zyck-seach-label {
        float: left;
        margin: 10px 0;
        padding-right: 10px;
        color: #999;
        height: 30px;
        line-height: 30px;
        text-align: right;
    }
    .zyck-seach-content {
        .zyck-seach-list {
            margin-top: 10px;
        }
        .seach-list-item {
            display: inline-block;
            height: 26px;
            margin: 2px 6px 10px 0;
            padding: 0 10px;
            line-height: 26px;
            &.seach-list-item-checked {
                color: #1EA779;
                background: #e2f5ef;
            }
            &:hover{
                cursor: pointer;
            }
        }
    }
</style>
<template>
    <div class="clearfix zyck-seach-item">
        <div class="zyck-seach-label" :style="{'width': labelWidth}">{{listName}}</div>
        <div class="zyck-seach-content" :style="{'margin-left': labelWidth}">
            <ul v-if="!hasSelect" class="zyck-seach-list">
                <li @click="checkItem('')" class="seach-list-item" :class="{'seach-list-item-checked': isALL}">不限</li>
                <template v-for="item in list">
                    <li @click="checkItem(item)" class="seach-list-item" :class="{'seach-list-item-checked': item.checked}">
                        {{item.value}}
                    </li>
                </template>
            </ul>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "checkList",
    data() {
        return {
            code: []
        }
    },
    computed: {
        isALL () {
            return this.code.length===0 ? true : false;
        }
    },
    props: {
        "listName": {
            type: String,
            defalut: ""
        },
        "list": {
            type: Array,
            defalut: []
        },
        "hasSelect": {
            type: Boolean,
            defalut: false
        },
        "labelWidth": {
            type: String,
            defalut: "auto"
        },
        "isHelp": {
            type: Boolean,
            defalut: false
        }
    },
    methods: {
        checkItem(item) {
            if(item==='') {
                this.code = [];
                this.list.forEach((item) => {
                    this.$set(item, 'checked', false);
                })
            } else {
                if(this.code.includes(item.key)){
                    this.$set(item, 'checked', false);
                    this.code.splice(this.code.indexOf(item.key), 1);
                } else {
                    this.$set(item, 'checked', true);
                    this.code.push(item.key);
                }
            }
            this.$emit('check-item',this.code);
        }
    },
    mounted() {
        if (this.code.length===0) {
            if (this.list.length > 0) {
                this.list.forEach((item) => {
                    this.$set(item, 'checked', false);
                })
            }
        }
    }
}
</script>

