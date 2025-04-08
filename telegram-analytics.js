// Проверяем, не определена ли уже функция
if (typeof initAnalytics === 'undefined') {
    function initAnalytics() {
        if (window.telegramAnalytics) {
            window.telegramAnalytics.init({
                token: 'eyJhcHBfbmFtZSI6IlpvbWJpZVRyYWluVCIsImFwcF91cmwiOiJodHRwczovL3QubWUvem9tYmlldHJhaW5ib3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly96b21iaWUtdHJhaW4tcHJvZC52ZXJjZWwuYXBwLyJ9!8oEkyiywYdZUVUg+s3WcfOfMM+7ZAKmwDeHppCBQT1Y=',
                appName: 'ZombieTrainT',
            });
            console.log('Telegram Analytics initialized successfully');
        } else {
            console.error('Telegram Analytics SDK not loaded');
        }
    }
} 
