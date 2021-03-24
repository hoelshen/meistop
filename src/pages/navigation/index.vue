<template>
  <div class="appDiv flex column" />
</template>
<script>
import shareMix from "@/mixins/mixin";
import { promisify } from "@/utils/index";
export default {
  mixins: [shareMix],
  data() {
    return {
      autoPhone: true,
      focusInput: true,
      longitude: "",
      latitude: "",
      polyline: '',
      code: "",
      user: {},
      cars: [],
      form: {
        destination: '',
        location: ''
      },
      routeInfo: ''
    };
  },
  methods: {},
  onShow() {
    const { user } = getApp().globalData;
    this.user = user;
    let _this = this;
        const {
      currentRoute: { query }
    } = this.$router;
    const point = JSON.parse(query.form);
    const lng = point.longitude || "";
    const lat = point.latitude || "";
    const addr = point.name || "";
    this.form.name = addr;
    this.form.lat = lat;
    this.form.lng = lng;
    console.log("res: ", lng, lat);

    let key = 'I63BZ-X27CJ-E3QF4-K2G4Y-T7FGF-E3FDU';  //使用在腾讯位置服务申请的key
    let referer = '美停AI';   //调用插件的app的名称
    let navigation = 1;
    let endPoint = JSON.stringify({  //终点
        'name': addr,
        'latitude': lat,
        'longitude': lng,
    });
    console.log('xxx', key, referer, endPoint, navigation )
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=' + navigation
    });

  },
  methods:{
    bindLocation(e){
      console.log('e', e.detail.value)
    },
    bindDestination(e){
      console.log('e', e.detail.value)
    }
  }
};
</script>
<style lang="less" scoped>
.appDiv {
  margin: 40rpx 40rpx;
  min-height: 90vh;
  background-color: #ffffff;
  padding: 20rpx 0;
}
.text {
  background-color: #ffffff;
  min-height: 600rpx;
  padding: 40rpx;
  color: rgba(189, 189, 192, 1);
}
.textNameSpan {
  color: #4d495b;
  font-size: 32rpx;
  margin-bottom: 16rpx;
  margin-top: 40rpx;
}
.textAdd {
  padding-bottom: 60rpx;
}

.input {
  height: 84rpx;
  padding-left: 20rpx;
  background-color: rgba(189, 189, 192, 0.1);
}
.autoPhone {
  height: 84rpx;
  width: 100%;
  background: rgba(189, 189, 192, 0.1);
  padding-left: 20rpx;
}

button.countdown {
  padding: 0;
  margin: 0;
  font-size: 28rpx;
  color: #bdbdc0;
  background-color: transparent;
}

button.lightButton {
  height: 92rpx;
  font-size: 32rpx;
  padding: 26rpx 102rpx;
}
.towast {
  font-size: 32rpx;
  color: #4d495b;
  margin: 40rpx 0;
  line-height: 46rpx;
}
</style>
