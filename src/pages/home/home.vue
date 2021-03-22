<template>
  <div class="page flex column">
    <!-- 首页 -->
    <div
      v-if="tab == 'home'"
      class="pannel grow"
    >
      <scroll-view
        class="entries flex column"
        scroll-y
        :style="`height: ${scrolHeight}px`"
      >
        <div
          class="tool-bar"
          style="background-color: #01bf99"
          :style="{
            height: tool_height + 'px',
          }"
        />
        <div
          :style="{
            height: title_height + 'px',
          }"
          class="home_header "
        >
          <view
            :style="{
              height: title_height + 'px',
            }"
            class="title flex center "
          >
            美停
          </view>
        </div>
        <session class="home_position flex column">
          <map
            id="map"
            :longitude="longitude"
            :latitude="latitude"
            scale="14"
            :controls="controls"
            :markers="markers"
            :polyline="polyline"
            show-location
            style="width: 100%; height: 300px;"
            @controltap="bindcontroltap"
            @markertap="markertap"
            @bindregionchange="regionchange"
          />
          <div
            v-if="cars.length >= 1"
            class="flex column"
          >
            <div
              v-for="item in cars"
              :key="item"
              class="flex carItem j-between"
              @click="toPayMent(item)"
            >
              <div
                class="flex carPhone"
                style="align-items: flex-end;justify-content: center;"
              >
                <div class="position_info flex column position_left">
                  <div class="top">
                    {{ item.name }}
                  </div>
                  <div class="center flex">
                    <div style="width:20%">
                      {{ item.distance }}|
                    </div>
               
                    <div class="positon">
                      {{ item.addr }}
                    </div>
                  </div>
                  <div class="bottom">
                    <div>车位余{{ item.availablecount }} / {{ item.placecounts }}</div>
                  </div>
                </div>
                <div
                  class="carPhone_carno position_right"
                  @click="goToNavigation(item)"
                >
                  <span>导航</span>  
                </div>
              </div>
            </div>
          </div>
        </session>
      </scroll-view>
    </div>

    <!-- 我要缴费 -->
    <div
      v-else-if="tab == 'mail'"
      class="pannel grow"
    >
      <scroll-view
        scroll-y
        :style="`height: ${scrolHeight}px`"
        @scrolltolower="scrolltolower"
      >
        <div
          class="tool-bar"
          style="background-color: #01bf99"
          :style="{
            height: tool_height + 'px',
          }"
        />
        <div
          :style="{
            height: title_height + 'px',
          }"
          class="mine_header"
        >
          <view
            :style="{
              height: title_height + 'px',
            }"
            style="color:#ffffff;font-size: 32rpx;"
            class="mail_title flex center"
          >
            美停
          </view>
        </div>
        <view
          class=""
          style="height:auto"
        >
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
              base-border="01bf99"
              @keyboard="keyboardChange"
            />
          </div>
          <div
            class="flex center lightButton"
            @click="openKeyBoard"
          >
            查询缴费
          </div>
        </div>
        <session class="home_contact card flex column">
          <div
            v-if="cars.length >= 1"
            class="flex column"
          >
            <div
              v-for="item in cars"
              :key="item"
              class="flex carItem j-between"
              @click="toPayMent(item)"
            >
              <div class="flex carPhone center">
                <div class="carPhone_carno">
                  {{ item.carno }}
                </div>
              </div>
              <div
                v-if="item.autoplay == 0"
                class="flex column"
                @click="switch1Change(item.autoplay)"
              >
                <image
                  class="autopay"
                  src="/static/png/autopay1.png"
                />
                自动支付
              </div>
              <div
                v-else
                class="flex column"
                @click="switch1Change(item.autoplay)"
              >
                <image
                  class="autopay"
                  src="/static/png/autopay2.png"
                />
                自动支付
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex center carPark"
          >
            您尚未驶入停车场
          </div>
        </session>
      </scroll-view>
    </div>

    <!-- 我的 -->
    <div
      v-else
      class="pannel grow"
    >
      <scroll-view
        scroll-y
        :style="`height: ${scrolHeight}px`"
        class=" flex column"
      >
        <div
          class="tool-bar"
          style="background-color: #01bf99"
          :style="{
            height: tool_height + 'px',
          }"
        />
        <div
          :style="{
            height: title_height + 'px',
          }"
          class="mine_header "
        >
          <view
            :style="{
              height: title_height + 'px',
            }"
            class="title flex center "
          >
            我的
          </view>
        </div>
        <div class="my_info flex j-start">
          <button
            v-if="!user.aliasPortrait"
            class="my_info_bg"
            style="margin: 0;"
            open-type="getUserInfo"
            lang="zh_CN"
            @getuserinfo="onGotUserInfo"
          >
            <img
              class="my_info_user_avatarUrl"
              src="https://cdn.tellers.cn/tell_v2/static/default-avatar_v2.svg"
              mode="scaleToFill"
            >
          </button>
          <img
            v-else
            class="my_info_user_avatarUrl"
            :src="
              user.aliasPortrait ||
                'https://cdn.tellers.cn/tell_v2/static/default-avatar_v2.svg'
            "
            mode="scaleToFill"
          >
          <div class="flex j-start my_info_user_bingPhone">
            <span @click="hold">
              {{ user.phoneNumber || "绑定你的手机号" }}
            </span>
          </div>
        </div>

        <session class="my_function flex">
          <button
            class="my_function_item_button flex column center payAccount"
            @tap="joinGroup"
          >
            <div class="paycount">
              0.00
            </div>
            <span class="my_function_item_text">账户余额</span>
          </button>

          <button
            class="my_function_item_button flex column center"
            @click="ticket"
          >
            <div class="paycount">
              0
            </div>
            <span class="my_function_item_text">停车券</span>
          </button>

          <button
            class="my_function_item_button flex column center"
            @click="ticket"
          >
            <div class="paycount">
              0.00
            </div>
            <span class="my_function_item_text">积分</span>
          </button>
          <button
            class="my_function_item_button flex column center paybag"
            @click="joinGroup"
          >
            <image 
              class="iconfont" 
              src="/static/png/pay_active.png"
            />
            <span class="my_function_item_text ">我的钱包</span>
          </button>
        </session>

        <session class="my_contact flex column">
          <button
            class="my_contact_item_button flex wrap center grow"
            @click="joinGroup"
          >
            <image 
              class="iconfont" 
              src="/static/png/redeem.png"
            />
            <span class="my_contact_item_text grow">积分兑换</span>
            <image
              class="iconfont_sixteen flex center"
              src="/static/png/arrow.png"
            />
          </button>

          <button
            class="my_contact_item_button flex wrap center grow"
            @click="to_car_info"
          >
            <image 
              class="iconfont" 
              src="/static/png/record.png"
            />
            <span class="my_contact_item_text grow">停车记录</span>

            <image
              class="iconfont_sixteen flex center"
              src="/static/png/arrow.png"
            />
          </button>

          <button
            class="my_contact_item_button flex wrap center grow"
            @click="carManage"
          >
            <image 
              class="iconfont" 
              src="/static/png/carManage.png"
            />
            <span class="my_contact_item_text grow">车辆管理</span>

            <image
              class="iconfont_sixteen flex center"
              src="/static/png/arrow.png"
            />
          </button>

          <button
            class="my_contact_item_button flex wrap center grow"
            @click="joinGroup"
          >
            <image 
              class="iconfont" 
              src="/static/png/question.png"
            />
            <span class="my_contact_item_text grow">问题与反馈</span>
            <image
              class="iconfont_sixteen flex center"
              src="/static/png/arrow.png"
            />
          </button>
          <button
            class="my_contact_item_button flex wrap center grow"
            @click="joinGroup"
          >
            <image 
              class="iconfont" 
              src="/static/png/ticket.png"
            />
            <span class="my_contact_item_text grow">发票</span>

            <image
              class="iconfont_sixteen flex center"
              src="/static/png/arrow.png"
            />
          </button>
          <button
            class="my_contact_item_button flex wrap center grow"
            @click="toNavigation"
          >
            <image 
              class="iconfont" 
              src="/static/png/ticket.png"
            />
            <span class="my_contact_item_text grow">创建我的车位</span>
            <image
              class="iconfont_sixteen flex center"
              src="/static/png/arrow.png"
            />
          </button>
        </session>
      </scroll-view>
    </div>

    <HomeTabbar
      :mail-count="unreadMessages"
      @change="onTabChange"
    />

    <Modal ref="mymodal" />
  </div>
