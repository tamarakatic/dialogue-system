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
        this.moveTimerBar(recordingTime);

        setTimeout(() => {
          mediaRecorder.stop();
          this.hideTimer();

        }, recordingTime * 1000);
      });
  }

  showTimer() {
    $('#record-btn').css('color', '#be0000');
    $('#timer').css('visibility', 'visible');
  }

  hideTimer() {
    $('#record-btn').css('color', 'black');
    $('#timer').css('visibility', 'hidden');
  }

  moveTimerBar(recordingTime) {
    this.showTimer();

    const timerBar = $('#timer-bar');
    const delay = 20; // ms
    const widthDelta = 100 / ((recordingTime * 1000) / delay);
    const id = setInterval(move, delay);

    let width = 1;

    function move() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width += widthDelta;
        timerBar.css('width', width + '%');
      }
    }
  }

  sendAudioToServer(audio) {
    const { host, protocol } = window.location;
    const url = `${protocol}//${host}/recording`;

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
          var msg = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(msg);
        }

        speak(response);
      });
  }
}

$(() => {
  const recordingTime = 2; // seconds
  const recorder = new Recorder();

  $(document).keydown(event => {
    if (event.which === SPACEBAR) {
      recorder.record(recordingTime);
    }
  })

  $('#record-btn').click(() => recorder.record(recordingTime));
});
