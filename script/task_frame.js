/*
2014.10.18
每日任务
魏露霞
 */
var oPageConfig = {
      oTask: {
        regist: { type: 'regist', status: 0, default_txt: '注册成为战旗用户，领取500战旗币', btn_default_txt: '注册', complete_txt: '注册成功，您可领取500战旗币', finish_txt: '您今日已领取奖励', btn_complete_txt: '点击领取', btn_finish_txt: '已领取', show_area: 0, show_status: 0, action_class: 'js-regist', jump_url: '', task_icon: 'icon-mission', show: true, title: '注册任务'}
      , phone: { type: 'phone', status: 0, default_txt: '绑定安全手机，领取2000战旗币', btn_default_txt: '绑定', complete_txt: '绑定成功，您可领取2000战旗币', finish_txt: '您今日已领取奖励', btn_complete_txt: '点击领取', btn_finish_txt: '已领取', show_area: 0, show_status: 0, action_class: '', jump_url: '/user/info', task_icon: 'icon-mission', show: true, title: '绑定手机' }
      , avatar: { type: 'avatar', status: 0, default_txt: '更换头像，领取100战旗币', btn_default_txt: '更换', complete_txt: '恭喜您更换成功，您可领取100战旗币', finish_txt: '您今日已领取奖励', btn_complete_txt: '点击领取', btn_finish_txt: '已领取', show_area: 0, show_status: 0, action_class: '', jump_url: '/user/info', task_icon: 'icon-headsculpture', show: true, title: '更换头像'}
      , sign: { 
          type: 'sign', 
          status: 0, 
          default_txt: '完成七日连续签到可获得650金币奖励', 
          btn_default_txt: '签到', 
          complete_txt: '当前可领取YYY金币，XXX战旗币奖励', 
          btn_complete_txt: '领取', 
          finish_txt: '您今日已领取奖励', 
          btn_finish_txt: '已领取', 
          show_area: 0, 
          show_status: 1, 
          action_class: 'js-sign', 
          jump_url: '', 
          task_icon: 'icon-theproblemoffeedback', 
          show: true, 
          title: '每日签到' 
        }
      , app: { 
          type: 'app', 
          status: 0, 
          default_txt: '安装登录后观看5分钟领取600金币', 
          btn_default_txt: '观看', 
          complete_txt: '您已完成任务点击领取YYY金币', 
          finish_txt: '您今日已领取奖励', 
          btn_complete_txt: '领取', 
          btn_finish_txt: '已领取', 
          show_area: 0, 
          show_status: 0, 
          action_class: 'js-app', 
          jump_url: '', 
          task_icon: 'icon-ic_install', 
          show: true, 
          title: '安装APP' 
        }
      , appview: {
          type: 'appview', 
          status: 0, 
          default_txt: '登录后观看5分钟领取30金币', 
          btn_default_txt: '观看', 
          complete_txt: '您已完成任务点击领取YYY金币', 
          btn_complete_txt: '领取', 
          finish_txt: '今日已完成任务，请明日再来', 
          btn_finish_txt: '领取', 
          show_area: 0, 
          show_status: 1, 
          action_class: 'js-appview', 
          jump_url: '', 
          task_icon: 'icon-ic_play', 
          show: true, 
          title: 'APP观看直播' 
        }
      , share: { 
          type: 'share', 
          status: 0, 
          default_txt: '成功邀请一个好友即可领取10金币', 
          btn_default_txt: '领取', 
          complete_txt: '您当前通过分享获得YYY金币，点击领取', 
          btn_complete_txt: '领取', 
          finish_txt: '', 
          btn_finish_txt: '已领取', 
          show_area: 0, 
          show_status: 1, 
          action_class: '', 
          jump_url: '', 
          task_icon: 'icon-share', 
          show: true, 
          title: '分享直播' 
        }
      }   
    , aTaskDefault: [
        { type: 'regist', status: 0 }, 
        { type: 'phone', status: 0 }, 
        { type: 'avatar', status: 0 }, 
        { type: 'sign', status: 0 }, 
        { type: 'share', status: 0 },
        { type: 'app', status: 0 },
        { type: 'appview', status: 0 }
      ]
    };
