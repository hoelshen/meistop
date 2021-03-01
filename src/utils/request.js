import flyio from "flyio/dist/npm/wx";
import myEvent from './event';
import {
  promisify
} from "@/utils/index";

const environment = "test"; // 配置环境
console.log('wx', wx);
wx.myEvent = myEvent;
const fly = new flyio();
const loginFly = new flyio();
let tokenCode = "",
  tokenInfo = "";

fly.config.baseURL = getBaseURL(environment);
fly.config.headers["Accept"] = "application/json";
fly.config.headers["Content-Type"] = "application/json; charset=utf-8";

loginFly.config.baseURL = getBaseURL(environment);
loginFly.config.headers["Accept"] = "application/json";
loginFly.config.headers["Content-Type"] = "application/json; charset=utf-8";

function getBaseURL(env) {
  switch (env) {
    case "local":
      return "http://192.168.118.149:10701";
    case "test":
      return "https://www.meitingpark.com/mobile/";
  }
}




function getUser() {
  return new Promise(function (resolve, reject) {
    fly.post("user/info.html").then(res => {
      resolve(res.result);
    }).catch(err => {
      reject(err);
    });
  });
}

function uploadFile(path) {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: getBaseURL(environment) + "/file",
      filePath: path,
      name: "img",
      header: {
        // "x-csrf-token": token
      },
      success: function (res) {
        typeof resolve == "function" && resolve(res);
      },
      fail: function (err) {

        typeof reject == "function" && reject(err);
      }
    });
  });
}

async function getOpenid() {
  const wxRes = await promisify(wx.login, wx)();
  return fly.post("/user/openid.html", {
      code: wxRes.code
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      wx.hideLoading();
    });
}

async function getlatitude(){
  const res = await promisify(wx.getLocation, wx)({
    type: 'wgs84',
  });
  let lat = ''; 
  let lng = '';
  let obj = {};
  lat = (res.latitude).toFixed(2).toString() // 纬度
  lng = (res.longitude).toFixed(2).toString() // 经度
  return obj = {
    lat,
    lng
  }
}

async function login(data) {
  getApp().globalData.user = data.userInfo;
  let openid = getApp().globalData.openid;
  let portrait = data.userInfo.avatarUrl
  let nickname = data.userInfo.nickName
  const obj = await getlatitude();
  console.log('obj: ', obj);
  fly.post("/user/login.html", {
      openid,
      portrait,
      nickname,
      lat: obj.lat,
      lng: obj.lng
    })
    .then(res => {
      fly.config.headers["tokenCode"] = tokenCode = res.result.tokenCode;
      fly.config.headers["tokenInfo"] = tokenInfo = res.result.tokenInfo;

      wx.setStorage({
        key: 'tokenCode',
        data: tokenCode
      })
      wx.setStorage({
        key: 'tokenInfo',
        data: tokenInfo
      })
      return getApp().globalData.user = res.result;
    })
    .catch(err => {
      wx.hideLoading();
    });   
}

async function loginFlyFn() {
  let portrait = getApp().globalData.user.userInfo.avatarUrl
  let nickname = getApp().globalData.user.userInfo.nickName
  const obj = await getlatitude();
  loginFly.post("/user/login.html", {
      openid,
      portrait,
      nickname,
      lat: obj.lat,
      lng: obj.lng
    })
    .then(res => {
      fly.config.headers["tokenCode"] = tokenCode = res.result.tokenCode;
      fly.config.headers["tokenInfo"] = tokenInfo = res.result.tokenInfo;

      wx.setStorage({
        key: 'tokenCode',
        data: tokenCode
      })
      wx.setStorage({
        key: 'tokenInfo',
        data: tokenInfo
      })
      return getApp().globalData.user = res.result;
    })
    .catch(err => {
      wx.hideLoading();
    });
}


async function fetchLogin() {
  const res = await loginFlyFn();  //token
  fly.config.headers["x-csrf-token"] = res;
  fly.unlock();
}

fly.interceptors.request.use(async function (request) {
  request.headers["tokenCode"] = tokenCode = wx.getStorageSync('tokenCode') //永久保存用户账号

  request.headers["tokenInfo"] = tokenInfo = wx.getStorageSync('tokenInfo') //永久保存用户账号
  const whiteList = ['/user/openid.html', '/user/login.html']
  if(!whiteList.indexOf(request.url) > -1){
    console.log('不用检验')
  } else{
    if(tokenCode){
      fly.lock();
      const code = getApp().globalData.openid;
      return fetchLogin(code);
    } else{
      return fly.unlock();
    }
  }

  return request;
});

fly.interceptors.response.use(

  response => {
    return response.data;
  },
  async err => {
    console.log('err: ', err);
    if (err.status == 502 || err.status == 404) {
      // 生产环境：服务器正在重启

    } else if (!err.response) {

    }
    return Promise.reject(err);;
  }
);

fly.login = login;
fly.uploadFile = uploadFile;
fly.getUser = getUser;
fly.getOpenid = getOpenid;
export default fly