import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddWorkout from '../components/AddWorkout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchWorkouts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/getMyWorkouts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
        }
        throw new Error((await response.json()).message || 'Failed to fetch workouts');
      }

      const data = await response.json();
      setWorkouts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (workoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/deleteWorkout/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to delete workout');
      }

      setWorkouts(workouts.filter(workout => workout._id !== workoutId));
      setError(null);
      toast.success("Workout deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = async (workoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/completeWorkoutStatus/${workoutId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to mark workout as complete');
      }

      const data = await response.json();
      setWorkouts(workouts.map(workout =>
        workout._id === workoutId ? data.updatedWorkout : workout
      ));
      toast.success("Workout marked as completed!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleAddWorkout = () => {
    setEditingWorkout(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingWorkout(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingWorkout
        ? `${process.env.REACT_APP_API_BASE_URL}/workouts/updateWorkout/${editingWorkout._id}`
        : `${process.env.REACT_APP_API_BASE_URL}/workouts/addWorkout`;
      const method = editingWorkout ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to submit workout');
      }

      if (editingWorkout) {
        toast.success("Workout updated successfully!");
      } else {
        toast.success("Workout added successfully!");
      }

      fetchWorkouts();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mt-3" role="alert">
      Error: {error}
    </div>
  );

  return (
    <div className="container mt-4 position-relative">
      <h1 className="text-center mb-4">Workouts</h1>

      <div className="text-end mb-3">
        <button
          className="btn btn-success rounded-circle"
          style={{ width: '45px', height: '45px' }}
          title="Add Workout"
          onClick={handleAddWorkout}
        >
          +
        </button>
      </div>

      {showForm && (
        <AddWorkout
          workout={editingWorkout}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}

      {workouts.length === 0 ? (
        <div className="alert alert-info text-center">
          No workouts found. Add your first workout!
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {workouts.filter(workout => workout && workout._id)
            .map((workout) => (
              <div key={workout._id} className="col">
                <div className="card h-100 shadow-sm text-center">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{workout.name}</h5>
                    <p><i className="bi bi-clock"></i> Duration: {workout.duration}</p>
                    <p><i className="bi bi-pin-angle-fill text-danger"></i> Status: <strong>{workout.status}</strong></p>
                    <p><i className="bi bi-calendar-event"></i> Added: {formatDate(workout.dateAdded)}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-center gap-2 bg-transparent">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(workout)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(workout._id)}>Delete</button>
                    {workout.status !== 'completed' && (
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleComplete(workout._id)}>✓ Done</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Workouts;
