import os

from flask import Flask

config = {
    'development': 'app.config.Development',
    'production': 'app.config.Production',
    'default': 'app.config.Development',
}

env = os.getenv('FLASK_ENV', 'default')

app = Flask(__name__)
app.config.from_object(config[env])

from app import routes  # noqa
