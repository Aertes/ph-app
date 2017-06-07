var textAddressDefault = "不需要重复填写省市区,必须大于5个字符,小于120个字符";
var textNameDefault = "长度不超过25个字符";
var textMobileDefault = "电话号码,手机号码必须填一项";
var textTelphoneDefault1 = "区号";
var textTelphoneDefault2 = "电话号码";
var textTelphoneDefault3 = "分机";
var saveContactUrl = "";
var deleteMemberContactUrl = "";
var refreshMemberContactUrl = "";
var searchMemberContactUrl = "";
var setDefaultMemberContactUrl = "";
function getErrspan(a) {
    return $(a).next(".error-word")
}
function setValid(d, a, c) {
    $(d).data("checked", a);
    var b = getErrspan(d);
    b.html(c);
    if (a) {
        b.hide()
    } else {
        b.show()
    }
}
function checkStrIsNotNull(a) {
    if (a == null || a.length == 0 || a == "") {
        return false
    } else {
        return true
    }
}
function getErrspan(a) {
    return $(a).next(".error-word")
}
function setValid(d, a, c) {
    $(d).data("checked", a);
    var b = getErrspan(d);
    b.html(c);
    if (a) {
        b.hide()
    } else {
        b.show()
    }
}
function checkMobile(b) {
    var a = /^1[3|4|5|8][0-9]\d{8}$/;
    return a.test(b)
}
function addError() {
    $("#address").addClass("msg_error");
    $("#mobile").addClass("msg_error");
    $("#telphone").addClass("msg_error");
    $("#postcode").addClass("msg_error")
}
function updateDefault() {
    var a = $(".func-button-default").siblings('input[class="currentId"]').val();
    var b = {
        contactId: a
    };
    var c = syncXhr(setDefaultMemberContactUrl, b, {
        type: "POST"
    });
    if (c.isSuccess == true) {
        comHintPop("修改成功,请刷新页面", function() {
            window.location = refreshMemberContactUrl
        }, false)
    } else {
        comHintPop("修改失败", null, false)
    }
}
function onProvienceChange(a) {
    onDistrictSelectionChange("provience", "city")
}
function onCityChange(a) {
    onDistrictSelectionChange("city", "area")
}
function onDistrictSelectionChange(a, c) {
    $("#" + c).children().remove();
    var b = $("#" + a).val();
    if (districtJson[b] != null) {
        $("#" + c).show();
        $.each(districtJson[b], function(d, e) {
            $("<option></option>").val(d).text(e).appendTo($("#" + c))
        });
        $("#" + c).change()
    } else {
        $("#" + c).hide()
    }
}
$(document).ready(function() {
    $("#cancel-button").click(function() {
        window.location = refreshMemberContactUrl
    });
    $(".ui-address-empty").on("click", "input", function() {
        location.href = "/account/address/toCheckout-address"
    });
    $(".add-contact").click(function() {
        $("#old-address").html("");
        $("#provience").attr("value", 0);
        $("#provience").change();
        $("#city").attr("value", "");
        $("#city").change();
        $("#area").attr("value", "");
        $("#postcode").attr("value", "");
        $("#address").attr("value", "");
        $("#name").attr("value", "");
        $("#mobile").attr("value", "");
        $("#telphone").attr("value", "");
        $("#contactId").attr("value", "");
        $("#isDefault").attr("checked", null);
        var lable = $("#create-or-update-lable");
        var oldAddessLable = $("#old-address-label");
        lable.show();
        oldAddessLable.hide();
        var addButton = $("#add-button");
        var updateButton = $("#update-button");
        addButton.show();
        updateButton.hide()
    });
    var TimeFn = null;
    $(".button_submit").click(function() {
        clearTimeout(TimeFn);
        TimeFn = setTimeout(function() {
            clearGeneralErrorInfo();
            var errorTitle = "错误提示";
            var errormsg = generalValidate("收件人姓名", $("#name").val(), {
                isNotNull: true,
                max: 25
            });
            if (errormsg != null) {
                showGeneralErrorInfo(errorTitle, errormsg);
                return
            }
            var errormsg = generalValidate("邮编", $("#postcode").val(), {
                isNotNull: true,
                reg: /^\d{6}$/
            });
            if (errormsg != null) {
                showGeneralErrorInfo(errorTitle, errormsg);
                return
            }
            var errormsg = generalValidate("收货地址", $("#address").val(), {
                isNotNull: true,
                min: 5,
                max: 120
            });
            if (errormsg != null) {
                showGeneralErrorInfo(errorTitle, errormsg);
                return
            }
            var mobile = $.trim($("#mobile").val());
            var tel = $.trim($("#telphone").val());
            if (mobile == "" && tel == "") {
                showGeneralErrorInfo(errorTitle, textMobileDefault);
                return
            }
            if (mobile != "") {
                errormsg = generalValidate("手机号码", $("#mobile").val(), {
                    vmobile: true
                });
                if (errormsg != null) {
                    showGeneralErrorInfo(errorTitle, errormsg);
                    return
                }
            }
            if (tel != "") {
                errormsg = generalValidate("电话号码", $("#telphone").val(), {
                    isNotNull: true,
                    reg: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
                });
                if (errormsg != null) {
                    showGeneralErrorInfo(errorTitle, errormsg);
                    return
                }
            }
            var isDefault = false;
            if ($("#isDefault").attr("checked") == "checked") {
                isDefault = true
            }
            var id = null;
            if ($("#contactId").val() != null) {
                id = $("#contactId").val()
            }
            var memberId = null;
            if ($("#memberId").val() != null) {
                memberId = $("#memberId").val()
            }
            var provinceId = "";
            if ($("#provience").val() != null) {
                provinceId = $("#provience").val()
            }
            var cityId = "";
            if ($("#city").val() != null) {
                cityId = $("#city").val()
            }
            var areaId = "";
            if ($("#area").val() != null) {
                areaId = $("#area").val()
            }
            var json = {
                provinceId: provinceId,
                cityId: cityId,
                areaId: areaId,
                postcode: $("#postcode").val(),
                address: $.trim($("#address").val()),
                name: $.trim($("#name").val()),
                mobile: $("#mobile").val(),
                telphone: $("#telphone").val(),
                id: id,
                memberId: memberId,
                isDefault: isDefault
            };
            asyncXhr(saveContactUrl, eval(json), {
                type: "POST",
                successHandler: function(data) {
                    if (data.isSuccess) {
                        if (id != null && id != "") {
                            comHintPop("修改成功！", function() {
                                window.location = refreshMemberContactUrl
                            }, false)
                        } else {
                            comHintPop("添加成功！", function() {
                                window.location = refreshMemberContactUrl
                            }, false)
                        }
                    }
                }
            })
        }, 300)
    });
    $(".button_submit").dblclick(function() {
        clearTimeout(TimeFn)
    });
    $.each(districtJson["1"], function(i, item) {
        $("<option></option>").val(i).text(item).appendTo($("#provience"))
    });
    $("#provience").change(onProvienceChange);
    $("#city").change(onCityChange);
    $("#provience").change();
    $(".func-button-update").click(function() {
        var currentId = $(this).siblings('input[class="currentId"]').val();
        var lable = $("#create-or-update-lable");
        var oldAddessLable = $("#old-address-label");
        lable.show();
        oldAddessLable.show();
        var addButton = $("#add-button");
        var updateButton = $("#update-button");
        addButton.hide();
        updateButton.show();
        var val = syncXhr(searchMemberContactUrl, {
            contactId: currentId
        }, {
            type: "POST"
        });
        if (null != val) {
            $("#old-address").html(val.name + "  " + val.province + val.city + val.area + val.address + "  " + val.postcode + "   " + val.mobile + "  " + val.telphone);
            $("#postcode").attr("value", val.postcode);
            $("#address").attr("value", val.address);
            $("#name").attr("value", val.name);
            $("#mobile").attr("value", val.mobile);
            $("#telphone").attr("value", val.telphone);
            $("#contactId").attr("value", val.id);
            $("#memberId").attr("value", val.memberId);
            if (val.isDefault) {
                $("#isDefault").attr("checked", "checked")
            } else {
                $("#isDefault").attr("checked", null)
            }
            $("#provience").attr("value", val.provinceId);
            $("#provience").change();
            $("#city").attr("value", val.cityId);
            $("#city").change();
            $("#area").attr("value", val.areaId);
            $(".button_submit").attr("value", "修改保存")
        }
    });
    $(".e-address-delete").click(function() {
        var currentId = $(this).siblings('input[class="currentId"]').val();
        var json = {
            contactId: currentId
        };
        comHintPop("删除后无法恢复,是否确定删除?", function() {
            var data = syncXhr(deleteMemberContactUrl, json, {
                type: "POST"
            });
            if (data.isSuccess == true) {
                comHintPop("删除成功!", null, false);
                window.location = refreshMemberContactUrl
            } else {
                comHintPop("删除失败!", null, false)
            }
        }, true)
    });
    $(".func-button-default").click(function() {
        if ($(this).parent(".active").length == 1) {
            return
        }
        var currentId = $(this).parent().siblings("p").find('input[class="currentId"]').val();
        var json = {
            contactId: currentId
        };
        var data = syncXhr(setDefaultMemberContactUrl, json, {
            type: "POST"
        });
        if (data.isSuccess == true) {
            comHintPop("设置成功！", function() {
                window.location = refreshMemberContactUrl
            }, false)
        } else {
            comHintPop("修改失败！", null, false)
        }
    });
    $(".icon-large-circle").click(function() {
        if ($(this).parent(".active").length == 1) {
            return
        }
        var currentId = $(".func-button-default").parent().siblings("p").find('input[class="currentId"]').val();
        var json = {
            contactId: currentId
        };
        var data = syncXhr(setDefaultMemberContactUrl, json, {
            type: "POST"
        });
        if (data.isSuccess == true) {
            comHintPop("设置成功！", function() {
                window.location = refreshMemberContactUrl
            }, false)
        } else {
            comHintPop("修改失败！", null, false)
        }
    })
});
