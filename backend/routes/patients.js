const router = require('express').Router();
const Patient = require('../models/patient.model');
const appointmentImport = require('../models/appointment.model');
const jwt = require('jsonwebtoken');
const stripe = require("stripe")("sk_test_51IabQNSCj4BydkZ38AsoDragCM19yaMzGyBVng5KUZnCNrxCJuj308HmdAvoRcUEe2PEdoORMosOaRz1Wl8UX0Gt00FCuSwYpz")
const { v4: uuidv4 } = require('uuid');
const { Appointment } = appointmentImport;
const axios = require("axios");
const multer = require('multer');
const AWS = require('aws-sdk');
const bcrypt = require('../bcrypt/bcrypt');

// Configure S3
const s3 = new AWS.S3();


// To get all the patients
// ** ONLY FOR TESTING **
router.route('/').get((req, res) => {
    Patient.find().then(patients => {
        res.status(200).json(patients);
    }).catch((err) => {
        res.status(400).json(`Error : ${err}`);
    })
})

// To add a patient
router.route('/add').post((req, res) => {
    const googleId = req.body.googleId;
    const name = req.body.name;
    const picture = req.body.picture;

    const newPatient = new Patient({
        googleId, name, picture
    })

    newPatient.save().then(() => {
        res.status(200).json('Patient added');
    }).catch(err => {
        res.status(400).json(`Error : ${err}`);
    })
})

// To update a patient's phone number
router.route('/update-phone').put((req, res) => {
    const googleId = req.body.googleId;

    Patient.findOne({ googleId: googleId }).then(patient => {
        if (patient) {
            patient.phoneNumber = req.body.phoneNumber;

            patient.save().then(() => {
                res.status(200).json('Patient\'s phone number updated');
            }).catch(err => {
                res.status(400).json({ message: `Error : ${err}` });
            });
        }
    })
})

router.route('/signup').post(async (req, res) => {
    try {
        const { email, name, phoneNumber, password } = req.body;

        // Validate input
        if (!email || !name || !phoneNumber || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Generate a unique Google ID
        const googleId = uuidv4();

        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email: email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const responseSalt = await axios.post(
            "https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
            { secretKey: "PASSWORD_SALT" }
        );
        const passwordSalt = responseSalt.data.value;
        
        if (!passwordSalt) {
            return res.status(500).json({ message: 'Failed to retrieve password salt' });
        }

        // Hash the password using the provided salt
        const hashedPassword = bcrypt.hash(password, passwordSalt);

        // Create new patient
        const newPatient = new Patient({
            googleId: googleId,
            email: req.body.email,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            password: hashedPassword,
            picture : req.body.picture 
        });

        // Save patient to the database
        const savedPatient = await newPatient.save();

        // Send welcome email via Lambda
        const appointmentConfirmation = {
            email: req.body.email,
            message: `Hello ${req.body.name}, Welcome to Healthcare Booking Scheduling App.`
        };

        await axios.post(
            "https://ikb4u2ay5vn363ms3ttf7shuua0lonyq.lambda-url.us-east-1.on.aws/",
            appointmentConfirmation
        );

        res.status(200).json({
            message: 'Signup successful',
            patient: {
                id: savedPatient.googleId,
                name: savedPatient.name,
                email: savedPatient.email
            }
        });

    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({
            message: 'Signup failed',
            error: err.message
        });
    }
});

// router.route('/google-login').post(async (req, res) => {
//     try {
//         const tokenId = req.body.tokenId;
//         // Fetch the key from Secrets Manager
// 			const responseKey = await axios.post(
// 				"https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
// 				{ secretKey: "KEY" }
// 			);

//         const decoded = jwt.decode(tokenId, responseKey.data.value);
//         const googleId = await decoded.sub;

//         // Check if the user already exists in the database
//         const patient = await Patient.findOne({ googleId: googleId });
//         const appointmentConfirmation = {
//             email: patient.email, // Patient email passed in the request body
//             message: `Hello ${patient.name}, Welcome to Healtcare Booking Scheduling App.`,
//         };
    
//         const lambdaResponse = await axios.post(
//             "https://ikb4u2ay5vn363ms3ttf7shuua0lonyq.lambda-url.us-east-1.on.aws/",
//             appointmentConfirmation
//         );

//         // If the patient is not found
//         if (patient === null) {
//             const { email, name, picture } = decoded;
//             const newPatient = new Patient({
//                 googleId, email, name, picture
//             })

//             const appointmentConfirmation = {
//                 email: email, // Patient email passed in the request body
//                 message: `Hello ${name}, Welcome to Healtcare Booking Scheduling App.`,
//             };
        
//             const lambdaResponse = await axios.post(
//                 "https://ikb4u2ay5vn363ms3ttf7shuua0lonyq.lambda-url.us-east-1.on.aws/",
//                 appointmentConfirmation
//             );

//             const savedPromise = await newPatient.save();
//             if (savedPromise) {
//                 return res.status(200).json({ phoneNumberExists: false });
//             }
//             else {
//                 throw savedPromise;
//             }
//         }

//         // If the phone number is not present in the database
//         else if (patient.phoneNumber === undefined) {
//             return res.status(200).json({ phoneNumberExists: false });
//         }

//         // Patient's phone number already exists in the database
//         else {
//             return res.status(200).json({ phoneNumberExists: true })
//         }
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json(err);
//     }
// })

router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch the password salt from Secrets Manager
        const responseSalt = await axios.post(
            "https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
            { secretKey: "PASSWORD_SALT" }
        );
        const passwordSalt = responseSalt.data.value;

        // Hash the incoming password with the salt
        const hashedPassword = bcrypt.hash(password, passwordSalt);

        // Find the user in the database
        const patient = await Patient.findOne({ email });

        if (!patient || patient.password !== hashedPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Fetch the signing key and algorithm from Secrets Manager
        const [responseKey, responseAlgorithm] = await Promise.all([
            axios.post("https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/", { secretKey: "KEY" }),
            axios.post("https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/", { secretKey: "ALGORITHM" }),
        ]);

        const signingKey = responseKey.data.value;
        const algorithm = responseAlgorithm.data.value;

        // Generate the JWT token
        const token = jwt.sign(
            { id: patient._id, email: patient.email },
            signingKey,
            { algorithm, expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token : token,
            googleId : patient.googleId
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ message: "Login failed", error: err.message });
    }
});

