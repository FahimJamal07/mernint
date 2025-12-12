import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="mb-4">CMS Admin</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/dashboard" className="nav-link text-white">
            Dashboard
          </Link>
        </li>
        {/* We can add more links here later easily */}
        <li className="nav-item mb-2">
           <span className="nav-link text-white-50 disabled">Profile (Coming Soon)</span>
        </li>
        <li className="nav-item mt-5">
          <Link to="/" className="nav-link text-danger">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;