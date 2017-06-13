var pagebase = '';
var checkoutUrl = pagebase + "../../components/user/addressList.html";
$(function() {
    initaddress();
    otherclickset();
    // filladdressdata()
});

// 获取地址数据
function filladdressdata() {
    if (isNotNullOrEmpty(addressid)) {
        var a = pagebase + "";
        var b = ajaxsynpost(a, {
            contactId: addressid
        });
        if (null != b) {
            $("#provience").val(b.provinceId);
            $("#provience").change();
            $("#city").val(b.cityId);
            $("#city").change();
            $("#area").val(b.areaId);
            $("#postcode").val(b.postcode);
            $("#address").val(b.address);
            $("#name").val(b.name);
            $("#mobile").val(b.mobile);
            $("#telphone").val(b.telphone);
            $("#contactId").val(b.id);
            $("#memberId").val(b.memberId);
            if (b.isDefault) {
                $("#isDefault").addClass("active")
            } else {
                $("#isDefault").removeClass("active")
            }
        }
    }
}
// 点击其他获取不同的地址
function otherclickset() {
    var a = pagebase + "";
    $("#surebtn").click(function() {
        if (checkaddressdata()) {
            var c = {
                provinceId: $("#provience").val(),
                cityId: $("#city").val(),
                areaId: $("#area").val(),
                postcode: $.trim($("#postcode").val()),
                address: $.trim($("#address").val()),
                name: $.trim($("#name").val()),
                mobile: $.trim($("#mobile").val()),
                telphone: $.trim($("#telphone").val()),
                id: $("#contactId").val(),
                memberId: $("#memberId").val(),
                isDefault: $("#isDefault").hasClass("active")
            };
            var b = ajaxsynpost(a, c);
            if (b.isSuccess) {
                // location.href = checkoutUrl
            } else {
                console.log(JSON.stringify(b))
            }
        }
    });
    $("#cancelbtn").click(function() {
        // location.href = checkoutUrl
    });
    $(".e-com-terms-slt").click(function() {
        $(this).children("i").toggleClass("active")
    })
}
// 验证收货地址
function checkaddressdata() {
    var d = $.trim($("#name").val());
    var a = $.trim($("#address").val());
    var c = $.trim($("#postcode").val());
    var b = $.trim($("#mobile").val());
    var e = $.trim($("#telphone").val());
    var f = generalValidate("收件人姓名", d, {
        isNotNull: true,
        max: 25
    });
    if (f == null) {
        $("#name").next().hide()
    } else {
        $("#name").next().find("myattr").text(f);
        $("#name").next().show();
        return false
    }
    f = generalValidate("收货地址", a, {
        isNotNull: true,
        min: 5,
        max: 120
    });
    if (f == null) {
        $("#address").next().hide()
    } else {
        $("#address").next().find("myattr").text(f);
        $("#address").next().show();
        return false
    }
    f = generalValidate("邮编", c, {
        isNotNull: true,
        reg: /^\d{6}$/
    });
    if (f == null) {
        $("#postcode").next().hide()
    } else {
        $("#postcode").next().find("myattr").text(f);
        $("#postcode").next().show();
        return false
    }
    if (!isNotNullOrEmpty(b) && !isNotNullOrEmpty(e)) {
        $("#mobile").next().find("myattr").text("手机号码不能为空(手机号码和固定电话,两者必填一项)");
        $("#mobile").next().show();
        return false
    } else {
        $("#mobile").next().hide();
        $("#telphone").next().hide();
        if (isNotNullOrEmpty(b)) {
            f = generalValidate("手机号码", b, {
                vmobile: true
            });
            if (f != null) {
                $("#mobile").next().find("myattr").text(f);
                $("#mobile").next().show();
                return false
            }
        }
        if (isNotNullOrEmpty(e)) {
            f = generalValidate("电话号码", e, {
                isNotNull: true,
                reg: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
            });
            if (f != null) {
                $("#telphone").next().find("myattr").text(f);
                $("#telphone").next().show();
                return false
            }
        }
    }
    return true
}
// 初始化地址栏选中
function initaddress() {
    $.each(districtJson["1"], function(a, b) {
        $("#provience").append("<option value=" + a + ">" + b + "</option>")
    });
    $("#provience").change(onprovienceChange);
    $("#city").change(onCityChange);
    $("#provience").change()
}
// 切换城市
function onprovienceChange() {
    var a = $("#provience option:selected").val();
    $("#city").empty();
    $.each(districtJson["" + a], function(b, c) {
        $("#city").append("<option value=" + b + ">" + c + "</option>")
    });
    $("#city").change()
}
// 切换地区
function onCityChange() {
    var a = $("#city option:selected").val();
    $("#area").empty();
    $.each(districtJson["" + a], function(b, c) {
        $("#area").append("<option value=" + b + ">" + c + "</option>")
    });
    $("#area").change()
};
// 发送数据
function ajaxsynpost(c, b) {
    var a;
    $.ajax({
        url: c,
        type: "post",
        async: false,
        data: b,
        dataType: "json",
        success: function(d) {
            a = d
        }
    });
    return a
}
