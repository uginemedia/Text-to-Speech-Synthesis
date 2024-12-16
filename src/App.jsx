import React, { useEffect, useState } from "react";
import "./index.css";

const App = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const fetchVoices = () => {
      const synthVoices = synth.getVoices();
      if (synthVoices.length > 0) {
        setVoices(synthVoices);
        setSelectedVoice(synthVoices[0]?.name || null);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = fetchVoices;
    }

    fetchVoices();
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      alert("Please enter some text to speak.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    } else {
      alert("No voice is selected or available");
      return;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleRateIncrease = () => {
    setRate((prevRate) => Math.min(prevRate + 0.1, 10)); // Maximum rate of 10
  };

  const handleRateDecrease = () => {
    setRate((prevRate) => Math.max(prevRate - 0.1, 0.1)); // Minimum rate of 0.1
  };

  return (
    <section className="container">
      <div className="top"></div>
      <div className="text-box">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here"
        ></textarea>
      </div>
      <div className="tools-box">
        <div className="box box-1">
          <button onClick={handleRateDecrease}>
            <ion-icon name="play-back-outline"></ion-icon>
          </button>
          <button onClick={handleSpeak}>
            <ion-icon name="play-outline"></ion-icon>
            <span>Play</span>
          </button>
          <button onClick={handleRateIncrease}>
            <ion-icon name="play-forward-outline"></ion-icon>
          </button>
        </div>
        <div className="box box-2">
          {selectedVoice && (
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.length > 0 ? (
                voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}({voice.lang})
                  </option>
                ))
              ) : (
                <option>Loading voices...</option>
              )}
            </select>
          )}
        </div>
        <div className="box box-3">
          <span>Rate: {rate.toFixed(1)}</span>
        </div>
      </div>
    </section>
  );
};

export default App;
