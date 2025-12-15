import { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    
    // State
    const [allCourses, setAllCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]); 
    const [refresh, setRefresh] = useState(false); 

    // 1. Fetch All Courses
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await fetch('https://cms-backend-podj.onrender.com/api/courses');
            const data = await res.json();
            setAllCourses(data);
        };
        fetchCourses();
    }, [refresh]);

    // 2. Fetch My Profile (Sidebar)
    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!user) return;
            const res = await fetch('https://cms-backend-podj.onrender.com/api/auth/me', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setMyCourses(data.enrolledCourses || []);
        };
        fetchMyProfile();
    }, [user, refresh]);

    // 3. Handle Enroll (Student)
    const handleEnroll = async (courseId) => {
        if (!confirm("Confirm enrollment?")) return;
        try {
            const res = await fetch(`https://cms-backend-podj.onrender.com/api/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                alert("✅ " + data.message);
                setRefresh(!refresh); 
            } else {
                alert("❌ " + data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 4. Handle Delete (Admin) - RESTORED
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await fetch(`https://cms-backend-podj.onrender.com/api/courses/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    setRefresh(!refresh); // Refresh list
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
        <div className="d-flex flex-column vh-100">
            {/* --- NAVBAR --- */}
            <nav className="navbar navbar-dark bg-dark px-4">
                <span className="navbar-brand">🚀 DevAcademy</span>
                <div className="d-flex gap-3 align-items-center">
                    <span className="text-white">Welcome, {user.name} ({user.role})</span>
                    <button onClick={logoutUser} className="btn btn-danger btn-sm">Logout</button>
                </div>
            </nav>

            <div className="d-flex flex-grow-1">
                {/* --- SIDEBAR --- */}
                <aside className="bg-light p-3 border-end" style={{ width: '280px', minWidth: '280px' }}>
                    
                    {/* ONLY SHOW "MY LEARNING" IF USER IS A STUDENT */}
                    {user && user.role === 'student' && (
                        <>
                            <h5 className="mb-4">🎓 My Learning</h5>
                            
                            {myCourses.length === 0 ? (
                                <p className="text-muted small">No courses enrolled yet.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {myCourses.map(course => (
                                        <li key={course._id} className="list-group-item bg-transparent">
                                            <strong>{course.title}</strong>
                                            <br/>
                                            <span className="badge bg-success">Enrolled</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                    
                    {/* KEEP ADMIN CONTROLS VISIBLE ONLY FOR ADMINS */}
                    {user && user.role === 'admin' && (
                        <div className=" border-top">
                            <h5 classname="mb-4">Admin Controls</h5><br></br>
                            <button onClick={() => navigate('/admin/course-create')} className="btn btn-primary w-100 btn-sm">
                                + Create New Course
                            </button>
                        </div>
                    )}
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                    <h2 className="mb-4">Available Courses</h2>

                    {/* CHECK IF COURSES EXIST */}
                    {allCourses.length === 0 ? (
                        // SCENARIO 1: NO COURSES
                        <div className="alert alert-info text-center p-5">
                            <h4>No courses available right now.</h4>
                            <p className="mb-0">Please check back later for new content!</p>
                        </div>
                    ) : (
                        // SCENARIO 2: SHOW COURSE GRID
                        <div className="row">
                            {allCourses.map((course) => {
                                const enrolledCount = course.studentsEnrolled?.length || 0;
                                const seatsLeft = (course.seats || 10) - enrolledCount;
                                const isEnrolled = myCourses.some(c => c._id === course._id);
                                const isFull = seatsLeft <= 0;

                                return (
                                    <div key={course._id} className="col-md-6 col-lg-4 mb-4">
                                        <div className="card h-100 shadow-sm border-0">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="card-title">{course.title}</h5>
                                                    <span className="badge bg-secondary p-2">${course.price}</span>
                                                </div>
                                                <p className="text-muted small mt-2">{course.description}</p>
                                                <div className="alert alert-light border p-2 small">
                                                    <strong>Seats:</strong> {seatsLeft} / {course.seats || 10} available
                                                </div>
                                            </div>

                                            <div className="card-footer bg-white border-top-0">
                                                {user.role === 'admin' ? (
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            onClick={() => handleDelete(course._id)} 
                                                            className="btn btn-danger flex-grow-1"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button 
                                                            onClick={() => navigate(`/admin/course-edit/${course._id}`)} 
                                                            className="btn btn-warning flex-grow-1"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                ) : (
                                                    isEnrolled ? (
                                                        <button disabled className="btn btn-success w-100">Already Enrolled</button>
                                                    ) : isFull ? (
                                                        <button disabled className="btn btn-secondary w-100">Class Full</button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleEnroll(course._id)} 
                                                            className="btn btn-primary w-100"
                                                        >
                                                            Enroll Now
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;