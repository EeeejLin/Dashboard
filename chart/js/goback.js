function goBack() {
    history.go(-1);
}
window.onpageshow = function(event) {
    if (event.persisted || window.performance &&
        window.performance.navigation.type == 2) {
        window.location.reload();
    }
}