const router = require('express').Router();
const Patient = require('../models/patient.model');
const appointmentImport = require('../models/appointment.model');
const jwt = require('jsonwebtoken');
const stripe = require("stripe")("sk_test_51IabQNSCj4BydkZ38AsoDragCM19yaMzGyBVng5KUZnCNrxCJuj308HmdAvoRcUEe2PEdoORMosOaRz1Wl8UX0Gt00FCuSwYpz")
const { v4: uuidv4 } = require('uuid');
const { Appointment } = appointmentImport;

// ** ONLY FOR TESTING ** To get all the patients
router.route('/').get(async (req, res) => {
    try {
        const patients = await Patient.scan().exec(); // Dynamoose `scan` to fetch all items
        res.status(200).json(patients);
    } catch (err) {
        res.status(400).json({ message: `Error: ${err.message}` });
    }
});

// To add a patient
router.route('/add').post(async (req, res) => {
    try {
        const { googleId, name, picture } = req.body;

        const newPatient = new Patient({
            googleId,
            name,
            picture,
        });

        await newPatient.save(); // Save patient using Dynamoose
        res.status(200).json('Patient added');
    } catch (err) {
        res.status(400).json({ message: `Error: ${err.message}` });
    }
});

// To update a patient's phone number
router.route('/update-phone').put(async (req, res) => {
    try {
        const { googleId, phoneNumber } = req.body;
        console.log(phoneNumber);
        const patient = await Patient.get(googleId); // Fetch patient by primary key
        if (patient) {
            patient.phoneNumber = phoneNumber;
            await patient.save(); // Save updated patient record
            res.status(200).json('Patient\'s phone number updated');
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (err) {
        res.status(400).json({ message: `Error: ${err.message}` });
    }
});
// // Google Login
router.route('/google-login').post(async (req, res) => {
    try {
        const tokenId = req.body.tokenId;
        
        // Decode the JWT
        const decoded = jwt.decode(tokenId, process.env.KEY);
        const googleId = decoded.sub;


        // Check if the user already exists in the database
        const patient = Patient.get(googleId);
        console.log("Reached" + patient.googleId);

        // If the patient is not found
        if (!patient) {
            const { email, name, picture } = decoded;
            const newPatient = new Patient({
                googleId,
                email,
                name,
                picture,
            });
            await newPatient.save();
            return res.status(200).json({ phoneNumberExists: false });
        }

        // If the phone number is not present in the database
        if (!patient.phoneNumber) {
            console.log("Reached");
            return res.status(200).json({ phoneNumberExists: false });
        }

        // Patient's phone number already exists in the database
        res.status(200).json({ phoneNumberExists: true });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: `Error: ${err.message}` });
    }
})

// router.route('/google-login').post(async (req, res) => {
//     try {
        
//         const tokenId = req.body.tokenId;
        
//         // Decode the JWT
//         const decoded = jwt.decode(tokenId, process.env.KEY);
//         if (!decoded) {
//             return res.status(400).json({ message: 'Invalid token' });
//         }
        
//         const googleId = decoded.sub;

//         try {
//             // Check if the user already exists in the database
//             const patient = Patient.get(googleId);
            
//             if (!patient) {
//                 const { email, name, picture } = decoded;
//                 const newPatient = new Patient({
//                     googleId,
//                     email,
//                     name,
//                     picture,
//                 });
//                 await newPatient.save();
//                 return res.status(200).json({ phoneNumberExists: false });
//             }

//             // If the phone number is not present in the database
//             if (!patient.phoneNumber) {
//                 return res.status(200).json({ phoneNumberExists: false });
//             }

//             // Patient's phone number already exists in the database
//             return res.status(200).json({ phoneNumberExists: true });
//         } catch (error) {
//             if (error.code === 'ResourceNotFoundException') {
//                 // Handle case when the item doesn't exist
//                 const { email, name, picture } = decoded;
//                 const newPatient = new Patient({
//                     googleId,
//                     email,
//                     name,
//                     picture,
//                 });
//                 await newPatient.save();
//                 return res.status(200).json({ phoneNumberExists: false });
//             }
//             throw error;
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ message: `Error: ${err.message}` });
//     }
// });

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