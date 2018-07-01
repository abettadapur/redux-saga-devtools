import { createSagaMonitor } from "../../store/createSagaMonitor";
import { createStore } from "redux";
import rootReducer from "../../store/reducers";

let storeMap = {};
let contentConnections = {};
let panelConnections = {};

function getId(sender) {
    return sender.tab ? sender.tab.id : sender.id;
}

function onConnect(port) {
    let senderId;
    if (port.name === "tab") {
        senderId = getId(port.sender);
        storeMap[senderId] = createStore(rootReducer);

        const listener = (message) => {
            if (message.name === "RELAY") {
                onMessage(message.message, port);
            }
        }

        port.onMessage.addListener(listener);
        port.onDisconnect.addListener(onDisconnect(port.name, senderId));

        contentConnections[senderId] = port;

        const devPanelConnection = panelConnections[senderId];
        if (devPanelConnection) {
            devPanelConnection.postMessage({
                type: "TAB_RECONNECTED"
            });
        }

    } else {
        // panel name
        panelConnections[port.name] = port;
    }
}

function onMessage(message, port) {
    const deserializedAction = JSON.parse(message);
    const store = storeMap[getId(port.sender)];
    store.dispatch(deserializedAction);
}

function onDisconnect(type, id) {
    return () => {
        if (type === "tab") {
            delete contentConnections[id];
            delete storeMap[id];

            const devPanelConnection = panelConnections[id];
            if (devPanelConnection) {
                devPanelConnection.postMessage({
                    type: "TAB_DISCONNECTED"
                });
            }
        }
    };
}

chrome.runtime.onConnect.addListener(onConnect);
chrome.runtime.onMessage.addListener(onMessage);
window.storeMap = storeMap;