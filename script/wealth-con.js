/* =============================================
 * 20150128
 * =============================================
 * Copyright Napster
 *
 * 我的钱包：充值记录和送礼记录
 * ============================================= */
// 参数配置
var oPageConfig = {
  pageSize: 30
, stime: ''
, etime: ''
, stype: 'charge'
, isEnding: false
, isNull: false
, isAjax: false
, start: 0
};
// 初始化
function fInitInfo() {
  var oRecord = $api.getStorage('oRecord');
  var stype = '';
  if(oRecord) {
    for(var i in oRecord) {
      if(oRecord[i].status) {
        stype = i;
      }
    }
  }
  oPageConfig.stype = stype;
  objTime1 = getMonthArgs('curMonth');
  objTime2 = getMonthArgs('prevMonth');
  oPageConfig.etime = objTime1['etime'];
  oPageConfig.stime = objTime2['stime'];
  oPageConfig.start = 0;
  oPageConfig.isEnding = false;
  oPageConfig.isNull = false;
  oPageConfig.isAjax = false;
  $(window).scrollTop(0);
  $('#content').empty();
  fLoadData();
}
// 加载数据
function fLoadData() {
  if(oPageConfig.isEnding || oPageConfig.isAjax){
    return;
  }
  oPageConfig.isAjax = true;
  fGetDataIndex(URLConfig(oPageConfig.stype, {
      stime: oPageConfig.stime
    , etime: oPageConfig.etime
    , nums: oPageConfig.pageSize
    , start: oPageConfig.start
  }), function(data) {
      if(data['cnt'] == 0) {
        oPageConfig.isNull = true;
      }
      if(oPageConfig.start == 0) {
        $('#content').empty();
      }
      fRenderGameData(data['logs']);
      oPageConfig.start += data['logs'].length;
      if(data['cnt'] <= oPageConfig.start) {
        oPageConfig.isEnding = true;
      }
    });
}
// ajax
function fGetDataIndex(url, callback) {
  yp.ajax({
    url : url,
    method : 'get',
    dataType : 'json'
  }, function(ret, err) {
    oPageConfig.isAjax = false;
    if(ret) {
      if(ret['code'] == 0) {
        callback(ret['data']);
      } else{
        api.alert({msg : ret['message']});
      }
    }
  });
  api.refreshHeaderLoadDone();
}
// 渲染数据
function fRenderGameData(data) {
  var htmlStr = '';
  var scontinuehtml = '';
  if(oPageConfig.isNull) {
    htmlStr = '<div class="record-no">暂无记录</div>';
  } else{
    var odata = fHashData(data);
    for(var d in odata) {
      if(odata[d].bcontinue) {
        for(var i = 0, l = odata[d]['list'].length; i < l; i++) {
          var order = odata[d]['list'][i];
          if(oPageConfig.stype == 'charge') {
            var status = '';
            switch(order['status']){
              case -1:
                status = '<p class="error">查询失败</p>'
                break;
              case 0:
                status = '<p class="error">充值失败</p>';
                break;
              case 1:
                status = '<p class="error">发货失败</p>'
                break;
              case 2:
                status = '<p>充值成功</p>'
                break;
            }
            scontinuehtml += '<li>'+
                          '<div class="state">'+
                            '<p class="error">' + status + '</p>'+
                            '<p>' + fGetTimeFormat(order['dateline']) + '</p>'+
                          '</div>'+
                          '<p class="count">充值<span class="money">' + order['totalFee'] + '</span>元--'+ order['payFrom'] +'</p>'+
                          '<p class="mark">' + order['orderId'] + '</p>'+
                        '</li>';
          } else{
            scontinuehtml += '<li>'+
              '<p class="count">'+ order['name'] +'*<span class="money">' + order['count'] + '</span></p>'+
              '<p class="mark"><span class="time">' + fGetTimeFormat(order['dateline']) + '</span>送给' + order['nickname'] + '</p>'+
            '</li>';
          }
        }
      } else{
        htmlStr += '<div class="group"><div class="til">' + d + '</div><ul class="record-list">';
        for(var i = 0, l = odata[d]['list'].length; i < l; i++) {
          var order = odata[d]['list'][i];
          if(oPageConfig.stype == 'charge') {
            var status = '';
            switch(order['status']){
              case -1:
                status = '<p class="error">查询失败</p>'
                break;
              case 0:
                status = '<p class="error">充值失败</p>';
                break;
              case 1:
                status = '<p class="error">发货失败</p>'
                break;
              case 2:
                status = '<p>充值成功</p>'
                break;
            }
            htmlStr += '<li>'+
                          '<div class="state">'+
                            '<p class="error">' + status + '</p>'+
                            '<p>' + fGetTimeFormat(order['dateline']) + '</p>'+
                          '</div>'+
                          '<p class="count">充值<span class="money">' + order['totalFee'] + '</span>元--'+ order['payFrom'] +'</p>'+
                          '<p class="mark">' + order['orderId'] + '</p>'+
                        '</li>';
          } else{
            htmlStr += '<li>'+
              '<p class="count">'+ order['name'] +'*<span class="money">' + order['count'] + '</span></p>'+
              '<p class="mark"><span class="time">' + fGetTimeFormat(order['dateline']) + '</span>送给' + order['nickname'] + '</p>'+
            '</li>';
          }
        }
        htmlStr += '</ul></div>';
      }
    }
  }
  $('#content .group:last-child').find('ul').append(scontinuehtml);
  $('#content').append(htmlStr);
}
// hash
function fHashData(data) {
  var odata = {};
  var $lastGroup = $('#content .group:last-child').find('.til');
  for(var i = 0, l = data.length; i < l; i++) {
    var one = data[i];
    var s = fGetYMDFormat(one['dateline']);
    if(odata[s]) {
      odata[s]['list'].push(one);
    } else{
      odata[s] = {
        list: [one]
      };
    }
    if(fTrimStr(s) == fTrimStr($lastGroup.text())) {
      // 跟页面列表的最后一个时间相同
      odata[s]['bcontinue'] = true;
    } else{
      odata[s]['bcontinue'] = false;
    }
  }
  return odata;
}
// 去除空格
function fTrimStr(cont){
  if (cont == null) {
    return cont;
  }
  return cont = cont.replace(/^\s+|\s+$/g,"");
}
// 获取时间，格式：小时:分钟
function fGetTimeFormat(time) {
  return time.slice(11, 16);
}
// 获取时间，格式：年-月-日
function fGetYMDFormat(time) {
  return time.slice(0, 10);   
}
function getMonthArgs(whichMonth) {
  var stime = '', etime = '';
  var date = new Date();
  if(whichMonth === 'curMonth') {
    stime = date.getOtherDate(-date.getDate() + 1)
    etime = date.Format('yyyy-MM-dd');
  }else{
    stime = date.getOtherDate(-date.getDate()).substring(0,7)+'-01';
    etime = date.getOtherDate(-date.getDate())
  }
  return {stime : stime, etime : etime};
}

