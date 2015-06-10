 /* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 解码方式
 * ============================================= */ 

apiready = function() {

    var settings = $api.getStorage('settings') || {
        barrage : 1 //弹幕开关
       ,opacity : 1 //弹幕透明度
       ,size : 1 //弹幕大小
       ,pos : 0 //弹幕位置
       ,definition : 1 //清晰度选择
       ,lookBack : false //回看功能
       ,model : 0 //模式选择
       ,wifi : 0 //wifi提醒
       ,decode : 0 //0  软解    1  硬解
       ,push : true //false  关    true  开
       ,cacheSize : 0
    };

    var oPage = {

      init : function() {
        this.view();
        this.listen();
      },

      view : function() {
        this.setData(settings);
      },

      listen : function() {
        api.addEventListener({
            name: 'decode'
        }, function(ret){
          $api.setStorage('settings', settings);
          // var decode = settings && settings['decode'] || 0;
          // api.execScript({
          //   name: 'settings',
          //   frameName : 'settings-frame',
          //   script: 'decodes('+decode+');'
          // });
          api.closeWin();
        });

        //解码方式
        $('#decode').on('click',  'li', function() {
          var name = $(this).attr('name');
          if($('#decode').find('.active')[0])
          $('#decode').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#decode').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
          $(this).find('i').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
          switch(name) {
            case 'ruan':
              settings['decode'] = 0;
              break;
            case 'ying':
              settings['decode'] = 1;
              break;
          }
          $api.setStorage('settings', settings);
        });

      },

      setData : function(settings) {

        //清晰度选择
        if($('#decode').find('.active')[0])
          $('#decode').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#decode').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
        switch(settings['decode']) {
          case 0:  //软解
            $('i[name=ruan]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 1: //硬解
            $('i[name=ying]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
        }

      }

    }

    oPage.init();


}
