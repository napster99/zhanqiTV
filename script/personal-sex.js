 /* =============================================
 * 20150128 1
 * =============================================
 * Copyright Napster
 *
 * 修改性别
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
        name: 'editSex-frame',
        url: '../html/editSex-frame.html',
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
        api.closeWin({
          animation: {
            type: 'reveal',
            subType: 'from_top',
            duration: 300
          }
        });
      });
      
    }
  }
  oPage.init();
}
