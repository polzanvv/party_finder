import React, { useState } from "react";
import axios from "axios";

const ReviewModal = ({ isOpen, venue, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          venueId: venue?._id,
          rating,
          comment: comment.trim() || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { review, averageRating } = response.data;

      onReviewSubmitted(review, averageRating);
      onClose();
      setRating(0);
      setComment("");
      setError("");
    } catch (err) {
      console.error("Review submission error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
          Leave a Review
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
          >
            Rating
          </label>
          <select
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              borderRadius: "6px",
              border: "1.5px solid #ccc",
              fontSize: "1rem",
            }}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            <option value={0}>Select rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <label
            style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
          >
            Comment
          </label>
          <textarea
            placeholder="Write your review here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              borderRadius: "6px",
              border: "1.5px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
              minHeight: "100px",
            }}
          />

          {error && (
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#888",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
