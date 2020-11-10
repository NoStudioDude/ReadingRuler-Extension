var core = {

    port: {},

    bar: {},

    conf: {
        colour: "#55cc551c",
        lineColour: "#33aa3334", // colour of the bottom edge of the bar
        scale: 1.05, // how many times the text's line-height should the bar's height be
        shadow: 0.08, // opacity of the bar's shadow (0 to 1)
        visible: true
    },

    // 17 = CTRL
    // 18 = ALT
    // 16 = SHIFT
    // 999 = selected keyboard key
    keyMap: {},

    init: function () {
        this.port = chrome.runtime.connect({ name: "core" });
        this.port.onMessage.addListener(function (msg) {
            core.keyMap = { 16: undefined, 17: undefined, 18: undefined, 999: undefined };

            if (JSON.parse(msg.settings.useCTRL)) {
                core.keyMap[17] = false;
            }

            if (JSON.parse(msg.settings.useALT)) {
                core.keyMap[18] = false;
            }

            if (JSON.parse(msg.settings.useSHIFT)) {
                core.keyMap[16] = false;
            }

            core.keyMap[999] = msg.settings.useKEY;
        });

        this.createBar();
    },

    createBar: function () {
        this.bar = document.createElement("div")
        this.bar.id = "reader";
        this.bar.style.left = 0;
        this.bar.style.right = 0;
        this.bar.style.height = "1em";
        this.bar.style.backgroundColor = this.conf.colour;
        this.bar.style.borderBottom = this.conf.lineColour ? `1px ${this.conf.lineColour} solid` : void 0;
        this.bar.style.position = "fixed";
        this.bar.style.transform = "translateY(-50%)";
        this.bar.style.display = "block";
        this.bar.style.pointerEvents = "none";
        this.bar.style.transition = "120ms height";
        this.bar.style.boxShadow = `0 1px 4px rgba(0, 0, 0, ${this.conf.shadow})`;
        this.bar.style.zIndex = 9999999;

        document.body.appendChild(this.bar);
    },

    onMouseMove: function (ev) {
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        this.bar.style.top = (ev.pageY - scrollTop) + "px";

        if (this.conf.visible) {
            const size = document.defaultView.getComputedStyle(ev.srcElement).getPropertyValue("line-height");
            const [m, num, unit] = (size && size.match(/([\d\.]+)([^\d]+)/)) || [];
            this.bar.style.height = m ? num * this.conf.scale + unit : "1em";
        }
    },

    keyDown: function (ev) {
        if (ev.keyCode in this.keyMap) {
            this.keyMap[ev.keyCode] = true;
        }

        if ((this.keyMap[16] === undefined || this.keyMap[16]) &&
            (this.keyMap[17] === undefined || this.keyMap[17]) &&
            (this.keyMap[18] === undefined || this.keyMap[18]) &&
            this.keyMap[999] === ev.key) 
        {
            core.toggle();
        }
    },

    keyUp: function (ev) {
        if (ev.keyCode in this.keyMap) {
            this.keyMap[ev.keyCode] = false;
        }
    },

    toggle: function () {
        var vis = core.conf.visible;

        vis = !vis;
        core.bar.style.display = vis ? "block" : "none";
        core.conf.visible = vis;

        var badgeText = vis ? "on" : "";

        core.port.postMessage({text: badgeText});
    }
};

document.addEventListener('mousemove', function (ev) {
    core.onMouseMove(ev);
});

document.addEventListener('keydown', function (ev) {
    core.keyDown(ev);
});

document.addEventListener('keyup', function (ev) {
    core.keyUp(ev);
});

// StartUp
core.init();