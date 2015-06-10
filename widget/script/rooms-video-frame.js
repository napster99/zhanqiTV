/* =============================================
 * v20150312.1
 * =============================================
 * Copyright Napster
 *
 * 直播间-视频区域
 * ============================================= */

apiready = function() {

  var ui = {
    $videoList: $('#videoList')
  }

  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    pageNow : 1,
    ajaxing : 0,
    refresh: 0,
    isRefresh : false,
    end : false,
    curMode : 'videoHots',

    view : function() {
      this.firstLoadData();
    },
    listen : function() {
      var self = this;

      api.addEventListener({
        name: 'scrolltobottom'
      }, function(ret, err){
        if(!self.isRefresh) {
          self.showButtomLoading(true);
          self.loadData();
        }
      });

      //排序切换
      $('#sortKey').on('touchstart', function() {
        var which = $(this).attr('which');
        $(this).attr('which',self.curMode).find('span').text(which === 'videoNews' ? '按热度':'按时间');
        self.curMode = which;
        self.firstLoadData();

        return false;
      });


      //点击播放视频
      window.playVideo = function(el) {

        if($(el).hasClass('active')) {
          return;
        }
        var id = $(el).data('id');
        var videoLevels = $(el).data('videoLevels');
        var title = $(el).data('title');
        var playCnt = $(el).data('playCnt');
        if(ui.$videoList.find('li.active-top')[0]) {
          ui.$videoList.find('li.active-top').removeClass('active-top');
        }
        ui.$videoList.find('li.active').removeClass('active');

        var prevEl = ui.$videoList.find('li').eq($(el).index() - 1);
        if(prevEl[0]) {
          prevEl.addClass('active-top');
        }
        $(el).addClass('active');
        try{
          zhanqi.playVideoRecord({
            'title' : title,
            'VideoLevels' : videoLevels,
            'playCnt' : playCnt
          })
        }catch(e) {}

        self.setPlayRecords(id);

      }

      //点击重新加载页面
      $('#wrap').on('click',  function() {
        if(!$('#noPage').hasClass('hidden')) {
          self.firstLoadData();
        }
      });

    },
    
    setPlayRecords : function(videoId) {
      yp.ajax({
        url: URLConfig('videoWatch',{'videoId':videoId}),
        method: 'get',
        dataType: 'json'
      },function() {});
    },

    firstLoadData : function() {
      this.ajaxing = 0;
      this.pageNow = 1;
      this.refresh = 1;
      this.isRefresh = false;
      this.end = false;
      ui.$videoList.html('');
      
      //展示load页面
      $('div[name=content], #noPage').addClass('hidden');
      
      $('#loadPage').removeClass('hidden');
      this.loadData(true);
    },

    showButtomLoading : function(flag) {
      if(!flag) {
        $('#main').find('div.pull-down').remove();
      }else{
        var htmlStr = '<div class="pull-down"><img src="../image/loading.gif" alt=""></div>';
        if($('#main').find('div.pull-down')[0]) {
          $('#main').find('div.pull-down').remove();
        }
        $('#main').append(htmlStr);
      }
    },

    renderDefaultData : function(size) {
      var htmlStr = '';
      for(var i=0; i<size; i++) {
        htmlStr += '<li onclick="playVideo(this);">'
                + '   <div class="video-list-li ">'
                + '     <div class="clearfix">'
                + '       <img src="../image/default_bpic.png" alt="" class="game-pic">'
                + '       <div class="detail-box">'
                + '          <p class="til">加载中...</p>'
                + '         <p class="count"><span>加载中...</span>次播放</p>'
                + '         <p class="date">加载中...</p>'
                + '       </div>'
                + '    </div>'
                + '   </div>'
                + '</li>'
      }

      htmlStr = $(htmlStr);
      ui.$videoList.append(htmlStr);
      api.parseTapmode();
      return $(htmlStr);
    },

    loadData : function(first, noPlacehoder) {
      var self = this, defaultCon = null;
      if(self.ajaxing == 1 || self.end){
        self.showButtomLoading(false);
        return;
      }
      self.ajaxing = 1;
      if(!noPlacehoder) {
        defaultCon = self.renderDefaultData(20);
      }
      
      self.getDataIndex(URLConfig(self.curMode, {
        'uid' : api.pageParam['anchorUid'],
        'num': 20,
        'page': self.pageNow
      }), function(data) {

        self.showButtomLoading(false);
        self.ajaxing = 0;

        if(data['videos'].length === 0) { //暂无数据
          $('#loadPage,div[name=content]').addClass('hidden');
          $('#noPage').removeClass('hidden');
          return;
        }

        if(noPlacehoder) {
          self.renderNoPlacehoderData(data['videos']);
        }else{
          self.renderRealData(data['videos'], defaultCon, first);
        }

        if(self.refresh == 1){
          self.isRefresh = false;
        }
        self.pageNow++;

      });
    },

    getDataIndex : function(url,callback) {
      var self = this;

      yp.ajax({
        url : url,
        method : 'get',
        dataType : 'json'
      }, function(ret, err) {
        if(!ret || err) {
          self.ajaxing = 0;
        } else if(ret['code'] == 0) {
          callback(ret['data']);
        } else {
          api.alert({msg : ret['message'] || ret['msg']});
          $('div[name=content], #loadPage').addClass('hidden');
          $('#noPage').removeClass('hidden');
        }
      });
    },

    renderRealData : function(data, con, first) {
      var i = data.length, self = this;
      con.each(function(idx){
        $self = $(this);
        if(idx < i){
          var title = data[idx]['title'];
          var id = data[idx]['id'];
          var bpic = data[idx]['bpic'];
          var playCnt = data[idx]['playCnt'];
          var date = self.getDateFormat(data[idx]['addTime']);

          $self.find('img.game-pic').attr('src', bpic);
          $self.find('.til').empty().text(title);
          $self.find('.count').find('span').text(playCnt);
          $self.find('.date').text(date);  
          //传给播放器字段
          var title = data[idx]['title'];
          var playCnt = data[idx]['playCnt'];
          var videoLevels = data[idx]['flashvars']['VideoLevels'];

          $self.data('id',id);
          $self.data('title',title);
          $self.data('playCnt',playCnt);
          $self.data('videoLevels',videoLevels);

        }else{
          $self.remove();
          self.end = true;
        }
      });
      
      if(first) {
        $('#loadPage,#noPage').addClass('hidden');

        $('div[name=content]').removeClass('hidden');
      }

      //惰性加载
      con.find('img.game-pic').lazyload({
        threshold : 0
      , effect : "show"
      , placeholder : '../image/default_bpic.png'
      });

    },

    renderNoPlacehoderData : function(data) {
      var lis = ui.$videoList.find('li'), len = data.length;
      if(lis.length >= len) {
        lis.each(function(idx) {
          $self = $(this);
          if(idx < len){
            var id = data[idx]['id'];
            var bpic = data[idx]['bpic'];
            var nickname = data[idx]['nickname'];
            var title = data[idx]['title'];
            var online = data[idx]['online']>10000? Math.round(data[idx]['online']/1000)/10+'万' : data[idx]['online'];
            var gender = data[idx]['gender']==2? 'icon-boy' : 'icon-girl';
            $self.attr('id', id);
            $self.find('img.game-pic').attr('data-original', bpic);
            $self.find('.til').empty().text(title);
            $self.find('.js-online').empty().text(online);
            $self.find('.js-nickname').empty().text(nickname);
            $self.find('.anchor').find('i').removeClass('icon-boy icon-girl').addClass(gender);
          }else{
            $self.remove();
          }
        });  
      }else{ //原有占位图少于请求的数据

      }
      

    },

    getDateFormat : function(date) {
      var d = new Date(date*1000);
      return d.getFullYear() +'-'+(d.getMonth()+1)+'-' + d.getDate();
    },

    clearSelectedMode : function() {
      if(ui.$videoList.find('li.active-top')[0]) {
        ui.$videoList.find('li.active-top').removeClass('active-top');
      }
      ui.$videoList.find('li.active').removeClass('active');
    }


  }

  oPage.init();

  window.clearSelectedMode = oPage.clearSelectedMode;
}
