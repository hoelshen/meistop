import App from './paySuccess'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '智联信通',
    navigationStyle: 'custom',
    backgroundColor: '#ffffff'
  }
}