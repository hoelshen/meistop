import App from "./App";
import Vue from "vue";
import VHtmlPlugin from "@megalo/vhtml-plugin";
import filters from "./utils/filters";
import megaloRouter from "megalo-router";
import request from "./utils/request";
import day from "./utils/day";

Vue.use(VHtmlPlugin);
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

Vue.use(megaloRouter, {
  mode: "strict" // strict or loose 可配置项，不配置的话默认为strict
});

Vue.prototype.$request = request;
Vue.prototype.$day = day;

const app = new Vue(App);
app.$mount();

export default {
  config: {
    cloud: true,
    pages: [
      "pages/home/index", //首页
      "pages/payMent/index", //设置笔名
      "pages/webview/index", //webview
      "pages/addCar/index", //店铺清扫
      "pages/carManage/index", //carManage,
      "pages/errors/index", //错误页面,
      "pages/bindPhone/index", // 绑定手机 
      "pages/bindPhone/detail", // 绑定手机 
      "pages/payMent/paySuccess" //支付完成
    ],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序的位置展示"
      }
    },
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fffefb",
      navigationBarTitleText: "智联信通",
      navigationBarTextStyle: "black",
      backgroundColor: "#fffefb"
    },
    navigateToMiniProgramAppIdList: [
      "wx70677f7a3878565b",  //签约小程序
      "wx70677f7a3878565b"   //微信代付 用户还款小程序 商户号
    ]
  }
};