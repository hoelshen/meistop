import App from "./App";
import Vue from "vue";
import VHtmlPlugin from "@megalo/vhtml-plugin";
import filters from "./utils/filters";
import megaloRouter from "megalo-router";
import request from "./utils/request";
import day from "./utils/day";
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
import  QQMapWX from './qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js';

Vue.use(VHtmlPlugin);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

Vue.use(megaloRouter, {
  mode: "strict" // strict or loose 可配置项，不配置的话默认为strict
});

Vue.prototype.$request = request;
Vue.prototype.$day = day;
const qqmapsdk = new QQMapWX({
    key: 'I63BZ-X27CJ-E3QF4-K2G4Y-T7FGF-E3FDU'
});
Vue.prototype.$qqmapsdk = qqmapsdk;

const app = new Vue(App);
app.$mount();

export default {
  config: {
    cloud: true,
    pages: [
      "pages/home/index", //首页
      "pages/webview/index", //webview
      "pages/addCar/index", //店铺清扫
      "pages/carManage/index", //carManage,
      "pages/errors/index", //错误页面,
      "pages/bindPhone/index", // 绑定手机 
      "pages/bindPhone/detail", // 绑定手机 
      "pages/payMent/index", //停车缴费
      "pages/payMent/paySuccess", //支付完成
      "pages/payMent/payDetail", //停车详情
      "pages/car_info/add", //  创建我的车位信息
      "pages/car_info/car_info", //  停车记录
      "pages/car_info/map", //  地图
      "pages/navigation/index" // 驾车导航
    ],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序的位置展示"
      }
    },
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fffefb",
      navigationBarTitleText: "美停",
      navigationBarTextStyle: "black",
      backgroundColor: "#fffefb"
    },
    navigateToMiniProgramAppIdList: [
      "wx70677f7a3878565b",  //签约小程序
      "wx70677f7a3878565b"   //微信代付 用户还款小程序 商户号
    ],
    plugins: {
        routePlan: {
          version: "1.0.12",
          provider: "wx50b5593e81dd937a"
        }
    }
  }
};