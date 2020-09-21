import cv2.cv2 as cv2

from cam import Cam

cam = Cam(camIndex=1)

while True:
    image = cam.read()

    cv2.imshow('Image capturada', image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break