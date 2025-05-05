import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-4xl mx-auto">
      <section className="card mb-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h2 className="text-xl font-semibold mb-2">Welcome {user && user.name}!</h2>
          <p className="text-gray-700">You've successfully logged into your account.</p>
        </div>
      </section>
      
      <section className="card">
        <h3 className="text-2xl font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          <div>
            <span className="font-medium">Name:</span> 
            <span className="ml-2">{user && user.name}</span>
          </div>
          <div>
            <span className="font-medium">Email:</span> 
            <span className="ml-2">{user && user.email}</span>
          </div>
          <div>
            <span className="font-medium">Account created:</span> 
            <span className="ml-2">
              {user && new Date(user._id.substring(0, 8), 16).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;