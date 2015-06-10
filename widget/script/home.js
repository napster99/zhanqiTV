/* =============================================
 * 20150128.1
 * =============================================
 * Copyright Napster
 *
 * 我的页面
 * ============================================= */
  function fInitInfo() {
    var user = $api.getStorage('user');
    
    if(!$.isEmptyObject(user)) {
      // 头像，昵称，设置初始化
      fGetWealth();
      $('#photo').attr('src', user.avatar + '-big');
      $('#personal').text(user.nickname);
      $('#head .js-setting').show();
      $('#box-uncenter').hide();
      $('#box-center').show();

    } else{
      $('#head .js-setting').hide();
      $('#box-uncenter').show();
      $('#box-center').hide();
    }
  }
  function fGetWealth() {
    yp.ajax({
      url: URLConfig('getRich')
    , method: 'get'
    , dataType: 'json'
    , notLoad: true
    }, function(ret, err) {
      if(ret['code'] == 0) {
        $('#gold').text(ret.data.gold.count);
        $('#coin').text(ret.data.coin.count);
      } else{
        api.alert({msg : ret['message']});
      }
    });
  }
  apiready = function(){

    api.addEventListener({name:'viewappear'}, function(ret, err){
      fInitInfo();
    });

    fInitInfo();

    // 个人资料
    $('#personal').on('click', function() {
      api.openWin({name:'personal',url:'../html/personal.html',delay:0,bgColor:'#FFF'});
    });

    // 头像
    $('#photo').on('click', function() {
      api.openWin({name:'personal',url:'../html/personal.html',delay:0,bgColor:'#FFF'});
    });

    // 充值
    $('#recharge').on('click', function() {
      var name = '';
      var url = '';
      if((api.systemType.toLowerCase()).indexOf('ios') > -1) {
        // 打开ios充值页面
        name = "recharge-ios";
        url = 'recharge-ios.html';
      } else{
        // 打开安卓充值页面
        name = "recharge-android";
        url = 'recharge-android.html';
      }
      api.openWin({name: name,url: url,delay:0,bgColor:'#FFF'});
    });

    // 应用设置
    $('.js-setting').on('click', function() {
      api.openWin({name:'settings',url:'../html/settings.html?user=true',delay:0,slidBackEnabled : false, bgColor:'#FFF'});
    });

    // 登陆
    $('#btn-login, #avatar').on('click', function() {
      api.openWin({
        name:'landing',
        url:'../html/landing.html',
        delay:0,
        bgColor:'#FFF',
        animation: {
          type: 'movein',
          subType: 'from_bottom',
          duration: 300
        },
        pageParam: {name: 'home'}
      });
    });


    window.fGetWealth = fGetWealth;

  };
