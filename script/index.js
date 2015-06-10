/* =============================================
 * 20150128.1
 * =============================================
 * Copyright Napster
 *
 * 首页
 * ============================================= */

function openFollows(){
  var user = $api.getStorage('user');
  if($.isEmptyObject(user)) {
    // api.confirm({
    //   msg: '您尚未登录，是否现在登录？',
    //   buttons:[ '取消', '登录']
    // },function(ret,err){
    //   if(ret.buttonIndex == 2){
    //     api.openWin({
    //       name:'landing',
    //       url:'./html/landing.html',
    //       delay:0,
    //       bgColor:'#FFF',
    //       animation: {
    //         type: 'movein',
    //         subType: 'from_bottom',
    //         duration: 300
    //       },
    //       pageParam: {name: 'subscribe'}
    //     });
    //   }
    // });
    api.openWin({
      name:'landing',
      url:'./html/landing.html',
      delay:0,
      bgColor:'#FFF',
      animation: {
        type: 'movein',
        subType: 'from_bottom',
        duration: 300
      }
    });
  } else{
    api.openWin({
      name:'subscribe',
      url:'./html/subscribe.html',
      delay:0,
      bgColor:'#FFF'
    });
  }
}

function openSearch(){
  api.openWin({name:'search',url:'./html/search.html',delay:0,bgColor:'#FFF'});
}

//打开观看历史
function openHistory(){
  var user = $api.getStorage('user');
  if($.isEmptyObject(user)) {
    api.openWin({
      name:'landing',
      url:'./html/landing.html',
      delay:0,
      bgColor:'#FFF',
      animation: {
        type: 'movein',
        subType: 'from_bottom',
        duration: 300
      }
    });
  } else{
    api.openWin({
      name: 'history',
      url: './html/history.html',
      delay: 0,
      bgColor: '#FFF'
    });
  }
}



//frame whether open
function isOpened(frmName){
  var i = 0;
  var len = window.frameArr.length;
  var mark = false;
  for(i; i<len; i++){
    if(window.frameArr[i] === frmName){
      mark = true;
      return mark;
    }
  }
  return mark;
}

