/* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 设置
 * ============================================= */
 apiready = function() {
    var header = $api.dom('.top-bar');
    $api.fixIos7Bar(header);
    
    var zhanqi = api.require('zhanqiMD');

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
         api.openFrame({
          name: 'settings-frame',
          url: '../html/settings-frame.html',
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
          try{
            if(api.pageParam['isRoom']) {
              zhanqi.onBackToLiveScene({});
            }
            var settings = $api.getStorage('settings');
            alert(JSON.stringify(settings))
            settings['submit'] = true;
            zhanqi.onGetSettingDataFromWeb(settings);
            api.closeWin();
          }catch(e){
          }
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
