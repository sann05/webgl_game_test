// Проверяем, не определена ли уже функция
if (typeof initAnalytics === 'undefined') {
    function initAnalytics() {
        if (window.telegramAnalytics) {
            window.telegramAnalytics.init({
                token: 'eyJhcHBfbmFtZSI6IlpvbWJpZVRyYWluX1Rlc3QiLCJhcHBfdXJsIjoiaHR0cHM6Ly90Lm1lL1pvbWJpZVRyYWluSGVscGVyX2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL3dlYmdsLWdhbWUtdGVzdC1uaW5lLnZlcmNlbC5hcHAvIn0=!Gm4sOTdTeAsk0czRm9BOyLrJ2RF4/XqfZPfFMc7B3vo=', // Замените на ваш токен
                appName: 'ZombieTrain_Test', // Идентификатор вашего приложения
            });
            console.log('Telegram Analytics initialized successfully');
        } else {
            console.error('Telegram Analytics SDK not loaded');
        }
    }
} 
