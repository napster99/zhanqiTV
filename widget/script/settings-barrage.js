/* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 弹幕设置
 * ============================================= */

  apiready = function() {
    var header = $api.dom('.top-bar');
    $api.fixIos7Bar(header);

    var oPage = {

      init : function() {
        this.view();
        this.listen();
      },

      view : function() {
        api.openFrame({
          name: 'settings-barrage-frame',
          url: '../html/settings-barrage-frame.html',
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
        //返回
        $('#back').on('click',  function() {
          api.sendEvent({
            name: 'barrage'
          });
        });
        
        api.addEventListener({
          name: 'keyback'
        }, function(ret, err){
          $('#back').trigger('click');
        });
      }
    }

    oPage.init();

}
