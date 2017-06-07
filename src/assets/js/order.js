var pagebase = '';
var searchMemberContactUrl = "";
var saveContactUrl = pagebase + "";
var checkoutUrl = pagebase + "";
var payUrl = pagebase + "";
var createOrderSuccessUrl = pagebase + "";
var refreshDataUrl = pagebase + "";
var validCouponUrl = pagebase + "";
var pdpPrefix = pagebase + "";
var goToCartUrl = pagebase + "";
var xayrepeatstatus = true;
var xayrepeatstatustem = true;
var flag = true;
var couponValdidateFlag = false;
var isKZItem = false;
var isCheckKZItem = false;
var isFirst = true;
var isKZItem_1 = false;
var babyinfoStatus = false;
$(function() {
    refreshData();
    checkoutEffect()
});
function refreshData() {
    var c = {
        coupons: $.trim($("#coupons").val()),
        isBuyNow: $("#isBuyNow").val(),
        contactId: $("#contactId").val()
    };
    var e = asyncXhrPost(refreshDataUrl, c);
    var d = e.description;
    var b = d.itemCategoryMap;
    if (d.isKeZhiItem) {
        $("#kz").show()
    } else {
        $("#kz").hide()
    }
    if (!d.isShowCod || d.isKeZhiItem) {
        $("#cod").hide()
    } else {
        $("#cod").show()
    }
    if (d.hasDistributionMode == false) {
        comHintPop("物流不支持该地区发货，请重新选择地区", null, false)
    }
    var f = "";
    var a = null;
    $("#addressposition").empty();
    $.each(d.contacts, function(h, j) {
        var i = "";
        if (d.contactId == null) {
            if (j.isDefault) {
                i = "active"
            }
        } else {
            if (j.id == d.contactId) {
                i = "active"
            }
        }
        var g = $("#uladdress li").clone();
        g.addClass(i).attr("addressId", j.id);
        g.find("i").addClass(i);
        g.find("#detailaddress").text(j.province + j.city + j.area + j.address);
        g.find("#name_phone").text(j.name + "收  " + j.mobile);
        if (i == "active") {
            a = g;
            $("#contactId").val(j.id)
        } else {
            $("#addressposition").append(g)
        }
    });
    if (a != null) {
        $("#addressposition").prepend(a)
    } else {
        var a = $("#addressposition li").eq(0);
        a.addClass("active");
        a.find("i").addClass("active");
        $("#contactId").val(a.attr("addressid"))
    }
    if (isNotNullOrEmpty(d) && isNotNullOrEmpty(d.contacts)) {
        if (d.contacts.length > 1) {
            $("#addressmore").show()
        } else {
            $("#addressmore").hide()
        }
        addressEffect()
    }
    loadorderinfo(d)
}
function loadorderinfo(d) {
    if (d == null) {
        var a = {
            coupons: $.trim($("#coupons").val()),
            isBuyNow: $("#isBuyNow").val(),
            contactId: $("#contactId").val()
        };
        var e = asyncXhrPost(refreshDataUrl, a);
        d = e.description
    }
    $("#orderposition").empty();
    $.each(d.shoppingCartCommand.shoppingCartLineCommands, function(i, k) {
        if (k.stock == 0 && k.gift || k.captionLine) {
            return true
        }
        var j = processImgUrl(k.itemPic, "130X130") + "?" + version_all;
        var h = 0;
        if (k.salePrice != null) {
            h = k.salePrice
        }
        var g = 0;
        if (k.listPrice != null) {
            g = k.listPrice
        }
        var f = $("#ulorder li").clone();
        f.find("a").attr("href", pdpPrefix + k.productCode);
        f.find("img").attr("src", j);
        f.find("span.name").text(k.itemName);
        f.find("span.totalprice").text(k.subTotalAmt);
        f.find("span.now").text(h);
        f.find("span.used").text(g);
        f.find("span.num").text("X" + k.quantity);
        $("#orderposition").append(f)
    });
    if (isNotNullOrEmpty(d.shoppingCartCommand) && isNotNullOrEmpty(d.shoppingCartCommand.shoppingCartLineCommands) && d.shoppingCartCommand.shoppingCartLineCommands.length > 1) {
        $("#ordermore").show();
        morebuttonclick()
    }
    var c = d.shoppingCartCommand.summaryShopCartList[0];
    var b = c.originShoppingFee - c.offersShipping;
    $("#subtotalCurrentPayAmount").text("￥" + c.subtotalCurrentPayAmount);
    $("#shippingfee").text("￥" + b);
    $("#offersTotal").text("￥" + c.offersTotal);
    $("#realPayAmount").text("￥" + c.realPayAmount)
}
function addressEffect() {
    $(".e-checkout-address>ul>li>div").click(function() {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().siblings().find("i").removeClass("active");
        $(this).parent().addClass("active");
        $(this).children("i").addClass("active");
        $("#contactId").val($(this).parent().attr("addressid"))
    });
    $(".e-checkout-address p.more").click(function() {
        $(this).children("i").toggleClass("active");
        $(this).siblings().children("li").toggleClass("all");
        addressothereffect()
    })
}
function morebuttonclick() {
    $(".e-checkout-orderinfo p.more").unbind("click");
    $(".e-checkout-orderinfo p.more").click(function() {
        $(this).children("i").toggleClass("active");
        $(this).siblings().children("li").toggleClass("all");
        addressothereffect()
    })
}
function addressothereffect() {
    var c = $("#addressposition li").eq(0);
    var d = c.clone(true);
    var a = $("#addressposition li.active");
    var b = c.attr("addressid") == a.attr("addressid");
    if (!b) {
        c.replaceWith(a);
        $("#addressposition").append(d)
    }
}
function checkoutEffect() {
    $(".e-checkout-coupon .ui-input").blur(function() {
        var a = $(this).val();
        if (a == "") {
            $(this).css("background-color", "#e6f0f6")
        } else {
            $(this).css("background-color", "#fff")
        }
    });
    $(".ui-input").focus(function() {
        $(this).css("background-color", "#fff")
    });
    $(".e-com-terms-slt").click(function() {
        $(this).children("i").toggleClass("active");
        if ($(this).children("i").hasClass("active")) {
            $("#receiptTitle").attr("name", "receiptTitle");
            $("#receiptContent").attr("name", "receiptContent")
        } else {
            $("#receiptTitle").attr("name", "");
            $("#receiptContent").attr("name", "")
        }
    });
    $(".e-checkout-payway>ul>li").click(function() {
        $(this).siblings().children("i").removeClass("active");
        $(this).children("i").addClass("active");
        $("#payment").val($(this).attr("myflag"))
    });
    $(".occ-update").click(function() {
        trackAddressEdit();
        if ($("#isBuyNow").val() == "true") {
            location.href = pagebase + "/shopping/checkoutAddress?addressid=" + $(this).parent().attr("addressid") + "&isBuyNow=true"
        } else {
            location.href = pagebase + "/shopping/checkoutAddress?addressid=" + $(this).parent().attr("addressid")
        }
    });
    $("#saveorder").click(function() {
        var d = $("li[addressid]").length;
        var h = $("li[addressid].active").length;
        if (d == 0) {
            comHintPop("请先添加收货地址", null, false);
            return
        }
        if (h == 0) {
            comHintPop("请先选择收货地址", null, false);
            return
        }
        var g = $.trim($("#coupons").val());
        if (g != "" && couponValdidateFlag == false) {
            comHintPop("请先验证优惠券", null, false);
            return
        }
        var b = $.trim($("#letteringcontent").val());
        if (!matchNull(b)) {
            if (checkEnglish(b)) {
                if (b.length > 10) {
                    comHintPop("刻字内容：英文不能超过10个!", null, false);
                    return
                }
            } else {
                if (!CheckChineseFull(b) || !CheckChinese(b)) {
                    comHintPop("刻字内容：只能都是中文或者英文!", null, false);
                    return
                }
                if (CheckChineseFull(b) && CheckChinese(b) && b.length > 5) {
                    comHintPop("刻字内容：汉字不能超过5个!", null, false);
                    return
                }
            }
        }
        var a = $("i.icon-slt-square.active").length;
        if (a == 1) {
            var e = $.trim($("#receiptTitle").val());
            if (e == "") {
                comHintPop("请填写发票抬头", null, false);
                return
            }
        }
        if (flag) {
            flag = false;
            trackCreateOrder();
            var c = pagebase + "/order/createOrder";
            var f = asyncXhrPost(c, $("#orderForm").serialize());
            if (f.isSuccess == true) {
                window.location.href = createOrderSuccessUrl + "?orderCode=" + f.description
            } else {
                comHintPop(f.description, null, false);
                flag = true
            }
        }
    });
    $("#usecouponbtn").click(function() {
        var g = $.trim($("#coupons").val());
        if (g == "") {
            comHintPop("请输入优惠券", null, false);
            $("#coupons").val("");
            return
        } else {
            var h = false;
            if (null != $("#isBuyNow") && undefined != $("#isBuyNow")) {
                isNowBuyVal = $("#isBuyNow").val()
            }
            var d = {
                couponCode: g,
                isNowBuy: isNowBuyVal
            };
            var f = asyncXhrPost(validCouponUrl, d);
            if (f.isSuccess) {
                if (f.description) {
                    $("#couponNo").val(g);
                    $("#isXayCoupon").val("T")
                } else {
                    $("#isXayCoupon").val("F")
                }
                couponValdidateFlag = true;
                comHintPop("该优惠券可以使用", null, false)
            } else {
                if (0 == f.errorCode) {
                    comHintPop("您已经参加过该活动，同一用户只能参与一次 !", null, false);
                    return
                } else {
                    if (1 == f.errorCode) {
                        if (g.substr(0, 2) == "ST" || g.substr(0, 2) == "ST") {
                            comHintPop("[" + f.description + "]优惠券无效或刷头商品不满180，该优惠码使无法使用!", null, false)
                        } else {
                            if (g.substr(0, 2) == "LW" || g.substr(0, 2) == "LW") {
                                comHintPop("[" + f.description + "]优惠券无效或滤网商品不满400，该优惠码使无法使用!", null, false)
                            } else {
                                comHintPop("[" + f.description + "]优惠券无效已过期", null, false)
                            }
                        }
                    } else {
                        if (2 == f.errorCode) {
                            location.href = location.href
                        } else {
                            if (3 == f.errorCode) {
                                comHintPop(f.description + '<br><a href="/avent">【去购买活动商品】</a>', null, false)
                            } else {
                                comHintPop(f.description, null, false)
                            }
                        }
                    }
                }
                $("#coupons").val("")
            }
            loadorderinfo(null);
            var c = $("#vipcouponcodelist").find("option:selected");
            var b = c.val();
            var a = c.attr("mylifecoupontype");
            if (b != "" && b == g && a == "1") {
                $("#couponNo").val(b);
                babyinfoStatus = true
            } else {
                babyinfoStatus = false
            }
            var e = $("#isXayCoupon").val();
            if ((e == "T" && xayrepeatstatustem) || babyinfoStatus) {
                comHintPop($("#babayinfo"), function() {
                    if (xayrepeatstatus) {
                        if (checkxaydata()) {
                            xayrepeatstatus = false;
                            var i = pagebase + "/o/saveAventActivity.json";
                            var j = asyncXhrPost(i, tojsonobj($(".ui-com-pop-con form").serialize()));
                            if (j.isSuccess) {
                                xayrepeatstatustem = false;
                                comHintPopagain("信息已确认，请继续完成兑换操作")
                            } else {
                                comHintPopagain(j.description + "")
                            }
                            return true
                        } else {
                            return false
                        }
                    }
                }, true, function(i) {
                    i.find("li.babyState").click(function() {
                        $(".errorinfo").hide();
                        var j = $(this).attr("attyvalue");
                        $(this).parent().find("li").removeClass("active");
                        $(this).addClass("active");
                        i.find("div.babybirthdy,div.babysex,div.yourduedate").hide();
                        if (j == 1) {
                            i.find("div.babybirthdy,div.babysex").show()
                        } else {
                            if (j == 2) {
                                i.find("div.yourduedate").show()
                            }
                        }
                        i.find("#babyState").val(j)
                    });
                    i.find("li.babysex").click(function() {
                        $(".errorinfo").hide();
                        var j = $(this).attr("attyvalue");
                        $(this).parent().find("li").removeClass("active");
                        $(this).addClass("active");
                        i.find("#babysex").val(j)
                    });
                    timeclick()
                })
            }
        }
    });
    $("#vipcouponcodelist").change(function() {
        $("#coupons").val($("#vipcouponcodelist option:selected").val())
    })
}
function CheckChinese(b) {
    var a = new RegExp("[\\u4E00-\\u9FFF]+","g");
    return a.test(b)
}
function CheckChineseFull(b) {
    for (var a = 0; a < b.length; a++) {
        if (b.charCodeAt(a) <= 255) {
            return false
        }
    }
    return true
}
function checkEnglish(b) {
    var a = /^[A-Za-z]+$/;
    return a.test(b)
}
function tojsonobj(c) {
    c = decodeURIComponent(c);
    var b = new Map();
    var a = c.split("&");
    $.each(a, function(d, f) {
        var e = f.split("=");
        if (e.length == 2) {
            b.put(e[0], e[1])
        }
    });
    return b.container
}
function checkxaydata() {
    var a = true;
    var b = $("#babyState").val();
    if (b == "") {
        $(".errorinfo").text("请先选择匹配项").show();
        return false
    }
    $(".errorinfo").text("").hide();
    if (b == 1) {
        var e = $("#birthday").val();
        if (e == "") {
            $(".errorinfo").text("宝宝生日不能为空").show();
            return false
        }
        var d = $("#babysex").val();
        if (d == "") {
            $(".errorinfo").text("请选择性别").show();
            return false
        }
        $("#dueDate").val("1949/01/01")
    }
    if (b == 2) {
        var c = $("#dueDate").val();
        if (c == "") {
            $(".errorinfo").text("请填写预产期").show();
            return false
        }
        $("#birthday").val("1949/01/01");
        $("#babysex").val("")
    }
    if (b == 3 || b == 0) {
        $("#birthday").val("1949/01/01");
        $("#babysex").val("");
        $("#dueDate").val("1949/01/01")
    }
    return a
}
function timeclick() {
    $("#birthday,#dueDate").mobiscroll().date({
        invalid: {
            daysOfMonth: ["5/1", "12/24", "12/25"]
        },
        theme: "ios",
        lang: "zh",
        display: "bottom",
        mode: "scroller",
        dateOrder: "yymmdd",
        dateFormat: "yy/mm/dd",
    })
}
function trackAddressEdit() {
    if (cancalltrackcode == false) {
        return
    }
    try {
        philips.analytics.trackConversion({
            name: "interaction",
            description: "revise_address:mobile"
        })
    } catch (a) {
        console.log(a)
    }
}
function trackCreateOrder() {
    if (cancalltrackcode == false) {
        return
    }
    try {
        philips.analytics.trackConversion({
            name: "interaction",
            description: "create_order_success:mobile"
        })
    } catch (a) {
        console.log(a)
    }
};







