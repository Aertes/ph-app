$(document).ready(function() {
    var a = $(window).height();
    $(".e-page").css("min-height", a + "px");
    $(".ui-input").focus(function() {
        $(this).addClass("focus")
    });
    $(".ui-input").blur(function() {
        $(this).removeClass("focus")
    });
    footerQuestionEffect();
    menu();
    headerSearch();
    sltControl();
    RecTab(".e-pdp-recommend div.tab-btn ul li", ".e-pdp-recommend div.tab-con>div");
    RecTab(".e-pdp-details div.tab-btn ul li", ".e-pdp-details div.tab-con>div");
    $(".e-home-type-slt ul li p").click(function() {
        $(this).parent().siblings().children("p").removeClass("active");
        $(this).toggleClass("active")
    });
    SortandFilter();
    Filtercon();
    $(".e-checkout-order-total div.invoice>p").click(function() {
        $(this).siblings("ul").toggle()
    });
    $(".e-register-radio").click(function() {
        $(this).find("i").toggleClass("active")
    });
    comPop(".e-pdp-share", ".e-pdp-share-pop", ".e-pop-close,.e-btn-pop-cancel,.e-pop-mask");
    comPop(".e-trial-rule-btn", ".e-trial-reg-popcon", ".e-pop-close,.e-icon-btn");
    $(".e-personal-sex li").click(function() {
        $(this).addClass("active");
        $(this).siblings().removeClass("active")
    });
    addressCheck();
    accountEff()
});
// 显示隐藏动画效果
function comPop(b, a, c) {
    $(b).click(function(h) {
        var g = $(window).height();
        var f = $(document).scrollTop();
        var d = $(a).outerHeight();
        var e = (g - d) / 2 + f;
        $(a).css({
            top: e + "px"
        }).fadeIn(500);
        $(".e-pop-mask").show()
    });
    $(c).click(function(d) {
        $(a).fadeOut(500);
        $(".e-pop-mask").hide()
    })
}
// 底部事件
function footerQuestionEffect() {
    $(".e-footer-question>h3").click(function() {
        $(this).siblings("ul").slideToggle("fast");
        $(this).children("i").toggleClass("on")
    });
    $(".e-footer-question h4").click(function() {
        $(this).parent().siblings().find("h4").removeClass("active");
        $(this).parent().siblings().find("h4 i").removeClass("on");
        $(this).parent().siblings().find("div.list").slideUp("fast");
        $(this).toggleClass("active");
        $(this).children("i").toggleClass("on");
        $(this).siblings("div.list").slideToggle("fast")
    })
}
// 主导航
function menu() {
    $(".e-menu-btn").click(function() {
        $(this).children("i").toggleClass("active");
        $(".e-menu-con").slideToggle("fast");
        $(".e-png-mask").toggle()
    });
    $(".e-menu-category div.item h3").click(function() {
        $(this).parent().siblings().find("h3").removeClass("active");
        $(this).parent().siblings().find("h3 i").removeClass("on");
        $(this).parent().siblings().find("ul").slideUp("fast");
        $(this).toggleClass("active");
        $(this).children("i").toggleClass("on");
        $(this).siblings("ul").slideToggle("fast")
    })
}
// 头部搜索事件
function headerSearch() {
    $(".e-search-btn").click(function() {
        $(this).parents(".ui-header-nav").hide();
        $(".e-header-search").show()
    });
    $(".e-header-search span.close-btn").click(function() {
        $(".e-header-search").hide();
        $(".ui-header-nav").show()
    })
}
// 收藏或取消事件
function pdpCollect() {
    $(".e-pdp-collect").click(function() {
        $(this).parent().addClass("disabled");
        if (!$(this).children().hasClass("active")) {
            $(this).children().addClass("active");
            $(".e-pdp-collect-hint-pop").find("p.text").text("加入收藏成功");
            var d = $(window).height();
            var c = $(document).scrollTop();
            var a = $(".e-pdp-collect-hint-pop").outerHeight();
            var b = (d - a) / 2 + c;
            $(".e-pdp-collect-hint-pop").css({
                top: b + "px"
            }).fadeIn(500).delay(1500).fadeOut("fast")
        } else {
            $(this).children().removeClass("active");
            $(".e-pdp-collect-hint-pop").find("p.text").text("取消收藏成功");
            $(".e-pdp-collect-hint-pop").fadeIn(500).delay(1500).fadeOut("fast")
        }
        setTimeout(function() {
            $(".e-pdp-collect").parent().removeClass("disabled")
        }, 2300)
    })
}
// table切换添加或移除active类名
function RecTab(e, d) {
    var c = $(e);
    var f = $(d);
    f.hide();
    f.eq(0).show();
    c.eq(0).addClass("active");
    c.on("click", function() {
        c.removeClass("active");
        $(this).addClass("active");
        f.hide();
        f.eq(c.index(this)).show()
    })
}

