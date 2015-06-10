/* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 推送设置
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

    var zhanqi = api.require('zhanqiMD');

    try{
      // zhanqi.checkRFCFromWeb({});
      zhanqi.getNativeSettings({'cache':false});
    }catch(e) {}


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
            name: 'push'
        }, function(ret){
          $api.setStorage('settings', settings);
          api.closeWin();
        });
        

        //弹幕开关
        $('#pushSwitch').on('touchend', function() {
          $(this).data('push',!$(this).data('push'));
          settings['push'] = $(this).data('push');

          var data = $api.getStorage('settings') || {
              barrage : 1 //弹幕开关
             ,opacity : 1 //弹幕透明度
             ,size : 1 //弹幕大小
             ,pos : 0 //弹幕位置
             ,definition : 1 //清晰度选择
             ,lookBack : false //回看功能
             ,model : 0 //模式选择
             ,wifi : 0 //wifi提醒
             ,decode : 0 //0  软解    1  硬解
             ,push : true
             ,cacheSize : 0
          };
          data['submit'] = false;
          data['push'] = settings['push'];
          try{
            zhanqi.onGetSettingDataFromWeb(data);
          }catch(e){}

        });
        
      },

      setData : function(settings) {
        //弹幕开关
        if(settings['push']) {   
          $('#pushCon').html('<div class="toggle active" id="pushSwitch"><div class="toggle-handle"></div> </div>');
        }else{
          $('#pushCon').html('<div class="toggle" id="pushSwitch"><div class="toggle-handle"></div> </div>');
        }
        $('#pushSwitch').data('push', settings['push']);
      },

      setNativeSettings : function(data) {
        var push = data['push'];
        if(!push && api.systemType === 'ios') {
          $('#push').addClass('hidden');
          $('#pushClose').removeClass('hidden');
        }else{
          $('#push').removeClass('hidden');
          $('#pushClose').addClass('hidden');
        }
      }

    }

    oPage.init();

    window.setNativeSettings = oPage.setNativeSettings;

}

