import os

current_file = os.path.dirname(os.path.abspath(__file__))

ROOT_PATH = os.path.join(current_file, os.pardir)
MODELS_DIR = os.path.join(ROOT_PATH, 'models/')
