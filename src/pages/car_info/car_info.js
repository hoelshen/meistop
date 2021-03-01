import Vue from 'vue'
import App from './car_info.vue'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#fbfbfd',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '停车记录',
    backgroundColor: '#fbfbfd'  
  }
};