</template>
<script>
import HomeTabbar from "@/components/HomeTabbar";
import Modal from "@/components/Modal";
import shareMix from "@/mixins/mixin";
import keyboard from "@/components/keyboard";

import { mileToKile } from "@/utils/index";

let plugin = requirePlugin('routePlan');
export default {
  components: {
    HomeTabbar,
    Modal,
    keyboard,
  },
  mixins: [shareMix],
  data() {
    return {
      tab: "home",
      banners: [],
      cars: [],
      user: {
        aliasPortrait: "",
        aliasName: "",
        phoneNumber: "",
      },
      form: {
        code: "", // 临时授权码
        encryptedData: "", // 加密数据
        iv: "", // 初始向量
        phoneNumber: 18664306047, //手机号，
        purePhoneNumber: "", //没有区号的手机号
        countryCode: "", //区号,
      },
      scrolHeight: 541,
      toPage: null,
      page: 1,
      showKeyboard: false,
      plateNum: "",
      focusInput: false,
      autoPhone: true,
      title_height: "",
      statusbarHeight: "",
      tool_height: "",
      markers: []
    };
  },
  onLoad(opt) {
    this.toPage = opt.toPage;
    this.tab = opt.tab;
  },
  onShow() {
    if (this.toPage) {
      let toPage = this.toPage;
      this.toPage = null;
      return this.$router.push({
        path: toPage,
        query: this.$mp.query,
      });
    }
    wx.myEvent.on("cars", (e) => {
      this.cars = e;
    });
    this.getScroll();
    this.onTabChange(this.tab);
    wx.getSetting({
      success: function(res) {
        console.log("res: ", res.authSetting["scope.userInfo"]); //出现登录弹窗
        if (res.authSetting && res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo);
            },
          });
        } else {
          this.$refs.mymodal.show();
        }
      }.bind(this),
    });
  },

  methods: {
    onTabChange(tab = "home") {
      console.log("test");
      this.tab = tab;
      if (this.tab === "home") {
        this.getBanners();
        this.getPositionCar();
      }
      if (this.tab === "mail") {
        this.getCar();
      }
      if (this.tab === "mine") {
        this.$request.getUser().then((res) => {
          if (res) {
            this.user.aliasPortrait = res.portrait;
            this.user.phoneNumber = res.mobile;
            console.log(
              "this.user",
              this.user.aliasPortrait,
              this.user.phoneNumber
            );
          }
        });
      }
      let res = wx.getSystemInfoSync();
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
    },
    markertap(){
      console.log(1)
    },
    onGotUserInfo(e) {
      const result = this.$request.login(e.detail);
      console.log("res", result);
    },
    async getBanners() {
      const res1 = await this.$request.post("/index.html");
      if (res1 && res1.result) {
        this.banners = res1.result.banners;
      }
    },
    async getPositionCar(){
      const _this = this;
      wx.getLocation({
        type: "gcj02",
        altitude: true, //高精度定位
        success: function(res) {
          console.log("resresres", res);
          // 设置坐标
          _this.longitude = res.longitude.toFixed(2);
          _this.latitude = res.latitude.toFixed(2);

          _this.$request
            .post("/pinfo/list.html", {
              lat: _this.latitude,
              lng: _this.longitude,
              pageNo: "1",
              pageSize: "10",
            })
            .then((res) => {
              console.log("resxxxx", res.result.items);
              const arr = res.result.items;
              arr.map(item =>{
                const distance = mileToKile(item.distance)
                item.distance = distance
                _this.markers = [].push(item.pic)
                return item.distance
              })
              return _this.cars = arr
            });
        },
        fail: function(err) {},
      });
    },
    async getCar() {
      const res2 = await this.$request.post("/indexitems.html");
      if (res2 && res2.result) {
        this.cars = res2.result.items;
      }
    },
    goToNavigation(item){
      // this.$router.push({query: { lat: item.lat, lng: item.lng }, path: "/pages/navigation/index" });
      let key = 'I63BZ-X27CJ-E3QF4-K2G4Y-T7FGF-E3FDU';  //使用在腾讯位置服务申请的key
      let referer = '美停AI';   //调用插件的app的名称
      let endPoint = JSON.stringify({  //终点
          'name': item.addr,
          'latitude': item.lat,
          'longitude': item.lng
      });
      // console.log('xxx', key, referer, endPoint )
      wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
      });
    },
    to_car_info() {
      this.$router.push({ path: "/pages/car_info/car_info" });
    },
    toShare() {
      this.$router.push({ path: "/pages/share/share" });
    },
    ticket() {
      this.$router.push({
        query: { id: 1 },
        path: "/pages/errors/index",
      });
    },
    hold() {
      this.$router.push({ path: "/pages/bindPhone/index" });
    },
    toNavigation(){
      this.$router.push({ path: "/pages/car_info/index" });
    },
    keyboardChange(e) {
      this.plateNum = e;
      this.navCar();
    },
    openKeyBoard() {
      if (this.plateNum && this.plateNum.length > 6) {
        this.navCar();
      } else {
        wx.showToast({
          icon: "none",
          title: "请输入完整的车牌号",
          mask: true,
          duration: 2000,
        });
      }
    },
    async navCar() {
      this.$request
        .post("/bindcar.html", { carno: this.plateNum })
        .then((res) => {
          wx.showToast({
            title: "绑定成功",
          });
          this.$router.push({
            query: { carno: this.plateNum },
            path: "/pages/payMent/index",
          });
        })
        .catch((err) => {
          console.log("err: ", err);
          return;
        });
    },
    toPayMent(item) {
      this.$router.push({
        query: { carno: item.carno },
        path: "/pages/payMent/index",
      });
    },
    scrolltolower() {},
    getScroll() {
      const query = wx.createSelectorQuery();
      const res = query
        .select(".bar")
        .boundingClientRect()
        .exec(
          function(res) {
            let barHeight = res[0].height;
            let systemInfo = wx.getSystemInfoSync();
            this.scrolHeight = systemInfo.windowHeight - barHeight;
          }.bind(this)
        );
    },
    joinGroup() {
      this.$request.getUser();
      this.$router.push({
        path: "/pages/errors/index",
      });
    },
    carManage() {
      this.$router.push({
        path: "/pages/carManage/index",
      });
    },
    toBanner(banner) {
      switch (banner.type) {
        case 1:
          wx.navigateTo({
            url: `/pages/webview/index?url=${banner.url}`,
          });
          break;
        case 2:
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.page {
  height: 100vh;
}

.swiper {
  width: 750rpx;
  height: 320rpx;
  .img {
    width: 750rpx;
    height: 320rpx;
  }
}

.entries {
  position: relative;
  background: #ffffff;
  .home {
    width: 612rpx;
    height: 906rpx;
    margin: 20rpx 60rpx 0 60rpx;
    position: absolute;
    left: 0;
    top: 160rpx;
  }
  .left {
    width: 315rpx;
    height: 906rpx;
    z-index: 99;
    position: absolute;
    left: 0;
    top: 160rpx;
    margin: 20rpx 0rpx 0 60rpx;
  }
  .right {
    width: 315rpx;
    height: 906rpx;
    z-index: 99;
    position: absolute;
    left: 375rpx;
    top: 160rpx;
    margin: 20rpx 60rpx 0 0;
  }
  .rightButton {
    width: 315rpx;
    height: 906rpx;
    z-index: 99;
    position: absolute;
    background-color: transparent;
    padding: 0;
  }
}

.mailbox_title {
  margin: 40rpx auto;
  & button {
    height: 92rpx;
    padding: 0 40rpx;
    border: 1px solid #01bf99;
    border-radius: 46px;
    font-size: 28rpx;
  }
}
.mailText {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.my_info {
  width: 100%;
  height: 320rpx;
  background-size: contain;
  background-color: #ffffff;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAFACAMAAADUPQn7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4RTg1MUEzNEI1QTcxMUU5ODRBNEFFQUMxN0FFRDUxNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4RTg1MUEzNUI1QTcxMUU5ODRBNEFFQUMxN0FFRDUxNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhFODUxQTMyQjVBNzExRTk4NEE0QUVBQzE3QUVENTE0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhFODUxQTMzQjVBNzExRTk4NEE0QUVBQzE3QUVENTE0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bORY+wAAAwBQTFRFGqqNKcmpAbCN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YVjMnH/tjbCY6XEUM5q75r4zMjQ0BMsZVMygFcC6ddfZycUM3Kn6j6CYufjq68+HxcwYjeauue+4ripcE7O2tgaLmetvhCORYz1rQh4e0wI09x2RKqhmhoYf6P8ZPIoAFDMvsFt3JlqA5r4zavd+WM38UFbMaO6a+47jDkdmQAMPi5nLz7/xK294X61nSEjIk/ujQ0O47gE/bVRz0dxbtpgBGVob7j/7vZdd9m/XwmKmJonXT8nMTk0tLByYX1kZHBzRxwVr7q3busMFYv84+rP33gFa96985XUb4j4yewR4PwC8Dw4O6lNpNPfW5T40BNr3obMvueNcWMy8QFbMeHHvPzaLvc9D74b28izjvj8e7zZBUqlCNGo0u2Kl9N7WfGahKipnhs++47LLfvu3QTHz+Q207sY+4J2UM6CaeVSDeXZxH+1MltLpciQSqddzuaWRwQNTR1u0dh/G54idfccdV19//jmgmGkw8cf96JF9+9jmvarBPPu4lyzuEyOD81OPtCr3IVjNVP/okotBMQO4f75RcxQzDfef0XN4n928A+9RDeZZxz3Jc194vEWLGRBYzZwNqhlczDQkkf+3dz2VeOqpbDa72n4YNu9WOTOSADmhF8k/27iXLe4rCy16V2NoDVczoJi5GLXu7xsf98s9dfC+jo62trb29sOH+XJmfWRkZGlNu3lWcU8j7vXc8up6y3Kvrq2hziooZih3ZzEzLv1PH5iG3Dsg93a2nIGDkcD76u/co+E8W7izfdXlpfWVAy3KfQbdTQOLmYvhwUo3vuDz45LI/stHj03z3mfZwXfgfaklavi9ezXfU8495hiaadViproGJ5pG52gx8xt+uScfnMbecTmDmneunFld2qbD9u4pqGO028lqyKeQO99XbdViZhiOy4RCtJj56m9kG76KmYHJyQenPcqZie150ns099PPPXlGcIcHnoKCBtTud1x99fXXXvuV12UlkRDrmJycZJv3dqG3isqZrr2a+7OA+9yZw7069E+gmukHtfvFl19+zjmgdffFfal3km3e2/jmfXvLmf2ae0twT5ORyOXVwZWWHYgcGgK1zMytl7wdFjPvkBUzMxInvb29dvPO9Fb5cmYpvi3co1HNvUW406GZFuVOznAHtTvc33HtjTf6LGZ6Oe/Kwfft4q6M5r4t3IWhmfXB/SePztGMjo4u7mmN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);
  &_bg {
    background-color: #01bf99;
  }
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
      margin-left: 56rpx;
      margin-top: 56rpx;
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
    &_bingPhone {
      color: #ffffff;
      font-size: 36rpx;
      margin-left: 20rpx;
      margin-top: 68rpx;
    }
  }
}

.home_function {
  height: 180rpx;
  margin: 40rpx 0rpx;
  background-color: #ffffff;
  box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.05);
  &_item {
    background-color: #ffffff;
    &_button {
      height: 180rpx;
      width: 184rpx;
      color: #4d495b;
    }
    &_text {
      font-size: 32rpx;
      color: #4d495b;
    }
  }
}
.home_position{
  margin:  0 0 40rpx 0rpx;
  background-color: #ffffff;
  box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.05);
  .carItem{
    border-radius: 20rpx;
    box-shadow: 3rpx 4rpx 6rpx rgba(1, 191, 135, 0.7);
    margin: 5rpx;
  }
  &_item {
    background-color: #ffffff;
    &_button {
      height: 180rpx;
      width: 184rpx;
      color: #4d495b;
    }
    &_text {
      font-size: 32rpx;
      color: #4d495b;
    }
  }
    .position_info{
      margin: 10rpx;
      width: 80%;
      .center{
        .positon {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          width: 80%;
        }

      }        
      .bottom{
          color: rgb(140, 14, 14);
      }
    }
    .carPhone_carno{	
      width: 20%;
	    text-align: center;
	    height: 100%;
	    line-height: 144rpx;
	    vertical-align: middle;
    }
}
.my_function {
  height: 180rpx;
  position: relative;
  top: -120rpx;
  margin: 40rpx 40rpx;
  background-color: #ffffff;
  box-shadow: 3rpx 4rpx 6rpx 3rpx rgba(1, 191, 135, 0.7);
  border-radius: 20rpx;

  &_item {
    background-color: #ffffff;
    &_button {
      height: 180rpx;
      color: #4d495b;
      & .iconfontBig {
        width: 88rpx;
        height: 88rpx;
      }
      .paycount {
        line-height: 36rpx;
        font-size: 36rpx;
        margin-bottom: 10rpx;
        color: #333333;
      }
    }

    &_text {
      font-size: 32rpx;
      color: #4d495b;
    }
  }
  & .payAccount {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  & .paybag {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
}
.card {
  box-shadow: 3rpx 4rpx 6rpx 3rpx rgba(1, 191, 135, 0.7);
  border-radius: 20rpx;
}

.home_contact {
  background-color: #ffffff;
  .carPark {
    margin-top: 80rpx;
    border-top-color: rgba(191, 189, 192, 0.15);
    border-top-style: solid;
    border-top-width: 2rpx;
  }
  .lightButton {
    margin-bottom: 20rpx;
    margin-top: 0rpx;
    height: 64rpx;
    margin: 40rpx;
    font-size: 32rpx;
  }
  .carItem {
    padding: 30rpx;
    border-bottom-color: #e5e5e5;
    border-bottom-style: solid;
    border-bottom-width: 2rpx;
  }
  .carPhone {
    width: 410rpx;
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
    margin-bottom: 10rpx;
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
}
.my_share {
  margin: 40rpx 60rpx;
  & button {
    border: 2rpx #01bf99 solid;
    border-radius: 46px;
    height: 92rpx;
    width: 316rpx;
    font-size: 28rpx;
    font-weight: 600;
    &.active {
      background: #fff;
    }
  }
}
.my_contact {
  margin: 40rpx 0rpx;
  background-color: #ffffff;
  box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.05);
  position: relative;
  top: -140rpx;
  .carPark {
    margin-top: 80rpx;
    border-top-color: rgba(191, 189, 192, 0.15);
    border-top-style: solid;
    border-top-width: 2rpx;
  }

  .carItem {
    padding: 30rpx;
    border-bottom-color: #e5e5e5;
    border-bottom-style: solid;
    border-bottom-width: 2rpx;
  }
  .carPhone {
    width: 410rpx;
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
}
.my_share {
  margin: 40rpx 60rpx;
  & button {
    border: 2rpx #1aad19 solid;
    border-radius: 46px;
    height: 92rpx;
    width: 316rpx;
    font-size: 28rpx;
    font-weight: 600;
    &.active {
      background: #fff;
    }
  }
}

.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(77, 73, 91, 0.3);
}
.modalCard {
  width: 630rpx;
  max-height: 598rpx;
  min-height: 402rpx;
  background-color: #ffffff;
  border-radius: 4rpx;
  box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.05);
  & .set {
    margin: 40rpx;
    color: #4d495b;
  }
  & input {
    margin: 40rpx;
    border-radius: 4rpx;
    height: 84rpx;
    width: 500rpx;
    padding-left: 20rpx;
    background-color: rgba(189, 189, 192, 0.15);
  }
}
.saveButton {
  width: 316rpx;
  height: 92rpx;
  margin: auto;
  margin-bottom: 60rpx;
  & button {
    background-color: #01bf99;
    color: #ffffff;
    border-radius: 23px;
  }
}
.iconfont_sixteen {
  width: 32rpx;
  height: 32rpx;
}

.newButton {
  box-sizing: border-box;
  font-size: 28rpx;
  padding: 0;
  border: 2rpx solid rgba(189, 189, 192, 0.1);
}
.input {
  width: 50rpx;
  border-style: solid;
  border-width: 2rpx;
  height: 84rpx;
  padding-left: 20rpx;
  background-color: rgba(189, 189, 192, 0.1);
}
.wait {
  font-size: 32rpx;
}
.car_btn {
  font-size: 32rpx;
  .lightButton {
    margin-bottom: 20rpx;
    margin-top: 30rpx;
    height: 64rpx;
    width: 726rpx;
    font-size: 32rpx;
  }
}
.car_block {
  margin-top: -30rpx;
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

.home_header {
  width: 100%;
  background: #01bf99;
  z-index: 3;
  .title {
    text-align: center;
    color: #ffffff;
    font-size: 32rpx;
  }
  .times {
    font-size: 108rpx;
    color: white;
  }
}

.mine_header {
  width: 100%;
  background: #01bf99;
  z-index: 3;
  .title {
    text-align: center;
    color: #ffffff;
    font-size: 32rpx;
  }
  .times {
    font-size: 108rpx;
    color: white;
  }
}
.header {
  height: 200rpx;
  width: 100%;
  position: fixed;
  top: 0;
  background: #01bf99;
  z-index: 3;
  .title {
    text-align: center;
    color: #ffffff;
    font-size: 32rpx;
  }
  .times {
    font-size: 108rpx;
    color: white;
  }
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
</style>
