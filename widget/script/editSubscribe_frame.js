/* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 编辑订阅frame
 * ============================================= */
function closeSearch(){
  api.closeWin({
    name: 'search',
    delay: 100,
    bounces: false,
    animation: {
      type: 'none',
      subType: 'from_top',
      duration: 200
    }
  });
}
yp.ready(function() {
  var ui = {
    $anchorList: $('#anchorList')
  , $noResult: $('#noResult')
  , $btnConfirm: $('#btnConfirm')
  , $btnCancel: $('#btnCancel')
  };
  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , unfollowList: []
  , unfollowNum: 0
  , view: function() {
      this.getFollowsData();
    }
  , listen: function() {
      var self = this;

      ui.$anchorList.on('click', '.js-unfollow', function(){
        $self = $(this);
        var uid = $self.attr('id');
        self.unfollowList.push(uid);
        $self.closest('li').remove();
      });
      ui.$btnCancel.on('click', function(){
        $self = $(this);
        api.confirm({
          msg: '是否放弃本次编辑？',
          buttons:[ '我再想想', '是']
        },function(ret,err){
          if(ret.buttonIndex == 2){
            api.closeWin();
          }
        });
      })
      ui.$btnConfirm.on('click', function(){
        $self = $(this);
        api.confirm({
          msg: '保存本次编辑？',
          buttons:[ '我再想想', '保存']
        },function(ret,err){
          if(ret.buttonIndex == 2){
            self.unfollow();
          }
        });
      })
    }
  , getFollowsData: function(){
      var self = this;
      self.getDataAjax(URLConfig('followList'), function(data) {
        if(data.length == 0){
          $('.module').addClass('hidden');
          ui.$noResult.removeClass('hidden');
          return;
        }
        ui.$noResult.addClass('hidden');
        $('.module').removeClass('hidden');
        self.renderFollow(data);
      });
    }

  , getDataAjax: function(url,callback) {
      var self = this;
      yp.ajax({
        url : url,
        method : 'post',
        dataType : 'json'
      }, function(ret, err) {
        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.alert({msg : ret['message']});
        }
      });
    }
  , unfollow: function(){
      var self = this;
      var unfollowList =  self.unfollowList;
      for(var i = 0; i<unfollowList.length; i++){
        var uid = unfollowList[i];
        self.unfollowAjax(URLConfig('unfollow'), {uid:uid},function(data) {
          self.unfollowNum++;
          if(self.unfollowNum == unfollowList.length){
            api.execScript({
              name : 'subscribe',
              frameName : 'subscribe-frame',
              script: 'reflashData();'
            });
            api.closeWin();
          }
        });
      }
    }

  , unfollowAjax: function(url, data, callback) {
      var self = this;
      yp.ajax({
        url : url,
        data : {values:data},
        method : 'post',
        dataType : 'json'
      }, function(ret, err) {
        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.alert({msg : ret['message']});
        }
      });
    }
  , renderFollow: function(data) {
      var self = this;
      var anchorHtml = '';
      for(var i = 0; i<data.length; i++){
        var avatar = data[i]['avatar'] +'-big';
        var nickname = data[i]['nickname'];
        var uid = data[i]['uid'];
        var follows = data[i]['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;
          anchorHtml += '<li><div class="clearfix"><i class="icon-m icon-close js-unfollow" id="'+uid+'" style="padding:20px"></i>'
          + '<img src="'+avatar+'" alt="" class="user-photo">'
          + '<div class="pull-left"><p class="user-name">'+nickname+'</p>'
          + '<p class="order-count">'+follows+'人订阅</p></div></div></li>';
      }
      ui.$anchorList.empty().html(anchorHtml);
    }

  };
  oPage.init();
});