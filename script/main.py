import fileinput
import simulator
import serverRequests
from participant import User,Participant
from route import *
import sys

localhostUrl = "http://localhost:5000"
ridertrackUrl = "https://rider-track-dev.herokuapp.com"
eventId = '5a2f8b9f00e2030004da1dce'

def main(argv):

    #set url for serverRequests
    url = localhostUrl

    participants = []
    
    if(len(argv) >= 1):
        eventId = argv

    f = open('users.txt','r')

    startingLine = True
    counting = 0
    while (True):
        l = f.readline().strip()
        if (startingLine  == True):
            startingLine = False
            continue
    
        if counting > 5:
            break

        line = l.split(',')
        user = Participant(line[0],line[1],line[2],line[3])
        participants.append(user)
        print (user.email)
        counting+=1
    f.close()

    for p in participants:
        #login or register
        tupleTokenId = ()
        try:
            tupleTokenId = serverRequests.login(url,p.email,p.password)
        except:
            tupleTokenId = serverRequests.register(url,p.name,p.surname,p.email,p.password)
        p.token = tupleTokenId[0]
        p.userId = tupleTokenId[1]
        #enroll users
        serverRequests.enroll(url,p.token,p.userId,eventId)

    #get route
    print ("Enrollment part finished")
    coordinates = serverRequests.getRoute(url,eventId)
    print (coordinates)
    r = Route(coordinates)
    #simulate
    simulator.simulate(url,eventId,participants,r)

if (len(sys.argv) > 1):
    eventId = sys.argv[1]
main(eventId)
