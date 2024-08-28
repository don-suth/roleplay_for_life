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

const THEMES = {
	"order": {
		"main_border": "#A52A2A", // "Brown"
		"border_inset": "#FFA07A", // "LightSalmon"
		"table_diagram": "#8B4513", // "SaddleBrown"
		"border_highlight": "#F08080", // "LightCoral"
		"main_border_text": "#FFFFFF", // "White"
		"border_inset_text": "#000000", // "Black"
	},
	"chaos": {
		"main_border": "#B12B5E", // "Orchid"
		"border_inset": "#7EC15B", // "PaleGreen"
		"table_diagram": "#8B4513", // "SaddleBrown"
		"border_highlight": "#DDA0DD", // "Plum"
		"main_border_text": "#FFFFFF", // "White"
		"border_inset_text": "#000000", // "Black"
	}
}

const BASE_PROPERTIES = {
	"current_theme": "order",
	"left_bumper_scale_x": 1,
	"left_bumper_scale_y": 1,
	"left_bumper_colour": "#A52A2A", // "Brown"
	"toast_border": "#A52A2A", // "Brown"
	"toast_inset": "#FFA07A", // "LightSalmon"
}

let current_properties = {
	...BASE_PROPERTIES,
	...THEMES["order"],
}

function drawLeftBumper() {
	let ctx = leftBumperLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.save();
	ctx.fillStyle = current_properties["left_bumper_colour"];
	ctx.scale(current_properties["left_bumper_scale_x"], current_properties["left_bumper_scale_y"]);

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(350, 0);
	ctx.lineTo(310, 100);
	ctx.lineTo(0,100);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

function drawRightBumper() {
	let ctx = rightBumperLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.fillStyle = current_properties["main_border"];

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

	ctx.fillStyle = current_properties["main_border"];
	ctx.fillRect(0, 1080-lowerThirdHeight, lowerThirdWidth, lowerThirdHeight);

	ctx.fillStyle = current_properties["border_inset"];
	ctx.fillRect(lowerThirdPadding+topBarOffset, 1080-lowerThirdHeight+lowerThirdPadding, lowerThirdWidth-(2*lowerThirdPadding)-topBarOffset, topBarHeight-(2*lowerThirdPadding));
}

function drawTableMap() {

	let ctx = tableMapLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);

	ctx.fillStyle = current_properties["main_border"];
	ctx.fillRect(tableMapX, tableMapY, tableMapW, tableMapH);

	ctx.fillStyle = current_properties["border_inset"];
	ctx.fillRect(tableMapX+5, tableMapY+5, tableMapW-10, tableMapH-10);

	ctx.fillStyle = current_properties["table_diagram"];
	ctx.fillRect(tableMapX+(tableMapW/2)-(tableW/2), tableMapY+tableMapH-tableH-5, tableW, tableH);
	//ctx.fillRect(1670, 775, 100, 300);

}

