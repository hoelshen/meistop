<template>
  <div>
    <div class="appDiv flex column">
      <div class="flex column j-between">
        <div class="flex center">
          <span class="textNameSpan">停车场名称</span>
          <input
            class="input grow"
            maxlength="11"
            type="number"
            :focus="focusInput"
            :value="form.positionName"
            @input="bindPhoneNumber"
          >
        </div> 
        <div class="flex center">
          <span class="textNameSpan">楼层</span>
          <input
            class="input grow"
            maxlength="11"
            type="number"
            :focus="focusInput"
            :value="form.floor"
            @input="bindPhoneNumber"
          >
        </div>
        <div class="flex center">
          <span class="textNameSpan">车位号</span>
          <input
            class="input grow"
            maxlength="11"
            type="number"
            :focus="focusInput"
            :value="form.carNo"
            @input="bindPhoneNumber"
          >
        </div>
        <div class="flex center">
          <span class="textNameSpan">地址定位</span>
          <input
            class="input grow"
            maxlength="11"
            type="number"
            :focus="focusInput"
            :value="form.positionInfo"
            @input="toMap"
          >
        </div>
        <div class="flex flex-start">
          <span class="textNameSpan">入口照片</span>
        </div>
        <div class="flex center column">
          <image
            v-if="!form.positionPng"
            class="addPhoto testPng"
            src="/static/png/addCar.png"
            @click="upFile"
          />
          <image
            class="addPhoto"
            :src="form.positionPng"
          />
        </div>
      </div>
      <div class="flex column textAdd center">
        <button 
          class="lightButton flex center"
          :data-info="form"  
          open-type="share" 
          hover-class="none"
        >
          分享车位信息
        </button>
      </div>
    </div>
  </div>
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
      form: {
        positionName: '海峡明珠广场',
        floor: '地下1层',
        carNo: '205',
        positionInfo: '',
        positionPng: ''
      },
      code: "",
      user: {}
    };
  },
  methods: {
    bindPhoneNumber(e) {
      this.form.phoneNumber = e.detail.value;
    },
    hold() {
      const { phoneNumber, code } = this.form;
      if (/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber) == false) {
        return wx.showToast({
          icon: "none",
          title: "请输入正确的手机号"
        });
      }
      this.$request.post("/user/bind.html", { mobile: phoneNumber }).then(res => {
        wx.showToast({
          title: "发送成功"
        });
      });
      this.$router.push({
        query: { phoneNumber },
        path: "/pages/bindPhone/detail"
      });
    },
    sharePosition(){
        
    },
    upFile(){
      let sourceType = ['album', 'camera'];
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: sourceType,
        success: function(res) {
          wx.showLoading({
            title: "上传中",
            mask: true
          });
          const tempFilePaths = res.tempFilePaths;
          console.log('tempFilePaths', tempFilePaths);
          that.form.positionPng = tempFilePaths[0];
          wx.hideLoading();

          return
          that.$request.uploadFile(tempFilePaths[0]).then(
            function(res) {
              let data = res.data;
              console.log('data', data);
              
              console.log('data', data);
              that.form.positionPng = data;
              wx.hideLoading();
            }.bind(that)
          );
        }.bind(this),
        fail(e) {
          wx.hideLoading();
        }
      });
    },
    toMap(){
      this.$router.push({
        path: "/pages/car_info/map"
      });
    }
  },
  onShow() {
    const { user } = getApp().globalData;
    this.user = user;
  },
  onShareAppMessage: function (res) {
    console.log('res', res);
    let form = res.target.dataset.info;
    console.log('form', form)
    const {positionName, floor, carNo, positionInfo, positionPng } = form;
    return {
      title: `${positionName}-${floor}-${carNo}-${positionInfo}`,
      path: '/pages/navigation/index?form=' + form,
      imageUrl: this.form.positionPng,  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        console.log('res', res)
	   // 转发成功
	        wx.showToast({
	          title: "分享成功",
	          icon: 'success',
	          duration: 2000
	        })
       },
      fail: function (res) {
        // 分享失败
      },
    }
  },

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
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  width: 200rpx;
}
.textAdd {
  padding-bottom: 60rpx;
}

.input {
  margin: 20rpx;
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
