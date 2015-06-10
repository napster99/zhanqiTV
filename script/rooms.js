/* =============================================
 * v20141019.2
 * =============================================
 * Copyright Napster
 *
 * 直播间代码
 * ============================================= */

var curMenu = 1, oldMenu = '', openMenuWin = {}, fansTitle = '', anchorUid = '';
var isChatMode = false, chatModeVideoH = 0, followState = 0;
var isAndroidOpend = false;

apiready = function(){
  var ui = {
     $gameName : $('#gameName')
    ,$anchorName : $('#anchorName')
    ,$topLogo : $('#topLogo')
    ,$gameList : $('#gameList')
    ,$liveList : $('#liveList')

    ,$chatList : $('#chatList')
    ,$giftList : $('#giftList')

  }


  
  var aFaceList = {
    '害羞': '1',
    '鄙视': '2',
    '发怒': '3',
    '微笑': '5',
    '阴险': '6',
    '流泪': '7',
    '大兵': '9',
    '困': '10',
    '猪头': '12',
    '奋斗': '13',
    '坏笑': '14',
    '晕': '15',
    '鼓掌': '16',
    '酷': '17',
    '色': '18',
    '发呆': '19',
    '惊讶': '20',
    '白眼': '21',
    '抓狂': '22',
    '憨笑': '23',
    '傲慢': '24',
    '敲打': '25',
    '衰': '26',
    '呲牙': '28',
    '惊恐': '29',
    '可怜': '30',
    '流汗': '31',
    '疑问': '32',
    '偷笑': '33',
    '撇嘴': '35'
  }

  var giftConfig = {}, giftCount = 1, giftId = '';  //礼物配置

  var selfUid = $api.getStorage('user') || 0;

  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.listen();
      this.view();
      api.openFrame({
          name: 'gift',
          url: '../html/gift.html',
          rect:{
              x:0,
              y:api.frameHeight - 350 - 50,
              w:api.frameWidth,
              h:350
          },
          pageParam: {roomid: api.pageParam['roomid']},
          bounces: false,
          opaque: false,
          bgColor: 'rgba(0,0,0,0)',
          vScrollBarEnabled:true,
          hScrollBarEnabled:true
      });

      api.setFrameAttr({
        name: 'gift',
        hidden: true
      });
    },

    fixIos7Bar : function(){
      var strDM = api.systemType;
      if (strDM == 'ios') {
        var strSV = api.systemVersion;
        var numSV = parseInt(strSV,10);   
        var fullScreen = api.fullScreen;
        var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
        if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
          return true;
        }
        return false;
      }
      return false;
    },

    view : function() {
      //初始化黑色框
      if(api.systemType === 'android') {
        $('#videoCon').height(api.frameWidth*9/16);
      }else{
        $('#videoCon').height(api.frameWidth*9/16 + 20);
      }
      
      setTimeout(function() {
        $('.play-btn').remove();
      },700);


      var roomId = api.pageParam['roomid'];
      
      if(!roomId) return;

      if(api.systemType === 'ios') {
        this.initNativeModel(roomId);
      }

      // this.initMenu();  //初始化菜单栏

      this.initWifiTip();

      this.initSettins();

      this.setRecord(roomId);  //写入观看历史

      this.initTrigerInfo(roomId);
    },

    initWifiTip : function() {

      // 您正在使用2G/3G网络，继续播放会产生流量费用，是否继续？
      var type = api.connectionType;
      if(type && type !== 'wifi' && type !== 'none') {
        var settings = $api.getStorage('settings  ');
        var which = 0;
        if(settings) { //默认设置
          which = settings['wifi'];
        }
        switch(which) {
          case 0:
            this.giveWifiTip();
            break;
          case 1:
            var once = $api.getStorage('once');
            if(once !== 'setted') {
              this.giveWifiTip();
              $api.setStorage('once','setted');
            }
            break;
        }
      }

    },

    giveWifiTip : function() {
      zhanqi.showNonWifiDialog({}); 
    },

    initNativeModel : function(roomId) {
      var headPos = 0;
      
      if(this.fixIos7Bar()) {
        headPos = 20;
      }

      var param = {
         'token' : $api.getStorage('token') || ''
        ,'x' : 0
        ,'y' : headPos
        ,'w' : api.frameWidth
        ,'h' : api.frameWidth*9/16
        ,'roomId' : roomId
        ,'fixedOn' : 'rooms'

        ,'_x' : 0
        ,'_y' : api.frameHeight - 50
        ,'_w' : api.frameWidth
        ,'_h' : 50


        ,'trigger' : 1   // 1 开     0 关

      }
      var user = $api.getStorage('user');
      if(!$.isEmptyObject(user)) {
        param['userName'] = user['account'];
        param['userAvatar'] = user['avatar'];
        param['nickName'] = user['nickname'];
        param['userUID'] = user['uid'];
      }
      
      zhanqi.playVideo(param);
      
      var param2 = {
         'x' : 0
        ,'y' : api.frameHeight - 50
        ,'w' : api.frameWidth
        ,'h' : 50
        ,'fixedOn' : 'rooms'
      }
      zhanqi.showInputView(param2);
    },

    initMenu : function(which) {
      which = which || 1;
      var el = $('#menu').find('ul li').eq(which);
      var className = this.getClassName(which,true);
      el.addClass('active');
      el.find('i').addClass(className);

      this.openMenuFrame('chat');
    },

    getClassName : function(which, current) {
      switch(which) {
        case 0:  //简介
          return current? 'icon-introduce-current2' : 'icon-introduce2';
        case 1:  //聊天
          return current? 'icon-chat-current2' : 'icon-chat2';
        case 2:  //视频
          return current? 'icon-video-current2' : 'icon-video2';
        case 3:  //排名
          return current? 'icon-ranking-current2' : 'icon-ranking2';
      }
    },

    //打开菜单frame  napster1
    openMenuFrame : function(name, flag) {
      if(openMenuWin[name]) {
        api.setFrameAttr({
          'name': 'profile',
          'hidden': true
        });
        api.setFrameAttr({
          'name': 'chat',
          'hidden': true
        });
        api.setFrameAttr({
          'name': 'video',
          'hidden': true
        });
        api.setFrameAttr({
          'name': 'rank',
          'hidden': true
        });


        api.setFrameAttr({
          'name': name,
          'hidden': false
        });
      }else{
        //第一次打开
        var y = api.winWidth*9/16,h = api.winHeight - api.winWidth*9/16;
        if(this.fixIos7Bar()) {
          y += 20;
          h -= 20;
        }
        y = parseInt(y);
        h = parseInt(h);
        var menuHeight = $('#menu').offset().height;
        y += menuHeight;
        // alert('y>'+y)

        y += 1;
        var options = {
            name: name,
            url: 'rooms-'+name+'-frame.html',
            rect:{x:0, y:y, w:'auto', h:'auto'},
            pageParam: {'roomId': api.pageParam['roomid'], 'fansTitle' : fansTitle, 'anchorUid' : anchorUid,'h' : h},
            bounces: false,
            opaque: false,
            bgColor: 'rgba(0,0,0,0)',
            vScrollBarEnabled:true,
            hScrollBarEnabled:true
        }
        if(name === 'chat') {
          options['rect'] = {x:0, y:y, w:'auto', h: h - 50 - menuHeight}
        }

        if(name === 'profile') {
          options['pageParam']['followState'] = followState;
        }

        if(isChatMode) { //聊天模式
          y = chatModeVideoH + menuHeight;
          h = api.winHeight - y;
          if(this.fixIos7Bar()) {
            y += 20;
            h -= 20;
          }
         options['rect'] = {x:0, y:y, w:'auto', h: h} 
        }

        api.openFrame(options);
        openMenuWin[name] = true;

        //是否隐藏打开
        if(flag) {
          api.setFrameAttr({
            'name': name,
            'hidden': true
          });
        }
      }
      oldMenu = name;
    },

    initSettins : function() {
      var data = $api.getStorage('settings') || {
          barrage : 1 //弹幕开关
         ,opacity : 1 //弹幕透明度
         ,size : 1 //弹幕大小
         ,pos : 0 //弹幕位置
         ,definition : 1 //清晰度选择
         ,lookBack : false //回看功能
         ,model : 0 //模式选择
         ,wifi : 0 //wifi提醒
         ,decode : 0 //0  软解    1  硬解
         ,push : true
         ,cacheSize : 0
      };
      data['submit'] = false;
      zhanqi.onGetSettingDataFromWeb(data);
    },

    listen : function()　{
      var self = this;
      //安卓系统返回键 
      api.addEventListener({
          name: 'keyback'
      }, function(ret, err){
          zhanqi.onHardwareKeyBack();
      });

      if(api.systemType === 'ios') {
        api.addEventListener({
            name:'shake'
        },function(ret,err){
          try{
            zhanqi.onDeviceShaked({});
          }catch(e) {}
        }); 

        api.addEventListener({
            name:'viewappear'
        },function(ret,err){
            try{
              zhanqi.onBackToLiveScene({});
            }catch(e) {}
        });

      }else{
        api.addEventListener({
            name:'viewappear'
        },function(ret,err){
            if(!isAndroidOpend) {
              self.initNativeModel(api.pageParam['roomid']);
              isAndroidOpend = true;
            }
        });
      }


      //菜单键切换
      $('#menu').find('li').on('touchstart', function() {
        if( (!fansTitle|| !anchorUid )) return;
        
        if(curMenu != $(this).index()) {
          if($(this).index() === 1) { //点击聊天Tab
            try{
              zhanqi.onPressMenuTab({'index' : 1});
            }catch(e){}
          }else{
            try{
              zhanqi.onPressMenuTab({'index' : $(this).index()});
            }catch(e){}
            var oldLi = $('#menu').find('li.active');
            var oldClassName = self.getClassName(oldLi.index());
            var oldClassNameCurrent = self.getClassName(oldLi.index(), true);
            oldLi.removeClass('active');
            oldLi.find('i').removeClass(oldClassNameCurrent).addClass(oldClassName);

            var newClassName = self.getClassName($(this).index());
            var newClassNameCurrent = self.getClassName($(this).index(), true);
            $(this).addClass('active');
            $(this).find('i').removeClass(newClassName).addClass(newClassNameCurrent);
            curMenu = $(this).index();
            var name = $(this).attr('name');
            self.openMenuFrame(name); 
          }
          
        }


      });

    },

    setRecord : function(roomId) {
      yp.ajax({
        url: URLConfig('recordWatch',{'roomid':roomId}),
        method: 'get',
        dataType: 'json',
        notLoad: true
      },  function() {});
    },

    initTrigerInfo : function(roomId) {
      yp.ajax({
          url: URLConfig('tChance',{'roomId':roomId}),
          method: 'get',
          dataType: 'json',
          notLoad: true
      },function(ret, err) {
        if(ret['code'] === 0) {
          var data = ret['data'],
          chance = data['chance'],
          roomChance = data['roomChance'],
          islogin = data['islogin'],
          totalChance = data['totalChance'],
          bindMobile = data['bindMobile'],
          lefttime = data['lefttime'];
          
          try{
            zhanqi.setTrigerInfo({
              'chance' : chance,
              'roomChance' : roomChance,
              'islogin' : islogin,
              'totalChance' : totalChance,
              'lefttime' : lefttime,
              'bindMobile' : bindMobile
            });
          }catch(e){}

        }else{
          api.alert({'msg' : ret['message'] || ret['msg']});
        }
      });
    }


  }


  oPage.init();

  //登录成功，重新获取
  window.initTrigerInfo = oPage.initTrigerInfo;

  //聊天模式 napster2  data 视频的高度
  window.onSwitchChatMode = function(data) {
    var y = api.winWidth*9/16,h = api.winHeight - api.winWidth*9/16;
    var menuHeight = $('#menu').offset().height;

    if(oPage.fixIos7Bar()) {
      y += 20;
      h -= 20;
    }
   y = parseInt(y);
   h = parseInt(h);   

    if(!data) {
      //视频模式
      if(api.systemType === 'android') {
        $('#videoCon').height(api.frameWidth*9/16);
      }else{
        $('#videoCon').height(api.frameWidth*9/16 + 20);
      }

      y += menuHeight;
      h -= menuHeight;

      resizeMenuFrame('profile', y, h);
      resizeMenuFrame('chat', y, h - 50);
      resizeMenuFrame('video', y, h);
      resizeMenuFrame('rank', y, h);
      isChatMode = false;
    }else{
     //聊天模式
      y = data + menuHeight;
      if(oPage.fixIos7Bar()) {
        y += 20;
      }
      h = api.winHeight - y;

      if(api.systemType === 'android') {
        $('#videoCon').height(data);
      }else{
        $('#videoCon').height(data + 20);
      }

      resizeMenuFrame('profile', y, h);
      resizeMenuFrame('chat', y, h - 50);
      resizeMenuFrame('video', y, h);
      resizeMenuFrame('rank', y, h);

      chatModeVideoH = data;
      isChatMode = true;
    }

    

  }


  window.resizeMenuFrame = function(name, y, h) {
    api.setFrameAttr({
      name: name,
      rect:{
          x:0,
          y:y,
          w:'auto',
          h:h
      }
    });

    //通知主播简介，区域改变
    api.execScript({
      frameName : 'profile',
      script: 'changeNoticeHeight('+h+');'
    });
  }

  

  window.onBtnBack = function() {

    api.execScript({
      frameName : 'chat',
      script: 'onBtnBack();'
    });
    
    api.closeWin();
    
    api.setFrameAttr({
      name: 'gift',
      hidden: true
    });
  }
  //打开礼物界面  
  window.onGiftBtnPressed = function() {
    api.setFrameAttr({
      name: 'gift',
      hidden: false
    });

    api.bringFrameToFront({
      from:'gift'
    });
  }

  //打开分享界面
  window.onShareBtnPressed = function(data) {
    if(typeof data == 'string')
      data = eval('('+data+')');
      api.openFrame({
        name: 'share',
        url: '../html/share.html',
        rect:{
            x:0,
            y:api.frameHeight - 200 - 50,
            w:api.frameWidth,
            h:200
        },
        pageParam: {'domain' : data['domain'], 'title' : data['title'], 'imgUrl' : data['bpic']},
        bounces: true,
        opaque: false,
        bgColor: 'rgba(0,0,0,0)',
        vScrollBarEnabled:true,
        hScrollBarEnabled:true
    });
  }

  window.onSelfGidBack = function(gid) {
    var obj = {
      gid : gid
    }
    obj = JSON.stringify(obj);
    api.execScript({
      frameName : 'chat',
      script: 'setVariable('+obj+');'
    });
  }

  //调用页面接口
  window.onOpenWin = function(pageName) {
    api.openWin({
      name:pageName,
      url:'../html/'+pageName+'.html',
      pageParam : {'isRoom' : true},
      bgColor:'#FFF'});
  }

  window.onOpenFrame = function(pageName, roomId, roomChance) {
    api.openFrame({
      name: pageName,
      url: '../html/'+ pageName +'.html',
      bounces: false,
      opaque: false,
      vScrollBarEnabled: false,
      pageParam: {'roomId' : roomId, 'roomChance' : roomChance},
      rect: {
        x:  0,
        y: 0,
        w: api.winWidth,
        h: api.winHeight
      }
    });
  }

  window.getRoomInfo = function(data) {
    if(typeof data == 'string') {
      data = eval('('+data+')');
    }

    fansTitle = data['fansTitle'];
    anchorUid = data['anchorUid'];

    var obj = {
      fans : data
    }
    
    obj = JSON.stringify(obj);

    setTimeout(function() {
      api.execScript({
        frameName : 'chat',
        script: 'setVariable('+obj+');'
      });
    },1000);


    //赋值以后初始化菜单frame
    if(fansTitle && anchorUid ) {
      oPage.initMenu();
    }
  }




    //切换到chat frame
    window.backToLiveChat = function() {
      var oldEl = $('#menu').find('li.active');
      var oldClassName = oPage.getClassName(oldEl.index());
      var oldClassNameCurrent = oPage.getClassName(oldEl.index(), true);
      oldEl.removeClass('active');
      oldEl.find('i').removeClass(oldClassNameCurrent).addClass(oldClassName);

      $('#menu').find('li').eq(1).addClass('active');
      $('#menu').find('li').eq(1).find('i').removeClass('icon-chat2').addClass('icon-chat-current2');
      curMenu = 1;
      oPage.openMenuFrame('chat');
      
      //通知视频区域去掉选中状态
      api.execScript({
        frameName : 'video',
        script: 'clearSelectedMode();'
      });

    }

    window.removeVideoSelected = function() {
      //通知视频区域去掉选中状态
      api.execScript({
        frameName : 'video',
        script: 'clearSelectedMode();'
      });
    }

 
}


