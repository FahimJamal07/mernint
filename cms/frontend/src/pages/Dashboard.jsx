import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const CourseForm = () => {
    const { user } = useAuth(); // Removed logoutUser since we don't need it here
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const isEditMode = !!id;

    // 1. DYNAMIC URL HELPER
    const getBaseUrl = () => {
        return window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://cms-backend-podj.onrender.com'; // <--- MAKE SURE THIS IS YOUR RENDER URL
    };

    // Load data if Editing
    useEffect(() => {
        if (isEditMode) {
            const fetchCourse = async () => {
                try {
                    const baseUrl = getBaseUrl();
                    const response = await fetch(`${baseUrl}/api/courses`);
                    const data = await response.json();
                    const course = data.find(c => c._id === id);
                    if (course) {
                        setTitle(course.title);
                        setDescription(course.description);
                        setPrice(course.price);
                    }
                } catch (error) {
                    console.error("Error fetching course:", error);
                }
            };
            fetchCourse();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const baseUrl = getBaseUrl();
        
        // Decide URL and Method
        const url = isEditMode 
            ? `${baseUrl}/api/courses/${id}` 
            : `${baseUrl}/api/courses`;
            
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
                navigate('/dashboard'); 
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
                <h1 className="fw-bold">{isEditMode ? 'Edit Course' : 'Create Course'}</h1>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary rounded-pill px-4">
                    Back to Dashboard
                </button>
            </div>

            <div className="card glass-card p-4 border-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {message && <div className="alert alert-danger">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Course Title</label>
                        <input 
                            type="text" className="form-control rounded-3 p-2" 
                            value={title} onChange={(e) => setTitle(e.target.value)} required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea 
                            className="form-control rounded-3 p-2" rows="3"
                            value={description} onChange={(e) => setDescription(e.target.value)} required 
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Price ($)</label>
                        <input 
                            type="number" className="form-control rounded-3 p-2" 
                            value={price} onChange={(e) => setPrice(e.target.value)} required 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        {isEditMode ? 'Update Course' : 'Create Course'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;