
var MALE = 0;
var FEMALE = 1;
var expiredays = 7;
var beginPriceCookieKey = "i_s_b";
var endPriceCookieKey = "i_s_e";
var searchCategoryKey = "i_s_c";
var defaultModuleImgSize = "330X330";
var LITTELE_SIZE = "180X180";
var searchUrl = "/search?&";
var searchCateItemUrl = "/searchItem";
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
    $("img[myattr='starProduct'],img[myattr='homeVideo']").click(function() {
        var a = $(this).attr("myUrl");
        if (a.toLowerCase().concat("http")) {
            location.href = a
        } else {
            location.href = "http://" + pagebase + a
        }
    });
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
            window.location.href = searchUrl + d;
            determineButtonOmi(e, b)
        }
    })
    
});

