import App from './cleanStore'
import Vue from 'vue'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        navigationBarBackgroundColor: '#fffefb',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '添加车辆',
        backgroundColor: '#FFFEFB'
    }
};