# AWS POC

Installation Steps:

1. npm install -g ionic@latest
2. npm install -g awsmobile-cli
3. clone this repository
4. cd to this repository
5. Configure AWS mobile hub
6. run using ionic serve
7. To run on IOS: ionic cordova platform add ios
8. Build using: ionic cordova build ios --prod (If build is failing due to resource not generating use cli version 4.1.0-testing.458303e0)
9. Open Xcode Project 
10. Set signing configs and run