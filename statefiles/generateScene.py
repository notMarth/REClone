import numpy as np
#x gives the x length of the room
#z gives the z length of the room
#y gives the height of the room
#origin gives the bottom left corner of the room (tuple)
#door gives door boundaries on z plane at origin of room (tuple of corners + height)
#suggestion: add number of triangles per rectangle subsection? Not sure if
#large rectangles will be nice on textures
#Just generates rectangles to bound the room
def generateRoom1(x, z, y, origin, door, vertInd):
    vlist = []
    nlist = []
    flist = []
    uvlist = []

    #FRONT FACE 1
    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], origin[2] + door[0]])
    vlist.append([origin[0], origin[1]+door[2], origin[2] + door[0]])
    vlist.append([origin[0], origin[1]+door[2], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], origin[2] + door[0]])
    nlist.append([origin[0], origin[1]+door[2], origin[2] + door[0]])
    nlist.append([origin[0], origin[1]+door[2], origin[2]])

    flist.append([0, 2, 1])
    flist.append([0, 3, 2])

    uvlist.append([0, 0])
    uvlist.append([door[0]/z, 0])
    uvlist.append([door[0]/z, door[2]/y])
    uvlist.append([0, door[2]/y])


    #FRONT FACE 2
    vlist.append([origin[0], origin[1], origin[2] + door[1]])
    vlist.append([origin[0], origin[1], origin[2] + z])
    vlist.append([origin[0], origin[1]+door[2], origin[2] + z])
    vlist.append([origin[0], origin[1]+door[2], origin[2] + door[1]])


    nlist.append([origin[0], origin[1], origin[2] + door[1]])
    nlist.append([origin[0], origin[1], origin[2] + z])
    nlist.append([origin[0], origin[1]+door[2], origin[2] + z])
    nlist.append([origin[0], origin[1]+door[2], origin[2] + door[1]])

    flist.append([4, 6, 5])
    flist.append([4, 7, 6])

    uvlist.append([0, 0])
    uvlist.append([door[1], 0])
    uvlist.append([door[1], door[2]/y])
    uvlist.append([0, door[2]/y])

    #FRONT FACE TOP
    vlist.append([origin[0], origin[1] + door[2], origin[2]])
    vlist.append([origin[0], origin[1] + y, origin[2]])
    vlist.append([origin[0], origin[1] + y, origin[2] + z])
    vlist.append([origin[0], origin[1] + door[2], origin[2] + z])

    nlist.append([origin[0], origin[1] + door[2], origin[2]])
    nlist.append([origin[0], origin[1] + y, origin[2]])
    nlist.append([origin[0], origin[1] + y, origin[2] + z])
    nlist.append([origin[0], origin[1] + door[2], origin[2] + z])

    flist.append([8, 9, 10])
    flist.append([8, 10, 11])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])
    
    vlist.append([origin[0], origin[1], origin[2]+z])
    vlist.append([origin[0]+x, origin[1], origin[2] + z])
    vlist.append([origin[0]+x, origin[1]+y, origin[2] + z])
    vlist.append([origin[0], origin[1]+y, origin[2]+z])

    nlist.append([origin[0], origin[1], origin[2]+z])
    nlist.append([origin[0]+x, origin[1], origin[2] + z])
    nlist.append([origin[0]+x, origin[1]+y, origin[2] + z])
    nlist.append([origin[0], origin[1]+y, origin[2]+z])

    flist.append([12, 13, 14])
    flist.append([12, 14, 15])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    vlist.append([origin[0]+x, origin[1], origin[2]+z])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]+z])
    vlist.append([origin[0]+x, origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]])

    nlist.append([origin[0]+x, origin[1], origin[2]+z])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]+z])
    nlist.append([origin[0]+x, origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]])

    flist.append([16, 18, 17])
    flist.append([17, 18, 19])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    vlist.append([origin[0]+x, origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]])
    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1]+y, origin[2]])

    nlist.append([origin[0]+x, origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]])
    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1]+y, origin[2]])

    flist.append([20, 22, 21])
    flist.append([21, 22, 23])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], origin[2] + z])
    vlist.append([origin[0]+x, origin[1], origin[2] + z])
    vlist.append([origin[0]+x, origin[1], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], origin[2] + z])
    nlist.append([origin[0]+x, origin[1], origin[2] + z])
    nlist.append([origin[0]+x, origin[1], origin[2]])

    flist.append([24, 26, 25])
    flist.append([24, 27, 26])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    vlist.append([origin[0], origin[1]+y, origin[2]])
    vlist.append([origin[0], origin[1]+y, origin[2] + z])
    vlist.append([origin[0]+x, origin[1]+y, origin[2] + z])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]])

    nlist.append([origin[0], origin[1]+y, origin[2]])
    nlist.append([origin[0], origin[1]+y, origin[2] + z])
    nlist.append([origin[0]+x, origin[1]+y, origin[2] + z])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]])

    flist.append([28, 29, 30])
    flist.append([28, 30, 31])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    for i in range(len(flist)):
        for j in flist[i]:
            j+=vertInd

    return vlist, nlist, flist, uvlist, (vertInd + len(vlist))

