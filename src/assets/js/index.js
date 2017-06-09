
var MALE = 0;
var FEMALE = 1;
var expiredays = 7;
var beginPriceCookieKey = "i_s_b";
var endPriceCookieKey = "i_s_e";
var searchCategoryKey = "i_s_c";
var selectminValue;
var selectmaxValue;

$(document).ready(function() {
    $(".e-home-slider").flexslider({
        animation: "slide",
        slideshow: true,
        slideToStart: 0,
        animationLoop: true,
        directionNav: false,
    });
    $(".nstSlider").nstSlider({
        left_grip_selector: ".leftGrip",
        right_grip_selector: ".rightGrip",
        value_bar_selector: ".bar",
        value_changed_callback: function(c, b, d) {
            selectminValue = (b * 6000 / 5000).toFixed(0);
            selectmaxValue = (d * 6000 / 5000).toFixed(0)
        }
    });
    var a = new Swiper(".swiper-container",{
        centeredSlides: false,
        slidesPerView: "auto",
        initialSlide: 2
    })
});

$(function() {

    scrollWidthCtr();
    // 跳转视频
    $("img[myattr='starProduct'],img[myattr='homeVideo']").click(function() {
        var a = $(this).attr("myUrl");
        if (a.toLowerCase().concat("http")) {
            location.href = a
        } else {
            location.href = "http://" + pagebase + a
        }
    });
    // 热门商品价格定位选择
    $("#searchCategoryBtn").on("click", function() {
        var b = $("p[cCode].active").attr("cCode");
        var c = selectminValue + "";
        var e = selectmaxValue + "";
        if (isNotNullOrEmpty(b) && (isNotNullOrEmpty(c) || isNotNullOrEmpty(e))) {
            if (isNotNullOrEmpty(c) && isNotNullOrEmpty(e)) {
                c = parseFloat(c);
                e = parseFloat(e);
                if (e < c) {
                    var a = c;
                    c = e;
                    e = a
                }
            }
            console.log(c);
            console.log(e);
            setCookie(beginPriceCookieKey, c, expiredays);
            setCookie(endPriceCookieKey, e, expiredays);
            setCookie(searchCategoryKey, b, expiredays);
            if (!isNotNullOrEmpty(c)) {
                c = ""
            }
            if (!isNotNullOrEmpty(e)) {
                e = ""
            }

            var d = "c=" + b;
            d += "&sp=" + c + "-" + e;
            // 跳到商品列表页
            // window.location.href = searchUrl + d;
            determineButtonOmi(e, b)
            $.ajax({
                type: 'post',
                url: '',
                data: d,
                success:function () {
                    console.log (d);
                    window.location.href = './src/components/category/productList.html';

                }
            })
        }
    })
    
});

