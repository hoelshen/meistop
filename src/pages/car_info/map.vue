<template>
  <div class="faq flex column">
    <map
      id="map"
      :longitude="log"
      :latitude="lat"
      scale="14"
      :markers="markers"
      show-location
      :include-points="markers"
      style="width: 100%; height: 100vh;"
      @markertap="markertap"
    />
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
    };
  },
  onShow() {
    const { user } = getApp().globalData;
    var that = this;
    this.$request.post("/orderinfo.html").then((res) => {
      if (res && res.result) {
        that.cars = res.result.items;
      }
    });
    console.log("this.car", that.cars);
  },
  methods: {
    toPayInfo() {
      this.$router.push({
        query: { carno: item.carno },
        path: "/pages/payMent/index",
      });
    },
    markertap(e) {
      const that = this;
    //   const placeId = e.markerId
    //   this.$request
    //   .post("/location/getPlace.do"	,{
    //     placeId
    //   })
    //   .then(res => {
    //    const data = res.list[0];
    //    const markets = that.markers;
 
    //     that.markers = markets;
    //   })
    //   .catch(err => {
    //     return wx.showToast({
    //       title: "获取失败",
    //       icon: "none"
    //     });
    //   }); 
    },
  },
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
</style>

