/* =============================================
 * v20141018.2
 * =============================================
 * Copyright 谢武
 *
 * 框架方法和配置
 * ============================================= */

var BASE_URL = 'http://www.zhanqi.tv/';
// ajax地址配置
// var URLConfig = {
//   'gameIndex': BASE_URL + 'api/static/game.index/index.json'
// , 'liveIndex': BASE_URL + 'api/static/live.index/index.json'
// , 'gameList': BASE_URL + 'api/static/game.lives/6/1-4.json'
// }
function URLConfig(which, data) {
  switch (which) {
    // case 'hotLive':
    //   return BASE_URL + 'api/static/game.lives/'+data['id']+'/'+data['start']+'-'+data['count']+'.json';
    // case 'gameLiveIndex':
    //   return BASE_URL + 'api/static/game.lives/'+data['id']+'/'+data['num']+'-'+data['page']+'.json';
    // case 'otherLiveIndex':
    //   return BASE_URL + 'api/static/live.others/4-1-10,13,6.json';
    case 'bannerIndex':
      return BASE_URL + 'api/touch/apps.banner?rand=' + (+new Date());
    // case 'liveIndex':
    //   return BASE_URL + 'api/static/live.index/index.json?rand=' + (+new Date());
    case 'liveList':
      return BASE_URL + 'api/static/live.hots/'+data['num']+'-'+data['page']+'.json';
    case 'gameList':
      return BASE_URL + 'api/static/game.lists/'+data['num']+'-'+data['page']+'.json';
    case 'gameLive':
      return BASE_URL + 'api/static/game.lives/'+data['id']+'/'+data['num']+'-'+data['page']+'.json';
    case 'search':
      return BASE_URL + 'api/touch/search?t='+data['t']+'&q='+encodeURIComponent(data['q'])+'&page='+data['page']+'&nums='+data['num'];
    case 'followList':
      return BASE_URL + 'api/user/follow.listall?_rand=' + (+new Date());
    case 'unfollow':
      return BASE_URL + 'api/user/follow.unfollow?_rand=' + (+new Date());
    case 'liveRoomInfo':  // 获取直播播放信息
      return BASE_URL + 'api/static/live.roomid/'+data['roomid']+'.json';
    // case 'videoRoomInfo': // 获取视频播放信息
    //   return BASE_URL + 'api/static/video.videoid/'+data['roomid']+'.json';
    case 'login':
      return BASE_URL + 'api/auth/user.login?_rand=' + (+new Date());
    case 'register':
      return BASE_URL + 'api/auth/user.register?_rand=' + (+new Date());
    case 'logout':
      return BASE_URL + 'api/auth/user.logout?_rand=' + (+new Date());
    case 'bindPhone':
      return BASE_URL + 'api/user/user.bind_mobile?_rand=' + (+new Date());
    // case 'nickname':
    //   return BASE_URL + 'api/public/validate.nickname';
    case 'editInfo':
      return BASE_URL + 'api/user/user.edit?_rand=' + (+new Date());
    case 'avatar':
      return BASE_URL + 'api/user/upload.avatar?_rand=' + (+new Date());
    case 'charge':
      return BASE_URL + 'api/user/log.charge?stime='+data['stime']+'&etime='+data['etime']+'&nums='+data['nums']+'&start='+data['start'] + '&_rand=' + (+new Date());
    case 'giftuse':
      return BASE_URL + 'api/user/log.giftuse?stime='+data['stime']+'&etime='+data['etime']+'&nums='+data['nums']+'&start='+data['start'] + '&_rand=' + (+new Date());
    case 'giftuse':
    case 'getGiftList':
      return BASE_URL + 'api/static/live.gifts/'+data['roomid']+'.json';
    // case 'sGetRichUrl':
    //   // 获得金币
    //   return BASE_URL + 'api/user/rich.get';
    case 'suggest':
      // 问题反馈
      return BASE_URL + 'api/public/suggest.save';
    case 'sTaskCompleteStatusUrl':
      // 获取任务状态
      return BASE_URL + 'api/actives/task/info.status?_rand=' + (+new Date());      // URLConfig
    case 'sDailyAskSubmitUrl':
      // 每日一问，提交
      return BASE_URL + 'api/actives/task/ask.answer?_rand=' + (+new Date());
    case 'sDailyAskGetUrl':
      // 获取每日一问的问题
      return BASE_URL + 'api/actives/task/ask.question';
    case 'sTaskReceiveUrl':
      // 领取任务奖励
      return BASE_URL + 'api/actives/task/info.receive?_rand=' + (+new Date());
    case 'sSignInUrl': 
    // 获取签到
      return BASE_URL + 'api/actives/signin/seven.sign?_rand=' + (+new Date());
    case 'history':
      return BASE_URL + 'api/user/record.watch_list?nums=10&_rand=' + (+new Date());
    case 'getRich':  //获取财富
      return BASE_URL + 'api/user/rich.get?_rand=' + (+new Date());
    case 'qqLoginUrl':
      // qq登陆
      return BASE_URL + 'api/auth/openid.qq_login_by_token?_rand=' + (+new Date());
    case 'recordWatch':  //进入直播记录
      return BASE_URL + 'api/user/record.watch?type=1&id='+data['roomid'] + '&_rand=' + (+new Date());  //type 1 直播 写死
    case 'switch':
      return BASE_URL + 'api/touch/apps.currency_switch';
    case 'payOrder':   //支付生成订单接口
      return BASE_URL + 'api/user/charge.alipay.order?_rand=' + (+new Date());
    // case 'payNotify':
    //   return BASE_URL + 'api/user/charge.itunes.notify?sid='  + data['sid'];
    //首页改版后的接口
    case 'indexDataUrl':
      return  BASE_URL + 'api/static/live.index/recommend-apps.json?';  
    case 'getLotteryInfo':
      return BASE_URL + 'api/actives/lottery/info.4';
    case 'drawLottery':
      return BASE_URL + 'api/actives/lottery/lottery.4';
    case 'triger':  //老虎机
      return BASE_URL + 'api/actives/lottery/lottery.6?roomId=' + data['roomId'];
    case 'tChance':
      return BASE_URL + 'api/actives/lottery/info.6?roomId=' + data['roomId'];
    //获取粉丝周榜和总榜
    case 'fansweekrank':
      return BASE_URL + 'api/static/room.fansweekrank/'+data['roomid']+'-'+data['num']+'.json';
    //获取主播精彩视频（推荐）
    case 'videoHots':
      return BASE_URL + 'api/static/video.anchor_hots/'+data['uid']+'-'+data['num']+'-'+data['page']+'.json';
    //获取主播最新视频（时间排序）
    case 'videoNews':
      return BASE_URL + 'api/static/video.anchor_news/'+data['uid']+'-'+data['num']+'-'+data['page']+'.json';
    //记录视频播放次数  
    case 'videoWatch':
      return BASE_URL + 'api/public/video.watch_record?id=' + data['videoId'];
  }
};

