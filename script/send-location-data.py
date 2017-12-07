#!/usr/bin/env python
import requests
import json

def test():
    print "Python Working... "

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
    Request.raise_for_status()
    print"POST worked!"
    print(r.content)


def login_user():



test()
create_user()

#if __name__ == "__main__":
    #test()
    #create_user()


