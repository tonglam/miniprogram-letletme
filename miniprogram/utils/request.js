const baseUrl = 'https://letletme.top/api/';
const noticeUrl = "https://letletme.top/notice/";

function get(url, data = {}, loading = true) {
  var promise = new Promise((resolve, reject) => {
    if (loading) {
      wx.showLoading({
        title: '加载中'
      });
    }
    wx.request({
      url: baseUrl + url,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (loading) {
          wx.hideLoading();
        }
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res.data);
        }
      },
      fail: function (e) {
        if (loading) {
          wx.hideLoading();
        }
        wx.showToast({
          title: '无法连接服务器:' + e.errMsg,
          icon: 'loading',
          duration: 1000
        });
        reject('网络出错');
      }
    });
  });
  return promise;
}

function post(url, data, loading = true) {
  var promise = new Promise((resolve, reject) => {
    if (loading) {
      wx.showLoading({
        title: '加载中'
      });
    }
    wx.request({
      url: baseUrl + url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (loading) {
          wx.hideLoading();
        }
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res.data);
        }
      },
      fail: function (e) {
        if (loading) {
          wx.hideLoading();
        }
        wx.showToast({
          title: '无法连接服务器:' + e.errMsg,
          icon: 'loading',
          duration: 1000
        });
        reject('网络出错');
      }
    });
  });
  return promise;
}

function getNotice(url, data = {}, loading = true) {
  var promise = new Promise((resolve, reject) => {
    if (loading) {
      wx.showLoading({
        title: '加载中'
      });
    }
    wx.request({
      url: noticeUrl + url,
      data: data,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (loading) {
          wx.hideLoading();
        }
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res.data);
        }
      },
      fail: function (e) {
        if (loading) {
          wx.hideLoading();
        }
        wx.showToast({
          title: '无法连接服务器:' + e.errMsg,
          icon: 'loading',
          duration: 1000
        });
        reject('网络出错');
      }
    });
  });
  return promise;
}

export {
  get,
  post,
  getNotice
}