function onRecvChatMsg(data) {
  api.execScript({
    frameName : 'chat',
    script: 'onRecvChatMsg('+data+');'
  });
}


function loginBackScript() {
  api.execScript({
    frameName : 'chat',
    script: 'clearChatMsg();'
  });
}

function sendGiftBack(){
  var zhanqi = api.require('zhanqiMD');
  var data = $api.getStorage('sendGiftParam');
  zhanqi.sendGiftToAnchor(data);
}

function closeGiftFrame() {
    api.execScript({
      frameName : 'gift',
      script: 'blurKeyBord();'
    });
    
    api.setFrameAttr({
      name: 'gift',
      hidden: true
    });

    api.closeFrame({
     name: 'share'
    });
}

function changeGiftStatus() {
  var zhanqi = api.require('zhanqiMD');
  zhanqi.closeGiftFrame({});
}


function reqNewTokenFromJS() {
  silenceLoginFn('rooms', 'onTokenUpdated', true, 'failBack');  
}

function onTokenUpdated() {
  var newToken = $api.getStorage('user')['token'];
  var zhanqi = api.require('zhanqiMD');
  zhanqi.onTokenUpdated({'token' : newToken});
}

function failBack() {
  var zhanqi = api.require('zhanqiMD');
  zhanqi.onTokenUpdated({'token' : ''});
}



