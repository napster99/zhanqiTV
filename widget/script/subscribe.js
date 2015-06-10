/* =============================================
 * v20150128
 * =============================================
 * Copyright Napster
 *
 * 我的订阅
 * ============================================= */

apiready = function() {
  var ui = {
    
  }

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);


  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      api.openFrame({
        name: 'subscribe-frame',
        url: '../html/subscribe-frame.html',
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
    },

    listen : function() {
      
    }
  }

  oPage.init();

}