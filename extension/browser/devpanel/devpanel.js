import * as React from "react";
import { render } from "react-dom";
import { DockableSagaView } from "../../../src";

let rendered = false;

function renderDevTools() {
    const containerElement = document.getElementById("container");
    // render(
    //     <DockableSagaView montior={null} />,
    //     container
    // );

    rendered = true;
}

function renderNA() {
    // if (rendered === false) return;
    // rendered = false;
    // naTimeout = setTimeout(() => {
    //     let message = (
    //         <div style={messageStyle}>
    //             No store found. Make sure to follow <a href="https://github.com/zalmoxisus/redux-devtools-extension#usage" target="_blank">the instructions</a>.
    //     </div>
    //     );
    //     if (isChrome) {
    //         chrome.devtools.inspectedWindow.getResources(resources => {
    //             if (resources[0].url.substr(0, 4) === 'file') {
    //                 message = (
    //                     <div style={messageStyle}>
    //                         No store found. Most likely you did not allow access to file URLs. <a href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#access-file-url-file" target="_blank">See details</a>.
    //           </div>
    //                 );
    //             }

    //             const node = document.getElementById('root');
    //             unmountComponentAtNode(node);
    //             render(message, node);
    //             store = undefined;
    //         });
    //     } else {
    //         const node = document.getElementById('root');
    //         unmountComponentAtNode(node);
    //         render(message, node);
    //         store = undefined;
    //     }
    // }, 3500);
}



function init(id) {
    renderNA();
    setTimeout(() => renderDevTools(), 100);
    // bgConnection = chrome.runtime.connect({ name: id ? id.toString() : undefined });
    // bgConnection.onMessage.addListener(message => {
    //     if (message.type === 'NA') {
    //         if (message.id === id) renderNA();
    //         else store.dispatch({ type: REMOVE_INSTANCE, id: message.id });
    //     } else {
    //         if (!rendered) renderDevTools();
    //         store.dispatch(message);
    //     }
    // });
}

init(chrome.devtools.inspectedWindow.tabId);