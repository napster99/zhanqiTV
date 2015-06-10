/* =============================================
 * v20141019.2
 * =============================================
 * Copyright Napster
 *
 * 送礼代码
 * ============================================= */
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

  var giftConfig = {}, giftCount = 1, giftId = '';  //礼物配置
  var coin = 0, gold = 0, coinEnable = 1, goldEnable = 1;  //财富是否可用 1 keyong  0 bukeyong
  var zhanqi = api.require('zhanqiMD');


  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      this.getGiftList(api.pageParam['roomid']);
    },

    listen : function()　{
      var self = this;
      //选择礼物
      $('#giftList').on('click',  'li', function() {
          if(giftConfig[this.id]) {
            $('#giftName').text(giftConfig[this.id]['name'])
            $('#giftCount').text(giftConfig[this.id]['price'])
            $('#giftList').find('li.active').removeClass('active');
            $(this).addClass('active');
            if(giftConfig[this.id]['coinType'] ==1) {
              $('#coinType').text('战旗币');
            }else{
              $('#coinType').text('金币');
            }
            giftId = this.id;
          }
          return false;
      });

      //赠送按钮
      $('#sendGift').on('click',  function() {
        var mobileimg = giftConfig[giftId]['mobileimg'];
        var icon = giftConfig[giftId]['icon'];
        
        yp.ajax({
            url: URLConfig('getRich'),
            method: 'get',
            dataType: 'json'
        },function(ret,err){
          if(ret['code'] == 0) {
            coin = ret['data']['coin']['count'];
            coinEnable = ret['data']['coin']['enable'];
            gold = ret['data']['gold']['count'];
            goldEnable = ret['data']['gold']['enable'];

            giftCount = $('#inputCount').val();
            if(giftConfig[giftId]['coinType'] == 1) { //战旗币
              if(giftCount*giftConfig[giftId]['price'] > coin) {
                api.alert({
                  title: '提示',
                  msg: '战旗币不足！',
                  buttons:[ '确定']
                });
                return;
              }
            }else{ //金币
              if(giftCount*giftConfig[giftId]['price'] > gold) {
                api.alert({
                  title: '提示',
                  msg: '金币不足！',
                  buttons:[ '确定']
                });
                return;
              }
            }

            var sendGiftParam = {
               count : giftCount
              ,gift : giftId
              ,mobileimg : mobileimg
              ,icon : icon
            }

            $api.setStorage('sendGiftParam',sendGiftParam);
            
            api.execScript({
             name : 'rooms',
             script : 'sendGiftBack();'
            })
            // api.closeFrame();
            

            api.execScript({
             name : 'rooms',
             script : 'changeGiftStatus();'
            });


            //通知礼物显示在聊天区域的动画效果
            api.execScript({
             name : 'rooms',
             frameName : 'rooms-frame',
             script : 'showGiftPic("'+mobileimg+'");'
            });
            

            api.setFrameAttr({
              name: 'gift',
              hidden: true
            });
          }
        });
      });
      

      //金币充值
      $('#recharge').on('click', function() {
        var name = '';
        var url = '';
        if((api.systemType.toLowerCase()).indexOf('ios') > -1) {
          // 打开ios充值页面
          name = "recharge-ios";
          url = 'recharge-ios.html';
        } else{
          // 打开安卓充值页面
          name = "recharge-android";
          url = 'recharge-android.html';
        }
        
        try{
          api.setFrameAttr({
            name: 'gift',
            hidden: true
          });
          zhanqi.onStartRecharge({});
        }catch(e) {}

        api.openWin({name: name,url: url,delay:0,bgColor:'#FFF'});
      });
    },

    getGiftList : function(id) {
      var self = this;
      yp.ajax({
          url: URLConfig('getGiftList',{'roomid':id}),
          method: 'get',
          dataType: 'json'
      },function(ret,err){
        self.renderGiftList(ret['data']);
      });
    },

    renderGiftList : function(data) {
      var htmlStr = '';
      
      for(var i=0; i<data.length; i++) {
        if(data[i]['tid'] == 7) continue;
        htmlStr += '<li name="gift" id="'+data[i]['id']+'">'
        +'<div class="gift-border"><img src="'+data[i]['mobileimg']+'" class="gift-icon"></div>'
        +'<p>'+data[i]['name']+'</p>'
        +'</li>'
        giftConfig[data[i]['id']] = data[i];
      }
      ui.$giftList.html(htmlStr);
      
      var lastLi = $('#giftList').find('li').last();
      var lId = lastLi.attr('id');
      lastLi.addClass('active');
      if(giftConfig[lId]) {
        $('#giftName').text(giftConfig[lId]['name'])
        $('#giftCount').text(giftConfig[lId]['price'])

        switch(giftConfig[lId]['coinType']) {
          case 1:
            $('#coinType').text('战旗币');
            break;
          case 2:
            $('#coinType').text('金币');
            break;
        }
      }
      giftId = lId;

    },

    blurKeyBord : function() {
      $('#inputCount').blur();
    }

    
  }



  oPage.init();
  window.blurKeyBord = oPage.blurKeyBord;
}

