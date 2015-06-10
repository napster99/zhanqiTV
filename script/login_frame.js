 /* =============================================
 * v20150127.1
 * =============================================
 * Copyright Napster
 *
 * 登录Frame
 * ============================================= */
apiready = function(){
  // 页面消失时触发
  api.addEventListener({name:'viewdisappear'}, function(ret, err){
    fInitInfo();
  });

  function fInitInfo() {
    $('input').val('');
  }
  var ui = {
      $txt_account: $('#txt-account')
    , $txt_pwd: $('#txt-pwd')
    , $btn_login: $('#btn-login')
    , $btn_reg: $('#btn-reg')
    , $btn_close: $('#btn-close')
    , $btn_qq: $('#btn-qq')
  };


  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
      
      yp.ajax({
          url: URLConfig('switch'),  
          method: 'get',
          dataType: 'json'
      },function(ret,err){
        if(!ret) return;
        if(ret['code'] == 0) {
          if(ret['data']['qq'] == 1 && api.systemType === 'ios') {
            $('.cutting-line, .qq-btn').removeClass('hidden');
          }
        }
      });

    },
    view : function() {

      if(api.pageParam['isRoom']) {
        ui.$btn_reg.addClass('hidden');
      }

      var account = $api.getStorage('account');

      if(account) {
        ui.$txt_account.val(account);
      }

    },
    listen : function()　{
      var self = this;
      // qq登陆
      ui.$btn_qq.on('click', function() {
        var iaf = api.require('qq');
        iaf.login(function(ret,err){
          if(ret.status) {
            yp.ajax({
              url: URLConfig('qqLoginUrl')
            , method: 'post'
            , dataType: 'json'
            , data: {
                values: {
                  openId: ret.openId
                , accessToken: ret.accessToken
                }
              }
            }, function(ret, error) {
              if(ret) {
                if(ret.code == 0) {
                  self.fLoginCallback(ret['data']);
                  $api.setStorage('qq','ok');
                } else{
                  api.alert({msg: ret.message});
                  $api.setStorage('qq','not');
                }
              } else {
                $api.setStorage('qq','not');
              }
            });
          } else{
            api.alert({msg: 'qq登陆失败!'});
          }
        });
      });

      // 注册
      ui.$btn_reg.on('click', function() {
        api.openWin({
          name:'register', 
          url:'../html/register.html', 
          delay:100,
          animation: {
            type: 'none',
            subType: 'from_right',
            duration: 300
          }
        });
      });

      // 关闭
      ui.$btn_close.on('click', function() {

        if(api.pageParam['isRoom']) {
          zhanqi.onBackToLiveScene({});
        }

        api.closeWin({
          name:'register',
          animation: {
            type: 'none',
            subType: 'from_top',
            duration: 0
          }
        });

        api.closeWin({
          name:'landing',
          animation: {
            type: 'reveal',
            subType: 'from_top',
            duration: 300
          }
        });
      });

      // 账号
      ui.$txt_account.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_login.trigger('click');
        }
      });

      // 密码
      ui.$txt_pwd.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_login.trigger('click');
        }
      });

      // 登陆
      ui.$btn_login.on('click', function() {
        self.fLogin();
      });

    },
    // 去除空格
    fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    },
    fLogin: function() {
      var self = this;
      var accountCont = self.fTrimStr(ui.$txt_account.val());
      var pwdCont = self.fTrimStr(ui.$txt_pwd.val());
      var unameReg = /^[A-Za-z0-9_]{5,16}$/;
      var isEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      var pwdReg = /^.{6,30}$/;

      if(accountCont == '') {
        setTimeout(function() {
          ui.$txt_account.focus();
        }, 1000);
        api.toast({msg: '请输入账号！', duration: 1000, location: 'middle'});
        return;
      }
      if(pwdCont == '') {
        setTimeout(function() {
          ui.$txt_pwd.focus();
        }, 1000);
        api.toast({msg: '请输入密码！', duration: 1000, location: 'middle'});
        return;
      }

      if (!unameReg.test(accountCont) && !isEmail.test(accountCont)) {
        setTimeout(function() {
          ui.$txt_account.focus();
        }, 1000);
        api.toast({msg: '账号格式不对！', duration: 1000, location: 'middle'});
        return;
      }

      if (!pwdReg.test(pwdCont)) {
        setTimeout(function() {
          ui.$txt_pwd.focus();
        }, 1000);
        api.toast({msg: '艾玛，账号不见了，还是密码忘记了，不然再想想？', duration: 1000, location: 'middle'});
        return;
      }

      yp.ajax({
            url : URLConfig('login')
          , method : 'post'
          , dataType : 'json'
          , headers: {
             'User-Agent': 'Zhanqi.tv Api Client'
            }
          , data: {
              values: {
                'account' : accountCont, 
                'password' : pwdCont
              }
            }
          }, function(ret, error) {
            if(!ret) return;
            if(ret.code == 0) {
              self.fLoginCallback(ret['data'], pwdCont);
            } else{
              api.alert({msg: ret.message});
            }
          });

        // 验证码
      // $('#landingBox').addClass('hidden');
      // $('#geetestBox').removeClass('hidden');

      // 验证码后台返回
      // window.gt_custom_ajax = function(result, id, message) {
      //   alert(result)
      //   if(result) {
      //     $('#landingBox').removeClass('hidden');
      //     $('#geetestBox').addClass('hidden');

      //     value = $('#' + id).find('input');

      //     yp.ajax({
      //       url : URLConfig('login')
      //     , method : 'post'
      //     , dataType : 'json'
      //     , headers: {
      //        'User-Agent': 'Zhanqi.tv Api Client'
      //       }
      //     , data: {
      //         values: {
      //           'account' : accountCont, 
      //           'password' : pwdCont,
      //           'geetest_challenge' : value.eq(0).val(),
      //           'geetest_validate' : value.eq(1).val(),
      //           'geetest_seccode' : value.eq(2).val()
      //         }
      //       }
      //     }, function(ret, error) {
      //       if(!ret) return;
      //       if(ret.code == 0) {
      //         self.fLoginCallback(ret['data'], pwdCont);
      //       } else{
      //         api.alert({msg: ret.message});
      //       }
      //     });
      //   }
      // }

    },
    // 登陆回调
    fLoginCallback: function(data, pwdCont) {
      var self = this;
      var user = data;

      if(!!user) {
        $api.setStorage('user', user);
        $api.setStorage('account', user['account']);
        $api.setStorage('token', user['token']);
      }
      if(!!pwdCont) {
        $api.setStorage('password', pwdCont);
      }
        var userParam = {
          'userName' : user['account'],
          'userUID' : user['uid'],
          'nickName' : user['nickname'],
          'userAvatar' : user['avatar'],
          'token' : user['token']
        }
        try{
          zhanqi.onLoginSuccess(userParam);
          zhanqi.initTrigerInfo({});
          zhanqi.onBackToLiveScene({});
        }catch(e){}
        
      api.closeWin({
        name: 'register',
        animation: {
          type: 'none'
        }
      });
      api.closeWin({
        animation: {
          type: 'reveal',
          subType: 'from_top',
          duration: 300
        }
      });
    }
  }
  oPage.init();
}


  
