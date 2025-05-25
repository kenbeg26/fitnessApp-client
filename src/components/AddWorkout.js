import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddWorkout = ({ workout, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: ''
  });

  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name,
        duration: workout.duration
      });
    } else {
      setFormData({
        name: '',
        duration: ''
      });
    }
  }, [workout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{workout ? 'Edit Workout' : 'Add New Workout'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Workout Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g., 30 mins, 1 hour"
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {workout ? 'Update' : 'Add'} Workout
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddWorkout;
