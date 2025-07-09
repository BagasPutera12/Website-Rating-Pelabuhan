// src/components/ShipRatingClient.jsx
"use client"; // <-- Ini sangat penting! Menandakan ini adalah Client Component.

import { useState } from 'react';
import axios from 'axios';

export default function ShipRatingClient({ shipId, initialRatings = [] }) {
  const [ratings, setRatings] = useState(initialRatings);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/ratings', {
        shipId,
        rating: newRating,
        comment: newComment,
      });

      // Tambahkan rating baru ke bagian atas daftar secara instan
      setRatings([response.data, ...ratings]);

      // Reset form
      setNewRating(5);
      setNewComment('');

    } catch (err) {
      setError('Gagal mengirim rating. Mohon coba lagi.');
      console.error("Gagal mengirim rating:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 pt-6 border-t">
      <h2 className="text-2xl font-bold text-primary-blue mb-4">Beri & Lihat Rating</h2>

      {/* Form untuk memberi rating */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="font-semibold text-lg mb-2">Beri Penilaian Anda</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating Bintang</label>
          <div className="flex space-x-1 text-3xl">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className={`transition ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-1">Komentar (Opsional)</label>
          <textarea
            id="comment"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Bagaimana pengalaman Anda dengan kapal ini?"
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-blue transition disabled:bg-gray-400"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Penilaian'}
        </button>
      </form>

      {/* Daftar History Penilaian */}
      <h3 className="font-semibold text-lg mb-4">Rating dari Pengguna Lain</h3>
      <div className="space-y-4">
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating._id} className="border-l-4 border-accent-gold pl-4 py-2 bg-gray-50 rounded">
              <p className="font-bold text-lg text-yellow-500">{'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}</p>
              {rating.comment && <p className="text-text-dark mt-1 italic">&ldquo;{rating.comment}&rdquo;</p>}
            </div>
          ))
        ) : (
          <p className="text-text-light">Belum ada penilaian untuk kapal ini. Jadilah yang pertama!</p>
        )}
      </div>
    </div>
  );
}