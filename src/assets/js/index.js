
var MALE = 0;
var FEMALE = 1;
var expiredays = 7;
var beginPriceCookieKey = "i_s_b";
var endPriceCookieKey = "i_s_e";
var searchCategoryKey = "i_s_c";
var selectminValue;
var selectmaxValue;

$(document).ready(function () {
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
        value_changed_callback: function (c, b, d) {
            selectminValue = (b * 6000 / 5000).toFixed(0);
            selectmaxValue = (d * 6000 / 5000).toFixed(0)
        }
    });
    var a = new Swiper(".swiper-container", {
        centeredSlides: false,
        slidesPerView: "auto",
        initialSlide: 2
    })

    var bc = new Swiper(".e-scroll-ctr", {
        slidesPerView : "auto"
    })

});

$(function () {

    // scrollWidthCtr();
    // 跳转视频
    $("img[myattr='starProduct'],img[myattr='homeVideo']").click(function () {
        var a = $(this).attr("myUrl");
        if (a.toLowerCase().concat("http")) {
            location.href = a
        } else {
            location.href = "http://" + pagebase + a
        }
    });
    // 热门商品价格定位选择
    $("#searchCategoryBtn").on("click", function () {
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
                success: function () {
                    console.log(d);
                    window.location.href = './src/components/category/productList.html';

                }
            })
        }
    })

    // 精品商品的滑动事件
    // horizontalSlidingEvent();

    // _horizontalSlidingEvent();

});

// 水平滑动事件1


function horizontalSlidingEvent() {
    var startX = 0, dx = 0, currentX = 0, maxValue = 200;
    var box = document.querySelector('.e-scroll-ctr-top');
    var ul = box.querySelector('ul');
    var lis = ul.querySelectorAll('li');
    var ulWidth = ul.offsetWidth + maxValue;
    var boxWidth = box.offsetWidth;
    var init = ulWidth - boxWidth;

    //手势滑动
    ul.addEventListener('touchstart', touchstartHandler);
    ul.addEventListener('touchmove', touchmoveHandler);
    ul.addEventListener('touchend', touchendHandler);

    function touchstartHandler(e) {
        startX = e.touches[0].pageX;
        ul.classList.remove('transitionAll');
    }
    function touchmoveHandler(e) {
        dx = e.touches[0].pageX - startX;
        ul.style.webkitTransform = 'translateX(' + (currentX + dx) + 'px)';
    }

    function touchendHandler(e) {
        currentX = currentX + dx;
        if (currentX < -init / 2) {
            currentX = -init / 2;
            ul.classList.add('transitionAll');
            ul.style.webkitTransform = 'translateX(' + currentX + 'px)';
        } else if (currentX > 0) {
            ul.classList.add('transitionAll');
            currentX = 0;
            ul.style.webkitTransform = 'translateX(' + currentX + 'px)';
        }
    }

}
// 水平滑动事件2
function _horizontalSlidingEvent() {
    var startX = 0, dx = 0, currentX = 0, maxValue = 200;
    var box = document.querySelector('.e-scroll-ctr-bottom');
    var ul = box.querySelector('ul');
    var lis = ul.querySelectorAll('li');
    var ulWidth = ul.offsetWidth + maxValue;
    var boxWidth = box.offsetWidth;
    var init = ulWidth - boxWidth;

    //手势滑动
    ul.addEventListener('touchstart', touchstartHandler);
    ul.addEventListener('touchmove', touchmoveHandler);
    ul.addEventListener('touchend', touchendHandler);

    function touchstartHandler(e) {
        startX = e.touches[0].pageX;
        ul.classList.remove('transitionAll');
    }
    function touchmoveHandler(e) {
        dx = e.touches[0].pageX - startX;
        ul.style.webkitTransform = 'translateX(' + (currentX + dx) + 'px)';
    }

    function touchendHandler(e) {
        currentX = currentX + dx;
        if (currentX < -init / 2) {
            currentX = -init / 2;
            console.log(currentX)
            ul.classList.add('transitionAll');
            ul.style.webkitTransform = 'translateX(' + currentX + 'px)';
        } else if (currentX > 0) {
            ul.classList.add('transitionAll');
            currentX = 0;
            ul.style.webkitTransform = 'translateX(' + currentX + 'px)';
        }
    }

}

