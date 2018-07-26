const SPACEBAR = 32;

class Recorder {
  record(recordingTime) {
    navigator
      .mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav';
        mediaRecorder.audioChannels = 1;
        const audioChunks = [];

        mediaRecorder.ondataavailable = data => {
          audioChunks.push(data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          this.sendAudioToServer(audioBlob)
        };

        mediaRecorder.start(recordingTime * 1000);
        this.moveTimer(recordingTime);

        setTimeout(() => {
          mediaRecorder.stop();
          this.hideTimer();

        }, recordingTime * 1000);
      });
  }

  showTimer() {
    $(document.footer).hide()
    $('#recorder').hide()
    $('#timer').attr('style', 'display: flex !important');
  }

  hideTimer() {
    $('#timer').hide()
    $(document.footer).show()
    $('#recorder').show()
  }

  moveTimer(recordingTime) {
    this.showTimer();

    const seconds = $('#seconds');
    seconds.text(recordingTime);

    const delay = 1000;
    setInterval(move, delay);

    function move() {
      const currentTime = parseInt(seconds.text());
      seconds.text(currentTime - 1);
    }
  }

  sendAudioToServer(audio) {
    const { host, protocol } = window.location;
    const url = `${protocol}//${host}/chat`;

    fetch(url, {
      method: 'POST',
      body: audio,
      headers: {
        'content-type': 'audio/wav'
      }
    })
      .then(response => response.text())
      .then(response => {
        const speak = text => {
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }

        speak(response);
      });
  }
}

$(() => {
  const recordingTime = 3; // seconds
  const recorder = new Recorder();

  $(document).keydown(event => {
    if (event.which === SPACEBAR) {
      recorder.record(recordingTime);
    }
  })

  $('#record-btn').click(() => recorder.record(recordingTime));
});
