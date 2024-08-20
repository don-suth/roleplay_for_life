const leftBumperLayer = document.getElementById("left-bumper-layer");
const rightBumperLayer = document.getElementById("right-bumper-layer");
const lowerThirdLayer = document.getElementById("lower-third-layer");
const tableMapLayer = document.getElementById("table-map-layer");
const tableTextLayer = document.getElementById("table-text-layer");
const nowPlayingLayer = document.getElementById("now-playing-layer");
const donationGoalLayer = document.getElementById("donation-goal-layer");
const donationToastLayer = document.getElementById("donation-toast-layer");
const textLayer = document.getElementById("text-layer");

const tableMapX = 1520;
const tableMapY = 0;

const tableMapH = 400;
const tableMapW = 400;

const tableW = 75;
const tableH = 300;

let table_coordinate_map = [
	// Text coordinates for the GM + Six players
	[tableMapX+(tableMapW/2), tableMapY+25],
	[tableMapX+(tableMapW/5), tableMapY+120],
	[tableMapX+(tableMapW/5), tableMapY+220],
	[tableMapX+(tableMapW/5), tableMapY+320],
	[tableMapX+(tableMapW/5*4), tableMapY+120],
	[tableMapX+(tableMapW/5*4), tableMapY+220],
	[tableMapX+(tableMapW/5*4), tableMapY+320],
];



function drawLeftBumper(color='#a52a2a', scaleX=1, scaleY=1) {
	let ctx = leftBumperLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.save();
	ctx.fillStyle = color;
	ctx.scale(scaleX,scaleY);

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(300, 0);
	ctx.lineTo(260, 100);
	ctx.lineTo(0,100);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function drawRightBumper() {
	let ctx = rightBumperLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.fillStyle = 'brown';

	ctx.beginPath();
	ctx.moveTo(1920-400, 0);
	ctx.lineTo(1620-400, 0);
	ctx.lineTo(1660-400, 100);
	ctx.lineTo(1920-400, 100);
	ctx.fill();
	ctx.closePath();
}

function drawLowerThird() {
	const lowerThirdWidth = 1920;
	const lowerThirdHeight = 100;
	const lowerThirdPadding = 10;
	const topBarHeight = 60;
	const topBarOffset = 300;

	let ctx = lowerThirdLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);

	ctx.fillStyle = 'brown';
	ctx.fillRect(0, 1080-lowerThirdHeight, lowerThirdWidth, lowerThirdHeight);

	ctx.fillStyle = 'lightsalmon';
	ctx.fillRect(lowerThirdPadding+topBarOffset, 1080-lowerThirdHeight+lowerThirdPadding, lowerThirdWidth-(2*lowerThirdPadding)-topBarOffset, topBarHeight-(2*lowerThirdPadding));
}

function drawTableMap() {

	let ctx = tableMapLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);

	ctx.fillStyle = 'brown';
	ctx.fillRect(tableMapX, tableMapY, tableMapW, tableMapH);

	ctx.fillStyle = 'lightsalmon';
	ctx.fillRect(tableMapX+5, tableMapY+5, tableMapW-10, tableMapH-10);

	ctx.fillStyle = 'saddlebrown';
	ctx.fillRect(tableMapX+(tableMapW/2)-(tableW/2), tableMapY+tableMapH-tableH-5, tableW, tableH);
	//ctx.fillRect(1670, 775, 100, 300);

}

function drawStaticText() {
	let ctx = textLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.font = "small-caps bold 16px 'DejaVu Sans', sans-serif";
	ctx.textAlign = 'start';
	ctx.fillStyle = 'white';

	// Top Left 
	ctx.fillText("RAISED SO FAR THIS YEAR", 10, 95);
	// Top Right
	ctx.fillText("LOCAL TIME", 1340, 95);

	// More text stuff
	ctx.font = "small-caps bold 24px 'DejaVu Sans', sans-serif";
	ctx.fillText("9th ANNUAL ROLEPLAY FOR LIFE by UNIGAMES | 24hrs of RPGS FUNDRAISING FOR THE CANCER COUNCIL | DONATE NOW: BIT.LY/UNIGAINS23", 10, 1070);
	ctx.fillText("CURRENTLY PLAYING:", 10, 1020);
}

function drawPlayerText(gm="",p1="",p2="",p3="",p4="",p5="",p6="",now_playing="Testing") {
	let coords = [
		[gm, table_coordinate_map[0]],
		[p1, table_coordinate_map[1]],
		[p2, table_coordinate_map[2]],
		[p3, table_coordinate_map[3]],
		[p4, table_coordinate_map[4]],
		[p5, table_coordinate_map[5]],
		[p6, table_coordinate_map[6]],
	];

	let ctx = tableTextLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.font = "small-caps 18px 'DejaVu Sans', sans-serif";
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';

	for (data of coords) {
		let lines = data[0].split('\n');
		for (i in lines) {
			ctx.fillText(lines[i], data[1][0], data[1][1]+(20*i));
		}
	}
	
	ctx.font = "small-caps 30px 'DejaVu Sans', sans-serif";
	ctx.textAlign = "left";
	ctx.fillText(now_playing, 320, 1020, 1600);
}

