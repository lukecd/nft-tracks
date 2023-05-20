const buttons = document.querySelectorAll(".button");
const playButton = document.querySelector(".play-button");

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		button.classList.toggle("active");
	});
});

playButton.addEventListener("click", () => {
	playButton.textContent = playButton.textContent === "Play" ? "Pause" : "Play";
	playButton.classList.toggle("pause");
});

const handleButtonClick = (source) => {
	console.log(source.id);
	stems[source.id - 1].mute(!stems[source.id - 1].muted);
};

let isPlaying = false;
const handlePlayPauseClick = () => {
	if (!isPlaying) {
		// Wait for all audios to be loaded
		const waitInterval = setInterval(() => {
			if (stems.every((stem) => stem.isLoaded)) {
				clearInterval(waitInterval);

				// Play all audio files
				stems.forEach((stem) => stem.play());
			}
		}, 500);
		isPlaying = true;
	} else {
		stems.forEach((stem) => stem.pause());
	}
};

class Stem {
	constructor(path) {
		this.audio = new Audio(path);
		this.isLoaded = false;
		this.muted = true;
		this.audio.loop = true; // Loop the audio

		// Add event listener for when audio is loaded
		this.audio.addEventListener(
			"canplaythrough",
			() => {
				this.isLoaded = true;
				console.log(`${path} is loaded`);
			},
			false,
		);

		this.mute(true);
	}

	play() {
		if (this.isLoaded) {
			this.audio.play();
		} else {
			console.error("Audio file is not fully loaded yet.");
		}
	}

	pause() {
		this.audio.pause();
	}

	mute(shouldMute) {
		this.audio.volume = shouldMute ? 0 : 1;
		this.muted = shouldMute;
	}
}

// Create instances of Stem
const stems = [
	new Stem("./stems/stem1.mp3"),
	new Stem("./stems/stem2.mp3"),
	new Stem("./stems/stem3.mp3"),
	new Stem("./stems/stem4.mp3"),
];

// SNGEfWnuhgiFn4U5jHktgK4IXRs72C9Hn9VWm1IkDOE
// noatSQXdEk730UQMeBblzah9JQZvbjXqVakA_cDVg4g
// nPDbwLB_yV60C0jL2IXDZA0eIXL3EVP676_gysriQ40
// h70D052Yo-252lpEfp29GRXTZrTwMkbiYuIirSHs8Ec

// https://gateway.bundlr.network/tx/h70D052Yo-252lpEfp29GRXTZrTwMkbiYuIirSHs8Ec
