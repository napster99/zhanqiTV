/* =============================================
 * 20150129
 * =============================================
 * Copyright Napster
 *
 * 充值页面--ios
 * ============================================= */
apiready = function(){

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);
  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      api.openFrame({
        name: 'recharge-ios-frame',
        url: '../html/recharge-ios-frame.html',
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
      $('#back').on('click',   function() {
        try{
          zhanqi.onCloseRecharge({});
        }catch(e) {}
        api.closeWin();
      })
     }
  }
  oPage.init();

}

  
