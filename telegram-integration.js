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
        webApp.ready();                 
        webApp.expand();                 

        // Check platform
        const platform = webApp.platform;
        console.log('Platform:', platform);

        // Use requestFullscreen for mobile devices
        if (platform === 'ios' || platform === 'android') {
            webApp.requestFullscreen();
        } 
        // Add click handler for desktop
        else if (platform === 'tdesktop' || platform === 'macos') {
            document.addEventListener('click', function enterFullscreen() {
                webApp.requestFullscreen();
                document.removeEventListener('click', enterFullscreen);
            }, { once: true });
        }

        webApp.hapticFeedback.impactOccurred('medium');
        
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
