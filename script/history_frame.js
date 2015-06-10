/* =============================================
 * v20141020.1
 * =============================================
 * Copyright Napster
 *
 * 历史记录
 * ============================================= */

apiready = function() {

  var ui = {
    $historyList: $('#historyList')
  }

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    pageNow : 1,
    ajaxing : 0,
    refresh: 0,
    failCount: 0,
    isRefresh : false,
    end : false,

    view : function() {
      var self = this;
      
      api.setRefreshHeaderInfo({
        visible: true,
        loadingImgae: 'widget://image/refresh-white.png',
        bgColor: '#f6f7f8',
        textColor: '#000',
        textDown: '下拉可以刷新',
        textUp: '松开即可刷新',
        showTime: true
      }, function(ret, err){
        self.ajaxing = 0;
        self.pageNow = 1;
        self.refresh = 1;
        self.isRefresh = true;
        self.failCount = 0;
        self.end = false;

        // ui.$historyList.html('');
        
        self.loadData(false, true);
      });

      // self.loadData();
      self.firstLoadData();

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
      })

      //点击重新加载页面
      $('#wrap').on('click',  function() {
        if(!$('#noPage').hasClass('hidden')) {
          self.firstLoadData();
        }
      });

      //进入直播间
      window.enterRooms = function(el) {
        var roomid = el.id;

        var options = {
            name:'rooms'
          , slidBackEnabled : false
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

        if(roomid) {
          api.openWin(options);
        }
      }

    },

    firstLoadData : function() {
      this.ajaxing = 0;
      this.pageNow = 1;
      this.refresh = 1;
      this.isRefresh = false;
      this.failCount = 0;
      this.end = false;

      ui.$historyList.html('');

      //展示load页面
      $('#homePage, #noPage').addClass('hidden');
      $('#loadPage').removeClass('hidden');
      
      this.loadData(true);
      
    },

    showNoNetWork : function() {
      $('#homePage, #loadPage').addClass('hidden');
      $('#noPage').removeClass('hidden');
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
        htmlStr += '<li tapmode="active" onclick="enterRooms(this);">'
                + '   <div class="video-mask-box">'
                + '    <div class="img-mask"></div>'
                + '    <img src="../image/default_bpic.png" alt="" class="game-pic">'
                + '    </div>'
                + '    <div class="til">加载中...</div>'
                + '    <div class="detail clearfix">'
                + '      <span class="audience"><i class="icon-m icon-spectator"></i>'
                + '      <span class="js-online">加载中...</span></span>'
                + '      <p class="anchor"><i class="icon-m icon-boy"></i>'
                + '      <span class="js-nickname">加载中...</span></p>'
                + '    </div>'
                + '</li>'
      }
      htmlStr = $(htmlStr);
      
      ui.$historyList.append(htmlStr);
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
      
      self.getDataIndex(URLConfig('history'), function(data) {
        self.showButtomLoading(false);
        self.ajaxing = 0;

        if(noPlacehoder) {
          self.renderNoPlacehoderData(data);
        }else{
          self.renderRealData(data, defaultCon, first);
        }

        if(self.refresh == 1){
          self.isRefresh = false;
          api.refreshHeaderLoadDone();
        }
        self.pageNow++;
      });
    },

    getDataIndex : function(url,callback) {
      var self = this;

      yp.ajax({
        url : url,
        method : 'get',
        timeout: 3000,
        dataType : 'json'
      }, function(ret, err) {
        // if(!ret || err) {
        //   api.refreshHeaderLoadDone();
        //   self.showNoNetWork();
        //   self.ajaxing = 0;
        //   return;
        // }
        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.refreshHeaderLoadDone();
          self.showNoNetWork();
          self.ajaxing = 0;
        }
      });
    },

    renderRealData : function(data, con, first) {
      var dataArr = [];
      $.each(data,  function(key, val) {
        dataArr.push(val);
      });

      var i = dataArr.length, self = this;
      con.each(function(idx){
        $self = $(this);
        if(idx < i){
          var id = dataArr[idx]['id'];
          var bpic = dataArr[idx]['bpic'];
          var nickname = dataArr[idx]['nickname'];
          var title = dataArr[idx]['title'];
          var online = dataArr[idx]['online']>10000? Math.round(dataArr[idx]['online']/1000)/10+'万' : dataArr[idx]['online'];
          var gender = dataArr[idx]['gender']==2? 'icon-boy' : 'icon-girl';
          $self.attr('id', id);
          $self.find('img.game-pic').attr('src', bpic);
          $self.find('.til').empty().text(title);
          $self.find('.js-online').empty().text(online);
          $self.find('.js-nickname').empty().text(nickname);
          $self.find('.anchor').find('i').removeClass('icon-boy icon-girl').addClass(gender);
        }else{
          $self.remove();
          self.end = true;
        }
      });
      
      if(first) {
        $('#loadPage, #noPage').addClass('hidden');
        $('#homePage').removeClass('hidden');
      }

      //惰性加载
      // con.find('img.game-pic').lazyload({
      //   threshold : 0
      // , effect : "show"
      // , placeholder : '../image/default_bpic.png'
      // });

    },

    renderNoPlacehoderData : function(data) {
      var lis = ui.$historyList.find('li'), len = data.length;
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
      

    }


  }
  oPage.init();
}
