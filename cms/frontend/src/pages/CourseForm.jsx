import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const CourseForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const isEditMode = !!id;

    // Helper to get the right URL (Local vs Live)
    const getBaseUrl = () => {
        return window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://my-cms-backend.onrender.com';
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
                // FORCE RELOAD to see changes instantly
                window.location.href = '/dashboard'; 
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
                <h1 className="fw-bold text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
                    {isEditMode ? 'Edit Course' : 'Create Course'}
                </h1>
                <button onClick={() => navigate('/dashboard')} className="btn btn-light rounded-pill px-4 shadow-sm">
                    Back to Dashboard
                </button>
            </div>

            <div className="card glass-card p-5 border-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {message && <div className="alert alert-danger">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Course Title</label>
                        <input 
                            type="text" className="form-control rounded-3 p-3 border-0 bg-light" 
                            placeholder="e.g. Advanced React Patterns"
                            value={title} onChange={(e) => setTitle(e.target.value)} required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Description</label>
                        <textarea 
                            className="form-control rounded-3 p-3 border-0 bg-light" rows="4"
                            placeholder="What will students learn?"
                            value={description} onChange={(e) => setDescription(e.target.value)} required 
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Price ($)</label>
                        <input 
                            type="number" className="form-control rounded-3 p-3 border-0 bg-light" 
                            placeholder="49.99"
                            value={price} onChange={(e) => setPrice(e.target.value)} required 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-3 mt-2 shadow-lg fw-bold">
                        {isEditMode ? 'Update Course' : '🚀 Create Course'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;