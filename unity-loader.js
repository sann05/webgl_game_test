var unityInstance = null; // Global declaration for the Unity instance
var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");
var selectedWidth = 0;
var selectedHeight = 0;
const aspectRatio = 9 / 16;

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
var loaderUrl = buildUrl + "/{{{ LOADER_FILENAME }}}";
var config = {
    dataUrl: buildUrl + "/{{{ DATA_FILENAME }}}",
    frameworkUrl: buildUrl + "/{{{ FRAMEWORK_FILENAME }}}",
    workerUrl: buildUrl + "/{{{ WORKER_FILENAME }}}",
    codeUrl: buildUrl + "/{{{ CODE_FILENAME }}}",
    streamingAssetsUrl: "StreamingAssets",
    companyName: {{{ JSON.stringify(COMPANY_NAME) }}},
productName: { { { JSON.stringify(PRODUCT_NAME) } } },
productVersion: { { { JSON.stringify(PRODUCT_VERSION) } } },
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
}

function hideResolutionButtons() {
    const buttons = document.getElementById('resolution-buttons');
    buttons.style.display = 'none';
}

function initializeUnity(width, height) {
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        var devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
    } else {
        canvas.width = width;
        canvas.height = height;
    }

    loadingBar.style.display = "block";

    if (!window.createUnityInstance) {
        var script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            createUnityInstance(canvas, config, (progress) => {
                progressBarFull.style.width = 100 * progress + "%";
            }).then((instance) => {
                unityInstance = instance;
                loadingBar.style.display = "none";
                if (fullscreenButton) {
                    fullscreenButton.onclick = () => {
                        unityInstance.SetFullscreen(1);
                    };
                }
            }).catch((message) => {
                alert(`Failed to load Unity instance: ${message}`);
            });
        };
        document.body.appendChild(script);
    } else {
        createUnityInstance(canvas, config, (progress) => {
            progressBarFull.style.width = 100 * progress + "%";
        }).then((instance) => {
            unityInstance = instance;
            loadingBar.style.display = "none";
            if (fullscreenButton) {
                fullscreenButton.onclick = () => {
                    unityInstance.SetFullscreen(1);
                };
            }
        }).catch((message) => {
            alert(`Failed to load Unity instance: ${message}`);
        });
    }
}

// Добавляем обработчики для кнопок
document.getElementById('low-res').onclick = () => {
    selectedWidth = Math.min(window.innerWidth, 480);
    selectedHeight = selectedWidth * aspectRatio;
    hideResolutionButtons();
    initializeUnity(selectedWidth, selectedHeight);
};

document.getElementById('medium-res').onclick = () => {
    selectedWidth = Math.min(window.innerWidth, 720);
    selectedHeight = selectedWidth * aspectRatio;
    hideResolutionButtons();
    initializeUnity(selectedWidth, selectedHeight);
};

document.getElementById('high-res').onclick = () => {
    selectedWidth = Math.min(window.innerWidth, 1080);
    selectedHeight = selectedWidth * aspectRatio;
    hideResolutionButtons();
    initializeUnity(selectedWidth, selectedHeight);
};
