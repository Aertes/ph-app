var pagebase = '';
var dealOrderUrl = pagebase + "";
var historyOrderUrl = pagebase + "";
var orderDetailsUrl = pagebase + "";
var payUrl = pagebase + "";
var beforePaymentCancelOrderUrl = pagebase + "";
var pdpPrefix = pagebase + "";
var isHtml5 = false;
$(document).ready(function() {
    $(".ui-order-no").on("click", "input", function() {
        location.href = "/"
    });
    RecTabType(".e-order-list-btn ul li", ".e-order-list-con>div");
    var b = window.location.pathname;
    var a = b.split("/");
    $(".e-order-list-btn").on("click", "#orderStatus", function(c) {
        var d = $(this).attr("val");
        if (d != 1) {
            location.href = dealOrderUrl + "?ls=" + d
        } else {
            location.href = dealOrderUrl
        }
    });
    $(".ui-order-search").on("click", "#dateSearchButton", function(d) {
        var f = $("#orderStatusSel").val();
        var c = $("#timeType").val();
        location.href = dealOrderUrl + "?ls=" + f + "&tt=" + c
    });
    $(".ui-order-search").on("click", "#keyWordsSearchButton", function(d) {
        var f = $("#orderStatusSel").val();
        var c = $("#keywords").val();
        location.href = dealOrderUrl + "?ls=" + f + "&keywords=" + c
    });
    $(".order-detail-btn").click(function() {
        var c = $(this);
        var d = c.attr("orderCode");
        location.href = orderDetailsUrl + "?orderCode=" + d
    });
    $(".ui-order-detail-btn").on("click", "#toPay", function(f) {
        var c = $(this).attr("orderCode");
        var d = {
            codes: c
        };
        asyncXhr(payUrl, d, {
            type: "POST",
            success: function(g) {
                if (g.showPcNotice) {
                    comHintPop("请到PC端进行支付", null, false);
                    return
                }
                if (g.showWechatNotice) {
                    comHintPop("请到微信端进行支付", null, false);
                    return
                }
                if (g.resultCode == "failure") {
                    comHintPop("付款失败!", null, false)
                } else {
                    if (checkStrIsNotNull(g.url)) {
                        window.location.href = g.url + "?orderCode=" + g.code
                    } else {
                        var e = g.exception.message;
                        comHintPop(e, null, false)
                    }
                }
            }
        })
    })
});
// 切换tab添加类名
function RecTabType(e, d, f) {
    var c = $(e);
    var g = $(d);
    g.hide();
    g.eq(0).show();
    c.eq(parseInt(f)).addClass("active");
    c.on("click", function() {
        c.removeClass("active");
        $(this).addClass("active");
        g.hide();
        g.eq(c.index(this)).show()
    })
}
function checkStrIsNotNull(a) {
    if (a == null || a.length == 0 || a == "") {
        return false
    } else {
        return true
    }
};
