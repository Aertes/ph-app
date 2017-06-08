var pagebase = '';
var itemId = "";
var skuId = "";
var inventory = 0;
var lifecycle = 0;
var thumbnailConfig = "";
var extentionCode = "";
var isRealTime = false;
var loginStatus = false;
var countNum = 0;
var isHtml5 = false;
var isAddingBuyerCart = false;
var isbuyNow = true;
var buyNowrepeat = false;
var addtocartrepeat = false;
var maxnumber = 5;
var getItemImageUrl = pagebase + "";
var getSkuInventoryUrl = pagebase + "";
var addFavoritesUrl = pagebase + "";
var delFavoritesUrl = pagebase + "";
var addShoppingCartUrl = pagebase + "";
var getCartCountUrl = pagebase + "";
var getItemRateUrl = pagebase + "";
var addItemReviewUrl = pagebase + "";
var saveMemberCommentUrl = pagebase + "";
var checkItemCompletedBuy = pagebase + "";
var findItemAvgReviewUrl = pagebase + "";
var getItemPromotionUrl = pagebase + "";
var getItemDetailImgUrl = pagebase + "";
var getCurmUrl = pagebase + "";
var getRecItemUrl = pagebase + "";
var getItemDetailUrl = pagebase + "";
var addBatchShoppingCartUrl = pagebase + "";
var buyNowUrl = pagebase + "";
var arrivalNoticeUrl = pagebase + "";
var commonLoginUrl = pagebase + "";
// 滑动事件
$(window).ready(function() {
    $("#carousel").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 60,
        itemMargin: 5,
        asNavFor: "#slider"
    });
    $("#slider").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#carousel"
    })
});

