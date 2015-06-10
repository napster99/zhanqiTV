 /* =============================================
 * 20150128.1
 * =============================================
 * Copyright Napster
 *
 * 每日签到frame
 * ============================================= */
apiready = function() {

  api.addEventListener({name:'viewappear'}, function(ret, err){
    fInitInfo();
  });
  
  var ui = {
  }

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    },
    view: function() {
      fInitInfo();
    },
    listen: function()　{
      var self = this;

      // 点击获取奖励
      $('#btn-require').on('click', function() {
        yp.ajax({
          url: URLConfig('sTaskReceiveUrl')
        , method: 'post'
        , dataType: 'json'
        , data: {
            values: {type: 'sign'}
          }
        }, function(ret, err) {
          if(ret.code == 0) {
            api.closeWin();
          } else{
            api.alert({msg: ret.message});
          }
        });
      });
    }
  }
  oPage.init();
}
// 初始化
function fInitInfo() {
  var data = api.pageParam;

  $('#goldlist').find('li').slice(0, data.days).each(function() {
    $(this).find('.btn-task').addClass('btn-finish').text('已签到');
  });
  $('#goldlist').find('li').slice(data.days + 1, 7).each(function() {
    $(this).find('.btn-task').addClass('btn-after');
  });
}