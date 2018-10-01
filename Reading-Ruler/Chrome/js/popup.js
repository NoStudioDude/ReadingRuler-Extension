let isFocused = false;

document.addEventListener('keydown', doKeyPress, false);
function doKeyPress(ev){
    
    if(isFocused){
        document.getElementById("inputKEY").value = ev.key;
        localStorage.setItem("useKEY", ev.key);
    }
};

$(document).on("focus", '#inputKEY', function () {
    isFocused = true;
});

$(document).on("focusout", '#inputKEY', function () {
    isFocused = false;
});

$(document).on("change", '#chkCTRL', function () {
    localStorage.setItem("useCTRL", document.getElementById("chkCTRL").checked);
});

$(document).on("change", '#chkALT', function () {
    localStorage.setItem("useALT", document.getElementById("chkALT").checked);
});

$(document).on("change", '#chkSHIFT', function () {
    localStorage.setItem("useSHIFT", document.getElementById("chkSHIFT").checked);
});

window.onload = function () {
    document.getElementById("inputKEY").value = localStorage.useKEY;
    document.getElementById("chkCTRL").checked = JSON.parse(localStorage.useCTRL);
    document.getElementById("chkALT").checked = JSON.parse(localStorage.useALT);
    document.getElementById("chkSHIFT").checked = JSON.parse(localStorage.useSHIFT);
}