$(function() {
    scrollWidthCtr();
    checkloginstatus();
    pdpCollect();
    numControl();
    changesharecss();
    $(".e-pdp-buynow-btn").click(function() {
        if (loginStatus) {
            if (buyNowrepeat == false) {
                var b = $("#buynumberspan").text();
                var a = getItemInventory();
                if (b == "") {
                    b = $("#buynumberli").text()
                }
                if (parseInt(b) <= a) {
                    ajaxbuynow(b)
                } else {
                    comHintPop("该商品库存不足！", null, false)
                }
            }
        } else {
            comHintPop("您尚未登录，是否登录以购买商品？", function() {
                window.location.href = commonLoginUrl
            }, true)
        }
    });
    $(".e-pdp-addcart-btn").click(function() {
        if (loginStatus) {
            if (addtocartrepeat == false) { 
                var b = $("#buynumberspan").text();
                var a = getItemInventory();
                if (b == "") {
                    b = $("#buynumberli").text()
                }
                if (parseInt(b) <= a) {
                    ajaxaddtocart(b)
                } else {
                    comHintPop("该商品库存不足！", null, false)
                }
            }
        } else {
            comHintPop("您尚未登录，是否登录以购买商品？", function() {
                window.location.href = commonLoginUrl
            }, true)
        }
    });
    $(".ui-pdp-share li").click(function() {
        var b = {
            "1": "sina_weibo",
            "2": "renren",
            "3": "qq_weibo",
            "4": "kaixin"
        };
        $("div.ui-pdp-share p.e-btn-pop-cancel").click();
        var a = $(".ui-pdp-share li").index($(this));
        $("div.jiathis_style_32x32 a").eq(a).click();
        var c = $(this).attr("platform");
        shareSocialOmi(b[c + ""])
    });
    $(".e-pdp-arrival-notice").click(function() {
        if (loginStatus) {
            arrivalnotice()
        } else {
            comHintPop("您尚未登陆，是否要进入登陆界面？", function() {
                window.location.href = commonLoginUrl
            }, true)
        }
    })
});
// 分享
function shareSocialOmi(b) {
    var a = {
        name: "share",
        servicename: b
    };
    trackConversionOmi(a)
}
// 分享跳转
function trackConversionOmi(a) {
    if (isUseful()) {
        philips.analytics.trackConversion(a)
    }
}
// 收藏
function pdpCollect() {
    $(".e-pdp-collect").click(function() {
        if (null == $("#fmid").val() || "" == $.trim($("#fmid").val())) {
            comHintPop("您尚未登录，是否要进入登陆界面？", function() {
                window.location.href = commonLoginUrl
            }, true);
            return
        }
        $(this).parent().addClass("disabled");
        if (!$(this).children().hasClass("active")) {
            var e = ajaxaddCollection();
            if (e) {
                $(this).children().addClass("active");
                $(".e-pdp-collect-hint-pop").find("p.text").text("加入收藏成功");
                var d = $(window).height();
                var c = $(document).scrollTop();
                var a = $(".e-pdp-collect-hint-pop").outerHeight();
                var b = (d - a) / 2 + c;
                $(".e-pdp-collect-hint-pop").css({
                    top: b + "px"
                }).fadeIn(500).delay(1500).fadeOut("fast")
            }
        } else {
            var e = ajaxdelCollection();
            if (e) {
                $(this).children().removeClass("active");
                $(".e-pdp-collect-hint-pop").find("p.text").text("取消收藏成功");
                $(".e-pdp-collect-hint-pop").fadeIn(500).delay(1500).fadeOut("fast")
            }
        }
        setTimeout(function() {
            $(".e-pdp-collect").parent().removeClass("disabled")
        }, 2300)
    })
}
// 添加收藏请求
function ajaxaddCollection() {
    var b = false;
    itemId = $("#itemId").val();
    var a = {
        itemId: itemId
    };
    $.ajax({
        url: addFavoritesUrl,
        type: "post",
        async: false,
        data: a,
        dataType: "json",
        success: function(c) {
            if (c.isSuccess) {
                b = true
            }
        }
    });
    addToWishListOmi($("#itemCode").val());
    return b
}
// 取消收藏请求
function ajaxdelCollection() {
    var b = false;
    itemId = $("#itemId").val();
    var a = {
        itemId: itemId,
        currPage: 1
    };
    $.ajax({
        url: delFavoritesUrl,
        type: "post",
        async: false,
        data: a,
        dataType: "json",
        success: function(c) {
            if (c.isSuccess) {
                b = true
            }
        }
    });
    return b
}
// 数字加减
function numControl() {
    inventory = getItemInventory();
    var a = inventory;
    if (inventory <= 0) {
        $("p.hint").show();
        $("#minus,#add").addClass("disabled");
        $("#libuynow").attr("disabled", "disabled").addClass("gray");
        $("#liaddcart").attr("disabled", "disabled").addClass("gray");
        return
    } else {
        if (inventory <= 4) {
            $("p.hinttem").text("(库存" + inventory + "件)").show()
        } else {
            $("p.hinttem").hide()
        }
    }
    $(".e-qty-itemnum").each(function() {
        var e = $(this).find("ul li").eq(2)
          , d = $(this).find("ul li").eq(0)
          , b = $(this).find("ul li").eq(1)
          , c = 1;
        e.on("click", function() {
            c++;
            if (c > a) {
                c = a;
                $(this).addClass("disabled");
                $(this).parent().siblings("p.hint").show();
                $(this).parents().siblings("p.notice").show()
            } else {
                d.removeClass("disabled");
                $(this).parent().siblings("p.hint").hide()
            }
            b.text(c)
        });
        d.on("click", function() {
            c--;
            if (c <= 1 && c < a) {
                c = 1;
                $(this).addClass("disabled");
                $(this).parent().siblings("p.hint").hide()
            } else {
                e.removeClass("disabled");
                $(this).parent().siblings("p.hint").hide()
            }
            $(".e-pdp-arrival-notice").hide();
            b.text(c)
        })
    })
}

