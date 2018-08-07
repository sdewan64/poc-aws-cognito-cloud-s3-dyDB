# poc-aws-cognito-cloud-s3-dyDB
A PoC project to cover AWS Cognito, Cloud Information, S3, DynamoDB, OAuth

Installation Steps:

1. npm install -g ionic@latest
2. npm install -g awsmobile-cli
3. clone this repository
4. cd to this repository
5. Configure AWS mobile hub (Details given below)
6. run using ionic serve
7. To run on IOS: ionic cordova platform add ios
8. Build using: ionic cordova build ios --prod (If build is failing due to resource not generating use cli version 4.1.0-testing.458303e0)
9. Open Xcode Project 
10. Set signing configs and run

# Configure AWS for this project (From AWS Ionic Starter)

Init AWSMobile project 

```bash
awsmobile init

Please tell us about your project:
? Where is your project's source directory:  src
? Where is your project's distribution directory that stores build artifacts:  www
? What is your project's build command:  npm run-script build
? What is your project's start command for local test run:  ionic serve

? What awsmobile project name would you like to use:  ...

Successfully created AWS Mobile Hub project: ...
```

#### NoSQL Database

Enable DynamoDB in MobileHub.

Create a custom table named `tasks`. Make it Private.

Accept `userId` as Partition key.

Add an attribute `taskId` with type string and make it a Sort key

Add an attribute `category` with type string.

Add an attribute `description` with type string.

Add an attribute `created` with type number.

Create an index `DateSorted` with userId as Partition key and taskId
as Sort key.

#### User Sign-In

Turn this on.

Set your password requirements.


#### Hosting and Streaming

Turn this on.

#### User File Storage

Turn this on.

### Configuring S3

From the AWS Console, go to S3.

Select the bucket named `<project name>-userfiles-mobilehub-<AWS resource number>`

Go to the Permissions tab. Click on CORS Configuration. Paste the
following into the editor and save.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
    <ExposeHeader>x-amz-request-id</ExposeHeader>
    <ExposeHeader>x-amz-id-2</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```


### Integrating Changes into App

Go back to the command line for your project.

```bash
awsmobile pull
```

Answer yes, when asked "? sync corresponding contents in backend/ with #current-backend-info/"

### Install dependencies


```bash
npm install
```

The following commands are needed due to breaking changes in
[aws-amplify](https://github.com/aws/aws-amplify) 0.4.6.
They may not be needed in the future.

```bash
npm install @types/zen-observable
npm install @types/paho-mqtt
```
