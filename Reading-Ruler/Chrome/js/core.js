// Variables
let bar = undefined;
let port = chrome.runtime.connect({ name: "core" });
let localCacheStorage = {};

// 999 = selected keyboard key
let keyMap = { Shift: undefined, Control: undefined, 999: undefined };
let currentKeyMap = { Shift: undefined, Control: undefined, 999: undefined };

// Event Listeners
port.onMessage.addListener(function (msg) {
    localCacheStorage = msg.settings;
    if(!bar)
    {
        createBar();
    }

    keyMap["Control"] = localCacheStorage.useCTRL;
    keyMap["Shift"] = localCacheStorage.useSHIFT;
    keyMap[999] = localCacheStorage.useKEY;
});

document.addEventListener('mousemove', function (ev) {
    if(localCacheStorage.isActive) {
        var scrollTop = (window.pageYOffset !== undefined) 
            ? window.pageYOffset 
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        bar.style.top = (ev.pageY - scrollTop) + "px";
    
        const size = document.defaultView.getComputedStyle(ev.target).getPropertyValue("line-height");
        const [m, num, unit] = (size && size.match(/([\d\.]+)([^\d]+)/)) || [];
        bar.style.height = m ? num * localCacheStorage.scale + unit : "1em";
    }
});

document.addEventListener('keydown', function (ev) {
    if (ev.key in currentKeyMap) {
        currentKeyMap[ev.key] = true;           
    }

    currentKeyMap[999] = ev.key.toLowerCase();

    if ((keyMap["Shift"] === currentKeyMap["Shift"] || (keyMap["Shift"] == false && currentKeyMap["Shift"] === undefined)) &&
        (keyMap["Control"] === currentKeyMap["Control"] || ((keyMap["Control"] == false && currentKeyMap["Control"] === undefined))) &&
        keyMap[999] === currentKeyMap[999]) 
    {
        toggle();
    }
});

document.addEventListener('keyup', function (ev) {
    if (ev.key in currentKeyMap) {
        currentKeyMap[ev.key] = false;
    }

    currentKeyMap[999] = undefined;  
});

// Core function
function createBar() {
    bar = document.createElement("div")
    bar.id = "reader";
    bar.style.left = 0;
    bar.style.right = 0;
    bar.style.height = "1em";
    bar.style.position = "fixed";
    bar.style.transform = "translateY(-50%)";
    bar.style.display = "none";
    bar.style.pointerEvents = "none";
    bar.style.transition = "120ms height";
    bar.style.zIndex = 9999999;
    bar.style.backgroundColor = localCacheStorage.colour;
    bar.style.borderBottom = localCacheStorage.lineColour ? `1px ${localCacheStorage.lineColour} solid` : void 0;
    bar.style.boxShadow = `0 1px 4px rgba(0, 0, 0, ${localCacheStorage.shadow})`;

    document.body.appendChild(bar);
}

function toggle() {
    var vis = !localCacheStorage.isActive;
    localCacheStorage.isActive = vis;
    bar.style.display = vis ? "block" : "none";
    
    var badgeText = vis ? "on" : "";

    // chrome.browserAction.setBadgeText({text: badgeText});
    chrome.runtime.sendMessage({method: "updateLocalStorage", extra: localCacheStorage});
}