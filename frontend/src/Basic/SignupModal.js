import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const SignupModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    picture: null,
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const uploadPicture = async () => {
    if (!formData.picture) return null;

    const reader = new FileReader();
    const file = formData.picture;

    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const uploadResponse = await axios.post(
            "https://eky7tw5aax63ekmga5ifmvow2m0accsx.lambda-url.us-east-1.on.aws/", // Replace with your Lambda function API Gateway URL
            {
              file: reader.result.split(',')[1], // Base64 content
              fileName: file.name,
              contentType: file.type,
            }
          );
          resolve(uploadResponse.data.objectUrl);
        } catch (error) {
          reject(error.response?.data?.message || 'Failed to upload profile picture.');
        }
      };

      reader.readAsDataURL(file); // Convert file to Base64
    });
  };

  const validateForm = () => {
    const { email, name, phoneNumber, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return false;
    }

    if (!phoneRegex.test(phoneNumber)) {
      setError('Phone number must be 10 digits.');
      return false;
    }

    // if (!passwordRegex.test(password)) {
    //   setError('Password must be at least 8 characters, including one letter and one number.');
    //   return false;
    // }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let profilePictureUrl = null;
      if (formData.picture) {
        profilePictureUrl = await uploadPicture();
      }

      const payload = {
        email: formData.email,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        picture: profilePictureUrl,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patients/signup`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Signup successful', response.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Patient Signup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="10-digit phone number"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignupModal;
