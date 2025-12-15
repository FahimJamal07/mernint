const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <span className="navbar-brand mb-0 h1">Student Portal</span>
      <div className="d-flex align-items-center">
         <span className="me-2">Welcome, Student</span>
         <div className="rounded-circle bg-secondary" style={{width: '35px', height: '35px'}}></div>
      </div>
    </nav>
  );
};

export default Navbar;