#x gives the x length of the room
#z gives the z length of the room
#y gives the height of the room
#origin gives the bottom left corner of the room (tuple)
#door gives door boundaries on z plane at origin of room (tuple of corners + height)
#suggestion: add number of triangles per rectangle subsection? Not sure if
#large rectangles will be nice on textures
#Just generates rectangles to bound the room
def generateMainRoom(x, z, y, origin, door1, door2, vertInd):
    vlist = []
    nlist = []
    flist = []
    uvlist = []

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], origin[2] + door1[0]])
    vlist.append([origin[0], origin[1]+door1[2], origin[2] + door1[0]])
    vlist.append([origin[0], origin[1]+door1[2], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], origin[2] + door1[0]])
    nlist.append([origin[0], origin[1]+door1[2], origin[2] + door1[0]])
    nlist.append([origin[0], origin[1]+door1[2], origin[2]])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([0, 1, 2])
    flist.append([0, 2, 3])

    vlist.append([origin[0], origin[1], origin[2] + z])
    vlist.append([origin[0], origin[1], origin[2] + door1[1]])
    vlist.append([origin[0], origin[1]+door1[2], origin[2] + door1[1]])
    vlist.append([origin[0], origin[1]+door1[2], origin[2] + z])

    nlist.append([origin[0], origin[1], origin[2] + z])
    nlist.append([origin[0], origin[1], origin[2] + door1[1]])
    nlist.append([origin[0], origin[1]+door1[2], origin[2] + door1[1]])
    nlist.append([origin[0], origin[1]+door1[2], origin[2] + z])

    uvlist.append([1, 0])
    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])

    flist.append([4, 7, 5])
    flist.append([5, 7, 6])

    vlist.append([origin[0], origin[1] + door1[2], origin[2]])
    vlist.append([origin[0], origin[1] + y, origin[2]])
    vlist.append([origin[0], origin[1] + y, origin[2] + z])
    vlist.append([origin[0], origin[1] + door1[2], origin[2] + z])

    nlist.append([origin[0], origin[1] + door1[2], origin[2]])
    nlist.append([origin[0], origin[1] + y, origin[2]])
    nlist.append([origin[0], origin[1] + y, origin[2] + z])
    nlist.append([origin[0], origin[1] + door1[2], origin[2] + z])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    flist.append([8, 10, 9])
    flist.append([8, 11, 10])
    
    vlist.append([origin[0], origin[1], origin[2]+z])
    vlist.append([origin[0]+door2[0], origin[1], origin[2] + z])
    vlist.append([origin[0]+door2[0], origin[1]+door2[2], origin[2] + z])
    vlist.append([origin[0], origin[1]+door2[2], origin[2]+z])

    nlist.append([origin[0], origin[1], origin[2]+z])
    nlist.append([origin[0]+door2[0], origin[1], origin[2] + z])
    nlist.append([origin[0]+door2[0], origin[1]+door2[2], origin[2] + z])
    nlist.append([origin[0], origin[1]+door2[2], origin[2]+z])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([12, 14, 13])
    flist.append([12, 15, 14])

    vlist.append([origin[0]+door2[1], origin[1], origin[2]+z])
    vlist.append([origin[0]+x, origin[1], origin[2]+z])
    vlist.append([origin[0]+x, origin[1] + door2[2], origin[2] + z])
    vlist.append([origin[0]+door2[1], origin[1]+door2[2], origin[2]+z])

    nlist.append([origin[0]+door2[1], origin[1], origin[2]+z])
    nlist.append([origin[0]+x, origin[1], origin[2]+z])
    nlist.append([origin[0]+x, origin[1] + door2[2], origin[2]])
    nlist.append([origin[0]+door2[1], origin[1]+door2[2], origin[2]])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([16, 18, 17])
    flist.append([16, 19, 18])

    vlist.append([origin[0], origin[1] + door2[2], origin[2]+z])
    vlist.append([origin[0], origin[1] + y, origin[2]+z])
    vlist.append([origin[0]+x, origin[1] + y, origin[2]+z])
    vlist.append([origin[0]+x, origin[1]+door2[2], origin[2]+z])

    nlist.append([origin[0], origin[1]+door2[2], origin[2]+z])
    nlist.append([origin[0], origin[1]+y, origin[2]+z])
    nlist.append([origin[0]+x, origin[1] + y, origin[2]])
    nlist.append([origin[0]+x, origin[1]+door2[2], origin[2]])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    flist.append([20, 22, 23])
    flist.append([20, 21, 22])    

    #OLD STUFF HERE

    vlist.append([origin[0]+x, origin[1], origin[2]+z])
    vlist.append([origin[0]+x, origin[1] + y, origin[2]+z])
    vlist.append([origin[0]+x, origin[1] + y, origin[2]])
    vlist.append([origin[0]+x, origin[1], origin[2]])

    nlist.append([origin[0]+x, origin[1], origin[2]+z])
    nlist.append([origin[0]+x, origin[1] + y, origin[2]+z])
    nlist.append([origin[0]+x, origin[1] + y, origin[2]])
    nlist.append([origin[0]+x, origin[1], origin[2]])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    flist.append([24, 25, 26])
    flist.append([24, 26, 27])    

    vlist.append([origin[0]+x, origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]])
    vlist.append([origin[0], origin[1] + y, origin[2]])
    vlist.append([origin[0], origin[1], origin[2]])

    nlist.append([origin[0]+x, origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]])
    nlist.append([origin[0], origin[1]+y, origin[2]])
    nlist.append([origin[0], origin[1], origin[2]])

    uvlist.append([0, 0])
    uvlist.append([0, 1])
    uvlist.append([1, 1])
    uvlist.append([1, 0])

    flist.append([28, 29, 30])
    flist.append([28, 30, 31])


    vlist.append([origin[0], origin[1]+y, origin[2]])
    vlist.append([origin[0], origin[1]+y, origin[2] + z])
    vlist.append([origin[0]+x, origin[1]+y, origin[2] + z])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]])

    nlist.append([origin[0], origin[1]+y, origin[2]])
    nlist.append([origin[0], origin[1]+y, origin[2] + z])
    nlist.append([origin[0]+x, origin[1]+y, origin[2] + z])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([32, 34, 33])
    flist.append([32, 35, 34])

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], origin[2] + z])
    vlist.append([origin[0]+x - 10, origin[1], origin[2] + z])
    vlist.append([origin[0]+x - 10, origin[1], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], origin[2] + z])
    nlist.append([origin[0]+x - 10, origin[1], origin[2] + z])
    nlist.append([origin[0]+x - 10, origin[1], origin[2]])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([36, 37, 38])
    flist.append([36, 38, 39])

    vlist.append([origin[0]+x-10, origin[1], origin[2]+z])
    vlist.append([origin[0]+x, origin[1], origin[2] + z])
    vlist.append([origin[0]+x, origin[1], origin[2] + z-6])
    vlist.append([origin[0]+x-10, origin[1], origin[2]+z-6])

    nlist.append([origin[0]+x-10, origin[1], origin[2]+z])
    nlist.append([origin[0]+x, origin[1], origin[2] + z])
    nlist.append([origin[0]+x, origin[1], origin[2] + z-6])
    nlist.append([origin[0]+x - 10, origin[1], origin[2]+z-6])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([40, 41, 42])
    flist.append([40, 42, 43])

    vlist.append([origin[0]+x-10, origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1], origin[2] + 6])
    vlist.append([origin[0]+x - 10, origin[1], origin[2]+6])

    nlist.append([origin[0]+x-10, origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1], origin[2] + 6])
    nlist.append([origin[0]+x - 10, origin[1], origin[2]+6])

    uvlist.append([0, 0])
    uvlist.append([1, 0])
    uvlist.append([1, 1])
    uvlist.append([0, 1])

    flist.append([44, 46, 45])
    flist.append([44, 47, 46])


    for i in range(len(flist)):
        for j in flist[i]:
            j+=vertInd

    return vlist, nlist, flist, uvlist, (vertInd + len(vlist))

