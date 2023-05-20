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
		this.path = path;
		this.isMuted = false;

		// Create an AudioContext and a GainNode
		this.audioContext = new AudioContext();
		this.gainNode = this.audioContext.createGain();

		// Create an oscillator with a random initial phase
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = "sine";
		this.oscillator.frequency.value = 0.2; // very low frequency for slow oscillation
		this.oscillator.start(
			this.audioContext.currentTime + Math.random() * 2 * Math.PI,
		); // random phase

		// Connect the oscillator to the GainNode
		this.oscillator.connect(this.gainNode);

		// Load the audio file
		fetch(path)
			.then((response) => response.arrayBuffer())
			.then((buffer) => this.audioContext.decodeAudioData(buffer))
			.then((decodedAudio) => {
				// Create an AudioBufferSourceNode and connect it to the GainNode
				this.audioSource = this.audioContext.createBufferSource();
				this.audioSource.buffer = decodedAudio;
				this.audioSource.connect(this.gainNode);

				// Connect the GainNode to the AudioContext's destination
				this.gainNode.connect(this.audioContext.destination);
			});
	}

	play() {
		if (!this.isMuted && this.audioSource) {
			this.audioSource.start();
		}
	}

	mute(mute) {
		this.isMuted = mute;

		// Disconnect or reconnect the GainNode as necessary
		if (mute) {
			this.gainNode.disconnect();
		} else if (this.audioSource) {
			this.gainNode.connect(this.audioContext.destination);
		}
	}
}

// And here's how you might use the class:
let stem1 = new Stem("./stems/stem1.mp3");
let stem2 = new Stem("./stems/stem2.mp3");
let stem3 = new Stem("./stems/stem3.mp3");
let stem4 = new Stem("./stems/stem4.mp3");

// wait for all stems to load
let waitInterval = setInterval(() => {
	if ([stem1, stem2, stem3, stem4].every((stem) => stem.audioSource)) {
		clearInterval(waitInterval);

		// play all stems
		[stem1, stem2, stem3, stem4].forEach((stem) => stem.play());
	}
}, 500);

// SNGEfWnuhgiFn4U5jHktgK4IXRs72C9Hn9VWm1IkDOE
// noatSQXdEk730UQMeBblzah9JQZvbjXqVakA_cDVg4g
// nPDbwLB_yV60C0jL2IXDZA0eIXL3EVP676_gysriQ40
// h70D052Yo-252lpEfp29GRXTZrTwMkbiYuIirSHs8Ec

// https://gateway.bundlr.network/tx/h70D052Yo-252lpEfp29GRXTZrTwMkbiYuIirSHs8Ec
