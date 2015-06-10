/* =============================================
 * 20150128 1
 * =============================================
 * Copyright Napster
 *
 * 修改手机frame
 * ============================================= */
apiready = function(){
  var ui = {
    $btn_editPhone_requireCode: $('#btn-editPhone-requireCode')
  , $btn_editPhone_save: $('#btn-editPhone-save')
  , $box_editPhone: $('#box-editPhone')
  , $txt_phone: $('#txt-phone')
  , $txt_code: $('#txt-code')
  , $btn_close: $('#btn-close')
  };

  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    }
  , view : function() {
    
    }
  , listen : function()　{
      var self = this;


      // 输入控件验证
      self.oCheckFun = {
        'code': self.fCodeCheck
      , 'phone': self.fPhoneCheck
      };

      // 获取验证码
      ui.$btn_editPhone_requireCode.on('click', function() {
        self.fRequireCode();
      });
      ui.$txt_phone.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_editPhone_requireCode.trigger('click');
        }
      });

      // 保存
      ui.$btn_editPhone_save.on('click', function() {
        self.fFormSubmit(ui.$box_editPhone);
      });
      ui.$txt_code.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_editPhone_save.trigger('click');
        }
      });
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
  // 获取验证码
  , fRequireCode: function() {
      var self = this;

      if(ui.$btn_editPhone_requireCode.data('sending')) {
        return;
      }

      var oCheck = self.oCheckFun[ ui.$txt_phone.data('type') ].call(self, ui.$txt_phone);
      if( !oCheck.isok ){
        self.fDealCheckResult(ui.$txt_phone, oCheck.message, oCheck.isok);
      } else{
        yp.ajax({
          url: URLConfig('bindPhone'),
          method: 'post',
          dataType: 'json',
          data: {
            values: {mobile: ui.$txt_phone.val()}
          }
        }, function(ret, err){
          if(ret) {
            if(ret.code == 0) {
              self.fSetTime();
            } else{
              api.alert({msg: ret.message});
            }
          } else{
            api.alert({msg: '网络似乎出现了异常'});
          }
        });
      }
    }
  // 计时1分钟
  , fSetTime: function() {
      var self = this,
          time = 60, 
          $sending = ui.$btn_editPhone_requireCode,
          timeout = null,
          timing = function() {
            timeout = setTimeout(function() {
              if(time > 0) {
                time--;
                $sending.text(time + '秒');
                timing();
              } else{  
                $sending.text('再次发送');
                $sending.data('sending', false);            
              }
            }, 1000);
          };
      if(timeout) {
        clearTimeout(timeout);
      }
      $sending.data('sending', true);
      $sending.text('60秒');
      timing();
    }
  // 表单提交
  , fFormSubmit: function($obj){
      var self = this;

      var bAllIsok = true
        , $v
        , params = {uid: $api.getStorage('user').uid};

      $obj.find('[data-type]').each(function(i, v){
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
      } else{
        var paramArray = $obj.serializeArray();
        for(var i = 0, l = paramArray.length; i < l; i++) {
          params[paramArray[i]['name']] = paramArray[i]['value'];
        }
      }
      yp.ajax({
        url: URLConfig('bindPhone'),
        method: 'post',
        dataType: 'json',
        data: {
          values: params
        }
      }, function(ret, err){
        if(ret) {
          if(ret.code == 0) {
            var user = $api.getStorage('user');
            user.mobile = params.mobile;
            $api.setStorage('user', user);
            api.execScript({
              name: 'personal',
              frameName : 'personal-frame',
              script: 'fInitInfo();'
            });
            try{
              zhanqi.initTrigerInfo({});
              zhanqi.onBackToLiveScene({});
            }catch(e) {}

            api.closeWin({
              animation: {
                type: 'reveal',
                subType: 'from_top',
                duration: 300
              }
            });
          } else{
            api.alert({msg: ret.message});
          }
        } else{
          api.alert({msg: '网络似乎出现了异常'});
        }
      });
    }
  // 手机号码
  , fPhoneCheck: function($target){
      var self = this
        , reg = /^[0-9]{11}$/
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
  // 验证码
  , fCodeCheck: function($target){
      var self = this
        , reg = /^[0-9]{6}$/
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
  };

  oPage.init();
};