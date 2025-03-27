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
var loaderUrl = buildUrl + "/{{{ LOADER_FILENAME }}}";
var config = {
    dataUrl: buildUrl + "/{{{ DATA_FILENAME }}}",
    frameworkUrl: buildUrl + "/{{{ FRAMEWORK_FILENAME }}}",
    #if USE_THREADS
    workerUrl: buildUrl + "/{{{ WORKER_FILENAME }}}",
    #endif
#if USE_WASM
    codeUrl: buildUrl + "/{{{ CODE_FILENAME }}}",
    #endif
    streamingAssetsUrl: "StreamingAssets",
    companyName: {{{ JSON.stringify(COMPANY_NAME) }}},
productName: { { { JSON.stringify(PRODUCT_NAME) } } },
productVersion: { { { JSON.stringify(PRODUCT_VERSION) } } },
showBanner: unityShowBanner,
};

// Добавляем функцию для создания кнопок выбора разрешения
function createResolutionButtons() {
    const resolutionContainer = document.createElement('div');
    resolutionContainer.style.textAlign = 'center';
    resolutionContainer.style.marginBottom = '10px';

    const resolutions = [
        { name: 'Low Resolution', width: 540, pixelRatio: 1 },
        { name: 'Medium Resolution', width: 720, pixelRatio: 1.5 },
        { name: 'High Resolution', width: 1080, pixelRatio: 2 }
    ];

    resolutions.forEach(res => {
        const button = document.createElement('button');
        button.innerHTML = res.name;
        button.style.margin = '0 5px';
        button.onclick = () => setResolutionAndStart(res.width, res.pixelRatio);
        resolutionContainer.appendChild(button);
    });

    container.insertBefore(resolutionContainer, canvas);
}

// Функция установки разрешения и запуска Unity
function setResolutionAndStart(targetWidth, targetPixelRatio) {
    const aspectRatio = 9 / 16;
    const width = Math.min(targetWidth, window.innerWidth);
    const height = width * aspectRatio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const devicePixelRatio = Math.min(targetPixelRatio, 2);
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    // Удаляем кнопки после выбора
    const resolutionContainer = container.querySelector('div');
    if (resolutionContainer) {
        container.removeChild(resolutionContainer);
    }

    // Запускаем Unity
    loadingBar.style.display = "block";
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

// Mobile device configuration
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";
} else {
    const aspectRatio = 9 / 16; // Используем то же соотношение сторон как на Android
    var width = Math.min(window.innerWidth, 720); // Ограничиваем ширину до 1080px
    var height = width * aspectRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

// Создаем кнопки выбора разрешения
createResolutionButtons();

// Загружаем скрипт Unity, но не запускаем его автоматически
var script = document.createElement("script");
script.src = loaderUrl;
document.body.appendChild(script);
