 /* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 非WIFI提醒
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
            name: 'wifi'
        }, function(ret){
          $api.setStorage('settings', settings);
          // var wifi = settings && settings['wifi'] || 0;
          // api.execScript({
          //   name: 'settings',
          //   frameName : 'settings-frame',
          //   script: 'wifi('+wifi+');'
          // });
          api.closeWin();
        });
        //wifi
        $('#wifi').on('click',  'li', function() {
          var name = $(this).attr('name');
          if($('#wifi').find('.active')[0])
          $('#wifi').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#wifi').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
          $(this).find('i').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
          switch(name) {
            case 'always':
              settings['wifi'] = 0;
              break;
            case 'once':
              settings['wifi'] = 1;
              break;
            case 'not':
              settings['wifi'] = 2;
              break;
          }
          $api.setStorage('settings', settings);
        });
      },

      setData : function(settings) {

        //wifi
        if($('#wifi').find('.active')[0])
          $('#wifi').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#wifi').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
        switch(settings['wifi']) {
          case 0:  //每次提醒
            $('i[name=always]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 1: //仅一次
            $('i[name=once]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 2: //不提醒
            $('i[name=not]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
        }

      }

    }

    oPage.init();


}
