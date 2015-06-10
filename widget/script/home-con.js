 /* =============================================
 * v20150127.1
 * =============================================
 * Copyright Napster
 *
 * 我的
 * ============================================= */
apiready = function() {

  api.addEventListener({name:'viewappear'}, function(ret, err){
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
      $('#wealth').removeClass('hidden');
      $('#task').removeClass('hidden');
      fInitInfo();
		},

    openLoginWin : function() {
      api.openWin({
        name:'landing',
        url:'../html/landing.html',
        delay:0,
        bgColor:'#FFF',
        animation: {
          type: 'movein',
          subType: 'from_bottom',
          duration: 300
        },
        pageParam: {name: 'home'}
      });
    },

		listen: function()　{
      var self = this;

      //断网提示
      // api.addEventListener({
      //   name: 'offline'
      // }, function(ret, err){
      //   showNoNetWork();
      // });

      //网络恢复
      api.addEventListener({
        name:'online'
      },function(ret,err){
        if(!$('#noPage').hasClass('hidden')) {
          fInitInfo();
        }
      })

      //点击重新加载页面
      $('#wrap').on('click',  function() {
        if(!$('#noPage').hasClass('hidden')) {
          showLoading();
          fInitInfo();
        }
      });

      // 我的订阅
      $('#records').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          self.openLoginWin();
        } else{
          api.openWin({name:'subscribe',url:'subscribe.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 观看历史
      $('#history').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          self.openLoginWin();
        } else{
          api.openWin({name:'history',url:'history.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 我的钱包
      $('#wealth').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          self.openLoginWin();
        } else{
          api.openWin({name:'wealth',url:'wealth.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 每日任务
      $('#task').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          self.openLoginWin();
        } else{
          api.openWin({name:'task',url:'task.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 应用设置
      $('.js-setting').on('click', function() {
        api.openWin({name:'settings',url:'settings.html?user=true',delay:0,slidBackEnabled : true,bgColor:'#FFF'});
      });

      // 问题反馈
      $('#feed-back').on('click', function() {
        api.openWin({name:'feed-back',url:'settings-feed-back.html',delay:0,bgColor:'#FFF'});
      });
		}
	}
	oPage.init();
}

var sub = false, his = false, task = false;

function fInitInfo() {


  $('#box-list').find('li.active').removeClass('active');
  var user = $api.getStorage('user');

  if(!$.isEmptyObject(user)) {
    // 我的订阅
    fGetSubscribe();
    // 观看历史
    fGetHistory();
    // 每日任务
    fGetTask();
    // 我的钱包
    $('#wealthInfo').html('查看送礼充值记录');
  } else{
    $('#recordsInfo').html('登录后可查看您订阅的主播');
    $('#taskInfo').html('登录后可通过任务获得战旗币');
    $('#historyInfo').html('登录后可查看您观看历史');
    $('#wealthInfo').html('登录后可查看我的资金信息');
    showContent(true);
  }

  

}

function showNoNetWork() {
  $('#homePage, #loadPage').addClass('hidden');
  $('#noPage').removeClass('hidden');
}

function showLoading() {
  $('#homePage, #noPage').addClass('hidden');
  $('#loadPage').removeClass('hidden');
}

function showContent(flag) {
  if((sub && his && task )|| flag) {
    setTimeout(function() {
      $('#loadPage, #noPage').addClass('hidden');
      $('#homePage').removeClass('hidden');
    },500)
  }
}

function fGetSubscribe() {
  yp.ajax({
    url: URLConfig('followList')
  , method: 'post'
  , dataType: 'json'
  , notLoad: true
  }, function(ret, err) {
    if(!ret || err) {
      showNoNetWork();
      return;
    }

    if(ret['code'] == 0) {
      var num = 0;
      for(var i = 0, l = ret['data'].length; i < l; i++) {
        var one = ret['data'][i];
        if(4 == one['status']) {
          num++;
        }
      }
      $('#recordsInfo').html(num + '位主播正在直播中');
      sub = true;
      showContent();
    } else{
      // api.alert({msg : ret['message']});
    }
 
  });
}
function fGetHistory() {
  yp.ajax({
    url: URLConfig('history')
  , method: 'post'
  , dataType: 'json'
  , notLoad: true
  }, function(ret, err) {
    if(!ret || err) {
      // showNoNetWork();
      showContent();    //历史记录接口超时，也让显示
      return;
    }

    if(ret['code'] == 0) {
      var dataArr = [];
      var shtml = '';
      $.each(ret['data'],  function(key, val) {
        dataArr.push(val);
      });
      var one = dataArr[0];
      if(one) {
        shtml = '最近观看“' + one.title + '”';
      } else{
        shtml = '暂时没有记录';
      }
      $('#historyInfo').html(shtml);
      his = true;
      showContent();
    } else{
      // api.alert({msg : ret['message']});
    }
  });
}

function fGetTask() {
  yp.ajax({
    url: URLConfig('sTaskCompleteStatusUrl')
  , method: 'post'
  , dataType: 'json'
  , notLoad: true
  }, function(ret, err) {
    if(!ret || err) {
      showNoNetWork();
      return;
    }

    if(ret.code == 0) {
      var isFinish = true;
      for(var i in ret.data) {
        if(ret.data.hasOwnProperty(i)) {
          if(ret.data[i].status < 2) {
            isFinish = false;
            break;
          }
        }
      }
      if(!isFinish) {
        $('#taskInfo').html('今日任务未完成');
      } else{
        $('#taskInfo').html('今日任务已完成');
      }

      task = true;
      showContent();
      
    } else{
      // api.alert({msg: ret.message});
    }
 
  });
}