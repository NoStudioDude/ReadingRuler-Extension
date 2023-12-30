let bar = undefined;
let isActive = false;
let localCacheStorage = {};

// DOM Events
document.addEventListener('mousemove', onMouseMove);

// Event Handler methods
function onMouseMove(ev) {
    if (isActive) {
        var scrollTop = (window.scrollY !== undefined)
            ? window.scrollY
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        bar.style.top = (ev.pageY - scrollTop) + "px";

        const size = document.defaultView.getComputedStyle(ev.target).getPropertyValue("line-height");
        const [m, num, unit] = (size && size.match(/([\d\.]+)([^\d]+)/)) || [];
        bar.style.height = m ? num * localCacheStorage.scale + unit : "1em";
    }
}

// Event Listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    localCacheStorage = request.storage;
    bar = document.getElementById("reader-ruler");
    if (!bar) {
        createBar();
    }

    applyBarStyle();
    toggle();
});

// Helper Functions
function toggle() {
    isActive = !isActive;
    bar.style.display = isActive ? "block" : "none";
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

function applyBarStyle() {
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