#x gives the x width of the hallway
#y gives the height of the hallway
#z gives the z width of the hallway
#origin gives the lower left corner of the hallway entrance
#use this one for hallways in the x direction
def generateHallway1(x, y, z, origin, vertInd):
    vlist = []
    nlist = []
    flist = []

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0] + x, origin[1], origin[2]])
    vlist.append([origin[0] + x, origin[1] + y, origin[2]])
    vlist.append([origin[0], origin[1] + y, origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0] + x, origin[1], origin[2]])
    nlist.append([origin[0] + x, origin[1] + y, origin[2]])
    nlist.append([origin[0], origin[1] + y, origin[2]])

    flist.append([0, 2, 1])
    flist.append([0, 3, 2])

    vlist.append([origin[0], origin[1], origin[2]+z])
    vlist.append([origin[0] + x, origin[1], origin[2]+z])
    vlist.append([origin[0] + x, origin[1] + y, origin[2]+z])
    vlist.append([origin[0], origin[1] + y, origin[2]+z])

    nlist.append([origin[0], origin[1], origin[2]+z])
    nlist.append([origin[0] + x, origin[1], origin[2]+z])
    nlist.append([origin[0] + x, origin[1] + y, origin[2]+z])
    nlist.append([origin[0], origin[1] + y, origin[2]+z])

    flist.append([4, 5, 6])
    flist.append([4, 6, 7])

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], origin[2]+z])
    vlist.append([origin[0] + x, origin[1], origin[2]+z])
    vlist.append([origin[0] + x, origin[1], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], origin[2]+z])
    nlist.append([origin[0] + x, origin[1], origin[2]+z])
    nlist.append([origin[0] + x, origin[1], origin[2]])

    flist.append([8, 10, 9])
    flist.append([8, 11, 10])

    vlist.append([origin[0], origin[1]+y, origin[2]])
    vlist.append([origin[0], origin[1]+y, origin[2]+z])
    vlist.append([origin[0] + x, origin[1]+y, origin[2]+z])
    vlist.append([origin[0] + x, origin[1]+y, origin[2]])

    nlist.append([origin[0], origin[1]+y, origin[2]])
    nlist.append([origin[0], origin[1]+y, origin[2]+z])
    nlist.append([origin[0] + x, origin[1]+y, origin[2]+z])
    nlist.append([origin[0] + x, origin[1]+y, origin[2]])

    flist.append([12, 13, 14])
    flist.append([12, 14, 15])

    for i in range(len(flist)):
        for j in flist[i]:
            j+=vertInd

    return vlist, nlist, flist, (vertInd + len(vlist))

