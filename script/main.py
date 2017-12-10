import fileinput
import simulator
import serverRequests
from participant import User,Participant
from route import *

localhostUrl = "http://localhost:5000"
ridertrackUrl = "http://rider-track-dev.herokuapp.com"

#set url for serverRequests
url = localhostUrl

participants = []
eventId = '5a2c77d196c6a806b072ef96'
#create 20 users

f = open('users.txt','r')

startingLine = True
while (True):
    if (startingLine  == True):
        startingLine = False
        continue

    l = f.readline().strip()
    if l == '':
        break

    line = l.split(',')
    user = Participant(line[0],line[1],line[2],line[3])
    participants.append(user)
    print (user.email)

f.close()

#login or register user
for p in participants:
    tupleTokenId = serverRequests.login(url,p.email,p.password)
    p.token = tupleTokenId[0]
    p.userId = tupleTokenId[1]
    #enroll users
    serverRequests.enroll(url,p.token,p.userId,eventId)

#get route
coordinates = serverRequests.getRoute(url,eventId)
print (coordinates)
r = Route(coordinates)
#simulate
simulator.simulate(url,eventId,participants,r)
