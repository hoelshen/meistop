import App from './home'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
  config: {
    navigationBarBackgroundColor: '#fffefb',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '智联信通',
    backgroundColor: '#FFFEFB',
    disableScroll: true,
    navigationStyle: 'custom'
  }
}