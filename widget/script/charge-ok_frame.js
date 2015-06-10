/* =============================================
 * 20150130
 * =============================================
 * Copyright Napster
 *
 * 充值页面--成功 frame
 * ============================================= */
apiready = function(){

  var ui = {
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      fInitInfo();
    },
    listen : function()　{
      var self = this;
    }
  }
  oPage.init();

  //通知home重新获取金币
  api.execScript({
    name: 'root',
    frameName: 'home',
    script: 'fGetWealth();'
  });

}

// 初始化页面数据
function fInitInfo() {
  var data = api.pageParam;
  $('#txt-account').text(data.account);
  // $('#txt-payType').text(data.payType);
  $('#txt-gold').text(data.gold);
  $('#txt-coin').text(data.coin);

}

  