function openTab(type, pageParam){

  var self = this;
  var headPos = $('#head').offset().height;
  var height = api.winHeight - $('#head').offset().height - $('#footer').offset().height;

  var bounces = true;
  var vScrollBarEnabled = false;
  type = type || 'main';
  
  //默认把live关掉
  api.closeFrame({
    name: 'gameLive'
  });

  //默认把home-con放到后面
  if(type != 'home'){
    api.setFrameAttr({
      name: 'home-con',
      hidden: true
    });
  }
  //如果打开home页则不显示头部
  if(type == 'home'){
    headPos = 0;
    // height = height + 64;
    bounces = false;
  }
  //record page id
  window.prevPid = window.curPid;
  window.curPid = type;

  if(window.prevPid !== window.curPid){
    if(isOpened(type)){
      api.setFrameAttr({
        name: type,
        hidden: false
      });
      if(type == 'home'){
        api.setFrameAttr({
          name: 'home-con',
          hidden: false
        });
      }

      closeGameLive();

    }else{
      api.openFrame({
        name: type,
        url: './html/'+ type +'.html',
        bounces: bounces,
        opaque: true,
        vScrollBarEnabled: true,
        pageParam: pageParam,
        rect: {
          x: 0,
          y: headPos,
          w: 'auto',
          h: height
        }
      });
      if(type == 'home'){
        var height = api.frameHeight -  $('#footer').offset().height - 105;
        
        var headPos = 105;   //物理像素 头部
        api.openFrame({
          name: 'home-con',
          url: './html/home-con.html',
          bounces: true,
          opaque: true,
          vScrollBarEnabled: true,
          hScrollBarEnabled: true,
          rect: {
            x: 0,
            y: headPos,   //65 广告条 130+
            w: 'auto',
            h: height
          }
        });
      }


    }
    if(window.prevPid){
      api.setFrameAttr({
        name: prevPid,
        hidden: true
      });
    }
    if(!isOpened(type)){
      //save frame name
      window.frameArr.push(type);
    }
  }

  
}
var curNav = 0;
function changeTabBar(idx){
  var activeClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
  var navClass = ['icon-home-line','icon-directseeding-line','icon-more-line','icon-my-line'];
  
  var lastNav = curNav;
  curNav = idx;
  if(curNav != lastNav){
    $('#footer-nav li').eq(curNav).find('i').addClass(activeClass[curNav]).removeClass(navClass[curNav]);
    $('#footer-nav li').eq(lastNav).find('i').addClass(navClass[lastNav]).removeClass(activeClass[lastNav]);
    $('#footer-nav li').eq(curNav).addClass('active');
    $('#footer-nav li').eq(lastNav).removeClass('active');
  }else{
    return;
  }
}
function openLiveList(){
  openTab('live');
  changeTabBar(1);
}
function openGameList(){
  closeGameLive();
  openTab('game');
  changeTabBar(2);
}
function openGameLive(param){
  var self = this;
  var headPos = $('#head').offset().height;
  var height = api.winHeight - $('#head').offset().height - $('#footer').offset().height;
  if(param['isIndex']) {
    $api.setStorage('isIndex',true);
  }

  api.openFrame({
    name: 'game-live-frame',
    url: './html/game-live-frame.html',
    bounces: true,
    opaque: true,
    vScrollBarEnabled: false,
    pageParam: { 'id' : param['id'] },
    rect: {
      x: 0,
      y: headPos,
      w: 'auto',
      h: height
    }
  });

  //改变顶部显示栏
  var title = param['title'];
  $('#logo').addClass('hidden');
  $('#gameClose').removeClass('hidden');
  $('#gameTitle').text(title).removeClass('hidden');


  if(window.curPid){
    api.setFrameAttr({
      name: window.curPid
    , hidden: true
    });
    window.curPid = 'gameLive';
  }
  changeTabBar(2);
}

//点击logo返回首页并刷新
function openMain(){
  var i = 0;
  var len = window.frameArr.length;
  var newarr = [];
  for(i; i<len; i++){
    if(window.frameArr[i] != 'main'){
      newarr.push(window.frameArr[i]);
    }
  }
  window.frameArr = newarr;
  //默认把live关掉
  api.closeFrame({
    name: 'main'
  });
  if(window.curPid == 'main'){
    window.curPid = '';
  }
  openTab('main');
  changeTabBar(0);
}

// 当用户第一次加载app时清空用户数据，只需要清空一次
function fClearUser() {
  var isClearUser = $api.getStorage('isClearUser');
  if(!isClearUser) {
    $api.setStorage('isClearUser', true);
    $api.setStorage('user', null);
    $api.setStorage('token',null);
  }
}

function fCheckLogin() {
  var user = $api.getStorage('user');
  var password = $api.getStorage('password');
  if(!user || !password) return;
  yp.ajax({
    url : URLConfig('login'),
    method : 'post',
    dataType : 'json',
    data: {
      values: {'account' : user['account'], 'password' : password}
    }
  }, function(ret, err) {
      if(!ret) return;
      if(ret.code == 0) {
        $api.setStorage('user', ret['data']);
      }
  });
}

//关闭游戏子页面
function closeGameLive() {
  $('#logo').removeClass('hidden');
  $('#gameClose, #gameTitle').addClass('hidden');
  api.closeFrame({
    name: 'game-live-frame'
  });
}


