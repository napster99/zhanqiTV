/* =============================================
 * v20150312.1
 * =============================================
 * Copyright Napster
 *
 * 直播间-主播简介
 * ============================================= */
apiready = function(){

  var zhanqi = api.require('zhanqiMD');

  var otherHeight = 11 + 52 +30 + 8 + 14 + 34 + 15;
  
  var oPage = {

    init : function() {

      this.view();
      this.listen();
      this.getRoomProfileInfo();
    },

    view : function() {
      this.setFollowState(api.pageParam['followState']);
    },

    listen : function() {
      var self = this;

      $('#followBtn').on('touchstart',  function() {
        try{
          zhanqi.onPressFollowBtn({});
        }catch(e){}
      });

    },

    getRoomProfileInfo : function() {
      var self = this;
      yp.ajax({
        url : URLConfig('liveRoomInfo',{'roomid' : api.pageParam['roomId']}),
        method : 'get',
        dataType : 'json'
      }, function(ret, err) {
        if(ret) {
          self.renderData(ret['data']);
        }
      });
    },


    renderData : function(data) {
      if($.isEmptyObject(data)) return;
      
      $('#avatar').attr('src',data['avatar'] + '-big');
      
      $('#roomName').text(data['title']).width(api.winWidth - 80 + 'px');
      $('#nickname').text(data['nickname']).css('max-width', api.winWidth - 200 + 'px');
      $('#anchorLevel').addClass('level-' + data['anchorAttr']['hots']['level']);

      $('#status').text(data['status']);
      if(data['status'] != 4) {  //非直播
        $('#onLive').addClass('hidden');
        $('#stateBtn').addClass('state-btn-gray').text('未开播');
        otherHeight += 30;
      }else{
        $('#stateBtn').removeClass('state-btn-gray').text('正在直播');
      }

      $('#gameName').text(data['gameName']);
      $('#online').text(data['online']);

      $('#roomNotice').text(data['roomNotice']).height((api.pageParam['h'] - otherHeight)+'px');


      $('#loadPage').addClass('hidden');
      $('#mainCon').removeClass('hidden');

      
    },

    changeOnline : function(count) {
      $('#online').text(count);
    },

    setFollowState : function(data) {
      if(data === 1) {  //订阅
        $('#followBtn').addClass('ft-btn-gray').find('span').text('取消订阅');
        $('#followBtn').find('i').addClass('hidden');
      }else{ //未订阅
        $('#followBtn').removeClass('ft-btn-gray').find('span').text('订阅');
        $('#followBtn').find('i').removeClass('hidden');
      }
      $('#followBtn').removeClass('hidden').data('state', data);
    },

    changeNoticeHeight : function(h) {
      $('#roomNotice').height(( h - otherHeight)+'px');
    }


  }


  oPage.init();


  window.changeOnline = oPage.changeOnline;
  window.setFollowState = oPage.setFollowState;
  window.changeNoticeHeight = oPage.changeNoticeHeight;


}
