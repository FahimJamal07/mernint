import Sidebar from './Sidebar'; // <--- Importing the file you just made
import Navbar from './Navbar';   // <--- Importing the file you just made

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* 1. The Sidebar Component */}
      <Sidebar />

      {/* 2. The Main Content Area */}
      <div className="flex-grow-1 bg-light">
        {/* 3. The Navbar Component */}
        <Navbar />
        
        {/* 4. The Page Content (Dashboard, etc.) */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;