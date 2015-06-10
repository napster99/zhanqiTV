 /* =============================================
 * 20150128.1
 * =============================================
 * Copyright Napster
 *
 * 每日签到
 * ============================================= */
apiready = function() {

  
  var ui = {
    
  }

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);
  
  var oPage = {
    init: function() {
      this.view();
      this.listen();
    },
    view: function() {
      api.openFrame({
        name: 'sign-in-frame',
        url: '../html/sign-in-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: true,
        pageParam: api.pageParam,
        rect: {
          x: 0,
          y: $('.top-bar').offset().height,
          w: 'auto',
          h: 'auto'
        }
      });
    },
    listen: function()　{
      
    }
  }
  oPage.init();
}