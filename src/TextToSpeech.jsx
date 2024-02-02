import React, { useEffect, useState } from 'react';

function TextToSpeech({ text }) {
	const [isPaused, setIsPaused] = useState(false);
	const [utterance, setUtterance] = useState(null);
	const [voice, setVoice] = useState(null);
	const [pitch, setPitch] = useState(1);
	const [rate, setRate] = useState(1);
	const [volume, setVolume] = useState(1);

	useEffect(() => {
		const synth = window.speechSynthesis;
		const u = new SpeechSynthesisUtterance(text);
		const voices = synth.getVoices();

		setUtterance(u);
		synth.addEventListener('voiceschanged', () => {
			setVoice(voices[0]);
		});

		return () => {
			synth.cancel();
			synth.removeEventListener('voiceschanged', () => {
				setVoice(null);
			});
		};
	}, [text]);

	const handlePause = () => {
		const synth = window.speechSynthesis;
		synth.pause();
		setIsPaused(true);
	};

	const handleStop = () => {
		const synth = window.speechSynthesis;
		synth.cancel();
		setIsPaused(false);
	};

	const handlePlay = () => {
		const synth = window.speechSynthesis;
		if (isPaused) {
			synth.resume();
		} else {
			utterance.voice = voice;
			utterance.pitch = pitch;
			utterance.volume = volume;
			utterance.rate = rate;
			synth.speak(utterance);
		}
		setIsPaused(false);
	};

	const handleVoiceChange = e => {
		const voices = window.speechSynthesis.getVoices();
		setVoice(voices.find(v => v.name === e.target.value));
	};

	const handlePitchChange = e => {
		setPitch(parseFloat(e.target.value));
	};

	const handleRateChange = e => {
		setRate(parseFloat(e.target.value));
	};
	const handleVolumeChange = e => {
		setVolume(parseFloat(e.target.value));
	};

	return (
		<div>
			<label>
				Voice:
				<select value={voice?.name} onChange={handleVoiceChange}>
					{window.speechSynthesis.getVoices().map(voice => (
						<option kay={voice.name} value={voice.name}>
							{voice.name}
						</option>
					))}
				</select>
			</label>

			<br />

			<label>
				Pitch:
				<input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={handlePitchChange} />
			</label>

			<br />

			<label>
				Speed:
				<input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={handleRateChange} />
			</label>

			<br />

			<label>
				Volume:
				<input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} />
			</label>

			<br />

			<button onClick={handlePlay}>{isPaused ? 'Resume' : 'Play'}</button>
			<button onClick={handlePause}>Pause</button>
			<button onClick={handleStop}>Stop</button>
		</div>
	);
}

export default TextToSpeech;
