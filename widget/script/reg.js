 /* =============================================
 * v20150128.1
 * =============================================
 * Copyright Napster
 *
 * 注册
 * ============================================= */
apiready = function(){
  // 页面消失时触发
  api.addEventListener({name:'viewdisappear'}, function(ret, err){
    initInfo();
  });

  function initInfo() {
    $('input').val('');
  }

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);
  
  var zhanqi = api.require('zhanqiMD');

  var ui = {
    $box_reg: $('#box-reg')
  , $btn_reg: $('#btn-reg')
  , $password_input: $('#password-input')
  , $password_input_confirm: $('#password-input-confirm')
  , $valid: $('[data-type]')
  , $btn_login: $('#btn-login')
  , $btn_agree: $('#btn-agree')
  , $btn_agreement: $('#btn-agreement')
  , $btn_privacy: $('#btn-privacy')
  , $btn_close: $('#btn-close')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    }
  , view : function() {
      api.openFrame({
        name: 'register-frame',
        url: '../html/register-frame.html',
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
    }
  , listen : function()　{
      var self = this;

      // 登陆
      ui.$btn_login.on('click', function() {
        api.openWin({
          name:'landing', 
          url:'../html/landing.html', 
          delay:100,
          animation: {
            type: 'none',
            subType: 'from_right',
            duration: 300
          }
        });
      });

      // 关闭
      ui.$btn_close.on('click', function() {
        if(api.pageParam['isRoom']) {
          try{
            zhanqi.onBackToLiveScene({});
          }catch(e) {}
        }
        api.closeWin({
          name:'landing',
          animation: {
            type: 'none',
            subType: 'from_top',
            duration: 300
          }
        });
        api.closeWin({
          name:'register',
          animation: {
            type: 'reveal',
            subType: 'from_top',
            duration: 300
          }
        });
      });

    }
   
  };
  oPage.init();
};