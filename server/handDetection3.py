# By Desashish Taneja
# YouTube: https://www.youtube.com/watch?v=LYw9RzS54OI
# GitHub: https://github.com/dtaneja123/Hand_Recognition

# IMPORTING LIBRARIES
import numpy as np
import cv2.cv2 as cv2
import math
import time

#LOADING HAND CASCADE
hand_cascade = cv2.CascadeClassifier('files/Hand_haar_cascade.xml')

# VIDEO CAPTURE
cap = cv2.VideoCapture(2)

# PARAMETERS TO OPTIMIZE
	
# Threshold defines how many pixels far from the center the hand should be
# in order for a command to be considered
threshold = 100

framesWithoutHandsCount = 0

framesWithoutHandsCountThreshold = 10

def getCenterOfMass(cnt):
	M = cv2.moments(cnt)
	pX = int(M["m10"] / M["m00"])
	pY = int(M["m01"] / M["m00"])
	return (pX, pY)

def handleCommands(cX, cY, pX, pY):
	if pX > (cX + threshold):
		return 'Diminuir volume'
	elif pX < (cX - threshold):
		return 'Aumentar volume'
	elif pY > (cY + threshold):
		return 'Diminuir canal'
	elif pY < (cY - threshold):
		return 'Aumentar canal'
	else:
		'Nenhum'

cX, cY = None, None

while 1:
	ret, img = cap.read()
	blur = cv2.GaussianBlur(img,(5,5),0) # BLURRING IMAGE TO SMOOTHEN EDGES
	gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY) # BGR -> GRAY CONVERSION
	retval2,thresh1 = cv2.threshold(gray,70,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU) # THRESHOLDING IMAGE
	hand = hand_cascade.detectMultiScale(thresh1, 1.3, 5) # DETECTING HAND IN THE THRESHOLDE IMAGE
	mask = np.zeros(thresh1.shape, dtype = "uint8") # CREATING MASK
	for (x,y,w,h) in hand: # MARKING THE DETECTED ROI
		cv2.rectangle(img,(x,y),(x+w,y+h), (122,122,0), 2) 
		cv2.rectangle(mask, (x,y),(x+w,y+h),255,-1)
	img2 = cv2.bitwise_and(thresh1, mask)
	final = cv2.GaussianBlur(img2,(7,7),0)	
	contours, hierarchy = cv2.findContours(final, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

	cv2.drawContours(img, contours, 0, (255,255,0), 3)
	cv2.drawContours(final, contours, 0, (255,255,0), 3)

	if len(contours) > 0:
		framesWithoutHandsCount = 0
		cnt=contours[0]
		hull = cv2.convexHull(cnt, returnPoints=False)

		(pX, pY) = getCenterOfMass(cnt)

		if cX is None or cY is None:
			cX, cY = pX, pY
		
		# finding convexity defects
		defects = cv2.convexityDefects(cnt, hull)
		count_defects = 0
		# applying Cosine Rule to find angle for all defects (between fingers)
		# with angle > 90 degrees and ignore defect
		if defects is not None:
			for i in range(defects.shape[0]):
				p,q,r,s = defects[i,0]
				finger1 = tuple(cnt[p][0])
				finger2 = tuple(cnt[q][0])
				dip = tuple(cnt[r][0])
				# find length of all sides of triangle
				a = math.sqrt((finger2[0] - finger1[0])**2 + (finger2[1] - finger1[1])**2)
				b = math.sqrt((dip[0] - finger1[0])**2 + (dip[1] - finger1[1])**2)
				c = math.sqrt((finger2[0] - dip[0])**2 + (finger2[1] - dip[1])**2)
				# apply cosine rule here
				angle = math.acos((b**2 + c**2 - a**2)/(2*b*c)) * 57.29
				# ignore angles > 90 and highlight rest with red dots
				if angle <= 90:
					count_defects += 1
		# define actions required
		fingerCountText = str(count_defects + 1) + " FINGERS"		
		cv2.putText(img, fingerCountText, (200, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
		
		cv2.putText(img, "PX: {}".format(pX), (200, 150), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
		cv2.putText(img, "PY: {}".format(pY), (200, 200), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
		cv2.putText(img, "CX: {}".format(cX), (200, 250), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)
		cv2.putText(img, "CY: {}".format(cY), (200, 300), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)

		command = handleCommands(cX, cY, pX, pY)
		cv2.putText(img, "Comando: {}".format(command), (200, 350), cv2.FONT_HERSHEY_SIMPLEX, 2, 2)

		cv2.circle(img, (cX, cY), 5, (0, 0, 255))
	else:
		framesWithoutHandsCount += 1
		# print('Frame without hand detected. Count: {}'.format(framesWithoutHandsCount))

	if framesWithoutHandsCount >= framesWithoutHandsCountThreshold:
		cX, cY = None, None

	cv2.imshow('img',thresh1)
	cv2.imshow('img1',img)
	cv2.imshow('img2',img2)

	if cv2.waitKey(5) & 0xFF == ord('q'):
		break

	time.sleep(1/30)

cap.release()
cv2.destroyAllWindows()