 /* =============================================
 * v20150127.1
 * =============================================
 * Copyright Napster
 *
 * 登录
 * ============================================= */
apiready = function(){

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

  // 页面消失时触发
  api.addEventListener({name:'viewdisappear'}, function(ret, err){
    fInitInfo();
  });

  function fInitInfo() {
    $('input').val('');
  }
  var ui = {
      $btn_close: $('#btn-close')
    , $btn_reg: $('#btn-reg')
  };


  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {      
      this.view();
      this.listen();
    },
    view : function() {

      api.openFrame({
        name: 'landing-frame',
        url: '../html/landing-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: true,
        // pageParam: pageParam,
        rect: {
          x: 0,
          y: $('.top-bar').offset().height,
          w: 'auto',
          h: 'auto'
        }
      });

    },
    listen : function()　{
      var self = this;
     
      // 关闭
      ui.$btn_close.on('click', function() {

        if(api.pageParam['isRoom']) {
          zhanqi.onBackToLiveScene({});
        }

        api.closeWin({
          name:'register',
          animation: {
            type: 'none',
            subType: 'from_top',
            duration: 0
          }
        });
        api.closeWin({
          name:'landing',
          animation: {
            type: 'reveal',
            subType: 'from_top',
            duration: 300
          }
        });
      });

      // 注册
      ui.$btn_reg.on('click', function() {
        api.openWin({
          name:'register', 
          url:'../html/register.html', 
          delay:100,
          animation: {
            type: 'none',
            subType: 'from_right',
            duration: 300
          }
        });
      });

    }
  }
  oPage.init();
}


  
