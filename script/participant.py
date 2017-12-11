#!/usr/bin/env python
import random

class User:
    
    def __init__(self,name,surname,email,password):
        self._name = name
        self._surname = surname
        self._email = email
        self._password = password
        self._userId = ''
        self._jwtToken = ''

    @property
    def userId(self):
        return self._userId

    @userId.setter
    def userId(self,uId):
        self._userId = uId
    
    @property
    def email(self):
        return self._email

    @property
    def name(self):
        return self._name

    @property
    def surname(self):
        return self._surname
    
    @property
    def password(self):
        return self._password

    @property
    def token(self):
        return self._jwtToken

    @token.setter
    def token(self,token):
        self._jwtToken = "JWT " + token

    def printUser(self):
        print ("User : " + self._name + "\nSurname: " + self._surname
               + "\nEmail : " + self._email)
        print("Token: " + self._jwtToken)

class Participant(User):
    
    def __init__(self,name,surname,email,password):
        super().__init__(name,surname,email,password)
        self._longitude = 0.0
        self._lattitude = 0.0
        self._maxSpeed = 0.0
        self._finished = False
        self._checkpoint = 0

    @property
    def finished(self):
        return self._finished

    @finished.setter
    def finished(self,finish):
        self._finished = finish

    def setPosition(self,lattitude,longitude):
        self._lattitude = lattitude
        self._longitude = longitude

    def getCurrentPosition(self):
        return (self._lattitude,self._longitude)

    def getCurrentCheckpoint(self):
        return self._checkpoint

    def setCheckpoint(self,checkpoint):
        self._checkpoint = checkpoint

    def setMaxSpeed(self,length):
        self._maxSpeed = length /1.105

    def updatePosition(self,xVector,yVector):
        
        currentSpeed = (0.7 + random.random() * 0.3) * self._maxSpeed
        self._lattitude = self._lattitude + xVector * currentSpeed
        self._longitude = self._longitude + yVector * currentSpeed
