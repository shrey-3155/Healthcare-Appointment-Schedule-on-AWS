const dynamoose = require('dynamoose');
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamodb = new DynamoDB({ region: "us-east-1" });
dynamoose.aws.sdk = dynamodb;
// Define Feedback Schema
const feedbackSchema = new dynamoose.Schema({
  given: {
    type: Boolean,
    default: false,
  },
  stars: {
    type: Number,
    default: 0,
    validate: (value) => value >= 0 && value <= 5, // Validate between 0 and 5
  },
  title: {
    type: String,
    default: '',
  },
  review: {
    type: String,
    default: '',
  },
});

// Define Appointment Schema
const appointmentSchema = new dynamoose.Schema({
  appointmentId: {
    type: String,
    required: true,
    hashKey: true, // Partition key
  },
  doctorId: {
    type: String,
    required: true,
  },
  dateId: {
    type: String,
    required: true,
  },
  slotId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  slotTime: {
    type: String,
  },
  doctorName: {
    type: String,
  },
  doctorEmail: {
    type: String,
  },
  patientName: {
    type: String,
  },
  googleMeetLink: {
    type: String,
  },
  feedback: {
    type: Object,
    schema: feedbackSchema, // Nested Feedback object
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create Models
const Appointment = dynamoose.model('Appointment', appointmentSchema, {
  create: true, // Automatically create table if not present
});

module.exports = { Appointment };
