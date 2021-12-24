jQuery(function($){
	$(document).ajaxSend(function() {
		$("#overlay").fadeIn(5000);　
	});
		
	$('#button').click(function(){
		$.ajax({
			type: 'GET',
			success: function(data){
				console.log(data);
			}
		}).done(function() {
			setTimeout(function(){
				$("#overlay").fadeOut(300);
			},500);
		});
	});	
});