#x gives the x width of the hallway
#y gives the height of the hallway
#z gives the z width of the hallway
#origin gives the lower left corner of the hallway entrance
#use this one for hallways in the z direction
def generateHallway2(x, y, z, origin, vertInd):
    vlist = []
    nlist = []
    flist = []

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], origin[2]+z])
    vlist.append([origin[0], origin[1] + y, origin[2]+z])
    vlist.append([origin[0], origin[1] + y, origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], origin[2]+z])
    nlist.append([origin[0], origin[1] + y, origin[2]+z])
    nlist.append([origin[0], origin[1] + y, origin[2]])

    flist.append([0, 2, 1])
    flist.append([0, 3, 2])

    vlist.append([origin[0] + x, origin[1], origin[2]])
    vlist.append([origin[0] + x, origin[1], origin[2]+z])
    vlist.append([origin[0] + x, origin[1] + y, origin[2]+z])
    vlist.append([origin[0] + x, origin[1] + y, origin[2]])

    nlist.append([origin[0] + x, origin[1], origin[2]])
    nlist.append([origin[0] + x, origin[1], origin[2]+z])
    nlist.append([origin[0] + x, origin[1] + y, origin[2]+z])
    nlist.append([origin[0] + x, origin[1] + y, origin[2]])

    flist.append([4, 5, 6])
    flist.append([4, 6, 7])

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1], origin[2]])
    vlist.append([origin[0]+x, origin[1], origin[2]+z])
    vlist.append([origin[0], origin[1], origin[2]+z])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1], origin[2]])
    nlist.append([origin[0]+x, origin[1], origin[2]+z])
    nlist.append([origin[0], origin[1], origin[2]+z])

    flist.append([8, 10, 9])
    flist.append([8, 11, 10])

    vlist.append([origin[0], origin[1]+y, origin[2]])
    vlist.append([origin[0]+x, origin[1]+y, origin[2]])
    vlist.append([origin[0] + x, origin[1]+y, origin[2]+z])
    vlist.append([origin[0], origin[1]+y, origin[2]+z])

    nlist.append([origin[0], origin[1]+y, origin[2]])
    nlist.append([origin[0]+x, origin[1]+y, origin[2]])
    nlist.append([origin[0] + x, origin[1]+y, origin[2]+z])
    nlist.append([origin[0], origin[1]+y, origin[2]+z])

    flist.append([12, 13, 14])
    flist.append([12, 14, 15])

    for i in range(len(flist)):
        for j in flist[i]:
            j+=vertInd

    return vlist, nlist, flist, (vertInd + len(vlist))

#generate a hallway corner
#origin gives the lower left corner of the wall
#wall1 gives the x ,y, and z distances for the first wall
#wall2 gives the above for the second wall
#vertind is the number of vertices generated by other objects before this one it generated
def generateHallwayCorner(origin, wall1, wall2, vertInd):
    vlist = []
    nlist = []
    flist = []

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0] + wall1[0], origin[1], origin[2] + wall1[2]])
    vlist.append([origin[0] + wall1[0], origin[1] + wall1[1], origin[2] + wall1[2]])
    vlist.append([origin[0], origin[1] + wall1[1], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0] + wall1[0], origin[1], origin[2] + wall1[2]])
    nlist.append([origin[0] + wall1[0], origin[1] + wall1[1], origin[2] + wall1[2]])
    nlist.append([origin[0], origin[1] + wall1[1], origin[2]])

    flist.append([0, 2, 1])
    flist.append([0, 3, 2])

    vlist.append([origin[0] + wall1[0], origin[1], origin[2] + wall1[2]])
    vlist.append([origin[0] + wall1[0] + wall2[0], origin[1], origin[2] + wall1[2] + wall2[2]])
    vlist.append([origin[0] + wall1[0] + wall2[0], origin[1] + wall2[1], origin[2] + wall1[2] + wall2[2]])
    vlist.append([origin[0] + wall1[0], origin[1] + wall1[1], origin[2] + wall1[2]])

    nlist.append([origin[0] + wall1[0], origin[1], origin[2] + wall1[2]])
    nlist.append([origin[0] + wall1[0] + wall2[0], origin[1], origin[2] + wall1[2] + wall2[2]])
    nlist.append([origin[0] + wall1[0] + wall2[0], origin[1] + wall2[1], origin[2] + wall1[2] + wall2[2]])
    nlist.append([origin[0] + wall1[0], origin[1] + wall2[1], origin[2] + wall1[2]])

    flist.append([4, 6, 5])
    flist.append([4, 7, 6])

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0] + wall1[0], origin[1], origin[2] + wall1[2]])
    vlist.append([origin[0] + wall1[0] + wall2[0], origin[1], origin[2] + wall1[2] + wall2[2]])
    vlist.append([origin[0] + wall2[0], origin[1], origin[2] + wall2[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0] + wall1[0], origin[1], origin[2] + wall1[2]])
    nlist.append([origin[0] + wall1[0] + wall2[0], origin[1], origin[2] + wall1[2] + wall2[2]])
    nlist.append([origin[0] + wall2[0], origin[1], origin[2] + wall2[2]])

    flist.append([8, 9, 10])
    flist.append([8, 10, 11])

    vlist.append([origin[0], origin[1]+wall1[1], origin[2]])
    vlist.append([origin[0] + wall1[0], origin[1]+wall1[1], origin[2] + wall1[2]])
    vlist.append([origin[0] + wall1[0] + wall2[0], origin[1]+ wall2[1], origin[2] + wall1[2] + wall2[2]])
    vlist.append([origin[0] + wall2[0], origin[1] + wall2[1], origin[2] + wall2[2]])

    nlist.append([origin[0], origin[1]+wall1[1], origin[2]])
    nlist.append([origin[0] + wall1[0], origin[1]+wall1[1], origin[2] + wall1[2]])
    nlist.append([origin[0] + wall1[0] + wall2[0], origin[1]+ wall2[1], origin[2] + wall1[2] + wall2[2]])
    nlist.append([origin[0] + wall2[0], origin[1] + wall2[1], origin[2] + wall2[2]])

    flist.append([12, 14, 13])
    flist.append([12, 15, 14])

    
    for i in range(len(flist)):
            for j in flist[i]:
                j+=vertInd

    return vlist, nlist, flist, (vertInd + len(vlist))

