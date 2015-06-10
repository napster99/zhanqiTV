/* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 编辑订阅
 * ============================================= */

apiready = function() {
  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , view: function() {
      api.openFrame({
        name: 'editSubscribe-frame',
        url: '../html/editSubscribe-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: true,
        rect: {
          x: 0,
          y: $('.top-bar').offset().height,
          w: 'auto',
          h: 'auto'
        }
      });
    }
    
  , listen: function() {
      
    }

  };
  oPage.init();
}
