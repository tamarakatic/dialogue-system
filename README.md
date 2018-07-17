# Dialogue System

Speech based dialogue system implementation

<p align="center">
  <img src="docs/diagram.png" alt="System diagram" />
</p>

## Installation

Requirements: `python 3.5`, `pip >= 10.0.0` and `pipenv`.

Clone repository and run `install` script:

```bash
git clone https://github.com/tamarakatic/dialogue-system.git
cd dialogue-system/

./install
```

## Running

After installation activate virtualenv with `pipenv shell`.  Set Flask app env
variable to `development` and run application

```bash
FLASK_ENV=development FLASK_APP=app flask run
```

You should see homepage [here](http://localhost:5000).
