
var pagebase = "";
var registerUrl = pagebase + "/account/reg";
var validateLoginNameUrl = pagebase + "/m/vaildUserName";
var validateEmailUrl = pagebase + "/m/vaildEmail";
var validateMobileUrl = pagebase + "/m/vaildMobile";
var sendRegSmsCodeUrl = pagebase + "/m/mobileRegisterSendSmsCode";
var vaildActiveSmsCodeUrl = pagebase + "/m/vaildActiveSmsCode";
var isMobileTrue = false;
var waitValue = 59;
var wait = waitValue;
var falg = true;
function isInputEmpty(a) {
    var b = $(a);
    var d = $.trim(b.val());
    var c = $.trim(b.attr("ori_value"));
    if (d == "" || d == c) {
        return true
    } else {
        return false
    }
}
function clearGeneralErrorInfo() {
    $(".notice").parent("li").removeClass("error");
    $(".notice-title").html("");
    $(".notice-body").html("")
}
function toSetErrorInfo(b, a) {
    $(b).parent().addClass("error");
    $(b).parent().find("errorInfo").html(a)
}
function getErrspan(a) {
    return $(a).next(".hint")
}
function changeCode(a) {
    var b = a.attr("src").split("?")[0];
    a.attr("src", b + "?" + Math.random())
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
function checkEmail(b) {
    var a = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return a.test(b)
}
function isMobile(a) {
    var b = /^(1[3-9]{1}[0-9]{1})\d{8}$/;
    return b.test(a)
}
var textLoginNameDefault = "输入3-20位不含特殊字符用户名";
var textLoginEmailDefault = "输入正确邮箱地址";

$(document).ready(function() {

    $("#securityImg").click(function() {
        changeCode($(this))
    });
    $("#loginName").blur(function() {
        var e = /^\d{11}$/;
        var g = $(this).val();
        if (isInputEmpty("#loginName")) {
            setValid(this, false, "请输入手机号码");
            $(this).parent().addClass("error");
            return
        } else {
            if (e.test(g)) {
                if (!checkStrIsNotNull(g)) {
                    return false
                }
                var c, d, f = "该用户名已被使用";
                if (e.test(g)) {
                    c = validateLoginNameUrl;
                    d = {
                        username: g
                    }
                }
                var b = syncXhr(c, d, {
                    type: "POST"
                });
                if (!b.isSuccess) {
                    setValid(this, false, f);
                    $("#loginNameError").html(f).css("display", "block");
                    $(this).parent().addClass("error");
                    return false
                } else {
                    setValid(this, true, f);
                    $(this).parent().removeClass("error")
                }
            } else {
                setValid(this, false, "请输入正确的手机号码");
                $(this).parent().addClass("error");
                return
            }
        }
    });
    $("#loginEmail").blur(function() {
        var e = /^[A-Za-z][A-Za-z0-9_-]*$/;
        var g = $(this).val();
        if (isInputEmpty("#loginEmail")) {
            setValid(this, false, "请输入邮箱");
            $(this).parent().addClass("error");
            return
        } else {
            if (checkEmail(g)) {
                if ((g.length > 0 && g.length < 6) || g.length > 30) {
                    setValid(this, false, "邮箱长度必须在6-30位之间");
                    $(this).addClass("error");
                    return
                }
                if (!checkStrIsNotNull(g)) {
                    return false
                }
                var c, d, f = "该邮箱已被使用";
                if (checkEmail(g)) {
                    c = validateEmailUrl;
                    d = {
                        email: g
                    }
                }
                var b = syncXhr(c, d, {
                    type: "POST"
                });
                if (!b.isSuccess) {
                    if (checkEmail(loginName)) {
                        f = "该邮箱已存在"
                    }
                    setValid(this, false, f);
                    $("#loginEmailError").html(f).css("display", "block");
                    $("#loginEmail").addClass("error");
                    return false
                } else {
                    setValid(this, true, null);
                    $("#loginEmailError").hide();
                    $("#loginEmail").removeClass("error")
                }
            } else {
                setValid(this, false, "邮箱无效");
                $(this).parent().addClass("error");
                return
            }
        }
    });
    $("#password").blur(function() {
        if (isInputEmpty("#password")) {
            setValid(this, false, "请输入密码");
            $(this).parent().addClass("error")
        } else {
            if ($.trim($(this).val()).length < 6 || $.trim($(this).val()).length > 20) {
                setValid(this, false, "密码必须在6-20个字符之间");
                $(this).parent().addClass("error")
            } else {
                if ($(this).val() == $("#repassword").val()) {
                    setValid(this, true, "");
                    setValid($("#repassword"), true, "")
                } else {
                    setValid(this, true, "");
                    $(this).parent().removeClass("error")
                }
            }
        }
    });
    $("#repassword").blur(function() {
        if (isInputEmpty("#repassword")) {
            setValid(this, false, "请输入确认密码");
            $(this).parent().addClass("error")
        } else {
            if ($(this).val() != $("#password").val()) {
                setValid(this, false, "两次密码填写不一致");
                $(this).addClass("error")
            } else {
                setValid(this, true, "");
                $(this).parent().removeClass("error")
            }
        }
    });
    $("#verifySndCode").blur(function() {
        if (isInputEmpty("#verifySndCode")) {
            setValid(this, false, "请输入短信验证码！");
            $(this).parent().addClass("error")
        } else {
            setValid(this, true, "");
            $(this).parent().removeClass("error")
        }
    });
    $("#randomCode").blur(function() {
        var b = $(this).val();
        if (isInputEmpty("#randomCode")) {
            $("#randomCodeError").html("请输入验证码");
            setValid(this, false, "请输入验证码");
            $(this).parents("li").addClass("error");
            return
        } else {
            console.log($(this).parent("li"));
            $(this).parents("li").removeClass("error")
        }
        setValid(this, true, "")
    });

    $('.e-register-radio').on('click', function(){
        console.log(12);
        $(this).children().toggleClass('active');
    });

    var a = null;
    $(".to-register").on("click", function() {
        clearTimeout(a);
        a = setTimeout(function() {
            $("#loginName,#loginEmail, #password, #repassword, #randomCode, #verifySndCode").trigger("focus");
            $("#loginName,#loginEmail, #password, #repassword, #randomCode, #verifySndCode").trigger("blur");
            if ($("#acceptChck").hasClass("active")) {
                setValid(this, true, "");
                clearGeneralErrorInfo()
            } else {
                setValid(this, false, "同意商城服务协议后才能成为注册会员！");
                showGeneralErrorInfo("错误提示", "同意商城服务协议后才能成为注册会员！");
                return
            }
            if ($("#verifySndCode").val() == "请填写验证码" || $("#verifySndCode").val() == "") {
                setErrorDesc("请输入短信验证码！");
                return
            }
            if ($("#loginName").data("checked") && $("#loginEmail").data("checked") && $("#password").data("checked") && $("#repassword").data("checked") && $("#randomCode").data("checked")) {
                var b = {
                    loginEmail: $("#loginEmail").val(),
                    loginName: $("#loginName").val(),
                    password: aesEncode($("#password").val()),
                    repassword: aesEncode($("#repassword").val()),
                    verifySndCode: aesEncode($("#verifySndCode").val()),
                    randomCode: $("#randomCode").val()
                };
                asyncXhr(registerUrl + "?xinAnYiType=" + $("#typeXinAnYi").val(), b, {
                    type: "POST",
                    successHandler: function(e) {
                        var c = e;
                        console.log(c);
                        if (c.resultCode == "requiredError") {
                            $("#loginNameError").html("请输入必填项！").css("display", "block");
                            addError();
                            return false
                        } else {
                            if (c.resultCode == "userExist") {
                                var d = "该用户名已被使用";
                                if (c.type == 2) {
                                    d = "该邮箱已存在"
                                } else {
                                    if (c.type == 3) {
                                        d = "该手机号已存在"
                                    }
                                }
                                $("#loginNameError").html(d).css("display", "block");
                                $("#loginName").parent().addClass("error");
                                return false
                            } else {
                                if (c.resultCode == "pwdMatchErr") {
                                    $("#passWordError").html("两次密码不匹配");
                                    $("#password").parent().addClass("error");
                                    $("#repassword").parent().addClass("error");
                                    return false
                                } else {
                                    if (c.resultCode == "SndCodeNullError") {
                                        setErrorDesc("请输入短信验证码！");
                                        $("#verifySndCode").trigger("focus");
                                        return false
                                    } else {
                                        if (c.resultCode == "SndCodeInvalidError") {
                                            setErrorDesc("短信验证码无效！");
                                            $("#verifySndCode").trigger("focus");
                                            return false
                                        } else {
                                            if (c.resultCode == "registerError") {
                                                $("#loginNameError").html("注册失败，请稍后重试!")
                                            } else {
                                                if (c.resultCode == "sysError") {
                                                    $("#loginNameError").html("系统错误，请稍后再试！");
                                                    $("#loginNameError").parent().addClass("error");
                                                    return false
                                                } else {
                                                    if (checkStrIsNotNull(c.returnUrl)) {
                                                        window.location.href = c.returnUrl
                                                    } else {
                                                        if (c.resultCode == "codeError") {
                                                            changeCode($("#securityImg"));
                                                            $("#randomCodeError").html("验证码错误，请重新输入！");
                                                            $("#randomCode").parents("li").addClass("error");
                                                            return false
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        userRegistrationOmi()
                    }
                })
            }
        }, 350)
    });
    $(".to-register").dblclick(function() {
        clearTimeout(a)
    });

    $("#securityImgMobile").on("tap", function() {
        changeCode($(this))
    });
    
    $("#verifyCodeId").on('click', function(){
        timeCountDown($(this));
    })
});
function addError() {
    $("#loginName").parent().addClass("error");
    $("#password").parent().addClass("error");
    $("#repassword").parent().addClass("error");
    $("#randomCode").parent().addClass("error")
}
function getSmsCode() {
    sendShortMessage();
    timeCountDown()
}
function sendShortMessage() {
    $("#randomCodeError").hide();
    $("#verifyCodeError").hide();
    var e = $("#loginName").val();
    var b = $("#randomCode").val();
    if ($.trim(e) == "") {
        $("#securityImg").click();
        $("#loginNameError").html("请输入手机号码").css("display", "block");
        wait = 0;
        return
    }
    var d = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(e);
    if (!d) {
        $("#securityImg").click();
        $("#loginNameError").html("请输入正确的手机号码").css("display", "block");
        wait = 0;
        return
    }
    if ($.trim(b) == "") {
        $("#securityImg").click();
        $("#randomCodeError").html("请输入校验码").css("display", "block");
        wait = 0;
        return
    }
    if ($(loginNameError).css("display") != "none") {
        $("#securityImg").click();
        wait = 0;
        return
    }
    var a = pagebase + "/m/sendBindMobileCodeV";
    var c = {
        mobile: aesEncode($("#loginName").val()),
        randomCode: b
    };
    $("#verifyCodeError").hide();
    asyncXhr(a, c, {
        type: "post",
        success: function(f) {
            if (!f.successStatus) {
                $("#securityImg").click();
                $("#verifyCodeError").html(f.errorCodeDesc).css("display", "block")
            }
        },
        error: function(f) {
            $("#securityImg").click();
            setErrorDesc("短信验证码发送失败，请重新获取！")
        }
    })
}

function timeCountDown(a) {
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
        a.val( wait + "秒后重新获取");
        wait --;
        setTimeout(function() {
            timeCountDown(a)
        }, 1000)
    }
}

function setErrorDesc(a) {
    $("#verifyCodeError").html(a).css("display", "block");
    setValid("#verifyCodeError", false, a);
    $("#verifyCodeError").addClass("msg_error")
};



