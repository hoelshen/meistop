<template>
  <view class="page flex column">
    <div class="my_info flex column">
      <div
        :style="{
          height: title_height + 'px'
        }"
        class="home_header "
      >
      <view
        :style="{
          height: title_height + 'px'
        }"
        style="color: black;"
        class="title flex j-between "
      >
        <span style="margin:20rpx;">
          车牌号：{{ car.carno || "暂无" }}
        </span>
        <span style="margin:20rpx;">
          查看发票
        </span>
      </view>
    </div>
      <div class="info flex center column">
        <img
          class="avatarUrl"
          src="/static/png/paySuccess.png"
          mode="scaleToFill"
        >
        <span class="paySuceess">已支付{{ Number.parseFloat(car.money).toFixed(2) || "暂无" }}元</span>
        <!-- <div>温馨提示： 请在{{}} 前驶离停车场，超时将产生新的费用</div> -->
      </div>
      <div
        v-if="car"
        class="flex card column"
      >
        <div
          class="flex cancel center "
          @click="cancel(item.carno)"
        >
          <span class="formatTimer" />
        </div>
        <div class="block_div payDiv flex  center ">
          <span class=" payCount grow">支付明细</span>
        </div>
        <div class="flex j-between block_div">
          <span class="left grow">实际支付（微信无感支付）</span>
          <span class="right">{{ car.money || "暂无" }}</span>
        </div>
        <div class="flex j-between block_div">
          <span class="left grow">支付时间</span>
          <span class="right">{{ car.startts || "暂无" }}</span>
        </div>
        <div class="block_div flex  center ">
          <span class="left grow">交易单号</span>
          <span class="right">{{ car.id || "暂无" }}</span>
        </div>
        <div class="block_div payDiv flex  center ">
          <span class=" payCount grow">临停记录</span>
        </div>
        <div class="block_div flex  center ">
          <span class=" left grow">停车场</span>
          <span class="right">{{ car.address || "暂无" }}</span>
        </div>
        <div class="block_div flex  center ">
          <span class=" left grow">停车时长</span>
          <span class="right">{{ car.timess || "暂无" }}</span>
        </div>
        <div class="block_div flex  center ">
          <span class=" left grow">入场时间</span>
          <span class="right">{{ car.startts || "暂无" }}</span>
        </div>
        <div class="block_div flex  center ">
          <span class=" left grow">出场时间</span>
          <span class="right">{{ car.endts || "暂无" }}</span>
        </div>
        <div class="block_div flex  center ">
          <span class=" left grow">合计</span>
          <span class="right">{{ car.money || "暂无" }} 元</span>
        </div>
      </div>
      <div
        v-else
        class="flex center"
      >
        暂无数据
      </div>
    </div>
  </view>
</template>
<script>
import shareMix from "@/mixins/mixin";
export default {
  mixins: [shareMix],
  data() {
    return {
      userInfo: {
        aliasName: "",
        aliasPortrait: ""
      },
      car: {
        address: "",
        startts: "",
        times: "",
        autopay: "",
        money: "",
        status: "",
        d: "",
        carno: ""
      },
      formid: "",
      orderid: "",
      title_height: "",
      statusbarHeight: "",
      tool_height: ""
    };
  },
  computed: {
    formatTimer() {
      /**
       * 将秒转换为年月日时分秒
       **/
      if (!this.car.timess) {
        return this.car.timess;
      }
      const value = this.car.timess;
      var year_1 = 3600 * 24 * 30 * 12;
      var month_1 = 3600 * 24 * 30;
      var day_1 = 3600 * 24;
      var hour_1 = 3600;
      var minute_1 = 60;
      var year = 0,
        month = 0,
        day = 0,
        hour = 0,
        minute = 0,
        second = 0;
      if (value <= 0) {
        return "No Time";
      } else if (value < minute_1) {
        // 小于一分钟
        second = value;
      } else if (value < hour_1) {
        // 小于一小时
        minute = parseInt(value / minute_1);
        second = parseInt(value % minute_1);
      } else if (value < day_1) {
        // 小于一天
        hour = parseInt(value / hour_1);
        minute = parseInt((value % hour_1) % minute_1);
        second = parseInt((value % hour_1) / minute_1);
      } else if (value < month_1) {
        // 小于一月
        day = parseInt(value / day_1);
        hour = parseInt((value % day_1) / hour_1);
        minute = parseInt(((value % day_1) % hour_1) / minute_1);
        second = parseInt(((value % day_1) % hour_1) % minute_1);
      } else if (value < year_1) {
        // 小于一年
        month = parseInt(value / month_1);
        day = parseInt((value % month_1) / day_1);
        hour = parseInt(((value % month_1) % day_1) / hour_1);
        minute = parseInt((((value % month_1) % day_1) % hour_1) / minute_1);
        second = parseInt((((value % month_1) % day_1) % hour_1) % minute_1);
      } else {
        // 大于一年
        year = parseInt(value / year_1);
        month = parseInt((value % year_1) / month_1);
        day = parseInt(((value % year_1) % month_1) / day_1);
        hour = parseInt((((value % year_1) % month_1) % day_1) / hour_1);
        minute = parseInt(
          ((((value % year_1) % month_1) % day_1) % hour_1) / minute_1
        );
        second = parseInt(
          ((((value % year_1) % month_1) % day_1) % hour_1) % minute_1
        );
      }
      year = year == 0 ? "" : year + " 年 ";
      month = month == 0 ? "" : month + " 月 ";
      day = day == 0 ? "" : day + " 天 ";
      hour = hour == 0 ? "" : hour + " 时 ";
      minute = minute == 0 ? "" : minute + " 分 ";
      second = second + " 秒 ";
      return year + month + day + hour + minute + second;
    }
  },
  methods: {
    paySubmit(e) {
      this.formid = e.detail.formId;
    },
    onReturn() {
      wx.reLaunch({
        url: "/pages/home/index"
      });
    },
    resultFormat(result) {
        var h = Math.floor(result/3600%24);
        var m = Math.floor(result/60%60);
        if (h < 1) {
            return result = m + "分钟";
        } else {
            return result = h + "小时" + m + "分钟";
        }
    }
  },
  onShow() {
    const {
      currentRoute: { query }
    } = this.$router;
    let res = wx.getSystemInfoSync();
    const carno = query.carno || "";
    console.log('carno', carno);
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

    this.$request
      .put("/orderinfo.html", { carno })
      .then(res => {
        if (res && res.result && res.result.items.length == 0) {
          return;
        }
        const length = res.result.items.length - 1;
        
        this.car = res.result.items[length];
        this.car.timess = this.resultFormat(this.car.timess)
        console.log("this.car: ", this.car);
        this.orderid = res.result.items[length].id;
      })
      .catch(err => {
        console.log("err: ", err);
        return;
      });
  }
};
</script>
<style lang="less" scoped>
.home_header {
  background-color: #ffffff;
}
.my_info {
  min-height: 326rpx;
  margin: 0rpx 0rpx;
  border-radius: 25px;
  background-color: #ffffff;
  top: -20rpx;
  box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.05);
  & .avatarUrl {
    display: block;
    border-radius: 50%;
    height: 150rpx;
    width: 150rpx;
    margin: 60rpx auto 44rpx;
  }
}
.carPhone {
  margin-left: 20rpx;
}
.card {
  background-color: #ffffff;
  .cancel {
    font-size: 64rpx;
    padding-top: 30rpx;
    .formatTimer {
      font-size: 64rpx;
    }
    .carStatus {
      color: #01bf99;
      font-size: 32rpx;
    }
  }
}

