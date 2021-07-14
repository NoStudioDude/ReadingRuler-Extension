var app = {

    settings: {},

    init: function() {
        var inputKey = document.getElementById("inputKEY");
        var chkCTRL = document.getElementById("chkCTRL");
        var chkSHIFT = document.getElementById("chkSHIFT");
        var color = document.getElementById("color-picker-input");
        var opacity = document.getElementById("rule-opacity");

        chrome.storage.local.get('settings', function(result) {
            if(result) {
                app.settings = result.settings;

                inputKey.value = app.settings.useKEY;
                chkCTRL.checked = app.settings.useCTRL;
                chkSHIFT.checked = app.settings.useSHIFT;
                color.value = app.settings.colour;
                opacity.value = app.settings.shadow;

            } else {
                console.error('no settings in store');
            }
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

        chkSHIFT.addEventListener('change', function(ev){
            app.settings.useSHIFT = ev.target.checked;
            
            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });

        color.addEventListener('change', function(ev){
            app.settings.colour = ev.target.value;
            
            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });

        opacity.addEventListener('change', function(ev){
            app.settings.shadow = ev.target.value;
            
            chrome.runtime.sendMessage({method: "updateLocalStorage", extra: app.settings});
        });
    }
};

document.addEventListener("DOMContentLoaded", function() {
    app.init();
});