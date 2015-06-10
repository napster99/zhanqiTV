 /* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 视频清晰度
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
            name: 'definition'
        }, function(ret){
          $api.setStorage('settings', settings);
          var definition = settings && settings['definition'] || 0;
          // api.execScript({
          //   name: 'settings',
          //   frameName : 'settings-frame',
          //   script: 'definitions('+definition+');'
          // });
          api.closeWin();
        });


        //清晰度选择
        $('#definition').on('click',  'li', function() {
          var name = $(this).attr('name');
          if($('#definition').find('.active')[0])
          $('#definition').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#definition').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
          $(this).find('i').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
          switch(name) {
            case 'super':
              settings['definition'] = 0;
              break;
            case 'hd':
              settings['definition'] = 1;
              break;
            case 'sd':
              settings['definition'] = 2;
              break;
          }

          $api.setStorage('settings', settings);


        });


      },

      setData : function(settings) {

        //清晰度选择
        if($('#definition').find('.active')[0])
          $('#definition').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#definition').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
        switch(settings['definition']) {
          case 0:  //全屏
            $('i[name=super]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 1: //上方
            $('i[name=hd]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 2: //下方
            $('i[name=sd]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
        }

      }

    }

    oPage.init();


}
