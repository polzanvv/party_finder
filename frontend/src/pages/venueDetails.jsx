import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VenueDetails = () => {
  const { state } = useLocation();
  const venueFromState = state?.venue;
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(venueFromState);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!venueFromState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!venueFromState && id) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/venues/${id}`)
        .then(res => {
          setVenue(res.data.venue);
          setReviews(res.data.reviews);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load venue data');
          setLoading(false);
        });
    } else if (venueFromState) {
      setReviews(venueFromState.reviews || []);
    }
  }, [id, venueFromState]);

  if (loading) return <p className="text-center mt-20 text-xl">Loading venue details...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!venue) return <p className="text-center mt-20">No venue data available</p>;

  return (
    <div className="min-h-screen bg-[url('/public/images/bg-venue.jpg')] bg-cover bg-center bg-no-repeat p-6">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-12 space-y-8">
        <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline text-lg font-medium">
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-extrabold">{venue.name}</h1>
            <p className="text-gray-700">{venue.address || venue.location}</p>
            <p className="text-yellow-500 font-semibold">Rating: {venue.rating ?? 'N/A'}</p>
          </div>

          {venue.image && (
            <img src={venue.image} alt={venue.name} className="w-full md:w-80 h-60 object-cover rounded-2xl shadow-md" />
          )}
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review, idx) => (
                <li key={idx} className="bg-indigo-100 p-4 rounded-xl shadow-sm">
                  <p className="font-semibold">{review.author}</p>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-indigo-400">No reviews yet.</p>
          )}
        </section>

        <div>
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${venue.place_id || venue._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-lg font-medium"
          >
            View on Google Maps
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => alert('Booking feature coming soon!')}
            className="w-full md:w-48 h-14 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition"
          >
            Book Now
          </button>
            <button
              onClick={() => alert('Feature to leave a review coming soon!')}
              className="w-full md:w-48 h-14 bg-gray-600 text-white font-semibold rounded-2xl hover:bg-gray-700 transition"
            >
              Leave Review
            </button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
