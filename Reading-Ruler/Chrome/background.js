
let localCacheStorage = {};

// On chrome extension Install/Update
chrome.runtime.onInstalled.addListener(function (details) {
    var thisVersion = chrome.runtime.getManifest().version;

    if (details.reason == "install" || (details.reason == "update" && thisVersion === '4.0')) {
        localCacheStorage = {
            colour: "#8cfc03",
            lineColour: "#33aa3334", // colour of the bottom edge of the bar
            scale: 1.05, // how many times the text's line-height should the bar's height be
            shadow: 0.08, // opacity of the bar's shadow (0 to 1)
        };

        chrome.storage.local.set({ 'settings': localCacheStorage }, function () { });
    }
});

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'ruler':
            displayRuler();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method in this) {
        this[request.method](request, sender, sendResponse);
    }
});

chrome.storage.local.get('settings', function (result) {
    if (result) {
        localCacheStorage = result.settings;
    }
})

function displayRuler() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            storage: localCacheStorage
        });
    });
}

function updateLocalStorage(request, sender, sendResponse) {
    localCacheStorage = request.extra;
    chrome.storage.local.set({ 'settings': request.extra }, function () { });
};