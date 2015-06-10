

  function fInitInfo() {
    var oRecord = $api.getStorage('oRecord');
    if(oRecord) {
      for(var i in oRecord) {
        if(!oRecord[i].status) {
          $('#btn-change').html(oRecord[i].title);
        }
      }
    }
  }
  function fGetOrder(){
    api.execScript({
      name: 'wealth',
      script: 'fInitInfo();'
    });
    api.closeFrame({
      name: 'wealth-top'
    });
  }
  apiready = function() {
    fInitInfo();
    
    // var header = $api.dom('.top-bar');
    // $api.fixIos7Bar(header);

    $('#btn-hide').on('touchstart', function() {
      api.closeFrame({
        name: 'wealth-top'
      });
    });

    $('#btn-change').on('click', function() {
      var oRecord = $api.getStorage('oRecord');
      if(oRecord) {
        for(var i in oRecord) {
          oRecord[i].status = !oRecord[i].status;
        }
        $api.setStorage('oRecord', oRecord)
        fGetOrder();
      }
    });
  };
