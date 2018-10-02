var console = chrome.extension.getBackgroundPage().console;

var app = {

    settings: {},

    init: function() {
        var inputKey = document.getElementById("inputKEY");
        var chkCTRL = document.getElementById("chkCTRL");
        var chkALT = document.getElementById("chkALT");
        var chkSHIFT = document.getElementById("chkSHIFT");

        chrome.runtime.sendMessage({method: "getLocalStorage"}, function(response){
            app.settings = response;
            
            inputKey.value = app.settings.useKEY;
            chkCTRL.checked = JSON.parse(app.settings.useCTRL);
            chkALT.checked = JSON.parse(app.settings.useALT);
            chkSHIFT.checked = JSON.parse(app.settings.useSHIFT);
        });

        inputKey.addEventListener('keydown', function(ev){
            app.settings.useKEY = ev.key;
            inputKey.value = ev.key;

            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });

        chkCTRL.addEventListener('change', function(ev){
            app.settings.useCTRL = ev.target.checked;
            
            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });

        chkALT.addEventListener('change', function(ev){
            app.settings.useALT = ev.target.checked;
            
            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });

        chkSHIFT.addEventListener('change', function(ev){
            app.settings.useSHIFT = ev.target.checked;
            
            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });
    }
};

document.addEventListener("DOMContentLoaded", function() {
    app.init();
});