/* =============================================
 * 20150129.2
 * =============================================
 * Copyright Napster
 *
 * 搜索frame
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
    // $keyword: $('#keyword')
    $history: $('#history')
  , $historyList: $('#historyList')
  , $cleanHistory: $('#cleanHistory')
  , $result: $('#result')
  // , $tab: $('#tab')
  , $liveList: $('#liveList')
  , $hostList: $('#hostList')
  , $noHistory: $('#noHistory')
  , $noTabResult: $('#noTabResult')
  };

  var setKeyword = '';

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , pageNow : [1, 1]
  , tabNow : 0
  , ajaxing : [0, 0]
  , end : false
  , searchType: ['live','anchor']
  , texting : null
  , tabResult: [-1, -1]
  , first : true
  , view: function() {
      var self = this;
      self.renderSearchHistory();
    }
  , listen: function() {
      var self = this;
      
      //点击历史记录
      ui.$historyList.on('click', '.js-history',function(){
        var $self = $(this);
        var key = $self.find('.search-result').text();
        api.execScript({
          name : 'search',
          script: 'blurKeyword("'+key+'");'
        });
        self.searching(key);
      }).on('click', '.js-delete',function(e){
        e.stopPropagation();
        var $self = $(this);
        var id = $self.attr('id')*1;
        var searchHistory = $api.getStorage('searchHistory') || [];
        if(searchHistory[id] != undefined){
          searchHistory.splice(id, 1);
        }
        $api.setStorage('searchHistory', searchHistory);
        $self.closest('.js-history').remove();
        self.renderSearchHistory();
      });
      //搜索时收起输入框
      ui.$result.on('click',function(){
        api.execScript({
          name : 'search',
          script: 'blurKeyword();'
        });
      });
      //清空搜索记录
      ui.$cleanHistory.on('click', function(){
        $api.setStorage('searchHistory', []);
        $('.js-history').remove();
        ui.$history.addClass('hidden');
        ui.$noHistory.removeClass('hidden');
      })
      
      //滚动到底部刷新
      api.addEventListener({
        name: 'scrolltobottom'
      }, function(ret, err){
        // var keyword = ui.$keyword.val();
        var i = self.tabNow;
        self.pageNow[i] = +self.pageNow[i] + 1;

        if(self.ajaxing[i] == 1 || !ui.$history.hasClass('hidden') ){
          return;
        }

        self.first = false;
        self.showButtomLoading(true);
        self.searchData(setKeyword, i);


      });

      //进入直播间
      window.enterRooms = function(el) {
        var roomid = el.id;
        if(roomid) {
          var options = {
              name:'rooms'
            ,'slidBackEnabled' : false
            , url:'../html/rooms.html'
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

    }
  , searching: function(keyword){
      var self = oPage;
      var searchHistory = $api.getStorage('searchHistory') || [];
      var isHaving = false;
      for(var i=0; i<searchHistory.length; i++){
        var k = searchHistory[i];
        if(k == keyword){
          isHaving = true;
        }
      }
      if(!isHaving){
        if(10 == searchHistory.length){
          searchHistory.pop();
        }
        searchHistory.unshift(keyword);
      }
      $api.setStorage('searchHistory', searchHistory);
      self.ajaxing = [1, 1];
      self.pageNow = [1, 1];
      self.tabResult = [-1, -1];
      ui.$liveList.empty();
      ui.$hostList.empty();
      self.searchData(keyword, 0);
      self.searchData(keyword, 1);
    }
  , searchData: function(keyword, idx){
      var self = this, defaultCon = '';
      var searchType = self.searchType[idx];
      var pageNow = self.pageNow[idx];
      keyword = String(keyword).replace(/\s+/g, '');
      setKeyword = keyword;
        
      //直播间的加载
      if(idx === 0) {
        if(self.end) {
          return; 
        }
        defaultCon = self.renderDefaultData(10);
      }


      self.getDataAjax(URLConfig('search', {
        'num': 10
      , 'page': pageNow
      , 'q': keyword
      , 't': searchType
      }), function(data) {
        ui.$history.addClass('hidden');
        ui.$noHistory.addClass('hidden');
        ui.$result.removeClass('hidden');
        self.showButtomLoading(false);
        if(data.length == 0){
          if(self.tabResult[idx]>0){
            self.ajaxing[idx]  = 1;
            return;
          }
          self.tabResult[idx] = 0;
          if(self.tabNow == idx){
            $('.js-result').addClass('hidden');
            ui.$noTabResult.removeClass('hidden');
          }
          return;
        }
        
        self.tabResult[idx] = 1;
        if(self.tabNow == idx){
          $('.js-result').eq(idx).removeClass('hidden');
          ui.$noTabResult.addClass('hidden');
        }
        if(idx == 0){
          self.renderLiveResult(data, defaultCon);
        }else{
          self.renderHostResult(data);
        }
        if(10 == data.length){
          self.ajaxing[idx]  = 0;
        }
      });
    }

  , getDataAjax: function(url,callback) {
      var self = this;

      if(self.first) {
        $('#loadPage').removeClass('hidden');
        $('#searchPage, #noPage').addClass('hidden');
      }

      yp.ajax({
        url : url,
        method : 'get',
        dataType : 'json'
      }, function(ret, err) {
        if(ret) {
          if(self.first) {
            $('#loadPage, #noPage').addClass('hidden');
            $('#searchPage').removeClass('hidden');
          }
          if($.isEmptyObject(ret)) {
            callback([]);
            return;
          }else if(ret['code'] == 0){
            callback(ret['data']);
          }else{
            api.alert({msg : ret['message'] || ret['msg']});
          }
        }else{
          //数据出错
          $('#loadPage, #searchPage').addClass('hidden');
          $('#noPage').removeClass('hidden');
        }
      });
    }

  , showButtomLoading : function(flag) {
      if(!flag) {
        $('#main').find('div.pull-down').remove();
      }else{
        var htmlStr = '<div class="pull-down"><img src="../image/loading.gif" alt=""></div>';
        if($('#main').find('div.pull-down')[0]) {
          $('#main').find('div.pull-down').remove();
        }
        $('#main').append(htmlStr);
      }
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
                // + '      <span class="audience"><i class="icon-m icon-spectator"></i>'
                // + '      <span class="js-online">加载中...</span></span>'
                + '      <p class="anchor"><i class="icon-m icon-boy"></i>'
                + '      <span class="js-nickname">加载中...</span></p>'
                + '    </div>'
                + '</li>'
      }

      htmlStr = $(htmlStr);
      ui.$liveList.append(htmlStr);
      api.parseTapmode();
      return $(htmlStr);
    }

    //渲染历史记录
  , renderSearchHistory: function(){
      var searchHistory = $api.getStorage('searchHistory') || [];
      if(0 ==searchHistory.length){
        ui.$history.addClass('hidden');
        ui.$noHistory.removeClass('hidden');
      }else{
        ui.$noHistory.addClass('hidden');
        var historyHtml = '';
        for(var i = 0; i<searchHistory.length; i++){
          historyHtml += '<li class="js-history"><div class="pull-right">'
                      +  '<i class="icon-m icon-close js-delete" id="'+i+'"></i></div>'
                      +  '<i class="icon-m icon-timepiece"></i><span class="search-result">'+searchHistory[i]+'</span></li>';
        }
        ui.$history.removeClass('hidden');
        ui.$historyList.find('.js-history').remove();
        ui.$historyList.prepend(historyHtml);
      }
    }
  , renderLiveResult: function(data, con) {
      var i = data.length, self = this;
      con.each(function(idx){
        $self = $(this);
        if(idx < i){
          var id = data[idx]['id'].split('room-')[1];
          var spic = data[idx]['spic'];
          var nickname = data[idx]['nickname'];
          var title = data[idx]['title'];
          var online = data[idx]['online']>10000? Math.round(data[idx]['online']/1000)/10+'万' : data[idx]['online'];
          var gender = data[idx]['docTag']['gender']==2? 'icon-boy' : 'icon-girl';
          $self.attr('id', id);
          $self.find('img.game-pic').attr('data-original', spic);
          $self.find('.til').empty().html(title);
          // $self.find('.js-online').empty().html(online);
          $self.find('.js-nickname').empty().html(nickname);
          $self.find('.anchor').find('i').removeClass('icon-boy icon-girl').addClass(gender);
        }else{
          $self.remove();
          self.end = true;
        }
      });
      
      //惰性加载
      con.find('img.game-pic').lazyload({
        threshold : 0
      , effect : "show"
      , placeholder : '../image/default_bpic.png'
      });

    }
  , renderHostResult: function(data) {
      var self = this;
      var width = api.winWidth;
      var htmlStr = '';
      var hostHtml = '';
      for(var i=0; i<data.length; i++) {
        var spic = data[i]['spic'];
        var id = data[i]['id'].split('room-')[1];
        var avatar = data[i]['avatar'] + '-big';
        var title = data[i]['title'];
        var nickname = data[i]['nickname'];
        var online = data[i]['docTag']['online'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['docTag']['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;

        hostHtml += '<li tapmode="active" onclick="enterRooms(this);" id="'+id+'">'
        + '<div class="clearfix"><img src="'+avatar+'" alt="" class="user-photo">'
        + '<div class="pull-left">'
        + '<p class="user-name">'+nickname+'</p>'
        + '<p class="order-count">'+follows+'人订阅</p>'
        + '</div></div></li>';
      }
      ui.$hostList.append(hostHtml);
      api.parseTapmode();
    }

  , domCtroller : function(idx) {
      oPage.tabNow = idx;

      if(oPage.tabResult[idx] == 0){
        $('.js-result').addClass('hidden');
        ui.$noTabResult.removeClass('hidden');
        return;
      }
      ui.$noTabResult.addClass('hidden');
      if(idx == 1){
        ui.$hostList.closest('.js-result').removeClass('hidden');
        ui.$liveList.closest('.js-result').addClass('hidden');
      }else{
        ui.$hostList.closest('.js-result').addClass('hidden');
        ui.$liveList.closest('.js-result').removeClass('hidden');
      }
    }

  , inputEvent : function(keyword) {
      if(keyword == ''){
        clearTimeout(oPage.texting);
        oPage.texting = null;
        return;
      }
      var waiting = oPage.texting;
      if(waiting){
        clearTimeout(oPage.texting);
        oPage.texting = null;
      }
      oPage.searching(keyword);
    }

  , keyupEvent : function(keyword, flag) {
      oPage.first = true;
      oPage.end = false;
      if(flag){
        ui.$result.addClass('hidden');
        oPage.renderSearchHistory();
      }else{
        oPage.searching(keyword);
      }
    }

  };

  oPage.init();

  window.domCtroller = oPage.domCtroller;
  window.inputEvent = oPage.inputEvent;
  window.keyupEvent = oPage.keyupEvent;

});
