import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-purple-600">PartyFinder</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4"> {user.name}</span>
            <button onClick={logout} className="text-red-500 font-semibold">Logout</button>
          </>
        ) : (
          <Link to="/login" className="text-blue-500 font-semibold">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;