$(function() {
  if( window.navigator.appVersion.match(/iphone/gi) || window.navigator.appVersion.match(/ipad/gi)) {
    $('body').addClass('hairlines');
  }
});

// 获取设备号 lulu
// window.getEquipment = function(mei) {
//   api.setStorage('mei', mei);
// };

/* 静默登录 */
function silenceLoginFn(pageName, fnName, isRoom, fn2Name) {
  var user = $api.getStorage('user');
  var password = $api.getStorage('password');
  if(!user || !api || !password) {
    if(isRoom) {
      api.execScript({
        name: pageName,
        script: fn2Name + '()'
      });
    }
    return;
  };
  api.ajax({
    url : URLConfig('login'),
    method : 'post',
    dataType : 'json',
    headers: {
     'User-Agent': 'Zhanqi.tv Api Client'
     // 'mei': 设备号
    },
    data: {
      values: {'account' : user['account'], 'password' : password}
    }
  }, function(ret, err) {
      if(!ret) {
        if(isRoom) {
          api.execScript({
            name: pageName,
            script: fn2Name + '()'
          });
        }
        return;
      };
      if(ret.code == 0) {
        $api.setStorage('user', ret['data']);
        api.execScript({
          name: pageName,
          script: fnName + '()'
        });
      } else{
        if(isRoom) {
          api.execScript({
            name: pageName,
            script: fn2Name + '()'
          });
        }
      }
  });
  
}

