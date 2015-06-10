/* =============================================
 * v20150312.1
 * =============================================
 * Copyright Napster
 *
 * 直播间-排行榜区域
 * ============================================= */

apiready = function(){
  
  var oPage = {

    init : function() {

      this.view();
      this.listen();
      this.getRankInfo();
    },

    view : function() {
      
      this.fansTitle = api.pageParam['fansTitle'];
      
    },

    listen : function() {
      $('#tabTitle').find('li').on('touchstart',  function() {
        var which = $(this).attr('name');
        if(which === 'week') {
          $('#all').addClass('hidden');
        }else{
          $('#week').addClass('hidden');
        }
        $('#' + which).removeClass('hidden');
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
      });
    },

    getRankInfo : function() {
      var self = this;
      yp.ajax({
        url : URLConfig('fansweekrank',{'roomid' : api.pageParam['roomId'],'num' : 10}),
        method : 'get',
        dataType : 'json'
      }, function(ret, err) {
        if(ret) {
          self.renderData(ret['data']);
        }
      });
    },

    renderData : function(data) {
      var weekArr = data['week'],
          allArr = data['total'];
      this.showWhich(weekArr, allArr);
      this.renderUnit(weekArr, $('#week').find('ul'));
      this.renderUnit(allArr, $('#all').find('ul'));

    },


    renderUnit : function(data, con) {
      var htmlStr = '', len = data.length > 10 ? 10 : data.length;
      for(var i=0; i<len; i++) {
        htmlStr += '<li>'
                + '<i class="name-bg grade-'+data[i]['level']+'">'+this.fansTitle+'</i>'
                + '<span class="name" style="width:'+(api.winWidth/2 - 80)+'px; height:18px;">'+data[i]['nickname']+'</span>'
                + '</li>';
      }
      if(data.length === 0) {
        htmlStr += '<div class="no-page">'
                +  '  <img src="../image/no-page.gif">'
                +  '  <p>暂无数据</p>'
                +  '</div>'
      }
      con.html(htmlStr);
    },

    showWhich : function(week, all){

      if(week.length > 0) {
        $('li[name=week]').addClass('active');
        $('#week').removeClass('hidden');
      }else if(all.length > 0){
        $('li[name=all]').addClass('active');
        $('#all').removeClass('hidden');
      }
    }



  }



  oPage.init();


}
