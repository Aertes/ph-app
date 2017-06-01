
var pagebase = '';
var create_member_url = pagebase + "/account/reg";
var loginUrl = pagebase + "/account/login";
var guestLoginUrl = pagebase + "/m/guestlogin";
var lastLoginNameUrl = pagebase + "/account/ln";
var needToSendShortMessage = false;
var waitValue = 120;
var wait = waitValue;
function getErrspan(a) {
    return $(a).next(".hint")
}
$(document).ready(function() {
    $(".create-member").on("click", function() {
        window.location.href = create_member_url
    });
    $(".login-member").on("click", function() {
        userLogin()
    });
    validateLogin()
});
function validateLogin() {
    $("#loginName").blur(function() {
        var a = /^[A-Za-z][A-Za-z0-9_-]*$/;
        var b = $(this).val();
        if (isInputEmpty("#loginName")) {
            $("#loginNameError").show();
            setValid(this, false, "请输入用户名");
            return
        }
        $("#loginNameError").hide();
        setValid(this, true, "")
    });
    $("#loginPwd").blur(function() {
        if (isInputEmpty("#loginPwd")) {
            $("#loginPwdError").show();
            setValid(this, false, "请输入密码");
            return
        }
        $("#loginPwdError").hide();
        setValid(this, true, "")
    });
    $("#validateCode").blur(function() {
        var a = $(this).val();
        if (isInputEmpty("#validateCode")) {
            $("#validateCodeError").show();
            setValid(this, false, "请输入验证码");
            return
        } else {
            $("#validateCodeError").hide()
        }
        setValid(this, true, "")
    });


    $("#securityImg").click(function() {
        changeCode($(this))
    });

    $("#guestLogin").on("tap", function() {
        asyncXhr(guestLoginUrl, {}, {
            type: "POST",
            success: function(b) {
                var a = b;
                if (a.isSuccess) {
                    if (checkStrIsNotNull(a.returnUrl)) {
                        window.location.href = a.returnUrl
                    }
                } else {
                    $(this).sAlert({
                        type: "open",
                        title: "温馨提示！",
                        content: "游客登录失败！"
                    })
                }
            }
        })
    })
}

function userLogin() {
    $("#loginName,#loginPwd,#validateCode").trigger("focus");
    $("#loginName,#loginPwd,#validateCode").trigger("blur");
    var b = $("#loginName");
    var a = $("#loginPwd");
    var e = $("#validateCode");
    var c = a.val();
    var f = encryptedPassword(c);
    var d = {
        loginName: b.val(),
        password: f,
        randomCode: e.val(),
        mobileTem: $("#mobileNumberHidden").val(),
        mobileVerifyCode: $("#mobileVerificationCodeHidden").val()
    };
    if (b.data("checked") && a.data("checked") && e.data("checked")) {
        asyncXhr(loginUrl, d, {
            type: "POST",
            success: function(i) {
                var g = i;
                console.log(g.resultCode);
                if (g.resultCode == "requiredError") {
                    $("#loginNameError").html("验证码错误，请重新输入").css("display", "block");
                    return false
                } else {
                    if (g.resultCode == "codeError") {
                        $("#validateCodeError").html("验证码错误，请重新输入").css("display", "block");
                        return false
                    } else {
                        if (g.resultCode == "loginErr") {
                            $("#loginNameError").html("用户名或密码错误").css("display", "block");
                            changeCode($("#securityImg"));
                            return false
                        } else {
                            if (g.resultCode == "activationErr") {
                                needToSendShortMessage = true;
                                if (g.errorType == "NOACTIVATION_SHORTMESSAGE") {
                                    comHintPop($("#checkMobileDialog").html(), nextstep, true, mobileContentobjcallbackFun)
                                } else {
                                    comHintPop("验证邮件已发送至" + b.val() + "，请您登录邮箱完成验证(有效期2小时)");
                                    var h = $("#loginName").val();
                                    $("myEmail").text(h)
                                }
                            } else {
                                if (checkStrIsNotNull(g.returnUrl)) {
                                    window.location.href = g.returnUrl;
                                    userLoginOmi()
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}

function changeCode(a) {
    var b = a.attr("src").split("?")[0];
    a.attr("src", b + "?" + Math.random())
}
function checkStrIsNotNull(a) {
    if (a == null || a.length == 0 || a == "") {
        return false
    } else {
        return true
    }
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
function setErrorDesc(a) {
    $("#checkMobileError").text(a).show()
}

function nextstep() {
    $("#checkMobileError").hide();
    var b = $("#mobileNumberId").val();
    var a = $("#mobileVerificationCode").val();
    if (b == "") {
        setErrorDesc("请输入手机号!");
        return
    } else {
        if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(b)) {
            setErrorDesc("请输入正确的手机号!");
            return
        }
    }
    if (a == "") {
        setErrorDesc("请输入验证码!");
        return
    }
    $("#mobileNumberHidden").val(b);
    $("#mobileVerificationCodeHidden").val(a);
    $(".login-member").click()
}
function mobileContentobjcallbackFun() {
    $("#checkMobileError").text("").hide();
    if ($("#mobileVerificationCodeHidden").val() != "") {
        setErrorDesc("验证码无效,请重新输入!");
        $("#mobileVerificationCode").val("");
        $("#mobileVerificationCodeHidden").val("")
    }
    var a = $("#loginName").val();
    if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(a)) {
        $("#mobileNumberId").val(a)
    }
}
function getSmsCode() {
    if (needToSendShortMessage) {
        var a = sendShortMessage();
        if (a == false) {
            return
        }
        timeCountDown()
    }
}
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
        a.val("(" + wait + ")秒后重新获取");
        wait--;
        setTimeout(function() {
            timeCountDown(a)
        }, 1000)
    }
}
function encryptedPassword(e) {
    var b = new Date().format("yyyy MM dd");
    console.log(b);
    var c = aesEncode(b).replace("==", "");
    var i = aesEncode(e).replace("==", "");
    var h = i.substr(0, i.length / 2);
    var g = i.substr(i.length / 2, i.length);
    var e = h + c + g;
    return e
}
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
    var c = $("#loginName").val();
    if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(c) || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(c)) {
        c = ""
    }
    var b = {
        mobile: aesEncode(e),
        loginName: c,
        noRandomCode: d
    };
    asyncXhr(a, b, {
        type: "post",
        success: function(f) {
            if (!f.successStatus) {
                setErrorDesc(f.errorCodeDesc);
                wait = 0
            }
        },
        error: function(f) {
            setErrorDesc("短信验证码发送失败，请重新获取！");
            wait = 0
        }
    })
}
;
