function typechange(type) {
	$(".SortA").css("display","none");
	$(".SortB").css("display","none");
    if (type.value == 0)  {
		$(".SortA").css("display","flex");
		$(".SortB").css("display","none");
    } else {
		$(".SortA").css("display","none");
		$(".SortB").css("display","flex");
		}

    //Radio change 收合開啟
    $('input[type="radio"][name="inquiretype"]').on('click change', function(e) {
			// console.log(e.type);
			$('#title').addClass('active_accordion');
			$('.confirm,.search,#renderout').css('display','inline-block');
	});
}