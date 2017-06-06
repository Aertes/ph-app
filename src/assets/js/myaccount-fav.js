var pagebase = '';
var isAddingBuyerCart = false;
var deleteMemberFavoritesUrl = pagebase + "";
var memberFavortiesListUrl = pagebase + "";
var getCartCountUrl = pagebase + "";
var addShoppingCartUrl = pagebase + "";
var getSkuInventoryUrl = pagebase + "";
var refreshstatus = true;
var curPage = 1;
$(document).ready(function() {
    setscrollrefresh();
    $(".e-collection-edit").on("click", function() {
        var a = $(this).parent().siblings(".ui-my-collection-list").find(".e-my-collection-delete");
        if (a.attr("style") == "display: inline;") {
            a.hide();
            return
        }
        a.show()
    });
    $(".ui-collection-empty").on("click", "input", function() {
        location.href = "/"
    });
    $(".clearfix").on("click", ".icon-delete-circle", function() {
        var b = $(this).attr("id");
        var a = {
            itemId: b,
            currPage: curPage
        };
        comHintPop("删除后无法恢复,是否确定删除?", function() {
            var c = syncXhr(deleteMemberFavoritesUrl, a, {
                type: "POST"
            });
            if (c.isSuccess == true) {
                comHintPop("删除成功", null, false);
                forwardUrl(memberFavortiesListUrl)
            } else {
                comHintPop("删除失败", null, false)
            }
        }, true)
    });
    $(".clearfix").on("click", ".addBuyCart", function() {
        if (isAddingBuyerCart) {
            comHintPop("正在加入购物车, 请稍等... <br /> 如果长时间没有反应, 请刷新页面", null, false);
            return
        }
        var c = $(this).attr("name");
        if ($(this).attr("lifecycle") != "1") {
            return
        }
        var b = {
            itemId: c
        };
        var a = {
            itemId: c,
            quantity: 1
        };
        isAddingBuyerCart = true;
        asyncXhr(addShoppingCartUrl, a, {
            type: "POST",
            successHandler: function(d) {
                $(".dialog-close").click();
                if (d.resultCode == 1) {
                    comHintPop("加入购物车成功", null, false);
                    updateHeaderCount()
                } else {
                    if (d.lowstocks == true) {
                        comHintPop("该商品库存不足！", null, false)
                    } else {
                        if (d.resultCode == 0) {
                            comHintPop("加入购物车失败！", null, false)
                        } else {
                            if (d.resultCode == 10) {
                                comHintPop("该商品已下架！", null, false)
                            } else {
                                if (d.resultCode == 11) {
                                    comHintPop("该商品购买的数量已达到限购的最大数量！", null, false)
                                }
                            }
                        }
                    }
                }
                isAddingBuyerCart = false
            }
        })
    })
});
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
function refreshListData() {
    if (parseInt(curPage) + 1 > totalPage) {
        return
    }
    var a = pagebase + "" + (parseInt(curPage) + 1);
    $.post(a, function(b) {
        $.each(b.paginationFavoritesList.items, function(d, c) {
            var f = $("#cloneid li").clone();
            f.attr("id_page", b.paginationFavoritesList.currentPage + "");
            f.find("a").attr("href", staticbase + "/item/" + c.itemCode);
            f.find("img").attr("src", formatImage(c.itemImageList[0].picUrl, "287X274"));
            f.find("p.name").text(c.itemName);
            f.find(".price now").text("￥" + c.salePrice);
            if (c.salePrice != c.listPrice) {
                f.find(".price used").text("￥" + c.listPrice)
            }
            if (c.lifecycle != 1) {
                f.find(".addBuyCart").addClass("disabled");
                f.find(".addBuyCart").val("该商品已下架")
            } else {
                f.find(".addBuyCart").val("加入购物车")
            }
            f.find(".addBuyCart").attr("lifecycle", c.lifecycle);
            f.find(".addBuyCart").attr("name", c.itemId);
            f.find("i").attr("id", c.itemId);
            var e = $(".ui-my-collection-list").find(".e-my-collection-delete");
            if (e.attr("style") == "display: inline;") {
                f.find(".e-my-collection-delete").show()
            }
            $("#position").append(f)
        });
        curPage = b.paginationFavoritesList.currentPage + "";
        setscrollrefresh();
        refreshstatus = true
    })
}
;