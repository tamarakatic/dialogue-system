class Development(object):
    TEMPLATES_AUTO_RELOAD = True
    SEND_FILE_MAX_AGE_DEFAULT = 0

class Production(object):
    DEBUG = False
