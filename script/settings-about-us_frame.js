/* =============================================
 * v20150105.1
 * =============================================
 * Copyright Napster
 *
 * 关于我们(IOS)
 * ============================================= */
apiready = function() {

  var zhanqi = api.require('zhanqiMD');

	var oPage = {

		init : function() {
			this.view();
      this.listen();
		},

		view : function() {
      try{
        zhanqi.getNativeSettings({'cache' : false});
      }catch(e){}
		},

		listen : function() {
      $('#score').on('click', function() {
        api.openApp({
            iosUrl: 'http://itunes.apple.com/us/app/zhan-qitv-gao-qing-you-xi/id920273306?l=zh&ls=1&mt=8'
        },function(ret,err){
            
        });
      });
		},

    setNativeSettings : function(data) {
      var ver = data['ver'];
      $('#version').text(ver);
    }


	}

  oPage.init();

  window.setNativeSettings = oPage.setNativeSettings;

}



