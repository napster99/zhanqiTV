

  function fInitInfo() {
    var user = $api.getStorage('user');
    if(!$.isEmptyObject(user)) {
      fChangeStatus();
    } else{
      // 登陆
      api.openWin({
        name:'landing',
        url:'../html/landing.html',
        bgColor:'#FFF',
        animation: {
          type: 'movein',
          subType: 'from_bottom',
          duration: 300
        }
      });
    }
  }
  function fChangeStatus() {
    var oRecord = $api.getStorage('oRecord');
    if(oRecord) {
      for(var i in oRecord) {
        if(oRecord[i].status) {
          $('#btn-title').html(oRecord[i].title);
        }
      }
    }
    api.execScript({
      frameName: 'wealth-con',
      script: 'fInitInfo();'
    });
  }
  apiready = function(){

    // 存储我的钱包类型
    var oRecord = {
      charge: {
        title: '充值记录'
      , status: true
      }
    , giftuse: {
        title: '送礼记录'
      , status: false
      }
    };
    $api.setStorage('oRecord', oRecord);
    fInitInfo();

    var width = api.winWidth;
    var height = api.winHeight, headPos=0;
    

    
    headPos = $('.top-bar').offset().height;

    
    var header = $api.dom('.top-bar');
    $api.fixIos7Bar(header);


    var conheight = height - headPos;
    api.openFrame({
      name: 'wealth-con',
      url: '../html/wealth-con.html',
      bounces: true,
      opaque: true,
      vScrollBarEnabled: false,
      rect: {
        x: 0,
        y: $('.top-bar').offset().height,
        w: 'auto',
        h: 'auto'
      }
    });

    $('#btn-title').on('click', function() {
      api.openFrame({
        name: 'wealth-top',
        url: '../html/wealth-top.html',
        opaque: false,
        bounces: false,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false,
        scaleEnabled: false,
        bgColor: 'rgba(0, 0, 0, 0)',
        rect: {
          x: 0,
          y: 0,
          w: width,
          h: height
        }
      });
    });
  };
