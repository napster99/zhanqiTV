 /* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 问题描述
 * ============================================= */
apiready = function(){

  // 页面显示时触发
  // api.addEventListener({name:'viewappear'}, function(ret, err){
    
  // });
  // 页面消失时触发
  // api.addEventListener({name:'viewdisappear'}, function(ret, err){
  //   fInitInfo();
  // });

  function fInitInfo() {
    $('input').val('');
  }

  var zhanqi = api.require('zhanqiMD'), version = '';

  var ui = {
      $txt_contact: $('#txt-contact')
    , $txt_desc: $('#txt-desc')
    , $btn_save: $('#btn-save')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      try{
        zhanqi.getNativeSettings({'cache':false});
      }catch(e) {}
    },
    listen : function()　{
      var self = this;

      // 问题描述
      ui.$txt_desc.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_save.trigger('click');
        }
      });

      // 联系方式
      ui.$txt_contact.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_save.trigger('click');
        }
      });

      // 登陆
      ui.$btn_save.on('click', function() {
        self.fSave();
      });

    },
    // 去除空格
    fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    },
    fSave: function() {
      var self = this;
      var descCont = self.fTrimStr(ui.$txt_desc.val());
      var contactCont = self.fTrimStr(ui.$txt_contact.val());

      if(descCont == '') {
        setTimeout(function() {
          ui.$txt_desc.focus();
        }, 1000);
        api.toast({msg: '请描述问题！', duration: 1000, location: 'middle'});
        return;
      }
      if(contactCont == '') {
        setTimeout(function() {
          ui.$txt_contact.focus();
        }, 1000);
        api.toast({msg: '请输入联系方式！', duration: 1000, location: 'middle'});
        return;
      }

      yp.ajax({
        url : URLConfig('suggest'),
        method : 'post',
        dataType : 'json',
        data: {
          values: {
            'content' : descCont + ' 【设备号：'+api.deviceModel+',系统：'+api.systemType+' ' + api.systemVersion +'版本：'+version+'】 ' , 
            'contact' : contactCont
          }
        }
      }, function(ret, err) {
        if(ret.code == 0) {
          api.closeWin();
        } else{
          api.alert({msg: ret.message});
        }
      });
    },

    setNativeSettings : function(data) {
      version = data['ver'];
    }


  }
  oPage.init();

  window.setNativeSettings = oPage.setNativeSettings;
}


  
