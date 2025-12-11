import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CourseList from './CourseList';

const MOCK_DB_COURSES = [
  { id: 1, title: "Full Stack Development", students: 45, capacity: 60 },
  { id: 2, title: "Data Structures", students: 60, capacity: 60 }, 
  { id: 3, title: "Cloud Computing", students: 12, capacity: 40 },
];

const Dashboard = () => {

  const [courses, setCourses] = useState([]); 
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      setTimeout(() => {
      setCourses(MOCK_DB_COURSES);
      setLoading(false);
    },1000)
    
    console.log("Component Mounted. Fetching data...");
  }, []);

  const handleEnroll = (courseId) => {
    console.log(`Attempting to enroll in course ID: ${courseId}`);
    const course = courses.find(c => c.id === courseId);
    if(enrolledCourses.includes(courseId)){
      alert("You have already enrolled for this course!!");
      return;
    }
    if(course.students<course.capacity){
      const updatedCourses = courses.map(c => c.id === courseId ? {...c, students: c.students + 1} : c);
      setCourses(updatedCourses);
      setEnrolledCourses([...enrolledCourses, courseId]);
      alert("Success! You are enrolled.");
    }
    else{
      alert("Class is full! Added to Waitlist (Mock).");
    }

  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="mb-4">Student Dashboard</h2>
      
      <div className="row">
        {/* LEFT COLUMN: Course Catalog */}
          <div className="col-md-8">
            <CourseList 
                courses={courses} 
                enrolledCourses={enrolledCourses} 
                onEnroll={handleEnroll} 
            />
          </div>
        
        {/* RIGHT COLUMN: My Schedule */}
        <div className="col-md-4">
            <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">My Schedule</h5>
                </div>
                <div className="card-body">
                    {enrolledCourses.length === 0 ? (
                        <p className="text-muted text-center my-3">No courses enrolled yet.</p>
                    ) : (
                        <ul className="list-group">
                            {enrolledCourses.map(id => {
                                const course = courses.find(c => c.id === id);
                                return <li key={id} className="list-group-item">{course?.title}</li>
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;