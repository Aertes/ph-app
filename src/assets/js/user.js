

$(function(){
    var userName = $('#userName').val();
    var userPass = $('#userPass').val();
    var verification = $('verification').val();
    $('#btnSure').on('click', function(){
        var _this = $(this);
        if(userName == '' || userName == null){
            $('#loginNameError').html('<p id="loginNameError" class="hint">请输入密码</p>');
        }
        if(userPass == '' || userPass == null){
            $('#loginPassError').html('<p id="loginPassError" class="hint">请输入密码</p>');
        }
        if(verification == '' || verification == null){
            $('#loginCodeError').html('<p class="hint"><i class="fa fa-times"></i> 请输入效验码</p>')
        }
    })
    
})