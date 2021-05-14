 const baseUrl = 'https://letletme.top/api/'

 function get(url, data = {}) {
   var promise = new Promise((resolve, reject) => {
     wx.showLoading({
       title: '加载中'
     });
     wx.request({
       url: baseUrl + url,
       data: data,
       method: 'GET',
       header: {
         'content-type': 'application/json'
       },
       success: function (res) {
         wx.hideLoading();
         if (res.statusCode == 200) {
           resolve(res);
         } else {
           reject(res.data);
         }
       },
       fail: function (e) {
         wx.hideLoading();
         wx.showToast({
           title: '无法连接服务器',
           icon: 'loading',
           duration: 1000
         });
         reject('网络出错');
       }
     });
   });
   return promise;
 }

 function post(url, data) {
   var promise = new Promise((resolve, reject) => {
     wx.showLoading({
       title: '加载中'
     });
     wx.request({
       url: baseUrl + url,
       data: data,
       method: 'POST',
       header: {
         'content-type': 'application/json'
       },
       success: function (res) {
         wx.hideLoading();
         if (res.statusCode == 200) {
           resolve(res);
         } else {
           reject(res.data);
         }
       },
       fail: function (e) {
         wx.hideLoading();
         wx.showToast({
           title: '无法连接服务器',
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
   post
 }