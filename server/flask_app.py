import json
import requests


# email = 'lorimer@wallety.org'
# key = '1234'

filename = '/home/lorimer0jwt/mysite/database.json'

def add_key(email, key):
    with open(filename, "r") as file:
        data = json.load(file)
    data[email] = key
    with open(filename, "w") as file:
        json.dump(data, file)
# add_key(email=email, key=key)


def check_if_key(email):
    with open(filename, "r") as file:
        data = json.load(file)
    if email in data:
        return data[email]
    else:
        return False
# print(check_if_key('lorimer@wallety.org'))



def the_works(email, key):

    key_check = check_if_key(email)

    if key_check != False:
        return key_check
    else:
        add_key(email, key)
        return key





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
def check():
    try:
        email = str(request.args.get('email'))
        key = str(request.args.get('key'))

        check = the_works(email, key)
        check = json.loads(check)

        return Response(dumps({'response': check}), mimetype='text/json')
    except Exception as theError:
        telegram_api_key = '5119024151:AAEZ0mSok1-2cuqelU26Ex0Nio04EuCDy4Q'
        telegram_chat_id_website_hits = '-1001515674184'
        requests.get(f'https://api.telegram.org/bot{telegram_api_key}/sendMessage?chat_id={telegram_chat_id_website_hits}&text={theError}')
        return Response(dumps({'server_status': 400}), mimetype='text/json')
# RUN SERVER ##############################################################################################################################################################
if __name__ == '__main__':
    app.run(port=7777)


