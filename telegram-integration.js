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

// Check Telegram connectivity and initialize the WebApp
function checkTelegramConnection() {
    if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp is connected.");
    } else {
        console.log("Telegram WebApp API not available.");
    }
}

// Initialize Telegram when the page loads
initializeTelegram();
checkTelegramConnection();
