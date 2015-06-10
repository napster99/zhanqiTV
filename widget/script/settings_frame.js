/* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 设置
 * ============================================= */
 apiready = function() {

    var zhanqi = api.require('zhanqiMD');

    var oPage = {

      init : function() {
        this.view();
        this.listen();
      },

      view : function() {
        if(api.systemType === 'ios') {
          $('#about-us').removeClass('hidden');
        }
        if(api.systemType === 'android') {
          $('#pushLi').removeClass('hidden');
        }

        this.setData();
        try{
          zhanqi.getNativeSettings({});
        }catch(e) {}
      },

      listen : function() {
        var self = this;
        $('li[name=open]').on('click',  function() {
          self.openWin(this.id);
        });

        api.addEventListener({
            name:'viewappear'
        },function(ret,err){
            self.setData();
        });

        
        //清楚缓存
        $('#cacheClear').on('click',  function() {
            api.showProgress({
              style: 'default',
              animationType: 'fade',
              title: '正在清除中...',
              text: '先喝杯茶...',
              modal: false
            });
            try{
              zhanqi.clearCurrentCache({});
            }catch(e) {}
            setTimeout(function() {
              api.hideProgress();
              $('#cacheSize').text(0);
            },1000);

        });

      },

      openWin : function(name) {
        api.openWin({
          name:name,
          url:'settings-'+name+'.html',
          delay:0,
          slidBackEnabled : true, 
          bgColor:'#FFF'});
      },

      setData : function() {
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
        if(settings) {
          this.definitions(settings['definition']);
          this.wifi(settings['wifi']);
          this.decodes(settings['decode']);
        }
      },

      //视频清晰度
      definitions : function(which) {
        switch(which) {
          case 0:
            $('#definitionWitch').text('超清');
            break;
          case 1:
            $('#definitionWitch').text('高清');
            break;
          case 2:
            $('#definitionWitch').text('标清');
            break;    
        }
        
      },

      wifi : function(which) {
        switch(which) {
          case 0:
            $('#wifiWhich').text('每次提醒');
            break;
          case 1:
            $('#wifiWhich').text('仅一次');
            break;
          case 2:
            $('#wifiWhich').text('不提醒');
            break;    
        }
      },

      decodes : function(which) {
        switch(which) {
          case 0:
            $('#decodeWitch').text('软解');
            break;
          case 1:
            $('#decodeWitch').text('硬解');
            break;   
        }
      },

      setNativeSettings : function(data) {
        var cache = data['cache'],
        ver = data['ver'];
        if(parseInt(cache/1024) > 0 && parseInt(cache/1024) <= 1024) {
          //kb
          $('#cacheSize').text((cache/1024+'').split('.')[0]+'KB');
        }else if( parseInt(cache/1024) > 1024) {
          //M
          $('#cacheSize').text((cache/1024/1024+'').split('.')[0]+'M');
        }else{
          //byte
          $('#cacheSize').text(cache);
        }

        $('#version').text(ver);

      }

    }

    oPage.init();
    
    window.setNativeSettings = oPage.setNativeSettings;
}
