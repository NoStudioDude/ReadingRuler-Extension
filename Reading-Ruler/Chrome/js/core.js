// Variables
let bar = undefined;
let port = chrome.runtime.connect({ name: "core" });;
let localCacheStorage = {};

// 999 = selected keyboard key
let keyMap = { Shift: undefined, Control: undefined, 999: undefined };
let currentKeyMap = { Shift: undefined, Control: undefined, 999: undefined };

// DOM Events
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Event Listeners

try {
    port.onMessage.addListener(function () { });
} catch (e) {
    unregisterSelf();
}

function initializeComponents() {
    var activeBar = document.getElementById("reader-ruler");
    if(!activeBar)
    {
        createBar();
    }

    keyMap["Control"] = localCacheStorage.useCTRL;
    keyMap["Shift"] = localCacheStorage.useSHIFT;
    keyMap[999] = localCacheStorage.useKEY;
}

function initializeSettings()
{
    chrome.storage.local.get('settings', function(result) {
        if(result) {
            localCacheStorage = result.settings;
            initializeComponents();
        } else {
            console.error('no settings in store');
        }
    })
}

// Event Handler methods
function onMouseMove(ev) {
    if(localCacheStorage.isActive) {
        var scrollTop = (window.pageYOffset !== undefined) 
            ? window.pageYOffset 
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        bar.style.top = (ev.pageY - scrollTop) + "px";
    
        const size = document.defaultView.getComputedStyle(ev.target).getPropertyValue("line-height");
        const [m, num, unit] = (size && size.match(/([\d\.]+)([^\d]+)/)) || [];
        bar.style.height = m ? num * localCacheStorage.scale + unit : "1em";
    }
}

function onKeyDown(ev) {
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
}

function onKeyUp(ev) {
    if (ev.key in currentKeyMap) {
        currentKeyMap[ev.key] = false;
    }

    currentKeyMap[999] = undefined;
}

// Core function
function unregisterSelf() {
    console.log('unregister myself, exception occured when receiving or sending a message to background');

    port = null;
    bar = null;
    localCacheStorage = null;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
}

function createBar() {
    bar = document.createElement("div")
    bar.id = "reader-ruler";
    bar.style.left = 0;
    bar.style.right = 0;
    bar.style.height = "1em";
    bar.style.position = "fixed";
    bar.style.transform = "translateY(-50%)";
    bar.style.display = "none";
    bar.style.pointerEvents = "none";
    bar.style.transition = "120ms height";
    bar.style.zIndex = 2147483647;
    applyBarStyle();

    document.body.appendChild(bar);
}

function applyBarStyle()
{
    var rbgColor = hexToRgb(localCacheStorage.colour);
    bar.style.backgroundColor = `rgba(${rbgColor.r}, ${rbgColor.g}, ${rbgColor.b}, ${localCacheStorage.shadow})`;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

function toggle() {
    var vis = !localCacheStorage.isActive;
    localCacheStorage.isActive = vis;

    // Get reference to current bar
    // If we dont find it we create it again
    var activeBar = document.getElementById("reader-ruler");
    if(activeBar) {
        bar = activeBar;
    } else {
        createBar();
    }
    
    bar.style.display = vis ? "block" : "none";
    
    // var badgeText = vis ? "on" : "";
    // chrome.browserAction.setBadgeText({text: badgeText});
    try {
        chrome.runtime.sendMessage({method: "updateLocalStorage", extra: localCacheStorage});
    } catch (e) {
        unregisterSelf();
    }
}

// Initialize Core
initializeSettings();