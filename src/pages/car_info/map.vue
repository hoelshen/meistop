<template>
  <div class="faq flex column">
    <map
      id="map"
      :longitude="lng"
      :latitude="lat"
      scale="14"
      :markers="markers"
      :enable-scroll="true"
      :circles="circles"
      show-location
      :include-points="markers"
      style="width: 100%; height: 100vh;"
      @controltap="controltap"
      @markertap="markertap"
      @regionChange="regionChange"
      @end="regionChangeend" @start="regionChangestart"
    >
      <cover-image
        class="cover-image"
        src="/static/png/location.jpg"
        @bindtap="my_location"
      />
    </map>
  </div>
</template>

<script>
import shareMix from "@/mixins/mixin";
export default {
  mixins: [shareMix],
  data() {
    return {
      userInfo: "",
      cars: [],
      lng: '',
      lat: '',
      markers: [],
      circles:[]
    };
  },
  onShow() {
    const { user } = getApp().globalData;
    var that = this;
    wx.getLocation({
      type: "gcj02",
      altitude: true, //高精度定位
      success: function(res) {
        // 设置坐标
        that.lng = res.longitude.toFixed(2);
        that.lat = res.latitude.toFixed(2);
      },
      fail: function(err) {},
    });
    console.log('sd', this.$qqmapsdk)

    this.$qqmapsdk.reverseGeocoder({
      success: function (res) {
        console.log('res', res)
        that.address = res.result.address
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });

  },
  methods: {
    markertap(e) {
      const that = this;
      console.log('e', e);
    },
    controltap(e){
      console.log('e', e);

    },
    regionChangeend(e){
      console.log(1)
    },
    regionChangestart(e){
      console.log(2)

    },
    //视野发生变化
    regionchange(e) {
      console.log('regionchange', e)
      // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
      if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
        console.log('e', e)
        var that = this;
        this.mapCtx = wx.createMapContext("map4select");
        this.mapCtx.getCenterLocation({
          type: 'gcj02',
          success: function(res) {
            console.log(res)
            that.latitude = res.latitude,
            that.longitude = res.longitude,
            this.circles = [{
                latitude: res.latitude,
                longitude: res.longitude,
                color: '#FF0000DD',
                fillColor: '#d1edff88',
                radius: 3000,//定位点半径
                strokeWidth: 1
              }]
          }
        })
      }
    },
    //定位到自己的位置事件
    my_location: function(e) {
      var that = this;
      that.onLoad();
    },
  },
  onUnload(e){
    getApp().globalData.positionAddress = this.address;
    console.log('e' , this.address)
  }
};
</script>

<style scoped lang="less">
.my_info {
  min-height: 326rpx;
  margin: 0rpx 0rpx;
  background-color: #ffffff;
  &_user {
    &_badgeBtn {
      padding: 0;
      margin-left: 12rpx;
    }
    &_badge {
      width: 60rpx;
      height: 60rpx;
    }
    &_avatarUrl {
      display: block;
      border-radius: 50%;
      height: 88rpx;
      width: 88rpx;
    }
    &_nickName {
      font-weight: 600;
      height: 84rpx;
      font-size: 60rpx;
      text-align: center;
      color: #4d495b;
    }
    &_address {
      height: 40rpx;
      font-size: 32rpx;
      text-align: center;
      color: #bdbdc0;
      margin-top: 20rpx;
      margin-bottom: 60rpx;
    }
  }
  .carItem {
    padding: 40rpx 20rpx;
    border-bottom-width: 2rpx;
    border-bottom-style: solid;
    border-bottom-color: #bdbdc0;
    .cancel {
      font-size: 32rpx;
      color: #999999;
      margin-right: 30rpx;
    }
  }
  .card {
    margin: 40rpx 20rpx;
    background-color: #ffffff;
    box-shadow: 3rpx 4rpx 6rpx 3rpx rgba(1, 191, 135, 0.7);
    border-radius: 20rpx;
  }
}
.carPhone {
  width: 100%;
  height: 100rpx;
  font-size: 14px;
  display: flex;
  height: inherit;
  align-items: center;
  flex-direction: column;
  background-size: contain;
  background-repeat: no-repeat;
  &_head{
    width: 100%;
    justify-content: space-between;
  }
  &_body{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 0 0;
    &_item{
      align-items: flex-start;
    }
  }
}
.autopay {
  width: 100rpx;
  height: 50rpx;
}
.div_autopay {
  margin-right: 30rpx;
}
&_item {
  &_button {
    width: 100%;
    height: 88rpx;
    padding: 0rpx 40rpx;
    align-items: center;
    color: #4d495b;
    background-color: #ffffff;
  }
  &_img {
    height: 36rpx;
    width: 36rpx;
    margin: 18rpx 20rpx;
  }
  &_text {
    margin-left: 20rpx;
    font-size: 32rpx;
    text-align: left;
  }
}
.group {
  width: 72rpx;
  height: 72rpx;
  margin-right: 20rpx;
}
.lightButton {
  height: 64rpx;
  margin: 40rpx;
  font-size: 32rpx;
}
.header-bg_img {
  width: 100%;
}
.block_div {
  margin-top: 30rpx;
}


.iconfont_sixteen{
  width: 32rpx;
  height: 32rpx;
}
.cover-image{
  width: 32rpx;
  height: 32rpx;
}
</style>

