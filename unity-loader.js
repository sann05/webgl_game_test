var unityInstance = null; // Global declaration for the Unity instance
var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

// --- Начало: Добавленный код для выбора разрешения ---
var resolutionSelector = document.querySelector("#resolution-selector");
var resolutionButtons = resolutionSelector.querySelectorAll("button");
// --- Конец: Добавленный код для выбора разрешения ---

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
#if MEMORY_FILENAME
    memoryUrl: buildUrl + "/{{{ MEMORY_FILENAME }}}",
    #endif
#if SYMBOLS_FILENAME
    symbolsUrl: buildUrl + "/{{{ SYMBOLS_FILENAME }}}",
    #endif
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

    const aspectRatio = 9 / 16;
    var width = Math.min(window.innerWidth, 1080); // Limit width to 1080px max
    var height = width * aspectRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    var devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Limit the pixel ratio to reduce resolution on high-density screens
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    #if SHOW_DIAGNOSTICS
    diagnostics_icon.style.position = "fixed";
    diagnostics_icon.style.bottom = "10px";
    diagnostics_icon.style.right = "0px";
    canvas.after(diagnostics_icon);
    #endif
} else {
    const aspectRatio = 9 / 16; // Используем то же соотношение сторон как на Android
    var width = Math.min(window.innerWidth, 720); // Ограничиваем ширину до 1080px
    var height = width * aspectRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

loadingBar.style.display = "block";

// --- Начало: Обертка логики запуска Unity в функцию ---
function startUnity(maxWidth) {
    // By default Unity keeps WebGL canvas render target size matched with
    // the DOM size of the canvas element (scaled by window.devicePixelRatio)
    // Set this to false if you want to decouple this synchronization from auto-resizing.
    config.matchWebGLToCanvasSize = true;

    // Adjust canvas size based on device type and orientation
    // Используем maxWidth вместо 1080
    var width = Math.min(window.innerWidth, maxWidth);
    // Рассчитываем высоту на основе соотношения сторон из конфига Unity
    // Убедимся, что {{{ WIDTH }}} и {{{ HEIGHT }}} заменены реальными значениями при сборке
    var aspectRatio = {{{ HEIGHT }
}} / {{{ WIDTH }}}; / / Высота / Ширина
var height = width * aspectRatio;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";
    // Устанавливаем стили для мобильных устройств, чтобы canvas занимал весь экран
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // Сбрасываем max-width, так как на мобильных он не нужен в таком виде
    canvas.style.maxWidth = 'none';

    // ... (остальные мобильные стили, если есть) ...

} else {
    // Desktop style: scale the game canvas to fit the browser client area:
    // Устанавливаем максимальную ширину и вычисленную высоту
    canvas.style.maxWidth = maxWidth + "px";
    // Устанавливаем текущие размеры, которые будут масштабироваться CSS до max-width
    // CSS 'width: 100% !important' будет управлять фактической шириной в контейнере
    // Но мы можем установить начальные размеры для корректного рендеринга Unity
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}

loadingBar.style.display = "block"; // Показываем индикатор загрузки здесь

// Load the Unity WebGL build
var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((instance) => {
        window.unityInstance = instance; // Set the global unityInstance variable
        loadingBar.style.display = "none";
        // Кнопка fullscreen теперь настраивается здесь, после создания instance
        // if (fullscreenButton) { // Проверяем, существует ли кнопка
        //   fullscreenButton.onclick = () => {
        //     window.unityInstance.SetFullscreen(1);
        //   };
        // }
        // --- Примечание: Логика кнопки fullscreen закомментирована,
        // --- так как ее нет в вашем index.html по умолчанию.
        // --- Если она вам нужна, раскомментируйте и убедитесь, что кнопка есть в HTML.
    }).catch((message) => {
        alert(`Failed to load Unity instance: ${message}`);
    });
};
document.body.appendChild(script);
}
// --- Конец: Обертка логики запуска Unity в функцию ---

// --- Начало: Добавление обработчиков для кнопок разрешения ---
resolutionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedWidth = parseInt(button.getAttribute('data-width'), 10);

        // Скрыть кнопки выбора разрешения
        resolutionSelector.style.display = 'none';

        // Запустить Unity с выбранной максимальной шириной
        startUnity(selectedWidth);
    });
});
// --- Конец: Добавление обработчиков для кнопок разрешения ---
