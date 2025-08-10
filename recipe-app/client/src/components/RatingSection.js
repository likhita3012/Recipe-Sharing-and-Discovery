import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RatingSection.css";

const RatingSection = ({ recipeId, user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${recipeId}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [recipeId]);

  const submitReview = async () => {
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide both rating and comment.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/recipes/${recipeId}/reviews`, {
        rating,
        comment,
        userId: user._id,
      });
      setReviews([...reviews, res.data]);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="rating-section">
      <h2>Rate & Comment</h2>

      {/* Star Rating */}
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= (hoverRating || rating) ? "star filled" : "star"}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment Box */}
      <textarea
        className="comment-box"
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button className="submit-btn" onClick={submitReview}>
        Submit Review
      </button>

      {/* Reviews List */}
      <div className="reviews-list">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((rev, index) => (
            <div key={index} className="review-item">
              <div className="review-rating">
                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
              </div>
              <p>{rev.comment}</p>
              <small>- {rev.user?.name || "Anonymous"}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingSection;
