$(document).ready(function() {
    var pagebase = '';
    $("div.ui-form-list input.ui-input").blur(function() {
        var a = $(this).val();
        if (a.length == 0 || a.length > 35) {
            toSetErrorInfo(this, "填写的内容必须在1-35个字符之间!")
        } else {
            toClearErrorInfo(this)
        }
    });
    $("#submitByQuestion").click(function() {
        $("div.ui-form-list input.ui-input").trigger("blur");
        if ($("div.ui-form-list li.error").length > 0) {
            return
        }
        var a = pagebase + "/account/editPasswordProtection";
        var b = {
            questionFirstDesc: aesEncode($.trim($("#question_0").val())),
            answerFirst: aesEncode($.trim($("#answer_0").val())),
            questionSecondDesc: aesEncode($.trim($("#question_1").val())),
            answerSecond: aesEncode($.trim($("#answer_1").val())),
            questionThirdDesc: aesEncode($.trim($("#question_2").val())),
            answerThird: aesEncode($.trim($("#answer_2").val()))
        };
        asyncXhr(a, b, {
            type: "post",
            success: function(c) {
                comHintPop(c.description)
            },
            error: function(c) {
                comHintPop("密码重置失败,请重试！")
            }
        })
    })
});

function toSetErrorInfo(b, a) {
    $(b).parent().addClass("error");
    $(b).parent().find("errorInfo").html(a)
}

function toClearErrorInfo(a) {
    $(a).parent().removeClass("error")
};