import { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch courses when the page loads
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses');
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}` // Admin Token needed!
                    }
                });

                if (response.ok) {
                    // Remove from UI immediately without refreshing
                    setCourses(courses.filter(course => course._id !== id));
                    alert('Course Deleted');
                } else {
                    alert('Failed to delete');
                }
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    return (
        <div className="container mt-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1>Course Dashboard</h1>
                <div className="d-flex align-items-center gap-3">
                    <span>Hello, {user.name}</span>
                    <button onClick={logoutUser} className="btn btn-outline-danger btn-sm">Logout</button>
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <p>Loading courses...</p>
            ) : courses.length === 0 ? (
                <div className="alert alert-info">No courses available yet.</div>
            ) : (
                <div className="row">
                    {courses.map((course) => (
                        <div key={course._id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                {/* If you added images, use course.image here */}
                                <div className="card-body">
                                    <h5 className="card-title">{course.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">${course.price}</h6>
                                    <p className="card-text">{course.description}</p>
                                </div>
                                <div className="card-footer bg-white border-top-0 d-flex gap-2">
                                  <button className="btn btn-primary flex-grow-1">Enroll Now</button>

                                  {user && user.role === 'admin' && (
                                    <div className="d-flex gap-2 w-100">
                                      <button 
                                          onClick={() => handleDelete(course._id)} 
                                          className="btn btn-danger"
                                      >
                                          Delete
                                      </button>
                                      <a href={`/admin/course-edit/${course._id}`} className="btn btn-warning btn-sm">
                                          Edit
                                      </a>
                                    </div>
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

export default Dashboard;