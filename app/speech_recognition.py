import os
from time import time

import numpy as np
from deepspeech.model import Model
from flask import current_app as app
from scipy import signal

from .constants import MODELS_DIR


SAMPLE_RATE = 16000

ALPHABET_PATH = os.path.join(MODELS_DIR, 'alphabet.txt')
BEAM_WIDTH = 500
MODEL_PATH = os.path.join(MODELS_DIR, 'output_graph.pb')
N_CONTEXT = 9
N_FEATURES = 26

LANGUAGE_MODEL_PATH = os.path.join(MODELS_DIR, 'lm.binary')
LM_WEIGHT = 1.75
TRIE_PATH = os.path.join(MODELS_DIR, 'trie')
VALID_WORD_COUNT_WEIGHT = 1.00
WORD_COUNT_WEIGHT = 1.00


class SpeechRecognizer:

    def __init__(self):
        self._model = Model(MODEL_PATH,
                            N_FEATURES,
                            N_CONTEXT,
                            ALPHABET_PATH,
                            BEAM_WIDTH)

        self._model.enableDecoderWithLM(ALPHABET_PATH,
                                        LANGUAGE_MODEL_PATH,
                                        TRIE_PATH,
                                        LM_WEIGHT,
                                        WORD_COUNT_WEIGHT,
                                        VALID_WORD_COUNT_WEIGHT)

    def speech_to_text(self, audio_buffer, sample_rate):
        app.logger.info('processing audio file')
        audio = self._process_audio_data(audio_buffer, sample_rate)
        app.logger.info('starting recognition')

        start = time()
        text = self._model.stt(audio, SAMPLE_RATE)
        end = time()
        app.logger.info('finished in {:.3f}s'.format(end - start))

        return text

    def _process_audio_data(self, audio_buffer, original_sample_rate):
        audio = np.frombuffer(audio_buffer, dtype=np.int16)
        if original_sample_rate != SAMPLE_RATE:
            audio = self._resample(audio, original_sample_rate)
        return audio

    def _resample(self, audio, original_sample_rate):
        audio_length = len(audio) / original_sample_rate
        samples = int(audio_length * SAMPLE_RATE)
        return signal.resample(audio, samples).astype(np.int16)