function setScreenOriention(data)
{
  if(typeof data == 'string') {
    data = eval('('+data+')');
  }
  direction = data['direction'];
  if(api) {
    api.setScreenOrientation({
     orientation: direction
    });  
  }
}

window.onGetSettingDataFromObj = function(data) {
  if(typeof data == 'string')
    data = eval('('+data+')');
  $api.setStorage('settings', data);
}


function fixIos7Bar(){
  var strDM = api.systemType;
  if (strDM == 'ios') {
    var strSV = api.systemVersion;
    var numSV = parseInt(strSV,10);   
    var fullScreen = api.fullScreen;
    var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
    if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
      return true;
    }
    return false;
  }
  return false;
}

//napster3
window.setChatKeyboardHeight = function(keyBoardH, videoH){
  

}



//全屏退出和打开
window.noticeFullScreen = function(flag) {
  if(flag) { //进入全屏
    api.setFrameAttr({
      'name': 'profile',
      'hidden': true
    });
    api.setFrameAttr({
      'name': 'chat',
      'hidden': true
    });
    api.setFrameAttr({
      'name': 'video',
      'hidden': true
    });
    api.setFrameAttr({
      'name': 'rank',
      'hidden': true
    });
  }else{  //退出全屏
    api.setFrameAttr({
      'name': oldMenu,
      'hidden': false
    });
  }
}


//实时改变主播简介中的观众数
window.changeOnline = function(data) {
  api.execScript({
    frameName : 'profile',
    script: 'changeOnline('+data+');'
  });
}

//获取订阅结果
window.followResultBack = function(data) {
  followState = data;
  api.execScript({
    frameName : 'profile',
    script: 'setFollowState('+data+');'
  });
}





// rapters1983@hotmail.com

// poacher1983