import numpy as np
from scipy.io.wavfile import write
import subprocess
import io

from app import app
from app import model
from .speech_recognition import main
from .bot import lucy
from flask import render_template, Response, request


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/recording', methods=['POST'])
def process_recording():
    # TODO Send recording to speech recognition module
    audio_data = request.data

    with open('a.wav', 'wb') as fp:
        fp.write(audio_data)
    
    # audio_int = np.frombuffer(audio_data, dtype=np.int32)
    # write('a.wav', 16000, audio_int)
    query = main('a.wav', model)
    print('\n\n\nQUERY: {}'.format(query))
    response = lucy.respond(query)
    print('RESPONSE: {}'.format(response))

    return Response(
        response=response,
        status=201,
        mimetype='text/plain')
