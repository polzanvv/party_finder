import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [savedVenues, setSavedVenues] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleVenueClick = (venue) => {
    if (!token) {
      navigate('/login', { state: { from: `/venue/${venue._id || venue.place_id}`, venue } });
      return;
    }
    navigate(`/venue/${venue._id || venue.place_id}`, { state: { venue } });
  };

  // Filtering
  const [filterText, setFilterText] = useState('');
  const [minRating, setMinRating] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError('Error getting geolocation: ' + err.message);
      }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    const fetchVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get('http://localhost:5000/api/venues', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { lat: coords.lat, lng: coords.lng, radius: 7000 },
        });

        setGooglePlaces(res.data.googlePlaces || []);
        setSavedVenues(res.data.savedVenues || []);
      } catch (err) {
        setError('Error loading venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [coords, token]);

  // Filtering Google Places
  const filteredGooglePlaces = googlePlaces
    .filter(place =>
      place.name.toLowerCase().includes(filterText.toLowerCase())
    )
    .filter(place => (minRating ? place.rating >= parseFloat(minRating) : true))
    .filter(place => (typeFilter ? place.types?.includes(typeFilter) : true));

  // Filtering saved venues (only if authenticated)
  const filteredSavedVenues = savedVenues
    .filter(venue =>
      venue.name.toLowerCase().includes(filterText.toLowerCase())
    )
    .filter(venue => (minRating ? venue.rating >= parseFloat(minRating) : true))
    .filter(venue => (typeFilter ? venue.types?.includes(typeFilter) : true));

  return (
    <div className="min-h-screen bg-[url('/public/images/bg-home.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6">
        {error && <p className="text-red-600 text-center text-lg">{error}</p>}
        {!error && !coords && <p className="text-center text-gray-700">Detecting your location...</p>}
        {loading && <p className="text-center text-gray-700">Loading venues...</p>}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Search by name"
            className="flex-grow p-2 border rounded"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} and up</option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            <option value="gym">Gym</option>
            <option value="health">Health</option>
            <option value="museum">Museum</option>
            <option value="park">Park</option>
            <option value="restaurant">Restaurant</option>
            <option value="school">School</option>
          </select>
        </div>

        {!loading && !error && coords && (
          <>
            {/* Google Places - visible to all users */}
            {filteredGooglePlaces.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-rose-700 mb-4">Nearby Venues</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredGooglePlaces.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => handleVenueClick(place)}
                      className="bg-white rounded-xl shadow-md p-4 transition-transform hover:scale-105 cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">{place.name}</h3>
                      <p className="text-gray-600">{place.location || place.address || ''}</p>
                      {place.rating && <p className="text-sm text-yellow-600">Rating: {place.rating}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-700">No venues available</p>
            )}

            {/* Saved Venues - visible only to authenticated users */}
            {token && filteredSavedVenues.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Your Saved Venues</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredSavedVenues.map((venue) => (
                    <div
                      key={venue._id}
                      onClick={() => handleVenueClick(venue)}
                      className="bg-white rounded-xl shadow-md p-4 transition-transform hover:scale-105 cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">{venue.name}</h3>
                      <p className="text-gray-600">{venue.address}</p>
                      {venue.rating && <p className="text-sm text-yellow-600">Rating: {venue.rating}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;