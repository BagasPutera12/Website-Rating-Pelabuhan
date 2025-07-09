// src/app/survei-lengkap/page.js

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ASPECTS } from '@/data/surveyData';

const SurveyQuestion = ({ question, aspectName, onRatingChange, rating }) => (
  <div className="mb-4 p-4 border-b">
    <p>{question}</p>
    <div className="flex space-x-2 mt-2">
      {[1, 2, 3, 4, 5].map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onRatingChange(aspectName, question, v)}
          className={`w-10 h-10 rounded-full border transition ${rating === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
);

export default function FullSurveyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ userName: '', userEmail: '', suggestion: '' });
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (aspect, indicator, rating) => {
    setAnswers({ ...answers, [indicator]: { aspect, rating } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    const totalQuestions = ASPECTS.reduce((sum, aspect) => sum + aspect.indicators.length, 0);
    if (Object.keys(answers).length < totalQuestions) {
        alert("Mohon isi semua pertanyaan rating.");
        setStatus('idle');
        return;
    }

    const payload = {
      ...formData,
      ratings: Object.entries(answers).map(([indicator, value]) => ({ indicator, ...value })),
    };

    try {
      // Menggunakan path relatif karena ini adalah client component memanggil API route
      await axios.post('/api/full-surveys', payload);
      setStatus('success');
    } catch (error) {
      console.error("Gagal mengirim survei:", error);
      setStatus('error');
    }
  };

  if (status === 'loading') return <div className="text-center p-10"><h2>Mengirim survei...</h2></div>;
  if (status === 'success') {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-green-600">Terima Kasih!</h2>
        <p>Masukan Anda telah berhasil dikirimkan.</p>
        <button onClick={() => router.push('/')} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg">Kembali ke Home</button>
      </div>
    );
  }
  if (status === 'error') {
    return (
        <div className="text-center p-10">
            <h2 className="text-2xl font-bold text-red-600">Gagal Mengirim</h2>
            <p>Terjadi kesalahan. Silakan coba lagi.</p>
            <button onClick={() => setStatus('idle')} className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg">Coba Lagi</button>
        </div>
    );
  }
  
  return (
    <div>
      <header className="text-center mb-10 pb-5 border-b">
        <h1 className="text-4xl font-extrabold text-primary-blue">Survei Kepuasan Pelayanan</h1>
        <p className="text-lg text-text-light mt-2">Berikan masukan Anda untuk peningkatan kualitas Pelabuhan Teluk Bayur.</p>
        
        {/* --- BAGIAN BARU YANG DITAMBAHKAN --- */}
        <div className="mt-4 bg-gray-100 p-3 rounded-lg inline-block text-sm text-gray-600">
            <p><strong>Petunjuk Skala:</strong> 1 = Sangat Tidak Puas, 2 = Tidak Puas, 3 = Cukup Puas, 4 = Puas, 5 = Sangat Puas</p>
        </div>
        {/* --- AKHIR BAGIAN BARU --- */}
      </header>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Informasi Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="userName" className="block font-medium mb-1">Nama</label>
              <input type="text" name="userName" id="userName" value={formData.userName} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label htmlFor="userEmail" className="block font-medium mb-1">Email</label>
              <input type="email" name="userEmail" id="userEmail" value={formData.userEmail} onChange={handleInputChange} required className="w-full p-2 border rounded"/>
            </div>
          </div>
        </div>

        {ASPECTS.map(aspect => (
          <div key={aspect.name} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">{aspect.name}</h2>
            {aspect.indicators.map(indicator => (
              <SurveyQuestion 
                key={indicator}
                question={indicator}
                aspectName={aspect.name}
                onRatingChange={handleRatingChange}
                rating={answers[indicator]?.rating}
              />
            ))}
          </div>
        ))}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Saran dan Masukan (Opsional)</h2>
          <textarea name="suggestion" value={formData.suggestion} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded"></textarea>
        </div>
        
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition">
          Kirim Survei
        </button>
      </form>
    </div>
  );
}