def generateGlassPanel(origin, corner, thickness, vertInd):
    vlist = []
    nlist = []
    flist = []

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], corner[1]])
    vlist.append([corner[0], origin[1], corner[1]])
    vlist.append([corner[0], origin[1], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], corner[1]])
    nlist.append([corner[0], origin[1], corner[1]])
    nlist.append([corner[0], origin[1], origin[2]])

    flist.append([0,2,1])
    flist.append([0,3,2])

    for i in range(len(flist)):
            for j in flist[i]:
                j+=vertInd

    return vlist, nlist, flist, (vertInd + len(vlist))

def generateStaircase(origin, corner, vertInd):
    vlist = []
    nlist = []
    flist = []

    vlist.append([origin[0], origin[1], origin[2]])
    vlist.append([origin[0], origin[1], corner[2]])
    vlist.append([corner[0], corner[1], corner[2]])
    vlist.append([corner[0], corner[1], origin[2]])

    nlist.append([origin[0], origin[1], origin[2]])
    nlist.append([origin[0], origin[1], corner[2]])
    nlist.append([corner[0], corner[1], corner[2]])
    nlist.append([corner[0], corner[1], origin[2]])


    flist.append([0,2,1])
    flist.append([0,3,2])

    for i in range(len(flist)):
            for j in flist[i]:
                j+=vertInd

    return vlist, nlist, flist, (vertInd + len(vlist))

def generateRope(origin, endPoint, width, n, vertInd):
    vlist = []
    nlist = []
    flist = []

    rad = np.linspace(0, 2*np.pi, n)

    h = np.abs(origin[1] - endPoint[1])

    vlist.append([endPoint[0], endPoint[1], endPoint[2]])
    vlist.append([origin[0], origin[1], origin[2]])

    for i in range(n-1):
        p1 = [width*np.cos(rad[i]) + endPoint[0], endPoint[1] , width*np.sin(rad[i]) + endPoint[2]]
        p2 = [width*np.cos(rad[i]) + origin[0], origin[1], width*np.sin(rad[i]) + origin[2]]
        p3 = [width*np.cos(rad[i+1]) + endPoint[0], endPoint[1], width*np.sin(rad[i+1]) + endPoint[2]]
        p4 = [width*np.cos(rad[i+1]) + origin[0], origin[1], width*np.sin(rad[i+1]) + origin[2]]

        vlist.append(p1)
        vlist.append(p2)
        vlist.append(p3)
        vlist.append(p4)
        nlist.append(p1)
        nlist.append(p2)
        nlist.append(p3)
        nlist.append(p4)

        ftop = [(i*4)+1+1, (i*4)+3+1, 0]
        fbottom = [(i*4)+2+1, (i*4)+4+1, 1]
        f1 = [(i*4)+3+1, (i*4)+1+1, (i*4)+2+1]
        f2 = [(i*4)+2+1, (i*4)+4+1, (i*4)+3+1]

        flist.append(ftop)
        flist.append(fbottom)
        flist.append(f1)
        flist.append(f2)

        i += 1

    for i in range(len(flist)):
        for j in flist[i]:
            j+=vertInd

    return vlist, nlist, flist, (vertInd + len(vlist))


