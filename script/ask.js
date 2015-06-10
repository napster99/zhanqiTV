/* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 每日一问
 * ============================================= */
apiready = function() {

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

  var ui = {
  }

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    },
    view: function() {
      api.openFrame({
        name: 'ask-frame',
        url: '../html/ask-frame.html',
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