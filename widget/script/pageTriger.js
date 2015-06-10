/* =============================================
 * v20150113
 * =============================================
 * Copyright Napster
 *
 * 老虎机
 * ============================================= */

apiready = function() {


  var tArr = [0,0,0,0], tObj = {}, isBegin = false;

  var zhanqi = api.require('zhanqiMD');

  var oPageConfig = {
    '1009' : '活动暂停！',
    '1010' : '活动结束！',
    '1005' : '您暂时没有抽奖机会！',
    '1008' : '您正在抽奖中！',
    '1011' : '抽奖需要绑定手机号',
    '1012' : '当前直播间没有抽奖机会！去其他直播间试试吧',
    '1013' : '抽奖需要订阅主播'
  }

	var oPage = {

		init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      var chance = api.pageParam['roomChance'];
      $('#title').text('还有'+chance+'次机会哦')
    },

    listen : function() {
      var self = this;

      //返回
      $('#back').on('click',  function() {
        if(!isBegin) {
          api.closeFrame();
        }
      });

      //开始游戏
      $('#start').on('click', function() {
        if(isBegin) return;
        self.getResultData();
        // self.initTriger({'unit' : 5678});
      });

    },

    getResultData : function() {
      var self = this,
      roomId = api.pageParam['roomId'];
      
      yp.ajax({
        url: URLConfig('triger',{'roomId' : roomId}),  
        method: 'get',
        dataType: 'json'
      },function(ret,err){
        if(ret['code'] === 0) {
          $('#title').text('正在摇奖...');
          self.initTriger(ret['data']);
        }else{
          if(oPageConfig[ret['code']]) {
            api.alert({'msg' : oPageConfig[ret['code']]})
          }else{
            $('#title').text('摇奖机坏了');
            try{
              zhanqi.initTrigerInfo({});
            }catch(e){}
          }
        }
      });
    },

    initTriger : function(data) {
      var number = data['unit']+'';
      switch(number.length) {
        case 1:
          tArr[3] = number;
          break;
        case 2:
          tArr[3] = number.split('')[1];
          tArr[2] = number.split('')[0];
          break;
        case 3:
          tArr[3] = number.split('')[2];
          tArr[2] = number.split('')[1];
          tArr[1] = number.split('')[0];
          break;
        case 4:
          tArr[3] = number.split('')[3];
          tArr[2] = number.split('')[2];
          tArr[1] = number.split('')[1];
          tArr[0] = number.split('')[0];
          break;
      }

      var u = 62;

      if(isBegin) return false;
        isBegin = true;
        $(".num").css('backgroundPositionY',0);
        var num_arr = tArr.reverse();
        var doms = Array.prototype.slice.call($(".num")).reverse();
        $(doms).each(function(index){
          var _num = $(this);
          setTimeout(function(){
            _num.animate({ 
              backgroundPositionY: (u*60) - (u*num_arr[index])
            },{
              duration: 6000+index*3000,
              easing: "easeInOutCirc",
              complete: function(){
                if(index==3) {
                 isBegin = false;
                 $('#title').text('恭喜你，获得'+number+'金币！');
                  try{
                    zhanqi.initTrigerInfo({});
                  }catch(e){}
                }
              }
            });
          }, index * 300);
        });

    }

	}

  oPage.init();
}
