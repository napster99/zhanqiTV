/* =============================================
 * v20141024.1
 * =============================================
 * Copyright Napster
 *
 * 分享
 * ============================================= */

apiready = function() {
  var sinaWeiBo = api.require('sinaWeiBo');
  var qqObj = api.require('qq');
  var weiXin = api.require('weiXin');
	var ui = {
		$shareList : $('#shareList')
	}

	var oPage = {

		init : function() {
      this.view();
      this.listen();
		},

		view : function() {
      weiXin.registerApp(
        function(ret,err){
          if (!ret.status) {
            api.alert({msg:err.msg});
          }
        }
      );
      
      if(api.systemType === 'ios') {
        $('li[name=qq]').removeClass('hidden');
        $('li[name=weixin]').removeClass('hidden');
      }
      
		},

		listen : function() {
			var self = this;
			ui.$shareList.on('click', 'li', function() {
        var name = $(this).attr('name');
        self.shareIt(name);
			});
		},


		shareIt : function(name) {
      var domain =  api.pageParam['domain']
        , title =  api.pageParam['title']
        , imgUrl =  api.pageParam['imgUrl']
      var url = 'http://www.zhanqi.tv/' + domain;
      var user = $api.getStorage('user');
      if(user && user['uid']) {
        url = 'http://www.zhanqi.tv/' + domain + '?_p=' + user['uid'];
      }
      switch(name) {
        case 'qq':
          var isQQAuth = $api.getStorage('qq');
          if(isQQAuth == 'not' || !isQQAuth) {
            qqObj.login(function(ret,err){
                $api.setStorage('qq', 'ok');
                qqObj.shareNews({
                     url:url
                    ,title:'我正在#战旗TV#观看大神'+domain+'的现场直播：'
                    ,description:'【'+title+'】，精彩炫酷，大家速速来围观！'
                    ,imgUrl:imgUrl
                }, function(ret, err) {
                  if(ret.status) {
                    api.alert({'msg' : '分享成功'});
                  }else{
                    api.alert({'msg' : err.msg});
                  }
                });
            });
            return;
          }
          
          qqObj.shareNews({
               url:url
              ,title:'我正在#战旗TV#观看大神'+domain+'的现场直播：'
              ,description:'【'+title+'】，精彩炫酷，大家速速来围观！'
              ,imgUrl:imgUrl
          }, function(ret, err) {
            if(ret.status) {
              api.alert({'msg' : '分享成功'});
            }else{
              api.alert({'msg' : err.msg});
            }
          });
          break;
        case 'sina':
          var isWeiBoAuth = $api.getStorage('weibo');
          if(isWeiBoAuth == 'not' || !isWeiBoAuth) {
             sinaWeiBo.auth({
                redirectUrl: 'http://www.zhanqi.tv'
            },function(ret,err){
              if (ret.status) {
                $api.setStorage('weibo', 'ok');
                sinaWeiBo.sendRequest({
                    contentType: 'text',
                    text: '我正在#战旗TV#观看大神'+domain+'的现场直播：【'+title+'】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）',
                    imageUrl: imgUrl,
                    media : {
                      webpageUrl : url
                    }
                },function(ret,err){});
              }else{
                api.alert({msg:'授权失败'+err.msg});
                $api.setStorage('weibo', 'not');
              }
            });
            return;
          }
          sinaWeiBo.sendRequest({
              contentType: 'text',
              text: '我正在#战旗TV#观看大神'+domain+'的现场直播：【'+title+'】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）',
              imageUrl: imgUrl,
              media : {
                webpageUrl : url
              }
          },function(ret,err){});
          break;
        case 'weixin':
          weiXin.sendRequest({
              scene:'timeline',
              contentType:'web_page',
              title:'我正在#战旗TV#观看大神'+domain+'的现场直播：',
              description:'【'+title+'】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）',
              thumbUrl:imgUrl,
              contentUrl: url
          },function(ret,err){});
          break;

      }
		}


	}


	oPage.init();



}


// 我正在#战旗TV#观看大神CaoMei的现场直播：【早上刀架在脖子也起不来，2点起来直播 -。-】，精彩炫酷，大家速速来围观！

// 新浪文案
// 我正在#战旗TV#观看大神CaoMei的现场直播：【早上刀架在脖子也起不来，2点起来直播 -。-】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）


