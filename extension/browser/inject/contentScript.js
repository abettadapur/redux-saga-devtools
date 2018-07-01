// Listen to events from the saga monitor, and relay them to the background script

let background;
let connected = false

function connect() {
    connected = true;

    if (window.devToolsExtensionID) {
        background = chrome.runtime.connect(window.devToolsExtensionID, { name: "tab" });
    } else {
        background = chrome.runtime.connect({ name: "tab" });
    }
}

function sendMessage(message) {
    if (!connected) {
        connect();
    }

    background.postMessage({ name: "RELAY", message });
}

function handleMessages(event) {
    const message = event.data;
    if (message.source == "@sagaDevTools") {
        console.log("CONTENT: Recieved message: " + message);
        sendMessage(message.action);
    }
}

window.addEventListener("message", handleMessages, false);