router.route('/getPatientDetails/:googleId').get(async (req, res) => {
    try {
        const googleId = req.params.googleId;
        const patient = await Patient.findOne({ googleId: googleId });

        if (patient) {
            return res.status(200).json(patient);
        }
        else {
            return res.status(201).json({ message: "Patient not found!" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
})

router.route('/previous-appointments').post(async (req, res) => {
    try {
        const googleId = req.body.googleId;
        const appointments = await Appointment.find({ patientId: googleId });

        // Get current dateTime
        const date = new Date()
        let currDateTime = date.getFullYear().toString()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()

        currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
        currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
        currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
        currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
        currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()

        const filteredAppointments = appointments.filter((appointment) => {
            return Date.parse(currDateTime) >= Date.parse(appointment.date + 'T' + appointment.slotTime)
        })

        const sortedAppointments = filteredAppointments.sort((a, b) => {
            return Date.parse(b.date + 'T' + b.slotTime) - Date.parse(a.date + 'T' + a.slotTime)
        })

        res.status(200).json(sortedAppointments);
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.route('/upcoming-appointments').post(async (req, res) => {
    try {
        const googleId = req.body.googleId;
        const appointments = await Appointment.find({ patientId: googleId });

        // Get current dateTime
        const date = new Date()
        let currDateTime = date.getFullYear().toString()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()

        currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
        currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
        currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
        currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
        currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()

        const filteredAppointments = appointments.filter((appointment) => {
            return Date.parse(currDateTime) <= Date.parse(appointment.date + 'T' + appointment.slotTime)
        })

        const sortedAppointments = filteredAppointments.sort((a, b) => {
            return Date.parse(a.date + 'T' + a.slotTime) - Date.parse(b.date + 'T' + b.slotTime)
        })

        res.status(200).json(sortedAppointments);
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

router.route("/payment").post(async (req, res) => {
    const { finalBalnce, token } = req.body;
    // console.log(product);
    const idempotencyKey = uuidv4();

    return stripe.customers
        .create({
            email: token.email,
            source: token.id
        })
        .then(customer => {
            stripe.charges
                .create(
                    {
                        amount: finalBalnce * 100,
                        currency: 'usd',
                        customer: customer.id,
                        receipt_email: token.email,
                        description: `Booked Appointement Successfully`,
                        shipping: {
                            name: token.card.name,
                            address: {
                                line1: token.card.address_line1,
                                line2: token.card.address_line2,
                                city: token.card.address_city,
                                country: token.card.address_country,
                                postal_code: token.card.address_zip
                            }
                        }
                    },
                    {
                        idempotencyKey
                    }
                )
                .then(result => res.status(200).json(result))
                .catch(err => {
                    console.log(`Error : ${err}`);
                    res.status(400).json(err);
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
})


module.exports = router;