/* 框架初始化 */
+function(win, $) {
  var yp = {};
  /* 语法糖扩展 */
  // 对象扩展
  yp.mix = $.extend;
  // 对象循环
  yp.each = function(arr, callback) {
    return $.each(arr, function(a, b) {
      return callback(b, a);
    });
  };
  // 格式化
  yp.format = function(str, data) {
    if (!str) {
      throw new Error('yp.format字符串参数不能为空');
      return '';
    }
    var re = this.re || /\${([\s\S]+?)}/g
    if (typeof data !== 'object') data = [].slice.call(arguments, 1);
    return str.replace(re, function($0, $1) {
      return data[$1] != null ? data[$1] : '';
    });
  };
  // 获取随机数
  yp.getRandom = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  // 获取url参数
  yp.query = function(key, context) {
    var result
    var regParam = new RegExp('([\?\&])' + key + '=([^\&]*)(\&?)', 'i')
    context = context || location.search;
    return (result = regParam.exec(context)) ? decodeURI(result[2]) : null;
  };
  // 空函数
  yp.noop = $.noop || function() {};

  yp.mix(yp, {
    global: {}  /*全局变量*/
  , config: {}  /*全局配置*/
  , loader: {}  /*资源加载*/
  , loger: {}   /*日志输出*/
  , mods: {}    /*全局模块*/
  , cache: {}   /*全局缓存*/
  , event: {}   /*全局事件*/
  , ui: {}      /*全局UI*/
  , system: {}  /*系统函数*/
  });

  win.yp = yp;
}(window, $);

/* 全局事件管理event */
+function($, yp) {
var 
  exports = yp
, yp_event = exports.event
, o = $({});
  
  yp_event.sub = function() {
    var eventName = arguments[0]
    var data = o.data(eventName.replace(/\..*/, ''))
    if (data) {
      var callback = arguments[1]
      callback(data);
      return;
    }
    o.on.apply(o, arguments);
  };
  yp_event.unsub = function() {
    o.off.apply(o, arguments);
  };
  yp_event.pub = function() {
    o.trigger.apply(o, arguments);
    var eventName = arguments[0]
    return {
      cache: function(val) {
        eventName = typeof eventName === 'string' ? eventName : eventName.type + '.' + eventName.namespace;
        o.data(eventName, val || true);
      }
    };
  };

  // 系统观察者
  exports.sub = $.sub = yp_event.sub;
  exports.unsub = $.unsub = yp_event.unsub;
  exports.pub = $.pub = yp_event.pub;
}($, yp);

/* 全局数据加载模块 */
+function($, yp) {
 var
  win = this
, exports = yp
, loader = exports.loader
, system = exports.system;

  var ajax = function(options, callback) {
    options = yp.mix({
      method: 'post'
    , dataType: 'json'
    , headers: {
       'User-Agent': 'Zhanqi.tv Api Client'
       // 'mei': 设备号
      }
    }, options);
    if(!options['notLoad']) {
      $.pub('loader/ajax/start', options);
    }
    system.ajax(options, function(ret, err) {
      $.pub('loader/ajax/always', [ret, err]);
      if (ret) {
        var e = $.Event('loader/ajax/done');
        $.pub(e, ret);
        if (e.isDefaultPrevented()) return;
      } else {
        var e = $.Event('loader/ajax/fail');
        $.pub(e, err);
        if (e.isDefaultPrevented()) return;
      }
      callback(ret, err);
    });
  };
  exports.ajax = loader.ajax = ajax;

  // 监听全局ajax消息
  +function(loader) {
    var oAjaxCode = {
      init: function() {
        oAjaxCode.oMap = yp.mix({
          // 登陆超时跳转
          50001: function(msg) {
            var sUrl = msg.data
            if (typeof sUrl === 'string') {
              var sMsg = msg.message || msg.msg;
              var jumpTo = function() {
                location.href = sUrl;
              };
              if (sMsg) alert(sMsg, jumpTo);
              else jumpTo();
            }
          }
        }, window.oPageConfig && window.oPageConfig.oAjaxCodeMap);

        ///$.sub('loader/ajax/done.loader', oAjaxCode.ajaxMsgCheck);
      }
    , ajaxMsgCheck: function(e, msg) {
        if ($.isEmptyObject(msg)) {
          api.alert({'msg' : '数据接口返回为空对象，请检查'});
          return false;
        }
        var fError = oAjaxCode.oMap[msg.code]
        if (fError) {
          fError(msg);
          return false;
        }
      }
    };
    oAjaxCode.init();
    loader.oAjaxCode = oAjaxCode;
  }(loader);

  var ready = function(callback) {
    if (callback) {
      apiready = function() {
        $.pub('loader/ready/before');
        callback();
        $.pub('loader/ready/after');
      };
    }
  };
  exports.ready = loader.ready = ready;
}($, yp);

