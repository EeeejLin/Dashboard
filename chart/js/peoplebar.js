function peoplebar(numerator, denominator, bar) {
    if (denominator===0) {
        document.getElementById(bar).style.width = "0%";
    }
    else {
        document.getElementById(bar).style.width = numerator/denominator*100 + "%";
    }
}
