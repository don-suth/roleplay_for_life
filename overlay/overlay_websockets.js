const WS_SERVER_ADDRESS = "ws://localhost:8765";

const SEND_CHECK_MESSAGE = JSON.stringify({
	operation: "check"	
});

var timeout = 250;
var auto_reconnect = true;
var animating = false;

var STATE = {};

var new_donations = [];

function sendState(socket) {
	let update_message = {
		operation: "update",
		data: STATE,
	}
	socket.send(JSON.stringify(update_message));
}

let notification_tone = new Audio("Information_Bell.ogg");

function prepareDonations(socket, donations) {
	for (i=0; i<donations.length; i++) {
		if (i == donations.length-1) {
			// Send back the new timestamp and donation value.
			STATE.last_donation_timestamp = donations[i].timestamp;
			STATE.last_raised = donations[i].new_donation_value;
			sendState(socket);
		}
		new_donations.push(donations[i]);
	}
	triggerDonation();
}

function triggerDonation() {
	if (new_donations.length > 0 && animating == false) {
		animating = true;
		notification_tone.play();
		let donation = new_donations.shift();

		// Handle the donation dollars + cents
		let donation_amount_components = donation.amount.split(".", 2);
		let toast_donation_value = "";

		// If the donation is a whole dollar amount, trim the .00 from the end.
		if (donation_amount_components[1] === "00") {
			toast_donation_value = donation_amount_components[0];
		}
		else {
			toast_donation_value = donation.amount;
		}

		// If there is a "69" in the donation, enable a "Nice"
		let isNice = false;
		if ((donation_amount_components[0] + donation_amount_components[1]).includes("69")) {
			isNice = true;
		}

		let new_donation_value_components = donation.new_donation_value.split(".", 2);

		let toastProperties = prepareDonationToast(donation.name, toast_donation_value, donation.message);
		let toastTimeline = animateToast(toastProperties, new_donation_value_components[0], new_donation_value_components[1], isNice);
		toastTimeline.eventCallback("onComplete", function() {animating = false; triggerDonation();});
	}
}

function onStateUpdate() {
	if ("player_text" in STATE) {
		let players = STATE.player_text;
		drawPlayerText(players.gm, players.p1, players.p2, players.p3, players.p4, players.p5, players.p6, STATE.now_playing);
	}
	if ("last_raised" in STATE && animating === false) {
		let last_raised_components = STATE.last_raised.split(".", 2);
		showNewDonationTotal(last_raised_components[0], last_raised_components[1]);
	}
}

function parseMessage(socket, json) {
	switch(json.operation) {
		case "update":
			STATE = Object.assign(STATE, json.data);
			console.log("Updated state:")
			console.log(STATE);
			onStateUpdate();
			break;
		case "new_donations":
			prepareDonations(socket, json.donations);
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
	let socket = new WebSocket(WS_SERVER_ADDRESS);
	
	socket.onmessage = (event) => {
		console.log(event.data);
		parseMessage(socket, JSON.parse(event.data));
	}
	
	// When the socket opens up, check for state changes and reset the timeout.
	socket.onopen = (event) => {
		console.log("Connected to ", WS_SERVER_ADDRESS);
		timeout = 250;
		socket.send(SEND_CHECK_MESSAGE);
	}
	
	// When the socket closes or errors, attempt to reconnect.
	socket.onclose = (event) => {
		console.log("Socket is closed.");
		if (auto_reconnect) {
			console.log("Attempting to reconnect.");	
			setTimeout(connect, timeout+=timeout);
		}
	}
	
	socket.onerror = (event) => {
		console.log(event);
		console.log("Socket encountered an error. Closing Socket.");
		socket.close();
	}
	
	
}

window.addEventListener("load", connect);