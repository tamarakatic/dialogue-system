import os
from os import path


BEAM_WIDTH = 500
LM_WEIGHT = 1.75
WORD_COUNT_WEIGHT = 1.00
VALID_WORD_COUNT_WEIGHT = 1.00
N_FEATURES = 26
N_CONTEXT = 9
DATA_PATH = path.dirname(path.abspath(__file__ + '/../')) + '/models/'
MODEL_PATH = DATA_PATH + 'output_graph.pb'
LANGUAGE_MODEL_PATH = DATA_PATH + 'lm.binary'
ALPHABET_PATH = DATA_PATH + 'alphabet.txt'
TRIE_PATH = DATA_PATH + 'trie'

if __name__ == '__main__':
    print(DATA_PATH)