

/*验证demo表单start*/
$(function(){

    // login
    



    // forgetPassword
    $('#findway').on('change', function(){
        var _this = $(this);
        console.log(_this.val());
        if(_this.val() == 'mobile'){
            $('.mobilelDIV').show().siblings().hide();
            return false;
        }else if(_this.val() == 'email'){
            $('.emailDIV').show().siblings().hide();
            return false;
        }else if(_this.val() == 'question'){
            $('.questionDIV').show().siblings().hide();
            return false;
            
        }
    });



    $('#form').on('submit', function(){
        event.preventDefault();
        $(this).validate('')
    });

})



$(function(){
    // login
    // var userName = $('#userName').val();
    // var userPass = $('#userPass').val();
    // var verification = $('verification').val();
    // $('#btnSure').on('click', function(){
    //     var _this = $(this);
    //     if(userName == '' || userName == null){
    //         $('#loginNameError').html('<p id="loginNameError" class="hint">请输入密码</p>');
    //     }
    //     if(userPass == '' || userPass == null){
    //         $('#loginPassError').html('<p id="loginPassError" class="hint">请输入密码</p>');
    //     }
    //     if(verification == '' || verification == null){
    //         $('#loginCodeError').html('<p class="hint"><i class="fa fa-times"></i> 请输入效验码</p>')
    //     }
    // })

   
    
})