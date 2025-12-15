import { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- NEW IMPORT

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    
    const [allCourses, setAllCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]); 
    const [refresh, setRefresh] = useState(false); 

    // Fetch logic remains the same...
    useEffect(() => {
        const fetchCourses = async () => {
            // NOTE: Use your Render URL here for production, or localhost for dev
            const baseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5000' 
                : 'https://cms-backend-podj.onrender.com';

            const res = await fetch(`${baseUrl}/api/courses`);
            const data = await res.json();
            setAllCourses(data);
        };
        fetchCourses();
    }, [refresh]);

    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!user) return;
            const baseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5000' 
                : 'https://cms-backend-podj.onrender.com';

            const res = await fetch(`${baseUrl}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            setMyCourses(data.enrolledCourses || []);
        };
        fetchMyProfile();
    }, [user, refresh]);

    const handleEnroll = async (courseId) => {
        if (!confirm("Confirm enrollment?")) return;
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://cms-backend-podj.onrender.com';
        try {
            const res = await fetch(`${baseUrl}/api/courses/${courseId}/enroll`, {
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

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this course?')) {
            const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://cms-backend-podj.onrender.com';
            await fetch(`${baseUrl}/api/courses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setRefresh(!refresh);
        }
    };

    // ANIMATION SETTINGS
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 } 
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="d-flex flex-column vh-100">
            {/* --- NAVBAR --- */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
                <span className="navbar-brand fw-bold text-white">🚀 DevAcademy</span>
                <div className="ms-auto d-flex gap-3 align-items-center">
                    <span className="text-white opacity-75">Welcome, {user.name}</span>
                    <button onClick={logoutUser} className="btn btn-danger btn-sm rounded-pill px-3">Logout</button>
                </div>
            </nav>

            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* --- SIDEBAR --- */}
                <aside className="bg-white p-4 border-end d-none d-md-block" style={{ width: '280px', minWidth: '280px' }}>
                    
                    {user && user.role === 'student' && (
                        <>
                            <h6 className="text-uppercase text-muted small fw-bold mb-3">My Learning</h6>
                            {myCourses.length === 0 ? (
                                <p className="text-muted small">You haven't enrolled in any courses yet.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {myCourses.map(course => (
                                        <motion.li 
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            key={course._id} 
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <span className="small fw-semibold">{course.title}</span>
                                            <span className="badge bg-success rounded-pill" style={{fontSize: '0.6rem'}}>Active</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                    
                    {user && user.role === 'admin' && (
                        <div className="mt-4">
                            <h6 className="text-uppercase text-muted small fw-bold mb-3">Admin Panel</h6>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/admin/course-create')} 
                                className="btn btn-primary w-100 shadow-sm"
                            >
                                + Create New Course
                            </motion.button>
                        </div>
                    )}
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-grow-1 p-5" style={{ overflowY: 'auto' }}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h2 className="fw-bold text-dark">Available Courses</h2>
                        <span className="text-muted">Explore our catalog</span>
                    </div>

                    {allCourses.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="alert alert-light text-center p-5 shadow-sm rounded-4"
                        >
                            <h4 className="text-muted">No courses available right now.</h4>
                        </motion.div>
                    ) : (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="row"
                        >
                            {allCourses.map((course) => {
                                const enrolledCount = course.studentsEnrolled?.length || 0;
                                const seatsLeft = (course.seats || 10) - enrolledCount;
                                const isEnrolled = myCourses.some(c => c._id === course._id);
                                const isFull = seatsLeft <= 0;

                                return (
                                    <motion.div 
                                        variants={itemVariants}
                                        key={course._id} 
                                        className="col-md-6 col-lg-4 mb-4"
                                    >
                                        <div className="card h-100 glass-card border-0">
                                            {/* Image Placeholder */}
                                            <div style={{ height: '150px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px 16px 0 0' }}></div>
                                            
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="card-title fw-bold">{course.title}</h5>
                                                    <span className="badge bg-light text-dark border">${course.price}</span>
                                                </div>
                                                <p className="text-muted small mb-3">{course.description}</p>
                                                
                                                <div className="d-flex align-items-center gap-2 mb-3">
                                                    <div className="progress flex-grow-1" style={{height: '6px'}}>
                                                        <div 
                                                            className={`progress-bar ${seatsLeft < 3 ? 'bg-danger' : 'bg-success'}`} 
                                                            style={{width: `${(enrolledCount / (course.seats || 10)) * 100}%`}}
                                                        ></div>
                                                    </div>
                                                    <span className="small text-muted" style={{fontSize: '0.75rem'}}>
                                                        {seatsLeft} left
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="card-footer bg-white border-top-0 p-3 pt-0">
                                                {user.role === 'admin' ? (
                                                    <div className="d-flex gap-2">
                                                        <button onClick={() => handleDelete(course._id)} className="btn btn-outline-danger flex-grow-1 btn-sm">Delete</button>
                                                        <button onClick={() => navigate(`/admin/course-edit/${course._id}`)} className="btn btn-outline-warning flex-grow-1 btn-sm">Edit</button>
                                                    </div>
                                                ) : (
                                                    isEnrolled ? (
                                                        <button disabled className="btn btn-light text-success w-100 fw-bold">✓ Enrolled</button>
                                                    ) : isFull ? (
                                                        <button disabled className="btn btn-secondary w-100">Sold Out</button>
                                                    ) : (
                                                        <button onClick={() => handleEnroll(course._id)} className="btn btn-primary w-100 shadow-sm">Enroll Now</button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;