/* =============================================
 * v20141026
 * =============================================
 * Copyright shihua
 *
 * 首页
 * ============================================= */
apiready = function() {

  var ui = {
  }
  
  var chance = 0;
  
  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    refresh: 0,
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
        self.refresh = 1;
        self.loadData();
        //初始化抽奖
        self.initLottery();
      });

      // self.loadData();
      self.firstLoadData();

      self.initLottery();

    },
    listen : function() {
      var self = this;
      api.addEventListener({
          name: 'online'
      }, function(ret, err){
          self.refresh = 1;
          self.loadData();
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
      });

      //点击重新加载页面
      $('#wrap').on('click',  function() {
        if(!$('#noPage').hasClass('hidden')) {
          self.firstLoadData();
        }
      });

      //进入更多
      $('.js-toGameLive').on('click', function(e) {
        e.stopPropagation();
        var gameId = +$(this).attr('gameId');
        var title = $(this).attr('title');
        if(gameId == 0){
          $api.setStorage('gameId', gameId);
          api.execScript({
            name: 'root',
            script: 'openLiveList();'
          });
        }else{
          var obj = {
            'id' : gameId,
            'title' : title,
            'isIndex' : true
          }
          obj = JSON.stringify(obj);
          api.execScript({
            name: 'root',
            script: 'openGameLive('+obj+');'
          });
        }
      });

      window.enterRooms = function(el) {
        var roomid = el.id;
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
        if(roomid) {
          api.openWin(options);
        }
      }


      //抽奖
      $('#lottery').on('click', function() {
        // var pageName = 'triger';
        // api.openFrame({
        //   name: pageName,
        //   url: '../html/'+ pageName +'.html',
        //   bounces: false,
        //   opaque: false,
        //   vScrollBarEnabled: false,
        //   // bgColor : rgba(0,0,0,0),
        //   pageParam: {'roomId' : '1231', 'roomChance' : 2},
        //   rect: {
        //     x:  0,
        //     y: 0,
        //     w: api.winWidth,
        //     h: api.winHeight
        //   }
        // });

        // return;

        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) { 
          api.openWin({
            name:'landing',
            url:'../html/landing.html',
            delay:0,
            slidBackEnabled : false,
            bgColor:'#FFF',
            animation: {
              type: 'movein',
              subType: 'from_bottom',
              duration: 300
            },
            pageParam: {name: 'home'}
          });
          return;
        }
        //机会为0
        if(chance < 1) {
          api.alert({'msg' : '抽奖机会用完了'});
          return;
        }

        var width = api.winWidth;
        var headPos = 0;
        var height = api.winHeight - headPos;
        
        api.openWin({
          name: 'lottery',
          url: './lottery.html',
          bounces: false,
          opaque: true,
          vScrollBarEnabled: true,
          pageParam: {
            count : chance
          },
          rect: {
            x: 0,
            y: headPos,
            w: width,
            h: height
          }
        });
      });

    },

    firstLoadData : function() {
      this.refresh = 0;
      //展示load页面
      $('#homePage, #noPage').addClass('hidden');
      $('#loadPage').removeClass('hidden');
      
      this.loadData(true);
      
    },

    showNoNetWork : function() {
      $('#homePage, #loadPage').addClass('hidden');
      $('#noPage').removeClass('hidden');
    },

    swipeDataArr : null,

    loadData : function(first) {
      var self = this;
      self.getDataIndex(URLConfig('bannerIndex'), function(data) {
        if(data['data'] instanceof Array && data['data'].length < 1 || $.isEmptyObject(data['data'])) {
          return;
        }
        self.swipeDataArr = data['data'];
        // self.renderSlider(data['data']);
        if(!first) {
          self.renderSlider(data['data']);
        }
      },'bannerIndex');

      self.getDataIndex(URLConfig('indexDataUrl'),  function(data) {
        data = data['data'];

        if(first) {
          setTimeout(function() {
            $('#loadPage, #noPage').addClass('hidden');
            $('#homePage').removeClass('hidden');

            if(self.swipeDataArr) {
              self.renderSlider(self.swipeDataArr);
            }
          },2000) 
        }

        for(var i=0; i<data.length; i++) {
          if(!data[i]['lists']) return;
          var lists = data[i]['lists'],
          keyword = data[i]['keyword'].split('.')[1],
          len = lists.length,
          rootEl = $('div[keyword='+keyword+']');
          rootEl.find('span[name=title]').text(data[i]['title']);
          if(keyword === 'livenow') { //热门直播 6个
            if(len > 6) {
              len = 6;
            }
          }else{  //其余显示4个，不足4个不显示
            rootEl.removeClass('hidden');
            if(len > 4) {
              len = 4;
            }else if(len < 4){
              rootEl.addClass('hidden');
              continue;
            }
          }
          setTimeout(function() {
            api.refreshHeaderLoadDone();
          },500)

          self.renderGameLiveData(lists, rootEl.find('ul'), first);
        }


      });


    },

    getDataIndex : function(url,callback,which) {
      var self = this;

      yp.ajax({
        url : url,
        method : 'get',
        dataType : 'json'
      }, function(ret, err) {
        if(!ret || err) {
          api.refreshHeaderLoadDone();
          self.showNoNetWork();
          return;
        }
        if(ret['code'] == 0) {
          callback(ret);
        } else {
          api.alert({msg : ret['message'] || ret['msg']});
        }
      });
    },
    //游戏的四个直播
    renderGameLiveData : function(data, $dom, first) {
      var self = this;
      $dom.find('li').each(function(i){
        $self = $(this);
        $self.attr({
           'id' : data[i]['id']
          ,'tapmode' : 'active'
        });
        var online = data[i]['online']>10000? Math.round(data[i]['online']/1000)/10+'万' : data[i]['online'];
        var gender = data[i]['gender']==2? 'icon-boy' : 'icon-girl';
        $self.find('.anchor').find('i').removeClass('icon-boy icon-girl').addClass(gender);
        $self.find('.til').empty().text(data[i]['title']);
        $self.find('.js-online').empty().text(online);
        $self.find('.js-nickname').empty().text(data[i]['nickname']).width('90px');
        $dom.parents('div.game-box').find('.js-toGameLive').attr('title',data[i]['gameName']).attr('gameId',data[i]['gameId']);

        var bpic = data[i]['bpic'];
        
        if($dom.parents('div[keyword=livenow]')[0]) {
          $self.find('img').attr('src', bpic);
        }else{
          $self.find('img').attr('data-original', bpic);
        }

      });


      //惰性加载
      $('img.lazy').lazyload({
        // threshold : 0
        effect : "show"
      , placeholder : '../image/default_bpic.png'
      });

    },

    //渲染首页swipe插件
    renderSlider : function(data) {
      var self = this;
      if(window.isSlided){
        window.mySwipe.kill();
      }

      var htmlStr = '';
      //初始化
      var width = api.winWidth;
      $('.hd').height(parseInt(width*9/16));

      for(var i=0; i<data.length; i++) {
        var id = data[i]['roomId'];
        var spic = data[i]['spic'];
        var title = data[i]['title'];
        if(data[i]['roomId'] != data[i]['room']['id']){
          id = data[i]['room']['id'];
          spic = data[i]['room']['bpic'];
          title = data[i]['room']['title'];
        }

        if(i === 0) {
          $('#title').text(title);
        }

        htmlStr += '<li tapmode="active" id="'+ id +'" onclick="enterRooms(this);" title="'+title+'">'
                +'<img src="'+ spic +'" style="height:'+width*9/16+'px" class="show-pic" /></li>'

      }
      var pointerStr = '<span class="dot active"></span>';
      for(var i=1; i<data.length; i++) {
        pointerStr += '<span class="dot"></span>';
      }
      
      $('#dotBox').html(pointerStr);
      $('#banner-content').html(htmlStr);

      var slide = $api.byId('slider');
      var slideTitle = $('#title')[0];

      
      window.mySwipe = Swipe(slide, {
        // startSlide: 2,
        // speed: 400,
        auto: 3000,
        continuous: true,
        disableScroll: false,
        stopPropagation: true,
        callback: function(index, elem) {
          var num = $('#dotBox span').length -1;
          if(num < index){
            index = index - 2;
            $('#dotBox span.active').removeClass('active');
            $('#dotBox span:eq('+index+')').addClass('active');
          }else{
            $('#dotBox span.active').removeClass('active');
            $('#dotBox span:eq('+index+')').addClass('active');
          }
        },
        transitionEnd: function(index, elem) {
          slideTitle.innerHTML = $(elem).attr('title');
        }
      });

      window.isSlided = true;
    },

    initLottery : function() {
      return;
      api.ajax({
        url: URLConfig('getLotteryInfo'),
        method: 'get',
        headers: {
          'User-Agent': 'Zhanqi.tv Api Client'
        },
        dataType: 'json'
      }, function(ret, err){
        if(ret['code'] == 0) {
          chance = ret['data']['chance'];
          // if(chance != 0) {
            $('#lotteryCount').text(chance);
          // }
        }else{
          api.alert({msg : ret['message']});
        }
      });

    },

    reflashLottery : function() {
      chance = $api.getStorage('chance');
      $('#lotteryCount').text(chance);
    }

  }
  oPage.init();

  window.reflashLottery = oPage.reflashLottery;
  window.initLottery = oPage.initLottery;
}
