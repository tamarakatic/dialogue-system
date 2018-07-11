import os
import argparse
import numpy as np
import shlex
import subprocess
import sys
import wave
import io

from deepspeech.model import Model
from timeit import default_timer as timer
from scipy.io import wavfile
from .constants import *

try:
    from shhlex import quote
except ImportError:
    from pipes import quote


class SpeechModel():
    def __init__(self):
        print('Loading model...\n\n')
        self.ds = Model(MODEL_PATH, N_FEATURES, N_CONTEXT, ALPHABET_PATH, BEAM_WIDTH)
        print('Loading language model...\n\n')
        self.ds.enableDecoderWithLM(ALPHABET_PATH, LANGUAGE_MODEL_PATH, TRIE_PATH, LM_WEIGHT,
                               WORD_COUNT_WEIGHT, VALID_WORD_COUNT_WEIGHT)


def convert_samplerate(audio_path):
    sox_cmd = 'sox {} --type raw --bits 16 --channels 1 --rate 16000 - '.format(quote(audio_path))
    try:
        output = subprocess.check_output(shlex.split(sox_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('SoX returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno, 'SoX not found, use 16kHz files or install it: {}'.format(e.strerror))

    return 16000, np.frombuffer(output, np.int16)


def main(file_name, model):
    fin = wave.open(file_name, 'rb')
    fs = fin.getframerate()
    if fs != 16000:
        fs, audio = convert_samplerate(file_name)
    else:
        audio = np.frombuffer(fin.readframes(fin.getnframes()), np.int16)

    audio_length = fin.getnframes() * (1/16000)
    fin.close()

    print('Running inference.', file=sys.stderr)
    inference_start = timer()
    text = model.ds.stt(audio, fs)
    inference_end = timer() - inference_start
    print('Inference took %0.3fs for %0.3fs audio file.' % (inference_end, audio_length), file=sys.stderr)
    return text


if __name__ == '__main__':
    main('out.wav')