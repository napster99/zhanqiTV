/* =============================================
 * 20150130
 * =============================================
 * Copyright Napster
 *
 * 充值页面--成功
 * ============================================= */
apiready = function(){


  var ui = {
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      api.openFrame({
        name: 'recharge-ok-frame',
        url: '../html/recharge-ok-frame.html',
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
      var self = this;
    }
  }
  oPage.init();

}
