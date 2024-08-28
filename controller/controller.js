(() => {
    'use strict'

    const WS_SERVER_ADDRESS = "ws://localhost:8765";

    const SEND_CHECK_MESSAGE = JSON.stringify({
        "operation": "check"
    });

    const base_timeout = 250;
    let timeout_id = null;
    let auto_reconnect = true;
    const player_fields = ["gm", "p1", "p2", "p3", "p4", "p5", "p6"]

    let STATE = {};
    let current_socket;

    function sendState() {
        const update_message = {
            "operation": "update",
            "data": STATE,
        }
        current_socket.send(JSON.stringify(update_message));
    }

    function onStateUpdate() {
        // Update the debug text box.
        document.querySelector("#debug-log").textContent = JSON.stringify(STATE, null, 2);
        if ("player_text" in STATE) {
            // Update the GM and player text boxes
            player_fields.forEach(id => {
                if (id in STATE["player_text"]) {
                    document.querySelector("#"+id).value = STATE["player_text"][id];
                }
            });
        }
        if ("now_playing" in STATE) {
            document.querySelector("#now-playing").value = STATE["now_playing"];
        }
    }

    function updateCurrentState() {
        // Update our state with the content in the text boxes.
        STATE["player_text"] = {};
        player_fields.forEach(id => {
            STATE["player_text"][id] = document.querySelector("#"+id).value
        });
        STATE["now_playing"] = document.querySelector("#now-playing").value;
        sendState();
    }

    function parseMessage(json) {
        switch (json["operation"]) {
            case "update":
                STATE = Object.assign(STATE, json["data"]);
                console.log("Updated state from server.");
                console.log(STATE);
                onStateUpdate();
                break;
            case "new_donations":
                break;
            case "check":
                break;
            case "error":
                console.log(json["message"]);
                clickDisconnectButton();
                showError();
                break;
            default:
                console.log("unrecognised JSON");
                console.log(json);
                break;
        }
    }

    function showConnected() {
        document.querySelector("#status-box").value = "Connected";
        document.querySelector("#connect-button").disabled = true;
        document.querySelector("#disconnect-button").disabled = false;
    }

    function showDisconnected() {
        document.querySelector("#status-box").value = "Disconnected";
        document.querySelector("#connect-button").disabled = false;
        document.querySelector("#disconnect-button").disabled = true;
    }
    function showReconnecting() {
        document.querySelector("#status-box").value = "Reconnecting";
        document.querySelector("#connect-button").disabled = true;
        document.querySelector("#disconnect-button").disabled = false;
    }

    function showError() {
        showDisconnected();
        document.querySelector("#status-box").value = "Error :-(";
    }

    function clickConnectButton() {
        clearTimeout(timeout_id);
        showReconnecting();
        auto_reconnect = true;
        connectToWebsocketServer();
    }

    function clickDisconnectButton() {
        clearTimeout(timeout_id);
        auto_reconnect = false;
        current_socket.close();
        showDisconnected();
    }

    function debugClearState() {
        STATE["player_text"] = {};
        player_fields.forEach(id => {
            STATE["player_text"][id] = "";
        });
        STATE["now_playing"] = "";
        STATE["last_donation_timestamp"] = 0;
        STATE["last_raised"] = "0.00";
        sendState();
    }

    function connectToWebsocketServer(current_timeout = base_timeout) {
        current_socket = new WebSocket(WS_SERVER_ADDRESS);

        current_socket.onmessage = event => {
            console.log(event.data);
            parseMessage(JSON.parse(event.data));
        };

        current_socket.onopen = event => {
            console.log("Connected to: ", WS_SERVER_ADDRESS);
            timeout_id = null;
            current_socket.send(JSON.stringify({
                "password": document.querySelector("#password-field").value
            }));
            showConnected();
        };

        current_socket.onclose = event => {
            console.log("Websocket closed.");
            showDisconnected();
            if (auto_reconnect) {
                console.log("Attempting to reconnect.");
                showReconnecting();
                timeout_id = setTimeout(connectToWebsocketServer, current_timeout, current_timeout + base_timeout);
            }
        };

        current_socket.onerror = event => {
            console.log(event);
            console.log("Websocket encountered an error. Closing.");
            showError();
            current_socket.close();
        };
    }

    window.addEventListener("load", () => {
        document.querySelector("#connect-button").addEventListener("click", clickConnectButton);
        document.querySelector("#disconnect-button").addEventListener("click", clickDisconnectButton);
        document.querySelector("#update-button").addEventListener("click", updateCurrentState);
        document.querySelector("#debug-clear").addEventListener("click", debugClearState);
        showDisconnected();
    });
})()