apiready = function() {

  api.setRefreshHeaderInfo({
    visible: true,
    loadingImgae: 'widget://image/refresh-white.png',
    bgColor: '#f6f7f8',
    textColor: '#000',
    textDown: '下拉试试...',
    textUp: '松开试试...',
    showTime: true
  }, function(ret, err){
    fInitInfo();
  });
  
  var ui = {
  }

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    },
    view: function() {
      var self = this;
    },
    listen: function()　{
      var self = this;
      // 更换头像
      $('#taskList').on('click', '#btn-avatar' ,function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 0 ) {
          api.openWin({
            name: 'personal'
          , url: '../html/personal.html'
          });
        } else if(status == 1) {
          self.fReceive($this, type);
        }
      });
      // 绑定手机
      $('#taskList').on('click', '#btn-phone' ,function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 0 ) {
          api.openWin({
            name: 'editPhone'
          , url: '../html/editPhone.html'
          });
        } else if(status == 1) {
          self.fReceive($this, type);
        }
      });
      // 注册任务
      $('#taskList').on('click', '#btn-regist' ,function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 0 ) {
          api.openWin({
            name: 'register'
          , url: '../html/register.html'
          });
        } else if(status == 1) {
          self.fReceive($this, type);
        }
      });
      // 每日签到
      $('#taskList').on('click', '#btn-sign' ,function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 0 ) {
          // 签到
          yp.ajax({
            url: URLConfig('sSignInUrl')
          , method: 'post'
          , dataType: 'json'
          }, function(ret, err) {
            if(ret) {
              if(ret.code == 0) {
                api.openWin({
                  name: 'sign-in'
                , url: '../html/sign-in.html'
                , pageParam: ret.data
                });
              } else{
                api.alert({msg: ret.message});
              }
            }
          });
        } else if(status == 1) {
          self.fReceive($this, type);
        }
      });
      // 分享直播
      $('#taskList').on('click', '#btn-share' ,function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 1) {
          self.fReceive($this, type);
        }
      });
      // 安装App
      $('#taskList').on('click', '#btn-app', function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 0 ) {
          // 点击观看按钮随机进入一个直播间
          self.fEnterRoom();
        } else if(status == 1) {
          self.fReceive($this, type);
        }
      });
      // App观看直播
      $('#taskList').on('click', '#btn-appview', function() {
        var $this = $(this)
          , type = $this.closest('li').data('type')
          , status = $this.closest('li').data('status');
        if(status == 0 ) {
          // 点击观看按钮随机进入一个直播间
          self.fEnterRoom();
        } else if(status == 1) {
          self.fReceive($this, type);
        }
      });
    }
  , fReceive: function($obj, type) {
      var self = this;
      yp.ajax({
        url: URLConfig('sTaskReceiveUrl')
      , method: 'post'
      , dataType: 'json'
      , data: {
          values: {
            type: type
          }
        }
      }, function(ret, err) {
        if(ret) {
          if(ret.code == 0) {
            $obj.addClass('btn-finish').text(oPageConfig.oTask[type].btn_finish_txt).closest('li').data('status', 2);
            $obj.closest('li').find('.tip').html(oPageConfig.oTask[type].finish_txt);
            /* lulu */
            if(type == 'app') {
              $obj.closest('li').remove();
            }
            /* lulu end */
          } else{
            api.alert({msg: ret.message});
          }
        }
      });
    }
  , fEnterRoom: function() {
      var self = this;
      var pageNow = Math.ceil(Math.random() * 40); 

      self.getDataIndex(URLConfig('liveList', {
        'num': 1
      , 'page': pageNow
      }), function(data) {
        var options = {
            name:'rooms'
          , slidBackEnabled : false
          , url:'rooms.html'
          , pageParam : {'roomid' : data['rooms'][0].id}
          , bgColor:'#FFF'
        };

        if(api.systemType === 'android') {
          options['animation'] = {
            duration : 400
          }
          options['alone'] = true;
        }
        api.openWin(options);
      });
    }
  , getDataIndex : function(url,callback) {
      var self = this;

      yp.ajax({
        url : url,
        method : 'get',
        timeout: 3000,
        dataType : 'json'
      }, function(ret, err) {
        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.alert({msg : ret['message'] || ret['msg']});
        }
      });
    }
  }
  oPage.init();
}
// 初始化
function fInitInfo() {
  var user = $api.getStorage('user');
  if(!$.isEmptyObject(user)) {
    fChangeStatus();
  } else{
    fShowTask(oPageConfig.aTaskDefault);
  }
}
function fChangeStatus() {
  yp.ajax({
    url: URLConfig('sTaskCompleteStatusUrl')
  , method: 'post'
  , dataType: 'json'
  }, function(ret, err) {
    if(ret) {
      if(ret.code == 0) {
        /* lulu */
        // ret.data.app = {"type":"app","status":0};
        // ret.data.appview = {"type":"appview","status":0};
        /* lulu end*/
        var aTask = [];
        for(var i in ret.data) {
          if(ret.data.hasOwnProperty(i)) {
            aTask.push(ret['data'][i]);
          }
        }
        fShowTask(aTask);
      } else{
        api.alert({msg: ret.message});
      }
    } else{
      api.alert({msg: '网络似乎出现了异常'});
      // api.alert({
      //   msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      // });
    }
  });
  api.refreshHeaderLoadDone();
}
// 任务的显示
function fShowTask(aTaskShow) {
  var aTask = [];
  // 遍历data，生成可显示的任务
  for(var i = 0, l = aTaskShow.length; i < l; i++) {
    var one = aTaskShow[i];
    var oTask = $.extend({}, oPageConfig.oTask[ one.type ]);
    if(oTask.show){
      oTask.coin = one.coin;
      oTask.status = one.status;
      /* lulu */
      oTask.gold = one.gold;
      /* end */
      // status: 0(未操作) 1(领取奖励) 2(已领取)
      if( 2 == one.status ){
        if( 1 == oTask.show_status){
          aTask.push(oTask);
        }
      } else{
        aTask.push(oTask);
      }
    }
  }
  // 遍历可显示的任务，生成html，并显示
  var sHtml = ''
  for(var i = 0, l = aTask.length; i < l; i ++) {
    var one = aTask[i];
    var txt = '';
    var btnTxt = '';
    var finishClass = '';
    if(one.status == 1) {
      // 已绑定未领取
      txt = one.complete_txt;
      txt = txt.replace('XXX', one.coin);
      /* lulu */
      txt = txt.replace('YYY', one.gold);
      /* end */
      // btnTxt = one.btn_complete_txt;
      btnTxt = '<a href="javascript:;" class="btn-task" id="btn-'+ one.type +'">'+ one.btn_complete_txt +'</a>';
    } else if(one.status == 2){
      // 已绑定领取
      txt = one.finish_txt;
      // btnTxt = one.btn_finish_txt;
      // finishClass = 'btn-finish';
      if(0 == one.show_area) {
        btnTxt = '<a href="javascript:;" class="btn-task btn-finish" id="btn-'+ one.type +'">'+ one.btn_finish_txt +'</a>';
      } else{
        btnTxt = '';
      }
    } else{
      // 未绑定
      txt = one.default_txt;
      // btnTxt = one.btn_default_txt;

      /* lulu */
      var btnClass = '';
      if(one.type == 'share') {
        btnClass = 'btn-finish';
      }
       /* lulu end */
      if(0 == one.show_area) {
        btnTxt = '<a href="javascript:;" class="btn-task ' + btnClass + '" id="btn-'+ one.type +'">'+ one.btn_default_txt +'</a>';
      } else{
        btnTxt = '';
      }
    }
    sHtml += '<li data-status="'+ one.status + '" data-type="'+ one.type + '">\
                ' + btnTxt + '\
                <div class="main">\
                  <p class="til"><i class="icon-m ' + one.task_icon + '"></i>' + one.title + '</p>\
                  <p class="tip">' + txt + '</p>\
                </div>\
              </li>';
  }
  $('#taskList').empty().html(sHtml);
}