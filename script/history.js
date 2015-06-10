/* =============================================
 * v20141020.1
 * =============================================
 * Copyright Napster
 *
 * 历史记录
 * ============================================= */
apiready = function() {
  
  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

	var oPage = {
		init : function() {
      this.view();
      this.listen();
		},
		view : function() {
      api.openFrame({
        name: 'history-frame',
        url: '../html/history-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: true,
        rect: {
          x: 0,
          y: $('.top-bar').offset().height,
          w: 'auto',
          h: 'auto'
        }
      });
		},
		listen : function()　{
    }
	}
	oPage.init();
}
