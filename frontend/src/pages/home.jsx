import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

        const allVenues = [
          ...(res.data.googlePlaces || []),
          ...(res.data.savedVenues || []),
        ];

        setVenues(allVenues);
      } catch (err) {
        setError('Error loading venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [coords, token]);

  const handleVenueClick = async (venue) => {
    if (!token) {
      navigate('/login', { state: { from: `/venue/${venue._id || venue.place_id}`, venue } });
      return;
    }

    if (!venue._id && venue.place_id) {
      try {
        const res = await axios.post('http://localhost:5000/api/venues', {
          googlePlaceId: venue.place_id,
          name: venue.name,
          location: venue.vicinity || venue.location,
          imageUrl: venue.photoUrl || '',
        });

        venue = res.data.venue;
      } catch (err) {
        console.error('Ошибка при сохранении venue:', err);
        return;
      }
    }

    navigate(`/venue/${venue._id}`, { state: { venue } });
  };

  const filteredVenues = venues
    .filter((v) => v.name.toLowerCase().includes(filterText.toLowerCase()))
    .filter((v) => (minRating ? v.rating >= parseFloat(minRating) : true))
    .filter((v) => (typeFilter ? v.types?.includes(typeFilter) : true));

  return (
    <div className="min-h-screen bg-[url('/public/images/bg-home.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6">
        {error && <p className="text-red-600 text-center text-lg">{error}</p>}
        {!error && !coords && <p className="text-center text-gray-700">Detecting your location...</p>}
        {loading && <p className="text-center text-gray-700">Loading venues...</p>}

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
            {[5, 4, 3, 2, 1].map((r) => (
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

        {!loading && !error && coords && filteredVenues.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredVenues.map((venue) => (
              <div
                key={venue._id || venue.place_id}
                onClick={() => handleVenueClick(venue)}
                className="bg-white rounded-xl shadow-md p-4 transition-transform hover:scale-105 cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-800">{venue.name}</h3>
                <p className="text-gray-600">{venue.location || venue.vicinity || venue.address}</p>
                {venue.rating && (
                  <p className="text-sm text-yellow-600">Rating: {venue.rating}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && coords && filteredVenues.length === 0 && (
          <p className="text-center text-gray-700">No venues available</p>
        )}
      </div>
    </div>
  );
};

export default Home;