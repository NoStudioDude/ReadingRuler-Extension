var app = {

    settings: {},

    init: function() {
        var inputKey = document.getElementById("inputKEY");
        var chkCTRL = document.getElementById("chkCTRL");
        var chkSHIFT = document.getElementById("chkSHIFT");

        chrome.storage.local.get('settings', function(result) {
            if(result) {
                app.settings = result.settings;

                inputKey.value = app.settings.useKEY;
                chkCTRL.checked = app.settings.useCTRL;
                chkSHIFT.checked = app.settings.useSHIFT;

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
    }
};

document.addEventListener("DOMContentLoaded", function() {
    app.init();
});