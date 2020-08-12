
<script>
export default {
  mpType: "app",
  onLaunch(opts) {
    this.globalData.options = opts;
    
    this.$request.getOpenid().then(res=>{
      getApp().globalData.sessionkey = res.result.session_key;
      getApp().globalData.openid = res.result.openid;
    });
  },
  onShow() {
    if (!wx.createSelectorQuery) {
      // 首页Tabbar组件依赖此API
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，可能影响使用体验，请升级到最新微信版本后重试。"
      });
    }
  },
  onPageNotFound(res) {},
  onError(error) {},
  globalData() {
    return {
      options: {}, // 启动参数
      user: {}, // 用户信息
      sessionkey: "",
      openid: "",
      imageUrl: "https://cdn.tellers.cn/tell_v2/static/share_default.jpg", // 默认分享分
    };
  }
};
</script>

<style lang="less">
@import url(./styles/common.less);
</style>
