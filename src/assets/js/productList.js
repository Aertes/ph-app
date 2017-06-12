
var pagebase = '/mobile/src/components/';
var searchUrl = pagebase + "category/productList.html";

var assignUrl = pagebase + "";
var loginUrl = pagebase + "";
var categoryPrefix = "";
var AREA_CONNECTOR = "-";

var SEARCH_JOINNER = "a";
var SEARCH_EQUAL_CHAR = "e";
var VALUE_CONNECTOR = "o";
var SEARCH_ITEM_SELECT_TYPE_SINGLE = 1;
var SEARCH_ITEM_SELECT_TYPE_MULTI = 2;
var IS_SHOW_SEARCH_ITEM_WHEN_NO_COUNT = false;
var QUEERY_STRING_SEARCH = "f";
var QUEERY_STRING_CATEGORY = "c";
var QUEERY_STRING_KEY = "k";
var QUEERY_STRING_SORT = "s";
var QUEERY_STRING_CURPAGE = "p";
var QUEERY_STRING_PRICE_CDT_ID = "priceCdtItemId";
var QUEERY_STRING_SALEPRICE_AREA = "sp";
var QUEERY_STRING_FILTER_KEY = "fk";
var searchItemSelectType = SEARCH_ITEM_SELECT_TYPE_MULTI;

var searchCdt = "";
var searchCategoryId = -1;
var sortTypeId = 0;
var curPage = 1;
var inputErrorMsg = "您输入的搜索条件有误！";
var salePriceItemId = -1;
var inventory = 0;
var searchKey = "";
var salePriceArea = "";
var filterKey = "";
var currentselectdomobj = "";
var refreshstatus = true;


$(function() {
    // 图片lazyload加载
    $("img.lazyimg").lazyload({
        effect: "fadeIn"
    })

    // initSearchValue();
    initsortdata();
    // showCurmbList();
    setscrollrefresh();
    $(".ui-confirm-btn.my-ScreeningConditions").on("click", function() {
        var a = $(this).prev().find("li.active");
        // 若没选择，则关闭        
        if (a.length != 1) {
            closeConditionScreening();
            return
        }
        searchCategoryId = a.find("p").attr("code");
        curPage = 1;
        // var b = getSearchUrl();
        // window.location.href = b
        $.ajax({
            type:'post',
            url:'',
            data: searchCategoryId,
            success:function () {
                console.log(searchCategoryId);
                
                closeConditionScreening();
            }
        })

    });
    $("li[myattr='category']").on("click", function() {
        var a = $(this).parent().find("li.active");
        if (a.length >= 2) {
            a.removeClass("active");
            $(this).addClass("active")
        }
    });
    $(".ui-confirm-btn.my-otherConditions").on("click", function() {
        var b = $(this).prev().find("li.active");
        var c = $(this).attr("searchcondition");
        // 若没选择，则关闭
        if (b.length == 0) {
            closeConditionScreening();
            return
        }

        var a = new Array();
        $.each(b, function(d, e) {
            a[d] = $(e).attr("searchitem")
        });

        // updateParam(c, a);
        // window.location.href = getSearchUrl()
        
        $.ajax({
            type:'post',
            url:'',
            data: a,
            success:function () {
                console.log(a);
                closeConditionScreening();
            }
        })
    });
    $("#submitBtn").on("click", function() {
        var c = $("#salePriceFrom").val();
        var b = $("#salePriceTo").val();
        if (isNaN(c)) {
            $("#salePriceFrom").val(0);
            return
        }
        if (isNaN(b)) {
            $("#salePriceTo").val(0);
            return
        }
        var a = null;
        if (isNotNull(c)) {
            a = c + AREA_CONNECTOR
        }
        if (isNotNull(b)) {
            if (isNotNull(a)) {
                a += b
            } else {
                a = AREA_CONNECTOR + b
            }
        }
        if (isNotNull(a)) {
            salePriceArea = a
            // 价格筛选区域
            $.ajax({
                type:'get',
                url:'',
                data: salePriceArea,
                success:function () { 
                    console.log(salePriceArea);
                },
            })

        } else {
            salePriceArea = null
        }
        
        searchKey = $("#filterKey").val();
        curPage = 1;
        // window.location.href = getSearchUrl();
        // sortBtnOmi("", c + "-" + b, searchUrl)
    })

    horizontalSlidingEvent();
});

