// Variables
let core = {};
let localCacheStorage = {};

// On chrome extension Install/Update
chrome.runtime.onInstalled.addListener(function(details){
    var thisVersion = chrome.runtime.getManifest().version;

    if(details.reason == "install" || (details.reason == "update" && thisVersion === '3.0.1')) {
        let storage = {
            useCTRL: true,
            useSHIFT: false,
            useKEY: 'y',
            isActive: false,
            colour: "#8cfc03",
            lineColour: "#33aa3334", // colour of the bottom edge of the bar
            scale: 1.05, // how many times the text's line-height should the bar's height be
            shadow: 0.08, // opacity of the bar's shadow (0 to 1)
        };
        
        chrome.storage.local.set({'settings': storage}, function() {});

    } else if(details.reason == "update") {
        // console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }

    this.initializeStorage();
});

// Listener events
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "core"){
        core = port;
        port.postMessage({settings: localCacheStorage});
    }
});        

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method in this) {
        this[request.method](request, sender, sendResponse);
    }
});

// Background functions
function initializeStorage() {
    chrome.storage.local.get('settings', function(result) {
        if(result) {
            localCacheStorage = result.settings;
        } else {
            console.error('no settings in store');
        }
    })
};

function getLocalStorage(request, sender, sendResponse) {
    sendResponse(localCacheStorage);
};

function updateLocalStorage(request, sender, sendResponse) {
    localCacheStorage.useCTRL = request.extra.useCTRL;
    localCacheStorage.useSHIFT = request.extra.useSHIFT;
    localCacheStorage.useKEY = request.extra.useKEY;
    localCacheStorage.isActive = request.extra.isActive;
    localCacheStorage.colour = request.extra.colour;
    localCacheStorage.shadow = request.extra.shadow;

    chrome.storage.local.set({'settings': localCacheStorage}, function() {});
    core.postMessage({settings: localCacheStorage});
};