var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

var buildUrl = "Build";
var loaderUrl = buildUrl + "/WEBGL_TelegramUser.loader.js";
var config = {
    dataUrl: buildUrl + "/a4063f65cfc8f4d9563172cac1620a9e.data.unityweb",
    frameworkUrl: buildUrl + "/9d333e9f68a626592a1e4f790529da95.js.unityweb",
    codeUrl: buildUrl + "/9295fec93e9b974a964d8b38f2d2ea93.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "KorubovGames",
    productName: "ZombieTrain",
    productVersion: "1.157",
    showBanner: unityShowBanner,
};

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

    var devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

} else {
    canvas.style.width = "1080px";
    canvas.style.height = "1920px";
}

loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((unityInstance) => {
        loadingBar.style.display = "none";
        fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
        };
    }).catch((message) => {
        alert(message);
    });
};

document.body.appendChild(script);
