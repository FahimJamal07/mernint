import { useState } from 'react';
import Layout from '../components/Layout'; 

const CourseForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState(''); 
    const [facultyId, setFacultyId] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); 
        setError(null);


        if (!title || capacity <= 0 || !facultyId) {
            setError("Please fill in the Course Title, Capacity (must be > 0), and assign a Faculty ID.");
            return; 
        }

        if (isNaN(capacity) || !Number.isInteger(Number(capacity))) {
            setError("Capacity must be a whole number.");
            return; 
        }
        
        const newCourseData = {
            title, description, capacity: Number(capacity), facultyId, students: 0, id: Date.now()
        };

        console.log("Mock Course Created Successfully:", newCourseData);
        alert(`SUCCESS: Course "${title}" created. (Check console for data)`);
        
        // Clear the form
        setTitle(''); setDescription(''); setCapacity(''); setFacultyId('');
    };

    return (
        <Layout>
            <h2 className="mb-4">Create New Course</h2>
            <div className="card shadow-sm p-4" style={{ maxWidth: '600px' }}>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    

                    <div className="mb-3">
                        <label className="form-label">Course Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g., Advanced React Hooks"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description (Optional)</label>
                        <textarea 
                            className="form-control" 
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Maximum Capacity</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Assigned Faculty ID</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="e.g., FAC001"
                            value={facultyId}
                            onChange={(e) => setFacultyId(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 mt-3">
                        Create Course
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default CourseForm;