#x gives the x length of the room
#z gives the z length of the room
#y gives the height of the room
#origin gives the bottom left corner of the room (tuple)
#suggestion: add number of triangles per rectangle subsection? Not sure if
#large rectangles will be nice on textures
#Just generates rectangles to bound the room
#Used for obj testing in 3dviewer
def generateRoomObj(x, z, y, origin, door):
    vlist = []
    nlist = []
    flist = []
    ind = 8

    vlist.append(f'v {origin[0]} {origin[1]} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1]} {origin[2] + door[0]}')
    vlist.append(f'v {origin[0]} {origin[1]+door[2]} {origin[2] + door[0]}')
    vlist.append(f'v {origin[0]} {origin[1]+door[2]} {origin[2]}')

    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2] + door[0]}')
    nlist.append(f'vn {origin[0]} {origin[1]+door[2]} {origin[2] + door[0]}')
    nlist.append(f'vn {origin[0]} {origin[1]+door[2]} {origin[2]}')

    flist.append('f 1//1 3//3 2//2')
    flist.append('f 1//1 4//4 3//3')

    vlist.append(f'v {origin[0]} {origin[1]} {origin[2] + z}')
    vlist.append(f'v {origin[0]} {origin[1]} {origin[2] + door[1]}')
    vlist.append(f'v {origin[0]} {origin[1]+door[2]} {origin[2] + door[1]}')
    vlist.append(f'v {origin[0]} {origin[1]+door[2]} {origin[2] + z}')

    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2] + z}')
    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2] + door[1]}')
    nlist.append(f'vn {origin[0]} {origin[1]+door[2]} {origin[2] + door[1]}')
    nlist.append(f'vn {origin[0]} {origin[1]+door[2]} {origin[2] + z}')

    flist.append('f 5//5 6//6 8//8')
    flist.append('f 6//6 7//7 8//8')

    vlist.append(f'v {origin[0]} {origin[1] + door[2]} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1] + y} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1] + y} {origin[2] + z}')
    vlist.append(f'v {origin[0]} {origin[1] + door[2]} {origin[2] + z}')

    nlist.append(f'vn {origin[0]} {origin[1] + door[2]} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1] + y} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1] + y} {origin[2] + z}')
    nlist.append(f'vn {origin[0]} {origin[1] + door[2]} {origin[2] + z}')

    flist.append('f 9//9 11//11 12//12')
    flist.append('f 9//9 10//10 11//11')
    
    vlist.append(f'v {origin[0]} {origin[1]} {origin[2]+z}')
    vlist.append(f'v {origin[0]+x} {origin[1]} {origin[2] + z}')
    vlist.append(f'v {origin[0]+x} {origin[1]+y} {origin[2] + z}')
    vlist.append(f'v {origin[0]} {origin[1]+y} {origin[2]+z}')

    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2]+z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]} {origin[2] + z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]+y} {origin[2] + z}')
    nlist.append(f'vn {origin[0]} {origin[1]+y} {origin[2]+z}')

    flist.append(f'f {5+ind}//{5+ind} {7+ind}//{7+ind} {6+ind}//{6+ind}')
    flist.append(f'f {ind+5}//{ind+5} {ind+8}//{ind+8} {ind+7}//{ind+7}')

    vlist.append(f'v {origin[0]+x} {origin[1]} {origin[2]+z}')
    vlist.append(f'v {origin[0]+x} {origin[1]+y} {origin[2]+z}')
    vlist.append(f'v {origin[0]+x} {origin[1]} {origin[2]}')
    vlist.append(f'v {origin[0]+x} {origin[1]+y} {origin[2]}')

    nlist.append(f'vn {origin[0]+x} {origin[1]} {origin[2]+z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]+y} {origin[2]+z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]} {origin[2]}')
    nlist.append(f'vn {origin[0]+x} {origin[1]+y} {origin[2]}')

    flist.append(f'f {ind+9}//{ind+9} {ind+10}//{ind+10} {ind+11}//{ind+11}')
    flist.append(f'f {ind+11}//{ind+11} {ind+10}//{ind+10} {ind+12}//{ind+12}')

    vlist.append(f'v {origin[0]+x} {origin[1]} {origin[2]}')
    vlist.append(f'v {origin[0]+x} {origin[1]+y} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1]} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1]+y} {origin[2]}')

    nlist.append(f'vn {origin[0]+x} {origin[1]} {origin[2]}')
    nlist.append(f'vn {origin[0]+x} {origin[1]+y} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1]+y} {origin[2]}')

    flist.append(f'f {ind+13}//{ind+13} {ind+14}//{ind+14} {ind+15}//{ind+15}')
    flist.append(f'f {ind+15}//{ind+15} {ind+16}//{ind+16} {ind+14}//{ind+14}')

    vlist.append(f'v {origin[0]} {origin[1]} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1]} {origin[2] + z}')
    vlist.append(f'v {origin[0]+x} {origin[1]} {origin[2] + z}')
    vlist.append(f'v {origin[0]+x} {origin[1]} {origin[2]}')

    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1]} {origin[2] + z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]} {origin[2] + z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]} {origin[2]}')

    flist.append(f'f {ind+17}//{ind+17} {ind+18}//{ind+18} {ind+19}//{ind+19}')
    flist.append(f'f {ind+17}//{ind+17} {ind+19}//{ind+19} {ind+20}//{ind+20}')

    vlist.append(f'v {origin[0]} {origin[1]+y} {origin[2]}')
    vlist.append(f'v {origin[0]} {origin[1]+y} {origin[2] + z}')
    vlist.append(f'v {origin[0]+x} {origin[1]+y} {origin[2] + z}')
    vlist.append(f'v {origin[0]+x} {origin[1]+y} {origin[2]}')

    nlist.append(f'vn {origin[0]} {origin[1]+y} {origin[2]}')
    nlist.append(f'vn {origin[0]} {origin[1]+y} {origin[2] + z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]+y} {origin[2] + z}')
    nlist.append(f'vn {origin[0]+x} {origin[1]+y} {origin[2]}')

    flist.append(f'f {ind+21}//{ind+21} {ind+23}//{ind+23} {ind+22}//{ind+22}')
    flist.append(f'f {ind+21}//{ind+21} {ind+24}//{ind+24} {ind+23}//{ind+23}')

    return vlist, nlist, flist

