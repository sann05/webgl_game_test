// Ensure you include @tonconnect/sdk library via <script> in your HTML or CDN
const tonConnect = new TonConnect({
  manifestUrl: 'https://webgl-game-test-nine.vercel.app/tonconnect-manifest.json', // Adjust the URL
});

// Initialize TonConnect
function initializeTonConnect(onWalletConnected) {
  tonConnect.restoreConnection().then((walletInfo) => {
    if (walletInfo) {
      console.log('Wallet connected:', walletInfo);
      onWalletConnected(walletInfo);
    }
  });
}

function showConnectWalletButton() {
    const webApp = window.Telegram.WebApp;

    if (webApp) {
        webApp.MainButton.text = "Connect Wallet";
        webApp.MainButton.show();
        webApp.MainButton.onClick(() => {
            // Trigger TON wallet connection
            connectTonWallet();
        });
    } else {
        console.error("Telegram WebApp is not available.");
    }
}

// Connect Wallet
function connectWallet(onConnected) {
  tonConnect.connectWallet().then((walletInfo) => {
    console.log('Wallet connected:', walletInfo);
    onConnected(walletInfo);
  });
}

// Disconnect Wallet
function disconnectWallet() {
  tonConnect.disconnect();
  console.log('Wallet disconnected');
}

// Send Transaction
function sendTransaction(txParams, onResult) {
  tonConnect.sendTransaction(txParams).then((result) => {
    console.log('Transaction sent:', result);
    onResult(result);
  });
}

// Expose the functions to be used globally
window.TonConnectIntegration = {
  initializeTonConnect,
  connectWallet,
  disconnectWallet,
  sendTransaction,
};