function drawParagraph(context, paragraphText, maxWidth, textX, textY, lineHeight) {
	// Wraps a large amount of text onto the specified context and width, and returns the height of that text

	let words = paragraphText.split(" ");
	let lineInProgress = [];
	let startingY = textY;
	while (words.length > 0) {
		if (context.measureText(lineInProgress.join(" ")+" "+words[0]).width > maxWidth) {
			// The next word would break the line-length limit. Print the current line and go to the next line.
			context.fillText(lineInProgress.join(" "), textX, textY);
			lineInProgress = [];
			textY += lineHeight;
		}
		else {
			// Do a quick check to make sure that the "word" isn't obscenely long
			if (context.measureText(words[0]) > maxWidth) {
				// Yikes. Replace that word with an ellipses.
				lineInProgress.push("...");
			}
			else {
				lineInProgress.push(words.shift());
			}
		}
	}
	// Print the remaining text
	context.fillText(lineInProgress.join(" "), textX, textY);
	return textY-startingY+lineHeight;
}


function prepareDonationToast(name, amount, message) {
	const toastWidth = 700;
	const toastHeaderHeight = 70;
	const toastBorderPadding = 5;

	const toastX = (1920/2)-(toastWidth/2);
	const toastY = 100;

	// If no name, provide one
	if (name == "") {
		name = "Anonymous individual";
	}

	// If no message was provided, we make our own.
	if (message == "") {
		message = "Thank you "+name+"!";
	}

	// Find out how big the message is, so we know how big to create the toastBody.
	let toastTextCanvas = document.createElement("canvas");
	toastTextCanvas.width = toastWidth;
	toastTextCanvas.height = 1080;
	let toastTextContext = toastTextCanvas.getContext("2d");
	toastTextContext.fillStyle = "black"
	toastTextContext.font = "small-caps 30px 'DejaVu Sans', sans-serif";
	toastTextContext.textBaseline = "top";
	toastTextContext.textAlign = "center";
	const toastBodyHeight = drawParagraph(toastTextContext, message, toastWidth-toastBorderPadding, toastWidth/2, 5+toastBorderPadding, 30)+(5*toastBorderPadding);

	// Create a canvas for drawing the header.
	let toastHeaderCanvas = document.createElement("canvas");
	toastHeaderCanvas.width = toastWidth;
	toastHeaderCanvas.height = toastHeaderHeight;
	let toastHeaderContext = toastHeaderCanvas.getContext("2d");

	// Create a canvas for drawing the body.
	let toastBodyCanvas = document.createElement("canvas");
	toastBodyCanvas.width = toastWidth;
	toastBodyCanvas.height = toastBodyHeight;
	let toastBodyContext = toastBodyCanvas.getContext("2d");

	// Create a canvas that combines the two, for easy masking and copying to the main canvas.
	let toastCopyCanvas = document.createElement('canvas');
	toastCopyCanvas.width = toastWidth;
	toastCopyCanvas.height = toastHeaderHeight + toastBodyHeight;
	let toastCopyContext = toastCopyCanvas.getContext("2d");

	// Toast Header
	toastHeaderContext.fillStyle = "brown";
	toastHeaderContext.fillRect(0,0,toastWidth, toastHeaderHeight);
	toastHeaderContext.fillStyle = "lightsalmon";
	toastHeaderContext.fillRect(toastBorderPadding, toastBorderPadding, toastWidth-(2*toastBorderPadding), toastHeaderHeight-(2*toastBorderPadding));
	toastHeaderContext.fillStyle = "black"
	toastHeaderContext.font = "small-caps 55px 'DejaVu Sans', sans-serif";
	toastHeaderContext.textAlign = "center";
	toastHeaderContext.textBaseline = "top";
	toastHeaderContext.fillText(name+" donated $"+amount+"!", toastWidth/2, 2*toastBorderPadding, toastWidth-(4*toastBorderPadding));

	// Toast Body
	toastBodyContext.fillStyle = "brown";
	toastBodyContext.fillRect(0, 0, toastWidth, toastBodyHeight);
	toastBodyContext.fillStyle = "lightsalmon";
	toastBodyContext.fillRect(toastBorderPadding, 0, toastWidth-(2*toastBorderPadding), toastBodyHeight-toastBorderPadding);
	toastBodyContext.drawImage(toastTextCanvas, 0, 0); // Copy from the text layer we made above.

	toastCopyContext.drawImage(toastHeaderCanvas, 0, 0);
	toastCopyContext.drawImage(toastBodyCanvas, 0, toastHeaderHeight);

	let properties = {
		toastWidth: toastWidth,
		toastHeaderHeight: toastHeaderHeight,
		toastBodyHeight: toastBodyHeight,

		toastX: 1920+100,
		toastY: 100,
		toastRotation: 0,

		visibleToastBody: 0,

		headerCanvas: toastHeaderCanvas,
		headerContext: toastHeaderContext,
		bodyCanvas: toastBodyCanvas,
		bodyContext: toastBodyContext,
		copyCanvas: toastCopyCanvas,
		copyContext: toastCopyContext,

	};

	return properties;

}