if __name__ == "__main__":

    with open('scene.json', 'w') as f:

############################################################ GENERATE FIRST ROOM
        vlist, nlist, flist, uvlist, vInd = generateRoom1(5, 5, 5, (0, 0, 0), (1, 3, 3), 0)

        #OBJECT MATERIAL INFO
        f.write('[ { "objects": [ {"name": "Room1", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [1.0,1.0,1.0],"n": 10.000002,"shaderType": 3,"alpha": 1},"type":"CustomRoom",')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')
        
        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        f.write(', "uvs": [')
        for i in range(len(uvlist)-1):
            f.write(f'{uvlist[i]}, ')
        f.write(f'{uvlist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write(', "diffuseTexture": "wall.jpg","normalTexture": "defaultNorm.jpg"},')
        
############################################################# GENERATE HALLWAY 1
        vlist, nlist, flist, vInd = generateHallway1(-10, 5, -2, (0, 0, 3), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "Hall1", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [1.0,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type":"CustomHall",')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write('},')

###################################################### GENERATE HALLWAY CORNER 1
        vlist, nlist, flist, vInd = generateHallwayCorner((-10, 0, 3), (-2, 5, 0), (0, 5, -2), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "HallCorner1", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type":"CustomHallCorner",')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write('},')

############################################################# GENERATE HALLWAY 2
        vlist, nlist, flist, vInd = generateHallway2(2, 5, -7, (-12, 0, 1), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "Hall2", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type":"CustomHall",')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write('},')

##############################################################GENERATE MAIN ROOM
        vlist, nlist, flist, uvlist, vInd = generateMainRoom(30, 24, 10, (-21, 0, -30), (10, 11, 3), (9, 11, 3), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "MainRoom", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1},"type":"CustomRoom", "diffuseTexture": "wall.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write(', "uvs": [')
        for i in range(len(uvlist)-1):
            f.write(f'{uvlist[i]}, ')
        f.write(f'{uvlist[-1]}]')
        f.write('},')

########################################################### GENERATE GLASS PANEL
        vlist, nlist, flist, vInd = generateGlassPanel((-1, 0, -24), (9, -12), 1, vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "GlassPanel", "material": {"diffuse": [1,1,1],"ambient": [1,1,1], "specular": [1,1,1],"n": 300,"shaderType": 1,"alpha": 0.3},"type":"CustomPanel", "diffuseTexture": "default.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        
        f.write('},')

############################################################# GENERATE STAIRCASE
        vlist, nlist, flist, vInd = generateStaircase((-1, 0, -24), (20, -5, -12), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "StairCase", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1.0},"type":"CustomStair", "diffuseTexture": "default.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        
        f.write('},')


################################################################## GENERATE ROPE
        vlist, nlist, flist, vInd = generateRope((0, 0, -6), (4, 10, -18), 0.1, 1000, vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "Rope", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1.0},"type":"CustomRope", "diffuseTexture": "default.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        
        f.write('},')

########################################################## GENERATE PUZZLE ROOM
        vlist, nlist, flist, uvlist, vInd = generateRoom1(-10, 24, 5, (-21.01, 0, -30), (10,11,3), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "PuzzleRoom", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type":"CustomRoom",')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write('},')

######################################################### GENERATE PUZZLE PANELS
#RED
        vlist, nlist, flist, vInd = generateGlassPanel((-26, 0.01, -9), (-25, -8), 1, vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "RedPanel", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1},"type":"CustomPanel", "diffuseTexture": "default.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        
        f.write('},')

#GREEN
        vlist, nlist, flist, vInd = generateGlassPanel((-28, 0.01, -8), (-27, -7), 1, vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "GreenPanel", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1},"type":"CustomPanel", "diffuseTexture": "default.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        
        f.write('},')

#BLUE
        vlist, nlist, flist, vInd = generateGlassPanel((-30, 0.01, -9), (-29, -8), 1, vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "BluePanel", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1},"type":"CustomPanel", "diffuseTexture": "default.jpg", ')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        
        f.write('},')

########################################################### GENERATE END HALLWAY
        vlist, nlist, flist, vInd = generateHallway1(80, 8, 10, (0, -50, 0), vInd)

        #OBJECT MATERIAL INFO
        f.write('{"name": "HallEnd", "material": {"diffuse": [0.1,0.1,0.1],"ambient": [0.3,0.3,0.3], "specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type":"CustomHall",')
        
        #START VERTICES
        f.write('"vertices": [')
        for i in range(len(vlist)-1):
            f.write(f'{vlist[i]}, ')

        #START NORMALS
        f.write(f'{vlist[-1]}], "normals": [')
        for i in range(len(nlist)-1):
            f.write(f'{nlist[i]}, ')

        #START TRIANGLES
        f.write(f'{nlist[-1]}], "triangles": [')
        for i in range(len(flist)-1):
            f.write(f'{flist[i]}, ')
        f.write(f'{flist[-1]}]')

        #OBJECT TEXTURE INFO
        f.write('},')

####################################### PLAYER, CHANDELIER, CAMERA, AND SETTINGS
        f.write('{"name":"Chandelier","material":{"diffuse":[0.5,0.25,0.0],"ambient":[0.3,0.3,0.3],"specular":[0.5,0.5,0.5],"n":10.000002,"shaderType":1,"alpha":1},"type":"mesh","position":[-3048,51.8,1393],"scale":[0.0390625,0.0390625,0.0390625],"diffuseTexture":"default.jpg","normalTexture":"defaultNorm.jpg","rotation":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"parent":null,"model":"chandelier.obj"},')
        f.write('{"name": "Player","material": {"diffuse": [0.1,0.1,0.1],"ambient": [1,1,1],"specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1},"type": "cube","position": [2.5,0,2.5],"scale": [1,2.5,1],"diffuseTexture": "playerBump.jpg","normalTexture": "playerNorm.jpg","rotation": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"parent": null,"model": null},')
        f.write('{"name": "Zombie","material": {"diffuse": [0,0.6,0],"ambient": [1,1,1],"specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 3,"alpha": 1},"type": "cube","position": [-5,-50,5],"scale": [1,2.5,1],"diffuseTexture": "playerBump.jpg","normalTexture": "playerNorm.jpg","rotation": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"parent": null,"model": null},')
        f.write('{"name": "RedCrate","material": {"diffuse": [1,0,0],"ambient": [0.3,0.3,0.3],"specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type": "cube","position": [-30,0,-8],"scale": [1,1,1],"diffuseTexture": "default.jpg","normalTexture": "defaultNorm.jpg","parent": null,"model": null},')
        f.write('{"name": "BlueCrate","material": {"diffuse": [0,0,1],"ambient": [0.3,0.3,0.3],"specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type": "cube","position": [-27,0,-24],"scale": [1,1,1],"diffuseTexture": "default.jpg","normalTexture": "defaultNorm.jpg","parent": null,"model": null},')
        f.write('{"name": "GreenCrate","material": {"diffuse": [0,1,0],"ambient": [0.3,0.3,0.3],"specular": [0.5,0.5,0.5],"n": 10.000002,"shaderType": 1,"alpha": 1},"type": "cube","position": [-25,0,-29],"scale": [1,1,1],"diffuseTexture": "default.jpg","normalTexture": "defaultNorm.jpg","parent": null,"model": null}')
        f.write('],')
        f.write('"pointLights": [{"name": "startingRoomLight","colour": [0.1,0.025,0.01],"position": [10,10,10],"strength": 3,"quadratic": 0.035,"linear": 0.09,"constant": 1,"nearPlane": 0.5,"farPlane": 100,"shadow": 0},')
        f.write('{"name": "hallLight1", "colour": [0.1,0.025,0.01],"position": [-11,3,2],"strength": 3,"quadratic": 0.035,"linear": 0.09,"constant": 1,"nearPlane": 0.5,"farPlane": 100,"shadow": 0}')
        f.write(',{"name": "hallLight2", "colour": [0.1,0.025,0.01],"position": [-11,3,-1],"strength": 5,"quadratic": 0.035,"linear": 0.09,"constant": 1,"nearPlane": 0.5,"farPlane": 100,"shadow": 0}')
        f.write(',{"name": "mainRoomLight", "colour": [0.3,0.050,0.01],"position": [-1,12,-24],"strength": 20,"quadratic": 0.035,"linear": 0.09,"constant": 1,"nearPlane": 0.5,"farPlane": 100,"shadow": 0}')
        f.write(',{"name": "puzzleRoomLight", "colour": [0.1,0.025,0.01],"position": [-28,3,-10],"strength": 5,"quadratic": 0.035,"linear": 0.09,"constant": 1,"nearPlane": 0.5,"farPlane": 100,"shadow": 0}')
        f.write('],')
        f.write('"settings": {"camera": {"name": "mainCamera","position": [4,4,4],"atPoint": [2.5,0,2.5],"up": [0,1,0]},"backgroundColor": [0,0,0]} }]')