function initTelegramIntegration() 
{
    if (window.Telegram && window.Telegram.WebApp) 
    {
        const webApp = window.Telegram.WebApp;
        console.log('Telegram WebApp data:', webApp.initData);

        const user = webApp.initDataUnsafe.user;
        if (user) 
        {
            console.log(`User ID: ${user.id}`);
            console.log(`First Name: ${user.first_name}`);
            console.log(`Last Name: ${user.last_name}`);
            console.log(`Username: ${user.username}`);
        } 
        else 
        {
            console.log('No user information available.');
        }

        webApp.setBackgroundColor("#1abc9c");
        webApp.MainButton.setText("Connected to Telegram!");
        webApp.MainButton.show();
        
        if (typeof window.Adsgram !== 'undefined') {
            console.log('Adsgram SDK available and ready to use.');
        } else {
            console.warn('Adsgram SDK not found. Ad features may not work.');
        }
        webApp.ready();                 
        webApp.expand();                 
        webApp.requestFullscreen();

        
    } 
    else 
    {
        console.log('Telegram WebApp API not available.');
        alert("Telegram WebApp API not available. Closing the game.");
        setTimeout(() => window.close(), 2000);
    }
}

// Call the Telegram initialization
initTelegramIntegration();
