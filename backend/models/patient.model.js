const dynamoose = require('dynamoose');
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamodb = new DynamoDB({ region: "us-east-1" });
dynamoose.aws.sdk = dynamodb;

// Define the schema
const patientSchema = new dynamoose.Schema({
  googleId: {
    type: String,
    required: true,
    hashKey: true, // Partition key
  },
  email: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
});

// Create the model
const Patient = dynamoose.model('Patient', patientSchema);

module.exports = Patient;
