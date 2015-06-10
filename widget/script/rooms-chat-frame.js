/* =============================================
 * v20150312.1
 * =============================================
 * Copyright Napster
 *
 * 直播间代码frame 聊天
 * ============================================= */

var selfGid = '', fansTitle = '', msgCount = 0, isBubbleMode = false;

apiready = function(){
  var ui = {
    $chatList : $('#chatList'),
    $liveRoom : $('#liveRoom')
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

  var curWhich = '';
  var oPage = {
    init : function() {
      this.view();
      this.listen();
      this.showInputView();
    },
    
    showInputView : function() {
      try{
        if(api.systemType === 'ios') {
          zhanqi.showInputView({});
        }else{
          zhanqi.showEmView({});
        }

      }catch(e){}
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
  

    },


    listen : function()　{
      var self = this, startY = 0, endY = 0;


      //点击聊天区域隐藏分享
      $('#liveRoom').on('click',  function() {
        api.closeFrame({
          name: 'share'
        });
        api.setFrameAttr({
          name: 'gift',
          hidden: true
        });
        zhanqi.closeGiftFrame({});
      });

      //监听滚动
      var liveRoom = $('#liveRoom')[0];
      // liveRoom.addEventListener('touchstart',touchStart,false);
      // liveRoom.addEventListener('touchmove',touchMove,false);
      // liveRoom.addEventListener('touchend',touchEnd,false);


      function touchStart(event) {
        startY = event.touches[0].pageY;
      }

      function touchMove(event) {
        var touch = event.touches[0];
        endY = touch.pageY;
      }

      function touchEnd() {
        if((endY - startY   > 0) && !isBubbleMode && ui.$liveRoom[0].scrollTop > 0) {   //  往上滑，开始计数
          isBubbleMode = true;
          msgCount = 0;
        }
      }

      //滚动事件
      $('#liveRoom').on('scroll', function(){
        var clH = ui.$chatList[0].scrollHeight;
        var scrollTop = ui.$liveRoom[0].scrollTop;
        var clientH = ui.$liveRoom[0].clientHeight;
        if((scrollTop + clientH) >= clH - 20) {  //20px 为welcome高度
          $('#bubbleTip').addClass('hidden');
          isBubbleMode = false;
          msgCount = 0;
        }else if(!isBubbleMode && ui.$liveRoom[0].scrollTop > 0){
          isBubbleMode = true;
          msgCount = 0;
        }

      });


      //点击气泡
      $('#bubbleTip').on('click',  function() {
        ui.$liveRoom.scrollTop( ui.$chatList[0].scrollHeight );
        $('#bubbleTip').addClass('hidden');
        isBubbleMode = false;
        msgCount = 0;
      });
      
    },

    putChatToDom: function(message) {
      var content = message['content'] || message['c'];
      if (content && typeof content.replace === 'function') {
        content = content.replace(/\[\W+?\]/g, function(v) {
          var key = v.replace(/\[|\]/g, '')
          if (aFaceList[key]) {
            return '<img class="qq-face" src="../image/qq-face/' + aFaceList[key] + '.gif">'
          } else {
            return v;
          }
        })
      }

      var htmlStr = '';
      if(message['showmedal'] == 1) {  //显示勋章
        if(selfGid == message['gid']) {//是否自己
          htmlStr += '<li class="myself">';
          if(message['level']) {
            htmlStr += '<span class="name"><i class="name-bg grade-'+ message['level'] +'">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'+content +'</li>'
          }else{
            htmlStr += '<span class="name">'+ message['fromname'] +'：</span>'+content +'</li>'
          }
        }else{
          switch(message['permission']) {
            case 40:  //超管
              if(message['level']) {
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">超管</i><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }else{
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">超管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }
              
              break;
            case 30: //主播
              if(message['level']) {
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg anchor">主播</i><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }else{
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg anchor">主播</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }
              
              break;
            case 20:  //正式  房管
              if(message['level']) {
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }else{
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }
              break;
            case 10:  //临时  房管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 1:  //用户
              if(message['level']) {
                htmlStr += '<li>'
                  +'<span class="name"><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                  + content +'</li>'
              }else{
                htmlStr += '<li>'
                  +'<span class="name">'+ message['fromname'] +'：</span>'
                  + content +'</li>'
              }
              break;
            case 0:  //游客
              htmlStr += '<li>'
                      +'<span class="name">'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
          }
        }
      }else{
        if(selfGid == message['gid']) {   //是否自己
          htmlStr += '<li class="myself">'
          +'<span class="name">'+ message['fromname'] +'：</span>' + content + '</li>'
          
        }else{
          switch(message['permission']) {
            case 40:  //超管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">超管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 30: //主播
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg anchor">主播</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 20:  //正式  房管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 10:  //临时  房管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 1:  //用户
              htmlStr += '<li>'
                      +'<span class="name">'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 0:  //游客
              htmlStr += '<li>'
                      +'<span class="name">'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
          }
          
        }
      }
      //大于200条清空聊天
      if(ui.$chatList.find('ul li').length > 200 ) {
        for(var i=0;i<100;i++) {
          ui.$chatList.find('ul').find('li').eq(i).remove();
        }
      }
      ui.$chatList.find('ul').append(htmlStr);
      if(!isBubbleMode) {
        ui.$liveRoom.scrollTop( ui.$chatList[0].scrollHeight );
      }
    },


//   {
//     "cmdid":"Gift.Use"
//     "data":
//     {"show":"1","id":"3","tid":"1","nickname":"Piscesleo11111111","icon":"http://beta.zhanqi.tv/beta_upload/uploads/2014/09/gifticon-2014091517412167264.png","name":"顶","gid":1725666104,"anchorname":"小天使的蓝朋友","rank":"advance","count":10,"classifier":"双","object":3245,"roomid":176,"desc":"我顶你个肺。","nextexp":0,"leftexp":0,"image":"http://beta.zhanqi.tv/beta_upload/uploads/2014/09/giftspic-2014091517244102789.gif","level":15,"parser":"common","status":"1","curexp":"42329","pid":3,"action":"一","gameId":"0","uid":39,"permission":10,"brotype":0|1|2(发给自己|全站|房间广播),"dlt":0|15|30|60|90,"type":1|2
//     },
//   }
// 新加type字段，1表示用户送礼促发，2表示用户弹幕促发，默认值为1
// XXX通过发送弹幕给XXX赠送1个麻辣烫。


    putGiftDom : function(data) {
      var htmlStr = '';
      if(typeof data == 'string') {
        data = eval('('+data+')');
      }
      data = data['data'];

      if(data['show'] == 1) {
        htmlStr += '<li>'
              +  '  <span class="name">'
          if(data['level'] != 0) {
            htmlStr +=  '<i class="name-bg grade-'+data['level']+'">'+fansTitle+'</i>'
          }

          if(data['action']) {
             htmlStr +=  data['nickname']+ '</span>给主播' + data['action'] + data['count']+data['classifier'] + '<img src="'+data['icon']+'" alt="" class="gift-icon"></li>'
          }else{
             htmlStr +=  data['nickname']+ '</span>送给主播<img src="'+data['icon']+'" alt="" class="gift-icon"><i class="count">' + data['count'] +'</i></li>'
          }

      }else{
        htmlStr += '<li><span class="name">'+ data['nickname']

           if(data['action']) {
             htmlStr += '</span>给主播' + data['action'] + data['count']+data['classifier'] + '<img src="'+data['icon']+'" alt="" class="gift-icon"></li>'
          }else{
             htmlStr += '</span>送给主播<img src="'+data['icon']+'" alt="" class="gift-icon"><i class="count">' + data['count'] +'</i></li>'
          }

      }

      ui.$chatList.find('ul').append(htmlStr);
      if(selfGid == data['gid']) {  //自己送的
        $(htmlStr).addClass('myself');
      }
      if(!isBubbleMode) {
        ui.$liveRoom.scrollTop( ui.$chatList[0].scrollHeight );
      }
    },

    putWelcomeDom : function(data) {
      data = data && data['data'];
      var htmlStr = '<li style="color:#999;">欢迎<span class="name" style="color:red;"><i class="name-bg grade-'+ data['fanslevel'] +'">' + fansTitle + '</i>'+ data['fansname'] +'</span>进入直播间</li>'
      ui.$chatList.find('ul').append(htmlStr);
      if(!isBubbleMode) {
        ui.$liveRoom.scrollTop( ui.$chatList[0].scrollHeight );
      }
    },

    //聊天金币随机赠送
    goldSend : function(data) {

      $('.mask, .gold-pop').removeClass('hidden');
      $('#sendGoldCount').text(data['count']);
      if(data['cointype'] == 1) {
        $('#sendSpecies').text('战旗币');
      }else{
        $('#sendSpecies').text('金币');
      }

      setTimeout(function() {
        $('.mask, .gold-pop').addClass('hidden');
      },3000);
    },

    //圣诞活动
    chritFn : function(data) {
      $('#christmas').removeClass('hidden').attr('santaid',data['santaid']).attr('gold',data['gold']);
    }


  }

  oPage.init();


  window.showGiftPic = function(imgUrl) {
    var giftPop = $('#giftPop');
    giftPop.html('<img src="'+imgUrl+'" style="height:50px;"/>  ');
    var img = new Image();  
    img.src=imgUrl;  
    img.onload=function(){
      giftPop.removeClass('hidden');
      setTimeout(function() {
        giftPop.find('img').hide('fadeOut', function() {
          $(this).remove();
          giftPop.addClass('hidden');
        });
      },2000);
    };
  }

  window.setVariable = function(data) {
    if(data['gid']) {
      selfGid = data['gid'];
    }
    if(data['fans']) {
      fansTitle = data['fans']['fansTitle'];
      $('#welcome').html('欢迎来到<i>'+data['fans']['nickname']+'</i>的直播间，喜欢就点击右上角订阅吧。')
    }
    
    window.onRecvChatMsg = function(data) {
      if(typeof data === 'string') {
        data = eval('('+data+')');
      }
      
      if(!fansTitle) return;

      if(data['cmdid'] === 'Gift.Use') {
        try{
          oPage.putGiftDom(data);  //礼物
        }catch(e) {}
        msgCount++;
      }else if(data['cmdid'] === 'chatmessage'){
        oPage.putChatToDom(data);
        msgCount++;
      }else if(data['cmdid'] === 'notefanslevel') {
        oPage.putWelcomeDom(data);
        msgCount++;
      }else if(data['cmdid'] === 'givegift') {  //聊天金币随机赠送
        oPage.goldSend(data);
      }else if(data['cmdid'] === 'active_come_santa') {  //圣诞节活动
        oPage.chritFn(data);
      }
      if(isBubbleMode) {
        if(msgCount === 100) {
          msgCount = 99;
        }
        $('#bubbleTip').removeClass('hidden');
        $('#bubbleTip').find('.bubble-tip').text(msgCount);
      }
    }
    
  }

  //清空聊天
  window.clearChatMsg = function() {
    $('#chatList').find('ul').html('');
  }

  window.onBtnBack = function() {
    $('#christmas').addClass('hidden');
  }


}



// var n = {'cmdid':'Gift.Use','data':{'action':'','anchorname':'杰杰杰杰杰斯','brotype':2,'classifier':'','count':1,'curexp':'0','desc':'I am baymax！','gameId':'0','gid':1639260948,'icon':'http://dlpic.cdn.zhanqi.tv/uploads/2015/03/gifticon-2015031214570030082.png…dlpic.cdn.zhanqi.tv/uploads/2015/03/giftmimg2015031215063272358.png','name':'大白','nextexp':'10','nickname':'亟刚刚eexxx','note':'{''end'':''''}','object':21385465,'parser':'common','permission':1,'pid':3,'rank':'primary','roomid':19712,'show':'1','status':'1','tid':'1','uid':'5042','url':'/jess'}}




// {'action':'','anchorname':'杰杰杰杰杰斯','brotype':2,'classifier':'','count':1,'curexp':'0','desc':'这个锅你背了！','gameId':'0','gid':1639260948,'icon':'http://dlpic.cdn.zhanqi.tv/uploads/2014/09/gifticon-2014091708063214948.png…dlpic.cdn.zhanqi.tv/uploads/2015/02/giftmimg2015021510212480217.png','name':'锅','nextexp':'10','nickname':'亟刚刚eexxx','note':'','object':21385465,'parser':'common','permission':1,'pid':4,'rank':'primary','roomid':19712,'show':'1','status':'1','tid':'2','uid':'5042','url':'/jess'}}