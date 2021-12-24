function drop() {
    var menudrop = document.getElementById("menudrop");
    if (menudrop.style.display === "none") {
      menudrop.style.display = "block";
      menudrop.style.borderTop = "3px solid rgba(46,61,73,.15)";
      menudrop.style.paddingTop = "30px";
      navbar.style.paddingBottom = "30px";     
    } else {
      menudrop.style.display = "none";
      navbar.style.paddingBottom = "0px";  
    }   
};