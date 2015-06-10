/* =============================================
 * 20150128 1
 * =============================================
 * Copyright Napster
 *
 * 修改手机
 * ============================================= */
apiready = function(){

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);


  var ui = {
    $btn_close: $('#btn-close')
  };

  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    }
  , view : function() {
      api.openFrame({
        name: 'editPhone-frame',
        url: '../html/editPhone-frame.html',
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

      // 关闭
      ui.$btn_close.on('click', function() {
        
        try{
          zhanqi.onBackToLiveScene({});
        }catch(e) {}
        
        api.closeWin({
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