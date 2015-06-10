 /* =============================================
 * v20150128.1
 * =============================================
 * Copyright Napster
 *
 * 注册frame
 * ============================================= */
apiready = function(){
  // 页面消失时触发
  api.addEventListener({name:'viewdisappear'}, function(ret, err){
    initInfo();
  });

  function initInfo() {
    $('input').val('');
  }
  
  var zhanqi = api.require('zhanqiMD');

  var ui = {
    $box_reg: $('#box-reg')
  , $btn_reg: $('#btn-reg')
  , $password_input: $('#password-input')
  , $password_input_confirm: $('#password-input-confirm')
  , $valid: $('[data-type]')
  , $btn_login: $('#btn-login')
  , $btn_agree: $('#btn-agree')
  , $btn_agreement: $('#btn-agreement')
  , $btn_privacy: $('#btn-privacy')
  , $btn_close: $('#btn-close')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    }
  , view : function() {
      var self = this;
      //初始化内容高度
      if(api.pageParam['isRoom']) {
        ui.$btn_login.addClass('hidden');
      }
    }
  , listen : function()　{
      var self = this;

      // 注册协议
      ui.$btn_agreement.on('click', function() {
        api.openWin({
          name:'register-agreement', 
          url:'../html/register-agreement.html'
        });
      });

      // 隐私政策
      ui.$btn_privacy.on('click', function() {
        api.openWin({
          name:'privacy', 
          url:'../html/privacy.html'
        });
      });

      // 同意协议
      ui.$btn_agree.on('click', function() {
        $(this).toggleClass('active');
      });

      // 回车事件
      ui.$valid.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_reg.trigger('click');
        }
      });

      // 注册提交
      ui.$btn_reg.on('click', function() {
        self.fFormSubmit(ui.$box_reg, URLConfig('register'));
      });

      // 输入控件验证
      self.oCheckFun = {
        'account': self.fAccountCheck
      , 'password': self.fPswCheck
      , 'email': self.fEmailCheck
      , 'nickname': self.fNicknameCheck
      };
    }
    // 获取长度
  , fGetStrLen: function(s){
      var l = 0;
      var a = s.split("");
      for (var i=0;i<a.length;i++) {
          if (a[i].charCodeAt(0)<299) {
            l++;
          } else {
            l+=3;
          }
      }
      return l;
    }
    // 去除空格
  , fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    }
    // 显示错误
  , fDealCheckResult: function($target, msg, isok){
      var self = this;
      $target.data('isok', isok);
      if(!isok) {
        setTimeout(function() {
          $target.focus();
        }, 1000);
        api.toast({msg: msg, duration: 1000, location: 'middle'});
      }
    }
    // 表单提交
  , fFormSubmit: function($obj, url){
      var self = this;
      var bAllIsok = true
        , $v
        , params = {};

      ui.$valid.each(function(i, v){
        $v = $(v);
        var oCheck = self.oCheckFun[ $v.data('type') ].call(self, $v);
        self.fDealCheckResult($v, oCheck.message, oCheck.isok);
        if( !oCheck.isok ){
          bAllIsok = false;
          return false;
        }
      });
      if( !bAllIsok ){
        return false;
      }

      // 客官，您还未同意服务条款
      if(!ui.$btn_agree.hasClass('active')) {
        self.fDealCheckResult(ui.$btn_agreement, '客官，您还未同意服务条款!', false);
        return false;
      }
      var paramArray = $obj.serializeArray();
      for(var i = 0, l = paramArray.length; i < l; i++) {
        params[paramArray[i]['name']] = paramArray[i]['value'];
      }
      yp.ajax({
        url : url
      , method : 'post'
      , dataType : 'json'
      , data: {
          values: params
        }
      }, function(ret, error) {
        if(!ret) return;
        if(ret.code == 0) {
          self.fLoginCallback(ret['data'], params.password);
        } else{
          api.alert({msg: ret.message});
        }
       
      });
    }
    // 账号监测
  , fAccountCheck: function($target){
      var self = this
        , reg = /^[A-Za-z0-9_]{5,16}$/
        , val = self.fTrimStr($target.val())
        , oResult = { isok: false, message: '' };

      if( '' == val ){  // 判断是否为空
        oResult.message = $target.data('required');
      } else if( !reg.test(val) ){
        oResult.message = $target.data('invalide');
      } else {
        oResult.isok = true;
      }

      return oResult;
    }
    // 昵称监测
  , fNicknameCheck: function($target){
      var self = this
        , val = self.fTrimStr($target.val())
        , len = 0
        , oResult = { isok: false, message: '' };

      len = self.fGetStrLen(val);
      if( '' == val ){  // 判断是否为空
        oResult.message = $target.data('required');
      // } else if( 4 > len || 40 < len ){
      } else if( 6 > len || 24 < len ){
        oResult.message = $target.data('invalide');
      } else {
        oResult.isok = true;
      }

      return oResult;
    }
    // 密码检测
  , fPswCheck: function($target){
      var self = this
        , reg = /^.{6,30}$/
        , val = self.fTrimStr($target.val())
        , oResult = { isok: false, message: '' }
        , isConfirm = $target.data('confirm') ? true : false;

      if( !isConfirm ){ // 密码
        if( '' == val ){  // 判断是否为空
          oResult.message = $target.data('required');
        } else if( !reg.test(val) ){
          oResult.message = $target.data('invalide');
        } else {
          oResult.isok = true;
          var rval = self.fTrimStr($('#password-input-confirm').val());
          if( val == rval ){
            self.fDealCheckResult($('#password-input-confirm'), '', true);
          }
        }
      } else {  // 确认密码
        if( val != $('#password-input').val() ){
          oResult.message = $target.data('confirm');
        } else {
          oResult.isok = true;
        }
      }

      return oResult;
    }
    // 邮箱监测
  , fEmailCheck: function($target){
      var self = this
        , reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        , val = self.fTrimStr($target.val())
        , oResult = { isok: false, message: '' };

      if( '' == val ){  // 判断是否为空
        oResult.message = $target.data('required');
      } else if( !reg.test(val) ){
        oResult.message = $target.data('invalide');
      } else {
        oResult.isok = true;
      }

      return oResult;
    }
    // 登陆回调
  , fLoginCallback: function(data, pwdCont) {
      var self = this;
      var user = data;
      // if(!!user) {
      //   $api.setStorage('user', user);
      //   $api.setStorage('token', user['token']);
      // }

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
        name: 'landing',
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
  };
  oPage.init();
};