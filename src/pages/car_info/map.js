import Vue from 'vue'
import App from './map'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#fbfbfd',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '我的地理定位',
    backgroundColor: '#fbfbfd'  
  }
};
