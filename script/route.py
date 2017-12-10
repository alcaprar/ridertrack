import math

class Route:

    def __init__(self,coordinates):
        self.__coordinates = []
        for coordinate in coordinates:
            self.__coordinates.append(coordinate)

    def getStartingPoint(self):
        return self.__coordinates[0]

    def getLastPoint(self):
        return self.__coordinates[len(self.__coordinates) - 1]

    def getLastCheckpoint(self):
        return len(self.__coordinates) - 1

    def getCoordinate(self,checkpoint):
        return self.__coordinates[checkpoint]

    def calculateVector(self,checkpoint):

        #out of range
        if (len(self.__coordinates)-1 <= checkpoint):
            return (0.0,0.0)
        
        coordPast = self.__coordinates[checkpoint]
        coordNext = self.__coordinates[checkpoint + 1]

        length = math.sqrt(math.pow(coordNext[0] - coordPast[0],2)+math.pow(coordNext[1] - coordPast[1],2))
        xVector = (float (coordNext[0] - coordPast[0]))/length
        yVector = (float (coordNext[1] - coordPast[1]))/length

        return (xVector,yVector)

    def setCheckpoint(self,checkpoint,position):

        if (self.getLastCheckpoint() == checkpoint):
            return checkpoint

        eps = 0.000000001
        vector = self.calculateVector(checkpoint)

        coordNext = self.__coordinates[checkpoint + 1]

        length = math.sqrt (math.pow (coordNext[0] - position[0],2) + math.pow(coordNext[1] - position[1],2))
        realXVector = (float (coordNext[0] - position[0]))/length
        realYVector = (float (coordNext[1] - position[1]))/length


        if (math.fabs(vector[0] - realXVector) > eps or math.fabs(vector[1] - realYVector) > eps):
            return True
        else:
            return False
