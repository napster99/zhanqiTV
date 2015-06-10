/* =============================================
 * 20150130
 * =============================================
 * Copyright Napster
 *
 * 充值页面--android frame
 * ============================================= */
apiready = function(){

  var ui = {
      $txt_money: $('#txt-money')
    , $num_gold: $('#num-gold')
    , $num_coin: $('#num-coin')
    , $btn_charge: $('#btn-charge')
  };

  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    gRatio: 100, // 兑换比例 人民币:金币
    cRatio: 100, // 兑换比例 人民币:战旗币
    view : function() {
      fInitInfo();
    },
    listen : function()　{
      var self = this;

      // 输入充值金额
      ui.$txt_money.on('input', function() {
        var $this = $(this);
        if( !/^\d+$/.test($this.val()) && $this.val()) {
          api.alert({msg: '格式不对！'});
          $this.val('');
          return;
        } 
        var money = (self.fTrimStr($this.val())).replace(/(^0*)/g, "");
        ui.$num_gold.text(money * self.gRatio);
        ui.$num_coin.text(money * self.cRatio);
      })
      .on('keydown', function(e) {
        var $this = $(this);
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57)) || ((k >= 96) && (k<=105)) || k == 8 || k == 0 || k == 37 ||k == 39) {
        } else{
          if (window.event) {
            window.event.returnValue = false;
          } else {
            e.preventDefault();
          }
        }
      })
      .on('blur', function() {
        var $this = $(this);

        if( !/^\d+$/.test($this.val()) && $this.val()) {
          api.alert({msg: '格式不对！'});
          $this.val('');
          return;
        } 

        var money = (self.fTrimStr($this.val())).replace(/(^0*)/g, "");

        ui.$num_gold.text(money * self.gRatio);
        ui.$num_coin.text(money * self.cRatio);
      });

      // 确认充值
      ui.$btn_charge.on('click', function() {
        if(!ui.$txt_money.val().length) {
          api.alert({msg: '请输入充值金额！'});
        }
        self.fSubmit();
      });
    },
    fSubmit: function() {
      var self = this;

      // askid  amount payFrom
      var param = {
        askid : new Date().Format('yyyyMMdd') + parseInt(Math.random()*100000),
        amount : parseFloat(ui.$txt_money.val()),
        payFrom : 'android'
      }
      
      zhanqi.getEncrypted(param, function(data) {
        if(typeof data === 'string') {
          data = eval('('+data+')');
        }
        yp.ajax({
            url: URLConfig('payOrder')
          , method: 'post'
          , dataType: 'json'
          , data: {
              values: {'param' : data['data']}
            }
          }, function(ret, err) {
            if(ret) {
              if(ret['code'] == 0) {
                
                // ...生成订单号后 链接支付宝
                var aliPay = api.require('aliPay');
                var subject = '支付宝充值金币(战旗TV)';
                var body = '支付宝充值金币(战旗TV)';
                var amount = ret['data']['totalFee'];
                var tradeNO = ret['data']['orderId'];
                var notifyURL = ret['data']['notifyUrl'];
              
                aliPay.pay({
                    partner: '2088611207156810',
                    seller: '2088611207156810',
                    rsaPriKey: 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOD88g8Bap2NyeZO6Iep9XtqIwOGfb8mYo72F5DmJRtQnwTJcHnxBwjXzix6IickqUf4XmY2lvKutSRQHV0DPqnmCtYkUqnVC+81DFwvPgctEpRJKJePteRfnatlZITx3Y5MjYcw1H5rMjwdmF+cu8maF9NJMJ6g1AbXrnLDr1WNAgMBAAECgYABBCNzveXlYEaRK7oRIsthC1GtKmZW/q1jR+lDVkbEoNCXDPHdGyGVAKSFvud4lcnN8Wk7vPNhlThsOZBoYyNdTumNV/QLz/uF70bbsiNfyJVeCgnhiB3YGT4RKOBIVhygac8hgYGBpqpHaM6Qvja7x0Cx0X3WMNLdpxKAjlVPYQJBAPV158Et+fTzZZaHADPoJdzsjkbkOit/sxamwISW+ao173XQVXJbUElqA3pfQ6JM+T02kMuK5aEpODBQfFVE4NcCQQDqpgHXkCIDQ9o5gsnSoFODC4n7aspd1SQ8tpHYovtfCcLJS5/lYbFxaQWJTIaMLtIavb0j//GCNoDelaKuiBw7AkEA0n1xZ++NUckHbLYILnr9PR5+Q7yjRXoUkXAd15XAM35dAqLNI2u6xbnrkZzv2tY3RY7tTB6oHDPEw2nBtT2DsQJARIHfO85q/8UJq4zR29rPRw1RZcQR/T9Day5qenNrLJ4u7pJTxqa1JcVhxmo/RiJNWV1YIXCSVFARY+sQKiC3DQJAKZa3rKUZ9BxZqFmvNCmGXyNH2WC2/ajwaJsxKsP5+Y2fU8l4Ws+fKDv1M3E+56JxAkBDEJax7qcAwMKalH24hg==',
                    rsaPubKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDg/PIPAWqdjcnmTuiHqfV7aiMDhn2/JmKO9heQ5iUbUJ8EyXB58QcI184seiInJKlH+F5mNpbyrrUkUB1dAz6p5grWJFKp1QvvNQxcLz4HLRKUSSiXj7XkX52rZWSE8d2OTI2HMNR+azI8HZhfnLvJmhfTSTCeoNQG165yw69VjQIDAQAB',
                    subject: subject,
                    body: body,
                    amount: amount,
                    tradeNO: tradeNO,
                    notifyURL: notifyURL
                }, function(ret, err) {

                  // statusCode 9000
                  // code 9000

                  if(ret['code'] == '{9000}' ) { //支付宝通过
                    
                    api.openWin({
                        name: 'recharge-ok'
                      , url: '../html/recharge-ok.html'
                      , delay: 100
                      , pageParam: {
                        'account' : $api.getStorage('account'),
                        'gold' : amount*100,
                        'coin' : amount*100
                      }
                    });
                  }else{
                    api.alert({
                        title: '支付结果',
                        msg: ret.statusMessage,
                        buttons: ['确定']
                    });
                  }
                  // {"statusCode" : "{9000}","msg" : "{}","code" : "{9000}","statusMessage" : "{}"}
                    
                });


              } else{
                api.alert({msg : ret['message']});
              }
            } else{
              api.alert({
                msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
              });
            }
          });
      }) 
      
    },
    // 去除空格
    fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    }
  }
  oPage.init();
}

// 初始化页面数据
function fInitInfo() {
  var money = 1;
  var gRatio = 100; // 兑换比例 人民币:金币
  var cRatio = 100; // 兑换比例 人民币:战旗币
  $("#txt-money").val('1');
  $('#num-gold').text(money * gRatio);
  $('#num-coin').text(money * cRatio);
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
