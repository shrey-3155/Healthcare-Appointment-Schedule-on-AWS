const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const patientsRouter = require('./routes/patients');
const doctorsRotuer = require('./routes/doctors');
const appointmentRouter = require('./routes/appointments');
const AWS = require('aws-sdk'); // Import AWS SDK
const dynamoose = require('dynamoose'); // Import dynamoose

require('dotenv').config();
 
app.use(express.json());
app.use(cors(
    {
        origin: "*", // allow the server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }
));

app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRotuer);
app.use('/appointments', appointmentRouter);

const port = process.env.PORT || 5000;
// Configure DynamoDB
const isTestEnv = process.env.NODE_ENV === 'test';
if (isTestEnv) {
    dynamoose.aws.ddb.local('http://localhost:8000'); // Use local DynamoDB for testing
    console.log("Connected to DynamoDB Local");
} else {
    // Use AWS DynamoDB in production
    // const ddb = new AWS.DynamoDB({
    //     region: process.env.AWS_REGION || 'us-east-1', // Replace with your AWS region
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,    // AWS Access Key ID
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Access Key
    // });
    // Configure AWS SDK
// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
    "credentials": {
        "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
        "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY
    },
    "region": "us-east-1"
});

// Set DynamoDB instance to the Dynamoose DDB instance
    dynamoose.aws.ddb.set(ddb);
    console.log("Connected to DynamoDB AWS");
}


function getCurrentTime() {
    const date = new Date()
    console.log(date)
}

function getEndDateTime(dateTime) {
    const hrs = (parseInt(dateTime.split('T')[1].split(':')[0]) + 1).toString().padStart(2, '0')
    const time = hrs + ':00:00'
    const date = dateTime.split('T')[0]
    return date + 'T' + time
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    console.log(`NODE_ENV = ${process.env.NODE_ENV}`)
    getCurrentTime()
    getEndDateTime("2021-03-22T09:00:00")
})

app.get('/', (req, res) => {
    res.status(200).json("Hello");
})

module.exports = app;