function sltControl() {
    $(".e-slt-control select").each(function() {
        var a = $(this).find("option:selected").text();
        $(this).siblings("p").text(a)
    });
    $(".e-slt-control select").change(function() {
        var a = $(this).find("option:selected").text();
        $(this).siblings("p").text(a);
        $(this).parent().removeClass("default")
    })
}
//滚动宽度
function scrollWidthCtr(a) {
    $(".e-scroll-ctr").each(function() {
        var c = $(this).find("li").length;
        var b = $(this).find("li").outerWidth();
        $(this).children("ul").width(c * b + "px")
    })
}

// 弹窗（模态框）
function comHintPop(f, d, e, i) {
    var a = $(".e-pop-mask")
      , c = $(".e-com-pop");
    var h = $(window).height();
    var j = $(document).scrollTop();
    var g = c.outerHeight();
    var b = (h - g) / 2 + j;
    c.find(".errorinfo").hide();
    c.css({
        top: b + "px"
    }).fadeIn(100);
    callback = d;
    c.find("p.text").html(f);
    if (i != null) {
        i(c.find("p.text"))
    }
    if (e) {
        c.find("div.ui-btn-row").removeClass("one")
    } else {
        c.find("div.ui-btn-row").addClass("one")
    }
    a.show();
    $(".e-pop-close,.e-pop-mask,.e-btn-pop-cancel").on("click", function() {
        c.fadeOut(100);
        a.hide()
    });
    $(".e-btn-pop-sure").on("click", function(l) {
        if (callback != null) {
            var k = callback();
            if (k != false) {
                c.fadeOut(100);
                a.hide()
            } else {
                c.find(".errorinfo").show()
            }
        } else {
            c.fadeOut(100);
            a.hide()
        }
    })
}
// 排序和过滤
function SortandFilter() {
    $(".e-product-con-btn li").click(function() {
        $(this).toggleClass("active");
        $(this).siblings().removeClass("active");
        var a = $(this).index();
        $(".e-sort-filter-con>div").eq(a).siblings().hide();
        $(".e-sort-filter-con>div").eq(a).slideToggle("fast");
        if ($(this).hasClass("active")) {
            $(".ui-product-bg").show()
        } else {
            $(".ui-product-bg").hide()
        }
    });
    $(".e-product-sort li").click(function() {
        $(this).toggleClass("active");
        $(this).siblings().removeClass("active")
    })
}
// 商品分类选择事件
function Filtercon() {
    $(".e-filter-con-chose li").click(function() {
        $(this).addClass("active");
        $(this).siblings().removeClass("active")
    });
    $(".e-filter-con-btn li").click(function() {
        $(this).toggleClass("active");
        $(this).siblings().removeClass("active");
        if ($(this).hasClass("active")) {
            $(this).parent().addClass("border-bottom");
            $(this).parent().parent().addClass("border");
            $(".ui-product-bg").show()
        } else {
            $(this).parent().removeClass("border-bottom");
            $(this).parent().parent().removeClass("border");
            $(".ui-product-bg").hide()
        }
        var d = $(this).index();
        $(".e-filter-chose-all>div").eq(d).siblings().hide();
        $(".e-filter-chose-all>div").eq(d).slideToggle("fast")
    });
    var c = $(".e-filter-con-btn li").length;
    console.log(c)
    var b = $(".e-filter-con-btn li").outerWidth();
    var a = c * (b + 1);
    console.log(a)
    
    $(".e-filter-con-btn ul").css({
        width: a + "px"
    });
    $(".e-filter-con-btn").addClass("scroll")
}
// 地址选择
function addressCheck() {
    $(".e-address-list li .e-address-checked").click(function() {
        $(this).addClass("active");
        $(this).find("span").text("默认地址");
        $(this).parents("li").siblings().find(".e-address-checked").removeClass("active");
        $(this).parents("li").siblings().find(".e-address-checked span").text("设为默认地址")
    })
}
// 用户中心事件
function accountEff() {
    $(".e-my-account-list li h4").click(function() {
        $(this).toggleClass("active");
        $(this).next("div").slideToggle("fast");
        $(this).parent().siblings().find("h4").removeClass("active");
        $(this).parent().siblings().find("div").slideUp("fast")
    })
};
