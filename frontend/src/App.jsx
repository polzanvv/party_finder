import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Landing from './pages/landing';
import Home from './pages/home';
import Register from './components/register';
import Login from './pages/login';
import ProtectedRoute from './components/protectedRoute';
import VenueDetails from './pages/venueDetails';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/venue/:id" element={ <ProtectedRoute> <VenueDetails /> </ProtectedRoute>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;