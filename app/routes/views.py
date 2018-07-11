from app.routes import bp as router
from flask import current_app as app, render_template, Response, request


@router.route('/')
def index():
    return render_template('index.html')


@router.route('/chat', methods=['POST'])
def chat():
    query = app.recognizer.speech_to_text(audio_buffer=request.data,
                                          sample_rate=44100)
    app.logger.info('query: {}'.format(query))

    response = app.chatbot.respond(query)
    app.logger.info('response: {}'.format(response))

    return Response(
        response=response,
        status=201,
        mimetype='text/plain')
