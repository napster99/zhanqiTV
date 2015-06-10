/* =============================================
 * v20150128
 * =============================================
 * Copyright Napster
 *
 * 我的订阅frame
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
  , $liveList: $('#liveList')
  , $noResult: $('#noResult')

  };
  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , ajaxing : 0
  , view: function() {
      this.getFollowsData();
    }
  , listen: function() {
      var self = this;

      window.enterRooms = function(el) {
        var roomid = el.id;
        if(roomid) {
          var options = {
              name:'rooms'
            ,'slidBackEnabled' : false
            , url:'rooms.html'
            , pageParam : {'roomid' : roomid}
            , bgColor:'#FFF'
          }

          if(api.systemType === 'android') {
            options['animation'] = {
              duration : 400
            }
            options['alone'] = true;
          }

          api.openWin(options);
        }
      }

      //断网提示
      // api.addEventListener({
      //   name: 'offline'
      // }, function(ret, err){
      //   self.showNoNetWork();
      // });

      //网络恢复
      api.addEventListener({
        name:'online'
      },function(ret,err){
        if(!$('#noPage').hasClass('hidden')) {
          self.firstLoadData();
        }
      });

      //点击重新加载页面
      $('#wrap').on('click',  function() {
        if(!$('#noPage').hasClass('hidden')) {
          self.getFollowsData();
        }
      });

    }
    //编辑订阅返回调用
  , reflashData : function() {
      ui.$liveList.html('');
      oPage.getFollowsData();
    }

  , showNoNetWork : function() {
      $('#homePage, #loadPage').addClass('hidden');
      $('#noPage').removeClass('hidden');
    }

  , renderDefaultData : function(size) {
      var htmlStr = '';
      for(var i=0; i<size; i++) {
        htmlStr += '<li tapmode="active" onclick="enterRooms(this);">'
                + '   <div class="video-mask-box">'
                + '    <div class="img-mask"></div>'
                + '    <img src="../image/default_bpic.png" alt="" class="game-pic">'
                + '    </div>'
                + '    <div class="til">加载中...</div>'
                + '    <div class="detail clearfix">'
                + '      <span class="audience"><i class="icon-m icon-spectator"></i>'
                + '      <span class="js-online">加载中...</span></span>'
                + '      <p class="anchor">'
                + '      <span class="js-nickname">加载中...</span></p>'
                + '    </div>'
                + '</li>'
      }
      htmlStr = $(htmlStr);
      ui.$liveList.append(htmlStr);
      api.parseTapmode();
      return $(htmlStr);
    }

  , getFollowsData: function(){
      var self = this;
      var defaultCon = self.renderDefaultData(8);
      self.getDataAjax(URLConfig('followList'), function(data) {

        setTimeout(function() {//占位图显示延迟
          $('#loadPage, #noPage').addClass('hidden');
          $('#homePage').removeClass('hidden');
        },500);

        if(data.length == 0){
          $('.module').addClass('hidden');
          ui.$noResult.removeClass('hidden');
          return;
        }
        ui.$noResult.addClass('hidden');
        $('.module').removeClass('hidden');
        self.renderFollow(data, defaultCon);
      });
    }
  , getDataAjax: function(url,callback) {
      var self = this;
      yp.ajax({
        url : url,
        method : 'post',
        dataType : 'json'
      }, function(ret, err) {

        if(!ret || err) {
          self.showNoNetWork();
          return;
        }

        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.alert({msg : 'subscribe_frame>'+ret['message']});
        }
      });
    }
  , renderFollow: function(data, con) {
      var self = this;
      var anchorHtml = '';
      var liveAttr = [];
      for(var i = 0; i<data.length; i++){
        var title = data[i]['title'];
        var status = data[i]['status'];
        var avatar = data[i]['avatar'] + '-big';
        var nickname = data[i]['nickname'];
        var online = data[i]['online'];
        var bpic = data[i]['bpic'];
        var id = data[i]['roomId'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;
        if(status == 0){
          anchorHtml += '<li tapmode="active" onclick="enterRooms(this);" id="'+id+'"><div class="clearfix"><img src="'+avatar+'" alt="" class="user-photo">'
          + '<div class="pull-left"><p class="user-name">'+nickname+'</p>'
          + '<p class="order-count">'+follows+'人订阅</p></div></li>'
        }
        else if(status == 4){
          liveAttr.push({
              id : id
            , bpic : bpic
            , title : title
            , online : online
            , nickname : nickname
          });
        }
      }
      ui.$anchorList.empty().html(anchorHtml);
      // ui.$liveList.empty().html(liveHtml);
      api.parseTapmode();
      this.renderRooms(liveAttr, con);
    }

  , renderRooms : function(data, con) {
      var i = data.length, htmlStr = '';
      con.each(function(idx){
        $self = $(this);
        if(idx < i){
          var id = data[idx]['id'];
          var bpic = data[idx]['bpic'];
          var nickname = data[idx]['nickname'];
          var title = data[idx]['title'];
          var online = data[idx]['online']>10000? Math.round(data[idx]['online']/1000)/10+'万' : data[idx]['online'];
          $self.attr('id', id);
          $self.find('img.game-pic').attr('src', bpic);
          $self.find('.til').empty().text(title);
          $self.find('.js-online').empty().text(online);
          $self.find('.js-nickname').empty().text(nickname);
        }else{
          $self.remove();
        }
      });
      
      if(con.length < i) {
        for(var j = con.length; j<i; j++) {
          var online = data[j]['online']>10000? Math.round(data[j]['online']/1000)/10+'万' : data[j]['online'];
          htmlStr += '<li id="'+data[j]['id']+'" tapmode="active" onclick="enterRooms(this);">'
                + '   <div class="video-mask-box">'
                + '    <div class="img-mask"></div>'
                + '    <img src="'+data[j]['bpic']+'" alt="" class="game-pic">'
                + '    </div>'
                + '    <div class="til">'+data[j]['title']+'</div>'
                + '    <div class="detail clearfix">'
                + '      <span class="audience"><i class="icon-m icon-spectator"></i>'
                + '      <span class="js-online">'+online+'</span></span>'
                + '      <p class="anchor">'
                + '      <span class="js-nickname">'+data[j]['nickname']+'</span></p>'
                + '    </div>'
                + '</li>'
        }
        ui.$liveList.append(htmlStr);
      }

      
    }

  };
  oPage.init();

  window.reflashData = oPage.reflashData;

});