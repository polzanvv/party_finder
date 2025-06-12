import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import BookingModal from "../components/bookingModal";
import ReviewModal from "../components/reviewModal";

const API_URL = process.env.REACT_APP_API_URL;

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingVenue, setLoadingVenue] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoadingVenue(true);

        const mongoRes = await axios.get(
          `${API_URL}/venues/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVenue(mongoRes.data);
      } catch (err) {
        try {
          const token = localStorage.getItem("token");

          const googleRes = await axios.get(
            `${API_URL}/google-venues/${id}`
          );

          const saveRes = await axios.post(
            `${API_URL}/venues/save`,
            { venueFromGoogle: googleRes.data },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const savedVenue = saveRes.data;
          setVenue(savedVenue);

          navigate(`/venue/${savedVenue._id}`, { replace: true });
        } catch (err) {
          console.error("Failed to load venue", err);
          setError("Failed to load venue");
        }
      } finally {
        setLoadingVenue(false);
      }
    };

    loadVenue();
  }, [id, navigate]);

  useEffect(() => {
    const venueId =
      venue?.venue?.id || venue?.venue?._id || venue?.id || venue?._id;
    if (!venueId) return;

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await axios.get(
          `${API_URL}/reviews/${venueId}`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Review load error", err);
        setError("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [venue]);

  const handleReviewSubmitted = (newReview, newAverageRating) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const { name, email, date, time, notes } = bookingData;

    if (!name || !email || !date || !time) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const venueId = venue?.venue?._id;

      await axios.post(
        `${API_URL}/bookings`,
        {
          venueId,
          name,
          email,
          date,
          time,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsBookingOpen(false);
      setBookingData({
        name: "",
        email: "",
        date: "",
        time: "",
        notes: "",
      });
      alert("Booking successful!");
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response) {
        console.error("Server error response:", err.response.data);
        alert(`Booking failed: ${err.response.data.message}`);
      } else {
        alert("Booking failed: Network or server issue");
      }
    }
  };

  const handleCancelBooking = () => {
    setIsBookingOpen(false);
    setBookingData({
      name: "",
      email: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  if (loadingVenue)
    return (
      <p className="text-center mt-20 text-xl text-gray-500 animate-pulse">
        Loading venue details...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">{error}</p>
    );

  if (!venue)
    return (
      <p className="text-center mt-20 text-gray-600">No venue data available</p>
    );

  return (
    <div className="min-h-screen bg-[url('/public/images/bg-venue.jpg')] bg-cover bg-center bg-no-repeat p-6">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:p-12 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:underline text-lg font-medium"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {venue.venue.name}
            </h1>
            <p className="text-gray-700">{venue.address}</p>
            <p className="text-yellow-500 font-semibold">
              Rating:{" "}
              {venue.averageRating ? venue.averageRating.toFixed(1) : "N/A"}
            </p>
          </div>

          {venue.imageUrl && (
            <img
              src={venue.imageUrl}
              alt={venue.name}
              className="w-full md:w-80 h-60 object-cover rounded-2xl shadow-md"
            />
          )}
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reviews</h2>
          {loadingReviews ? (
            <p className="text-gray-500 animate-pulse">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review._id}
                  className="bg-indigo-100 p-4 rounded-xl shadow-sm"
                >
                  <p className="font-semibold text-gray-900">
                    {review.userId?.name || "Unknown"}
                  </p>
                  <p className="text-yellow-600">Rating: {review.rating}</p>
                  <p className="text-gray-800">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-indigo-400">No reviews yet.</p>
          )}
        </section>

        {venue?.venue?.googlePlaceId && (
          <div>
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${venue.venue.googlePlaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-lg font-medium"
            >
              View on Google Maps
            </a>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-full md:w-48 h-14 font-semibold rounded-2xl transition bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Book Now
          </button>

          <button
            onClick={() => setIsReviewOpen(true)}
            className="w-full md:w-48 h-14 font-semibold rounded-2xl transition bg-gray-600 text-white hover:bg-gray-700"
          >
            Leave Review
          </button>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          bookingData={bookingData}
          venue={venue.venue}
          setBookingData={setBookingData}
          onSubmit={handleBookingSubmit}
          onCancel={handleCancelBooking}
        />
      )}

      {isReviewOpen && (
        <ReviewModal
          isOpen={isReviewOpen}
          venue={venue.venue}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </div>
  );
};

export default VenueDetails;
