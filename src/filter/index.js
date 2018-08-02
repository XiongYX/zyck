import Vue from 'vue';

Vue.filter('fx-color', function (value) {// value就是日期值
    let color = '';
    switch (value) {
        case "1":
            color = 'fx-color1'
            break;
        case "2":
            color = 'fx-color2'
            break;
        case "3":
            color = 'fx-color3'
            break;
        case "4":
            color = 'fx-color4'
            break;
        default:
            break;
    }
    return color;
});

Vue.filter('xytxHelp', function (value) {// 院校特性
    let href = '###';
    switch (value) {
        case "0":
            href = '//gaokao.chsi.com.cn/gkxx/gkcs/201112/20111231/384459706.html'
            break;
        case "1":
            href = '//gaokao.chsi.com.cn/gkxx/gkcs/200410/20041001/384459440.html'
            break;
        case "2":
            href = '//yz.chsi.com.cn/kyzx/kp/201101/20110119/161300374.html'
            break;
        default:
            break;
    }
    return href;
});

Vue.filter('changeNum', function (value) {// 转化数字
    let $num = parseInt(value);
    if ($num >= 10000) {
        $num = Math.round($num/10000*10)/10 +'W';
    } else if($num >= 1000) {
        $num = Math.round($num/1000*10)/10 + 'K';
    }
    return $num;
});

Vue.filter('encodeYx', function (value) {// 转义院校名称
    return '/sch/schoolInfoMain--yxmc-'+encodeURI(encodeURI(value))+'.dhtml';
});

Vue.filter('encodeZy', function (key,value) {// 转义专业名称
    return '/zyk/zybk/specialityDetail.action?zydm='+key+'&zymc='+encodeURI(encodeURI(value));
});

Vue.filter('zyIndex', function (value) {// 转义专业名称
    let zhyIndex = '一';
    switch (value) {
        case 0:
            zhyIndex = '一';
            break;
        case 1:
            zhyIndex = '二';
            break;
        case 2:
            zhyIndex = '三';
            break;
        case 3:
            zhyIndex = '四';
            break;
        case 4:
            zhyIndex = '五';
            break;
        default:
            break;
    }
    let zhy = zhyIndex + '志愿';
    return zhy;
});