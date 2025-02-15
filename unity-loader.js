var unityInstance = null; // Global declaration for the Unity instance
var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

// Show banners for errors or warnings
function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type === 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type === 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

// Unity build configuration
var buildUrl = "Build";
var loaderUrl = buildUrl + "/WEBGL_FuelWorks.loader.js";
var config = {
    dataUrl: buildUrl + "/d95886c3dc0930a6234873346caab4a2.data.unityweb",
    frameworkUrl: buildUrl + "/c79cc506c60432f1613509acb2c3887c.js.unityweb",
    codeUrl: buildUrl + "/1b82e21c7e35db5fdd4e2e270b2a07f3.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "KorubovGames",
    productName: "ZombieTrain_Prod",
    productVersion: "1.340",
    showBanner: unityShowBanner,
};

// Mobile device configuration
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";

    const aspectRatio = 9 / 16;
    var width = Math.min(window.innerWidth, 1080); // Limit width to 1080px max
    var height = width * aspectRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    var devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Limit the pixel ratio to reduce resolution on high-density screens
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

} else {
    canvas.style.width = "1080px";
    canvas.style.height = "1920px";
}

loadingBar.style.display = "block";

// Load the Unity WebGL build
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((instance) => {
        unityInstance = instance; // Set the global unityInstance variable
        loadingBar.style.display = "none";
        fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
        };
    }).catch((message) => {
        alert(`Failed to load Unity instance: ${message}`);
    });
};
document.body.appendChild(script);

window.Telegram.WebApp.ready();
window.Telegram.WebApp.enableClosingConfirmation();
