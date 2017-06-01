


$(function () {

    // cart
    var input = document.querySelector('.num input');
    var num = $('.num input').val();

    $('.ui-minus').each(function(index, element){
        
        $(this).on('click', function(){

            num --;

            if(num <= 1){
                num = 1;
            }

            input.value = num;
            console.log(num);
        })

        $('.ui-add').on('click', function(){

            num ++;

            input.value = num;


        })

    })


    // order
    

})


