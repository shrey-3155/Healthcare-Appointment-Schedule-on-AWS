## healthcare-appointment-scheduling-app

## Overview
The **Healthcare Appointment Scheduling Application** is a MERN stack-based web application that enables seamless interaction between doctors and patients. This application facilitates appointment booking, payments, notifications, and virtual consultations. It is hosted on AWS, leveraging various services to ensure scalability, security, and high availability.

## Features
### **1. User Roles**
- **Patients**:
    - Sign in via Google accounts.
    - View available doctors with their fees, availability, and specializations.
    - Book appointments and process payments through Stripe.
    - Receive Google Meet links and email notifications for booked appointments.
- **Doctors**:
    - Register and log in to view their appointment schedules.
    - Receive notifications and meeting links for their upcoming appointments.

### **2. Key Functionalities**
- **User Authentication**:
    - Patients authenticate using Google accounts.
    - Doctors register in the system for access.
- **Appointment Booking**:
    - Patients can view available time slots and book appointments.
    - Automated calendar events are created with meeting links for consultations.
- **Feedback System**:
    - Patients provide feedback about their consultation experience.
- **JWT Authentication**:
    - Secure communication between client and server using JSON Web Tokens (JWT).
- **Payment Integration**:
    - Stripe integration for secure and seamless payments.

## Tech Stack
- **Frontend**: React.js for a dynamic user interface.
- **Backend**: Node.js and Express.js for server-side operations.
- **Database**: MongoDB for document storage.

## Hosting on AWS
The application is deployed on AWS, utilizing various services to ensure efficiency and reliability.

### **AWS Services Used**
| **Service Category**         | **AWS Service**                  |
|-------------------------------|-----------------------------------|
| Compute                      | Amazon EC2, Auto Scaling, Lambda |
| Storage                      | Amazon S3                        |
| Networking & Content Delivery | Amazon VPC, Elastic Load Balancer |
| Application Integration      | Amazon SNS                       |
| Management & Governance      | AWS CloudFormation, CloudWatch   |
| Security, Identity, & Compliance | AWS Secrets Manager           |

### **Deployment Links**
- **Frontend EC2 Elastic IP**: [http://34.192.38.100](http://34.192.38.100)  
  *(Note: The instance stops when the lab session ends. Refer to the screenshots provided below.)*

### **Architecture Diagram**
- [Cloud Architecture Diagram](FinalCloudArchitecture.drawio.png)

## AWS Services Justification
### **Compute Services**
- **Amazon EC2**: Used for hosting the frontend and backend, offering flexibility and scalability.
- **Auto Scaling**: Automatically adjusts the number of backend EC2 instances based on demand.
- **AWS Lambda**: Executes serverless functions, such as handling feedback and notifications.

### **Storage Services**
- **Amazon S3**: Stores user profile images and frontend assets securely and reliably.

### **Networking**
- **Amazon VPC**: Ensures secure and isolated networking for the application.
- **Elastic Load Balancer (ALB)**: Distributes traffic evenly across backend EC2 instances.

### **Security**
- **AWS Secrets Manager**: Securely stores sensitive information like JWT keys and password salts.

### **Notifications**
- **Amazon SNS**: Sends email notifications for events like appointments, login, and signup.

### **Infrastructure Management**
- **AWS CloudFormation**: Automates the provisioning and management of the application infrastructure.

## Patient Guide: 

### Patient Login
![Patient Login](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_login%20patient.jpg)

### Patient Personal Details
![Patient Personal Details](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_patient_personal%20details.png)

### Search
![Search](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_search%20doctor.jpg)

### Select Date
![Select date](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_select%20date.jpg)

### Select Slot
![Select Slot](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_booking%20status.jpg)

### Payment
![Payment](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_payment.jpg)

![Address](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_address%20details.jpg)

![Card details](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_card%20details.jpg)

### Appointment Status
![Appointment Status](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_appointment%20status.jpg)

### Previous Appointments
![Previous Appointments](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_previous%20appointments.jpg)

### Patient Feedback
![Patient Feedback](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_patient%20feedback.jpg)

## Doctor Guide: 
![Hompage doctor login](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_login%20both.jpg)

### Doctor Login
![Doctor login](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_doctor%20login.jpg)

### Doctor's Today's Schedule
![Doctors today's schedule](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_todays%20schedule.png)

### Doctor's Personal Details
![doctor's personal details](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_doctor%20personal%20details.jpg)

### Doctor's Previous Appointments
![Doctor's previous appointments](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_doctor%20previous%20appointments.png)

### Doctor View Feedback
![Doctor's View feedback](https://github.com/Project-Based-Learning-IT/healthcare-appointment-scheduling-app/blob/calendar/Software-Engineering/Screenshots/original_doctor%20feedback.jpg)
