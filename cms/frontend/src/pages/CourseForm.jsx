import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const CourseForm = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL if editing

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const isEditMode = !!id; // If ID exists, we are editing

    // Load data if Editing
    useEffect(() => {
        if (isEditMode) {
            const fetchCourse = async () => {
                const response = await fetch(`http://localhost:5000/api/courses`);
                const data = await response.json();
                // Find the specific course from the list (or fetch by ID directly)
                const course = data.find(c => c._id === id);
                if (course) {
                    setTitle(course.title);
                    setDescription(course.description);
                    setPrice(course.price);
                }
            };
            fetchCourse();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // 1. Decide URL and Method
        const url = isEditMode 
            ? `http://localhost:5000/api/courses/${id}` 
            : 'http://localhost:5000/api/courses';
            
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ title, description, price: Number(price) })
            });

            const data = await response.json();

            if (response.ok) {
                alert(isEditMode ? 'Course Updated!' : 'Course Created!');
                navigate('/dashboard'); // Go back to dashboard
            } else {
                setMessage(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('❌ Server Error');
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{isEditMode ? 'Edit Course' : 'Create Course'}</h1>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
            </div>

            <div className="card p-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {message && <div className="alert alert-danger">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Course Title</label>
                        <input 
                            type="text" className="form-control" 
                            value={title} onChange={(e) => setTitle(e.target.value)} required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-control" rows="3"
                            value={description} onChange={(e) => setDescription(e.target.value)} required 
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Price ($)</label>
                        <input 
                            type="number" className="form-control" 
                            value={price} onChange={(e) => setPrice(e.target.value)} required 
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        {isEditMode ? 'Update Course' : 'Create Course'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;