// src/lib/email-service.js (VERSI RESEND)

import { Resend } from 'resend';

// Inisialisasi Resend dengan API Key dari environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail(submissionData, allRatings) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY tidak diatur. Melewatkan pengiriman email.');
    return;
  }

  // Hitung rata-rata dari isian survei ini saja
  const sum = allRatings.reduce((total, r) => total + r.rating, 0);
  const overallAverage = (sum / allRatings.length).toFixed(2);

  // Membuat isi email dalam bentuk HTML
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Masukan Survei Baru Diterima</h2>
      <p>Pengguna <b>${submissionData.userName}</b> (${submissionData.userEmail}) telah mengirimkan survei.</p>
      <p><strong>Rata-rata Penilaian dari survei ini: ⭐ ${overallAverage} / 5.00</strong></p>
      <h3>Saran yang Diberikan:</h3>
      <p style="font-style: italic; border-left: 4px solid #ccc; padding-left: 15px;">
        ${submissionData.suggestion || 'Tidak ada saran yang diberikan.'}
      </p>
      <hr>
      <p>Rincian jawaban dapat dilihat di database.</p>
    </div>
  `;

  try {
    // Kirim email menggunakan Resend SDK
    await resend.emails.send({
      from: 'Website Pelabuhan <onboarding@resend.dev>', // Alamat pengirim default dari Resend untuk tes
      to: 'bagasanugrahcahyaningsih@gmail.com', // Email admin tujuan
      subject: `[Rating: ${overallAverage}] Survei Baru dari ${submissionData.userName}`,
      html: emailHtml,
    });
    console.log('Email notifikasi via Resend berhasil dikirim.');
  } catch (error) {
    console.error('Gagal mengirim email via Resend:', error);
  }
}