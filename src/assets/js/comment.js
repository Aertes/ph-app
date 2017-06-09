var commonTokenUrl = "";
var isShowDeciaml = true;

function showPrice(b) {
    if (isShowDeciaml) {
        var a = b.toFixed(decimalCount);
        return a
    }
    return b
}
// 获取cookie
function getCookie(a) {
    var b = a + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(b);
        if (offset != -1) {
            offset += b.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) {
                end = document.cookie.length
            }
            return removeCookiequotes(unescape(document.cookie.substring(offset, end)))
        } else {
            return ""
        }
    }
}
// 删除Cookie报价
function removeCookiequotes(a) {
    return a.replace(/\"/g, "")
}
// 删除cookies
function delCookie(b) {
    var a = new Date();
    a.setTime(a.getTime() - 10000);
    document.cookie = b + "=a; expires=" + a.toGMTString()
}
// 设置cookies
function setCookie(b, c, a) {
    var d = new Date();
    d.setDate(d.getDate() + a);
    document.cookie = b + "=" + escape(c) + ((a == null) ? "" : ";expires=" + d.toGMTString())
}

function forwardUrl(a) {
    window.location.href = makeRealVersionUrl(a)
}

function refresh() {
    window.location.reload(true)
}

// url
function makeRealVersionUrl(a) {
    var b = (new Date()).getTime();
    a += (/\?/.test(a)) ? "&" : "?";
    return ( a + "rv=" + b.toString())
}
// 判断是否为空 或 undefined
function isNotNullOrEmpty(a) {
    if (a != undefined && a != null && a != "" && a != "undefined") {
        return true
    } else {
        return false
    }
}
// 提交form表单
function submitForm(b, a) {
    var e = _getForm(b)
      , g = a.mode || "sync";
    var h = true;
    h = validateForm(e);
    if (h) {
        if (g == "sync") {
            var d = $(e).attr("action");
            $(e).attr("action", makeRealVersionUrl(d));
            e.submit()
        } else {
            asyncXhr($(e).attr("action"), e, {
                type: $(e).attr("method") || "POST",
                successHandler: a.successHandler
            })
        }
    } else {}
}

function hitch(a, b) {
    if (!b) {
        b = a;
        a = null
    }
    if (this.isString(b)) {
        a = a || _g;
        if (!a[b]) {
            throw (['hitch: scope["', b, '"] is null (scope="', a, '")'].join(""))
        }
        return function() {
            return a[b].apply(a, arguments || [])
        }
    }
    return !a ? b : function() {
        return b.apply(a, arguments || [])
    }
}
// 异步
function asyncXhr(b, c, a) {
    if (!a.success) {
        a = $.extend({}, a, {
            success: function(d, e) {
                if (d.exception) {
                    if (d.exception.statusCode == 1) {
                        alert("系统错误,请联系客服人员")
                    } else {
                        alert(d.exception.message)
                    }
                    reloadToken()
                } else {
                    if (a.successHandler) {
                        hitch(a, "successHandler")(d, e)
                    } else {
                        // alert($(f).attr("name"));
                    }
                }
            }
        })
    }
    if (!a.error) {
        a = $.extend({}, a, {
            error: function(d, g, e) {
                if (d.status == 502 || d.status == 900) {
                    $(this).sConfirm({
                        type: "open",
                        title: "温馨提示",
                        content: "您未登陆，是否要进入登陆界面？",
                        conf: function(h) {
                            clearLoginInfo();
                            window.location.href = commonLoginUrl
                        }
                    })
                } else {
                    if (d.status == 603) {
                        $(this).sAlert({
                            type: "open",
                            title: "温馨提示！",
                            content: "服务器忙,请稍后再试"
                        })
                    } else {
                        if (d.status == 604) {
                            $(this).sAlert({
                                type: "open",
                                title: "温馨提示！",
                                content: "重复提交，请刷新页面后再进行修改"
                            })
                        } else {}
                    }
                }
                if (a.errorHandler) {
                    hitch(a, "errorHandler")(g, d)
                }
            }
        })
    }
    $.ajax(this._ajaxOptions(b, c, a))
}
// 异步获取
function asyncXhrGet(b, c, a) {
    a = $.extend({}, a, {
        type: "GET"
    });
    asyncXhr(b, c, a)
}
// 异步设置
function asyncXhrPost(b, c, a) {
    a = $.extend({}, a, {
        type: "POST"
    });
    asyncXhr(b, c, a)
}
// 同步
function syncXhr(c, e, b) {
    var d, a = this._ajaxOptions(c, e, b);
    $.extend(a, {
        async: false,
        success: function(g, h) {
            d = g
        },
        error: b.error ? b.error : function(h, j, i) {
            d = {};
            var g = {};
            g.message = "Error occurs when fetching data from url:" + this.url;
            g.cause = j ? j : i;
            d.exception = g;
            if (h.status == 502) {
                $(this).sConfirm({
                    type: "open",
                    title: "温馨提示",
                    content: "您未登陆，是否要进入登陆界面？",
                    conf: function(k) {
                        clearLoginInfo();
                        window.location.href = commonLoginUrl
                    }
                })
            } else {
                if (h.status == 604) {
                    $(this).sAlert({
                        type: "open",
                        title: "温馨提示！",
                        content: "重复提交，请刷新页面后再进行修改"
                    })
                }
            }
        }
    });
    $.ajax(a);
    return d
}
// 同步获取
function syncXhrGet(b, c, a) {
    a = $.extend({}, a, {
        type: "GET"
    });
    return syncXhr(b, c, a)
}
// 同步设置
function syncXhrPost(b, c, a) {
    a = $.extend({}, a, {
        type: "POST"
    });
    return syncXhr(b, c, a)
}
// ajax选项
function _ajaxOptions(d, e, c) {
	var commonToken;
    if (!c.cache) {
        d = makeRealVersionUrl(d)
    }
    d += ((/\?/.test(d)) ? "&" : "?") + "_t=" + commonToken;
    var b = {};
    if (arguments.length === 1) {
        b = d
    } else {
        b = c || {};
        b.url = d;
        if (e) {
            if (isString(e) || $(e).is("form")) {
                var a = this._ajaxFormToObj(e);
                $.extend(b, {
                    data: a
                })
            } else {
                $.extend(b, {
                    data: e
                })
            }
        }
    }
    return b
}

// 刷新
function reloadToken() {
    if (commonToken != "") {
        var a = syncXhrGet(commonTokenUrl);
        commonToken = a
    }
}
// 判断字符串
function isString(a) {
    return typeof a === "string" || a instanceof String
}
// ajax表单Obj对象
function _ajaxFormToObj(c) {
    c = _getForm(c);
    if (!c) {
        return {}
    }
    var b = {}
      , a = "file|submit|image|reset|button|";
    $.each(c.elements, function(g, j) {
        var d = j.name
          , h = (j.type || "").toLowerCase();
        if (d && h && a.indexOf(h) === -1 && !j.disabled) {
            _ajaxSetValue(b, d, _ajaxFieldValue(j))
        }
    });
    return b
}
// 获取表单
function _getForm(a) {
    var b = a;
    if (this.isString(a)) {
        b = $("#" + a);
        if (b.length == 0) {
            b = $("form[name='" + a + "']")
        }
    }
    return (b instanceof jQuery) ? b.get(0) : b
}
// ajax设定值
function _ajaxSetValue(c, a, b) {
    if (b === null) {
        return
    }
    var d = c[a];
    if (isString(d)) {
        c[a] = [d, b]
    } else {
        if ($.isArray(d)) {
            c[a].push(b)
        } else {
            c[a] = b
        }
    }
}
// ajax选项值
function _ajaxFieldValue(c) {
    var a = null
      , b = (c.type || "").toLowerCase();
    if (c.name && b && !c.disabled) {
        if (b === "radio" || b === "checkbox") {
            if (c.checked) {
                a = c.value
            }
        } else {
            if (c.multiple) {
                a = [];
                $("option", c).each(function() {
                    if (this.selected) {
                        a.push(this.value)
                    }
                })
            } else {
                a = c.value
            }
        }
    }
    return a
}

var map = {
    emailReg: "/^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/",
    telReg: "/^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$/",
    mobileReg: "/^1[3|4|5|6|7|8|9][0-9]\\d{8}$/",
    zipCodeReg: "/^[1-9][0-9]{5}$/"
};
var key = "";
var errorMsg = ""
  , errorNums = 0
  , exclude = "email|tel|mobile|zipCode|";

// 错误显示区域
function errorShowForArea(b, a) {
    errorNums++;
    if (errorNums == 1) {
        $(b).focus()
    }
    if ($(b).parent().siblings(".error_div").length == 0) {
        $("<div class='error_div' align='right'>" + a + "</div>").insertAfter($(b).parent())
    }
}
// 错误隐藏区域
function errorHideForArea(a) {
    $(a).parent().siblings(".error_div").remove()
}
// 错误显示
function errorShow(b, a) {
    errorNums++;
    if (errorNums == 1) {
        $(b).focus()
    }
    if ($(b).siblings(".error_div").length == 0) {
        $("<div class='error_div'>" + a + "</div>").insertAfter($(b))
    }
}
// 错误隐藏
function errorHide(a) {
    $(a).siblings(".error_div").remove()
}
// 验证表单
function validateForm(form) {
    errorNums = 0;
    var context = document.body;
    $(context).find("[notNull]").each(function(i, n) {
        if ($(this).attr("notNull") == "true") {
            if ($.trim(this.value) == "") {
                errorMsg = "输入不能为空";
                errorShow(this, errorMsg)
            } else {
                errorHide(this)
            }
        }
    });
    $(context).find("[areaNotNull]").each(function(i, n) {
        if ($(this).attr("areaNotNull") == "true") {
            if ($.trim(this.value) == "") {
                errorMsg = "请选择省市区";
                errorShowForArea(this, errorMsg)
            } else {
                errorHideForArea(this)
            }
        }
    });
    $(context).find("[regex]").each(function() {
        if ($.trim(this.value) != "") {
            var type = $(this).attr("regex");
            errorMsg = "输入不合法";
            key = type + "Reg";
            if (exclude.indexOf(type) != -1) {
                if (!eval(map[key]).test(obj.value)) {
                    errorShow(obj, errorMsg)
                } else {
                    errorHide(obj)
                }
            } else {
                try {
                    if (!eval(type).test(obj.value)) {
                        errorShow(obj, errorMsg)
                    } else {
                        errorHide(obj)
                    }
                } catch (e) {
                    errorMsg = "正则表达式不正确";
                    errorShow(obj, errorMsg)
                }
            }
        }
    });
    if (errorNums > 0) {
        return false
    }
    return true
}
// 显示一般错误信息
function showGeneralErrorInfo(b, a) {
    $(".notice-title").html(a);
    $(".notice").parents("li").addClass("error")
}
// 清除一般错误信息
function clearGeneralErrorInfo() {
    $(".notice").parent("li").removeClass("error");
    $(".notice-title").html("");
    $(".notice-body").html("")
}
// 匹配空或不存在
function matchNull(a) {
    if (a == undefined || a == null || a == "") {
        return true
    } else {
        return false
    }
}
// 匹配邮箱
function matchEmail(email) {
    return eval(map.emailReg).test(email)
}
// 匹配电话
function matchMobile(mobile) {
    return eval(map.mobileReg).test(mobile)
}
// 匹配手机
function matchTelphone(phone) {
    return eval(map.telReg).test(phone)
}
// 一般验证
function generalValidate(a, c, b) {
    if (b.isNotNull == true) {
        if (matchNull(c)) {
            return a + "不能为空"
        }
    }
    if (b.vemail == true) {
        if (!matchEmail(c)) {
            return a + "不符合邮箱格式"
        }
    }
    if (b.vmobile == true) {
        if (!matchMobile(c)) {
            return a + "不符合手机格式"
        }
    }
    if (b.reg) {
        if (!b.reg.test(c)) {
            return a + "不符合规定格式"
        }
    }
    if (b.min) {
        if (!matchNull(c) && c.length < b.min) {
            return a + "位数不能小于" + b.min
        }
    }
    if (b.max) {
        if (!matchNull(c) && c.length > b.max) {
            return a + "位数不能大于" + b.max
        }
    }
    return null
}
var regional = [];
var region = "";
function i18n(b, a) {
    return getLocaleMsg(b, a)
}

function getLocaleMsg(g, c) {
    var a = this.regional[this.region][g];
    if (a === undefined || a === null) {
        a = this.regional[this.region][""]
    }
    if (a === undefined || a === null) {
        return g
    }
    if (!c) {
        return a
    }
    if (!$.isArray(c)) {
        c = [c]
    }
    var e = a.match(/\{\d+\}/ig);
    if (!e || e.length === 0) {
        return a
    }
    a = a.replace(/\{\d+\}/ig, "#");
    for (var d = 0; d < e.length; d++) {
        var b = parseInt(e[d].replace(/\{/, "").replace(/\}/, ""));
        a = a.replace(/\#/, (c[b] != undefined && c[b] != null) ? "" + c[b] : "")
    }
    return a
}
// 初始化
function initRegion() {
    this.region = getLanguage()
}
// 获取语言
function getLanguage() {
    return navigator.language || navigator.browserLanguage
}
// 输入空判断
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
// 分页
function fnGetPageHtml(h, j, k) {
    var a = "";
    var d = 1;
    if (h < 1) {
        return ""
    }
    var l = h;
    if (j > h) {
        j = h
    }
    var c = 1;
    var g = h;
    if (j > 1) {
        c = j - 1
    }
    if (j < h) {
        g = j + 1
    }
    var b = false;
    var m = false;
    if (j - 3 > 1) {
        d = j - 3
    }
    if (j + 2 < h) {
        l = j + 2
    }
    if (d > 1 + 1) {
        b = true
    }
    if (l < h - 1) {
        m = true
    }
    if (j != 1) {
        a += '<a href="javascript:void(0);" onClick="' + k + "(" + c + ')" class="first">上一页</a>'
    } else {
        a += '<a href="javascript:void(0)" class="first">上一页</a>'
    }
    if (d != 1) {
        a += '<a href="javascript:void(0);" onClick="' + k + '(1)" >1</a>'
    }
    if (b) {
        a += '<a href="javascript:void(0)">..</a>'
    }
    for (var e = d; e <= l; e++) {
        a += fnMakeLink(e, j, h, k)
    }
    if (m) {
        a += '<a href="javascript:void(0)">..</a>'
    }
    if (l != h) {
        a += '<a href="javascript:void(0);" onClick="' + k + "(" + h + ')" >' + h + "</a>"
    }
    if (j != h) {
        a += '<a href="javascript:;void(0)" onClick="' + k + "(" + g + ')" class="last">下一页</a>'
    } else {
        a += '<a href="javascript:void(0)" class="last">下一页</a>'
    }
    return a
}
// 分页链接
function fnMakeLink(e, d, b, a) {
    var c = "<a ";
    if (e == d) {
        c += 'class="selected" ';
        c += 'href="javascript:void(0)"'
    } else {
        c += 'href="javascript:void(0);" onclick=';
        c += a;
        c += "(" + e + ")"
    }
    c += ">";
    c += e;
    c += "</a>";
    return c
}

Date.prototype.format = function(b) {
    var c = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(b)) {
        b = b.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var a in c) {
        if (new RegExp("(" + a + ")").test(b)) {
            b = b.replace(RegExp.$1, RegExp.$1.length == 1 ? c[a] : ("00" + c[a]).substr(("" + c[a]).length))
        }
    }
    return b
};

function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(c) {
        var a = "";
        var l, j, g, k, h, e, d;
        var b = 0;
        c = _utf8_encode(c);
        while (b < c.length) {
            l = c.charCodeAt(b++);
            j = c.charCodeAt(b++);
            g = c.charCodeAt(b++);
            k = l >> 2;
            h = ((l & 3) << 4) | (j >> 4);
            e = ((j & 15) << 2) | (g >> 6);
            d = g & 63;
            if (isNaN(j)) {
                e = d = 64
            } else {
                if (isNaN(g)) {
                    d = 64
                }
            }
            a = a + _keyStr.charAt(k) + _keyStr.charAt(h) + _keyStr.charAt(e) + _keyStr.charAt(d)
        }
        return a
    }
    ;
    this.decode = function(c) {
        var a = "";
        var l, j, g;
        var k, h, e, d;
        var b = 0;
        c = c.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (b < c.length) {
            k = _keyStr.indexOf(c.charAt(b++));
            h = _keyStr.indexOf(c.charAt(b++));
            e = _keyStr.indexOf(c.charAt(b++));
            d = _keyStr.indexOf(c.charAt(b++));
            l = (k << 2) | (h >> 4);
            j = ((h & 15) << 4) | (e >> 2);
            g = ((e & 3) << 6) | d;
            a = a + String.fromCharCode(l);
            if (e != 64) {
                a = a + String.fromCharCode(j)
            }
            if (d != 64) {
                a = a + String.fromCharCode(g)
            }
        }
        a = _utf8_decode(a);
        return a
    }
    ;
    _utf8_encode = function(b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var e = 0; e < b.length; e++) {
            var d = b.charCodeAt(e);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    }
    ;
    _utf8_decode = function(a) {
        var b = "";
        var d = 0;
        var e = c1 = c2 = 0;
        while (d < a.length) {
            e = a.charCodeAt(d);
            if (e < 128) {
                b += String.fromCharCode(e);
                d++
            } else {
                if ((e > 191) && (e < 224)) {
                    c2 = a.charCodeAt(d + 1);
                    b += String.fromCharCode(((e & 31) << 6) | (c2 & 63));
                    d += 2
                } else {
                    c2 = a.charCodeAt(d + 1);
                    c3 = a.charCodeAt(d + 2);
                    b += String.fromCharCode(((e & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    d += 3
                }
            }
        }
        return b
    }
}

// 跳转用处
function isUseful() {
    return typeof philips != "undefined" && typeof philips.analytics != "undefined"
}

// 确定按钮
function determineButtonOmi(b, c) {
    var a = {
        name: "interaction",
        description: b + ":" + c + ":determine_button"
    };
    trackConversionOmi(a)
}

// 跟踪跳转
function trackConversionOmi(a) {
    if (isUseful()) {
        philips.analytics.trackConversion(a)
    }
}
// 跟踪转换
function trackConversion(b) {
    var a = {
        name: "buy_at_philips",
        product: b
    };
    trackConversionOmi(a)
}

// function processImgUrl(e, c) {
//     if (null == e || "" == e) {
//         return defaultImg
//     }
//     var b = e.lastIndexOf(".");
//     var d = e.lastIndexOf("_");
//     var a = "";
//     if (d != -1) {
//         a += e.substring(0, d)
//     } else {
//         a += e.substring(0, b)
//     }
//     if ("source" != c) {
//         a += "_";
//         a += c
//     }
//     a += e.substring(b);
//     return imgbase + a
// };

$('html').ajaxStart(function(){
    $('#overlay').show();
})
$('html').ajaxStop(function(){
    setTimeout(function () {
        $('#overlay').hide();
    }, 2000)
})



