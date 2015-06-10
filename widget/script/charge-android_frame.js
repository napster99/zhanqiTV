/* =============================================
 * 20150130
 * =============================================
 * Copyright Napster
 *
 * 充值方式--android frame
 * ============================================= */
apiready = function(){

  // 页面显示时触发
  api.addEventListener({name:'viewappear'}, function(ret, err){
    fInitInfo();  
  });

  var ui = {
      $num_usermoney: $('#num-usermoney')
    , $btn_zfb: $('#btn-zfb')
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
      
      // 支付宝充值
      ui.$btn_zfb.on('click', function() {
      
        api.openWin({
          name: 'recharge-affirm', 
          url: '../html/recharge-affirm.html', 
          delay: 100,
          bgColor:'#FFF'
        });


      });
      
      // 网银充值
      // ui.$btn_wy.on('click', function() {
      //   // 暂时没有页面
      // });
    }
  }
  oPage.init();
}

// 初始化页面数据
function fInitInfo() {
  yp.ajax({
    url: URLConfig('getRich')
  , method: 'get'
  , dataType: 'json'
  }, function(ret, err) {
    if(!ret) return;
    if(ret['code'] == 0) {
      $('#num-usermoney').text(ret.data.gold.count);
    } else{
      api.alert({msg : ret['message']});
    }
   
  });
}

  
