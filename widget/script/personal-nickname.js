/* =============================================
 * 20150127 1
 * =============================================
 * Copyright Napster
 *
 * 修改昵称
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
        name: 'editNickname-frame',
        url: '../html/editNickname-frame.html',
        bounces: false,
        opaque: true,
        pageParam : {'isRoom' : api.pageParam['isRoom']},
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

        if(api.pageParam['isRoom']) {
          try{
            var zhanqi = api.require('zhanqiMD');
            zhanqi.onBackToLiveScene({});
            zhanqi.onFinishEditNickname({'isSubmit' : 0});
          }catch(e) {}
        }


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



  
