/* =============================================
 * v20141127
 * =============================================
 * Copyright Napster
 *
 * 抽奖活动
 * ============================================= */

apiready = function() {

  var cWidth, cHeight, chance = 0, changeAgain = false;

  var ui = {
    $shareList : $('#shareList')
  }

  var sinaWeiBo = api.require('sinaWeiBo');
  var qqObj = api.require('qq');
  var weiXin = api.require('weiXin');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
      this.getResult();
    },

    listen : function() {
      var self = this;

      //再来一张
      $('#lotteryAgain').on('click', function() {

        if(chance < 1 ) {
          api.alert({'msg' : '抽奖机会用完了'});
          return;
        }
        if(!changeAgain) {
          return;
        }
        self.getResult();
      });

      //弹出关闭
      $(document).on('click', '.pop-btn', function() {
        $('#mask, #popWin').addClass('hidden');
      });

      //分享
      $('#share').on('click', function() {
        $('#mask, #shareCon').removeClass('hidden');
      });

      //关闭分享
      $('.close-btn').on('click', function() {
        $('#mask, #shareCon').addClass('hidden');
      });

      //返回
      $('#back').on('click', function() {
        $api.setStorage('chance',chance);
        api.execScript({
          name: 'root',
          frameName: 'main',
          script: 'reflashLottery();'
        });
        api.closeWin();
      });

      //
      ui.$shareList.on('click', 'li', function() {
        var name = $(this).attr('name');
        self.shareIt(name);
      });
      
    },

    view : function()　{
      if(api.systemType === 'ios') {
        $('.top-bar').addClass('ios-top');
      }
      chance = api.pageParam['count'];
      cWidth = $('.scratch-bg').width() - $('canvas')[0].offsetLeft*2;
      cHeight = $('.scratch-bg').height() - $('canvas')[0].offsetTop*2;
      $('canvas').width(cWidth).height(cHeight);

      weiXin.registerApp(
        function(ret,err){
          if (!ret.status) {
            api.alert({msg:err.msg});
          }
        }
      );


    },

    getResult : function() {
      var self = this;
      api.ajax({
        url: 'http://www.zhanqi.tv/api/actives/lottery/lottery.4',
        method: 'get',
        headers: {
          'User-Agent': 'Zhanqi.tv Api Client'
        },
        dataType: 'json'
      }, function(data, err){
        // iphone6、签名照、金币、战旗币
        changeAgain = false;
        $('.result-btn').removeClass('active');
        var src = '../image/activity/ggl-bg-0.png', type = 0;
        if(data['data']['name'].indexOf('iphone6') > -1) {
          src = '../image/activity/ggl-bg-1.png';
          type = 1;
        }else if(data['data']['name'].indexOf('签名照') > -1) {
          src = '../image/activity/ggl-bg-2.png';
          type = 2;
        }else if(data['data']['name'].indexOf('金币') > -1) {
          src = '../image/activity/ggl-bg-3.png';
          type = 3;
        }else if(data['data']['name'].indexOf('战旗币') > -1) {
          src = '../image/activity/ggl-bg-4.png';
          type = 4;
        }
        self.initCanvas(src, type, data['data']['unit']);
        chance--;
        self.renderBtnText();
      
      });
    },

    renderBtnText : function() {
      if(chance < 1) {
        $('#lotteryAgain').html('<span id="surplus" class="count">机会用完了</span>').removeClass('active');
      }else{
        $('#surplus').text('×'+chance);
      }
    },

    showResult : function(type, unit) {
      $('#mask').removeClass('hidden');
      var htmlStr = '';
      $('#popWin').removeClass('pop1').removeClass('pop2').removeClass('pop3').removeClass('pop4');
      switch(type) {
        case 1:  //iphone6  iPhone6送给你，别客气，快拿去炫耀吧。
          htmlStr = '<p>iPhone6送给你，</br>别客气，快拿去炫耀吧。</p><a href="javascript:;" class="pop-btn">关闭</a>';
          $('#popWin').addClass('pop1');
          break;
        case 2:  //签名照   大神签名照送给你，别客气，拿去天天贴床头哦
          htmlStr = '<p>大神签名照送给你，</br>别客气，拿去天天贴床头哦</p><a href="javascript:;" class="pop-btn">关闭</a>'
          $('#popWin').addClass('pop2');
          break;
        case 3:  // 金币
          htmlStr = '<p><span>金币'+unit+'</span>枚送给你，</br>不客气，请叫我雷锋</p><a href="javascript:;" class="pop-btn">关闭</a>'
          $('#popWin').addClass('pop3');
          break;
        case 4:  //战旗币
          htmlStr = '<p><span>战旗币'+unit+'</span>枚送给你，</br>不客气，请叫我雷锋</p><a href="javascript:;" class="pop-btn">关闭</a>'
          $('#popWin').addClass('pop4');
          break;
      }
      $('#popWin').html(htmlStr).removeClass('hidden');
    },

    initCanvas : function(src, type, unit) {
      var self = this;
      $('canvas').guagua({
        'backUrl':src,
        'frontUrl':'../image/activity/ggl-bg-in.png',
        'cWidth' : cWidth,
        'cHeight':cHeight,
        'callback' : function() {
          if(!changeAgain) {
            self.showResult(type, unit);
          }
          changeAgain = true;
          $('.result-btn').addClass('active');
        }
      });
    },

    shareIt : function(name) {
      var imgUrl = '';
      switch(name) {
        case 'qq':
          var isQQAuth = $api.getStorage('qq');
          if(isQQAuth == 'not' || !isQQAuth) {
            qqObj.login(function(ret,err){
                $api.setStorage('qq', 'ok');
                qqObj.shareNews({
                     url:'http://m.zhanqi.tv/lottery/'
                    ,title:'参与#战旗TV#移动端刮刮卡活动，iPhone6，'
                    ,description:'明星签名照等众多大奖等您拿。还不快来参加'
                    ,imgUrl:imgUrl
                }, function(ret, err) {
                  if(ret.status) {
                    api.alert({'msg' : '分享成功'});
                  }else{
                    api.alert({'msg' : err.msg});
                  }
                });
            });
            return;
          }
          
          qqObj.shareNews({
               url:'http://m.zhanqi.tv/lottery/'
              ,title:'参与#战旗TV#移动端刮刮卡活动，iPhone6，'
              ,description:'明星签名照等众多大奖等您拿。还不快来参加'
              ,imgUrl:imgUrl
          }, function(ret, err) {
            if(ret.status) {
              api.alert({'msg' : '分享成功'});
            }else{
              api.alert({'msg' : err.msg});
            }
          });
          break;
        case 'sina':
          var isWeiBoAuth = $api.getStorage('weibo');
          if(isWeiBoAuth == 'not' || !isWeiBoAuth) {
             sinaWeiBo.auth({
                redirectUrl: 'http://www.zhanqi.tv'
            },function(ret,err){
              if (ret.status) {
                $api.setStorage('weibo', 'ok');
                sinaWeiBo.sendRequest({
                    contentType: 'text',
                    text: '参与#战旗TV#移动端刮刮卡活动，iPhone6，明星签名照等众多大奖等您拿。还不快来参加',
                    imageUrl: imgUrl,
                    media : {
                      webpageUrl : 'http://m.zhanqi.tv/lottery/'
                    }
                },function(ret,err){});
              }else{
                api.alert({msg:'授权失败'+err.msg});
                $api.setStorage('weibo', 'not');
              }
            });
            return;
          }
          sinaWeiBo.sendRequest({
              contentType: 'text',
              text: '参与#战旗TV#移动端刮刮卡活动，iPhone6，明星签名照等众多大奖等您拿。还不快来参加',
              imageUrl: imgUrl,
              media : {
                webpageUrl : 'http://m.zhanqi.tv/lottery/'
              }
          },function(ret,err){});
          break;
        case 'weixin':
          weiXin.sendRequest({
              scene:'timeline',
              contentType:'web_page',
              title:'参与#战旗TV#移动端刮刮卡活动，iPhone6，',
              description:'明星签名照等众多大奖等您拿。还不快来参加',
              thumbUrl:imgUrl,
              contentUrl: 'http://m.zhanqi.tv/lottery/'
          },function(ret,err){
            if(ret.status){
                api.alert({title: '发表微信',msg: '发表成功', buttons: ['确定']});
            } else{
                api.alert({title: '发表失败',msg: err.msg,buttons: ['确定']});
            };
          });
          break;
      }
    }


  }



  oPage.init();
}
