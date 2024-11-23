const dynamoose = require('dynamoose');
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamodb = new DynamoDB({ region: "us-east-1" });
dynamoose.aws.sdk = dynamodb;
// Define Slot schema
const slotSchema = new dynamoose.Schema({
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

// Define DateSchedule schema
const dateScheduleSchema = new dynamoose.Schema({
  date: {
    type: String,
    required: true,
  },
  slots: {
    type: Array,
    schema: [slotSchema], // Array of Slot objects
  },
});

// Define Doctor schema
const doctorSchema = new dynamoose.Schema({
  username: {
    type: String,
    required: true,
    hashKey: true, // Partition key
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  specialization: {
    type: String,
    required: false,
  },
  feesPerSession: {
    type: String,
    required: false,
  },
  dates: {
    type: Array,
    schema: [dateScheduleSchema], // Array of DateSchedule objects
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create models
const Doctor = dynamoose.model('Doctor', doctorSchema, {
  create: true, // Automatically create the table if it doesn't exist
});

module.exports = {
  Doctor,
};
