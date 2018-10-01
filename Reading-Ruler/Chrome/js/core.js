const conf = {
    colour: "#55cc551c",
    lineColour: "#33aa3334", // colour of the bottom edge of the bar
    scale: 1.05, // how many times the text's line-height should the bar's height be
    shadow: 0.08, // opacity of the bar's shadow (0 to 1)
    key: 'y',
    visible: false
};

const bar = document.createElement("div");
bar.id = "reader";
bar.style.left = 0;
bar.style.right = 0;
bar.style.height = "1em";
bar.style.backgroundColor = conf.colour;
bar.style.borderBottom = conf.lineColour ? `1px ${conf.lineColour} solid` : void 0;
bar.style.position = "fixed";
bar.style.transform = "translateY(-50%)";
bar.style.display = "none";
bar.style.pointerEvents = "none";
bar.style.transition = "120ms height";
bar.style.boxShadow = `0 1px 4px rgba(0, 0, 0, ${conf.shadow})`;
bar.style.zIndex = 9999999;
document.body.appendChild(bar);

let lastKeyPressed;

// 17 = CTRL
// 18 = ALT
// 16 = SHIFT

var map = {16: false, 17: false, 18: false};
//$(document).keydown(function(e) {
//    if (e.keyCode in map) {
//        map[e.keyCode] = true;
//        if (map[68] && map[69] && map[86]) {
//            // FIRE EVENT
//        }
//    }
//}).keyup(function(e) {
//    if (e.keyCode in map) {
//        map[e.keyCode] = false;
//    }
//});

document.addEventListener('keydown', doKeyPress, false);
document.addEventListener('keyup', doKeyUp, false);

function doKeyPress(ev){
    chrome.runtime.sendMessage({method: "getStorage"}, function(response) {
        var storage = response.data;
        
        if (e.keyCode in map) {
            map[e.keyCode] = true;
            
        }
    });

    if (e.keyCode in map) {
        map[e.keyCode] = true;
        if(map[16] && map[16] && map[16])
        {
            toggle();
        }
    }

    

	if(lastKeyPressed === 'Control' && ev.key === conf.key){
        
    }

    lastKeyPressed = ev.key;
}

function doKeyUp(e){

}

const toggle = function(){
    conf.visible = !conf.visible;
    bar.style.display = conf.visible ? "block" : "none";
};

document.addEventListener('mousemove', function (ev) 
{
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    bar.style.top = (ev.pageY - scrollTop) + "px";

    if(conf.visible){ 
        const size = document.defaultView.getComputedStyle(ev.srcElement).getPropertyValue("line-height");
        const [m, num, unit] = (size && size.match(/([\d\.]+)([^\d]+)/)) || [];
        bar.style.height = m ? num * conf.scale + unit : "1em";
    }
    
}, false);