.info {
  & .paySuceess {
    font-size: 32rpx;
    color: #04bb05;
  }
}

.carPhone {
  width: 350rpx;
  height: 100rpx;
  background-size: contain;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAABkCAMAAAD+DbQHAAAAbFBMVEUAAAAocsMocsMocsMocsMocsMocsMocsMocsMocsMocsMocsMocsMocsP///8sdMT6/P7j7Pfc6PaCrdy50eucvuOGsN11pNluoNcvd8b1+Pzn8PlwoddhmNNLic1JiMy0zuqlxOaHsN5Mis0AT+8bAAAADXRSTlMA4VT4qgaJW9sDlNcHfzE0FQAAAhpJREFUeNrt3UduJDEMRmFV6uAZUhU6B8f733HaasGA5wT8gfdtxP1DqbRjKoa2bzpDKN2fvh3Sj3ZjCGnTpqftyhDWapu+0Si0VbnrDKG1KQ2NVfn2Po2OAC7z+y1b1QxpbdVpcgQynaxap96KvHefP1/PhgDOr5+z+z5b0afGir1flmwIIy+j761oUlfOk493Qyj30U9l6NIz29UXQzCLX3MZnpGOPnPXhZNnP9pDjbTzgyGcg+/soUaa/NUQzptP9lAjjc7bO6Dsoz3USO6GgEoXIsVGJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEkAkAUQSQCQBRBJAJAFEEvAr0sVZ2BzQ+dcK09nfDOF8lWXArNUO7blWmwX1kf23oD5ffTEEs/j1XIbUlePm490Qyn30Wxm6tLFi7xe+pVCW0fdWNKm3In+4z4c3/kwhnL8Os/tHrdGntVWnyRHIdLJqnYbGqnzcTaMjgHHaHbNVzd+UWkNobXpYGQJbpW/bF0NYL9v01G4MIW3a9GNY901nCKVr+vWQvv0Dr9RbwMLtTv8AAAAASUVORK5CYII=");
  background-repeat: no-repeat;
  // margin-left: 40rpx;
  &_carno {
    color: white;
    font-size: 54rpx;
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
  background-color: #01bf99;
}
.header-bg_img {
  width: 100%;
  height: 320rpx;
}
.payDiv {
  border-bottom-color: #e5e5e5;
  border-bottom-style: solid;
  border-bottom-width: 2rpx;
}
.block_div {
  margin: 30rpx 0;
  & .checkCarno {
    background-color: #01bf99;
    color: white;
    font-size: 32rpx;
    margin: 0 30rpx 0 54rpx;
  }
  & .payCount {
    font-size: 32rpx;
    margin-left: 30rpx;
  }
  & .left {
    margin-left: 30rpx;
    color: #99999999;
    font-size: 24rpx;
  }
  & .right {
    margin-right: 30rpx;
    font-size: 32rpx;
    color: #99999999;
  }

  & .money {
    font-size: 48rpx;
    color: #ff243e;
    & .rmb {
      font-size: 32rpx;
      margin-right: 5rpx;
    }
  }
}
.submit {
  background-color: #01bf99;
  color: white;
  height: 40px;
}
</style>
