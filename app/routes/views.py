from app.routes import bp
from flask import current_app
from flask import render_template, Response, request


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/recording', methods=['POST'])
def process_recording():
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