function drawStaticText() {
	let ctx = textLayer.getContext("2d");
	ctx.clearRect(0,0,1920,1080);
	ctx.font = "small-caps bold 16px 'DejaVu Sans', sans-serif";
	ctx.textAlign = 'start';
	ctx.fillStyle = current_properties["main_border_text"];

	// Top Left 
	ctx.fillText("RAISED SO FAR THIS YEAR", 35, 95);
	// Top Right
	ctx.fillText("LOCAL TIME", 1340, 95);

	// More text stuff
	ctx.font = "small-caps bold 24px 'DejaVu Sans', sans-serif";
	ctx.fillText("10th ANNUAL ROLEPLAY FOR LIFE by UNIGAMES | 24hrs of RPGs FUNDRAISING for THE CANCER COUNCIL | DONATE NOW: BIT.LY/UNIGAINS24", 10, 1070);
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
	ctx.fillStyle = current_properties["border_inset_text"];
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
	if (name === "") {
		name = "Anonymous individual";
	}

	// If no message was provided, we make our own.
	if (message === "") {
		message = "Thank you "+name+"!";
	}

	// Find out how big the message is, so we know how big to create the toastBody.
	let toastTextCanvas = document.createElement("canvas");
	toastTextCanvas.width = toastWidth;
	toastTextCanvas.height = 1080;
	let toastTextContext = toastTextCanvas.getContext("2d");
	toastTextContext.fillStyle = current_properties["border_inset_text"];
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

	// Create a canvas for a meme
	let toastNiceCanvas = document.createElement("canvas");
	toastNiceCanvas.width = toastWidth;
	toastNiceCanvas.height = toastHeaderHeight;
	let toastNiceContext = toastNiceCanvas.getContext("2d");
	toastNiceContext.font = "small-caps 55px 'DejaVu Sans', sans-serif";
	toastNiceContext.textAlign = "left";
	toastNiceContext.textBaseline = "top";
	let toastNiceWidth = toastNiceContext.measureText("← Nice").width + (4 * toastBorderPadding);


	// Create a canvas that combines the two, for easy masking and copying to the main canvas.
	let toastCopyCanvas = document.createElement('canvas');
	toastCopyCanvas.width = toastWidth + toastNiceWidth;
	toastCopyCanvas.height = toastHeaderHeight + toastBodyHeight;
	let toastCopyContext = toastCopyCanvas.getContext("2d");

	// Toast Header
	toastHeaderContext.fillStyle = current_properties["toast_border"];
	toastHeaderContext.fillRect(0,0,toastWidth, toastHeaderHeight);
	toastHeaderContext.fillStyle = current_properties["toast_inset"];
	toastHeaderContext.fillRect(toastBorderPadding, toastBorderPadding, toastWidth-(2*toastBorderPadding), toastHeaderHeight-(2*toastBorderPadding));
	toastHeaderContext.fillStyle = current_properties["border_inset_text"];
	toastHeaderContext.font = "small-caps 55px 'DejaVu Sans', sans-serif";
	toastHeaderContext.textAlign = "center";
	toastHeaderContext.textBaseline = "top";
	toastHeaderContext.fillText(name+" donated $"+amount+"!", toastWidth/2, 2*toastBorderPadding, toastWidth-(4*toastBorderPadding));

	// Toast Body
	toastBodyContext.fillStyle = current_properties["toast_border"];
	toastBodyContext.fillRect(0, 0, toastWidth, toastBodyHeight);
	toastBodyContext.fillStyle = current_properties["toast_inset"];
	toastBodyContext.fillRect(toastBorderPadding, 0, toastWidth-(2*toastBorderPadding), toastBodyHeight-toastBorderPadding);
	toastBodyContext.drawImage(toastTextCanvas, 0, 0); // Copy from the text layer we made above.

	// Meme
	toastNiceContext.fillStyle = current_properties["toast_border"];
	toastNiceContext.fillRect(0, 0, toastNiceWidth, toastHeaderHeight);
	toastNiceContext.fillStyle = current_properties["border_inset"];
	toastNiceContext.fillRect(0, toastBorderPadding, toastNiceWidth - toastBorderPadding, toastHeaderHeight-(2*toastBorderPadding));
	toastNiceContext.fillStyle = current_properties["border_inset_text"];
	toastNiceContext.font = "small-caps 55px 'DejaVu Sans', sans-serif";
	toastNiceContext.textAlign = "left";
	toastNiceContext.textBaseline = "top";
	toastNiceContext.fillText("← Nice", 2*toastBorderPadding, 2*toastBorderPadding, toastNiceWidth-(4*toastBorderPadding));


	toastCopyContext.drawImage(toastHeaderCanvas, 0, 0);
	toastCopyContext.drawImage(toastBodyCanvas, 0, toastHeaderHeight);

	let properties = {
		toastWidth: toastWidth,
		toastHeaderHeight: toastHeaderHeight,
		toastBodyHeight: toastBodyHeight,
		toastMemeWidth: toastNiceWidth,

		toastX: 1920+100,
		toastY: 100,
		toastRotation: 0,

		visibleToastBody: 0,
		visibleToastMeme: 0,

		headerCanvas: toastHeaderCanvas,
		headerContext: toastHeaderContext,
		bodyCanvas: toastBodyCanvas,
		bodyContext: toastBodyContext,
		copyCanvas: toastCopyCanvas,
		copyContext: toastCopyContext,
		memeCanvas: toastNiceCanvas,
		memeContext: toastNiceContext,
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
	if (properties.visibleToastMeme > properties.toastMemeWidth) {
		properties.visibleToastMeme = properties.toastMemeWidth;
	}

	properties.copyContext.drawImage(properties.memeCanvas, properties.toastWidth - properties.toastMemeWidth + properties.visibleToastMeme, 0);
	properties.copyContext.drawImage(properties.bodyCanvas, 0, -properties.toastBodyHeight+properties.toastHeaderHeight+properties.visibleToastBody);
	properties.copyContext.drawImage(properties.headerCanvas, 0, 0);

	context.clearRect(0, 0, canvas.width, canvas.height);

	//context.drawImage(properties.copyCanvas, 0-(properties.toastWidth/2), 0-(properties.toastHeaderHeight/2));

	// If rotation is specified, then we rotate around the middle of the header.
	if (properties.toastRotation !== 0) {
		context.translate(properties.toastX+(properties.toastWidth/2), properties.toastY+(properties.toastHeaderHeight/2));
		context.rotate((Math.PI / 180) * properties.toastRotation);
		context.translate(-(properties.toastX+(properties.toastWidth/2)), -(properties.toastY+(properties.toastHeaderHeight/2)));
	}

	context.drawImage(properties.copyCanvas, properties.toastX, properties.toastY);
	context.restore();

}

function animateToast(toastProperties, newDonationDollarValue, newDonationCentsValue, isNice) {
	let canvas = document.getElementById("donation-toast-layer");

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
	if (isNice === true) {
		toastTimeline.to(toastProperties, {
			delay: 1,
			duration: 1.3,
			ease: "power4.out",
			visibleToastMeme: toastProperties.toastMemeWidth,
		});
	}
	toastTimeline.to(toastProperties, {
		delay: 0.1,
		duration: 0.5,
		ease: "none",
		toastRotation: 21.801,
	});
	toastTimeline.to(toastProperties, {
		delay: 0,
		duration: 1,
		toastX: -900,
		toastY: -305,
		ease: "back.in"
	}, "<");
	toastTimeline.to(current_properties, {
		onUpdate: function() { drawLeftBumper()},
		onComplete: function() { showNewDonationTotal(newDonationDollarValue, newDonationCentsValue) },
		duration: 0.8,
		ease: "none",
		"left_bumper_colour": function() { return getCurrentThemeProperties()["border_highlight"] },
		"left_bumper_scale_x": 1.1,
		"left_bumper_scale_y": 1.3,
	}, "<");
	toastTimeline.to(current_properties, {
		onUpdate: function() { drawLeftBumper()},
		delay: 0.01,
		duration: 0.8,
		ease: "none",
		"left_bumper_colour": function() { return getCurrentThemeProperties()["main_border"] },
		"left_bumper_scale_x": 1,
		"left_bumper_scale_y": 1,
	}, ">");

	
	return toastTimeline;
}

function getCurrentThemeProperties() {
	const current_theme_name = current_properties["current_theme"];
	return {
		...THEMES[current_theme_name]
	}
}

function changeTheme(theme_name, animation_duration=1.2) {
	current_properties["current_theme"] = theme_name;
	current_properties["toast_border"] = THEMES[theme_name]["main_border"];
	current_properties["toast_inset"] = THEMES[theme_name]["border_inset"];
	gsap.to(current_properties, {
		onUpdate: function() { drawLowerThird(); drawTableMap(); drawRightBumper(); },
		duration: animation_duration,
		ease: "none",
		...THEMES[theme_name]
	});
}


function showNewDonationTotal(newDonationDollarValue, newDonationCentsValue) {
	$("#donation-amount-dollars").numberAnimate("set", newDonationDollarValue);
	$("#donation-amount-cents").numberAnimate("set", newDonationCentsValue);

	if (newDonationCentsValue === "00") {
		changeTheme("order");
	}
	else {
		changeTheme("chaos");
	}
}

function testToast() {
	let properties = prepareDonationToast("", "20", "");

	animateToast(properties, "2000");
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