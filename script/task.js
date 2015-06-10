/* =============================================
 * v20150128
 * =============================================
 * Copyright Napster
 *
 * 每日任务
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
        name: 'task-frame',
        url: '../html/task-frame.html',
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
      api.addEventListener({name:'viewappear'}, function(ret, err){
        api.execScript({
          frameName: 'task-frame',
          script: 'fInitInfo();'
        });
      });
    }
  }

  oPage.init();

}
