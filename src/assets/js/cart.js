var pagebase = '';
var getShoppingCartUrl = pagebase;
var addShoppingCartUrl = pagebase;
var updateShoppingCartLineUrl = pagebase;
var getCartCountUrl = pagebase;
var deleteShoppingCartLineUrl = pagebase;
var addFavoritesUrl = pagebase;
var balanceUrl = pagebase;
var recommandUrl = pagebase ;
var pdpPrefix = pagebase;
var calcUrl = pagebase;
var shoppingCartLineIds = "";
var NON_LIMIT_FLAG = 0;
var isAddingBuyerCart = false;
var MIDDLE_IMG_SIZE = "185X185";
var SMALL_IMG_SIZE = "160X160";
var DEFAULT_LIMIT_FLAG = NON_LIMIT_FLAG;

$(function () {
    loadShoppingCartList();
    loadRecommandItems();
    
});

function numControl() {
    var a;
    $(".e-qty-itemnum").each(function () {
        var f = $(this).find("ul li").eq(2)
            , d = $(this).find("ul li").eq(0)
            , b = $(this).find("ul li").eq(1)
            , c = parseInt(b.text());
        var e = b.attr("itemId");
        f.on("click", function () {
            if (quantityChange(e, c + 1)) {
                c++;
                d.removeClass("disabled");
                $(this).parent().siblings("p.hint").hide();
                b.text(c)
            } else {
                $(this).addClass("disabled");
                $(this).parent().siblings("p.hint").show()
            }
        });
        d.on("click", function () {
            if ((c - 1) > 0 && quantityChange(e, c - 1)) {
                c--;
                d.removeClass("disabled");
                $(this).parent().siblings("p.hint").hide();
                b.text(c)
            } else {
                $(this).addClass("disabled");
                $(this).parent().siblings("p.hint").show()
            }
        })
    })
}
function quantityChange(b, a) {
    var c = {
        itemId: b,
        quantity: a
    };
    return c
}
function updateShoppingCartCount(b) {
    var a = false;
    $.ajax({
        url: updateShoppingCartLineUrl,
        type: "post",
        async: false,
        data: b,
        dataType: "json",
        success: function (c) {
            if (c.resultCode == 1) {
                a = true;
                loadShoppingCartList();
                updateHeaderCount()
            } else {
                if (c.resultCode == 0) {
                    comHintPop("修改商品数量失败！", null, false)
                } else {
                    if (c.resultCode == 10) {
                        comHintPop("该商品已下架！", null, false)
                    } else {
                        if (c.resultCode == 11) {
                            comHintPop("该商品购买的数量已达到限购的最大数量！", null, false)
                        } else {
                            if (c.resultCode == 12) {
                                comHintPop("该商品库存不足！", null, false)
                            } else {
                                if (c.resultCode == 13) {
                                    comHintPop("商品还未上架！", null, false)
                                } else {
                                    if (c.resultCode == 14) {
                                        comHintPop("订单或购物车的商品包含已暂停销售的尺寸或颜色！", null, false)
                                    } else {
                                        if (c.resultCode == null) {
                                            comHintPop("该商品库存不足！", null, false)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return a
}

// 动态回去购物车商品列表
function loadShoppingCartList() {
    $("#ulposition").empty();
    $.ajax({
        url: getShoppingCartUrl,
        type: "post",
        async: false,
        data: {},
        dataType: "json",
        success: function (z) {
            if (z == null) {
                $("#emptycartposition").html($("#emptycart").html());
                return
            }
            var D = z.shoppingCartByShopIdMap;
            var r = z.summaryShopCartList;
            if (isNotNullOrEmpty(D)) {
                $(".product-table").children().find("tr:gt(0)").remove();
                var j = 0;
                for (var q in D) {
                    if (j > 0) {
                        break
                    }
                    j++;
                    var v = D[q];
                    var c = v.shoppingCartLineCommands;
                    var E = null;
                    for (var u = 0; u < r.length; u++) {
                        var e = r[u];
                        var y = e.shopId;
                        if (y == q) {
                            E = r[u]
                        }
                    }
                    if (isNotNullOrEmpty(c)) {
                        for (var w = 0; w < c.length; w++) {
                            var s = $("#ulclone li.liclone").clone();
                            var o = c[w];
                            var t = o.gift;
                            if (o.stock == 0 && t || o.captionLine) {
                                continue
                            }
                            var p = o.itemId;
                            var B = processImgUrl(o.itemPic, SMALL_IMG_SIZE) + "?" + version_all;
                            var b = o.productCode;
                            var d = getItemUrlByCode(b);
                            var x = o.itemName;
                            var f = o.salePrice;
                            var l = o.listPrice;
                            var m = o.quantity;
                            var h = o.extentionCode;
                            var a = o.subTotalAmt;
                            var A = o.stock;
                            var g = o.limitMark;
                            var C = o.limit;
                            if (!isNotNullOrEmpty(g)) {
                                g = DEFAULT_LIMIT_FLAG
                            }
                            s.attr("itemId", p);
                            s.attr("extentionCode", h);
                            s.find("img").attr("src", B).attr("itemUrl", d);
                            s.find("p.name").text(x).attr("itemUrl", d);
                            s.find("span.mysaleprice").text("￥" + f);
                            if (f != l) {
                                s.find("span.mylistprice").text("￥" + l)
                            }
                            s.find("p.now-price").text("￥" + a);
                            s.find("li.num").text(m);
                            s.find("li.num").attr("itemLinestock", A);
                            s.find("li.num").attr("itemId", p);
                            s.find("li.num").attr("extentionCode", h);
                            s.find("span[myid='collection']").attr("itemId", p);
                            s.find("span[myid='delete']").attr("extentionCode", h);
                            if (t) {
                                s.find("p.btn").hide();
                                s.find("p.btn").next().removeClass("e-qty-itemnum")
                            }
                            if (g != NON_LIMIT_FLAG) {
                                s.find("li.num").attr("limitedQuantity", C)
                            } else {
                                s.find("li.num").attr("limitedQuantity", NON_LIMIT_FLAG)
                            }
                            // $("#ulposition").append(s)
                        }
                    }
                    var E = null;
                    for (var u = 0; u < r.length; u++) {
                        var e = r[u];
                        var y = e.shopId;
                        if (y == q) {
                            E = r[u]
                        }
                    }
                    var n = E.realPayAmount;
                    $("#carttotalprice").text("￥" + n)
                }
            } else { }
        }
    });
    numControl();
    collectionDeleteClick();
    setclick()
}

function isNotNullOrEmpty(a) {
    if (a != undefined && a != null && $.trim(a) != "") {
        return true
    } else {
        return false
    }
}

function setclick() {
    $("[itemUrl]").click(function () {
        window.location.href = $(this).attr("itemUrl")
    });
    $("#submitBtn").on("click", function () {
        var a = {};
        $.ajax({
            url: calcUrl,
            type: "post",
            async: false,
            data: a,
            dataType: "json",
            success: function (c) {
                if (c != null) {
                    if (c.isSuccess) {
                        window.location.href = balanceUrl
                    } else {
                        var b = c.description;
                        if (isNotNullOrEmpty(b)) {
                            comHintPop(b, null, false)
                        } else {
                            comHintPop("结算失败，请稍后重试!", null, false)
                        }
                    }
                } else {
                    comHintPop("结算失败，请稍后重试!", null, false)
                }
            }
        });
        checkOutOmi()
    })
}
function collectionDeleteClick() {
    $("span[myid='collection']").click(function () {
        var a = $(this).attr("itemid");
        addFavorites(a)
    });
    $(".e-cart-delete").click(function () {
        var a = $(this).attr("extentionCode");
        comHintPop("您确定要删除这个商品吗？", function () {
            deleteCartLine(a)
        }, true)
    })
}
function getItemUrlByCode(b) {
    var a = pdpPrefix + b;
    return a
}
function deleteCartLine(a) {
    var b = {
        extentionCode: a
    };
    $.ajax({
        url: deleteShoppingCartLineUrl,
        type: "post",
        async: false,
        data: b,
        dataType: "json",
        success: function (c) {
            if (c.isSuccess) {
                loadShoppingCartList();
                updateHeaderCount();
                loadRecommandItems()
            }
        }
    })
}
function addFavorites(a) {
    json = {
        itemId: a
    };
    $.post(addFavoritesUrl, json, function (b) {
        if (b.isSuccess) {
            comHintPop("收藏成功！", null, false)
        } else {
            if (b.exception != undefined) {
                comHintPop(b.exception.message, null, false)
            }
        }
    })
}
function loadRecommandItems() {
    $("#recommandposition").empty();
    var a = new Array();
    $("#ulposition li.liclone").each(function (e, g) {
        var f = $(this).attr("itemId");
        a[e] = f
    });
    var b = "";
    if (a.length > 0) {
        for (var c = 0; c < a.length; c++) {
            b += a[c];
            if (c < a.length - 1) {
                b += ","
            }
        }
    }
    var d = {
        itemIds: b
    };
    $.post(recommandUrl, d, function (j) {
        if (null != j && j.length > 0) {
            for (var k = 0; k < j.length; k++) {
                var l = j[k];
                var m = l.id;
                var e = l.code;
                var o = l.title;
                var h = getItemUrlByCode(e);
                // var n = processImgUrl(l.picUrl, MIDDLE_IMG_SIZE) + "?" + version_all;
                var f = l.salePrice;
                // if (n == null) {
                //     n = ""
                // }
                var g = $("#recommandclone li").clone();
                g.find("a").attr("href", h);
                // g.find("img").attr("src", n);
                g.find("p.name").text(o);
                g.find("p.price").text("￥" + f);
                $("#recommandposition").append(g)
            }
            scrollWidthCtr()
        } else { }
    })
};





















// $(function(){

//     // 合计
//     carttotalprice();
//     addMine();

//     function carttotalprice(){
//         var sum = 0;
//         $('.now-price').each(function(){
//             sum += parseFloat($(this).text());
//             $('#carttotalprice').text('￥' + sum);
//         })
//     }

//     function addMine(){
//         // 加
//         $('.ui-add').each(function(){
//             $(this).on('click', function(){
//                 var $multi;
                
//                 var vall = $(this).prev().children().val();
//                 vall ++;
//                 $(this).prev().children().val(vall);

//                 $multi = (parseFloat(vall) * parseInt($(this).parent().parent().prev().prev().first('span').text())).toFixed(2);



//                 $(this).parent().parent().prev().prev().text($multi);

//                 carttotalprice();
//             });

//         });

//         // 减
//         $('.minus').each(function(){
//             $(this).on('click', function(){
//                 var $multi1 = 0;
//                 var vall1 = $(this).next().children().val();
//                 vall1 -- ;
//                 if(vall1 <= 0){
//                     vall1 = 1;
//                 }
//                 $(this).next().children().val(vall1);

//                 $multi = parseFloat(vall1) * parseInt($(this).parent().parent().prev().prev().first('span').text());

//                 $(this).parent().parent().prev().prev().text($multi);

//                 carttotalprice();
//             })
//         })
        
//     }


// })

