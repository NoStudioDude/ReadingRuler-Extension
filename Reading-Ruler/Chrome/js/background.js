var background = {

    core: {},

    settings: {},

    init: function () {
        chrome.runtime.onConnect.addListener(function(port) {
            if(port.name == "core"){
                background.core = port;
                background.core.postMessage({settings: background.settings});
            }
        });

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.method in background) {
                background[request.method](request, sender, sendResponse);
            }
        });

        if (!localStorage.isInitialized) {

            localStorage.useCTRL = true;
            localStorage.useALT = false;
            localStorage.useSHIFT = false;
            localStorage.useKEY = 'y';

            localStorage.isInitialized = true;
        }

        background.settings = localStorage;
    },

    getLocalStorage: function (request, sender, sendResponse) {
        sendResponse(background.settings);
    },

    updateLocalStorage: function (request, sender, sendResponse) {
        localStorage.useCTRL = request.extra.useCTRL;
        localStorage.useALT = request.extra.useALT;
        localStorage.useSHIFT = request.extra.useSHIFT;
        localStorage.useKEY = request.extra.useKEY;

        background.settings = localStorage;
        background.core.postMessage({settings: background.settings});
    }

};

// startup
background.init();