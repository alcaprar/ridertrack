#!/usr/bin/env python
import requests
import json

def test():
    print "Python Working. "

class User():
    def __init__(self):
        self.user = {}
        self.userId = 0
        self.role = ''
        self.jwtToken = ''
        self.event = Event()

    def create(self):
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
        print"USER CREATED."
        #print(r.content)

        # Updates the object witht the body of response
        json_elements = ['user', 'userId', 'role', 'jwtToken' ]
        for i in json_elements:
            if r1.content[i] is not None:
                setattr(user,i, r1.content[i] )

    def login(self):
        url  = "http://localhost:4200/api/auth/login/"
        headers = {u'content-type': u'application/json'}
        payload ={
            "email": "mariano.etchart@gmail.com",
            "password": "password1234"
        }
        r = requests.post(url, json= payload, headers = headers)
        Request.raise_for_status()
        print"USER LOGGED IN."
        #print(r.content)

        # Updates the object witht the body of response
        json_elements = ['user', 'userId', 'role', 'jwtToken' ]
        for i in json_elements:
            if r.content[i] is not None:
                setattr(user,i, r.content[i] )

    def create_event(self):


        url  = "http://localhost:4200/api/events"
        headers = {u'content-type': u'application/json', 'Authorization' :  'JWT ' + self.jwtToken}
        payload =
        {
                    "name":"TestEvent",
                    "organizerId": userId,
                    "type":"running",
                    "description":"Blablabla",
                    "country":"MyCountry",
                    "city":"MyCity",
                    "startingDate":"2017-09-23",
                    "startingTime":"12:00:00.000",
                    "maxDuration":150,
                    "length": 40,
                    "enrollmentOpeningAt":"2017-09-10T00:00:00.000Z",
                    "enrollmentClosingAt":"2017-09-17T00:00:00.000Z",
                    "participantsList":[255],
                    "routes":["Route1"]
        }
        r = requests.post(url, json= payload, headers = headers)
        Request.raise_for_status()
        print"EVENT CREATED."
        #print(r.content)

        # Updates the object witht the body of response
        json_elements = [
                          "name",
                          "organizerId",
                          "type",
                          "description",
                          "country",
                          "city",
                          "startingDate",
                          "startingTime",
                          "maxDuration",
                          "length",
                          "enrollmentOpeningAt",
                          "enrollmentClosingAt",
                          "participantsList",
                          "routes",
                          "_id"

                        ]
        for i in json_elements:
            if r.content[i] is not None:
                setattr(self.event,i, r.content[i] )



    def enroll(self):

        url  = "http://localhost:4200/api/enrollments/"
        headers = {u'content-type': u'application/json'}

        payload ={
                "eventId": self.event._id
                "userId" :user.user,
                "created_at": "2017-09-10T00:00:00.000Z",
                "updated_at": "2017-09-10T00:00:00.000Z"
        }
        r = requests.post(url, json= payload, headers = headers)
        Request.raise_for_status()
        print"USER ENROLLED."
        #print(r.content)


    def send_loc(self):
        eventId = self.event.eventId
        url  = "http://localhost:4200/api/events/eventId/participants/positions/"
        headers = {u'content-type': u'application/json'}

        payload ={

        }
        r = requests.post(url, json= payload, headers = headers)
        Request.raise_for_status()
        print"LOCATION SENT."
        #print(r.content)




Class Event():
    def __init__(self):
        self.name = ''
        self.organizerId = ''
        self.type = ''
        self.description = ""
        self.country" =""
        self.city = ""
        self.startingDate = ""
        self.startingTim = ""
        self.maxDuration = 0
        self.length  = 0
        self.enrollmentOpeningAt = ""
        self.enrollmentClosingAt = ""
        self.participantsList = [255]
        self.routes = ["Route1"]
        self._id = ""




#main program
test()
user = User()
user.create()
user.login()
user.create_event()
user.enroll()