apiready = function() {
  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

  /* 清空用户数据 lulu */
  fClearUser(); 
  /* 清空用户数据 */

  /* 默默登陆 */
  // 应用被重新打开时执行
  fCheckLogin(); 
  // 当应用从后台转到前台执行
  api.addEventListener({name:'resume'}, function(ret, err){
    fCheckLogin();
  });
  // api.addEventListener({name:'pause'}, function(ret, err){
  // });
  /* 默默登陆 end*/
  // api.alert({'msg' : 'hhhh' + api.appParam});
  // api.addEventListener({name : 'noticeclicked'},function(ret,err) {
  //   alert(JSON.stringify(ret) + api.appParam);
  // })


  window.openGameLived = function() {
     //安卓系统返回键 
    api.addEventListener({
      name: 'keyback'
    }, function(ret, err){
      $('#gameClose').trigger('click');
    });
  }


 


  var ui = {
    
  }

  try{
    
    if(api.systemType === 'android') {
      api.addEventListener({name : 'appintent'},function(ret,err) {
        var roomid = ret['appParam'];
        if(roomid) {
          var options = {
              name:'rooms'
            ,'slidBackEnabled' : false
            , url:'./html/rooms.html'
            , pageParam : {'roomid' : roomid}
            , bgColor:'#FFF'
            , reload: true
          }
          if(api.systemType === 'android') {
            options['animation'] = {
              duration : 400
            }
            options['alone'] = true;
          }
          api.openWin(options);
        }
      });
    }
    
    var zhanqi = api.require('zhanqiMD');
    var user = $api.getStorage('user');
    if(!$.isEmptyObject(user)) {
      zhanqi.onAppStarted({
        userName : user['account'],
        userUID : user['uid'],
        nickName : user['nickname'],
        token : user['token'],
        userAvatar : user['avatar'] 
      });
    }else{
      zhanqi.onAppStarted({});
    }
  }catch(e) {}


  
  var oPage = {
    init : function() {
      this.view();
      this.listen();

    },

    view : function() {
      var self = this;
      //已经打开的frame
      window.frameArr = [];
      //当前页面
      window.curPid = '';
      //上一张页面
      window.prevPid = '';

      //var obj = api.require('tabBar');
      // obj.open({
      //     bgImg:'widget://res/tabBar_bg.png',
      //     selectImg:'widget://res/selecte_tabBar.png',
      //     items:[
      //       {img:'widget://image/tabbar/home.png'},
      //       {img:'widget://image/tabbar/news-icon.png'},
      //       {img:'widget://image/tabbar/life-icon.png'},
      //       {img:'widget://image/tabbar/user-icon.png'}
      //     ]
      // },function(ret,err){
      //   var frame = [
      //     'main'
      //   , 'game'
      //   , 'live'
      //   , 'gamelist'
      //   ];
      //   openTab(frame[ret.index]);
      // });
      api.parseTapmode();
      //初始化打开main
      openTab('main');

    },
    listen : function()　{
      var self = this;
      $('#footer-nav').on('touchstart', 'li',function(e){
        e.preventDefault();
        $self = $(this);
        var idx = $self.index();
        var frame = [
          'main'
        , 'live'
        , 'game'
        , 'home'
        ];
        changeTabBar(idx);
        openTab(frame[idx]);
      });

      //游戏页面返回
      $('#gameClose').on('click', function() {
        closeGameLive();
        var isIndex = $api.getStorage('isIndex');
        if(isIndex) { //返回首页
          openTab('main');
          changeTabBar(0);
        }else{ //返回游戏页
          openTab('game');
          changeTabBar(2);
        }
        $api.setStorage('isIndex','');

        api.removeEventListener({
          name: 'keyback'
        });


      });

    },

    onRecvPushMsg  : function(roomid) {
      if(roomid) {
        api.openWin({
            name:'rooms'
          ,'slidBackEnabled' : false
          , url:'./html/rooms.html'
          , pageParam : {'roomid' : roomid}
          , bgColor:'#FFF'
        });
      }
    },

    closeGameLivePage : function() {
      $('#gameClose').trigger('click');
    }



  }

  window.onRecvPushMsg = oPage.onRecvPushMsg;
  window.closeGameLivePage = oPage.closeGameLivePage;

  // 获取加密后的设备号
  window.getEquipment = function(mei) {
    alert(mei);
    api.setStorage('mei', mei);
  };

  oPage.init();
}