// 获取项目库存
function getItemInventory() {
    itemId = $("#itemId").val();
    var a = {
        itemId: itemId
    };
    $.ajax({
        url: getSkuInventoryUrl,
        type: "post",
        async: false,
        data: a,
        dataType: "json",
        success: function(b) {
            if (b != null) {
                inventory = b.availableQty;
                skuId = b.id;
                extentionCode = b.extentionCode
            }
        }
    });
    if (inventory > 0) {
        $(".e-pdp-arrival-notice").hide()
    }
    return inventory
}
// 检查登录状态
function checkloginstatus() {
    if (null != $("#fmid").val() && "" != $.trim($("#fmid").val())) {
        loginStatus = true
    }
}
// 立即购买
function ajaxbuynow(b) {
    buyNowrepeat = true;
    var a = {
        skuId: skuId,
        extentionCode: extentionCode,
        count: b
    };
    $("#msg").unbind();
    $("#msg").ajaxError(function(e, d, c) {
        buyNowrepeat = false;
        comHintPop("网络异常！", null, false)
    });
    $.ajax({
        url: buyNowUrl,
        type: "post",
        async: false,
        data: a,
        dataType: "json",
        success: function(c) {
            if (c.resultCode == 1) {
                window.location.href = pagebase + "/shopping/checkout?isBuyNow=true&targetUrl=" + encodeURIComponent(location.href)
            } else {
                if (c.resultCode == 0) {
                    comHintPop("立即购买失败！", null, false)
                } else {
                    if (c.resultCode == 10) {
                        comHintPop("该商品已下架！", null, false)
                    } else {
                        if (c.resultCode == 11) {
                            comHintPop("该商品购买数量已达到限购的最大数量！", null, false)
                        } else {
                            if (c.resultCode == 12) {
                                comHintPop("购买的商品数量大于库存数量！", null, false)
                            } else {
                                if (c.resultCode == 13) {
                                    comHintPop("商品还未上架！", null, false)
                                } else {
                                    if (c.resultCode == 14) {
                                        comHintPop("订单或购物车的商品包含已暂停销售的尺寸或颜色！", null, false)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            buyNowrepeat = false
        }
    })
}

// 添加到购物车
function ajaxaddtocart(b) {
    addtocartrepeat = true;
    var a = {
        itemId: itemId,
        quantity: b
    };
    $("#msg").unbind();
    $("#msg").ajaxError(function(e, d, c) {
        addtocartrepeat = false;
        comHintPop("网络异常！", null, false)
    });
    $.ajax({
        url: addShoppingCartUrl,
        type: "post",
        async: false,
        data: a,
        dataType: "json",
        success: function(c) {
            if (c.resultCode == 1) {
                comHintPop("加入购物车成功！", null, false);
                updateHeaderCount()
            } else {
                if (c.resultCode == 0) {
                    comHintPop("加入购物车失败！", null, false)
                } else {
                    if (c.resultCode == 10) {
                        comHintPop("该商品已下架！", null, false)
                    } else {
                        if (c.resultCode == 11) {
                            comHintPop("该商品购买数量已达到限购的最大数量！", null, false)
                        } else {
                            if (c.resultCode == 12) {
                                comHintPop("该商品加入购物车后数量大于库存数量！", null, false)
                            } else {
                                if (c.resultCode == 13) {
                                    comHintPop("商品还未上架！", null, false)
                                } else {
                                    if (c.resultCode == 14) {
                                        comHintPop("订单或购物车的商品包含已暂停销售的尺寸或颜色！", null, false)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            addtocartrepeat = false
        }
    });
    addToCartOmi($("#itemCode").val())
}

function isUseful() {
    return typeof philips != "undefined" && typeof philips.analytics != "undefined"
}
// 到货通知
function arrivalnotice() {
    comHintPop($("#arrivalConfirmdialog").html(), function() {
        var a = $("#arrial_email").val();
        var c = $("#arrial_code").val();
        if (null == a || "" == $.trim(a)) {
            $("h3.errorinfo").text("您填写的提醒邮箱不能为空！").show();
            return false
        } else {
            if (!checkEmail(a)) {
                $("h3.errorinfo").text("您填写的邮箱格式不正确！").show();
                return false
            } else {
                if (null == c || "" == $.trim(c)) {
                    $("h3.errorinfo").text("商品已下架！").show();
                    return false
                }
            }
        }
        var b = {
            code: $.trim(c),
            email: $.trim(a),
        };
        $.ajax({
            url: arrivalNoticeUrl,
            type: "post",
            async: false,
            data: b,
            dataType: "json",
            success: function(d) {
                status = true;
                if (d.resultCode == 1) {
                    comHintPopagain("您已成功订阅到货通知！")
                } else {
                    comHintPopagain(d.resultReason + "")
                }
            }
        })
    }, true)
}

function changesharecss() {
    setTimeout(timeoutchange, 100)
}
// 分享弹窗
function timeoutchange() {
    $("div.in-share-cp").css({
        width: "83%"
    })
};