// 得到搜索链接
function getSearchUrl() {
    var a = searchUrl + "?";
    if (isNotNull(searchCdt)) {
        a += QUEERY_STRING_SEARCH + "=" + searchCdt
    }
    if (isNotNull(searchCategoryId)) {
        a += "&" + QUEERY_STRING_CATEGORY + "=" + searchCategoryId
    }
    if (isNotNull(searchKey)) {
        a += "&" + QUEERY_STRING_KEY + "=" + searchKey
    }
    if (sortTypeId > -1 && sortTypeId != null) {
        a += "&" + QUEERY_STRING_SORT + "=" + sortTypeId
    }
    if (curPage > 0) {
        a += "&" + QUEERY_STRING_CURPAGE + "=" + curPage
    }
    if (salePriceItemId > -1 && salePriceItemId != null) {
        a += "&" + QUEERY_STRING_PRICE_CDT_ID + "=" + salePriceItemId
    }
    if (isNotNull(salePriceArea)) {
        a += "&" + QUEERY_STRING_SALEPRICE_AREA + "=" + salePriceArea
    }
    if (isNotNull(filterKey)) {
        a += "&" + QUEERY_STRING_FILTER_KEY + "=" + filterKey
    }
    a = a.replace("?&", "?");
    return a
}

// 不为空
function isNotNull(a) {
    if (a != null && a != "" && a.length > 0 && a != "null") {
        return true
    } else {
        return false
    }
}

// 更新参数
function updateParam(j, h) {
    var f = getQueryString(QUEERY_STRING_SEARCH);
    var b = "";
    var e = getConditionJson(f);
    if (undefined != e[j]) {
        if (h.length == 0) {
            delete e[j]
        } else {
            e[j] = h
        }
    } else {
        e[j] = h
    }
    for (var d in e) {
        var g = d;
        var k = e[d];
        var a = "";
        for (var c = 0; c < k.length; c++) {
            a += k[c];
            if (c != k.length - 1) {
                a += VALUE_CONNECTOR
            }
        }
        b += (SEARCH_JOINNER + g + SEARCH_EQUAL_CHAR + a)
    }
    if (b.length > 0) {
        b = b.substring(1, b.length)
    }
    searchCdt = b
}

// 得到查找字符串
function getQueryString(a) {
    var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)","i");
    var c = window.location.search.substr(1).match(b);
    if (c != null) {
        return decodeURI(c[2])
    }
    return null
}
// 获得条件Json
function getConditionJson(f) {
    var c = new Object();
    if (isNotNull(f)) {
        var a = f.split(SEARCH_JOINNER);
        for (var b = 0; b < a.length; b++) {
            var e = a[b].split(SEARCH_EQUAL_CHAR);
            if (e[1] != undefined && e[1] != null) {
                var d = e[1].split(VALUE_CONNECTOR);
                c[e[0]] = d
            }
        }
    }
    return c
}

// 初始化数据排序
function initsortdata() {
    $.each($("#sortSelect option"), function(a, e) {
        var d = $(e).text();
        var c = $(e).val();
        var b = "<li value='" + c + "'>" + d + "</li>";
        $("#sortid").append(b)
    });
    $("#sortid li").click(function() {
        sortTypeId = $(this).val();
        console.log(sortTypeId);
        curPage = 1;
        // window.location.href = getSearchUrl()
        var data = ''
        $.ajax({
            type: 'post',
            url: '',
            data : data,
            success: function(){

            }
        })
    })
}
// 显示Curmb列表
function showCurmbList() {
    var e = "";
    if (curmbListJson != null) {
        for (var c = 0; c < curmbListJson.length; c++) {
            var d = curmbListJson[c];
            var a = curmbListJson[c].name;
            var h = curmbListJson[c].id;
            var f = curmbListJson[c].type;
            var b = d.url;
            var g = "<a href='URLTOREPALCE'>".replace("URLTOREPALCE", b);
            if (c != curmbListJson.length - 1) {
                e += g + a + "</a><span class='arrow-tip'>></span>"
            } else {
                var j = "<a href='URLTOREPALCE' class='selected'>".replace("URLTOREPALCE", b);
                e += j + a + "</a>"
            }
        }
    } else {
        if (null == curmbSearchKey || "null" == curmbSearchKey) {
            curmbSearchKey = ""
        }
        e += "<a class='selected'>搜索结果：" + curmbSearchKey + "</a>"
    }
    e = "<a href='/'>首页 </a>" + e;
    $(".ui-com-sub-nav").append(e)
}

