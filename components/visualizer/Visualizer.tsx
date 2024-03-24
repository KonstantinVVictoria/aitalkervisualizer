"use client";

import { RefObject, useRef } from "react";

export default function Visualizer() {
  let audiocontext = useRef<AudioContext | null>(null);
  let auduianalyser = useRef<AnalyserNode | null>(null);
  async function TTS() {
    const talk = document.getElementById("talk") as HTMLTextAreaElement;
    const response = await fetch("/api/hello", {
      method: "POST",
      body: JSON.stringify({
        message: talk.value,
      }),
    }).then((res) => res.json());

    const buffer = Buffer.from(response.data, "binary");

    const blob = new Blob([buffer], { type: "audio/webm" });
    const url = window.URL.createObjectURL(blob);
    const audio = document.getElementById("player") as HTMLAudioElement;
    const source = document.createElement("source");

    source.src = url;
    source.type = "audio/webm";
    if (audio.childNodes.length) audio.removeChild(audio.childNodes[0]);
    audio.append(source);

    audio.load();
    // audio.onplay = () => {
    //   console.log("playing");
    // };

    audio.play();
    let audioContext: any = null;
    let analyser: any = null;
    let mediaElementSource: any = null;
    if (audiocontext.current === null) {
      audiocontext.current = new AudioContext();

      audioContext = audiocontext.current;

      mediaElementSource = audioContext.createMediaElementSource(
        audio
      ) as unknown as MediaElementAudioSourceNode;
      auduianalyser.current = audioContext.createAnalyser();
      analyser = auduianalyser.current;
      mediaElementSource.connect(analyser);

      mediaElementSource.connect(audioContext.destination);
    }
    analyser = auduianalyser.current;
    audioContext = audiocontext.current;
    if (analyser === null) analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    var visualizer = document.getElementById("visualizer") as HTMLCanvasElement;
    // Connecting the analyzer to the media source
    // mediaStreamSource.connect(analyser);
    let colors: any = [];
    drawVisualizer();
    function drawVisualizer() {
      requestAnimationFrame(drawVisualizer);
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      // Updating the analyzer with the new
      // generated data visualization
      analyser.getByteFrequencyData(dataArray);
      const width = visualizer.width;
      const height = visualizer.height;
      const barWidth = 16;
      const canvasContext = visualizer.getContext(
        "2d"
      ) as unknown as CanvasRenderingContext2D;
      canvasContext.clearRect(0, 0, width, height);
      let x = 0;

      dataArray.forEach((item, index, array) => {
        // This formula decides the height of the vertical
        // lines for every item in dataArray
        const culling_coeff = Math.sin(Math.PI * Math.min(index / 24, 1));
        const y =
          ((item / 511) * height * 1.1 * Math.pow(culling_coeff, 2)) / 2;

        if (colors[index] === undefined) {
          colors[index] = Math.random() * 360;
        }
        x = x + barWidth;

        // This decides the distances between the
        // vertical lines

        canvasContext.beginPath();
        canvasContext.strokeStyle = `hsl(${
          colors[index] + ((Math.random() * 40 - 20) % 360)
        }, 100%, 70%)`;
        canvasContext.lineCap = "round";
        canvasContext.lineWidth = 6;
        canvasContext.moveTo(x, height / 2 - y / 2);
        canvasContext.lineTo(x, height / 2 + y / 2);
        canvasContext.stroke();

        // canvasContext.beginPath();
        // canvasContext.strokeStyle = "white";
        // canvasContext.lineCap = "round";
        // canvasContext.lineWidth = 7;
        // canvasContext.moveTo(x, height / 2 - Math.max(Math.pow(y / 2, 0.9), 0));
        // canvasContext.lineTo(x, height / 2 + Math.max(Math.pow(y / 2, 0.9), 0));
        // canvasContext.stroke();
      });
    }
    console.log("loaded");
  }

  async function Visualize(
    audio: HTMLAudioElement & { captureStream: Function }
  ) {}

  return (
    <div>
      <audio id="player" controls style={{ display: "none" }}></audio>
      <div id="container">
        <canvas
          id="visualizer"
          width="410px"
          height="350px"
          style={{
            filter: "blur(20px) brightness(110%) contrast(120%) saturate(200%)",
          }}
        ></canvas>
      </div>
      <textarea id="talk" />
      <button onClick={TTS}>talk</button>
    </div>
  );
}
