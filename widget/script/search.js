/* =============================================
 * 20150129.2
 * =============================================
 * Copyright Napster
 *
 * 搜索
 * ============================================= */

apiready = function() {

  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

  var ui = {
      $keyword: $('#keyword')
    , $tab: $('#tab')
  };

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , view: function() {
      api.openFrame({
        name: 'search-frame',
        url: '../html/search-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: true,
        rect: {
          x: 0,
          y: $('.top-bar').offset().height ,
          w: 'auto',
          h: 'auto'
        }
      });
    }
  , listen: function() {
      var self = this;
      //搜索
      ui.$keyword.on('input', function(){
        var keyword = $(this).val();
        if(keyword.length == '') {
          api.execScript({
            frameName : 'search-frame',
            script: 'keyupEvent("'+keyword+'","true");'
          });
        }else{
          api.execScript({
            frameName : 'search-frame',
            script: 'keyupEvent("'+keyword+'");'
          });
        }
      });
      // .on('keyup', function(event){
      //   var keyword = $(this).val();
      //   if(keyword.length == '') {
      //     api.execScript({
      //       frameName : 'search-frame',
      //       script: 'keyupEvent("'+keyword+'","true");'
      //     });
      //   }else if(event.keyCode === 13) {
      //     api.execScript({
      //       frameName : 'search-frame',
      //       script: 'keyupEvent("'+keyword+'");'
      //     });
      //   }
      // });

      //页签切换
      ui.$tab.on('click', 'li',function(){
        var $self = $(this);
        ui.$tab.find('li').removeClass('active');
        $self.addClass('active');
        var idx = $self.index();

        api.execScript({
          frameName : 'search-frame',
          script: 'domCtroller("'+idx+'");'
        });

      });

    }

  , blurKeyword : function(key) {
      ui.$keyword.blur();
      if(key) {
        ui.$keyword.val(key);
      }
    }

  };
  oPage.init();

  window.blurKeyword = oPage.blurKeyword;

};