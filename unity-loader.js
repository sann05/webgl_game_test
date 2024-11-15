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
var loaderUrl = buildUrl + "/WGL_UnigramTest.loader.js";
var config = {
    dataUrl: buildUrl + "/94ac73416deb8c0d7efa827d03021f9c.data.unityweb",
    frameworkUrl: buildUrl + "/e463331b023b365fcb6050b05a951209.js.unityweb",
    codeUrl: buildUrl + "/28225f21edc4a43a130bcfc9ce32f234.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "KorubovGames",
    productName: "ZombieTrain",
    productVersion: "1.223",
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

// Telegram WebApp integration and initialization
function initializeTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.expand(); // Expands the mini-app to full screen

        console.log("Telegram WebApp initialized.");
    } else {
        console.log("Telegram WebApp API not available.");
    }
}

// Function to retrieve user data from Telegram
function requestTelegramUserData() {
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            const userData = {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username
            };
            // Send the user data to Unity
            if (unityInstance) {
                unityInstance.SendMessage('TelegramManager', 'ReceiveUserData', JSON.stringify(userData));
            } else {
                console.log("Unity instance not yet available.");
            }
        } else {
            console.log("No user data found.");
        }
    } else {
        console.log("Telegram WebApp API not available.");
    }
}

// Check Telegram WebApp connection and handle updates
function checkTelegramConnection() {
    if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp is connected.");
        window.Telegram.WebApp.onEvent('update', () => {
            console.log('Telegram data updated');
            requestTelegramUserData(); // Fetch user data when there's an update event
        });
    } else {
        alert("Telegram WebApp API not available.");
    }
}

// Initialize Telegram and check connectivity
initializeTelegram();
checkTelegramConnection();
