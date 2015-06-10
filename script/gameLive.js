/* =============================================
 * v20141026
 * =============================================
 * Copyright shihua
 *
 * 对应游戏的直播列表
 * ============================================= */
apiready = function() {
  var ui = {
    
  }


  var header = $api.dom('.top-bar');
  $api.fixIos7Bar(header);

	var oPage = {
		init : function() {
      this.view();
      this.listen();
		},

    view : function() {

      $('#title').text(api.pageParam['title']);

      api.openFrame({
        name: 'game-live-frame',
        url: '../html/game-live-frame.html',
        bounces: false,
        opaque: true,
        vScrollBarEnabled: true,
        pageParam: { 'id' : api.pageParam['id']},
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
