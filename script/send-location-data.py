#!/usr/bin/env python
import requests
import json

def create_user():
    url  = "http://localhost:4200/api/auth/register/"
    headers = {u'content-type': u'application/json'}
    payload ={
        "name": "Mariano",
        "surname": "Bombarder",
        "email": "mariano.etchart@gmail.com",
        "password": "password1234"
    }
    r = requests.post(url, json= payload, headers = headers)
    print"POST worked!"
    print(r.content)

if __name__ == "__main__":
    create_user()


