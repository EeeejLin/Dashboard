function drawchart(chart,fill){
    var $ppc = $('.'+chart),
    percent = parseInt($ppc.data('percent')),
    deg = 360*percent/100;
if (percent > 50) {
    $ppc.addClass('gt-50');
}
$('.'+fill).css('transform','rotate('+ deg +'deg)');
};