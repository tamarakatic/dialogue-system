class Recorder {
  constructor() {
    this.audioBinary = null;
  }

  record(recordingTime) {
    navigator
      .mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          this.audioBinary = new Blob(audioChunks);
        });

        setTimeout(() => {
          mediaRecorder.stop();
          this.sendAudioToServer();
        }, recordingTime);
      });
  }

  sendAudioToServer() {
    // TODO
    // Post audio binary to server app
  }
}

$(() => {
  const recordingTime = 3 * 1000; // 3s
  const recorder = new Recorder();

  $('#record-btn').click(() => recorder.record(recordingTime));
});
