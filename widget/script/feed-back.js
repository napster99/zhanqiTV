 /* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 问题反馈
 * ============================================= */
apiready = function(){
  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);
  
  var ui = {
    $btn_close: $('#btn-close')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      api.openFrame({
        name: 'settings-feed-back-frame',
        url: '../html/settings-feed-back-frame.html',
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
      // 关闭
      ui.$btn_close.on('click', function() {
        api.closeWin();
      });
    }
  }
  oPage.init();
}


  
