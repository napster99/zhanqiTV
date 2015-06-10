/* =============================================
 * v20141026
 * =============================================
 * Copyright shihua
 *
 * 游戏列表
 * ============================================= */
apiready = function() {

  var ui = {
  	$gameList: $('#gameList')
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
        self.end = false;
        self.failCount = 0;
        // ui.$gameList.html('');
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

      
      ui.$gameList.on('click', 'li',function() {
        var id = $(this).attr('id');
        var title = $(this).attr('title');
        var obj = {
          'id' : id,
          'title' : title
        }
        obj = JSON.stringify(obj);
        api.execScript({
          name: 'root',
          script: 'openGameLive('+obj+');'
        });

        // api.openWin({
        //     name:'game-live'
        //   ,'slidBackEnabled' : false
        //   , url:'game-live.html'
        //   , pageParam : {'id' : id, 'title' : title}
        //   , slidBackEnabled : true
        //   , bgColor:'#FFF'
        // });


      });
		},

    firstLoadData : function() {
      this.ajaxing = 0;
      this.pageNow = 1;
      this.refresh = 1;
      this.isRefresh = false;
      this.end = false;
      this.failCount = 0;
      ui.$gameList.html('');

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
        htmlStr += '<li>'
                +'    <div class="game-a">'
                +'      <img src="../image/game-default.jpg" alt="">'
                +'      <p class="game-list-name">加载中...</p>'
                +'    </div>'
                +'  </li>'
      }
      htmlStr = $(htmlStr);
      ui.$gameList.append(htmlStr);

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
        defaultCon = self.renderDefaultData(12);
      }
      self.getDataIndex(URLConfig('gameList', {
      	'num': 12
      , 'page': self.pageNow
      }), function(data) {
        self.showButtomLoading(false);
        self.ajaxing = 0;

        if(noPlacehoder) {
          self.renderNoPlacehoderData(data['games']);
        }else{
          self.renderRealData(data['games'], defaultCon, first);
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
        if(!ret || err) {
          api.refreshHeaderLoadDone();
          self.showNoNetWork();
          self.ajaxing = 0;
          return;
        }
        
        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.alert({msg : ret['message']});
        }
      });
    },

    renderRealData : function(data, con, first) {
      var i = data.length, self = this;
      con.each(function(idx){
        $self = $(this);
        if(idx < i){
          var id = data[idx]['id'];
          var title = data[idx]['name'];
          var spic = data[idx]['spic'];
          $self.attr('id', id);
          $self.attr('title', title);
          $self.find('img').attr('data-original', spic);
          $self.find('.game-list-name').text(title);

          // if(id == 45 && api.systemType === 'ios') {    //游戏放映室  为了审核而过滤
          //   $self.remove();
          // }

          if(data[idx]['status'] == -1) {
            $self.remove();
          }

        }else{
          $self.remove();
          self.end = true;
        }
      });

      con.find('img')[0].onload = function() {
        ui.$gameList.find('img').height($(this).width()*1.4)
      }

      if(first) {
        $('#loadPage, #noPage').addClass('hidden');
        $('#homePage').removeClass('hidden');
      }
      
      //惰性加载
      con.find('img').lazyload({
        threshold : 0
      , effect : "show"
      , placeholder : '../image/game-default.jpg'
      });

    },

    renderNoPlacehoderData : function(data) {
      var lis = ui.$gameList.find('li'), len = data.length;
      if(lis.length >= len) {
        lis.each(function(idx) {
          $self = $(this);
          if(idx < len){
            var id = data[idx]['id'];
            var title = data[idx]['name'];
            var spic = data[idx]['spic'];
            $self.attr('id', id);
            $self.attr('title', title);
            $self.find('img').attr('data-original', spic);
            $self.find('.game-list-name').text(title);
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
