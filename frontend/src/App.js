/* global gapi */
import React, { useEffect, useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import DoctorLogin from "./Pages/DoctorLogin";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PaitentDashboard from "./Pages/PaitentDashboard";
import Error from "./Pages/Error";
import { AuthContext } from "./Auth/AuthContext";
import PhoneNumber from "./components/PhoneNumber";
import PersonalDetails from "./Doctor/PersonalDetails";
import SearchDoctor from "./Patient/SearchDoctor";
import PerviousAppointments from "./Patient/PerviousAppointments";
import Spinner from "react-bootstrap/Spinner";
import Selectdate from "./Patient/Selectdate";
import BookingSlots from "./Doctor/BookingSlots";
import Payment from "./Patient/Payment";
import DocAppointments from "./Doctor/PaymentHistory";
import AppointmentStatus from "./Patient/AppointmentStatus";
import Pfeedback from './Patient/Feedback';
import FeedbackDetails from './Doctor/FeedbackDetails';
import axios from "axios";

function App() {
	const [token, setToken] = useState(window.localStorage.getItem("token"));
	const [googleId, setGoogleId] = useState(
		window.localStorage.getItem("googleId")
	);

	const [apiLoaded, setApiLoaded] = useState(false);

	// To load only when gapi is loaded
	// useEffect(() => {
	// 	if (window.gapi !== undefined) {
	// 		setApiLoaded(false);
	// 		window.gapi.load("client:auth2", initClient);
	// 		function initClient() {
	// 			window.gapi.client
	// 				.init({
	// 					apiKey: process.env.REACT_APP_API_KEY,
	// 					clientId: process.env.REACT_APP_CLIENT_ID,
	// 					discoveryDocs: [process.env.REACT_APP_DISCOVERY_DOCS],
	// 					scope: process.env.REACT_APP_SCOPE,
	// 					plugin_name:"healthcareapp"
	// 				})
	// 				.then(
	// 					function () {
	// 						if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
	// 							console.log(
	// 								`Is signed in? ${window.gapi.auth2
	// 									.getAuthInstance()
	// 									.isSignedIn.get()}`
	// 							);
	// 						} else {
	// 							console.log("Currently Logged Out!!");
	// 						}
	// 						setApiLoaded(true);
	// 					},
	// 					function (error) {
	// 						console.log(`error ${JSON.stringify(error)}`);
	// 						setApiLoaded(true);
	// 					}
	// 				);
	// 		}
	// 		setApiLoaded(true);
	// 	} else {
	// 		console.log("[Google] inside the else block line 54 App.js");
	// 		setApiLoaded(false);
	// 	}

	// }, []);

useEffect(() => {
    const fetchSecretsAndInitClient = async () => {
        try {
            // Fetch secrets via API calls
            const apiKeyResponse = await axios.post(
                "https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
                { secretKey: "REACT_APP_API_KEY" }
            );
            const clientIdResponse = await axios.post(
                "https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
                { secretKey: "REACT_APP_CLIENT_ID" }
            );
            const discoveryDocsResponse = await axios.post(
                "https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
                { secretKey: "REACT_APP_DISCOVERY_DOCS" }
            );
            const scopeResponse = await axios.post(
                "https://znbd6w7rb7z57gvtrg44h2tq3i0tgjjk.lambda-url.us-east-1.on.aws/",
                { secretKey: "REACT_APP_SCOPE" }
            );

            // Extract values from API responses
            const apiKey = apiKeyResponse.data.value;
            const clientId = clientIdResponse.data.value;
            const discoveryDocs = [discoveryDocsResponse.data.value];
            const scope = scopeResponse.data.value;

            if (window.gapi !== undefined) {
                setApiLoaded(false);
                window.gapi.load("client:auth2", () => {
                    window.gapi.client
                        .init({
                            apiKey: apiKey,
                            clientId: clientId,
                            discoveryDocs: discoveryDocs,
                            scope: scope,
                            plugin_name: "healthcareapp",
                        })
                        .then(
                            function () {
                                if (
                                    window.gapi.auth2
                                        .getAuthInstance()
                                        .isSignedIn.get()
                                ) {
                                    console.log(
                                        `Is signed in? ${window.gapi.auth2
                                            .getAuthInstance()
                                            .isSignedIn.get()}`
                                    );
                                } else {
                                    console.log("Currently Logged Out!!");
                                }
                                setApiLoaded(true);
                            },
                            function (error) {
                                console.log(`Error: ${JSON.stringify(error)}`);
                                setApiLoaded(true);
                            }
                        );
                });
            } else {
                console.log("[Google] gapi not defined.");
                setApiLoaded(false);
            }
        } catch (error) {
            console.error("Error fetching secrets:", error);
            setApiLoaded(false);
        }
    };

    fetchSecretsAndInitClient();
}, []);


	return apiLoaded ? (
		<Router>
			<AuthContext.Provider value={{ token, setToken, googleId, setGoogleId }}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/doctorlogin" component={DoctorLogin} />
					<Route exact path="/doctor" component={DoctorDashboard} />
					<Route exact path="/patient/searchdoctor" component={SearchDoctor} />
					<Route exact path="/patient" component={PaitentDashboard} />
					<Route exact path="/patient/update-phone" component={PhoneNumber} />
					<Route
						exact
						path="/patient/previousappointments"
						component={PerviousAppointments}
					/>
					<Route
						exact
						path="/doctor/perosnaldetails"
						component={PersonalDetails}
					/>
					<Route
						exact
						path="/doctor/payment-history"
						component={DocAppointments}
					/>
					<Route exact path="/doctor/feedback/:id" component={FeedbackDetails} />

					<Route exact path="/patient/selectdate" component={Selectdate} />
					<Route exact path="/patient/book-slot" component={BookingSlots} />
					<Route exact path="/patient/payment" component={Payment} />
					<Route exact path="/patient/appointment-status" component={AppointmentStatus} />
					<Route exact path="/patient/feedback/:id" component={Pfeedback} />

					<Route path="*">
						<Error />
					</Route>
				</Switch>
			</AuthContext.Provider>
		</Router>
	) : (
		<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
			<Spinner animation="border" variant="danger" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
}

export default App;
