import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to User Management</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        A simple application for managing user authentication with secure login and registration
      </p>
      
      {user ? (
        <div className="mt-8">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Link to="/login" className="btn btn-primary px-8">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary px-8">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;