import handDetection
import cv2.cv2 as cv2

cap = cv2.VideoCapture(2)
hist = handDetection.capture_histogram(source=2)

while True:
    ret, frame = cap.read()
    
    # detect the hand
    hand = handDetection.detect_hand(frame, hist)
    
    # plot the fingertips
    for fingertip in hand.fingertips:
        cv2.circle(hand.outline, fingertip, 5, (0, 0, 255), -1)

    cv2.imshow("handDetection", hand.outline)
    
    k = cv2.waitKey(5)
    if k == ord('q'):
        break