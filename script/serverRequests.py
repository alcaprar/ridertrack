import json
import requests
import os

os.environ["REQUESTS_CA_BUNDLE"] = "cacert.pem"

def register(url,name,surname,email,password):

    url = url + "/api/auth/register"
    headers = {u'content-type': u'application/json'}

    payload = {
        "name":name,
        "surname":surname,
        "email":email,
        "password":password
    }

    r = requests.post(url,json=payload,headers = headers)
    print (r.json())
    token = r.json()['jwtToken']
    userId = r.json()['userId']
    
    return (token,userId)

def login (url,email,password):

    url = url + "/api/auth/login"
    headers = {u'content-type': u'application/json'}

    payload = {
        "email":email,
        "password":password
    }

    r = requests.post(url,json=payload,headers = headers)
    token = r.json()['jwtToken']
    userId = r.json()['userId']
    
    return (token,userId)

def enroll(url,jwtToken,userId,eventId):

    url = url + "/api/enrollments"
    headers  = {u'content-type': u'application/json',
                'Authorization':jwtToken
        }
    
    payload = {
        "eventId" : eventId
        }

    r = requests.post(url,json=payload,headers = headers)
    print (r.json())
def getRoute(url,eventId):

    url = url + "/api/events/" + eventId + "/route"

    r = requests.get(url)

    c = r.json()['coordinates']
    coordinates = []
    for coordinate in c:
        coordinates.append((coordinate['lat'],coordinate['lng']))
    return coordinates
