// src/lib/email-service.js
import nodemailer from 'nodemailer';

export async function sendNotificationEmail(submissionData, allRatings) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Variabel email tidak diatur, email tidak dikirim.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Menghitung rata-rata dari isian survei ini saja
  const sum = allRatings.reduce((total, r) => total + r.rating, 0);
  const overallAverage = (sum / allRatings.length).toFixed(2);

  // Membuat isi email dengan format HTML
  const indicatorRows = allRatings.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.indicator}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.rating}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Notifikasi Survei" <${process.env.EMAIL_USER}>`,
    to: 'bagasanugrahcahyaningsih@gmail.com',
    subject: `[Rating: ${overallAverage}] Survei Baru dari ${submissionData.userName}`,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
             <h2>Masukan Survei Baru Diterima</h2>
             <p>Pengguna <b>${submissionData.userName}</b> (${submissionData.userEmail}) telah mengirimkan survei.</p>
             <p><strong>Rata-rata Penilaian dari survei ini: ⭐ ${overallAverage} / 5.00</strong></p>
             <h3>Saran yang Diberikan:</h3>
             <p style="font-style: italic; border-left: 4px solid #ccc; padding-left: 15px;">
               ${submissionData.suggestion || 'Tidak ada saran yang diberikan.'}
             </p>
             <hr>
             <h3>Rincian Jawaban:</h3>
             <table style="width: 100%; border-collapse: collapse;">
               <thead style="background-color: #f2f2f2;">
                 <tr>
                   <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Indikator</th>
                   <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Rating</th>
                 </tr>
               </thead>
               <tbody>${indicatorRows}</tbody>
             </table>
           </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notifikasi berhasil dikirim.');
  } catch (error) {
    console.error('Gagal mengirim email notifikasi:', error);
  }
}