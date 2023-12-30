var app = {

    settings: {},

    init: function () {
        var color = document.getElementById("color-picker-input");
        var opacity = document.getElementById("rule-opacity");
        var btnSave = document.getElementById("btnSave");

        chrome.storage.local.get('settings', function (result) {
            console.log("load settings in popup");
            if (result) {
                console.log(result);
                app.settings = result.settings;
                color.value = app.settings.colour;
                opacity.value = app.settings.shadow;

            } else {
                console.error('no settings in store');
            }
        });

        btnSave.addEventListener('click', function (ev) {
            console.log(app.settings);
            chrome.runtime.sendMessage({ method: "updateLocalStorage", extra: app.settings });
        });

        color.addEventListener('change', function (ev) {
            app.settings.colour = ev.target.value;
        });

        opacity.addEventListener('change', function (ev) {
            app.settings.shadow = ev.target.value;
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    app.init();
});