function drawToast(canvas, properties) {
	// Clears the given canvas, then draws a donation toast in that canvas with the specified properties.
	let context = canvas.getContext("2d");
	context.save()
	properties.copyContext.clearRect(0, 0, properties.copyCanvas.width, properties.copyCanvas.height);
	if (properties.visibleToastBody > properties.toastBodyHeight) {
		properties.visibleToastBody = properties.toastBodyHeight;
	}

	properties.copyContext.drawImage(properties.bodyCanvas, 0, -properties.toastBodyHeight+properties.toastHeaderHeight+properties.visibleToastBody);
	properties.copyContext.drawImage(properties.headerCanvas, 0, 0);

	context.clearRect(0, 0, canvas.width, canvas.height);

	//context.drawImage(properties.copyCanvas, 0-(properties.toastWidth/2), 0-(properties.toastHeaderHeight/2));

	// If rotation is specified, then we rotate around the middle of the header.
	if (properties.toastRotation != 0) {
		context.translate(properties.toastX+(properties.toastWidth/2), properties.toastY+(properties.toastHeaderHeight/2));
		context.rotate((Math.PI / 180) * properties.toastRotation);
		context.translate(-(properties.toastX+(properties.toastWidth/2)), -(properties.toastY+(properties.toastHeaderHeight/2)));
	}

	context.drawImage(properties.copyCanvas, properties.toastX, properties.toastY);
	context.restore();

}

function animateToast(toastProperties, newDonationValue) {
	let canvas = document.getElementById("donation-toast-layer");
	let leftBumperProps = {
		color: '#a52a2a',
		scaleX: 1,
		scaleY: 1,
	}

	let toastTimeline = gsap.timeline({ defaults: { onUpdate: function() { drawToast(canvas, toastProperties) } } });

	toastTimeline.to(toastProperties, {
		duration: 0.9,
		ease: "back.out",
		toastX: (1920/2)-(toastProperties.toastWidth/2),
	});
	toastTimeline.to(toastProperties, {
		delay: 0.3,
		duration: 1.5,
		ease: "power4.out",
		visibleToastBody: toastProperties.toastBodyHeight,
	});
	toastTimeline.to(toastProperties, {
		delay: 8,
		duration: 1.2,
		ease: "power4.out",
		visibleToastBody: 0,
		toastY: 300,
	});
	toastTimeline.to(toastProperties, {
		delay: 0.1,
		duration: 0.5,
		ease: "none",
		toastRotation: 21.801,
	});
	toastTimeline.to(leftBumperProps, {
		onUpdate: function() { drawLeftBumper(leftBumperProps.color, leftBumperProps.scaleX, leftBumperProps.scaleY)},
		onRepeat: function() { $("#donation-amount").numberAnimate("set", newDonationValue) },
		duration: 0.8,
		ease: "none",
		color: "#f08080",
		scaleX: 1.1,
		scaleY: 1.3,
		repeat: 1,
		yoyo: true,
	}, "<");
	toastTimeline.to(toastProperties, {
		delay: 0,
		duration: 1,
		toastX: -900,
		toastY: -305,
		ease: "back.in"
	}, "<");
	
	return toastTimeline;
}


function testToast() {
	let properties = prepareDonationToast("", 20, "");
	let leftBumperProps = {
		color: '#a52a2a',
		scaleX: 1,
		scaleY: 1,
	}
	

	animateToast(properties, 2000);
}



function draw() {
	drawLeftBumper();
	drawRightBumper();
	drawLowerThird();
	drawTableMap();
	drawStaticText();
	drawPlayerText(
		"GM:\nAlistair\n(he/him)\nLine4",
		"Player1\n(she/her)\nLine3\nLine4",
		"Player2\n(he/they)\nLine3\nLine4",
		"Player3\n(it/its)\nLine3\nLine4",
		"Player4\n(any pronouns!)\nLine3\nLine4",
		"Player5\n(he/him)\nLine3\nLine4",
		"Player6\n(they/them)\nTiefling Paladin\nLine4"
	);
	//drawDonationToast();
}
window.addEventListener("load", draw);