/* 全局UI模块 */
+function($, yp) {
var
  win = this
, exports = yp
, ui = exports.ui
, system = exports.system;

  // loading模块
  +function(ui, system) {
    var nDelay = 300
    var nCount = 0
    var timer = null
    var oLoading = {
      toggle: function(flag) {
        if (flag) {
          // system.showProgress({
          //   style: 'default'
          // , animationType: 'fade'
          // , title: '努力加载中...'
          // , text: '先喝杯茶...'
          // , modal: false
          // });
        } else {
          system.hideProgress();
        };
      }
    , loadBegin: function() {
        ++nCount;
        if (!timer) {
          timer = setTimeout(function() {
            oLoading.toggle(true);
          }, nDelay);
        }
      }
    , loadEnd: function() {
        if (--nCount <= 0) {
          clearTimeout(timer);
          timer = null;
          oLoading.toggle(false);
        }
      }
    };
    $.sub('loader/ajax/start.ui', oLoading.loadBegin);
    $.sub('loader/ajax/always.ui', oLoading.loadEnd);

    ui.oLoading = oLoading;
  }(ui, system);

  // 下拉刷新
  var setRefreshHeaderInfo = function(options, callback) {
    options = yp.mix({
      visible: true
    , loadingImgae: 'widget://image/refresh-white.png'
    , bgColor: '#f6f7f8'
    , textColor: '#fff'
    , textDown: '下拉试试...'
    , textUp: '松开试试...'
    , showTime: true
    }, options);
    system.setRefreshHeaderInfo(options, callback);
  };
  exports.setRefreshHeaderInfo = ui.setRefreshHeaderInfo = setRefreshHeaderInfo;

  // 监听错误消息
  $.sub('error/ui.ui', function(e, msg) {
    var e = $.Event('yp/ui/error/' + msg.code)
    yp.pub(e, msg.data);
    if (e.isDefaultPrevented()) return;
    api.alert({'msg' : msg.message});
  });
  $.sub('error/sys.ui', function(e, msg) {
    throw new Error('yp提示：' + msg.message);
  });

  // 系统异常错误提示
  yp.sub('page/error/sys.ui.event', function(e, data) {
    $.pub('error/sys', data);
  });
}($, yp);

/* 系统函数模块 */
+function($, yp, noapi) {
var
  win = this
, exports = yp
, system = exports.system
, isPC = (/Windows NT/gi).test(navigator.appVersion);

  yp.each([
    'ajax'
  , 'showProgress'
  , 'hideProgress'
  , 'alert'
  , 'confirm'
  , 'setRefreshHeaderInfo'
  , 'refreshHeaderLoadDone'
  ], function(name) {
    system[name] = function() {
      api[name].apply(api, arguments);
    };
  });

  // 浏览器模拟
  if (isPC) {
    +function() {
      var oApi = {}
      yp.each([
        'showProgress'// loading条
      , 'hideProgress'
      , 'alert'// 对话框
      , 'confirm'
      , 'setRefreshHeaderInfo'// 下拉加载
      , 'refreshHeaderLoadDone'
      , 'getPicture'
      , 'addEventListener'
      , 'execScript'
      , 'closeWin'
      , 'require'
      ], function(name) {
        oApi[name] = function() {};
      });
      oApi.ajax = function(options, callback) {
        options.data = options.data && options.data.values;///
        $.ajax(options)
        .done(function(msg) {
          callback(msg);
        });
      };
      oApi.alert = oApi.toast = function(options) {
        api.alert({'msg' : options.msg});
      };
      oApi.openWin = function(options) {
        location.href = options.url;
      };
      oApi.require = function(options) {
        return {
          playVideo: yp.noop
        , showInputView: yp.noop
        , sendGiftToAnchor: yp.noop
        };
      };
      oApi.systemVersion = '';
      //for test
      $.ajax = function() { return {done : function() {}} };

      setTimeout(function() {
        apiready();
      }, 500);

      win.api = oApi;
    }();
  }

  /*$.sub('loader/ready/before.system', function() {
    exports.system = api;
  });*/
}($, yp);