// 设置滚动刷新
function setscrollrefresh() {
    $(window).scroll(function() {
        var b = $(this).scrollTop();
        var a = $(document).height();
        var c = $(this).height();
        if (refreshstatus && (b + c >= (a - $("footer").height() - 20))) {
            refreshstatus = false;
            refreshListData()
        }
    })
}

// 刷新列表数据,添加商品列表
function refreshListData() {
    if (parseInt(curPage) + 1 > 10) {
        return
    }
    // var a = pagebase + "./json.json" + queryString + "&p=" + (parseInt(curPage) + 1);
    $.post('../../assets/js/json.json', function(b) {
        $.each(b.dataCmd.items, function(c, d) {
            $.each(d.itemCmdList, function(e, f) {
                var g = $("#cloneid li").clone();
                console.log(g)
                g.attr("id_page", b.curPage + "");
                g.find("a").attr("href", f.code);
                g.find("img").attr("data-original", formatImage(f.imgList[0], "287X274"));
                g.find("img").attr("src",   "../images/hot4.jpg");
                g.find("p.name").text(f.title);
                g.find(".price-sale").text("市场售价：￥" + f.salePrice.toFixed(2));
                g.find(".price-member").text("会员价：￥" + f.listPrice.toFixed(2));
                g.find("span.now").text("￥" + f.salePrice.toFixed(2));
                $("#position").append(g)
            })
        });
        
        curPage = b.curPage + "";
        //$("#position").append('<li><a href="./productDetails.html"><p class="lazyimg"><img class="lazyimg" src="../../assets/images/list2.jpg"></p><p class="name">飞利浦 电水壶 HD9306/03</p><div class="ui-pdpwall-price-last"><p class="price"><span class="now">￥1999.00</span></p><!--<p class="price-member">会员价：￥149.25</p>--></div></a></li>')
        console.log(curPage);

        setscrollrefresh();
        refreshstatus = true;
        $("li[id_page='" + b.curPage + "'] img.lazyimg").lazyload({
            effect: "fadeIn"
        })
        
    })
}
// 初始化搜索值
function initSearchValue() {
    // var categoryId = '';
    searchCategoryId = getQueryString(QUEERY_STRING_CATEGORY);
    if (searchCategoryId == null) {
        searchCategoryId = categoryId
    }
}
// 初始化已选择条件
function initSelectdCondition() {
    var n = getConditionJson(searchCdt);
    var e = $(".normalSearchLine");
    for (var l in n) {
        var o = l;
        var p = n[l];
        for (var m = 0; m < e.length; m++) {
            var c = e.eq(m);
            if (o == c.attr("searchCondition")) {
                var d = c.children();
                for (var g = 0; g < d.length; g++) {
                    var f = d.eq(g).attr("searchItem");
                    for (var h = 0; h < p.length; h++) {
                        if (f == p[h]) {
                            d.eq(g).addClass("selected")
                        }
                    }
                }
            }
        }
    }
    $("#sortSelect").val(sortTypeId);
    if (isNotNullOrEmpty(sortTypeId)) {
        $($("#sortSelect").children()[0]).remove()
    }
    var b = salePriceItemId;
    var a = $(".salePriceSearchLine");
    for (var m = 0; m < a.length; m++) {
        var c = a.eq(m);
        var d = c.children();
        for (var g = 0; g < d.length; g++) {
            if (b == d.eq(g).attr("searchItem")) {
                d.eq(g).addClass("selected")
            }
        }
    }
}
// 关闭条件筛选
function closeConditionScreening() {
    $("ul.border-bottom li.active").click()
};

// 水平滑动事件
function horizontalSlidingEvent() {
    var startX = 0, dx = 0, currentX = 0, maxValue = 200;
    var box = document.querySelector('.e-filter-con-btn');
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