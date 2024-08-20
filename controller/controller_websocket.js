const WS_SERVER_ADDRESS = "ws://localhost:8765";

const SEND_CHECK_MESSAGE = JSON.stringify({
	operation: "check"	
});

var timeout = 250;
var auto_reconnect = true;

var STATE = {};

var current_socket;

function sendState() {
	let update_message = {
		operation: "update",
		data: STATE,
	}
	current_socket.send(JSON.stringify(update_message));
}

function onStateUpdate() {
	// Update the debug text box
	$("#state").val(JSON.stringify(STATE, null, 2));
	if ("player_text" in STATE) {
		let players = STATE.player_text;
		$("#gm").val(players.gm);
		$("#p1").val(players.p1);
		$("#p2").val(players.p2);
		$("#p3").val(players.p3);
		$("#p4").val(players.p4);
		$("#p5").val(players.p5);
		$("#p6").val(players.p6);
		// Update text boxes
		//drawPlayerText(players.gm, players.p1, players.p2, players.p3, players.p4, players.p5, players.p6);
	}
	if ("now_playing" in STATE) {
		$("#now_playing").val(STATE.now_playing);
	}
}

function updateCurrentState() {
	STATE.player_text.gm = $("#gm").val();
	STATE.player_text.p1 = $("#p1").val();
	STATE.player_text.p2 = $("#p2").val();
	STATE.player_text.p3 = $("#p3").val();
	STATE.player_text.p4 = $("#p4").val();
	STATE.player_text.p5 = $("#p5").val();
	STATE.player_text.p6 = $("#p6").val();
	STATE.now_playing = $("#now_playing").val();
	sendState();
}

function parseMessage(json) {
	switch(json.operation) {
		case "update":
			STATE = Object.assign(STATE, json.data);
			console.log("Updated state:")
			console.log(STATE);
			onStateUpdate();
			break;
		case "new_donations":
			break;
		case "check":
			break;
		default:
			console.log("unrecognised JSON");
			console.log(json)
			break;
	}
}

function connect() {
	current_socket = new WebSocket(WS_SERVER_ADDRESS);
	
	current_socket.onmessage = (event) => {
		console.log(event.data);
		parseMessage(JSON.parse(event.data));
	}
	
	// When the socket opens up, check for state changes and reset the timeout.
	current_socket.onopen = (event) => {
		console.log("Connected to ", WS_SERVER_ADDRESS);
		timeout = 250;
		current_socket.send(SEND_CHECK_MESSAGE);
		$("#status").val("Connected");
		// Also update the status bar
	}
	
	// When the socket closes or errors, attempt to reconnect.
	current_socket.onclose = (event) => {
		console.log("Socket is closed.");
		$("#status").val("Disconnected");
		if (auto_reconnect) {
			console.log("Attempting to reconnect.");	
			$("#status").val("Reconnecting");
			setTimeout(connect, timeout+=timeout);
		}
		// Also update the status bar
	}
	
	current_socket.onerror = (event) => {
		console.log(event);
		$("#status").val("Error");
		console.log("Socket encountered an error. Closing Socket.");
		socket.close();
		// Also update the status bar
	}
}

window.addEventListener("load", connect);
$("#update-button").click(function() {updateCurrentState(); console.log("Updated!");});
$("#refresh-button").click(function () {current_socket.send(SEND_CHECK_MESSAGE)});