const CourseList = ({ courses, enrolledCourses, onEnroll }) => {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Available Courses</h5>
      </div>
      <ul className="list-group list-group-flush">
        {courses.map((course) => {
          const isFull = course.students >= course.capacity;
          const isEnrolled = enrolledCourses.includes(course.id);

          return (
            <li key={course.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="mb-1">{course.title}</h6>
                <small className={isFull ? 'text-danger' : 'text-muted'}>
                  Capacity: {course.students} / {course.capacity}
                </small>
              </div>

              <button
                className={`btn btn-sm ${
                  isEnrolled ? 'btn-secondary' : isFull ? 'btn-outline-danger' : 'btn-success'
                }`}
                onClick={() => onEnroll(course.id)}
                disabled={isEnrolled}
              >
                {isEnrolled ? 'Enrolled' : isFull ? 'Join Waitlist' : 'Enroll Now'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CourseList;