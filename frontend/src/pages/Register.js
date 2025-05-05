import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });

  const { name, email, phone, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/login');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits');
    } else {
      const userData = {
        name,
        email,
        phone,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center">
      <div className="card w-full max-w-md p-6 shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <FaUser className="text-blue-600 text-5xl" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        
        <form onSubmit={onSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-input w-full border p-2 rounded"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-input w-full border p-2 rounded"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input w-full border p-2 rounded"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-input w-full border p-2 rounded"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group mb-6">
            <label htmlFor="password2" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input w-full border p-2 rounded"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
