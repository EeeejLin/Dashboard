(function ($) {
    $('.accordion > li:eq(0) a').addClass('active_accordion').next().slideDown();
    $('.accordion a').click(function (j) {
        var dropDown = $(this).closest('li').find('#officeWrapper');
        $(this).closest('.accordion').find('#officeWrapper').not(dropDown).slideUp();
        if ($(this).hasClass('active_accordion')) {
            $(this).removeClass('active_accordion');
            $('.confirm,.search,#renderout').css('display', 'none');
        } else {
            $(this).closest('.accordion').find('a.active_accordion').removeClass('active_accordion');
            $(this).addClass('active_accordion');
            $('.confirm,.search,#renderout').css('display', 'inline-block');
        }
        dropDown.stop(false, true).slideToggle();
        j.preventDefault();
    });

})(jQuery);

//確定按鈕收合
$('button#submit').click(function () {
    if ($('#title').hasClass('active_accordion')) {
        $('#title').removeClass('active_accordion');
        $('.confirm,.search,#renderout').css('display', 'none');
    }
    else {
        $('.confirm,.search,#renderout').css('display', 'inline-block');
    }
});

//Radio change 收合開啟
$('input[type="radio"][name="inquiretype"]').on('click change', function (e) {
    $('#title').addClass('active_accordion');
    $('.confirm,.search,#renderout').css('display', 'inline-block');
});
function Rchange(){
	$('input:radio[name="sortA"]').on('click change', function(e) {
	$('#title').addClass('active_accordion');
	$('.confirm,.search,#renderout').css('display','inline-block');
});
}