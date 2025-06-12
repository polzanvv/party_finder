import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-purple-600">PartyFinder</Link>
      <div>
        {user ? (
          <>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mr-4 text-purple-600 font-semibold hover:underline"
            >
              {user.name}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-red-500 font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" state={{ from: '/home' }} className="text-blue-500 font-semibold">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;