var pagebase = '';
var sendBindMobileCodeUrl = pagebase + "";
var bindMobileUrl = pagebase + "";
var sendBindEmailUrl = pagebase + "";
var checkEmailUrl = pagebase + "";
var refreshUrl = pagebase + "";
var waitValue = 60;
var wait = waitValue;

// 邮箱验证
function checkEmail() {
    var a = $("#email").val();
    var c = $("#oldEmail").val();
    if ($.trim(a) == $.trim(c)) {
        $("#email").attr("pass", "true");
        $("#email").parent("li").removeClass("error");
        return
    }
    var b = syncXhr(checkEmailUrl, {
        email: a
    }, {
            type: "POST"
        });
    if (b.isSuccess == false) {
        $("#email").siblings().html("<i class='icon-form-error'></i>该邮箱已被占用");
        $("#email").parent("li").addClass("error");
        $("#email").attr("pass", "false");
        return
    } else {
        $("#email").attr("pass", "true");
        $("#email").parent("li").removeClass("error")
    }
}

$(document).ready(function () {
    $(".e-personal-sex").children(".active").find("input[name=sex]").attr("checked", "cheched");
    $(".e-personal-sex").click(function () {
        $(this).children().find("input[name=sex]").removeAttr("checked");
        $(this).children(".active").find("input[name=sex]").attr("checked", "cheched")
    });
    $(".cancel").click(function () {
        window.location.reload(true)
    });
    $("#updateInfo").click(function () {
        $(".ui-form-list").find("li").removeClass("error");
        $("#email").trigger("focus");
        $("#email").trigger("blur");
        var h = generalValidate("昵称", $("#nickname").val(), {
            isNotNull: true,
            max: 20,
            min: 2
        });
        if (h != null) {
            $("#nickname").siblings().html("<i class='icon-form-error'></i>" + h);
            $("#nickname").parent("li").addClass("error");
            return
        } else {
            $("#nickname").parent("li").removeClass("error")
        }
        if ($(".e-personal-sex").find(".active").length < 1) {
            $(".e-personal-sex").parent("li").addClass("error");
            return
        }
        var e = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if ($("#short2").val() != "" && !e.test($("#short2").val())) {
            $("#short2").siblings().html("<i class='icon-form-error'></i>电话格式不正确");
            $("#short2").parent("li").addClass("error");
            return
        }
        var f = $("#data-year").val();
        var g = $("#data-month").val();
        var d = $("#data-day").val();
        $("#idbirthday").val(f + "/" + g + "/" + d);
        // 提交
        $.post("", $("#personDataForm").serialize(), function (i) {
            if (i.isSuccess == true) {
                comHintPop("更新成功!", function () {
                    // location.href = refreshUrl
                }, false)
            } else {
                comHintPop("更新失败，请重试!", null, false)
            }
        })
    });
    $("#securityImg").click(function () {
        changeCode($(this))
    });
    $("#bindMobile").click(function () {
        var g = $("#smsCode").val();
        var f = $("#randomCode").val();
        var d = $("#toBeBindMobile").val();
        var e = {
            smsCode: g,
            identifyingCode: f,
            mobile: d
        };
        asyncXhr(bindMobileUrl, e, {
            type: "POST",
            success: function (h) {
                if (h.isSuccess) {
                    comHintPop("手机绑定成功!", null, false);
                    $("#smsCode").val("");
                    $("#randomCode").val("");
                    $(".spice-btn-stcenter").click(refresh)
                } else {
                    comHintPop(h.description, null, false)
                }
            }
        })
    });
    $("#sendSmsCode").click(function () {
        var d = $("#toBeBindMobile").val();
        var e = {
            mobile: d
        };
        asyncXhr(sendBindMobileCodeUrl, e, {
            type: "POST",
            success: function (f) {
                if (f.isSuccess) {
                    comHintPop("发送短信成功!", null, false)
                } else {
                    comHintPop("发送短信失败!", null, false)
                }
            }
        })
    });
    $("#bindEmail").click(function () {
        var d = $("#toBeBindEmail").val();
        var e = {
            email: d
        };
        asyncXhr(sendBindEmailUrl, e, {
            type: "POST",
            success: function (f) {
                if (f.isSuccess) {
                    comHintPop("发送邮件成功!", null, false)
                } else {
                    comHintPop("发送邮件失败!", null, false)
                }
            }
        })
    });
    $("#cryptoguardSubmit").click(function () {
        var g = $("#cryptoguardDiv").find("select").find("option:selected");
        var j = $("#cryptoguardDiv").find("input");
        var f = true;
        $.each(j, function (k, l) {
            if ($.trim(l.value) == "" && f == true) {
                comHintPop("密保答案不能为空", null, false);
                f = false
            }
        });
        if (!f) {
            return
        }
        var e = true;
        $.each(g, function (k, l) {
            if ($.trim(l.value) == "" && e == true) {
                comHintPop("请先选择问题", null, false);
                e = false
            }
        });
        if (!e) {
            return
        }
        var d = true;
        var i = "";
        var h = "";
        $.each(g, function (k, l) {
            if (k == 0) {
                i = $.trim(l.value)
            }
            if (k == 1) {
                h = $.trim(l.value)
            }
            if (k == 2) {
                if (i == h || i == $.trim(l.value) || $.trim(l.value) == h) {
                    comHintPop("密保问题不能相同", null, false);
                    d = false
                }
            }
        });
        if (!d) {
            return
        }
        submitForm("cryptoguardForm", {
            mode: "async",
            successHandler: function (k) {
                if (k.isSuccess == true) {
                    comHintPop("密保设置成功!", null, false);
                    $(".spice-btn-stcenter").click(refresh)
                } else {
                    comHintPop("密保设置失败!", null, false)
                }
            }
        })
    });
    $("#validateCryptoguardSubmit").click(function () {
        submitForm("validateCryptoguardForm", {
            mode: "async",
            successHandler: function (d) {
                if (d.isSuccess == true) {
                    comHintPop("密保填写正确!", null, false);
                    $("#validateCryptoguardDiv").hide();
                    $("#cryptoguardDiv").show()
                } else {
                    comHintPop("密保填写错误!", null, false)
                }
            }
        })
    });
    $("#updatePassWord").click(function () {
        submitForm("newPassWordForm", {
            mode: "async",
            successHandler: function (e) {
                if (e.isSuccess == true) {
                    comHintPop("密码修改成功!", null, false)
                } else {
                    var d = "";
                    if (e.description == "90005") {
                        d = "原密码错误"
                    } else {
                        if (e.description == "90006") {
                            d = "新密码不能与原密码相同"
                        } else {
                            if (e.description == "90007") {
                                d = "新密码与重复密码不匹配"
                            } else {
                                d = "修改密码失败"
                            }
                        }
                    }
                    comHintPop(d, null, false)
                }
            }
        })



    });
    $.each(districtJson["1"], function (d, e) {
        $("<option></option>").val(d).text(e).appendTo($("#provience"))
    });
    $("#provience").change(onProvienceChange);
    $("#city").change(onCityChange);
    $("#provience").change();
    var c = $("#currentProvince").val();
    var b = $("#currentCity").val();
    var a = $("#currentDistrict").val();
    $("#provience option[value='" + c + "']").attr("selected", "selected");
    $("#provience").change();
    $("#city option[value='" + b + "']").attr("selected", "selected");
    $("#city").change();
    $("#country option[value='" + a + "']").attr("selected", "selected");
    $("#country").change();
    initMyEvent()

    // datepicker 时间
    $('#data-year').mobiscroll().date({
        theme: "ios light",
        lang: "zh",
        cancelText: "取消",
        dateFormat: 'yy/mm', //返回结果格式化为年月格式  
        // wheels:[], 设置此属性可以只显示年月，此处演示，就用下面的onBeforeShow方法,另外也可以用treelist去实现  
        onBeforeShow: function (inst) { inst.settings.wheels[0].length > 2 ? inst.settings.wheels[0].pop() : null; }, //弹掉“日”滚轮  
        headerText: function (valueText) { //自定义弹出框头部格式  
            array = valueText.split('/');
            return array[0] + "年" + array[1] + "月";
        }
    });

});

