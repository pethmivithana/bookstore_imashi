import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center mb-6 py-4 border-b">
      <div>
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Welcome
        </Link>
      </div>
      <ul className="flex space-x-4">
        {user ? (
          <li>
            <button
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              onClick={onLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <FaUser />
                <span>Register</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;