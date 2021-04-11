<template>
  <div
    v-show="isShowModal"
    :class="`${isShowModal ? 'modal' : '' }` "
    @click="clickMask"
  >
    <div
      v-show="isShowModal"
      class="card flex column center"
      @tap.stop="stopkMask"
    >
      <div class="title">
        获取相应的权限
      </div>
      <div class="btn">
        <button
          v-if="canIUseGetUserProfile"
          class="lightButton rightButton"
          lang="zh_CN"
          @tap="onGotUserproInfo"
        >
          确认
        </button>
        <button
          v-else
          class="lightButton rightButton"
          open-type="getUserInfo"
          lang="zh_CN"
          @getuserinfo="onGotUserInfo"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Modal",
  data() {
    return {
      isShowModal: false,
      filterTitle: "",
      value: {},
      canIUseGetUserProfile: false
    };
  },
  onShow() {
    if (wx.getUserProfile) {
      this.canIUseGetUserProfile = true
    }
  },
  methods: {
    onGotUserInfo(e) {
      this.isShowModal = false;
      this.$request.login(e.detail);
    },
    onGotUserproInfo(e){
      console.log('e',)
      const _this = this;
      if (!wx.getUserProfile) {
        return
      }
      wx.getUserProfile({
        desc: '获取用户信息的权限', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            _this.isShowModal = false;
            _this.$request.login(res);
          }
        })
    },
    show() {
      this.isShowModal = true;
    },
    ConfirmButton() {
      this.isShowModal = false;
    },

    clickMask() { 
      this.isShowModal = false;
    },
    stopkMask() {}
  }
};
</script>
<style lang="less" scoped>
.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(77, 73, 91, 0.3);
  z-index: 99;
  .card {
    width: 630rpx;
    max-height: 598rpx;
    min-height: 402rpx;
    background-color: #ffffff;
    border-radius: 4rpx;
    border-radius: 25rpx;
    box-shadow: 0 0 40rpx 0 rgba(0, 0, 0, 0.05);
  }
}

.title {
  margin-top: 60rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #4d495b;
}
.btn {
  margin-top: 64rpx;
}
  .lightButton {
    height: 64rpx;
    padding: 0 80rpx;
    font-size: 32rpx;
  }
.content {
  margin: 40rpx 40rpx 20rpx;
  white-space: normal;
  line-height: 52rpx;
  font-size: 28rpx;
  text-align: center;
  color: #4d495b;
  & image {
    width: 550rpx;
    height: 244rpx;
  }
}
.confirm {
  margin-top: 0;
  margin-bottom: 0;
}

.sure {
  padding: 0 130rpx;
  line-height: 92rpx;
}
</style>
