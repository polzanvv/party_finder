import { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-700">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => {
            const date = new Date(b.bookingDateTime);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <li
                key={b._id}
                className="p-4 border rounded-2xl shadow flex flex-col md:flex-row justify-between items-start md:items-center bg-white"
              >
                <div className="mb-2 md:mb-0">
                  <p className="text-lg font-semibold text-indigo-700">{b.venueName}</p>
                  <p className="text-gray-600">
                    Date: {formattedDate} at {formattedTime}
                  </p>
                  {b.notes && (
                    <p className="text-sm text-gray-500">Notes: {b.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="mt-2 md:mt-0 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;