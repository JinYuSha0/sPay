;(function() {
    // 检查支付状态
    checkstatus();

    // 倒计时
    timer(freeTime/1000);

    // 二维码
    $("#qrcode").qrcode({
        render: "table",
        width: 200,
        height:200,
        text: qrcode,
    });

    // 配置modal框
    var modalHeight = $(window).height() / 2 - 100;
    $(".modal-dialog").css("margin-top", modalHeight);
    $(".modal-dialog .btn").on("click", function() {
        window.location.href = "/";
    });
})()

function timer(intDiff, cb){
    diff();
    var timer = window.setInterval(diff, 1000);

    function diff() {
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值        
        if(intDiff > 0){
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        $('#minute_show').html('<s></s>'+minute+'分');
        $('#second_show').html('<s></s>'+second+'秒');
        intDiff--;

        if (intDiff <= 0) {
            clearInterval(timer);
            cb && cb();
        }
    }
}

function checkstatus() {
    var request = $.ajax({
        type: "GET",
        url: "/api/a/getPayResult?oid=" + oid,
        success: function(data) {
            var code = data.code;
            if (code === 200) {
                $('#modal1').modal({backdrop: 'static', keyboard: false});
            } else {
                $('#modal2').modal({backdrop: 'static', keyboard: false});
            }

            checkstatus.finish = true;
        },
        complete: function(XMLHttpRequest, status) {
        }
    });
    
    setTimeout(function() {
        if (!checkstatus.finish) {
            request.abort();
            checkstatus();
        }
    }, 60*1000)
}
