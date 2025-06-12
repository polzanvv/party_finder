import React, { useEffect } from "react";

const BookingModal = ({ bookingData, venue, setBookingData, onSubmit, onCancel }) => {
  useEffect(() => {
    console.log("BookingModal venue prop:", venue);
  }, [venue]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-[90%] max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Book This Venue</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border p-2 rounded"
            value={bookingData.name}
            onChange={(e) =>
              setBookingData({ ...bookingData, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={bookingData.email}
            onChange={(e) =>
              setBookingData({ ...bookingData, email: e.target.value })
            }
            required
          />
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={bookingData.date}
            onChange={(e) =>
              setBookingData({ ...bookingData, date: e.target.value })
            }
            required
          />
          <input
            type="time"
            className="w-full border p-2 rounded"
            value={bookingData.time}
            onChange={(e) =>
              setBookingData({ ...bookingData, time: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Notes (optional)"
            className="w-full border p-2 rounded"
            value={bookingData.notes}
            onChange={(e) =>
              setBookingData({ ...bookingData, notes: e.target.value })
            }
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
