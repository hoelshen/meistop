import flyio from "flyio/dist/npm/wx";
import { promisify } from "@/utils/index";

const environment = "test"; // 配置环境

const fly = new flyio();
let cookies = [],
  token = "",
  tryCount = 0;

fly.config.baseURL = getBaseURL(environment);
fly.config.headers["Accept"] = "application/json";
fly.config.headers["Content-Type"] = "application/json; charset=utf-8";

function getBaseURL(env) {
  switch (env) {
    case "local":
      return "http://192.168.118.149:10701";
    case "mock":
      return "http://www.amusingcode.com:8001/mock/24/tell_v2";
    case "test":
      return "https://www.amusingcode.com/teller-v2";
    default:
      return "https://api.tellers.cn/teller-v2";
  }
}

function showError(message, status, request) {
  wx.showToast({
    title: message,
    icon: "none",
    duration: 2000
  });
  snedToCloud(message, status, request);
}

function snedToCloud(message, status, request) {
  if (!request) {
    return false;
  }
  const systemInfo = wx.getSystemInfoSync();
  const lauchOpts = getApp().globalData.options;
  const userId = getApp().globalData.user._id;
  wx.cloud.init();
  const db = wx.cloud.database();
  const data = {
    systemInfo: systemInfo,
    lauchOpts: lauchOpts,
    requestName: request.url,
    method: request.method,
    status,
    userId,
    message,
    createdAt: Date()
  }
  db.collection("errors").add({data});
}

function normalizeUserCookie(cookiesArray) {
  let _cookies = [];
  cookiesArray = cookiesArray + "";
  (cookiesArray.match(/([\w\-.]*)=([^\s=]+);/g) || []).forEach(str => {
    _cookies.push(str);
  });
  return _cookies.join(" ");
}

function getToken(cookiesArray) {
  if (cookiesArray.indexOf("csrfToken") >= 0) {
    let cookies = cookiesArray.split(";");
    return cookies[0].replace("csrfToken=", "");
  }
  return "";
}

async function login() {
  let wxRes = await promisify(wx.login, wx)();
  let loginUrl = `/login?code=${wxRes.code}`;
  let query = getApp().globalData.options.query;
  if (query.scene) {
    loginUrl += `&scene=${query.scene}`;
  } else if (query.refer) {
    loginUrl += `&refer=${query.refer}`;
  }
  let logRes = await fly.get(loginUrl);
  logLogin(); // 上报登陆信息
  return (getApp().globalData.user = logRes.data);
}

function getUser() {
  return new Promise(function(resolve, reject) {
    fly.get("/user").then(res => {
      const user = res.data;
      getApp().globalData.user = user;
      resolve(user);
    });
  });
}

function uploadFile(path) {
  return new Promise(function(resolve, reject) {
    wx.uploadFile({
      url: getBaseURL(environment) + "/file",
      filePath: path,
      name: "img",
      header: {
        Cookie: cookies,
        "x-csrf-token": token
      },
      success: function(res) {
        typeof resolve == "function" && resolve(res);
      },
      fail: function(err) {
        typeof reject == "function" && reject(err);
      }
    });
  });
}

async function saveFormid(formId) {
  fly.put("/record/form", {
    formId
  });
}

async function logLogin() {
  const lauchOpts = getApp().globalData.options;
  const systemInfo = wx.getSystemInfoSync();
  fly.put("/record/login", {
    lauchOpts,
    systemInfo
  });
}

async function waitingLogin() {
  return new Promise(function(resolve, reject) {
    var hash = setInterval(function() {
      if (tryCount >= 50) {
        clearInterval(hash);
        wx.reLaunch({
          url: "/pages/noFound/index"
        });
        reject("登陆超时"); // 10秒超时时间
      }
      if (cookies.length > 0) {
        clearInterval(hash);
        resolve("登陆成功");
      } else {
        tryCount++;
        console.log("正在等候登陆结果，请稍后");
      }
    }, 200);
  });
}

fly.interceptors.request.use(async function(request) {
  if (/login\?code=/.test(request.url)) {
    return request;
  }
  if (!token) {
    await waitingLogin();
  }
  request.headers["Cookie"] = cookies;
  request.headers["x-csrf-token"] = token;
  return request;
});

fly.interceptors.response.use(
  response => {
    if (cookies && token) {
      return response.data;
    }
    if (response && response.headers && response.headers["set-cookie"]) {
      cookies = normalizeUserCookie(response.headers["set-cookie"]);
      token = getToken(response.headers["set-cookie"][0]);
    }
    return response.data;
  },
  err => {
    if (err.status == 502 || err.status == 404) {
      showError("服务器抽风啦，请重试", err.status, err.request); // 生产环境：服务器正在重启
      return wx.reLaunch({
        url: "/pages/noFound/index"
      });
    }
    if (!err.response) {
      showError("服务器抽风啦，请重试", err.status, err.request); // 本地环境：服务器正在重启
      return wx.reLaunch({
        url: "/pages/noFound/index"
      });
    }
    showError(err.response.data.message, err.status, err.request);
  }
);

fly.login = login;
fly.saveFormid = saveFormid;
fly.uploadFile = uploadFile;
fly.getUser = getUser;

export default fly;
