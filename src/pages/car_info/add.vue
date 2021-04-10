<template>
  <div>
    <div class="appDiv flex column">
      <div class="flex column j-between">
        <div class="flex center">
          <span class="textNameSpan">停车场名称</span>
          <input
            class="input grow"
            maxlength="11"
            :focus="focusInput"
            :value="form.name"
            @input="bindName"
          >
        </div> 
        <div class="flex center">
          <span class="textNameSpan">楼层</span>
          <input
            class="input grow"
            maxlength="11"
            :value="form.floor"
            @input="bindFloor"
          >
        </div>
        <div class="flex center">
          <span class="textNameSpan">车位号</span>
          <input
            class="input grow"
            maxlength="11"
            :value="form.pno"
            @input="bindPno"
          >
        </div>
        <div class="flex center">
          <span class="textNameSpan">地址定位</span>
          <div
            class="input grow"
            maxlength="11"
            @click="bindAddr"
          >
            {{ form.addr }}
          </div>
        </div>
        <div class="flex flex-start">
          <span class="textNameSpan">入口照片</span>
          <image
            v-if="!form.picPng"
            class="addPhoto testPng"
            src="/static/png/addCar.png"
            @click="upFile"
          />
          <image
            v-else
            class="addPhoto"
            :src="form.picPng"
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

export default {
  mixins: [shareMix],
  data() {
    return {
      autoPhone: true,
      focusInput: true,
      form: {
        name: '',
        floor: '',
        pno: '',
        pic: '',
        picPng: '',
        addr: '测试',
        lat: '', 
        lng: ''
      },
      code: "",
      user: {}
    };
  },
  methods: {
    bindName(e){
        this.form.name = e.detail.value;
    },
    bindFloor(e){
        this.form.floor = e.detail.value;
    },
    bindPno(e){
        this.form.pno = e.detail.value;
    },
    bindAddr(e){
      this.$router.push({
        path: "/pages/car_info/map"
      })
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
          that.form.pic = tempFilePaths[0];
          wx.hideLoading();
          that.$request.uploadFile(tempFilePaths[0]).then(
            function(res) {
              let data = JSON.parse(res.data);
              console.log('data', data);
              that.form.picPng = data.result.items[0].httppath;
              that.form.pic = data.result.items[0].filename;
              wx.hideLoading();
            }.bind(that)
          );
        }.bind(this),
        fail(e) {
          wx.hideLoading();
        }
      });
    },
    addCar(){
      console.log('this', this.form)
      const { name, floor, pno, pic, addr, lat, lng } = this.form;

      this.$request.post("/pinfo/add.html", { name, floor, pno, pic, addr, lat, lng }).then((res)=>{
        console.log('res', res)
      });
    }
  },
  onShow() {

  },
  onLoad(options){
    const _this = this;
    console.log('options.query', options.query)
    console.log('options', options)
    console.log('options.address', options.address)
    
    if(options.address === undefined){
      wx.getLocation({
        type: "gcj02",
        altitude: true, //高精度定位
        success: function(res) {
          // 设置坐标
          console.log('res', res);
          _this.form.lng = res.longitude.toFixed(2);
          _this.form.lat = res.latitude.toFixed(2);
        },
        fail: function(err) {},
      });
      _this.$qqmapsdk.reverseGeocoder({
        success: function (res) {
          console.log('res', res)
          _this.form.addr = res.result.address
        },
        fail: function (res) {
          //console.log(res);
        },
        complete: function (res) {
          //console.log(res);
        }
      });
    } else {
      this.form.addr = options.address
      this.form.lat = options.latitude
      this.form.lng = options.longitude;
    }
  },
  onShareAppMessage: function (res) {
    this.addCar();
    const { name, floor, pno, addr, lat, lng } = this.form;
    let Point = JSON.stringify({  //终点
        'name': addr,
        'latitude': lat,
        'longitude': lng,
    });
    return {
      title: `${name}-${floor}-${pno}-${addr}`,
      path: '/pages/navigation/index?form=' + Point,
      imageUrl: this.form.picPng,  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        console.log('res', res)
	      // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
        wx.reLaunch({
          url: "/pages/home/index"
        });
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
.testPng{
  width: 20px;
  height: 20px;
}
</style>
