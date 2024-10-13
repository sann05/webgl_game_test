// Function to initialize the Telegram WebApp
function initializeTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.expand(); // Expands the mini-app to the full available window
        console.log('Telegram WebApp initialized.');
    } else {
        console.log('Telegram WebApp API not available.');
    }
}

// Function to check Telegram connectivity and initialize the WebApp
function checkTelegramConnection() {
    if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp is connected.");
    } else {
        alert("Telegram WebApp API not available.");
    }

    // Log the entire initDataUnsafe object to debug the data discrepancies
    console.log('Telegram initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe);
}

// Run the Telegram initialization and check for connectivity
initializeTelegram();
checkTelegramConnection();
