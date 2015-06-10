/* =============================================
 * v20141209.1
 * =============================================
 * Copyright Napster
 *
 * 弹幕设置
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
          name: 'barrage'
        }, function(ret){
          var barrage = $api.getStorage('barrage');
          settings['barrage'] = barrage;
          $api.setStorage('settings', settings);
          api.closeWin();
        });
        

        //弹幕透明度
        $('.proportion-dot')[0].addEventListener('touchstart',  function(event) {
          event.preventDefault();
        });

        $('.proportion-dot')[0].addEventListener('touchmove',  function(event) {
          event.preventDefault();
          var rate = parseInt((event.targetTouches[0].pageX - $('.proportion-bg').offset().left)/$('.proportion-bg').width() * 100);
          if(rate < 1) rate = 0;
          if(rate > 100) rate = 100;
          $(this).css('left',rate + '%');
          $('.proportion-in').width(rate + '%');
          settings['opacity'] = rate/100;
          $api.setStorage('settings', settings);
        });

        $('.proportion-dot')[0].addEventListener('touchend',  function(event) {
          event.preventDefault();
        });

        //弹幕大小
        $('#size').on('click',  'a',  function() {
          if($('#size').find('a.active')[0])
            $('#size').find('a.active').removeClass('active');
          $(this).addClass('active');
          switch($(this).attr('name')) {
            case 'small':
              settings['size'] = 0;
              $('#preView').css('font-size','16px');  //字体预览
              break;
            case 'normal':
              settings['size'] = 1;
              $('#preView').css('font-size','18px');  //字体预览
              break
            case 'big':
              settings['size'] = 2;
              $('#preView').css('font-size','20px');  //字体预览
              break;
          }
          $api.setStorage('settings', settings);
        });


       //弹幕位置
        $('.location-screen').on('click', function() {
          var name = $(this).attr('name');
          alert('click' + name);
          if($('#pos').find('.active')[0])
            $('#pos').find('.active').removeClass('active');
          $(this).find('span').addClass('active');
          switch(name) {
            case 'full':
              settings['pos'] = 0;
              break;
            case 'up':
              settings['pos'] = 1;
              break;
            case 'down':
              settings['pos'] = 2;
              break;
          }
          $api.setStorage('settings', settings);
        });


      },

      setData : function(settings) {
        //弹幕开关
        if(Number(settings['barrage'])) {   
          $('#barrageCon').html('<div class="toggle active" id="barrageSwitch"><div class="toggle-handle"></div> </div>');
        }else{
          $('#barrageCon').html('<div class="toggle" id="barrageSwitch"><div class="toggle-handle"></div> </div>');
        }

        //弹幕透明度
        $('.proportion-dot').css('left',settings['opacity']*100 + '%')
        $('.proportion-in').width(settings['opacity']*100 + '%')

        //弹幕大小
        if($('#size').find('a.active')[0])
          $('#size').find('a.active').removeClass('active');
        
        switch(settings['size']) {
          case 0:  //小
            $('#size').find('a[name=small]').addClass('active');
            $('#preView').css('font-size','16px');  //字体预览
            break;
          case 1: //中
            $('#size').find('a[name=normal]').addClass('active');
            $('#preView').css('font-size','18px');  //字体预览
            break;
          case 2: //大
            $('#size').find('a[name=big]').addClass('active');
            $('#preView').css('font-size','20px');  //字体预览
            break;
        }

        //弹幕位置
        if($('#pos').find('.active')[0])
          $('#pos').find('.active').removeClass('active');
        switch(settings['pos']) {
          case 0:  //全屏
            $('span[name=full]').addClass('active');
            break;
          case 1: //上方
            $('span[name=up]').addClass('active');
            break;
          case 2: //下方
            $('span[name=down]').addClass('active');
            break;
        }

      }
    }

    oPage.init();


}