import Vue from 'vue'
import App from './add'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#fbfbfd',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '我的车位信息',
    backgroundColor: '#fbfbfd'  
  }
};
