import Sidebar from './Sidebar'; 
import Navbar from './Navbar';   

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 bg-light">
        <Navbar />
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;