// 省份的变化
function onProvienceChange(a) {
    onDistrictSelectionChange("provience", "city")
}
// 城市的变化
function onCityChange(a) {
    onDistrictSelectionChange("city", "country")
}
// 市级变化
function onDistrictSelectionChange(a, c) {
    $("#" + c).children().remove();
    var b = $("#" + a).val();
    if (districtJson[b] != null) {
        $("#" + c).show();
        $.each(districtJson[b], function (d, e) {
            $("<option></option>").val(d).text(e).appendTo($("#" + c))
        });
        $("#" + c).change()
    } else {
        $("#" + c).hide()
    }
}
// 初始化事件
function initMyEvent() {
    $("#editEmailbutton").click(function () {
        comHintPop($("#checkEmailDialog").html(), sendEmail, true)
    });
    $("#editMobilebutton").click(function () {
        comHintPop($("#checkMobileDialog").html(), nextstep, true, mobileContentobjcallbackFun)
    })
}
// 下一步
function nextstep() {
    $("#checkMobileError").hide();
    var d = $("#mobileNumberId").val();
    var b = $("#mobileVerificationCode").val();
    if (d == "") {
        setErrorDesc("请输入手机号!");
        return false
    } else {
        if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(d)) {
            setErrorDesc("请输入正确的手机号!");
            return false
        }
    }
    if (b == "") {
        setErrorDesc("请输入验证码!");
        return false
    }
    $("#mobileNumberHidden").val(d);
    $("#mobileVerificationCodeHidden").val(b);
    var c = {
        mobile: d,
        verifySndCode: b
    };
    $("#checkMobilesuccess").hide();
    var a = pagebase + "/m/changeMobile";
    asyncXhr(a, c, {
        type: "post",
        success: function (e) {
            if (e.isSuccess) {
                setTimeout(function () {
                    comHintPop(e.description, function () {
                        window.location.reload()
                    }, false)
                }, 500)
            } else {
                comHintPopagain("短信验证码无效，请重新获取！")
            }
        },
        error: function (e) {
            comHintPopagain("操作失败，请重试！")
        }
    })
}
// 手机验证
function mobileContentobjcallbackFun() {
    $("#checkMobileError").text("").hide();
    if ($("#mobileVerificationCodeHidden").val() != "") {
        $("#mobileVerificationCode").val("");
        $("#mobileVerificationCodeHidden").val("")
    }
    var a = $("#loginName").val();
    if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(a)) {
        $("#mobileNumberId").val(a)
    }
}
// 设置错误显示
function setErrorDesc(a) {
    $("#checkMobileError").text(a).show()
}
// 获取短信验证
function getSmsCode() {
    var a = sendShortMessage();
    if (a == false) {
        return
    }
    timeCountDown()
}
// 短信验证倒计时
function timeCountDown() {
    var a = $("#verifyCodeId");
    if (wait == 0) {
        a.css({
            color: "#000"
        });
        a.removeAttr("disabled");
        a.val("获取验证码");
        $("#verifyCodeError").hide();
        wait = waitValue
    } else {
        a.css({
            color: ""
        });
        a.attr("disabled", true);
        a.val(wait + "秒后重新获取");
        wait--;
        setTimeout(function () {
            timeCountDown(a)
        }, 1000)
    }
}
// 发送短信验证
function sendShortMessage() {
    var d = true;
    var a = pagebase + "/m/sendBindMobileCodeV";
    var e = $("#mobileNumberId").val();
    $("#checkMobileError").hide();
    if (e == "") {
        setErrorDesc("请输入手机号！");
        return false
    }
    if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(e)) {
        setErrorDesc("请输入正确的手机号！");
        return false
    }
    var c = $("#loginNamehidden").val();
    var b = {
        mobile: aesEncode(e),
        loginName: c,
        noRandomCode: d
    };
    asyncXhr(a, b, {
        type: "post",
        success: function (f) {
            if (!f.successStatus) {
                setErrorDesc(f.errorCodeDesc);
                wait = 0
            }
        },
        error: function (f) {
            setErrorDesc("短信验证码发送失败，请重新获取！");
            wait = 0
        }
    })
}
// 发送邮箱验证
function sendEmail() {
    var d = $("#emailAddress").val();
    var c = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(d);
    $("#checkEmailError").text("").hide();
    if (!c) {
        $("#checkEmailError").text("请输入正确的邮箱地址!").show();
        return false
    }
    var a = pagebase + "/m/sendEmail";
    var b = {
        email: d,
    };
    $("#sendEmailSuccess").hide();
    asyncXhr(a, b, {
        type: "post",
        success: function (e) {
            if (e.isSuccess) {
                setTimeout(function () {
                    comHintPop(e.description)
                }, 500)
            } else {
                $("#checkEmailError").text(e.description).show()
            }
        },
        error: function (e) {
            $("#checkEmailError").text("邮件发送失败，请重新发送！").show()
        }
    })
};
