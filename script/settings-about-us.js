/* =============================================
 * v20150105.1
 * =============================================
 * Copyright Napster
 *
 * 关于我们(IOS)
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
        name: 'settings-about-us-frame',
        url: '../html/settings-about-us-frame.html',
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

		listen : function() {

		}


	}

  oPage.init();

}



