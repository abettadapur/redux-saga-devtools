import { createSagaMonitor } from "../../../src/store/createSagaMonitor";
import { createStore } from "redux";
import rootReducer from "../../../src/store/reducers";

let storeMap = {};

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
    }
}

function onMessage(message, port) {
    console.log("BACKGROUND: MESSAGE RECIEVED: " + message);
    const deserializedAction = JSON.parse(message);
    const store = storeMap[getId(port.sender)];
    store.dispatch(deserializedAction);
    console.log("BACKGROUND: STORESTATE: " + JSON.stringify(store.getState()));
}

function onDisconnect(type, id) {
    return () => {
        if (type === "tab") {
            delete storeMap[id];
        }
    };
}

chrome.runtime.onConnect.addListener(onConnect);
chrome.runtime.onMessage.addListener(onMessage);