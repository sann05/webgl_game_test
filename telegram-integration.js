// Function to initialize the Telegram WebApp
function initializeTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.expand(); // Expands the mini-app to the full available window

        console.log('Telegram WebApp initialized 1.');
    } else {
        console.log('Telegram WebApp API not available.');
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
            // Make sure UnityInstance is ready before sending data
            if (typeof window.unityInstance !== 'undefined') {
                window.unityInstance.SendMessage('TelegramManager', 'ReceiveUserData', JSON.stringify(userData));
            } else {
                console.log("Unity instance not ready yet. Retrying in 1 second...");
                setTimeout(() => requestTelegramUserData(), 1000); // Retry after 1 second if Unity is not ready
            }
        } else {
            console.log("No user data found.");
        }
    } else {
        console.log("Telegram WebApp API not available.");
    }
}

// Function to check Telegram connectivity and initialize the WebApp
function checkTelegramConnection() {
    if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp is connected. 2");
    } else {
        alert("Telegram WebApp API not available");
    }

    // Log the entire initDataUnsafe object to debug the data discrepancies
    console.log('Telegram initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe);

    // Re-fetch user data when there is an update event from Telegram
    window.Telegram.WebApp.onEvent('update', () => {
        console.log('Telegram data updated');
        requestTelegramUserData(); // Re-fetch user data on update event
    });
}

// Run the Telegram initialization and check for connectivity
initializeTelegram();
checkTelegramConnection();
