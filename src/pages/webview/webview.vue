<template>
  <web-view :src="url" />
</template>
<script>
import shareMix from "@/mixins/mixin";
const URL_MAP = {
  "1": {
    url: "",
    title: ""
  },
};
export default {
  mixins: [shareMix],
  data() {
    return {
      url: "http://m.qingsongting.cn/PayQuery.html?accountId=1#"
    };
  },
  onLoad(opts) {

  },
  onShow(){


  },
  onHide(){

  }
};
</script>



