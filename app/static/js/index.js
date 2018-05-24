class Recorder {
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
          const audio = new Blob(audioChunks)
          this.sendAudioToServer(audio)
        });

        setTimeout(() => {
          mediaRecorder.stop();
        }, recordingTime);
      });
  }

  sendAudioToServer(audio) {
    const { host, protocol } = window.location;
    const url = `${protocol}//${host}/recording`;

    fetch(url, {
      method: 'POST',
      body: audio,
      headers: {
        'content-type': 'application/octet-stream'
      }
    }).then(response => console.log(response))
  }
}

$(() => {
  const recordingTime = 5 * 1000; // 5s
  const recorder = new Recorder();

  $('#record-btn').click(() => recorder.record(recordingTime));
});
