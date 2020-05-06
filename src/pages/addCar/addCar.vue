<template>
  <view class="page">
    <!-- 增加车辆 -->
    <view class="header">
      <div
        class="tool-bar"
        style="background-color: #ffffff"
        :style="{
          height: tool_height + 'px'
        }"
      />
      <div
        :style="{
          height: title_height + 'px'
        }"
        class="addCar_header"
      >
        <view
          :style="{
            height: title_height + 'px'
          }"
          style="margin-left: 30rpx;"
          class="flex a-center title"
        >
          智联信通
        </view>
      </div>
      <view class="">
        <img
          class="header-bg_img"
          src="/static/png/bgone.png"
          alt=""
        >
      </view>
      <div class="car_btn flex column center">
        <div class="flex column car_block">
          <keyboard
            class="kb"
            :plate-num.sync="plateNum"
            :show.sync="showKeyboard"
            extra-key="查询缴费"
            base-border="d6d6d6"
            @keyboard="keyboardChange"
          />
        </div>
        <div
          class="flex center lightButton"
          @click="openKeyBoard"
        >
          下一步
        </div>
      </div>
    </view>
  </view>
</template>

<script>
import shareMix from "@/mixins/mixin";
import keyboard from "@/components/keyboard";
export default {
  components: { keyboard },
  mixins: [shareMix],
  data() {
    return {
      showKeyboard: false,
      plateNum: "",
      tool_height: "",
      statusbarHeight: "",
      title_height: ""
    };
  },
  methods: {
    keyboardChange(e) {
      this.plateNum = e;
      this.navCar();
    },
    openKeyBoard() {
      if (this.plateNum && this.plateNum.length > 6) {
        this.navCar();
      } else {
        uni.showToast({
          icon: "none",
          title: "请输入完整的车牌号",
          mask: true,
          duration: 2000
        });
      }
    },
    async navCar() {
      this.$request
        .post("/bindcar.html", { carno: this.plateNum })
        .then(res => {
          wx.showToast({
            title: "绑定成功"
          });
          wx.reLaunch({
            url: "/pages/home/index"
          });
        })
        .catch(err => {
          console.log("err: ", err);
          return;
        });
    }
  },
  onShow() {
    let res = wx.getSystemInfoSync();
    console.log("res: ", res);
    // 导航栏总高度 & 占位块高度
    // {
    //       'iPhone': 64,
    //       'iPhoneX': 88,
    //       'Android': 68,
    //       'samsung': 72
    // }
    let isiOS = res.system.indexOf("iOS") > -1;
    let totalBar;
    if (!isiOS) {
      const model = res.model;
      if (model.match("samsung")) {
        totalBar = 34;
      } else {
        totalBar = 36;
      }
    } else {
      const model = res.model;
      if (model.match("iPhone X")) {
        totalBar = 44;
      } else {
        totalBar = 32;
      }
    }

    // 时间、信号等工具栏的高度
    let toolBar = res.statusBarHeight;
    this.tool_height = res.statusBarHeight;
    
    // 页面title栏的高度
    this.title_height = totalBar * 2 - toolBar;
  }
};
</script>

<style scoped lang="less">
.addCar_header {
  width: 100%;
  background: #ffffff;
  z-index: 3;
}

.header-bg {
  position: fixed;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  z-index: 3;
  &_img {
    width: 100%;
  }
}
.title {
  color: #2a2a2a;
  font-size: 32rpx;
}
.car_btn {
  position: relative;
  top: -30rpx;
  .lightButton {
    margin-bottom: 20rpx;
    margin-top: 0rpx;
    height: 64rpx;
    position: absolute;
    top: 120rpx;
    width: 726rpx;
    font-size: 32rpx;
  }
}
.car_block {
  position: absolute;
  background-color: #ffffff;
  width: 726rpx;
  border-radius: 20rpx;
  box-shadow: 3rpx 4rpx 6rpx rgba(1, 191, 135, 0.7);
}
.kb {
  .kb-keyboard {
    .kb-keyboard__panle {
      bottom: 150rpx;
    }
  }
}
</style>
