/* =============================================
 * 20150130
 * =============================================
 * Copyright Napster
 *
 * 充值方式--android
 * ============================================= */
apiready = function(){

  var ui = {};

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);
  
  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      api.openFrame({
        name: 'recharge-android-frame',
        url: '../html/recharge-android-frame.html',
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
    listen : function()　{
      
    }
  }
  oPage.init();
}
