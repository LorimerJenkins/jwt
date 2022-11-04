import json
import requests

filename = '/home/lorimer0jwt/mysite/database.json'


def check_if_key(email):
    with open(filename, "r") as file:
        data = json.load(file)
    if email in data:
        return data[email]
    else:
        return 'not found'


def add_key(email, key):
    if check_if_key(email) == 'not found':
        with open(filename, "r") as file:
            data = json.load(file)
        data[email] = key
        with open(filename, "w") as file:
            json.dump(data, file)
        return 'added'
    else:
        return 'added'


def search_key(email):
    key_check = check_if_key(email)
    if key_check != 'not found':
        return key_check
    else:
        return 'not found'




# SERER SETUP #######################################################################################################################################################
# The whole server
from json import dumps
from flask_cors import CORS
from flask import *
app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# SERVER ###########################################################################################################################################################
@app.route('/', methods=['GET'])
def home():
    return 'Working'
# Check #############################################################################################################################################################
@app.route('/check_key/', methods=['GET'])
def check_the_key():
    try:
        email = str(request.args.get('email'))

        check = search_key(email=email)

        return Response(dumps({'response': check}), mimetype='text/json')

    except Exception as theError:
        telegram_api_key = '5119024151:AAEZ0mSok1-2cuqelU26Ex0Nio04EuCDy4Q'
        telegram_chat_id_website_hits = '-1001515674184'
        requests.get(f'https://api.telegram.org/bot{telegram_api_key}/sendMessage?chat_id={telegram_chat_id_website_hits}&text={theError}')
        return Response(dumps({'response': 400}), mimetype='text/json')
# Add key #############################################################################################################################################################
@app.route('/add_key/', methods=['GET'])
def add_the_key():
    try:
        email = str(request.args.get('email'))
        key = str(request.args.get('key'))

        adding_key = add_key(email=email, key=key)

        return Response(dumps({'response': adding_key}), mimetype='text/json')
    except Exception as theError:
        telegram_api_key = '5119024151:AAEZ0mSok1-2cuqelU26Ex0Nio04EuCDy4Q'
        telegram_chat_id_website_hits = '-1001515674184'
        requests.get(f'https://api.telegram.org/bot{telegram_api_key}/sendMessage?chat_id={telegram_chat_id_website_hits}&text={theError}')
        return Response(dumps({'response': 400}), mimetype='text/json')
# RUN SERVER ##############################################################################################################################################################
if __name__ == '__main__':
    app.run(port=7777)


