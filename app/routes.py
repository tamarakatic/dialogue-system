import subprocess

from app import app
from flask import render_template, Response, request


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/recording', methods=['POST'])
def process_recording():
    # TODO Send recording to speech recognition module

    fortune = subprocess.check_output(['fortune', '-s']).decode('utf-8')
    return Response(
        response=fortune,
        status=201,
        mimetype='text/plain')