function isUseful() {
    return typeof philips != "undefined" && typeof philips.analytics != "undefined"
}
function carrouselBullet(b) {
    var a = {
        name: "interaction",
        description: "carrousel_bullet_" + b
    };
    trackConversionOmi(a)
}
function userLoginOmi() {
    var a = {
        name: "user_login"
    };
    trackConversionOmi(a)
}
function userRegistrationOmi() {
    var a = {
        name: "user_registration"
    };
    trackConversionOmi(a)
}
function determineButtonOmi(b, c) {
    var a = {
        name: "interaction",
        description: b + ":" + c + ":determine_button"
    };
    trackConversionOmi(a)
}
function navChatOmi() {
    var a = {
        name: "chat"
    };
    trackConversionOmi(a)
}
function sortBtnOmi(b, d, c) {
    var a = {
        name: "interaction",
        description: b + ":" + d + ":" + c + ":ok_button"
    };
    trackConversionOmi(a)
}
function videoStartOmi(c, b) {
    var a = {
        name: "video_start",
        videoname: c,
        url: b
    };
    trackConversionOmi(a)
}
function videoCompletedOmi(c, b) {
    var a = {
        name: "video_end",
        videoname: c,
        url: b
    };
    trackConversionOmi(a)
}
function addToCartOmi(a) {
    var b = {
        events: "scOpen,scAdd",
        products: ";" + a
    };
    var c = $("#cartnumber").html();
    if (undefined == c || null == c || c.length == 0) {
        trackAjaxOmi(b)
    } else {
        if (parseInt(c) > 0) {
            addToExsitsCartOmi(a)
        } else {
            trackAjaxOmi(b)
        }
    }
}
function addToWishListOmi(a) {
    var b = {
        name: "interaction",
        description: a + ":add_to_wishlist_button"
    };
    trackConversionOmi(b)
}
function checkOutOmi() {
    var a = {
        name: "interaction",
        description: "check_out_button"
    };
    trackConversionOmi(a)
}
function addToExsitsCartOmi(a) {
    var b = {
        events: "scAdd",
        products: ";" + a
    };
    trackAjaxOmi(b)
}
function shareSocialOmi(b) {
    var a = {
        name: "share",
        servicename: b
    };
    trackConversionOmi(a)
}
function productTabOmi(b) {
    var a = {
        pagename: s.pageName + "_" + b,
        type: "o"
    };
    trackAjaxOmi(a)
}
function productEvaluatOmi() {
    var a = {
        name: "interaction",
        description: "evaluation_of_commodities_button"
    };
    trackConversionOmi(a)
}
function trackConversion(b) {
    var a = {
        name: "buy_at_philips",
        product: b
    };
    trackConversionOmi(a)
}
function trackConversionOmi(a) {
    if (isUseful()) {
        philips.analytics.trackConversion(a)
    }
}
function trackAjaxOmi(a) {
    if (typeof _page != "undefined" && typeof _page.metrics != "undefined") {
        _page.metrics.trackAjax(a)
    }
}
function initOmi() {
    if (typeof document.getElementsByTagName("video")[0] !== "undefined") {
        _page.metrics.trackHTML5Video()
    }
    var a = $(".flex-control-nav.flex-control-paging").find("a");
    $(a).each(function() {
        $(this).bind("click.omi", function() {
            var b = $(this).html();
            carrouselBullet(b)
        })
    });
    $("#lc5_0link").bind("click.omi", function() {
        navChatOmi()
    });
    $("#pdp-tag-change li").bind("click.omi", function(c) {
        var b = $("#pdp-tag-change li").index($("#pdp-tag-change li.active")[0]);
        if (0 == b) {
            productTabOmi("product_description")
        } else {
            if (1 == b) {
                productTabOmi("faq")
            }
        }
    })
}
function initSocalShare() {
    var a = $("a.in-share-icon1");
    var b = {
        "1": "sina_weibo",
        "2": "renren",
        "3": "qq_weibo",
        "4": "kaixin"
    };
    $(a).bind("click.omi", function() {
        var c = $(this).attr("platform");
        shareSocialOmi(b[c + ""])
    })
}
$(document).ready(function() {
    initOmi();
    setTimeout(initSocalShare, 500)
});