apiready = function() {

  if($api.getStorage('user')) {
    oPageConfig.username = $api.getStorage('user').nickname;
  }

  api.setRefreshHeaderInfo({
    visible: true,
    loadingImgae: 'widget://image/refresh-white.png',
    bgColor: '#f6f7f8',
    textColor: '#000',
    textDown: '下拉试试...',
    textUp: '松开试试...',
    showTime: true
  }, function(ret, err){
    objTime1 = getMonthArgs('curMonth');
    objTime2 = getMonthArgs('prevMonth');
    oPageConfig.etime = objTime1['etime'];
    oPageConfig.stime = objTime2['stime'];
    oPageConfig.start = 0;
    oPageConfig.isEnding = false;
    oPageConfig.isNull = false;
    fLoadData();
  });

  fInitInfo();

  // $(window).scroll(function(){  
  //   // 当滚动到最底部以上100像素时， 加载新内容  
  //   if ($(document).height() - $(this).scrollTop() - $(this).height()<100){
  //     fLoadData();
  //   }
  // });

  api.addEventListener({
    name: 'scrolltobottom'
  }, function(ret, err){
    fLoadData();
  });
}

Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.getOtherDate = function(n) {
  var nn = new Date();  
  nn.setDate(nn.getDate()+n);  
  year1 = nn.getFullYear();  
  mon1 = nn.getMonth() + 1;  
  date1 = nn.getDate();  
  var monstr1;  
  var datestr1  
  if (mon1 < 10)  
    monstr1 = "0" + mon1;  
  else  
    monstr1 = "" + mon1;  

  if (date1 < 10)  
    datestr1 = "0" + date1;  
  else  
    datestr1 = "" + date1;  
  return year1 + "-" + monstr1 + "-" + datestr1;
}

Date.prototype.getDays = function() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  if(m == 2){
    return y % 4 == 0 ? 29 : 28;
  }else if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
   return 31;
  }else{
    return 30;
  }
}
