 /* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 渲染数据、修改头像frame
 * ============================================= */
apiready = function(){  
  var ui = {
    $btn_quit: $('#btn-quit')
  , $btn_close: $('#btn-close')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      // 渲染数据
      fInitInfo();
    },
    listen : function()　{
      var self = this;
      // 关闭
      ui.$btn_close.on('click', function() {
        api.closeWin();
      });

      // 相册
      $('#personal-photo').on('click', function() {
        api.getPicture({
          sourceType: 'library',
          encodingType: 'png',
          mediaValue: 'pic',
          destinationType: 'base64',
          allowEdit: true,
          quality: 50,
          targetWidth:100,
          targetHeight:100,
          saveToPhotoAlbum: false
        }, function(ret, err){
          if (ret) {
            var encodeBase64 = ret.base64Data.replace('data:image/png;base64,','').replace('data:image/jpeg;base64,','');
            var url = URLConfig('avatar') + '?sid=' + $api.getStorage('user')['token'];
            
            yp.ajax({
              url: url
            , method: 'post'
            , dataType: 'text'
            , data: {
                values: {
                  'img_160_160': encodeBase64
                }
              }
            }, function(ret, error) {
                var redata = ret.substring(2,ret.length);
                var data = eval('('+redata+')')
                $('#avatar').attr('src',data[0]);
                var user = $api.getStorage('user');
                if(user) {
                  var avatar = data[0].replace('-normal', '');
                  user.avatar = avatar;
                };
                $api.setStorage('user', user);
            });



          }
        });
      });

      // 昵称
      $('#personal-nickname').on('click', function() {
        api.openWin({
          name:'editNickname',
          url:'editNickname.html',
          delay:0,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          }
        });
      });

      // 性别
      $('#personal-gender').on('click', function() {
        api.openWin({
          name:'editSex',
          url:'editSex.html',
          delay:0,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          }
        });
      });

      // 手机号码
      $('#personal-phone').on('click', function() {
        if(!!$(this).data('isClick')){
          api.openWin({
            name:'editPhone',
            url:'editPhone.html',
            delay:0,
            bgColor:'#FFF',
            animation: {
              type: 'movein',
              subType: 'from_bottom',
              duration: 300
            }
          });
        }
      });

      // 退出
      ui.$btn_quit.on('click', function() {
        self.fLogoutAjax();
      });
    }
    // 退出
  , fLogoutAjax: function() {
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '正在退出中...',
        text: '先喝杯茶...',
        modal: false
      });
      api.ajax({
        url: URLConfig('logout'),
        method: 'post',
        headers: {
          'User-Agent': 'Zhanqi.tv Api Client'
        },
        dataType: 'json'
      }, function(ret, err){
        api.hideProgress();
        if(ret) {
          if(ret.code == 0) {
            var key = 'user';
            $api.setStorage(key, null);
            $api.setStorage('token',null);
            api.closeWin({delay:0});
          } else{
            api.alert({msg: ret.message});
          }
        }
      });
    }
  }
  oPage.init();
}

function fInitInfo() {
  var user = $api.getStorage('user');
  if(user) {
    $('#personal-photo img').attr('src', user.avatar + '-normal');
    $('#personal-nickname .js-txt').text(user.nickname);
    var gender = '';
    if(user.gender == '1') {
      gender = '女';
    } else if(user.gender == '2') {
      gender = '男';
    }
    $('#personal-gender .js-txt').text(gender);
    
    if(user.bindMobile || $api.getStorage('bindMobile')) {
      $api.setStorage('bindMobile', user.bindMobile);
      var mobile = user.bindMobile.substring(7);
      $('#personal-phone').data('isClick', false).find('.js-txt').html('*******'+mobile);
    } else{
      $('#personal-phone').data('isClick', true).find('.js-txt').html('<span>未绑定</span><i class="icon-m icon-right"></i>');
    }
  }
}

  
