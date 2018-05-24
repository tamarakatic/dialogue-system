const SPACEBAR = 32;

class Recorder {
  record(recordingTime) {
    navigator
      .mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks)
          this.sendAudioToServer(audioBlob)
        });

        mediaRecorder.start();
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
        'content-type': 'application/octet-stream'
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
  const recordingTime = 5; // seconds
  const recorder = new Recorder();

  $(document).keydown(event => {
    if (event.which === SPACEBAR) {
      recorder.record(recordingTime);
    }
  })

  $('#record-btn').click(() => recorder.record(recordingTime));
});
