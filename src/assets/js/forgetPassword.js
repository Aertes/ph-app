var pagebase = "";
var findBackAccountUrl = pagebase + "";
var findBackEmailUrl = pagebase + "";
var updatePasswordUrl = pagebase + "";
var updateResultUrl = pagebase + "";
var validateLoginNameUrl = pagebase + "";
var waitValue = 59;
var wait = waitValue;
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
$(document).ready(function() {
    $("#mobileNumber").blur(function() {
        var t = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        var loginName = $(this).val();
        if (isInputEmpty("#mobileNumber")) {
            toSetErrorInfo("#mobileNumber", "请输入手机号码！");
            return
        } else {
            if (t.test(loginName)) {
                if (t.test(loginName)) {
                    var url = validateLoginNameUrl;
                    var json = {
                        username: loginName
                    }
                }
                var _d = syncXhr(url, json, {
                    type: "POST"
                });
                if (_d.isSuccess) {
                    toSetErrorInfo("#mobileNumber", "手机号码未注册！");
                    return false
                } else {
                    toClearErrorInfo("#mobileNumber")
                }
            } else {
                toSetErrorInfo("#mobileNumber", "请输入正确的手机号码！");
                return
            }
        }
    });
    $("#submit-button").on("click", function() {
        clearGeneralErrorInfo();
        var errorTitle = "错误提示";
        var errormsg = generalValidate("邮箱", $("#loginName").val(), {
            isNotNull: true,
            vemail: true,
            max: 50,
            min: 4
        });
        if (errormsg != null) {
            $(".loginNameError").parent().addClass("error");
            return
        }
        var code = $("#vcode").val();
        if (code == "") {
            $(".vCodeError").parent().addClass("error");
            return
        }
        var json = {
            loginName: $("#loginName").val(),
            vcode: $("#vcode").val()
        };
        asyncXhr(findBackEmailUrl, eval(json), {
            type: "POST",
            success: function(data) {
                var result = data;
                console.log(result);
                if (result.exception) {
                    if (result.exception.statusCode == 5) {
                        $(".loginNameError").parent().addClass("error")
                    } else {
                        if (result.exception.statusCode == 6013) {
                            $(".vCodeError").parent().addClass("error")
                        }
                    }
                } else {
                    forwardUrl(findBackAccountUrl + "?email=" + data.emailAddress)
                }
            }
        })
    });
    $("#securityImg").click(function() {
        changeCode($(this))
    });
    $("#securityImgs").click(function() {
        changeCode($(this))
    });
    $("#update-button").on("click", function() {
        clearGeneralErrorInfo();
        var errorTitle = "错误提示";
        var errormsg = generalValidate("原密码", $("#old-password").val(), {
            isNotNull: true,
            min: 6,
            max: 20
        });
        console.log(errormsg);
        if (errormsg != null) {
            $("#old-password").parent("li").addClass("error");
            $("#old-password").parent("li").find("span").text(errormsg);
            return
        }
        var errormsg = generalValidate("新密码", $("#new-password").val(), {
            isNotNull: true,
            min: 6,
            max: 20
        });
        if (errormsg != null) {
            $("#new-password").parent("li").addClass("error");
            $("#new-password").parent("li").find("span").text(errormsg);
            return
        }
        var newpassword = $("#new-password").val();
        var renewpassword = $("#renew-password").val();
        if (newpassword != renewpassword) {
            var errormsg = "两次密码输入不一样!";
            $("#renew-password").parent("li").addClass("error");
            $("#renew-password").parent("li").find("span").text(errormsg);
            return
        }
        var json = {
            oldPassword: aesEncode($("#old-password").val()),
            password: aesEncode($("#new-password").val()),
            repassword: aesEncode($("#renew-password").val())
        };
        var data = ajaxsynpost(updatePasswordUrl, json);
        if (data.isSuccess) {
            comHintPop("密码修改成功!", function() {
                location.href = pagebase + "/account/info"
            }, false)
        } else {
            comHintPop("密码修改失败!", function() {
                forwardUrl(updatePasswordUrl)
            }, false)
        }
    });
    $("#findway").change(function() {
        $(".mobilelDIV").hide();
        $(".emailDIV").hide();
        $(".questionDIV").hide();
        var way = $(this).val();
        if (way == "mobile") {
            $(".mobilelDIV").show()
        } else {
            if (way == "email") {
                $(".emailDIV").show()
            } else {
                $(".questionDIV").show()
            }
        }
    });
    
    $("#findPsdByMobile").click(function() {
        var mobileNumber = $.trim($("#mobileNumber").val());
        var newPassword = $.trim($("#newPassword").val());
        var verifySndCode = $.trim($("#verifySndCode").val());
        var securityCode = $.trim($("#randomCode").val());
        toClearErrorInfo("#verifySndCode");
        toClearErrorInfo("#newPassword");
        toClearErrorInfo("#mobileNumber");
        toClearErrorInfo("#randomCode");
        var boo = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobileNumber);
        if (!boo) {
            toSetErrorInfo("#mobileNumber", "请填写正确的手机号码！");
        console.log(123);
            
            return
        }
        console.log(456);
        
        if (securityCode == "") {
            $("#securityCode").parent().parent().parent().addClass("error");
            $("#securityCode").parent().parent().parent().find("span").html("请填写效验码!");
            return
        }
        boo = newPassword.length >= 6 && newPassword.length <= 20;
        if (!boo) {
            toSetErrorInfo("#newPassword", "请填写6到12位的密码！");
            return
        }
        if (verifySndCode == "") {
            toSetErrorInfo("#verifySndCode", "请填写短信验证码！");
            return
        }
        var json = {
            mobileNumber: mobileNumber,
            newPassword: aesEncode(newPassword),
            verifySndCode: aesEncode(verifySndCode),
            securityCode: securityCode
        };
        var url = pagebase + "/account/findPasswordByMobile";
        asyncXhr(url, json, {
            type: "post",
            success: function(data) {
                if (data.isSuccess) {
                    comHintPop(data.description, function() {
                        history.go(-1)
                    }, false)
                } else {
                    comHintPop(data.description)
                }
            },
            error: function(data) {
                comHintPop("密码重置失败,请重试！")
            }
        })
    });
    $("#findPsdByQuestion").click(function() {
        var question_loginName = $.trim($("#question_loginName").val());
        $("#verifyquestionLoginNameError").hide();
        if (question_loginName == "") {
            $("#verifyquestionLoginNameError").text("请填写用户名!").show();
            return
        }
        var url = pagebase + "/account/findsecurityQuestionByMobile";
        var json = {
            loginName: aesEncode(question_loginName)
        };
        asyncXhr(url, json, {
            type: "post",
            success: function(data) {
                showQuestions(data)
            },
            error: function(data) {}
        })
    });
    $("#lasyByQuestion").click(function() {
        $("div[myattr='questionLine']").hide();
        $("#lasyByQuestion").hide();
        $("#findPsdByQuestion").show();
        $("#submitByQuestion").hide();
        $("#canclebutton").show()
    });
    $("#submitByQuestion").click(function() {
        $(".questionDIV li.error").removeClass("error");
        var newpwd = $.trim($("#newpwd").val());
        var answer_0 = $.trim($("#answer_0").val());
        var answer_1 = $.trim($("#answer_1").val());
        var answer_2 = $.trim($("#answer_2").val());
        var confirmnewpwd = $.trim($("#confirmnewpwd").val());
        if (newpwd.length < 6 || newpwd.length > 20) {
            toSetErrorInfo("#newpwd", "密码必须在6-20个字符之间!");
            return
        }
        if (confirmnewpwd.length < 6 || confirmnewpwd.length > 20) {
            toSetErrorInfo("#confirmnewpwd", "密码必须在6-20个字符之间!");
            return
        }
        if (confirmnewpwd != newpwd) {
            toSetErrorInfo("#confirmnewpwd", "两次输入的密码不一致!");
            return
        }
        if (answer_0.length == 0 || answer_0.length > 35) {
            toSetErrorInfo("#answer_0", "密保答案必须在1-35个字符之间!");
            return
        }
        if (answer_1.length == 0 || answer_1.length > 35) {
            toSetErrorInfo("#answer_1", "密保答案必须在1-35个字符之间!");
            return
        }
        if (answer_2.length == 0 || answer_2.length > 35) {
            toSetErrorInfo("#answer_2", "密保答案必须在1-35个字符之间!");
            return
        }
        var url = pagebase + "/account/resetPassWordByQuestion";
        var json = {
            loginName: aesEncode($.trim($("#question_loginName").val())),
            newPassWord: aesEncode($.trim($("#newpwd").val())),
            confirmNewPassWord: aesEncode($.trim($("#confirmnewpwd").val())),
            questionFirstDesc: aesEncode($.trim($("#question_0").val())),
            answerFirst: aesEncode($.trim($("#answer_0").val())),
            questionSecondDesc: aesEncode($.trim($("#question_1").val())),
            answerSecond: aesEncode($.trim($("#answer_1").val())),
            questionThirdDesc: aesEncode($.trim($("#question_2").val())),
            answerThird: aesEncode($.trim($("#answer_2").val()))
        };
        asyncXhr(url, json, {
            type: "post",
            success: function(data) {
                if (data.isSuccess) {
                    comHintPop(data.description, function() {
                        history.go(-1)
                    }, false)
                } else {
                    comHintPop(data.description)
                }
            },
            error: function(data) {
                comHintPop("密码重置失败,请重试！")
            }
        })
    });
    $("#verifyCodeId").click(function(){
        timeCountDown($(this));
    })
});
function changeCode(a) {
    var b = a.attr("src").split("?")[0];
    a.attr("src", b + "?" + Math.random())
}
function toSetErrorInfo(b, a) {
    $("" + b).parent().addClass("error");
    $("" + b).parent().find("span").html(a);
}
function toClearErrorInfo(a) {
    $("" + a).parent().removeClass("error")
}
function getSmsCode() {
    sendShortMessage();
    timeCountDown()
}
function sendShortMessage() {
    var e = $("#mobileNumber").val();
    var b = $("#randomCode").val();
    if ($.trim(e) == "") {
        $("#securityImgs").click();
        toSetErrorInfo("#mobileNumber", "请输入手机号码");
        wait = 0;
        return
    }
    var d = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(e);
    if (!d) {
        $("#securityImgs").click();
        toSetErrorInfo("#mobileNumber", "请输入正确的手机号码");
        wait = 0;
        return
    }
    if ($.trim(b) == "") {
        $("#securityImgs").click();
        toSetErrorInfo("#verifyCodeId", "请填写校验码！");
        wait = 0;
        return
    }
    if ($("#mobileNumbers").hasClass("error")) {
        $("#securityImgs").click();
        wait = 0;
        return
    }
    if ($.trim(b) != "") {
        $(".error").removeClass("error")
    }
    var a = pagebase + "/m/sendBindMobileCodeV";
    var c = {
        mobile: aesEncode(e),
        randomCode: b
    };
    asyncXhr(a, c, {
        type: "post",
        success: function(f) {
            if (!f.successStatus) {
                $("#securityImgs").click();
                toSetErrorInfo("#verifyCodeId", f.errorCodeDesc)
            }
        },
        error: function(f) {
            $("#securityImgs").click();
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
        wait--;
        setTimeout(function() {
            timeCountDown(a)
        }, 1000)
    }
}
function showQuestions(a) {
    $("li[myattr='questionLine']").hide();
    toClearErrorInfo("#question_loginName");
    if (a.length > 0) {
        $("li[myattr='questionLine']").show();
        $("#lasyByQuestion").show();
        $("#findPsdByQuestion").hide();
        $("#submitByQuestion").show();
        $("#canclebutton").hide()
    } else {
        toSetErrorInfo("#question_loginName", "该用户未设置密保问题!")
    }
    $.each(a, function(b, c) {
        if (b <= 2) {
            $("#question_" + b).val(c.question).attr("questionid", c.id)
        }
    })
};

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

